import pyaudio
import numpy as np
from fastapi import APIRouter, Query, Request, WebSocket
from fastapi.responses import StreamingResponse
from faster_whisper import WhisperModel
import logging
import ffmpeg
from starlette.websockets import WebSocketDisconnect

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
    try:
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        logger.info("Whisper model loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load Whisper model: {e}")
        await websocket.send_json({"error": "Failed to load Whisper model"})
        await websocket.close()
        return

    try:
        # Receive the language selection as the first message (must be text)
        lang_msg = await websocket.receive_text()
        logger.info(f"Backend: Received language selection: {lang_msg}")
        language = lang_msg if lang_msg else "en"

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

            # Transcribe as usual
            segments, info = model.transcribe(audio, beam_size=5, language=language)
            results = []
            for segment in segments:
                # Offset segment times by current_time
                seg_start = float(segment.start) + current_time
                seg_end = float(segment.end) + current_time
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
    # Do NOT call await websocket.close() here; connection is already closed