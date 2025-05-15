import os
from pytubefix import YouTube  # Changed from pytube to pytubefix
from video_transcriber import VideoTranscriber
import tempfile
from typing import Dict, Optional

class YouTubeTranscriber:
    def __init__(self, model_name: str = "large"):
        """
        Initialize the YouTube transcriber with a specified Whisper model.
        
        Args:
            model_name (str): Name of the Whisper model to use (tiny, base, small, medium, large)
        """
        self.video_transcriber = VideoTranscriber(model_name=model_name)

    def download_video(self, url: str, output_path: Optional[str] = None) -> str:
        """
        Download a YouTube video.
        
        Args:
            url (str): YouTube video URL
            output_path (str, optional): Path to save the video. If None, uses a temporary file.
            
        Returns:
            str: Path to the downloaded video file
        """
        try:
            # Create YouTube object
            yt = YouTube(url)
            
            # Get video title for filename
            video_title = yt.title
            # Remove invalid characters from filename and add prefix only once
            clean_title = "".join(c for c in video_title if c.isalnum() or c in (' ', '-', '_')).strip()
            # Use a simple prefix without path components
            video_title = "YT_" + clean_title
            
            if output_path is None:
                # Create output in the current directory with proper path handling
                current_dir = os.path.dirname(os.path.abspath(__file__))
                output_path = os.path.join(current_dir, f"{video_title}.mp4")
            
            # Download the video
            print(f"Downloading: {video_title}")
            video = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
            # Download to the directory containing the output path
            video.download(filename=output_path)
            print(f"Download completed: {output_path}")
            
            return output_path
            
        except Exception as e:
            import traceback
            print(f"Full error details: {traceback.format_exc()}")
            raise RuntimeError(f"Failed to download YouTube video: {str(e)}")

    def process_youtube_video(self, url: str, output_dir: str, min_confidence: float = 0.5) -> Dict:
        """
        Process a YouTube video and generate transcription outputs.
        
        Args:
            url (str): YouTube video URL
            output_dir (str): Directory to save outputs
            min_confidence (float): Minimum confidence threshold for words
            
        Returns:
            Dict: Processing results including paths to generated files
        """
        try:
            # Create output directory
            os.makedirs(output_dir, exist_ok=True)
            
            # Download video first
            video_path = self.download_video(url)
            
            try:
                # Process the video using VideoTranscriber
                result = self.video_transcriber.process_video(video_path, output_dir, min_confidence)
                
                # Add YouTube metadata to the result
                yt = YouTube(url)
                result["youtube_metadata"] = {
                    "title": yt.title,
                    "author": yt.author,
                    "length": yt.length,
                    "views": yt.views,
                    "publish_date": str(yt.publish_date) if yt.publish_date else None
                }
                
                return result
            finally:
                # Clean up the video file if it exists
                if os.path.exists(video_path):
                    try:
                        os.remove(video_path)
                    except Exception:
                        pass  # Ignore cleanup errors
                
        except Exception as e:
            raise RuntimeError(f"YouTube video processing failed: {str(e)}")