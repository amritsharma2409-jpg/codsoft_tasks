# TicTacAI — Play Against an Unbeatable Mind

A premium, single-page Tic-Tac-Toe game with an AI opponent powered by **Minimax with Alpha-Beta pruning**. Three difficulty levels, persistent stats, achievements, ambient canvas backgrounds, and a full dark/light/auto theme system — built entirely with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow.svg)

---
# TicTacAI — Play Against an Unbeatable Mind

A premium, single-page Tic-Tac-Toe game with an AI opponent powered by **Minimax with Alpha-Beta pruning**. Three difficulty levels, persistent stats, achievements, ambient canvas backgrounds, and a full dark/light/auto theme system — built entirely with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies.

🔗 **Live Demo:** https://amritsharma2409-jpg.github.io/tictacai/

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow.svg)

---
## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [How the AI Works (Minimax + Alpha-Beta Pruning)](#how-the-ai-works-minimax--alpha-beta-pruning)
- [Folder Structure](#folder-structure)
- [Known Issues Fixed](#known-issues-fixed-in-this-version)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- 🧠 **Three difficulties** — Easy (mostly random), Medium (takes wins/blocks), Impossible (full Minimax search, never loses)
- 🎨 **Ambient animated background** — drifting canvas blobs, dust particles, film grain, and a vignette
- 🌗 **Dark / Light / Auto theme** — Auto follows the OS `prefers-color-scheme` live, no reload needed
- 🏆 **Achievements system** — First Win, Win Streak, Beat Impossible AI, Speed Win, with a queued toast notification
- 📊 **Persistent stats** — games played, current/best streak, win rate, saved via `localStorage`
- 🎉 **Confetti & fireworks** — canvas-based particle bursts on wins and streaks
- 🔊 **Synthesized audio** — every sound effect is generated live via the Web Audio API — zero audio files
- 📱 **Fully responsive** — tuned breakpoints from small phones to large desktop monitors, plus a landscape-phone layout
- ♿ **Accessibility-minded** — focus-trapped modal, `aria-live` regions, keyboard support, `prefers-reduced-motion` support
- 📤 **Share your score** — native Web Share API where available, clipboard fallback otherwise

## Screenshots

> Replace these placeholders with real screenshots or a GIF once you've deployed the app.

| Home Screen | Gameplay | Result Modal |
|---|---|---|
| ![Home screen placeholder](docs/screenshots/home.png) | ![Gameplay placeholder](docs/screenshots/gameplay.png) | ![Result modal placeholder](docs/screenshots/modal.png) |

## Technologies Used

- **HTML5** — semantic markup, ARIA roles/attributes
- **CSS3** — custom properties (design tokens), Grid, Flexbox, `clamp()`, `backdrop-filter`, keyframe animations, media queries
- **Vanilla JavaScript (ES Modules)** — no bundler required; loaded natively via `<script type="module">`
- **Canvas 2D API** — ambient background + confetti/firework effects
- **Web Audio API** — all sound effects synthesized at runtime
- **localStorage** — persisted scores, stats, achievements, and theme preference

No npm, no build tools, no external JS libraries.

## Installation

Because this project uses native ES Modules (`import`/`export`), it must be served over `http://` — opening `index.html` directly via `file://` will fail due to browser CORS restrictions on modules.

**Option 1 — VS Code Live Server**
1. Clone the repo and open the folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html` → "Open with Live Server".

**Option 2 — Python's built-in server**
```bash
git clone https://github.com/<your-username>/tictacai.git
cd tictacai
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option 3 — Node's `serve`**
```bash
npx serve .
```

## How the AI Works (Minimax + Alpha-Beta Pruning)

On **Impossible** difficulty, the AI never loses. Here's why:

1. **Minimax** explores every possible sequence of remaining moves to its end (win, loss, or draw), treating the game as a tree. The AI (`O`) is the *maximizing* player and the human (`X`) is the *minimizing* player — at each level, the AI assumes the human will always play their best possible counter-move.
2. Each terminal state (win/loss/draw) is scored. A win for the AI scores `10 - depth`, a win for the human scores `depth - 10`, and a draw scores `0`. Subtracting the depth means the AI always prefers the *fastest* win and the *slowest* loss among otherwise equal outcomes.
3. **Alpha-Beta pruning** is a search optimization on top of Minimax: it discards ("prunes") branches of the tree that can't possibly change the final decision, because a better option has already been found elsewhere. This produces the exact same result as plain Minimax, just without wasting time evaluating moves the opponent would never actually allow.
4. Because Tic-Tac-Toe has a small enough state space (at most 9! ≈ 362,880 board states, far fewer once illegal continuations are excluded), this search completes in milliseconds — the artificial "thinking" delay you see in the UI is intentionally added so the AI's move feels considered rather than instantaneous.

**Easy** and **Medium** difficulties deliberately don't use this search:
- **Medium** only checks "can I win right now?" and "must I block a human win right now?" — otherwise it plays randomly.
- **Easy** plays a Medium-quality move about 25% of the time and otherwise plays fully at random, so newer players can actually win.

## Folder Structure

```
tictacai/
├── index.html                 # Single HTML entry point
├── README.md
├── LICENSE
├── css/
│   ├── variables.css          # Design tokens: colors, spacing, radius, motion, z-index
│   ├── base.css               # Reset, typography, app shell, shared utility classes
│   ├── background.css         # Ambient canvas layers, grain texture, vignette
│   ├── home.css                # Landing screen (logo, tagline, Play button)
│   ├── board.css              # Game board, cells, win-line, win-pulse animations
│   ├── layout.css             # Game screen chrome: difficulty, turn panel, scoreboard, stats
│   ├── popups.css             # Result modal + achievement toast
│   ├── animations.css         # Keyframes shared across 2+ components
│   └── responsive.css         # Breakpoints and layout-shape overrides
└── js/
    ├── data.js                 # Static data: win patterns, AI message pools, achievement defs
    ├── state.js                 # Single source of truth + localStorage persistence
    ├── board.js                 # Rendering, input handling, win/draw detection
    ├── ai.js                    # Easy/Medium/Impossible logic, Minimax + Alpha-Beta search
    ├── ui.js                    # Read-only DOM painting (scoreboard, stats, turn indicator)
    ├── modal.js                  # Result popup: open/close, focus trap, share
    ├── achievements.js            # Achievement unlock checks + toast queue
    ├── particles.js                # Canvas background loop + confetti/firework bursts
    ├── audio.js                    # Web Audio API sound synthesis
    ├── theme.js                    # Dark/Light/Auto theme handling
    ├── home.js                      # Screen switching + loader
    └── main.js                       # App bootstrap — wires every module together
```

## Known Issues Fixed in This Version

A senior-level pass over the codebase found and fixed the following real bugs:

| # | Bug | File(s) | Fix |
|---|-----|---------|-----|
| 1 | `renderCell()` used `cell.textContent = symbol`, which deleted the `.cell-ripple` child element on every render — breaking the tap-ripple effect from the very first move | `board.js` | Detach the ripple node before setting text, reattach after |
| 2 | A pending AI move (`setTimeout`) wasn't cancelled or re-validated after Restart/Back, so a stale move could land on the next round and corrupt persisted stats | `ai.js`, `main.js` | Added `cancelAIMove()`, called on Restart/Play Again/Back, plus a state re-check inside the callback |
| 3 | `AudioContext` was never resumed if the browser created it in a `suspended` state (e.g., first triggered by a hover, not a click), silencing all sound for the session | `audio.js` | Resume the context whenever it's found suspended |
| 4 | Difficulty buttons had no `aria-pressed` state for assistive tech | `ui.js`, `index.html` | Sync `aria-pressed` with the active difficulty on every render |
| 5 | Turn changes weren't in a live region | `index.html` | Added `aria-live="polite"` to the turn indicator |

## Future Improvements

- [ ] Two-player local mode (human vs. human)
- [ ] Online multiplayer via WebSockets
- [ ] Larger board variants (4×4, 5×5) with adjustable win-length
- [ ] Adjustable AI "personality" (aggressive vs. defensive weighting)
- [ ] Installable as a PWA with offline support
- [ ] Automated tests for `checkWinner()`, `minimax()`, and achievement conditions
- [ ] Replace the hand-maintained color mirror in `particles.js` with a shared token source

## License

Released under the [MIT License](LICENSE) — free to use, modify, and distribute.
