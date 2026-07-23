/* ==========================================================================
   PARTICLES — Canvas rendering engine
   Two canvases, two jobs:
     #bgCanvas — a continuous ambient loop (drifting blobs + tiny dust)
     #fxCanvas — one-shot bursts (confetti on win, fireworks on streaks)
   Both are plain 2D canvas, no libraries. Soft blob edges come from
   radial gradients rather than a canvas blur filter — filters are
   comparatively GPU-expensive and can visibly stutter on lower-end
   devices, which conflicts directly with the "no lag" requirement.
   ========================================================================== */

const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
const fxCanvas = document.getElementById('fxCanvas');
const fxCtx = fxCanvas.getContext('2d');

// Mirrors the neon palette in variables.css as RGB triples (canvas
// can't read CSS custom properties directly, so these are kept in
// sync by hand: --c-signal-blue / --c-signal-purple / --c-signal-pink).
const COLORS = {
  blue: '63, 208, 255',
  purple: '168, 85, 247',
  pink: '255, 95, 162'
};

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let bgAnimationId = null;
let fxAnimationId = null;
let blobs = [];
let dust = [];
let bgWidth = 0;
let bgHeight = 0;

/* --------------------------------------------------------------------------
   AMBIENT BACKGROUND LOOP
   -------------------------------------------------------------------------- */
function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createBlobs() {
  return [COLORS.blue, COLORS.purple, COLORS.pink].map((color, i) => ({
    color,
    baseX: Math.random() * bgWidth,
    baseY: Math.random() * bgHeight,
    radius: 220 + Math.random() * 100,
    driftX: 60 + Math.random() * 40,
    driftY: 50 + Math.random() * 40,
    speed: 0.00012 + i * 0.00003,
    phase: Math.random() * Math.PI * 2
  }));
}

function createDust(count = 50) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * bgWidth,
    y: Math.random() * bgHeight,
    radius: 0.6 + Math.random() * 1.8,
    driftSpeed: 0.15 + Math.random() * 0.25,
    driftAngle: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.5 + Math.random() * 1,
    twinklePhase: Math.random() * Math.PI * 2,
    color: [COLORS.blue, COLORS.purple, COLORS.pink][Math.floor(Math.random() * 3)]
  }));
}

// Soft-edged glow circle via radial gradient — cheap, no filter needed.
function drawBlob(blob, time) {
  const x = blob.baseX + Math.sin(time * blob.speed + blob.phase) * blob.driftX;
  const y = blob.baseY + Math.cos(time * blob.speed * 0.8 + blob.phase) * blob.driftY;

  const gradient = bgCtx.createRadialGradient(x, y, 0, x, y, blob.radius);
  gradient.addColorStop(0, `rgba(${blob.color}, 0.55)`);
  gradient.addColorStop(1, `rgba(${blob.color}, 0)`);

  bgCtx.fillStyle = gradient;
  bgCtx.fillRect(x - blob.radius, y - blob.radius, blob.radius * 2, blob.radius * 2);
}

// Tiny drifting, twinkling dot — the "depth" layer in front of the blobs.
function drawDustParticle(particle, time) {
  const x = particle.x + Math.cos(particle.driftAngle) * particle.driftSpeed * time * 0.02;
  const y = particle.y + Math.sin(particle.driftAngle) * particle.driftSpeed * time * 0.02;

  // Wrap around edges instead of despawning, so particle count stays constant.
  const wrappedX = ((x % bgWidth) + bgWidth) % bgWidth;
  const wrappedY = ((y % bgHeight) + bgHeight) % bgHeight;
  const twinkle = 0.3 + Math.abs(Math.sin(time * 0.001 * particle.twinkleSpeed + particle.twinklePhase)) * 0.5;

  bgCtx.beginPath();
  bgCtx.arc(wrappedX, wrappedY, particle.radius, 0, Math.PI * 2);
  bgCtx.fillStyle = `rgba(${particle.color}, ${twinkle})`;
  bgCtx.fill();
}

function renderBackgroundFrame(time) {
  bgCtx.clearRect(0, 0, bgWidth, bgHeight);
  blobs.forEach((blob) => drawBlob(blob, time));
  dust.forEach((particle) => drawDustParticle(particle, time));
}

function bgLoop(time) {
  renderBackgroundFrame(time);
  bgAnimationId = requestAnimationFrame(bgLoop);
}

function startBackgroundLoop() {
  if (bgAnimationId) return; // already running, avoid a duplicate loop

  if (REDUCED_MOTION) {
    renderBackgroundFrame(0); // one static frame — depth without motion
    return;
  }
  bgAnimationId = requestAnimationFrame(bgLoop);
}

function stopBackgroundLoop() {
  if (bgAnimationId) {
    cancelAnimationFrame(bgAnimationId);
    bgAnimationId = null;
  }
}

/**
 * Boots the ambient background. Call once from main.js.
 */
export function initParticles() {
  resizeCanvas(bgCanvas);
  resizeCanvas(fxCanvas);
  bgWidth = bgCanvas.width;
  bgHeight = bgCanvas.height;

  blobs = createBlobs();
  dust = createDust();

  startBackgroundLoop();

  // Pause the loop while the tab is hidden — saves battery/CPU, and
  // there's no visible "lag" on return since it simply wasn't running.
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopBackgroundLoop() : startBackgroundLoop();
  });

  // Debounced resize — recompute canvas size and re-seed positions so
  // blobs/dust redistribute across the new viewport instead of
  // staying clustered in a now-stale corner.
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas(bgCanvas);
      resizeCanvas(fxCanvas);
      bgWidth = bgCanvas.width;
      bgHeight = bgCanvas.height;
      blobs = createBlobs();
      dust = createDust();
    }, 200);
  });
}

/* --------------------------------------------------------------------------
   SHARED FX RUNNER
   Both confetti and fireworks are just "particles that move and fade
   for a while" — this one function drives both, so the two effects
   below are just particle setup + a draw callback, not two separate
   animation loops.
   -------------------------------------------------------------------------- */
function runFxAnimation(particles, duration, draw, update, shouldRender = () => true) {
  if (fxAnimationId) cancelAnimationFrame(fxAnimationId);

  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

    particles.forEach((p) => {
      if (!shouldRender(p, elapsed)) return;

      update(p);
      if (elapsed > duration * 0.6) {
        p.opacity = Math.max(0, 1 - (elapsed - duration * 0.6) / (duration * 0.4));
      }
      draw(p);
    });

    if (elapsed < duration) {
      fxAnimationId = requestAnimationFrame(frame);
    } else {
      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      fxAnimationId = null;
    }
  }

  fxAnimationId = requestAnimationFrame(frame);
}

/** Stops any in-progress confetti/firework burst and clears the canvas immediately (e.g. when restarting a round). */
export function cancelFx() {
  if (fxAnimationId) {
    cancelAnimationFrame(fxAnimationId);
    fxAnimationId = null;
  }
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
}

/* --------------------------------------------------------------------------
   CONFETTI — falling colored pieces, played on every human win.
   -------------------------------------------------------------------------- */
export function triggerConfetti() {
  const colors = [COLORS.blue, COLORS.purple, COLORS.pink];
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * fxCanvas.width,
    y: -20 - Math.random() * fxCanvas.height * 0.3,
    size: 6 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 2 + Math.random() * 3,
    speedX: -2 + Math.random() * 4,
    rotation: Math.random() * 360,
    rotationSpeed: -6 + Math.random() * 12,
    opacity: 1
  }));

  runFxAnimation(
    particles,
    2600,
    (p) => {
      fxCtx.save();
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate((p.rotation * Math.PI) / 180);
      fxCtx.globalAlpha = p.opacity;
      fxCtx.fillStyle = `rgb(${p.color})`;
      fxCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      fxCtx.restore();
    },
    (p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += 0.05; // gravity
      p.rotation += p.rotationSpeed;
    }
  );
}

/* --------------------------------------------------------------------------
   FIREWORKS — 3 staggered radial bursts, played after a win streak
   (a bigger, more celebratory effect than confetti — reserved for
   the achievements.js "Win Streak" moment).
   -------------------------------------------------------------------------- */
export function triggerFirework() {
  const colors = [COLORS.blue, COLORS.purple, COLORS.pink];
  const particles = [];
  const burstCount = 3;
  const particlesPerBurst = 40;

  for (let b = 0; b < burstCount; b++) {
    const originX = fxCanvas.width * (0.25 + Math.random() * 0.5);
    const originY = fxCanvas.height * (0.2 + Math.random() * 0.3);
    const color = colors[b % colors.length];

    for (let i = 0; i < particlesPerBurst; i++) {
      const angle = (Math.PI * 2 * i) / particlesPerBurst;
      const speed = 2 + Math.random() * 3;

      particles.push({
        x: originX,
        y: originY,
        size: 3 + Math.random() * 2,
        color,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        opacity: 1,
        delay: b * 220 // staggers the 3 bursts instead of firing at once
      });
    }
  }

  runFxAnimation(
    particles,
    1800,
    (p) => {
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fxCtx.globalAlpha = p.opacity;
      fxCtx.fillStyle = `rgb(${p.color})`;
      fxCtx.fill();
    },
    (p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += 0.06; // gravity pulls the sparks back down
      p.speedX *= 0.98; // air resistance
    },
    (p, elapsed) => elapsed > p.delay
  );
}
