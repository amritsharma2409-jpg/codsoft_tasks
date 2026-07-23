/* ==========================================================================
   AI — Opponent logic
   Three difficulties built on the same primitives:
     Easy       - mostly random, occasionally plays smart
     Medium     - takes an immediate win/block, otherwise random
     Impossible - full Minimax + Alpha-Beta search — never loses
   Reuses checkWinner()/isBoardFull() from board.js so "what counts as
   a win" is defined in exactly one place in the whole app.
   ========================================================================== */

import { state } from './state.js';
import { getRandomMessage } from './data.js';
import { checkWinner, isBoardFull, placeMark, setBoardThinking, setBoardLocked } from './board.js';

const HUMAN = 'X';
const AI = 'O';

// Tracks the in-flight "AI is thinking" timeout so a Restart/Back that
// happens mid-think can cancel it explicitly (see cancelAIMove below).
let pendingMoveTimeoutId = null;

/* --------------------------------------------------------------------------
   SHARED HELPERS
   -------------------------------------------------------------------------- */

/** Indices of every empty cell on a given board array. */
function getEmptyIndices(board) {
  return board.reduce((acc, cell, index) => {
    if (cell === '') acc.push(index);
    return acc;
  }, []);
}

/**
 * If placing `symbol` on any empty cell would win immediately, returns
 * that cell's index. Otherwise null. Used by Medium mode to take wins
 * and block threats without a full lookahead search.
 */
function findImmediateMove(board, symbol) {
  for (const index of getEmptyIndices(board)) {
    const testBoard = board.slice();
    testBoard[index] = symbol;
    if (checkWinner(testBoard)) return index;
  }
  return null;
}

/* --------------------------------------------------------------------------
   MINIMAX + ALPHA-BETA PRUNING
   AI (O) maximizes, human (X) minimizes. Scores favor faster wins and
   slower losses (10 - depth / depth - 10) so the AI always prefers the
   quickest win and the most delayed loss among equally "safe" moves.
   -------------------------------------------------------------------------- */
function minimax(board, depth, isMaximizing, alpha, beta) {
  const win = checkWinner(board);
  if (win) return win.symbol === AI ? 10 - depth : depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (const index of getEmptyIndices(board)) {
      const testBoard = board.slice();
      testBoard[index] = AI;
      best = Math.max(best, minimax(testBoard, depth + 1, false, alpha, beta));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break; // prune — human would never let this branch happen
    }
    return best;
  }

  let best = Infinity;
  for (const index of getEmptyIndices(board)) {
    const testBoard = board.slice();
    testBoard[index] = HUMAN;
    best = Math.min(best, minimax(testBoard, depth + 1, true, alpha, beta));
    beta = Math.min(beta, best);
    if (beta <= alpha) break; // prune — AI would never let this branch happen
  }
  return best;
}

/** Runs a full Minimax search and returns the AI's optimal move. Unbeatable. */
function findBestMove(board) {
  let bestScore = -Infinity;
  let bestIndex = null;

  for (const index of getEmptyIndices(board)) {
    const testBoard = board.slice();
    testBoard[index] = AI;
    const score = minimax(testBoard, 0, false, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }
  return bestIndex;
}

/* --------------------------------------------------------------------------
   DIFFICULTY MODES
   -------------------------------------------------------------------------- */

/** Random empty cell — the fallback every mode drops to when no rule fires. */
function getRandomMove(board) {
  const empty = getEmptyIndices(board);
  return empty[Math.floor(Math.random() * empty.length)];
}

/** Takes an immediate win or block if one exists; otherwise plays randomly. */
function getMediumMove(board) {
  const winMove = findImmediateMove(board, AI);
  if (winMove !== null) return winMove;

  const blockMove = findImmediateMove(board, HUMAN);
  if (blockMove !== null) return blockMove;

  return getRandomMove(board);
}

/**
 * Mostly random so new players can actually win, but plays a Medium
 * move some of the time so Easy doesn't feel completely brainless.
 */
function getEasyMove(board) {
  if (Math.random() < 0.25) return getMediumMove(board);
  return getRandomMove(board);
}

/** Picks a move for `difficulty` against the given board. Pure — no state reads. */
export function pickAIMove(board, difficulty) {
  if (difficulty === 'easy') return getEasyMove(board);
  if (difficulty === 'medium') return getMediumMove(board);
  return findBestMove(board); // 'impossible'
}

/* --------------------------------------------------------------------------
   ORCHESTRATION
   Ties the pure move-picking above to the board's thinking/locked
   visuals and to placeMark() — the single function that ever writes
   a mark to state.board (see board.js).
   -------------------------------------------------------------------------- */

/**
 * Runs the AI's turn: shows the "thinking" pulse for a short delay,
 * then plays its move via board.js's placeMark().
 * @param {(result: object, message: string) => void} onAIMoveComplete
 *   Called with the placeMark() result and the taunt line shown while
 *   thinking, so ui.js/modal.js can react (update text, open a popup).
 */
export function triggerAIMove(onAIMoveComplete) {
  if (!state.gameActive || state.currentPlayer !== AI) return;

  setBoardThinking(true);
  setBoardLocked(true);

  const message = getRandomMessage('thinking', state.lastAIMessage);
  state.lastAIMessage = message;

  // A brief artificial delay — an instant move reads as "not actually
  // thinking," even though Minimax itself resolves near-instantly.
  const delay = 450 + Math.random() * 450;

  pendingMoveTimeoutId = setTimeout(() => {
    pendingMoveTimeoutId = null;

    // Re-validate: a Restart/Back may have reset the round (or ended
    // the game) during the delay. Without this check, a move meant
    // for the old round gets written onto whatever board exists now.
    if (!state.gameActive || state.currentPlayer !== AI) {
      setBoardThinking(false);
      return;
    }

    const index = pickAIMove(state.board, state.difficulty);
    const result = placeMark(index, AI);

    setBoardThinking(false);
    if (!result.gameOver) setBoardLocked(false);

    onAIMoveComplete(result, message);
  }, delay);
}

/**
 * Cancels a pending AI move, if one is scheduled. Call this before
 * resetting the board (Restart, Play Again, Back) so a stale move
 * from the previous round can never land on the new one.
 */
export function cancelAIMove() {
  if (pendingMoveTimeoutId) {
    clearTimeout(pendingMoveTimeoutId);
    pendingMoveTimeoutId = null;
  }
  setBoardThinking(false);
}
