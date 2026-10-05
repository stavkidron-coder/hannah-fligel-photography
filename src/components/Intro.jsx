import { useLayoutEffect, useRef, useState } from 'react';
import { css } from '../lib/css';

// Opening animation, played once per browser session on whichever page the visitor lands on:
// the name is typed, a box is drawn round it, the name collapses to HFP, then the letters and box fade out together and,
// once they are gone, the cover fades to bring the site in. Click or any key skips it.
const NAME = 'Hannah Fligel Photography';
const SEEN_KEY = 'hfp-intro-seen';

// Seconds from the moment the font is ready.
const TYPE_AT = 0.15, TYPE_STEP = 0.032;
const DRAW_AT = 1.0, DRAW = 0.75;
const COLLAPSE_AT = 1.8, COLLAPSE = 0.6;
const LOGO_FADE_AT = 2.5, LOGO_FADE = 0.45;
const LIFT_AT = LOGO_FADE_AT + LOGO_FADE, LIFT = 0.7; // the site only starts to fade in once the logo has fully gone
const REDUCED_LIFT_AT = 0.7;           // prefers-reduced-motion: the name sits still, then the cover fades
const SKIP_LIFT = 0.35;
const GAP_EM = 0.16;                   // space between H, F and P once the rest of the name is gone
const IMAGE_WAIT = 4000;               // never hold the site back longer than this for the hero photos
const FAILSAFE = 12000;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);
// Where the box's stroke has got to (0–1 round the perimeter) after fraction u of the time. Each side gets time in proportion
// to its length and eases in and out on its own, so the line slows into every corner and pulls away from it.
const edgeEase = (u, w, h) => {
  const per = 2 * (w + h), sides = [w, h, w, h];
  let at = 0, done = 0;
  for (let i = 0; i < 4; i++) {
    const len = sides[i], share = len / per;
    if (u <= at + share || i === 3) return (done + smooth(clamp01((u - at) / share)) * len) / per;
    at += share; done += len;
  }
};
const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Decided once, before the first paint, so the page never flashes before the cover is up.
let play = typeof window !== 'undefined';
try { if (play && sessionStorage.getItem(SEEN_KEY)) play = false; } catch (e) {}
if (play) document.documentElement.dataset.intro = '1';

const isInitial = (i) => i === 0 || NAME[i - 1] === ' ';

export default function Intro() {
  const [done, setDone] = useState(!play);
  const cover = useRef(null), logo = useRef(null), text = useRef(null), rect = useRef(null);

  useLayoutEffect(() => {
    if (done) return;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const chars = [...text.current.children];
    const initials = chars.map((_, i) => i).filter(isInitial);
    let raf = 0, start = null, widths = null, gap = 0, liftStart = null, imagesReady = false, skipped = false, dead = false;

    const release = () => { delete root.dataset.intro; root.style.overflow = prevOverflow; };
    const finish = () => { dead = true; cancelAnimationFrame(raf); release(); setDone(true); };

    // Hold the cover until the hero photos can paint, so they don't pop in after it lifts.
    const imgs = [...document.querySelectorAll('.hero-ed-item img')];
    Promise.race([
      Promise.all(imgs.map((im) => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()))),
      new Promise((r) => setTimeout(r, IMAGE_WAIT)),
    ]).then(() => { imagesReady = true; });

    const skip = () => { skipped = true; };
    cover.current.addEventListener('click', skip);
    window.addEventListener('keydown', skip);
    const failsafe = setTimeout(finish, FAILSAFE);

    const frame = (now) => {
      if (dead) return;
      if (start === null) start = now;
      const t = (now - start) / 1000;

      if (reduced) {
        chars.forEach((c) => { c.style.opacity = '1'; });
        rect.current.style.opacity = '1';
        rect.current.style.strokeDashoffset = '0';
      } else {
        const c = inOut(clamp01((t - COLLAPSE_AT) / COLLAPSE));
        if (c > 0 && !widths) {
          widths = chars.map((el) => el.offsetWidth);
          gap = GAP_EM * parseFloat(getComputedStyle(text.current).fontSize);
        }
        chars.forEach((el, i) => {
          let o = t >= TYPE_AT + i * TYPE_STEP ? 1 : 0;
          if (isInitial(i)) {
            const k = initials.indexOf(i);
            if (widths && k < initials.length - 1) el.style.marginRight = `${gap * c}px`;
          } else if (widths) {
            o *= 1 - clamp01(c * 1.6);
            el.style.width = `${widths[i] * (1 - c)}px`;
          }
          el.style.opacity = String(o);
        });
        const { width: bw, height: bh } = rect.current.getBoundingClientRect();
        logo.current.style.opacity = String(1 - smooth(clamp01((t - LOGO_FADE_AT) / LOGO_FADE)));
        const offset = 1 - edgeEase(clamp01((t - DRAW_AT) / DRAW), bw, bh);
        rect.current.style.opacity = offset >= 1 ? '0' : '1';
        rect.current.style.strokeDashoffset = String(offset);
      }

      // Lift: fade the cover away to reveal the site, once the hero photos are ready (or the visitor skipped).
      if (liftStart === null && ((t >= (reduced ? REDUCED_LIFT_AT : LIFT_AT) && imagesReady) || skipped)) {
        liftStart = now;
        release(); // the hero photos start their own fade-in as the cover goes
      }
      if (liftStart !== null) {
        const p = clamp01((now - liftStart) / 1000 / (skipped ? SKIP_LIFT : LIFT));
        cover.current.style.opacity = String(1 - smooth(p));
        if (p >= 1) return finish();
      }
      raf = requestAnimationFrame(frame);
    };

    // Start once the display font is in, so the typed letters don't shift when it swaps.
    Promise.race([
      document.fonts && document.fonts.load("44px 'Antic Didone'", NAME),
      new Promise((r) => setTimeout(r, 1200)),
    ]).catch(() => {}).then(() => { if (!dead) raf = requestAnimationFrame(frame); });

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
      window.removeEventListener('keydown', skip);
      if (cover.current) cover.current.removeEventListener('click', skip);
      release();
    };
  }, []);

  if (done) return null;
  return (
    <div ref={cover} aria-hidden="true" style={css(`position:fixed;inset:0;z-index:1000;background:var(--cream);display:flex;align-items:center;justify-content:center;cursor:pointer;`)}>
      <div ref={logo} style={css(`position:relative;padding:.32em .5em;font-family:'Antic Didone',serif;font-size:min(30px,calc((100vw - 96px)/16));line-height:normal;color:var(--ink);`)}>
        <svg width="100%" height="100%" style={css(`position:absolute;inset:0;overflow:visible;pointer-events:none;`)}>
          <rect ref={rect} width="100%" height="100%" pathLength="1" fill="none" stroke="var(--ink)" strokeWidth="1.25"
            style={{ strokeDasharray: '1 1', strokeDashoffset: 1, opacity: 0 }} />
        </svg>
        <div ref={text} style={css(`position:relative;display:flex;white-space:pre;`)}>
          {[...NAME].map((ch, i) => (
            <span key={i} style={{ flex: 'none', display: 'block', overflow: isInitial(i) ? 'visible' : 'hidden', opacity: 0 }}>{ch}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
