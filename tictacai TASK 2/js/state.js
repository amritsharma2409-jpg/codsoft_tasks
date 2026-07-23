/* ==========================================================================
   STATE — Single source of truth + persistence
   Every other module imports the same `state` object and mutates it
   directly (no framework reactivity here — this is vanilla JS by
   design). After any mutation that should survive a reload, the
   caller explicitly calls persist().
   ========================================================================== */

const STORAGE_KEY = 'tictacai:v1';

/* --------------------------------------------------------------------------
   DEFAULT SHAPE
   Split into two conceptual halves:
     - ROUND fields reset every game and are never saved.
     - PERSISTED fields (listed in PERSISTED_KEYS below) survive a
       page reload via localStorage.
   -------------------------------------------------------------------------- */
const DEFAULT_STATE = {
  // ----- ROUND (resets every game, NOT persisted) -----
  board: Array(9).fill(''),
  currentPlayer: 'X',
  gameActive: true,
  moveCount: 0,
  lastAIMessage: null, // last taunt shown, so getRandomMessage() can avoid repeating it

  // ----- SETTINGS -----
  difficulty: 'medium',   // 'easy' | 'medium' | 'impossible'
  themeMode: 'dark',      // 'dark' | 'light' | 'auto'

  // ----- SCORES -----
  scores: { X: 0, O: 0, draws: 0 },

  // ----- STATS -----
  stats: {
    gamesPlayed: 0,
    lastWinner: '—',     // 'You' | 'AI' | 'Draw' | '—'
    currentStreak: 0,    // consecutive human wins
    bestStreak: 0
  },

  // ----- ACHIEVEMENTS -----
  unlockedAchievements: [], // array of achievement ids, e.g. ['first-win']

  // ----- MISC -----
  hasPlayedBefore: false // controls the home screen's stats teaser visibility
};

// Only these top-level keys are written to/read from localStorage.
// (board/currentPlayer/gameActive/moveCount/lastAIMessage deliberately
// excluded — a fresh page load should always start a clean round.)
const PERSISTED_KEYS = ['difficulty', 'themeMode', 'scores', 'stats', 'unlockedAchievements', 'hasPlayedBefore'];

// A plain deep clone of the defaults — every module imports THIS
// object and mutates its properties in place.
export const state = JSON.parse(JSON.stringify(DEFAULT_STATE));

/* --------------------------------------------------------------------------
   PERSISTENCE
   -------------------------------------------------------------------------- */
export function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const saved = JSON.parse(raw);
    PERSISTED_KEYS.forEach((key) => {
      if (saved[key] !== undefined) state[key] = saved[key];
    });
  } catch (err) {
    // Corrupted JSON or inaccessible storage (e.g. private browsing) —
    // fail silently and just start with defaults.
    console.warn('TicTacAI: could not load saved data, starting fresh.', err);
  }
}

export function persist() {
  try {
    const toSave = {};
    PERSISTED_KEYS.forEach((key) => { toSave[key] = state[key]; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn('TicTacAI: could not save data.', err);
  }
}

/* --------------------------------------------------------------------------
   ROUND HELPERS
   -------------------------------------------------------------------------- */
export function resetRoundState() {
  state.board = Array(9).fill('');
  state.currentPlayer = 'X';
  state.gameActive = true;
  state.moveCount = 0;
}

/* --------------------------------------------------------------------------
   SCORE / STATS HELPERS
   -------------------------------------------------------------------------- */
export function resetScores() {
  state.scores = { X: 0, O: 0, draws: 0 };
  state.stats = { gamesPlayed: 0, lastWinner: '—', currentStreak: 0, bestStreak: 0 };
  persist();
}

export function getWinRate() {
  if (state.stats.gamesPlayed === 0) return 0;
  return Math.round((state.scores.X / state.stats.gamesPlayed) * 100);
}

/* --------------------------------------------------------------------------
   ACHIEVEMENT HELPERS
   achievements.js only ever unlocks through this function, so the
   "already unlocked?" check and the persistence both happen in
   exactly one place.
   -------------------------------------------------------------------------- */
export function isAchievementUnlocked(id) {
  return state.unlockedAchievements.includes(id);
}

export function unlockAchievement(id) {
  if (isAchievementUnlocked(id)) return false;
  state.unlockedAchievements.push(id);
  persist();
  return true;
}

/* --------------------------------------------------------------------------
   MISC
   -------------------------------------------------------------------------- */
export function markAsPlayed() {
  if (state.hasPlayedBefore) return;
  state.hasPlayedBefore = true;
  persist();
}
