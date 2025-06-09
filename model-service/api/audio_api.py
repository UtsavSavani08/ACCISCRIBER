import os
import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from supabase import create_client, Client
from uuid import uuid4
from handlers.process_audio import AudioProcessor
from typing import Dict
from dotenv import load_dotenv
from fastapi import BackgroundTasks

load_dotenv()

router = APIRouter()
processor = AudioProcessor()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler("transcription.log"),  # logs to a file
        logging.StreamHandler()  # logs to console
    ]
)
logger = logging.getLogger(__name__)

# Supabase config
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKET = "transcriptions"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    duration: int = Form(...),  # duration in minutes
    background_tasks: BackgroundTasks = BackgroundTasks()
) -> Dict:
    file_path = None  # define here for cleanup in except block
    try:
        logger.info(f"Received transcription request from user: {user_id} with file: {file.filename}")
        
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

        # 1. Save uploaded file locally
        file_ext = file.filename.split(".")[-1].lower()
        file_id = str(uuid4())
        local_filename = f"{file_id}.{file_ext}"
        upload_dir = "temp_uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, local_filename)

        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        logger.info(f"File saved locally at {file_path}")

        # 2. Process the file (transcribe + generate SRT)
        result = await processor.process_file(file_path, upload_dir)
        logger.info(f"Processing result: {result}")

        if result["status"] == "error":
            logger.error(f"Processing error: {result['error']}")
            raise Exception(result["error"])

        # 3. Upload files to Supabase Storage
        storage_path = f"{user_id}/{file_id}"
        audio_storage_path = f"{storage_path}.{file_ext}"
        srt_storage_path = f"{storage_path}.srt"

        with open(file_path, "rb") as f:
            upload_resp_audio = supabase.storage.from_(SUPABASE_BUCKET).upload(audio_storage_path, f)
        logger.info(f"Audio file uploaded to Supabase at {audio_storage_path}")

        with open(result["data"]["srt_path"], "rb") as f:
            upload_resp_srt = supabase.storage.from_(SUPABASE_BUCKET).upload(srt_storage_path, f)
        logger.info(f"SRT file uploaded to Supabase at {srt_storage_path}")

        # 4. Get public URLs
        audio_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(audio_storage_path)
        srt_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(srt_storage_path)
        logger.info(f"Obtained public URLs - Audio: {audio_url}, SRT: {srt_url}")

        # 5. Store metadata in Supabase DB
        upload_record = {
            "user_id": user_id,
            "file_id": file_id,
            "filename": file.filename,
            "type": "audio",
            "audio_url": audio_url,
            "srt_url": srt_url,
            "duration": result["data"]["duration"],
            "word_count": result["data"]["word_count"],
            "language": result["data"].get("language")
        }

        db_resp = supabase.table("uploads").insert(upload_record).execute()
        logger.info(f"Metadata inserted in DB: {db_resp}")

        user_data = supabase.table("user_credits").select("*").eq("id", user_id).single().execute()
        current_credits = user_data.data["credits_remaining"]

        new_credits = current_credits - duration
        supabase.table("user_credits").update({"credits_remaining": new_credits}).eq("id", user_id).execute()

        supabase.table("usage_logs").insert({
        "user_id": user_id,
        "description": f"Processed {duration} min file"
        }).execute()

        # 6. Clean up temporary files
        background_tasks.add_task(os.remove, file_path)
        background_tasks.add_task(os.remove, result["data"]["srt_path"])
        background_tasks.add_task(os.remove, result["data"]["json_path"])
        logger.info(f"Scheduled cleanup for {file_path} and {result['data']['srt_path']}")

        return JSONResponse(status_code=200, content={
            "status": "success",
            "message": "File processed and uploaded successfully",
            "data": upload_record
        })

    except Exception as e:
        logger.exception(f"Exception during transcription: {e}")
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Cleaned up file after exception: {file_path}")
        raise HTTPException(status_code=500, detail=str(e))
