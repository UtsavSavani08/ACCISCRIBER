import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from supabase import create_client, Client
from uuid import uuid4
from handlers.process_audio import AudioProcessor
from handlers.process_video import VideoProcessor
from dotenv import load_dotenv
from typing import Dict
import logging
from fastapi import BackgroundTasks

# Load environment variables
load_dotenv()

# Set up logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize router and processor
router = APIRouter()
processor = VideoProcessor()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKET = "transcriptions"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

TEMP_DIR = "temp_uploads"
def cleanup_temp_dir():
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
        logger.info("[VideoAPI] Entire temp_uploads directory cleaned up.")


@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    duration: int = Form(...),  # duration in minutes
    background_tasks: BackgroundTasks = BackgroundTasks()
) -> Dict:
    file_id = str(uuid4())
    file_ext = file.filename.split(".")[-1].lower()
    local_filename = f"{file_id}.{file_ext}"
    upload_dir = "temp_uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, local_filename)

    try:
        # --- Check user credits before processing ---
        user_data = supabase.table("user_credits").select("*").eq("id", user_id).single().execute()
        current_credits = user_data.data["credits_remaining"]

        if duration > current_credits:
            logger.warning(f"User {user_id} has insufficient credits: {current_credits} needed: {duration}")
            return JSONResponse(
                status_code=402,
                content={
                    "status": "error",
                    "message": f"Insufficient credits. You have {current_credits}, but {duration} are required."
                }
            )
        # 1. Save uploaded audio file
        with open(file_path, "wb") as f:
            f.write(await file.read())
        logger.info(f"[AudioAPI] Saved uploaded file at {file_path}")

        # 2. Process file (transcription and SRT generation)
        result = await processor.process_file(file_path, upload_dir)
        if result["status"] == "error":
            raise Exception(result["error"])
        logger.info(f"[AudioAPI] Audio processed successfully: {result['data']}")

        # 3. Upload files to Supabase Storage
        storage_path = f"{user_id}/{file_id}"
        audio_ext = result["data"]["audio_path"].split('.')[-1]
        audio_storage_path = f"{storage_path}.{audio_ext}"
        srt_storage_path = f"{storage_path}.srt"

        # Upload audio
        with open(result["data"]["audio_path"], "rb") as f:
            supabase.storage.from_(SUPABASE_BUCKET).upload(audio_storage_path, f)
        logger.info(f"[AudioAPI] Uploaded audio to {audio_storage_path}")

        # Upload SRT
        with open(result["data"]["srt_path"], "rb") as f:
            supabase.storage.from_(SUPABASE_BUCKET).upload(srt_storage_path, f)
        logger.info(f"[AudioAPI] Uploaded SRT to {srt_storage_path}")

        # 4. Get public URLs
        audio_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(audio_storage_path)
        srt_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(srt_storage_path)

        # 5. Store metadata in Supabase DB
        upload_record = {
            "user_id": user_id,
            "file_id": file_id,
            "filename": file.filename,
            "type": "video",
            "audio_url": audio_url,
            "video_url": None,
            "srt_url": srt_url,
            "duration": result["data"].get("duration"),
            "word_count": result["data"].get("word_count"),
            "language": result["data"].get("detected_language"),
        }
       
        logger.info(f"[AudioAPI] Inserting metadata into DB: {upload_record}")  

        supabase.table("uploads").insert(upload_record).execute()
        logger.info(f"[AudioAPI] Metadata inserted to DB: {upload_record}")

        user_data = supabase.table("user_credits").select("*").eq("id", user_id).single().execute()
        current_credits = user_data.data["credits_remaining"]

        new_credits = current_credits - duration
        supabase.table("user_credits").update({"credits_remaining": new_credits}).eq("id", user_id).execute()

        supabase.table("usage_logs").insert({
        "user_id": user_id,
        "description": f"Processed {duration} min file"
        }).execute()

        # 6. Schedule cleanup
        background_tasks.add_task(os.remove, file_path)
        background_tasks.add_task(os.remove, result["data"]["srt_path"])
        background_tasks.add_task(os.remove, result["data"]["audio_path"])
        background_tasks.add_task(os.remove, result["data"]["json_path"])
        logger.info(f"[AudioAPI] Scheduled cleanup for temp files")

        return JSONResponse(status_code=200, content={
            "status": "success",
            "message": "File processed and uploaded successfully",
            "data": upload_record
        })

    except Exception as e:
        logger.error(f"[AudioAPI] Exception during transcription: {str(e)}", exc_info=True)
        if os.path.exists(file_path):
            background_tasks.add_task(os.remove, file_path)
            logger.info(f"[AudioAPI] Cleaned up file after exception: {file_path}")
        raise HTTPException(status_code=500, detail=str(e))
