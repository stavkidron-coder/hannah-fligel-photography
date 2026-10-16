import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinarySrcSet } from '../lib/cloudinary';
import { heroPhotos } from '../data/heroPhotos';

// Phone hero: full-bleed 4:5 photos in a row that slides right to left, one photo at a time, on its own every few seconds.
// Like the desktop strip, each photo's label sits at its right edge; while the photo is cut off at the right of the screen the label
// stays on screen (never leaving its own photo), so it rides in with the photo and settles at the corner.
// Dragging sideways follows the finger and snaps to the next/previous photo (touch-action:pan-y leaves vertical scrolling alone).
// The row is positioned by slide index k = ..., -1, 0, 1, ... (index mod N picks the photo), so it loops in both directions.
// A photo opens Work filtered to its session type.
const WIDTHS = [640, 960, 1280];
const N = heroPhotos.length;
const INTERVAL = 5000;   // ms a photo rests before the next slides in
const SLIDE_MS = 600;
const LABEL_H = 19;      // 15px label + 4px gap (space/4), as on desktop
const RANGE = 2;         // slides rendered either side of the current one
const ease = (t) => -(Math.cos(Math.PI * t) - 1) / 2; // easeInOutSine: gentler start and finish than a cubic
const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function HeroCarousel() {
  const { setCat } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1); // +1 moving forward, -1 back: which way the bars fill
  const frame = useRef(null), row = useRef(null);
  const labelW = useRef(new Map()); // measured once per label so a frame never forces layout
  const s = useRef({ idx: 0, x: 0, w: 0, raf: 0, timer: 0, drag: null, swiped: false });

  // Slide the row to x (px) and keep every label on screen but inside its own photo.
  const render = () => {
    const st = s.current, w = st.w;
    if (!w || !row.current) return;
    row.current.style.transform = `translate3d(${-st.x}px,0,0)`;
    row.current.querySelectorAll('[data-k]').forEach((el) => {
      const k = Number(el.dataset.k), label = el.firstElementChild;
      let lw = labelW.current.get(label.textContent);
      if (!lw) { lw = label.offsetWidth; labelW.current.set(label.textContent, lw); }
      const left = k * w - st.x, right = left + w;
      const dx = Math.max(Math.min(right, w), left + lw) - right;
      label.style.transform = dx ? `translate3d(${dx}px,0,0)` : '';
    });
  };

  const stop = () => { cancelAnimationFrame(s.current.raf); clearTimeout(s.current.timer); };
  const schedule = () => {
    clearTimeout(s.current.timer);
    if (reduced()) return;
    s.current.timer = setTimeout(() => goTo(s.current.idx + 1), INTERVAL);
  };
  function goTo(k) {
    const st = s.current;
    cancelAnimationFrame(st.raf);
    clearTimeout(st.timer);
    setDir(k >= st.idx ? 1 : -1);
    st.idx = k; setIdx(k);
    const from = st.x, to = k * st.w, t0 = performance.now();
    const dur = reduced() ? 0 : SLIDE_MS * Math.min(1, Math.max(0.4, Math.abs(to - from) / st.w));
    const step = (now) => {
      const p = dur ? Math.min(1, (now - t0) / dur) : 1;
      st.x = from + (to - from) * ease(p);
      render();
      if (p < 1) st.raf = requestAnimationFrame(step); else schedule();
    };
    st.raf = requestAnimationFrame(step);
  }

  useLayoutEffect(() => {
    const st = s.current;
    // Fractional width on purpose: clientWidth rounds, and the error piles up with every slide.
    const measure = () => { st.w = frame.current.getBoundingClientRect().width; st.x = st.idx * st.w; render(); };
    measure();
    const ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(frame.current); else window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { labelW.current.clear(); render(); });
    schedule();
    return () => { if (ro) ro.disconnect(); else window.removeEventListener('resize', measure); stop(); };
  }, []);
  useLayoutEffect(render, [idx]);

  const onDown = (e) => {
    const st = s.current;
    st.swiped = false;
    st.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, startX: st.x, live: false };
  };
  const onMove = (e) => {
    const st = s.current, d = st.drag;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
    if (!d.live) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      d.live = true;
      stop();
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    }
    st.x = Math.max(d.startX - st.w, Math.min(d.startX + st.w, d.startX - dx));
    render();
  };
  const onUp = (e) => {
    const st = s.current, d = st.drag;
    st.drag = null;
    if (!d || !d.live) return;
    st.swiped = true;
    const moved = st.x - d.startX; // >0: dragged left, towards the next photo
    const base = Math.round(d.startX / st.w);
    goTo(Math.abs(moved) > st.w * 0.18 ? base + (moved > 0 ? 1 : -1) : base);
  };
  const onCancel = () => { const d = s.current.drag; s.current.drag = null; if (d && d.live) goTo(Math.round(d.startX / s.current.w)); };

  const active = ((idx % N) + N) % N;
  const ks = [];
  for (let k = idx - RANGE; k <= idx + RANGE; k++) ks.push(k);

  return (
    <section aria-roledescription="carousel" aria-label="Featured photography" style={css(`padding-top:var(--space-16);`)}>
      <div ref={frame} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onCancel}
        style={css(`position:relative;width:100%;overflow:hidden;touch-action:pan-y;`)}>
        <div aria-hidden="true" style={css(`padding-top:calc(100% * 5 / 4 + ${LABEL_H}px);`)}></div>
        <div ref={row} style={css(`position:absolute;inset:0;will-change:transform;`)}>
          {ks.map((k) => {
            const p = heroPhotos[((k % N) + N) % N];
            const on = k === idx;
            return (
              <button key={k} data-k={k} onClick={() => { if (s.current.swiped) { s.current.swiped = false; return; } open(p.cat); }}
                aria-label={`View ${p.label} work`} aria-roledescription="slide" aria-hidden={on ? undefined : 'true'} tabIndex={on ? 0 : -1}
                style={css(`position:absolute;top:0;left:${k * 100}%;width:100%;display:flex;flex-direction:column;align-items:stretch;gap:var(--space-4);background:none;border:none;padding:0;cursor:pointer;`)}>
                <span className="t-caption hero-ed-label" aria-hidden="true" style={css(`align-self:flex-end;padding-right:var(--space-16);line-height:15px;will-change:transform;${on ? 'color:var(--color-text-primary);' : ''}`)}>{p.label}</span>
                <span style={css(`position:relative;display:block;width:100%;aspect-ratio:4 / 5;overflow:hidden;background:var(--color-border-default);`)}>
                  <img src={p.src} srcSet={cloudinarySrcSet(p.src, WIDTHS)} sizes="100vw" alt="" draggable="false" decoding="async"
                    loading="eager" fetchpriority={k === 0 ? 'high' : undefined}
                    style={css(`position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;object-position:50% 35%;`)} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div aria-hidden="true" style={css(`display:flex;gap:6px;padding:var(--space-16) var(--layout-page-margin) 0;`)}>
        {heroPhotos.map((p, i) => {
          const on = i === active;
          // The arriving bar fills from the side the photo comes from; the leaving bar drains off the side the photo goes to.
          const origin = (on ? dir > 0 : dir < 0) ? 'left' : 'right';
          return (
            <span key={p.label} style={css(`position:relative;width:24px;height:2px;background:var(--color-border-default);overflow:hidden;`)}>
              <span className="hero-bar-fill" style={css(`position:absolute;inset:0;background:var(--color-text-primary);transform:scaleX(${on ? 1 : 0});transform-origin:${origin} center;`)}></span>
            </span>
          );
        })}
      </div>
      <p aria-live="polite" style={css(`position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;margin:0;`)}>{`Photo ${active + 1} of ${N}`}</p>
    </section>
  );
}
