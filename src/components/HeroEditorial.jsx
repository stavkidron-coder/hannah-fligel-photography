import { useContext, useLayoutEffect, useRef } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { NAV_EDITORIAL_H } from './NavEditorial';
import { heroPhotos } from '../data/heroPhotos';

// Each photo opens Work pre-filtered; the Work page only has Families / Maternity / Couples tabs, so portraits and engagements land on Couples.
// Figma "Hero Images": a row of category photos with small labels above each.
const LABEL_H = 19; // 15px label + 4px gap (space/4)
const slides = heroPhotos;

// The row drifts right to left on a loop. It is rendered COPIES times and wraps by exactly one set, so the loop is seamless.
// Sideways wheel/trackpad input and Left/Right arrows nudge it along (or back) without touching the page scroll.
// The hero is an ordinary section: it scrolls away with the page, and the nav logo animation plays on that scroll down to the intro.
const SPEED = 80;       // px per second
const COPIES = 3;        // enough that a set always covers the viewport, whatever its size
const PHOTO_GAP = 0;     // px between photos (the Figma design has 20)
const NUDGE_TAU = 120;   // ms; how quickly a nudge glides to rest
const MIN_LOGO_PX = 300; // shortest the logo animation may be, if the next section is very short

const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function HeroEditorial() {
  const { setCat } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const imgH = `calc(100dvh - ${NAV_EDITORIAL_H} - ${LABEL_H}px)`;

  const wrap = useRef(null), stage = useRef(null), row = useRef(null);

  useLayoutEffect(() => {
    const els = [...row.current.querySelectorAll('.hero-ed-item')];
    const items = els.map((el) => ({ el, label: el.querySelector('.hero-ed-label'), labelW: 0 }));
    const n = slides.length;
    let period = 0, pos = 0, pending = 0, last = 0, raf = 0;

    // The highlighted photo is whichever one is under the mouse. CSS :hover doesn't refresh while the row slides under a still
    // pointer, so remember the pointer and re-run the hit test on every animation frame.
    let pointer = null;
    const refreshActive = () => {
      let active = null;
      if (pointer) {
        active = items.find((it) => {
          const r = it.el.getBoundingClientRect();
          return pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom;
        }) || null;
      }
      items.forEach((it) => { if (it === active) it.el.dataset.active = 'true'; else delete it.el.dataset.active; });
      if (active) row.current.dataset.active = 'true'; else delete row.current.dataset.active;
    };
    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return;
      pointer = { x: e.clientX, y: e.clientY };
      refreshActive();
    };
    const onPointerLeave = () => { pointer = null; refreshActive(); };
    stage.current.addEventListener('pointermove', onPointerMove);
    stage.current.addEventListener('pointerleave', onPointerLeave);

    const layout = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const navH = Math.max(72, vw * 0.0629);
      const stageH = Math.max(480, vh - navH);
      stage.current.style.height = `${stageH}px`;
      items.forEach((it) => { it.labelW = it.label.offsetWidth; });
      period = els[n].offsetLeft - els[0].offsetLeft;

      // The logo animation plays over the scroll from the top of the page until the next section's top edge reaches the top of the page.
      const next = wrap.current.nextElementSibling;
      const nr = next && next.getBoundingClientRect();
      const nextEnd = !next ? 0 : nr.top + window.scrollY;
      wrap.current.dataset.logoStart = '0';
      wrap.current.dataset.logoEnd = String(Math.max(MIN_LOGO_PX, nextEnd));
      window.dispatchEvent(new Event('hero-editorial-layout'));
      render();
    };

    function render() {
      if (!period) return;
      pos = ((pos % period) + period) % period;
      const tx = -pos;
      row.current.style.transform = `translate3d(${tx}px,0,0)`;
      // A photo's label sits at its right edge. While the photo is cut off at the right of the screen the label stays on screen,
      // but never leaves its own photo, so a photo that is only just peeking in takes its label with it.
      const vw = stage.current.clientWidth;
      items.forEach((it) => {
        const left = it.el.offsetLeft + tx, right = left + it.el.offsetWidth;
        const dx = Math.max(Math.min(right, vw), left + it.labelW) - right;
        it.label.style.transform = dx ? `translate3d(${dx}px,0,0)` : '';
      });
      refreshActive();
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - (last || now));
      last = now;
      let step = 0;
      if (!reduced && !document.documentElement.dataset.intro) step += SPEED * dt / 1000;
      if (Math.abs(pending) > 0.05) { const k = pending * (1 - Math.exp(-dt / NUDGE_TAU)); pending -= k; step += k; } else pending = 0;
      if (step) { pos += step; render(); }
    };

    // Sideways input moves the carousel: a mostly-horizontal wheel/trackpad gesture (or Left/Right arrow) over the hero.
    // Swiping left moves forward. Always swallowed over the hero so it can't trigger the browser's swipe back/forward.
    const onWheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) <= Math.abs(e.deltaY) || !stage.current.contains(e.target)) return;
      e.preventDefault();
      pending += e.deltaX * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerWidth : 1);
    };
    const onKey = (e) => {
      if ((e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target && e.target.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
      const r = stage.current.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) return;
      e.preventDefault();
      pending += e.key === 'ArrowRight' ? 160 : -160;
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    const prevOverscroll = document.documentElement.style.overscrollBehaviorX;
    document.documentElement.style.overscrollBehaviorX = 'none';

    layout();
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overscrollBehaviorX = prevOverscroll;
      stage.current && stage.current.removeEventListener('pointermove', onPointerMove);
      stage.current && stage.current.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', layout);
    };
  }, []);

  return (
    <section ref={wrap} id="hero-editorial" aria-label="Featured photography" style={css(`position:relative;`)}>
      <div ref={stage} style={css(`height:calc(100dvh - ${NAV_EDITORIAL_H});min-height:480px;overflow:hidden;`)}>
        <div ref={row} className="hero-editorial-row" style={css(`display:flex;gap:${PHOTO_GAP}px;height:100%;will-change:transform;`)}>
          {Array.from({ length: COPIES }, (_, c) => slides.map((s, i) => (
            <button key={`${c}-${s.label}`} className="hero-ed-item" onClick={() => open(s.cat)} aria-label={`View ${s.label} work`} aria-hidden={c ? 'true' : undefined} tabIndex={c ? -1 : undefined} style={{ ...css(`flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-4);background:none;border:none;padding:0;cursor:pointer;`), '--i': i }}>
              <span className="hero-ed-label t-mono-sm" aria-hidden="true" style={css(`padding-right:var(--space-12);line-height:15px;`)}>{s.label}</span>
              <span className="hero-ed-photo" style={{ position: 'relative', display: 'block', height: `max(${imgH}, 440px)`, aspectRatio: s.ratio }}>
                <img src={s.src} alt="" draggable="false" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                <span aria-hidden="true" className="hero-ed-dim"></span>
              </span>
            </button>
          )))}
        </div>
      </div>
    </section>
  );
}
