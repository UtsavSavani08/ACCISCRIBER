import pyaudio
import numpy as np
from fastapi import APIRouter, Query, Request, WebSocket
from fastapi.responses import StreamingResponse
from faster_whisper import WhisperModel
import logging
import ffmpeg
from starlette.websockets import WebSocketDisconnect
from .audio_api import supabase

router = APIRouter()

CHUNK_SIZE = 16000 * 5
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
model_size = "small"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def audio_stream(language="en"):
    logger.info("audio_stream started")
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK_SIZE)
    try:
        logger.info("Loading Whisper model...")
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        logger.info("Whisper model loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load Whisper model: {e}")
        yield f"data: Error: Failed to load Whisper model: {str(e)}\n\n"
        stream.stop_stream()
        stream.close()
        p.terminate()
        return

    total_audio_seconds = 0.0

    try:
        while True:
            data = stream.read(CHUNK_SIZE, exception_on_overflow=False)
            numpy_data = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0
            segments, info = model.transcribe(numpy_data, beam_size=5, language=language)
            for segment in segments:
                start_time = segment.start + total_audio_seconds
                end_time = segment.end + total_audio_seconds
                text = f"[{start_time:.2f}s -> {end_time:.2f}s] {segment.text}"
                yield f"data: {text}\n\n"
            total_audio_seconds += CHUNK_SIZE / RATE
    except GeneratorExit:
        logger.info("Client disconnected, cleaning up audio stream.")
    except Exception as e:
        logger.error(f"Error during transcription: {e}")
        yield f"data: Error: {str(e)}\n\n"
    finally:
        logger.info("audio_stream cleanup (finally block)")
        stream.stop_stream()
        stream.close()
        p.terminate()

def decode_audio_bytes(audio_bytes):
    try:
        out, _ = (
            ffmpeg
            .input('pipe:0')
            .output('pipe:1', format='f32le', acodec='pcm_f32le', ac=1, ar='16k')
            .run(input=audio_bytes, capture_stdout=True, capture_stderr=True)
        )
        audio = np.frombuffer(out, np.float32)
        return audio
    except Exception as e:
        logger.error(f"Audio decoding error: {e}")
        return None

@router.get("/livetranscribe")
def livetranscribe(request: Request, language: str = Query("en", description="Language code (e.g., 'en', 'hi', 'fr')")):
    """
    Streams live microphone transcription as Server-Sent Events (SSE).
    """
    return StreamingResponse(audio_stream(language), media_type="text/event-stream")

@router.websocket("/ws/transcribe")
async def websocket_transcribe(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket connection accepted")
    user_id = None
    credits = 0
    current_time = 0.0
    try:
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        logger.info("Whisper model loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load Whisper model: {e}")
        await websocket.send_json({"error": "Failed to load Whisper model"})
        await websocket.close()
        return

    try:
        # 1. Receive language selection
        lang_msg = await websocket.receive_text()
        logger.info(f"Backend: Received language selection: {lang_msg}")
        language = lang_msg if lang_msg else "en"

        # 2. Receive user_id as the next message
        user_id = await websocket.receive_text()
        logger.info(f"Backend: Received user_id: {user_id}")

        # 3. Fetch user credits
        user_data = supabase.table("user_credits").select("*").eq("id", user_id).single().execute()
        credits = user_data.data["credits_remaining"]
        max_seconds = credits * 60  # 1 credit = 1 minute

        current_time = 0.0  # Track running audio time

        while True:
            audio_bytes = await websocket.receive_bytes()
            logger.info(f"Backend: Received audio chunk of size {len(audio_bytes)} bytes")
            audio = decode_audio_bytes(audio_bytes)
            if audio is None:
                await websocket.send_json({"error": "Could not decode audio."})
                continue

            # Calculate chunk duration (in seconds)
            chunk_duration = len(audio) / 16000  # 16kHz sample rate

            # Check if processing this chunk would exceed credits
            if current_time + chunk_duration > max_seconds:
                await websocket.send_json({
                    "error": f"Credit limit reached. You have {credits} minutes."
                })
                logger.warning(f"User {user_id} exceeded credit limit. Closing connection.")
                break

            # Transcribe as usual
            segments, info = model.transcribe(audio, beam_size=5, language=language)
            results = []
            for segment in segments:
                seg_start = float(segment.start) + current_time
                seg_end = float(segment.end) + current_time

                # Check if segment start or end exceeds credits
                if seg_start > max_seconds or seg_end > max_seconds:
                    await websocket.send_json({
                        "error": f"Credit limit reached during segment. You have {credits} minutes."
                    })
                    logger.warning(f"User {user_id} exceeded credit limit during segment. Closing connection.")
                    break

                logger.info(f"Backend: Segment: start={seg_start}, end={seg_end}, text={segment.text}")
                results.append({
                    "start": seg_start,
                    "end": seg_end,
                    "text": segment.text
                })
            logger.info(f"Backend: Sending response: {results}")
            await websocket.send_json({"segments": results})

            # Advance current_time for next chunk
            current_time += chunk_duration

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected by client.")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        # Deduct credits based on current_time
        if user_id:
            credits_used = int(current_time // 60)
            if current_time % 60 > 40:
                credits_used += 1
            if credits_used > 0:
                # Fetch current credits again to avoid race conditions
                user_data = supabase.table("user_credits").select("*").eq("id", user_id).single().execute()
                current_credits = user_data.data["credits_remaining"]
                new_credits = max(current_credits - credits_used, 0)
                supabase.table("user_credits").update({"credits_remaining": new_credits}).eq("id", user_id).execute()
                logger.info(f"Deducted {credits_used} credits from user {user_id}. Remaining: {new_credits}")
        try:
            await websocket.close()
        except Exception:
            pass