import torch
from transformers import Wav2Vec2FeatureExtractor, WavLMForSequenceClassification
import librosa
import numpy as np
import ffmpeg
import os
import argparse
from typing import Dict, Tuple, Optional

class LanguageDetector:
    def __init__(self):
        """Initialize the language detector with facebook/mms-lid-256 model."""
        try:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            self.model = WavLMForSequenceClassification.from_pretrained("facebook/mms-lid-256")
            self.feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained("facebook/mms-lid-256")
            self.model.to(self.device)
            print(f"Model loaded successfully on {self.device}")
        except Exception as e:
            raise RuntimeError(f"Failed to load model: {str(e)}")

    def extract_audio(self, video_path: str, audio_path: str) -> None:
        """Extract audio from video file."""
        try:
            (ffmpeg
             .input(video_path)
             .output(audio_path, acodec='pcm_s16le', ac=1, ar='16000')
             .overwrite_output()
             .run(capture_stdout=True, capture_stderr=True))
        except ffmpeg.Error as e:
            raise RuntimeError(f"Failed to extract audio: {e.stderr.decode()}")

    def load_audio(self, audio_path: str, max_duration: int = 30) -> np.ndarray:
        """Load audio file and return samples."""
        try:
            # Load first 30 seconds (or less) of audio at 16kHz
            audio, sr = librosa.load(audio_path, sr=16000, duration=max_duration)
            return audio
        except Exception as e:
            raise RuntimeError(f"Failed to load audio: {str(e)}")

    def detect_language(self, audio: np.ndarray) -> Tuple[str, float]:
        """Detect language from audio samples."""
        try:
            # Prepare audio features
            inputs = self.feature_extractor(
                audio, 
                sampling_rate=16000, 
                return_tensors="pt"
            ).to(self.device)

            # Get model predictions
            with torch.no_grad():
                outputs = self.model(**inputs)
                predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
                confidence, predicted_id = torch.max(predictions, dim=-1)

            # Get language label
            language = self.model.config.id2label[predicted_id.item()]
            confidence = confidence.item()

            return language, confidence
        except Exception as e:
            raise RuntimeError(f"Language detection failed: {str(e)}")

    def process_media(self, input_path: str) -> Dict:
        """Process audio/video file and detect language."""
        try:
            # Handle video files
            if input_path.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
                temp_audio = 'temp_audio.wav'
                self.extract_audio(input_path, temp_audio)
                audio_path = temp_audio
            else:
                audio_path = input_path

            # Load and process audio
            audio = self.load_audio(audio_path)
            language, confidence = self.detect_language(audio)

            # Clean up temporary file
            if input_path.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
                os.remove(temp_audio)

            return {
                "language": language,
                "confidence": confidence,
                "input_file": input_path
            }
        except Exception as e:
            raise RuntimeError(f"Processing failed: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description="Detect language in audio/video files")
    parser.add_argument("input", help="Path to input audio/video file")
    args = parser.parse_args()

    detector = LanguageDetector()
    try:
        result = detector.process_media(args.input)
        print(f"\nResults for: {result['input_file']}")
        print(f"Detected Language: {result['language']}")
        print(f"Confidence: {result['confidence']:.2%}")
    except Exception as e:
        print(f"Error: {str(e)}")
        return 1

    return 0

if __name__ == "__main__":
    exit(main())