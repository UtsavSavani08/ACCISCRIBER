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
    def __init__(self):
        self.transcriber = Transcriber(model_name="turbo")

    async def process_file(self, file_path: str, output_dir: str) -> Dict:
        try:
            print(f"Processing audio file: {file_path}") # Add logging
            result = self.transcriber.process_media(
                file_path,
                output_dir,
                min_confidence=0.5
            )
            print(f"Transcription result: {result}") # Add logging
            
            # Extract word count from segments
            # word_count = sum(len(segment.get('text', '').split()) for segment in result.get('segments', []))
            transcription_stats = result.get('transcription_stats', {})
            print(f"Transcription stats: {transcription_stats}") # Add logging
            
            return {
                "status": "success",
                "data": {
                    "duration": transcription_stats.get('total_duration', 0),
                    "word_count": transcription_stats.get('total_words', 0),
                    "detected_language": transcription_stats.get('language', 'unknown'),
                    "srt_filename": os.path.basename(result.get('srt_path', '')),
                    "srt_path": result.get('srt_path', '')
                },
                "error": None
            }
        except Exception as e:
            print(f"Error processing audio: {str(e)}") # Add logging
            return {
                "status": "error",
                "data": None,
                "error": str(e)
            }
