/* ==========================================================================
   ACHIEVEMENTS — Unlock checking + toast display
   Runs every ACHIEVEMENTS condition (see data.js) against the result
   of a just-finished game, persists any new unlocks via state.js, and
   shows them one at a time through a small toast queue (so two
   achievements unlocking in the same game don't fight for the same
   corner of the screen).
   ========================================================================== */

import { ACHIEVEMENTS } from './data.js';
import { isAchievementUnlocked, unlockAchievement } from './state.js';
import { playAchievementSound } from './audio.js';
import { triggerFirework } from './particles.js';

/* --------------------------------------------------------------------------
   MODULE-LOCAL DOM REFS + QUEUE STATE
   -------------------------------------------------------------------------- */
let toastEl = null;
let iconEl = null;
let titleEl = null;

let toastQueue = [];
let isToastShowing = false;
let hideTimer = null;

const TOAST_VISIBLE_MS = 3200;
const TOAST_TRANSITION_MS = 400; // matches .achievement-toast's transform transition in popups.css

/* --------------------------------------------------------------------------
   TOAST QUEUE
   Only one achievement toast is ever on screen at a time. Each finishes
   its full show → wait → hide cycle before the next one starts.
   -------------------------------------------------------------------------- */

/** Slides the toast in for one achievement, plays its cue, then schedules its exit. */
function showToast(achievement) {
  iconEl.textContent = achievement.icon;
  titleEl.textContent = achievement.title;

  toastEl.hidden = false;
  // Force a reflow before adding `.show` so the slide-in transition
  // actually plays instead of the element just appearing already-open.
  void toastEl.offsetWidth;
  toastEl.classList.add('show');

  playAchievementSound();
  if (achievement.id === 'win-streak') triggerFirework();

  clearTimeout(hideTimer);
  hideTimer = setTimeout(hideToast, TOAST_VISIBLE_MS);
}

/** Slides the current toast out, then advances to the next queued one, if any. */
function hideToast() {
  toastEl.classList.remove('show');

  setTimeout(() => {
    toastEl.hidden = true;
    isToastShowing = false;
    processQueue();
  }, TOAST_TRANSITION_MS);
}

/** Pops the next achievement off the queue and shows it, if nothing is showing. */
function processQueue() {
  if (isToastShowing || toastQueue.length === 0) return;
  isToastShowing = true;
  showToast(toastQueue.shift());
}

/* --------------------------------------------------------------------------
   PUBLIC API
   -------------------------------------------------------------------------- */

/**
 * Caches the toast's DOM refs. Call once from main.js.
 */
export function initAchievements() {
  toastEl = document.getElementById('achievementToast');
  iconEl = document.getElementById('achievementIcon');
  titleEl = document.getElementById('achievementTitle');
}

/**
 * Checks every not-yet-unlocked achievement against the outcome of the
 * round that just ended, unlocks any that qualify, and queues their
 * toasts. Call once per game over (win, loss, or draw).
 *
 * @param {{result: string, difficulty: string, moveCount: number, currentStreak: number}} context
 * @returns {object[]} the achievements newly unlocked this call, if the
 *   caller (ui.js/modal.js) needs to react beyond the toast itself.
 */
export function checkAchievements(context) {
  const newlyUnlocked = ACHIEVEMENTS.filter((achievement) => {
    if (isAchievementUnlocked(achievement.id)) return false;
    return achievement.condition(context);
  });

  newlyUnlocked.forEach((achievement) => {
    unlockAchievement(achievement.id);
    toastQueue.push(achievement);
  });

  processQueue();

  return newlyUnlocked;
}
