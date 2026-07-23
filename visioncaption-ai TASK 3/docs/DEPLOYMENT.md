# VisionCaption AI — Deployment Guide

This guide walks through deploying VisionCaption AI end-to-end using only
free-tier services: Vercel (frontend), Render (backend), and Hugging Face
open-source models (no paid AI APIs).

---

## 1. Prerequisites

- GitHub account with this repository pushed
- Vercel account (free tier)
- Render account (free/standard tier)
- Node.js 18+ and Python 3.11+ installed locally for testing

---

## 2. Backend Deployment (Render)

1. **Push to GitHub** — ensure `backend/` contains `Dockerfile`, `render.yaml`,
   and `requirements.txt`.
2. In Render, click **New → Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Root Directory:** `backend`
   - **Runtime:** Docker (Render reads `render.yaml` automatically if present)
   - **Region:** closest to your users
   - **Instance Type:** Standard (Free tier works but cold-starts are slower)
5. Add a **persistent disk**:
   - Mount path: `/app/model_cache`
   - Size: 5GB (BLIP + TrOCR + DETR weights total a few GB)
6. Set environment variables (or let `render.yaml` populate them):
   - `SECRET_KEY` (generate a strong random value)
   - `CORS_ORIGINS` → your Vercel frontend URL, e.g.
     `["https://visioncaption.vercel.app"]`
7. Deploy. First boot will take several minutes while models download and
   cache to the persistent disk. Subsequent deploys are much faster.
8. Verify: visit `https://<your-service>.onrender.com/api/v1/health` — expect
   `{"status": "ok", "model_loaded": true, ...}`.

---

## 3. Frontend Deployment (Vercel)

1. In Vercel, click **Add New → Project**.
2. Import the same GitHub repository.
3. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js (auto-detected)
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
     (e.g. `https://visioncaption-ai-backend.onrender.com`)
5. Deploy. Vercel builds and serves the app on a `*.vercel.app` domain.
6. (Optional) Attach a custom domain under **Project → Settings → Domains**.

---

## 4. Connecting Frontend & Backend

- Update `CORS_ORIGINS` on Render to include your final Vercel domain
  (and custom domain, if used) once deployed.
- Update `NEXT_PUBLIC_API_URL` on Vercel if the Render service URL changes.
- Redeploy both services after changing environment variables.

---

## 5. GitHub Actions CI

Two workflows run automatically on push/PR to `main`:

- `.github/workflows/frontend-ci.yml` — lint, type-check, and build the
  Next.js app.
- `.github/workflows/backend-ci.yml` — install dependencies and run backend
  tests.

These do not deploy — Vercel and Render handle deployment via their own
GitHub integrations (auto-deploy on push once connected).

---

## 6. Post-Deployment Checklist

- [ ] `/api/v1/health` returns `model_loaded: true` on the backend
- [ ] Frontend loads and the upload flow reaches the backend without CORS errors
- [ ] Environment secrets (`SECRET_KEY`) are not committed to the repo
- [ ] Persistent disk is attached so models aren't re-downloaded per deploy
- [ ] Custom domains (if any) have SSL provisioned (automatic on both platforms)

---

## 7. Scaling Notes (Still Free/Low-Cost)

- Render's free web service tier spins down on inactivity — expect a cold
  start on the first request after idling. Upgrade to a paid instance only
  when consistent uptime is required.
- Model inference is CPU-bound by default (`MODEL_DEVICE=cpu`); this is
  sufficient for demo/low-traffic use. For higher throughput, a GPU-backed
  instance can be used by setting `MODEL_DEVICE=cuda` on a provider that
  offers it.
- The in-memory cache (`cache_service.py`) reduces repeat inference cost for
  identical image + language requests within the same process lifetime.