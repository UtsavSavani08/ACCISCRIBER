import os
import ffmpeg
import whisper_timestamped as whisper_ts
import torch
from typing import Dict, List, Tuple, Optional
import json
from datetime import datetime
import numpy as np
import cv2
from moviepy.editor import VideoFileClip
import tempfile

class VideoTranscriber:
    def __init__(self, model_name: str = "turbo"):
        """
        Initialize the video transcriber with a specified Whisper model.
        
        Args:
            model_name (str): Name of the Whisper model to use (tiny, base, small, medium, large, turbo)
        """
        try:
            self.model = whisper_ts.load_model(model_name)
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            self.model.to(self.device)
            print(f"Model loaded successfully on {self.device}")
        except Exception as e:
            raise RuntimeError(f"Failed to load model: {str(e)}")

    def extract_audio(self, video_path: str, audio_path: str, sample_rate: int = 16000) -> Dict:
        """
        Extract audio from video file with enhanced error handling and metadata.
        If video has no audio, creates a silent audio track.
        
        Args:
            video_path (str): Path to input video file
            audio_path (str): Path to save extracted audio
            sample_rate (int): Target sample rate for audio
            
        Returns:
            Dict: Video metadata including duration, fps, and resolution
        """
        try:
            if not os.path.exists(video_path):
                raise FileNotFoundError(f"Video file not found: {video_path}")

            # Get video metadata using moviepy
            video = VideoFileClip(video_path)
            metadata = {
                "duration": video.duration,
                "fps": video.fps,
                "size": video.size,
                "audio_fps": video.audio.fps if video.audio else None
            }
            video.close()

            # Check if video has audio
            probe = ffmpeg.probe(video_path)
            has_audio = any(stream['codec_type'] == 'audio' for stream in probe['streams'])
            
            # Ensure the output directory exists
            os.makedirs(os.path.dirname(audio_path), exist_ok=True)

            if not has_audio:
                # Create silent audio track with the same duration as the video
                duration = float(probe['format']['duration'])
                (
                    ffmpeg
                    .input('anullsrc', t=duration, f='lavfi')
                    .output(
                        audio_path,
                        ac=1,  # mono
                        ar=sample_rate,  # sample rate
                        acodec='pcm_s16le',  # high quality PCM
                        loglevel='error'
                    )
                    .run(overwrite_output=True, capture_stdout=True, capture_stderr=True)
                )
                print(f"Created silent audio track for video without audio")
            else:
                # Extract audio using ffmpeg with high quality settings
                try:
                    stream = (
                        ffmpeg
                        .input(video_path)
                        .output(
                            audio_path,
                            ac=1,  # mono
                            ar=sample_rate,  # sample rate
                            acodec='pcm_s16le',  # high quality PCM
                            loglevel='error'
                        )
                    )
                    
                    # Run the command
                    stream.run(overwrite_output=True, capture_stdout=True, capture_stderr=True)
                    
                except ffmpeg.Error as e:
                    raise RuntimeError(f"Failed to extract audio: {str(e)}")

            # Verify the output file exists and has content
            if not os.path.exists(audio_path):
                raise RuntimeError(f"Output file was not created: {audio_path}")
            if os.path.getsize(audio_path) == 0:
                raise RuntimeError(f"Output file is empty: {audio_path}")
                
            return metadata

        except Exception as e:
            raise RuntimeError(f"Error during audio extraction: {str(e)}")

    def process_video(self, video_path: str, output_dir: str, min_confidence: float = 0.5) -> Dict:
        try:
            print("Step 1: Checking video file existence")
            # First try with the prefix
            dir_path = os.path.dirname(video_path)
            base_name = os.path.basename(video_path)
            prefixed_name = "CUsersdvcodInternCaptionpython" + base_name if not base_name.startswith("CUsersdvcodInternCaptionpython") else base_name
            full_path = os.path.join(dir_path, prefixed_name)
            
            # If prefixed file doesn't exist, try the original path
            if not os.path.exists(full_path):
                full_path = video_path
                if not os.path.exists(full_path):
                    raise FileNotFoundError(f"Video file not found at either {full_path} or {os.path.join(dir_path, prefixed_name)}")
                print(f"Using original file path: {full_path}")
            else:
                print(f"Using prefixed file path: {full_path}")

            # Continue with the rest of the processing using the full_path
            print("Step 2: Creating output directory")
            os.makedirs(output_dir, exist_ok=True)
            base_name = os.path.splitext(os.path.basename(full_path))[0]

            print("Step 3: Creating temporary directory")
            with tempfile.TemporaryDirectory() as temp_dir:
                print("Step 4: Extracting audio")
                temp_audio = os.path.join(temp_dir, "temp_audio.wav")
                try:
                    # Use full_path instead of video_path here
                    metadata = self.extract_audio(full_path, temp_audio)
                    print("Audio extraction completed successfully")
                except Exception as e:
                    print(f"Audio extraction failed: {str(e)}")
                    raise

                print("Step 5: Loading audio file")
                try:
                    audio = whisper_ts.load_audio(temp_audio)
                    print("Audio loaded successfully")
                except Exception as e:
                    print(f"Audio loading failed: {str(e)}")
                    raise

                print("Step 6: Transcribing audio")
                try:
                    # Process audio in smaller chunks with improved overlap handling
                    chunk_duration = 30  # reduced from 15 to 10 seconds for better control
                    overlap_duration = 1  # reduced overlap to minimize duplicates
                    sample_rate = 16000
                    all_segments = []
                    last_text = None
                    duplicate_threshold = 0.6  # reduced threshold for stricter duplicate detection
                    
                    # Add text cleaning function
                    def clean_text(text: str) -> str:
                        # Remove repeated words
                        words = text.split()
                        cleaned_words = []
                        for i, word in enumerate(words):
                            if i == 0 or word != words[i-1]:
                                cleaned_words.append(word)
                        return ' '.join(cleaned_words)
                    
                    for i in range(0, len(audio), int((chunk_duration - overlap_duration) * sample_rate)):
                        start_sample = i
                        end_sample = min(i + chunk_duration * sample_rate, len(audio))
                        audio_chunk = audio[start_sample:end_sample]
                        
                        # Use the same language for all chunks once detected
                        if i == 0:
                            chunk_result = whisper_ts.transcribe(self.model, audio_chunk)
                            detected_language = chunk_result["language"]
                        else:
                            chunk_result = whisper_ts.transcribe(self.model, audio_chunk, language=detected_language)
                        
                        # Process segments and remove duplicates with improved cleaning
                        for segment in chunk_result["segments"]:
                            # Adjust timestamps
                            segment_start = segment["start"] + (i / sample_rate)
                            segment_end = segment["end"] + (i / sample_rate)
                            
                            # Clean and check the text
                            current_text = clean_text(" ".join(w["text"] for w in segment["words"]))
                            
                            # Skip if this is a duplicate or contains excessive repetition
                            if last_text and (self._text_similarity(current_text, last_text) > duplicate_threshold 
                                             or len(set(current_text.split())) < len(current_text.split()) / 2):
                                continue
                            
                            # Update segment timestamps and words
                            segment["start"] = segment_start
                            segment["end"] = segment_end
                            
                            # Clean up words to remove immediate repetitions
                            cleaned_words = []
                            last_word = None
                            for word in segment["words"]:
                                if not last_word or word["text"] != last_word["text"]:
                                    word["start"] += (i / sample_rate)
                                    word["end"] += (i / sample_rate)
                                    cleaned_words.append(word)
                                    last_word = word
                            
                            segment["words"] = cleaned_words
                            all_segments.append(segment)
                            last_text = current_text
                    
                    result = {
                        "segments": all_segments,
                        "language": detected_language,
                        "language_probability": chunk_result.get("language_probability", 0.0)
                    }
                    print("Transcription completed successfully")
                except Exception as e:
                    print(f"Transcription failed: {str(e)}")
                    raise

                # Calculate segment statistics
                segments = result["segments"]
                total_duration = metadata["duration"]
                total_words = sum(len(segment["words"]) for segment in segments)
                avg_words_per_second = total_words / total_duration if total_duration > 0 else 0

                # Generate outputs
                srt_path = os.path.join(output_dir, f"{base_name}.srt")
                json_path = os.path.join(output_dir, f"{base_name}.json")

                # Generate SRT with confidence scores
                self.generate_srt(result, srt_path, min_confidence)

                # Save detailed results with video metadata
                output_data = {
                    "video_metadata": metadata,
                    "transcription_stats": {
                        "total_duration": total_duration,
                        "total_words": total_words,
                        "avg_words_per_second": avg_words_per_second,
                        "language": result["language"],
                        "language_confidence": result.get("language_probability", 0.0)
                    },
                    "transcription": result,
                    "processing_time": datetime.now().isoformat()
                }

                with open(json_path, "w", encoding="utf-8") as f:
                    json.dump(output_data, f, indent=2, ensure_ascii=False)

                print("\nVideo Processing Statistics:")
                print(f"Duration: {total_duration:.2f} seconds")
                print(f"Resolution: {metadata['size'][0]}x{metadata['size'][1]}")
                print(f"FPS: {metadata['fps']}")
                print(f"Total words: {total_words}")
                print(f"Average words per second: {avg_words_per_second:.2f}")

                return {
                    "srt_path": srt_path,
                    "json_path": json_path,
                    "video_metadata": metadata,
                    "transcription_stats": output_data["transcription_stats"]
                }

        except Exception as e:
            print(f"\nDetailed error information:")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            raise RuntimeError(f"Video processing failed: {str(e)}")

    def generate_srt(self, transcription: Dict, output_path: str, min_confidence: float = 0.5) -> None:
        """
        Generate SRT subtitle file from transcription results with confidence scores.
        
        Args:
            transcription (Dict): Transcription result from transcribe()
            output_path (str): Path to save SRT file
            min_confidence (float): Minimum confidence threshold for words
        """
        try:
            def format_time(seconds: float) -> str:
                """Convert seconds to SRT timestamp format."""
                ms = int((seconds - int(seconds)) * 1000)
                h = int(seconds // 3600)
                m = int((seconds % 3600) // 60)
                s = int(seconds % 60)
                return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

            srt_entries = []
            entry_num = 1

            for segment in transcription["segments"]:
                words = [w for w in segment["words"] if w["confidence"] >= min_confidence]
                if not words:
                    continue

                start_time = format_time(words[0]["start"])
                end_time = format_time(words[-1]["end"])
                
                # Calculate average confidence for the segment
                avg_confidence = sum(w["confidence"] for w in words) / len(words)
                
                # Format text with confidence score
                text = " ".join(w["text"] for w in words)
                confidence_text = f"[Confidence: {avg_confidence:.2%}]"
                
                # Add double newline at the end of each entry
                srt_entries.append(f"{entry_num}\n{start_time} --> {end_time}\n{text}\n\n")
                entry_num += 1

            with open(output_path, "w", encoding="utf-8") as f:
                f.writelines(srt_entries)
            print(f"SRT file generated successfully: {output_path}")
            
            # Print overall statistics
            all_confidences = [w["confidence"] for segment in transcription["segments"] for w in segment["words"]]
            if all_confidences:
                avg_confidence = sum(all_confidences) / len(all_confidences)
                min_confidence = min(all_confidences)
                max_confidence = max(all_confidences)
                print(f"\nTranscription Confidence Statistics:")
                print(f"Average confidence: {avg_confidence:.2%}")
                print(f"Minimum confidence: {min_confidence:.2%}")
                print(f"Maximum confidence: {max_confidence:.2%}")
                print(f"Total words: {len(all_confidences)}")
                
        except Exception as e:
            raise RuntimeError(f"Failed to generate SRT file: {str(e)}")

    def _text_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two text segments."""
        if not text1 or not text2:
            return 0.0
        words1 = set(text1.split())
        words2 = set(text2.split())
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        return len(intersection) / len(union)


