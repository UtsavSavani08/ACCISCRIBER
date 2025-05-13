import argparse
import os
from youtube_transcriber import YouTubeTranscriber
from video_transcriber import VideoTranscriber  # Add this import
from tqdm import tqdm

def main():
    parser = argparse.ArgumentParser(description="Transcribe YouTube videos with word-level timestamps and confidence scores")
    parser.add_argument("url", help="YouTube video URL")
    parser.add_argument("--output-dir", "-o", default="output", help="Directory to save transcription outputs")
    parser.add_argument("--model", "-m", default="large", choices=["tiny", "base", "small", "medium", "large"],
                      help="Whisper model size to use")
    parser.add_argument("--min-confidence", "-c", type=float, default=0.5,
                      help="Minimum confidence threshold for words in SRT output")
    
    args = parser.parse_args()
    
    try:
        # First download the video
        print(f"\nDownloading YouTube video: {args.url}")
        youtube_transcriber = YouTubeTranscriber()
        video_path = youtube_transcriber.download_video(args.url)
        
        # Then transcribe it using VideoTranscriber
        print(f"\nTranscribing video: {video_path}")
        video_transcriber = VideoTranscriber(model_name=args.model)
        result = video_transcriber.process_video(video_path, args.output_dir, args.min_confidence)
        
        print("\nProcessing completed successfully!")
        print(f"\nOutput files:")
        print(f"SRT file: {result['srt_path']}")
        print(f"Detailed results: {result['json_path']}")
        
        # Clean up the video file
        if os.path.exists(video_path):
            os.remove(video_path)
        
        return 0
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return 1

if __name__ == "__main__":
    exit(main())