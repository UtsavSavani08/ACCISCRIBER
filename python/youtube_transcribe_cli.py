import argparse
import os
from youtube_transcriber import YouTubeTranscriber
from video_transcriber import VideoTranscriber  # Add this import
from tqdm import tqdm

def main():
    parser = argparse.ArgumentParser(description="Transcribe YouTube videos with word-level timestamps and confidence scores")
    parser.add_argument("url", help="YouTube video URL")
    parser.add_argument("--output-dir", "-o", default="output", help="Directory to save transcription outputs")
    parser.add_argument("--model", "-m", default="turbo", choices=["tiny", "base", "small", "medium", "large","turbo"],
                      help="Whisper model size to use")
    parser.add_argument("--min-confidence", "-c", type=float, default=0.5,
                      help="Minimum confidence threshold for words in SRT output")
    
    args = parser.parse_args()
    
    try:
        # Clean the URL by removing quotes and extra spaces
        clean_url = args.url.strip().strip('"\' ')
        
        # First download the video
        print(f"\nDownloading YouTube video: {clean_url}")
        youtube_transcriber = YouTubeTranscriber(model_name=args.model)  # Pass model name here
        
        try:
            video_path = youtube_transcriber.download_video(clean_url)
            print(f"\nTranscribing video: {video_path}")
            
            result = youtube_transcriber.process_youtube_video(clean_url, args.output_dir, args.min_confidence)
            
            print("\nProcessing completed successfully!")
            print(f"\nOutput files:")
            print(f"SRT file: {result['srt_path']}")
            print(f"Detailed results: {result['json_path']}")
            
            return 0
            
        except Exception as e:
            print(f"Error during processing: {str(e)}")
            # Ensure cleanup even if processing fails
            if 'video_path' in locals() and os.path.exists(video_path):
                try:
                    os.remove(video_path)
                except Exception as cleanup_error:
                    print(f"Warning: Could not clean up video file: {cleanup_error}")
            return 1
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return 1

if __name__ == "__main__":
    exit(main())