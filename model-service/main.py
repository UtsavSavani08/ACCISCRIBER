from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from api.audio_api import router as audio_router
from api.video_api import router as video_router
from api.stats_api import router as stats_router
from api.livetranscribe_api import router as livetranscribe_router
from api.stripe_checkout_api import router as stripe_checkout_router
from api.stripe_webhook_api import router as stripe_webhook_router


import os

app = FastAPI(
    title="Media Transcription Service",
    description="Handles audio/video upload, transcription, and SRT download.",
    version="1.0.0"
)

# Allow CORS from any frontend (adjust as needed for security)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(audio_router, prefix="/analyze/audio", tags=["Audio"])
app.include_router(video_router, prefix="/analyze/video", tags=["Video"])
app.include_router(stats_router, prefix="/api", tags=["Stats"])
app.include_router(livetranscribe_router, prefix="/analyze", tags=["Live Transcription"])
app.include_router(stripe_checkout_router)
app.include_router(stripe_webhook_router)

from fastapi.responses import StreamingResponse
import requests
from fastapi import Request, Query

@app.get("/download/srt")
def proxy_srt_download(srt_url: str = Query(...)):
    """
    Downloads an SRT file from a Supabase public URL and serves it to the user.
    """
    try:
        response = requests.get(srt_url, stream=True)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="SRT not found at URL")
        
        filename = srt_url.split("/")[-1]

        return StreamingResponse(
            response.iter_content(chunk_size=1024),
            media_type="application/x-subrip",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/octet-stream"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading SRT: {str(e)}")



# main.py
# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# def root():
#     return {"message": "Hello from FastAPI"}