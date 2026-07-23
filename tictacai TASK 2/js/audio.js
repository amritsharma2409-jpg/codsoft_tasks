/* ==========================================================================
   AUDIO — Sound engine
   Built entirely on the Web Audio API — no external audio files, so
   there's nothing to download and no licensing to worry about. Every
   sound in the app is a synthesized tone (or short sequence of tones)
   generated from this one module.
   ========================================================================== */

let audioCtx = null;

/**
 * Browsers block audio until a user gesture has happened somewhere on
 * the page. Creating the context lazily — on first actual sound call,
 * which only ever happens in response to a click — sidesteps that
 * restriction without needing a separate "unlock" step in main.js.
 */
function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Browsers may create (or leave) the context in a 'suspended' state
  // when it's first touched outside a strict click/keydown gesture —
  // a mouseenter-triggered hover sound is a common culprit. Since
  // `audioCtx` is cached and reused for the rest of the session, a
  // missed resume() here would silence every sound permanently.
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * The one low-level building block every sound below is made from:
 * a single oscillator tone with an exponential fade-out envelope
 * (sounds far more natural than a hard stop).
 */
function playTone(frequency, duration = 0.15, type = 'sine', volume = 0.15, delay = 0) {
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;

  const startTime = ctx.currentTime + delay;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

/* --------------------------------------------------------------------------
   GAMEPLAY SOUNDS
   -------------------------------------------------------------------------- */

/** A barely-there tick on cell hover — subtle enough to not get old after 50 hovers. */
export function playHoverSound() {
  playTone(880, 0.04, 'sine', 0.03);
}

/** Human gets a bright, high click; AI gets a lower, softer one — distinguishable eyes-closed. */
export function playMoveSound(player) {
  if (player === 'X') {
    playTone(520, 0.09, 'sine', 0.12);
  } else {
    playTone(330, 0.11, 'sine', 0.1);
  }
}

/** Short rising arpeggio — C5, E5, G5, C6. */
export function playWinSound() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    playTone(freq, 0.18, 'triangle', 0.15, i * 0.1);
  });
}

/** Short descending phrase — the mirror image of the win sound. */
export function playLoseSound() {
  [523.25, 415.3, 329.63].forEach((freq, i) => {
    playTone(freq, 0.22, 'sawtooth', 0.1, i * 0.12);
  });
}

/** Flat, neutral two-note tone — neither triumphant nor sad. */
export function playDrawSound() {
  playTone(392, 0.2, 'square', 0.08);
  playTone(392, 0.2, 'square', 0.06, 0.15);
}

/** A bright little sparkle for achievement unlocks — distinct timbre from the win sound so it reads as its own event even if both fire together. */
export function playAchievementSound() {
  [783.99, 987.77, 1174.66].forEach((freq, i) => {
    playTone(freq, 0.12, 'triangle', 0.13, i * 0.07);
  });
}

/* --------------------------------------------------------------------------
   HAPTICS
   navigator.vibrate() is mobile-only and unsupported in plenty of
   browsers (notably iOS Safari) — feature-detected so this is always
   safe to call from anywhere.
   -------------------------------------------------------------------------- */
export function vibrate(pattern = [12]) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}
