# import os
# from transcriber import Transcriber

# def transcribe_from_file(input_path: str, output_dir: str, model: str = "turbo", min_confidence: float = 0.5):
#     transcriber = Transcriber(model_name=model)
#     return transcriber.process_media(input_path, output_dir, min_confidence)
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../python')))

from transcriber import Transcriber
from typing import Dict
import os

class AudioProcessor:
    async def process_file(self, file_path: str, output_dir: str) -> Dict:
        try:
            print(f"Processing audio file: {file_path}")
            transcriber = Transcriber(model_name="turbo")  # Instantiate per request
            result = transcriber.process_media(
                file_path,
                output_dir,
                min_confidence=0.5
            )
            print(f"Transcription result: {result}")

            return {
                "status": "success",
                "data": {
                    "duration": result["duration"],
                    "word_count": result["word_count"],
                    "detected_language": result["language"],
                    "srt_filename": os.path.basename(file_path),
                    "srt_path": result["srt_path"],
                    "json_path": result["json_path"]
                },
                "error": None
            }
        except Exception as e:
            print(f"Error processing audio: {str(e)}")
            return {
                "status": "error",
                "data": None,
                "error": str(e)
            }
