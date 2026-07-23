/* ==========================================================================
   MAIN — Bootstrap
   Imports every module and wires them together. Nothing here owns any
   game logic of its own — it only reacts to callbacks from board.js/
   ai.js/home.js/modal.js and calls the right render/audio/state
   functions in response. This is the only file that imports (almost)
   everything else, by design.
   ========================================================================== */

import { state, loadPersisted, persist, resetScores, markAsPlayed } from './state.js';
import { getRandomMessage } from './data.js';
import { initTheme } from './theme.js';
import * as audio from './audio.js';
import { initParticles, triggerConfetti, cancelFx } from './particles.js';
import { initBoard, resetBoard } from './board.js';
import { triggerAIMove, cancelAIMove } from './ai.js';
import { initAchievements, checkAchievements } from './achievements.js';
import * as ui from './ui.js';
import { initModal, openResultModal } from './modal.js';
import { initHome } from './home.js';

/* --------------------------------------------------------------------------
   ROUND END — shared by both a human win/draw and an AI win/draw
   Updates persisted score/stats, plays the matching sound/haptic/
   confetti, checks achievements, then opens the result popup.
   -------------------------------------------------------------------------- */
function handleRoundEnd(result) {
  state.stats.gamesPlayed += 1;

  if (result.winner === 'X') {
    state.scores.X += 1;
    state.stats.lastWinner = 'You';
    state.stats.currentStreak += 1;
    state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.currentStreak);
  } else if (result.winner === 'O') {
    state.scores.O += 1;
    state.stats.lastWinner = 'AI';
    state.stats.currentStreak = 0;
  } else {
    state.scores.draws += 1;
    state.stats.lastWinner = 'Draw';
    state.stats.currentStreak = 0;
  }

  markAsPlayed();
  persist();

  ui.renderScoreboard();
  ui.renderStats();

  if (result.winner === 'X') {
    audio.playWinSound();
    audio.vibrate([15, 40, 15]);
    triggerConfetti();
  } else if (result.winner === 'O') {
    audio.playLoseSound();
    audio.vibrate([30]);
  } else {
    audio.playDrawSound();
  }

  checkAchievements({
    result: result.winner === 'X' ? 'win-human' : result.winner === 'O' ? 'win-ai' : 'draw',
    difficulty: state.difficulty,
    moveCount: state.moveCount,
    currentStreak: state.stats.currentStreak
  });

  openResultModal(result);
}

/* --------------------------------------------------------------------------
   MOVE CALLBACKS
   -------------------------------------------------------------------------- */

/** Fired by board.js right after a legal human tap lands. */
function onHumanMove(result) {
  audio.playMoveSound('X');
  audio.vibrate();
  ui.renderStats();

  if (result.gameOver) {
    handleRoundEnd(result);
    return;
  }

  // AI's turn next — show its reaction to the move just played, then let it think.
  const reaction = getRandomMessage('afterHumanMove', state.lastAIMessage);
  state.lastAIMessage = reaction;
  ui.setAIMessage(reaction);

  ui.renderTurnIndicator(true);
  triggerAIMove(onAIMoveComplete);
}

/** Fired by ai.js once its move has been placed on the board. */
function onAIMoveComplete(result, message) {
  audio.playMoveSound('O');
  audio.vibrate();

  ui.renderStats();
  ui.setAIMessage(message);

  if (result.gameOver) {
    handleRoundEnd(result);
    return;
  }

  ui.renderTurnIndicator(false);
}

/* --------------------------------------------------------------------------
   ROUND CONTROL
   -------------------------------------------------------------------------- */

/** Starts a fresh round — used by both the Restart button and "Play Again". */
function startNewRound() {
  cancelAIMove();
  cancelFx();
  resetBoard();
  ui.renderStats();
  ui.renderTurnIndicator(false);

  const idleMessage = getRandomMessage('idle', state.lastAIMessage);
  state.lastAIMessage = idleMessage;
  ui.setAIMessage(idleMessage);
}

/* --------------------------------------------------------------------------
   STATIC UI WIRING — difficulty, restart, reset scores, cell hover sound
   -------------------------------------------------------------------------- */
function bindDifficultyButtons() {
  document.querySelectorAll('.difficulty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.difficulty = btn.dataset.difficulty;
      persist();
      ui.renderDifficultySelector();
    });
  });
}

function bindRestartButton() {
  document.getElementById('restartBtn').addEventListener('click', startNewRound);
}

function bindResetScoresButton() {
  document.getElementById('resetScoresBtn').addEventListener('click', () => {
    resetScores();
    ui.renderScoreboard();
    ui.renderStats();
  });
}

function bindCellHoverSounds() {
  document.querySelectorAll('.cell').forEach((cell) => {
    cell.addEventListener('mouseenter', () => audio.playHoverSound());
  });
}

/* --------------------------------------------------------------------------
   HOME / BACK
   -------------------------------------------------------------------------- */
function handlePlay() {
  startNewRound();
}

function handleBack() {
  cancelAIMove();
  cancelFx();
  ui.renderHomeTeaser();
}

/* --------------------------------------------------------------------------
   APP BOOTSTRAP
   -------------------------------------------------------------------------- */
function initApp() {
  loadPersisted();

  initTheme(document.getElementById('themeToggle'));
  initParticles();
  initBoard(onHumanMove);
  initAchievements();
  ui.initUI();
  initModal(startNewRound);
  initHome({ onPlay: handlePlay, onBack: handleBack });

  bindDifficultyButtons();
  bindRestartButton();
  bindResetScoresButton();
  bindCellHoverSounds();

  const idleMessage = getRandomMessage('idle', null);
  state.lastAIMessage = idleMessage;
  ui.setAIMessage(idleMessage);
}

document.addEventListener('DOMContentLoaded', initApp);
