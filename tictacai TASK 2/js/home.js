/* ==========================================================================
   HOME — Landing screen + screen switching
   Toggling the `hidden` attribute is all that's needed for the
   entrance animation to replay (see the fadeSlideUp comment in
   animations.css: `[hidden]` uses `display: none`, so browsers
   restart CSS animations automatically the moment a screen becomes
   displayable again) — no JS-managed animation classes here.
   ========================================================================== */

let loaderEl, homeScreenEl, gameScreenEl, playBtnEl, backBtnEl;

// Keeps the loader visible for at least this long, so it never just
// flashes instantly on a fast connection/cached load.
const MIN_LOADER_MS = 900;
const LOADER_FADE_MS = 700; // matches --t-slow in variables.css

/* --------------------------------------------------------------------------
   SCREEN SWITCHING
   -------------------------------------------------------------------------- */

/** Hides the home screen and reveals the game screen (+ the back button). */
export function showGameScreen() {
  homeScreenEl.hidden = true;
  gameScreenEl.hidden = false;
  backBtnEl.hidden = false;
}

/** Hides the game screen and reveals the home screen again. */
export function showHomeScreen() {
  gameScreenEl.hidden = true;
  homeScreenEl.hidden = false;
  backBtnEl.hidden = true;
}

/* --------------------------------------------------------------------------
   LOADER
   -------------------------------------------------------------------------- */

/** Fades the loading screen out, then removes it from layout/a11y entirely. */
function hideLoader() {
  setTimeout(() => {
    loaderEl.classList.add('loader-hidden');
    setTimeout(() => { loaderEl.hidden = true; }, LOADER_FADE_MS);
  }, MIN_LOADER_MS);
}

/* --------------------------------------------------------------------------
   BOOTSTRAP
   -------------------------------------------------------------------------- */

/**
 * Caches DOM refs, wires up Play/Back, and kicks off the loader
 * removal. Call once from main.js.
 * @param {{onPlay?: () => void, onBack?: () => void}} callbacks -
 *   invoked after the corresponding screen switch has already happened,
 *   so main.js can start a round / refresh the home teaser, etc.
 */
export function initHome({ onPlay, onBack } = {}) {
  loaderEl = document.getElementById('loader');
  homeScreenEl = document.getElementById('homeScreen');
  gameScreenEl = document.getElementById('gameScreen');
  playBtnEl = document.getElementById('playBtn');
  backBtnEl = document.getElementById('backBtn');

  playBtnEl.addEventListener('click', () => {
    showGameScreen();
    if (onPlay) onPlay();
  });

  backBtnEl.addEventListener('click', () => {
    showHomeScreen();
    if (onBack) onBack();
  });

  hideLoader();
}
