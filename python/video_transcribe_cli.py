import argparse
import os
from video_transcriber import VideoTranscriber
from tqdm import tqdm

def main():
    parser = argparse.ArgumentParser(description="Transcribe video files with word-level timestamps and confidence scores")
    parser.add_argument("input", help="Path to input video file or directory")
    parser.add_argument("--output-dir", "-o", default="output", help="Directory to save transcription outputs")
    parser.add_argument("--model", "-m", default="turbo", choices=["tiny", "base", "small", "medium", "large","turbo"],
                      help="Whisper model size to use")
    parser.add_argument("--min-confidence", "-c", type=float, default=0.5,
                      help="Minimum confidence threshold for words in SRT output")
    parser.add_argument("--recursive", "-r", action="store_true",
                      help="Process directories recursively")
    
    args = parser.parse_args()
    
    # Initialize transcriber
    transcriber = VideoTranscriber(model_name=args.model)
    
    def process_file(file_path):
        try:
            print(f"\nProcessing: {file_path}")
            result = transcriber.process_video(file_path, args.output_dir, args.min_confidence)
            print(f"\nOutput files:")
            print(f"SRT file: {result['srt_path']}")
            print(f"Detailed results: {result['json_path']}")
        except Exception as e:
            print(f"Error processing {file_path}: {str(e)}")
    
    # Process input
    if os.path.isfile(args.input):
        if not args.input.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
            print(f"Error: {args.input} is not a supported video file")
            return 1
        process_file(args.input)
    elif os.path.isdir(args.input):
        for root, _, files in os.walk(args.input):
            if not args.recursive and root != args.input:
                continue
                
            video_files = [f for f in files if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))]
            for file in tqdm(video_files, desc="Processing videos"):
                file_path = os.path.join(root, file)
                process_file(file_path)
    else:
        print(f"Error: Input path '{args.input}' does not exist")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 