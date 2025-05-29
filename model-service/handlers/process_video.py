# import os
# from video_transcriber import VideoTranscriber

# def transcribe_video_from_file(input_path: str, output_dir: str, model: str = "turbo", min_confidence: float = 0.5):
#     transcriber = VideoTranscriber(model_name=model)
#     return transcriber.process_video(input_path, output_dir, min_confidence)

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../python')))

from video_transcriber import VideoTranscriber
from typing import Dict
import os

class VideoProcessor:
    def __init__(self):
        self.transcriber = VideoTranscriber(model_name="turbo")

    async def process_file(self, file_path: str, output_dir: str) -> Dict:
        try:
            print(f"Processing video file: {file_path}") # Add logging
            result = self.transcriber.process_video(
                file_path,
                output_dir,
                min_confidence=0.5
            )
            print(f"Transcription result: {result}") # Add logging
            
            # Extract word count from segments
            word_count = sum(len(segment.get('text', '').split()) for segment in result.get('segments', []))
            
            return {
                "status": "success",
                "data": {
                    "word_count": word_count,
                    "detected_language": result.get('language', 'unknown'),
                    "srt_filename": os.path.basename(result.get('srt_path', '')),
                    "srt_path": result.get('srt_path', '')
                },
                "error": None
            }
        except Exception as e:
            print(f"Error processing video: {str(e)}") # Add logging
            return {
                "status": "error",
                "data": None,
                "error": str(e)
            }