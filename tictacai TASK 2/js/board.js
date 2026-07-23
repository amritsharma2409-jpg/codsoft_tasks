/* ==========================================================================
   BOARD — Rendering, input, and win/draw detection
   Owns the 3x3 grid: drawing marks, handling human taps, deciding when
   a round is over, and animating the result. AI moves are placed
   through the same placeMark() used for human moves, so there is only
   ever one path that writes to state.board — no duplicated logic
   between a "human move" function and an "AI move" function.
   ========================================================================== */

import { state, resetRoundState } from './state.js';
import { WIN_PATTERNS } from './data.js';

/* --------------------------------------------------------------------------
   MODULE-LOCAL DOM REFS
   Cached once in initBoard() so every other function here can just
   read them instead of re-querying the DOM on every move.
   -------------------------------------------------------------------------- */
let boardEl = null;
let cellEls = [];
let winningLineEl = null;

// Set by initBoard(); called with the move result whenever a HUMAN
// click produces a legal move (main.js/ai.js use this to trigger the
// AI's reply, update the UI, open the result modal, etc).
let humanMoveCallback = null;

/* --------------------------------------------------------------------------
   PURE WIN / DRAW LOGIC
   No DOM, no state mutation — safe to reuse from ai.js's Minimax
   search as well, so the rules of the game are defined in exactly one
   place.
   -------------------------------------------------------------------------- */

/**
 * Checks a board array (9-length, '' | 'X' | 'O') for a winner.
 * Returns { symbol, pattern } on a win, or null otherwise.
 */
export function checkWinner(board) {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { symbol: board[a], pattern };
    }
  }
  return null;
}

/** True once every cell is filled (only meaningful if checkWinner() is null). */
export function isBoardFull(board) {
  return board.every((cell) => cell !== '');
}

/* --------------------------------------------------------------------------
   RENDERING HELPERS
   -------------------------------------------------------------------------- */

/** Paints a single cell's symbol/color class to match state.board[index]. */
function renderCell(index) {
  const cell = cellEls[index];
  const symbol = state.board[index];

  // `cell.textContent = ...` would wipe out every child node, including
  // the .cell-ripple <span> that lives inside each cell button (see
  // index.html) — silently killing the tap-ripple effect the very
  // first time any cell is rendered. Detach the ripple node first,
  // set the text, then reattach it.
  const rippleEl = cell.querySelector('.cell-ripple');
  cell.textContent = symbol || '';
  if (rippleEl) cell.appendChild(rippleEl);

  cell.classList.remove('x', 'o');
  if (symbol === 'X') cell.classList.add('x');
  if (symbol === 'O') cell.classList.add('o');
  cell.classList.toggle('filled', symbol !== '');

  // Keep the accessible name in sync with what's actually on the cell.
  cell.setAttribute('aria-label', symbol ? `Cell ${index + 1}, ${symbol}` : `Cell ${index + 1}, empty`);
}

/** Repaints every cell from state.board — used on restart. */
function renderAllCells() {
  cellEls.forEach((_, index) => renderCell(index));
}

/**
 * Fires the expanding-ring tap feedback on a cell (see .cell-ripple /
 * @keyframes cellRipple in board.css). Runs on every tap, even an
 * illegal one, so the board always feels responsive.
 */
function triggerRipple(cell) {
  cell.classList.remove('rippling');
  void cell.offsetWidth; // force reflow so the animation restarts if re-triggered fast
  cell.classList.add('rippling');
}

/**
 * Draws the glowing bar through the 3 winning cells. Positions it
 * with plain trigonometry: find the pixel midpoint of the first and
 * last cell in the pattern (relative to the board), then rotate a
 * horizontal bar to match the angle and distance between them.
 */
function drawWinningLine(pattern) {
  const [start, , end] = pattern;
  const boardRect = boardEl.getBoundingClientRect();
  const startRect = cellEls[start].getBoundingClientRect();
  const endRect = cellEls[end].getBoundingClientRect();

  const x1 = startRect.left + startRect.width / 2 - boardRect.left;
  const y1 = startRect.top + startRect.height / 2 - boardRect.top;
  const x2 = endRect.left + endRect.width / 2 - boardRect.left;
  const y2 = endRect.top + endRect.height / 2 - boardRect.top;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy) + 40; // slight overshoot past both end cells
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  winningLineEl.style.width = `${length}px`;
  winningLineEl.style.left = `${x1 - 20}px`;
  winningLineEl.style.top = `${y1}px`;

  // Set the rotation with scaleX still at 0 (its resting CSS state),
  // force a reflow, then flip to scaleX(1) so the transition on
  // `transform` actually animates the line drawing outward instead of
  // just snapping into place.
  winningLineEl.style.transform = `rotate(${angle}deg) scaleX(0)`;
  void winningLineEl.offsetWidth;
  winningLineEl.classList.add('show');
  winningLineEl.style.transform = `rotate(${angle}deg) scaleX(1)`;
}

/** Resets the winning line to its hidden, undrawn state. */
function hideWinningLine() {
  winningLineEl.classList.remove('show');
  winningLineEl.style.transform = 'scaleX(0)';
}

/** Adds/removes the glowing pulse on the 3 cells that formed the win. */
function highlightWinningCells(pattern) {
  pattern.forEach((index) => cellEls[index].classList.add('winning-cell'));
}

function clearWinningCells() {
  cellEls.forEach((cell) => cell.classList.remove('winning-cell'));
}

/* --------------------------------------------------------------------------
   LOCKING
   -------------------------------------------------------------------------- */

/** Enables/disables every cell button (game over, AI's turn, etc). */
export function setBoardLocked(locked) {
  cellEls.forEach((cell) => { cell.disabled = locked; });
}

/** Toggles the ambient "AI is deciding" glow pulse (see .game-board.thinking). */
export function setBoardThinking(isThinking) {
  boardEl.classList.toggle('thinking', isThinking);
}

/* --------------------------------------------------------------------------
   MOVE EXECUTION
   The one function that ever writes a mark to the board — used for
   both the human's clicks and the AI's moves, so win/draw detection
   and rendering never has to be written twice.
   -------------------------------------------------------------------------- */

/**
 * Places `symbol` ('X' | 'O') at `index`, renders it, and resolves the
 * round if it just ended. Returns a result object describing what
 * happened, so the caller (board.js's own click handler, or ai.js)
 * can react — open a modal, update stats, trigger confetti, etc.
 */
export function placeMark(index, symbol) {
  state.board[index] = symbol;
  state.moveCount += 1;
  renderCell(index);

  const win = checkWinner(state.board);
  const draw = !win && isBoardFull(state.board);
  const gameOver = Boolean(win || draw);

  if (win) {
    state.gameActive = false;
    highlightWinningCells(win.pattern);
    drawWinningLine(win.pattern);
    setBoardLocked(true);
  } else if (draw) {
    state.gameActive = false;
    setBoardLocked(true);
  } else {
    // Round continues — hand the turn to the other player.
    state.currentPlayer = symbol === 'X' ? 'O' : 'X';
  }

  return {
    index,
    symbol,
    gameOver,
    isDraw: draw,
    winner: win ? win.symbol : null,
    pattern: win ? win.pattern : null
  };
}

/* --------------------------------------------------------------------------
   HUMAN INPUT
   -------------------------------------------------------------------------- */

/** Click handler bound to every cell button. */
function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  triggerRipple(cell); // tactile feedback fires even on an illegal tap

  const isHumansTurn = state.currentPlayer === 'X';
  const isCellEmpty = state.board[index] === '';
  if (!state.gameActive || !isHumansTurn || !isCellEmpty) return;

  const result = placeMark(index, 'X');
  if (humanMoveCallback) humanMoveCallback(result);
}

/* --------------------------------------------------------------------------
   RESTART
   -------------------------------------------------------------------------- */

/** Clears the board back to a fresh, playable round. */
export function resetBoard() {
  resetRoundState();
  clearWinningCells();
  hideWinningLine();
  setBoardThinking(false);
  setBoardLocked(false);
  renderAllCells();
}

/* --------------------------------------------------------------------------
   BOOTSTRAP
   -------------------------------------------------------------------------- */

/**
 * Caches DOM refs and wires up click handling. Call once from main.js.
 * @param {(result: object) => void} onHumanMove - invoked after every
 *   legal human move with the same result shape placeMark() returns.
 */
export function initBoard(onHumanMove) {
  boardEl = document.getElementById('gameBoard');
  winningLineEl = document.getElementById('winningLine');
  cellEls = Array.from(boardEl.querySelectorAll('.cell'));
  humanMoveCallback = onHumanMove;

  cellEls.forEach((cell) => cell.addEventListener('click', handleCellClick));
}
