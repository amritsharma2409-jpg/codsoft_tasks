/* ==========================================================================
   MODAL — Result popup (Win / Lose / Draw)
   The one place a game-over is actually shown to the player. Reads
   state.js directly for the recap numbers (moves, streak, win rate)
   so nothing here duplicates math that state.js already owns.
   ========================================================================== */

import { state, getWinRate } from './state.js';

/* --------------------------------------------------------------------------
   MODULE-LOCAL DOM REFS + FOCUS-TRAP STATE
   -------------------------------------------------------------------------- */
let modalOverlayEl, closeBtnEl, iconEl, titleEl, subtitleEl;
let movesEl, streakEl, winRateEl, playAgainBtnEl, shareBtnEl;

let lastFocusedEl = null;   // element to restore focus to on close
let onPlayAgainCallback = null;

const CLOSE_TRANSITION_MS = 400; // matches .modal-overlay's opacity/visibility transition (var(--t-mid))

/* --------------------------------------------------------------------------
   COPY — per-outcome icon, title, and subtitle
   -------------------------------------------------------------------------- */
const OUTCOME_COPY = {
  win:  { icon: '🎉', title: 'You Win!',    subtitle: "Nice moves. The AI didn't see that coming." },
  lose: { icon: '🤖', title: 'AI Wins',     subtitle: 'The AI calculated its way to victory.' },
  draw: { icon: '🤝', title: "It's a Draw", subtitle: 'Neither side blinked.' }
};

/* --------------------------------------------------------------------------
   KEYBOARD — ESC to close, Tab trapped inside the modal
   -------------------------------------------------------------------------- */
function getFocusableElements() {
  return [closeBtnEl, playAgainBtnEl, shareBtnEl];
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeModal();
    return;
  }
  if (event.key !== 'Tab') return;

  const focusable = getFocusableElements();
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  // Wrap focus around instead of letting Tab escape onto the page behind the modal.
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* --------------------------------------------------------------------------
   SHARE SCORE
   -------------------------------------------------------------------------- */

/** Swaps the button's visible label text without touching its icon SVG. */
function setShareLabel(text) {
  const textNode = Array.from(shareBtnEl.childNodes)
    .find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '');
  if (textNode) textNode.textContent = ` ${text}`;
}

function buildShareText() {
  return `I just played TicTacAI — ${state.stats.gamesPlayed} games, ` +
    `${state.stats.bestStreak} best streak, ${getWinRate()}% win rate. ` +
    `Think you can beat an unbeatable AI?`;
}

/** Uses the native share sheet where available, otherwise copies to clipboard. */
async function handleShare() {
  const text = buildShareText();

  if (navigator.share) {
    try {
      await navigator.share({ text, title: 'TicTacAI' });
    } catch (err) {
      // User closed the native share sheet without picking anything — not an error.
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setShareLabel('Copied!');
    setTimeout(() => setShareLabel('Share Score'), 2000);
  } catch (err) {
    console.warn('TicTacAI: could not copy share text.', err);
  }
}

/* --------------------------------------------------------------------------
   OPEN / CLOSE
   -------------------------------------------------------------------------- */

/**
 * Opens the result popup for a just-finished round.
 * @param {{winner: string|null, isDraw: boolean}} result - the same
 *   shape board.js's placeMark() returns.
 */
export function openResultModal(result) {
  lastFocusedEl = document.activeElement;

  const outcome = result.winner === 'X' ? 'win' : result.winner === 'O' ? 'lose' : 'draw';
  const copy = OUTCOME_COPY[outcome];

  iconEl.textContent = copy.icon;
  iconEl.classList.remove('result-win', 'result-lose', 'result-draw');
  iconEl.classList.add(`result-${outcome}`);
  titleEl.textContent = copy.title;
  subtitleEl.textContent = copy.subtitle;

  movesEl.textContent = state.moveCount;
  streakEl.textContent = state.stats.currentStreak;
  winRateEl.textContent = `${getWinRate()}%`;

  modalOverlayEl.hidden = false;
  // Force a reflow before adding `.open` so the scale/fade-in transition
  // actually plays instead of the modal just appearing already-open.
  void modalOverlayEl.offsetWidth;
  modalOverlayEl.classList.add('open');

  document.addEventListener('keydown', handleKeydown);
  playAgainBtnEl.focus();
}

/** Closes the popup and restores focus to whatever opened it. */
export function closeModal() {
  modalOverlayEl.classList.remove('open');
  document.removeEventListener('keydown', handleKeydown);

  setTimeout(() => {
    modalOverlayEl.hidden = true;
    if (lastFocusedEl) lastFocusedEl.focus();
  }, CLOSE_TRANSITION_MS);
}

/* --------------------------------------------------------------------------
   BOOTSTRAP
   -------------------------------------------------------------------------- */

/**
 * Caches DOM refs and wires up all modal interactions. Call once from main.js.
 * @param {() => void} onPlayAgain - invoked when "Play Again" is clicked,
 *   after the modal has already started closing (main.js restarts the round).
 */
export function initModal(onPlayAgain) {
  modalOverlayEl = document.getElementById('resultModal');
  closeBtnEl = document.getElementById('modalCloseBtn');
  iconEl = document.getElementById('modalIcon');
  titleEl = document.getElementById('modalTitle');
  subtitleEl = document.getElementById('modalSubtitle');
  movesEl = document.getElementById('modalMoves');
  streakEl = document.getElementById('modalStreak');
  winRateEl = document.getElementById('modalWinRate');
  playAgainBtnEl = document.getElementById('modalPlayAgainBtn');
  shareBtnEl = document.getElementById('modalShareBtn');

  onPlayAgainCallback = onPlayAgain;

  closeBtnEl.addEventListener('click', closeModal);

  // Clicking the dim backdrop (not the modal card itself) also closes it.
  modalOverlayEl.addEventListener('click', (event) => {
    if (event.target === modalOverlayEl) closeModal();
  });

  playAgainBtnEl.addEventListener('click', () => {
    closeModal();
    if (onPlayAgainCallback) onPlayAgainCallback();
  });

  shareBtnEl.addEventListener('click', handleShare);
}
