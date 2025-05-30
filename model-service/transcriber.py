import os
import ffmpeg
import whisper_timestamped as whisper_ts
import torch
from typing import Dict, List, Tuple, Optional
import json
from datetime import datetime
import soundfile as sf
import numpy as np
import librosa
from pydub import AudioSegment

class Transcriber:
    
    def __init__(self, model_name: str = "turbo"):
        """
        Initialize the transcriber with a specified Whisper model.
        
        Args:
            model_name (str): Name of the Whisper model to use (tiny, base, small, medium, large, large-v3, turbo)
        """
        try:
            self.model = whisper_ts.load_model(model_name)
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            self.model.to(self.device)
            print(f"Model loaded successfully on {self.device}")
        except Exception as e:
            raise RuntimeError(f"Failed to load model: {str(e)}")
        
    def load_audio(self, audio_path: str) -> np.ndarray:
        """
        Load audio file and ensure it's in the correct format.
        
        Args:
            audio_path (str): Path to audio file
            
        Returns:
            np.ndarray: Audio data in the correct format
        """
        try:
            # Load audio using librosa
            audio, sr = librosa.load(audio_path, sr=16000, mono=True)
            return audio
        except Exception as e:
            raise RuntimeError(f"Failed to load audio file {audio_path}: {str(e)}")

    def extract_audio(self, video_path: str, audio_path: str, sample_rate: int = 16000) -> None:
        """
        Extract audio from video file and convert to WAV format.
        
        Args:
            video_path (str): Path to input video file
            audio_path (str): Path to save extracted audio
            sample_rate (int): Target sample rate for audio
        """
        try:
            if not os.path.exists(video_path):
                raise FileNotFoundError(f"Video file not found: {video_path}")
                
            (
                ffmpeg
                .input(video_path)
                .output(audio_path, ac=1, ar=sample_rate)
                .run(overwrite_output=True, capture_stdout=True, capture_stderr=True)
            )
            print(f"Audio extracted successfully to {audio_path}")
        except ffmpeg.Error as e:
            raise RuntimeError(f"Failed to extract audio: {e.stderr.decode()}")
        except Exception as e:
            raise RuntimeError(f"Error during audio extraction: {str(e)}")

    def transcribe(self, audio_path: str, language: Optional[str] = None) -> Dict:
        try:
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f"Audio file not found: {audio_path}")
                
            audio = self.load_audio(audio_path)
            

            # Process audio in smaller chunks with better overlap handling
            chunk_duration = 30  # Reduced from 15 to 10 seconds
            overlap_duration = 1  # Reduced from 2 to 1 second
            sample_rate = 16000
            all_segments = []
            last_end_time = 0
            min_segment_length = 0.1  # Minimum segment length in seconds
            max_repetition_count = 3  # Maximum times a character can repeat
            
            # First detect language from a small sample
            initial_chunk = audio[:min(len(audio), 30 * sample_rate)]
            initial_result = whisper_ts.transcribe(self.model, initial_chunk)
            detected_language = initial_result["language"]
            lang_confidence = initial_result.get("language_probability", 0.0)
            
            # Process the full audio in chunks
            for i in range(0, len(audio), int((chunk_duration - overlap_duration) * sample_rate)):
                start_sample = i
                end_sample = min(i + chunk_duration * sample_rate, len(audio))
                audio_chunk = audio[start_sample:end_sample]
                
                chunk_result = whisper_ts.transcribe(
                    self.model, 
                    audio_chunk, 
                    language=detected_language,
                    condition_on_previous_text=True if i > 0 else False
                )
                
                for segment in chunk_result["segments"]:
                    # Adjust timestamps
                    segment_start = max(segment["start"] + (i / sample_rate), last_end_time)
                    segment_end = segment["end"] + (i / sample_rate)
                    
                    # Skip if segment is too short
                    if segment_end - segment_start < min_segment_length:
                        continue
                    
                    # Check for excessive repetition
                    current_text = " ".join(w["text"] for w in segment["words"])
                    if self._has_excessive_repetition(current_text, max_repetition_count):
                        continue
                    
                    # Update segment timestamps
                    segment["start"] = segment_start
                    segment["end"] = segment_end
                    for word in segment["words"]:
                        word["start"] = max(word["start"] + (i / sample_rate), last_end_time)
                        word["end"] = word["end"] + (i / sample_rate)
                    
                    all_segments.append(segment)
                    last_end_time = segment_end
            
            result = {
                "segments": all_segments,
                "language": detected_language,
                "language_probability": lang_confidence
            }
            
            return {
                "transcription": result,
                "language": detected_language,
                "language_confidence": lang_confidence
            }
        except Exception as e:
            raise RuntimeError(f"Transcription failed: {str(e)}")

    def _has_excessive_repetition(self, text: str, max_repeat: int) -> bool:
        """Check if text has excessive character repetition."""
        if not text:
            return False
        
        # Convert text to list of characters
        chars = list(text)
        repeat_count = 1
        prev_char = chars[0]
        
        for char in chars[1:]:
            if char == prev_char:
                repeat_count += 1
                if repeat_count > max_repeat:
                    return True
            else:
                repeat_count = 1
                prev_char = char
        
        return False

    def generate_srt(self, transcription: Dict, output_path: str, min_confidence: float = 0.5) -> None:
        try:
            def format_time(seconds: float) -> str:
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
                
                avg_confidence = sum(w["confidence"] for w in words) / len(words)
                text = " ".join(w["text"] for w in words)
                confidence_text = f"[Confidence: {avg_confidence:.2%}]"
                
                srt_entries.append(f"{entry_num}\n{start_time} --> {end_time}\n{text}\n{confidence_text}\n")
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

                # Calculate duration from segments
                duration = max(segment["end"] for segment in transcription["segments"])
                print(f"Total duration: {duration:.2f} seconds")

               # Print word count
                print(f"Total words: {len(all_confidences)}")
                total_words = len(all_confidences)

        except Exception as e:
            raise RuntimeError(f"Failed to generate SRT file: {str(e)}")

    def process_media(self, input_path: str, output_dir: str, min_confidence: float = 0.5) -> Dict:
        try:
            if not os.path.exists(input_path):
                raise FileNotFoundError(f"Input file not found: {input_path}")
                
            os.makedirs(output_dir, exist_ok=True)
            base_name = os.path.splitext(os.path.basename(input_path))[0]
            
            # Extract audio if input is video
            if input_path.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
                audio_path = os.path.join(output_dir, f"{base_name}.wav")
                self.extract_audio(input_path, audio_path)
            else:
                audio_path = input_path

            # Transcribe (includes language detection)
            result = self.transcribe(audio_path)
            duration = len(AudioSegment.from_file(audio_path)) / 1000.0

            # Calculate total words from transcription result
            total_words = sum(len(segment["words"]) for segment in result["transcription"]["segments"])

            # Generate outputs
            srt_path = os.path.join(output_dir, f"{base_name}.srt")
            json_path = os.path.join(output_dir, f"{base_name}.json")
            
            self.generate_srt(result["transcription"], srt_path, min_confidence)
            
            # Save detailed results
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump({
                    "language": result["language"],
                    "language_confidence": result["language_confidence"],
                    "transcription": result["transcription"],
                    "processing_time": datetime.now().isoformat()
                }, f, indent=2, ensure_ascii=False)
            
            return {
                "status": "success",
                "duration": duration,
                "word_count": total_words,
                "audio_path": audio_path,
                "srt_path": srt_path,
                "json_path": json_path,
                "language": result["language"],
                "language_confidence": result["language_confidence"]
            }
        except Exception as e:
            raise RuntimeError(f"Media processing failed: {str(e)}")