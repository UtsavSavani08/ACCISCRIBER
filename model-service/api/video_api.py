# from fastapi import APIRouter, UploadFile, File, BackgroundTasks
# from handlers.process_video import VideoProcessor
# import os
# from typing import Dict
# import shutil

# router = APIRouter()
# processor = VideoProcessor()

# @router.post("/transcribe")
# async def transcribe_video(
#     file: UploadFile = File(...),
#     background_tasks: BackgroundTasks = None
# ) -> Dict:
#     # Create temporary directories for processing
#     temp_dir = "temp_uploads"
#     output_dir = "output"
#     os.makedirs(temp_dir, exist_ok=True)
#     os.makedirs(output_dir, exist_ok=True)

#     # Save uploaded file
#     file_path = os.path.join(temp_dir, file.filename)
#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     # Process the file
#     result = await processor.process_file(file_path, output_dir)

#     # Clean up temporary file
#     background_tasks.add_task(os.remove, file_path)

#     return result
from fastapi import APIRouter, UploadFile, File, BackgroundTasks
from handlers.process_video import VideoProcessor
from fastapi.responses import JSONResponse
import os
from typing import Dict
import shutil

router = APIRouter()
processor = VideoProcessor()

@router.post("/transcribe")
async def transcribe_video(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
) -> Dict:
    print(f"Received video file: {file.filename}") # Add logging
    temp_dir = "temp_uploads"
    output_dir = "output/video"
    os.makedirs(temp_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)

    file_path = os.path.join(temp_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = await processor.process_file(file_path, output_dir)
    print(f"Processing result: {result}") # Add logging

    background_tasks.add_task(os.remove, file_path)

    if result["status"] == "error":
        return JSONResponse(status_code=500, content={"message": result["error"]})

    return result
