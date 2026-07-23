/* ==========================================================================
   UI — Read-only display layer
   Everything here does exactly one thing: paint state.js's current
   values onto the DOM. No click handling, no game logic, no state
   mutation — that all lives in board.js/ai.js/main.js, which call
   these render functions after they change something.
   ========================================================================== */

import { state } from './state.js';
import { ACHIEVEMENTS } from './data.js';

/* --------------------------------------------------------------------------
   MODULE-LOCAL DOM REFS — cached once in initUI()
   -------------------------------------------------------------------------- */
let scorePlayerEl, scoreDrawsEl, scoreAIEl;
let statCurrentStreakEl, statBestStreakEl, statGamesPlayedEl, statMoveCountEl;
let turnSymbolEl, turnTextEl, thinkingDotsEl;
let difficultyBtnEls = [];
let aiMessageEl;
let homeStatsTeaserEl, teaserGamesPlayedEl, teaserBestStreakEl, teaserAchievementsEl;

/* --------------------------------------------------------------------------
   ANIMATED COUNTERS
   Shared by the scoreboard, stats panel, and move counter — all reuse
   the same `.tick` scale-pop (see @keyframes counterTick in
   animations.css). Skips the animation entirely when the value hasn't
   actually changed, so restart's initial paint doesn't flicker.
   -------------------------------------------------------------------------- */
function setCounterValue(el, value) {
  const text = String(value);
  if (el.textContent === text) return;

  el.textContent = text;
  el.classList.remove('tick');
  void el.offsetWidth; // force reflow so the animation restarts on rapid updates
  el.classList.add('tick');
}

/* --------------------------------------------------------------------------
   SCOREBOARD
   -------------------------------------------------------------------------- */
export function renderScoreboard() {
  setCounterValue(scorePlayerEl, state.scores.X);
  setCounterValue(scoreDrawsEl, state.scores.draws);
  setCounterValue(scoreAIEl, state.scores.O);
}

/* --------------------------------------------------------------------------
   STATISTICS PANEL
   -------------------------------------------------------------------------- */
export function renderStats() {
  setCounterValue(statCurrentStreakEl, state.stats.currentStreak);
  setCounterValue(statBestStreakEl, state.stats.bestStreak);
  setCounterValue(statGamesPlayedEl, state.stats.gamesPlayed);
  setCounterValue(statMoveCountEl, `${state.moveCount} / 9`);
}

/* --------------------------------------------------------------------------
   TURN INDICATOR
   -------------------------------------------------------------------------- */

/**
 * Repaints whose turn it is and whether the "AI is thinking" dots show.
 * Retriggers the symbol's pop-in animation on every call, since this
 * is only ever invoked when the turn actually changes.
 */
export function renderTurnIndicator(isThinking = false) {
  const isHumanTurn = state.currentPlayer === 'X';

  turnSymbolEl.textContent = isHumanTurn ? '✕' : '○';
  turnSymbolEl.classList.toggle('ai-symbol', !isHumanTurn);
  turnTextEl.textContent = isHumanTurn ? 'Your Turn' : "AI's Turn";
  thinkingDotsEl.classList.toggle('active', isThinking);

  turnSymbolEl.classList.remove('turn-pulse');
  void turnSymbolEl.offsetWidth;
  turnSymbolEl.classList.add('turn-pulse');
}

/* --------------------------------------------------------------------------
   DIFFICULTY SELECTOR
   -------------------------------------------------------------------------- */
export function renderDifficultySelector() {
  difficultyBtnEls.forEach((btn) => {
    const isActive = btn.dataset.difficulty === state.difficulty;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

/* --------------------------------------------------------------------------
   AI MESSAGE
   -------------------------------------------------------------------------- */
export function setAIMessage(text) {
  aiMessageEl.textContent = text;
}

/* --------------------------------------------------------------------------
   HOME TEASER
   Only shown once the player has finished at least one game (see
   state.hasPlayedBefore / markAsPlayed() in state.js).
   -------------------------------------------------------------------------- */
export function renderHomeTeaser() {
  if (!state.hasPlayedBefore) {
    homeStatsTeaserEl.hidden = true;
    return;
  }

  homeStatsTeaserEl.hidden = false;
  teaserGamesPlayedEl.textContent = state.stats.gamesPlayed;
  teaserBestStreakEl.textContent = state.stats.bestStreak;
  teaserAchievementsEl.textContent = `${state.unlockedAchievements.length}/${ACHIEVEMENTS.length}`;
}

/* --------------------------------------------------------------------------
   BOOTSTRAP
   -------------------------------------------------------------------------- */

/**
 * Caches every DOM ref this module paints into and does one full
 * initial render. Call once from main.js, after loadPersisted().
 */
export function initUI() {
  scorePlayerEl = document.getElementById('scorePlayer');
  scoreDrawsEl = document.getElementById('scoreDraws');
  scoreAIEl = document.getElementById('scoreAI');

  statCurrentStreakEl = document.getElementById('statCurrentStreak');
  statBestStreakEl = document.getElementById('statBestStreak');
  statGamesPlayedEl = document.getElementById('statGamesPlayed');
  statMoveCountEl = document.getElementById('statMoveCount');

  const turnDisplayEl = document.getElementById('turnDisplay');
  turnSymbolEl = turnDisplayEl.querySelector('.turn-symbol');
  turnTextEl = turnDisplayEl.querySelector('.turn-text');
  thinkingDotsEl = document.getElementById('thinkingDots');

  difficultyBtnEls = Array.from(document.querySelectorAll('.difficulty-btn'));

  aiMessageEl = document.getElementById('aiMessage');

  homeStatsTeaserEl = document.getElementById('homeStatsTeaser');
  teaserGamesPlayedEl = document.getElementById('teaserGamesPlayed');
  teaserBestStreakEl = document.getElementById('teaserBestStreak');
  teaserAchievementsEl = document.getElementById('teaserAchievements');

  renderScoreboard();
  renderStats();
  renderTurnIndicator();
  renderDifficultySelector();
  renderHomeTeaser();
}
