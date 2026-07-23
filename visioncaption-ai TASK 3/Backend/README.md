# VisionCaption AI 🖼️

A production-ready, full-stack AI image captioning platform — upload an image and get an AI-generated caption, along with optional OCR (text extraction) and object detection, powered entirely by free, open-source Hugging Face models.

🔗 **Live Demo:** https://visioncaption-ai-final19.vercel.app/

## Features

- 🧠 **Image Captioning** — BLIP model generates natural-language descriptions of any uploaded image
- 🔎 **Object Detection** — DETR model identifies and labels objects within the image
- 📝 **OCR (Text Extraction)** — TrOCR reads and extracts any text present in the image
- 📜 **History** — past captioning requests are stored and retrievable
- 🎨 **Modern UI** — dark/light theme, drag-and-drop upload, animated transitions (Framer Motion)
- 🚦 **Rate limiting** — API requests are throttled server-side to prevent abuse
- 🔒 **Secure by design** — CORS-restricted, environment-based secrets, no hardcoded keys

## Tech Stack

**Frontend**
- Next.js 15 (App Router) + React 18 + TypeScript
- Tailwind CSS + Framer Motion for animation
- Zustand for client-side state
- Axios for API communication
- Radix UI primitives (dialog, dropdown, tabs, toast)

**Backend**
- FastAPI (Python) + Uvicorn/Gunicorn
- PyTorch + Hugging Face Transformers
  - **BLIP** — image captioning
  - **TrOCR** — optical character recognition
  - **DETR** — object detection
- SQLAlchemy + SQLite (async, via `aiosqlite`) for request history
- SlowAPI for rate limiting
- python-jose + passlib for auth/security primitives

## Project Structure   
visioncaption-ai/
├── Frontend/ # Next.js app
│ ├── app/ # Pages (landing, /try)
│ ├── components/ # Upload, caption, layout, UI components
│ ├── hooks/ # Caption generation, OCR, image upload hooks
│ └── lib/ # API client, types, validators
├── Backend/ # FastAPI app
│ ├── app/api/v1/endpoints/ # caption, detection, ocr, upload, history, health
│ ├── app/services/ # BLIP, OCR, object detection, image, cache services
│ ├── app/core/ # security, error handling, logging
│ ├── app/db/ # database models + connection
│ └── Dockerfile
├── .github/workflows/ # CI pipelines for frontend & backend
└── docs/DEPLOYMENT.md # Full deployment walkthrough (Vercel + Render)

## Running Locally

**Backend**
```bash
cd Backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # fill in your own values
uvicorn app.main:app --reload
```
API runs at `http://localhost:8000` — health check at `/api/v1/health`.

**Frontend**
```bash
cd Frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```
App runs at `http://localhost:3000`.

## Deployment

Full step-by-step deployment guide (Vercel for frontend, Render for backend, both free-tier) is in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

Live version of this project is deployed exactly this way:
- **Frontend:** Vercel → https://visioncaption-ai-final19.vercel.app/
- **Backend:** Render (FastAPI + Docker)

## API Endpoints

| Endpoint | Description |
|---|---|
| `POST /api/v1/upload` | Upload an image |
| `POST /api/v1/caption` | Generate a caption for an image |
| `POST /api/v1/ocr` | Extract text from an image |
| `POST /api/v1/detection` | Detect objects in an image |
| `GET /api/v1/history` | Retrieve past requests |
| `GET /api/v1/health` | Health/status check |

## License

Open source — feel free to use, modify, and learn from this project.
