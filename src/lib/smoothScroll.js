// A smoothed copy of window.scrollY for scroll-driven animation. Native scrolling is untouched; animations read this value instead,
// so wheel steps glide to rest rather than snapping. Subscribers are called every frame while it catches up.
const TAU = 110; // ms; larger = floatier

const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const subs = new Set();
let current = typeof window !== 'undefined' ? window.scrollY : 0;
let raf = 0, last = 0, listening = false;

const notify = () => subs.forEach((fn) => fn(current));

function tick(now) {
  const dt = Math.min(64, now - (last || now));
  last = now;
  const target = window.scrollY;
  const diff = target - current;
  if (reduced || Math.abs(diff) < 0.2) { current = target; raf = 0; last = 0; notify(); return; }
  current += diff * (1 - Math.exp(-dt / TAU));
  notify();
  raf = requestAnimationFrame(tick);
}

const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
const snap = () => { current = window.scrollY; notify(); };

export const smoothY = () => current;

export function subscribeSmoothScroll(fn) {
  subs.add(fn);
  if (!listening) {
    listening = true;
    current = window.scrollY;
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', snap);
  }
  return () => {
    subs.delete(fn);
    if (!subs.size) { listening = false; window.removeEventListener('scroll', kick); window.removeEventListener('resize', snap); cancelAnimationFrame(raf); raf = 0; last = 0; }
  };
}
