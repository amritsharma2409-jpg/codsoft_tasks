# MindEase 🌿

An AI-powered mental wellness companion chatbot, built with vanilla HTML/CSS/JS and the Gemini API.

## Setup

1. Get a free Gemini API key: https://aistudio.google.com/app/apikey
2. Open `js/config.js`
3. Replace `PASTE_YOUR_NEW_GEMINI_KEY_HERE` with your key
4. Open `index.html` in your browser (or serve via `python -m http.server`)

## ⚠️ Important — API Key Safety

- `js/config.js` is listed in `.gitignore` — **never commit it**
- Never paste your API key in chat, forums, or public repos
- If a key is ever exposed publicly, regenerate it immediately at the link above
- This demo calls Gemini directly from the browser (fine for personal/learning use).
  For a real production app with public users, move the API call to a backend server
  so the key never reaches the browser at all.

## Project Structure

```
mindease-pro/
├── index.html       → Page structure
├── css/
│   └── style.css    → All styling & animations
├── js/
│   ├── config.js    → Your API key (gitignored)
│   └── chat.js       → Chat logic + Gemini API calls
├── .gitignore
└── README.md
```

## Features

- Calming, therapist-style UI (earthy tones, serif headings)
- Empathetic system prompt tuned for emotional support
- Quick-start conversation chips
- Typing indicator animation
- Crisis helpline link (iCall India: 9152987821)
- Fully responsive (mobile-friendly)

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript
- Google Gemini API (`gemini-1.5-flash`)

## Disclaimer

MindEase is an AI companion, not a licensed therapist or medical professional.
It is not a substitute for professional mental health care. If someone is in crisis,
direct them to a licensed professional or crisis helpline immediately.
