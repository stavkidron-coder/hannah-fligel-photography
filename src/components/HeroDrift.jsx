import { useContext, useLayoutEffect, useRef } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinarySrcSet } from '../lib/cloudinary';
import { heroPhotos } from '../data/heroPhotos';

// Phone hero, "drift" variation: the same slow right-to-left strip as desktop (HeroEditorial), sized for a phone.
// Photos keep their own proportions at a height of 5/4 of the screen width, so a portrait nearly fills the screen and the next one peeks in.
// The row is rendered COPIES times and wraps by exactly one set, so the loop is seamless.
// A finger drag moves it directly and, on release, it keeps coasting in the direction flicked while its speed eases back to the drift
// speed (it never stops). It pauses only while held and while the hero is off screen. A tap opens Work filtered to that photo's session type.
const WIDTHS = [640, 960, 1400];
const SPEED = 60;        // px per second; desktop is 80
const COPIES = 3;
const EASE_TAU = 900;    // ms; how quickly a flick's speed settles back to the drift speed
const WHEEL_IDLE = 500;  // ms without wheel events before the drift resumes; a trackpad sends nothing while fingers rest or lift, so this timer is the hold
const MAX_FLING = 2500;  // px/s
const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function HeroDrift() {
  const { setCat } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const frame = useRef(null), row = useRef(null);

  useLayoutEffect(() => {
    const f = frame.current;
    const els = [...row.current.querySelectorAll('.hero-ed-item')];
    const items = els.map((el) => ({ el, label: el.querySelector('.hero-ed-label'), labelW: 0 }));
    const n = heroPhotos.length;
    let period = 0, pos = 0, vw = 0, raf = 0, last = 0;
    let visible = true, drag = null, swiped = false, wheelAt = -1e9;
    let v = reduced ? 0 : SPEED; // px/s the row is moving at; a flick sets it, then it eases back to SPEED

    const render = () => {
      if (!period) return;
      pos = ((pos % period) + period) % period;
      const tx = -pos;
      row.current.style.transform = `translate3d(${tx}px,0,0)`;
      // A photo's label sits at its right edge. While the photo is cut off at the right of the screen the label stays on screen,
      // but never leaves its own photo, so a photo that is only just peeking in takes its label with it.
      items.forEach((it) => {
        const left = it.el.offsetLeft + tx, right = left + it.el.offsetWidth;
        const dx = Math.max(Math.min(right, vw), left + it.labelW) - right;
        it.label.style.transform = dx ? `translate3d(${dx}px,0,0)` : '';
      });
    };
    const layout = () => {
      vw = f.getBoundingClientRect().width;
      items.forEach((it) => { it.labelW = it.label.offsetWidth; });
      period = els[n].offsetLeft - els[0].offsetLeft;
      render();
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - (last || now));
      last = now;
      if (!visible || drag || now - wheelAt < WHEEL_IDLE || document.documentElement.dataset.intro) return;
      // Whatever speed a swipe leaves behind (either direction) decays smoothly down to the drift speed; it never comes to a stop.
      const target = reduced ? 0 : SPEED;
      v = target + (v - target) * Math.exp(-dt / EASE_TAU);
      pos += v * dt / 1000;
      render();
    };

    // A horizontal finger drag moves the row directly; vertical drags are left to the page (touch-action:pan-y).
    const onDown = (e) => {
      swiped = false;
      drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, lastX: e.clientX, lastT: e.timeStamp, vel: 0, live: false };
    };
    const onMove = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      if (!drag.live) {
        const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
        drag.live = true;
        try { f.setPointerCapture(e.pointerId); } catch (err) {}
      }
      const dt = Math.max(1, e.timeStamp - drag.lastT), d = drag.lastX - e.clientX;
      drag.vel = 0.7 * drag.vel + 0.3 * (d / dt * 1000); // finger speed in row px/s, smoothed
      drag.lastX = e.clientX; drag.lastT = e.timeStamp;
      pos += d;
      render();
    };
    const onEnd = (e) => {
      const d = drag;
      drag = null;
      if (!d || !d.live) return;
      swiped = true;
      // A finger that stopped before lifting leaves no fling.
      const idle = e.timeStamp - d.lastT > 80;
      v = idle ? SPEED : Math.max(-MAX_FLING, Math.min(MAX_FLING, d.vel));
      last = 0;
    };
    const onClickCapture = (e) => { if (swiped) { swiped = false; e.preventDefault(); e.stopPropagation(); } };
    // Trackpad / mouse-wheel sideways scrolling moves the row too (as on desktop); mostly-vertical wheel input scrolls the page as usual.
    const onWheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      // The photos hold still while the trackpad is scrolling them, then ease back up to the drift speed once the scrolling has been still for WHEEL_IDLE.
      wheelAt = performance.now();
      v = 0;
      pos += e.deltaX * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vw : 1);
      render();
    };
    f.addEventListener('wheel', onWheel, { passive: false });
    f.addEventListener('pointerdown', onDown);
    f.addEventListener('pointermove', onMove);
    f.addEventListener('pointerup', onEnd);
    f.addEventListener('pointercancel', onEnd);
    f.addEventListener('click', onClickCapture, true);

    const io = 'IntersectionObserver' in window ? new IntersectionObserver(([en]) => { visible = en.isIntersecting; last = 0; }) : null;
    if (io) io.observe(f);

    layout();
    raf = requestAnimationFrame(tick);
    const ro = 'ResizeObserver' in window ? new ResizeObserver(layout) : null;
    if (ro) ro.observe(f); else window.addEventListener('resize', layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    return () => {
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (ro) ro.disconnect(); else window.removeEventListener('resize', layout);
      f.removeEventListener('wheel', onWheel);
      f.removeEventListener('pointerdown', onDown);
      f.removeEventListener('pointermove', onMove);
      f.removeEventListener('pointerup', onEnd);
      f.removeEventListener('pointercancel', onEnd);
      f.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  return (
    <section aria-label="Featured photography" style={css(`padding-top:var(--space-16);`)}>
      <div ref={frame} style={css(`position:relative;width:100%;overflow:hidden;touch-action:pan-y;`)}>
        <div ref={row} style={css(`display:flex;will-change:transform;`)}>
          {Array.from({ length: COPIES }, (_, c) => heroPhotos.map((p, i) => {
            const portrait = p.ratio.startsWith('1067');
            return (
              <button key={`${c}-${p.label}`} className="hero-ed-item" onClick={() => open(p.cat)} aria-label={`View ${p.label} work`}
                aria-hidden={c ? 'true' : undefined} tabIndex={c ? -1 : undefined}
                style={{ ...css(`flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-4);background:none;border:none;padding:0;cursor:pointer;`), '--i': i }}>
                <span className="hero-ed-label t-caption" aria-hidden="true" style={css(`padding-right:var(--space-16);line-height:15px;will-change:transform;`)}>{p.label}</span>
                <span style={{ position: 'relative', display: 'block', height: 'calc(100vw * 5 / 4)', aspectRatio: p.ratio, overflow: 'hidden', background: 'var(--color-border-default)' }}>
                  <img src={p.src} srcSet={cloudinarySrcSet(p.src, WIDTHS)} sizes={portrait ? '84vw' : '188vw'} alt="" draggable="false" decoding="async"
                    loading="eager" fetchpriority={c === 0 && i === 0 ? 'high' : undefined}
                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                </span>
              </button>
            );
          }))}
        </div>
      </div>
    </section>
  );
}
