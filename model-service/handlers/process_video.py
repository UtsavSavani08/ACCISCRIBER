# import os
# from video_transcriber import VideoTranscriber

# def transcribe_video_from_file(input_path: str, output_dir: str, model: str = "turbo", min_confidence: float = 0.5):
#     transcriber = VideoTranscriber(model_name=model)
#     return transcriber.process_video(input_path, output_dir, min_confidence)
import moviepy.editor as mp
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
            # word_count = sum(len(segment.get('text', '').split()) for segment in result.get('segments', []))
            transcription_stats = result.get('transcription_stats', {}) 
            print(f"Transcription stats: {transcription_stats}") # Add logging

            audio_path = os.path.splitext(file_path)[0] + ".wav"
            if not os.path.exists(audio_path):
                video = mp.VideoFileClip(file_path)
                video.audio.write_audiofile(audio_path)
                video.close()
            
            

            return {
                "status": "success",
                "data": {
                    "word_count": transcription_stats.get('total_words', 0),
                    "duration": transcription_stats.get('total_duration', 0),
                    "detected_language": transcription_stats.get('language', 'unknown'),
                    "srt_filename": os.path.basename(result.get('srt_path', '')),
                    "srt_path": result.get('srt_path', ''),
                    "audio_path": os.path.splitext(result.get('srt_path', ''))[0] + ".wav",
                    "json_path": os.path.splitext(result.get('srt_path', ''))[0] + ".json"
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