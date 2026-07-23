# VisionCaption AI — Frontend

Premium Next.js 15 + TypeScript + Tailwind CSS frontend for VisionCaption AI,
an AI-powered image captioning SaaS.

## Stack

- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS + Framer Motion
- Zustand for client state
- Axios for API calls

## Local Development

```bash
npm install

cp .env.local.example .env.local
# set NEXT_PUBLIC_API_URL to your backend URL

npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler checks |

## Project Structure