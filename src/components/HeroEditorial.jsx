import { useContext, useLayoutEffect, useRef } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { NAV_EDITORIAL_H } from './NavEditorial';
import { smoothY, subscribeSmoothScroll } from '../lib/smoothScroll';

// Each photo opens Work pre-filtered; the Work page only has Families / Maternity / Couples tabs, so portraits and engagements land on Couples.
// Figma "Hero Images": a row of category photos with small labels above each.
const LABEL_H = 18; // 15px label + 3px gap
const slides = [
  { label: 'portraits', cat: 'couples', src: '/images/portraits/emma-senior-photos/emma-senior-photos147.jpg', ratio: '1067 / 1600' },
  { label: 'families', cat: 'families', src: '/images/families/madison-tanya-hunter/Madison_Tanya_Hunter_2025-08_381.jpg', ratio: '1067 / 1600' },
  { label: 'couples', cat: 'couples', src: '/images/hero/HeidiANDAndre161.jpg', ratio: '1600 / 1067' },
  { label: 'maternity', cat: 'maternity', src: '/images/maternity/angelica-eric/AANDE-Maternity176.jpg', ratio: '1067 / 1600' },
  { label: 'engagements', cat: 'couples', src: '/images/portraits/nandini-srikanth/NandiniANDSrikanth259.jpg', ratio: '1067 / 1600' },
];

// Scroll timeline (px of scroll after the hero pins): the row walks left until the last photo is flush right,
// then a short hold, then the photos on screen fade out one after another, left to right, and the hero unpins. The nav logo animation starts together with the fade.
const WALK_PACE = 1.35;  // px of scroll per px the row moves; above 1 slows the walk down
const FADE_BLUR = 16;    // px of blur a photo reaches as it finishes fading out
const HOLD_VH = 0.5;     // buffer after the walk ends where the last photos just sit, so one big scroll doesn't run straight into the fade
const FADE_VH = 1;       // fade-out phase length, in screen heights
const MIN_LOGO_PX = 300; // shortest the logo animation may be, if the next section is very short

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export default function HeroEditorial() {
  const { setCat } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const imgH = `calc(100dvh - ${NAV_EDITORIAL_H} - ${LABEL_H}px)`;

  const wrap = useRef(null), stage = useRef(null), row = useRef(null);

  useLayoutEffect(() => {
    const els = [...row.current.querySelectorAll('.hero-ed-item')];
    const items = els.map((el) => ({ el, photo: el.querySelector('.hero-ed-photo'), rank: -1 }));
    let L = null; // layout numbers

    // The highlighted photo is whichever one is under the mouse. CSS :hover doesn't refresh while the row slides under a still
    // pointer, so remember the pointer and re-run the hit test on every animation frame.
    let pointer = null;
    const refreshActive = () => {
      let active = null;
      if (pointer) {
        active = items.find((it) => {
          if (it.el.style.pointerEvents === 'none') return false;
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
      stage.current.style.top = `${navH}px`;
      stage.current.style.height = `${stageH}px`;
      const last = els[els.length - 1];
      const rowW = last.offsetLeft + last.offsetWidth;
      const travel = Math.max(0, rowW - vw);
      const walk = travel * WALK_PACE, hold = vh * HOLD_VH, fade = vh * FADE_VH;
      // The pin ends with the fade, so the page moves on right away; the logo animation plays while the next section scrolls up.
      wrap.current.style.height = `${stageH + walk + hold + fade}px`;

      // Which photos are on screen once the row has walked to its end, left to right: those are the ones that fade out.
      const onScreen = items.filter((it) => it.el.offsetLeft + it.el.offsetWidth - travel > 0 && it.el.offsetLeft - travel < vw)
        .sort((a, b) => a.el.offsetLeft - b.el.offsetLeft);
      items.forEach((it) => { it.rank = onScreen.indexOf(it); });

      // Where the page's scroll sits when the hero pins, so scroll position maps to timeline position.
      const pinY = wrap.current.getBoundingClientRect().top + window.scrollY - navH;
      L = { travel, walk, hold, fade, n: onScreen.length, pinY };
      wrap.current.dataset.logoStart = String(pinY + walk + hold);
      // The logo animation runs until the next section (the intro text) is fully on screen: its bottom edge reaching the bottom of the viewport.
      const next = wrap.current.nextElementSibling;
      const nextBottom = next ? next.getBoundingClientRect().bottom + window.scrollY : 0;
      const logoStart = pinY + walk + hold;
      wrap.current.dataset.logoEnd = String(Math.max(logoStart + MIN_LOGO_PX, nextBottom - vh));
      window.dispatchEvent(new Event('hero-editorial-layout'));
      update();
    };

    function update(y = smoothY()) {
      if (!L) return;
      const s = y - L.pinY;
      row.current.style.transform = `translate3d(${-Math.min(Math.max(s / WALK_PACE, 0), L.travel)}px,0,0)`;
      const d = clamp01((s - L.walk - L.hold) / L.fade);
      // Each on-screen photo gets a window of the fade phase, staggered left to right with overlap.
      const w = Math.min(1, 1.6 / Math.max(L.n, 1));
      items.forEach((it) => {
        let q = 0;
        if (it.rank >= 0) {
          const start = L.n > 1 ? it.rank * (1 - w) / (L.n - 1) : 0;
          q = clamp01((d - start) / w);
        }
        it.el.style.pointerEvents = q > 0 ? 'none' : '';
        it.el.style.opacity = q > 0 ? String(1 - q) : '';
        it.photo.style.filter = q > 0 ? `blur(${(q * FADE_BLUR).toFixed(1)}px)` : '';
      });
      refreshActive();
    }

    layout();
    const unsub = subscribeSmoothScroll(update);
    window.addEventListener('resize', layout);
    return () => {
      unsub();
      stage.current && stage.current.removeEventListener('pointermove', onPointerMove);
      stage.current && stage.current.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', layout);
    };
  }, []);

  // margin-bottom pulls the next section's top padding (clamp(80px,11vw,128px)) up under the empty hero, so its text starts rising as soon as the photos have faded.
  return (
    <section ref={wrap} id="hero-editorial" aria-label="Featured photography" style={css(`position:relative;height:400vh;margin-bottom:calc(-1 * clamp(80px,11vw,128px));`)}>
      <div ref={stage} style={css(`position:sticky;top:${NAV_EDITORIAL_H};height:calc(100dvh - ${NAV_EDITORIAL_H});min-height:480px;overflow:hidden;`)}>
        <div ref={row} className="hero-editorial-row" style={css(`display:flex;gap:20px;height:100%;will-change:transform;`)}>
          {slides.map((s) => (
            <button key={s.label} className="hero-ed-item" onClick={() => open(s.cat)} aria-label={`View ${s.label} work`} style={css(`flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:3px;background:none;border:none;padding:0;cursor:pointer;`)}>
              <span className="hero-ed-label" aria-hidden="true" style={css(`padding-right:12px;font-family:'Mulish',sans-serif;font-size:12px;line-height:15px;color:#000;`)}>{s.label}</span>
              <span className="hero-ed-photo" style={{ position: 'relative', display: 'block', height: `max(${imgH}, 440px)`, aspectRatio: s.ratio }}>
                <img src={s.src} alt="" draggable="false" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                <span aria-hidden="true" className="hero-ed-dim"></span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
