from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.audio_api import router as audio_router
from api.video_api import router as video_router
from fastapi.responses import FileResponse
from fastapi import HTTPException
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow Express server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audio_router, prefix="/analyze/audio", tags=["Audio"])
app.include_router(video_router, prefix="/analyze/video", tags=["Video"])

@app.get("/download/srt/{filename}")
def download_srt(filename: str):
    audio_srt = os.path.join("output/audio", filename)
    video_srt = os.path.join("output/video", filename)

    if os.path.exists(audio_srt):
        return FileResponse(path=audio_srt, media_type="application/x-subrip", filename=filename)

    if os.path.exists(video_srt):
        return FileResponse(path=video_srt, media_type="application/x-subrip", filename=filename)

    raise HTTPException(status_code=404, detail="SRT file not found")

# main.py
# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# def root():
#     return {"message": "Hello from FastAPI"}