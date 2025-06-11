# Caption: Audio/Video Transcription Platform

## Overview

Caption is a full-stack application for transcribing audio and video files with word-level timestamps and confidence scores.  
It consists of:

- **Model Server:** FastAPI backend (with ML models, e.g., Whisper) running in Docker.
- **Client:** React frontend for uploading files, live recording, and managing transcriptions.

---

## Features

- Upload audio/video files for transcription
- Live audio recording and transcription
- Word-level timestamps and confidence scores
- User authentication (Supabase)
- Stripe integration for credits/payments
- Background processing (optionally with Celery + Redis)
- Download SRT and JSON results
- Responsive UI

---

## Project Structure

```
Caption/
│
├── model-service/         # FastAPI backend (Dockerized)
│   ├── api/               # API routers (audio, video, etc.)
│   ├── handlers/          # Processing logic (e.g., VideoProcessor)
│   ├── main.py            # FastAPI app entrypoint
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile         # Docker build file
│   └── ...                # Other backend files
│
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components (upload, audiototext, record, etc.)
│   │   └── ...            # Other frontend code
│   └── ...                # React config, public, etc.
│
├── docker-compose.yml     # (If using Celery/Redis)
└── README.md
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (for client)
- [Supabase](https://supabase.com/) project (for auth)
- (Optional) [Redis](https://redis.io/) and [Celery](https://docs.celeryq.dev/) for background tasks

---

### 1. Backend: Model Server

#### Build and Run with Docker

```sh
cd model-service
docker build -t caption-backend .
docker run -d -p 8000:8000 --env-file .env --name caption-backend caption-backend
```

- The API will be available at `http://localhost:8000/docs`

#### Environment Variables

Create a `.env` file in `model-service/` with:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
STRIPE_SECRET_KEY=your_stripe_key
# (Add any other needed variables)
```

#### API Endpoints

- `POST /analyze/audio/transcribe` — Transcribe audio file
- `POST /analyze/video/transcribe` — Transcribe video file
- `GET /analyze/audio/task-status/{task_id}` — Check audio task status (if using Celery)
- `GET /analyze/video/task-status/{task_id}` — Check video task status (if using Celery)

---

### 2. Frontend: React Client

#### Setup

```sh
cd client
npm install
```

#### Environment Variables

Create a `.env` file in `client/` with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

#### Run the Client

```sh
npm run dev
```

- The app will be available at `http://localhost:5173` (or as shown in your terminal).

---

## Optional: Background Processing with Celery + Redis

If you want to enable background task processing:

1. Add `celery` and `redis` to `requirements.txt`
2. Use the provided `docker-compose.yml` to start backend, celery worker, and redis:

```sh
docker-compose up --build
```

---

## Usage

- Go to the client app, sign in, and upload or record audio/video.
- The backend will process the file and return results.
- Download SRT or JSON as needed.

---

## Contact

- **Email:** [hello@dobedosoft.com](mailto:hello@dobedosoft.com)
- **Phone:** +91 9726181166
- **Address:** DOBODO soft, MOTA VARACHA, Surat, India
- **[LinkedIn](https://www.linkedin.com/company/dobedo-soft/)**
- **[GitHub](https://github.com/UtsavSavani08)**

---

## License

MIT License

---

## Credits

- [OpenAI Whisper](https://github.com/openai/whisper)
- [Supabase](https://supabase.com/)
- [Stripe](https://stripe.com/)
- [EmailJS](https://www.emailjs.com/)
