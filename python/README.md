# High-Quality Audio/Video Transcription System

This system provides high-quality transcription capabilities for audio and video files, with support for multiple languages, word-level timestamps, and confidence scores. It uses OpenAI's Whisper model through the whisper-timestamped package for accurate transcription and language detection.

## Features

- Process both audio and video files
- Automatic language detection with confidence scores
- Word-level timestamps and confidence scores
- SRT subtitle generation
- Detailed JSON output with full transcription data
- Support for batch processing of multiple files
- GPU acceleration when available

## Prerequisites

- Python 3.8 or higher
- FFmpeg installed and accessible from command line
- CUDA-compatible GPU (optional, but recommended for faster processing)

## Installation

1. Clone this repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install FFmpeg:

- Windows: Download from [FFmpeg website](https://ffmpeg.org/download.html) and add to PATH
- Linux: `sudo apt-get install ffmpeg`
- macOS: `brew install ffmpeg`

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### Command Line Interface

The system can be used through a command-line interface:

```bash
python transcribe_cli.py input_path [options]
```

Options:

- `--output-dir`, `-o`: Directory to save outputs (default: "output")
- `--model`, `-m`: Whisper model size to use (tiny, base, small, medium, large)
- `--min-confidence`, `-c`: Minimum confidence threshold for words (0.0-1.0)
- `--recursive`, `-r`: Process directories recursively

Examples:

1. Transcribe a single file:

```bash
python transcribe_cli.py video.mp4
```

2. Process all media files in a directory:

```bash
python transcribe_cli.py media_folder/ --recursive
```

3. Use a smaller model with higher confidence threshold:

```bash
python transcribe_cli.py audio.wav --model small --min-confidence 0.7
```

### Output Files

For each processed file, the system generates:

1. `{filename}.srt`: Subtitle file with word-level timestamps
2. `{filename}.json`: Detailed transcription data including:
   - Detected language and confidence
   - Word-level timestamps and confidence scores
   - Full transcription text
   - Processing metadata

### Using as a Python Module

You can also use the system as a Python module:

```python
from transcriber import Transcriber

# Initialize transcriber
transcriber = Transcriber(model_name="large")

# Process a file
result = transcriber.process_media(
    input_path="video.mp4",
    output_dir="output",
    min_confidence=0.5
)

# Access results
print(f"Detected language: {result['language']}")
print(f"Language confidence: {result['language_confidence']}")
print(f"SRT file: {result['srt_path']}")
print(f"Detailed results: {result['json_path']}")
```

## Model Selection

The system supports different Whisper model sizes:

- `tiny`: Fastest, lowest accuracy
- `base`: Good balance of speed and accuracy
- `small`: Better accuracy, moderate speed
- `medium`: High accuracy, slower
- `large`: Best accuracy, slowest

Choose based on your needs for accuracy vs. processing speed.

## Performance Tips

1. Use GPU acceleration when available
2. For batch processing, use smaller models first
3. Adjust confidence threshold based on your needs
4. Process long files in smaller chunks if memory is limited

## Troubleshooting

1. FFmpeg not found:

   - Ensure FFmpeg is installed and in system PATH
   - Try running `ffmpeg -version` in terminal

2. CUDA errors:

   - Check GPU compatibility
   - Try using CPU-only mode by setting `CUDA_VISIBLE_DEVICES=""`

3. Memory issues:
   - Use smaller model size
   - Process shorter audio segments
   - Close other memory-intensive applications

## License

[Your chosen license]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
