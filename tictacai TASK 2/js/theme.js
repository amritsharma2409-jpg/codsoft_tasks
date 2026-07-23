/* ==========================================================================
   THEME — Dark / Light / Auto
   "Auto" tracks the OS-level prefers-color-scheme live: if the system
   switches at sunset (many OSes do this automatically), the app
   follows without needing a reload.
   ========================================================================== */

import { state, persist } from './state.js';

const SYSTEM_LIGHT_QUERY = window.matchMedia('(prefers-color-scheme: light)');

/**
 * Auto mode doesn't have a fixed appearance of its own — it always
 * resolves to whatever the OS currently prefers. Dark/Light modes
 * are just themselves.
 */
function resolveEffectiveTheme() {
  if (state.themeMode === 'auto') {
    return SYSTEM_LIGHT_QUERY.matches ? 'light' : 'dark';
  }
  return state.themeMode;
}

/**
 * Applies the current state.themeMode to the page: toggles the CSS
 * class that variables.css keys off of, and updates the toggle
 * button's data attribute so the correct icon (sun/moon/auto) shows
 * — see the `.theme-toggle[data-theme-mode="..."]` rules in base.css.
 */
function applyTheme(toggleBtn) {
  const effective = resolveEffectiveTheme();
  document.body.classList.toggle('light-mode', effective === 'light');
  toggleBtn.dataset.themeMode = state.themeMode;
}

/**
 * Cycles Dark -> Light -> Auto -> Dark on each click.
 */
function cycleTheme(toggleBtn) {
  const order = ['dark', 'light', 'auto'];
  const nextIndex = (order.indexOf(state.themeMode) + 1) % order.length;

  state.themeMode = order[nextIndex];
  persist();
  applyTheme(toggleBtn);
}

/**
 * Boots the theme system. Call once from main.js, after loadPersisted()
 * has already populated state.themeMode from localStorage.
 */
export function initTheme(toggleBtn) {
  applyTheme(toggleBtn);

  toggleBtn.addEventListener('click', () => cycleTheme(toggleBtn));

  // Live-follow the OS while in Auto mode. Harmless no-op the rest of
  // the time, since applyTheme() only reads matchMedia when relevant.
  SYSTEM_LIGHT_QUERY.addEventListener('change', () => {
    if (state.themeMode === 'auto') applyTheme(toggleBtn);
  });
}
