import { useContext, useLayoutEffect, useRef } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { smoothY, subscribeSmoothScroll } from '../lib/smoothScroll';

// Everything scales from the Figma frame (1748px wide): 110px nav height = 6.29vw, 64px wordmark = 3.66vw.
export const NAV_EDITORIAL_H = 'max(72px,6.29vw)';
const PAD_Y = 'max(12px,.97vw)';
const FINAL_H = `calc(2 * ${PAD_Y} + 36px)`; // logo height plus the same padding above and below

// End state: the 60x36 logo box with H, F and P in a straight line. Letter centres are measured from the box's top-left.
const LOGO_W = 60, LOGO_H = 36; // a rectangle that hugs the line of letters
const LOGO_FONT = 22;
// Placed by the letters' ink (not their text boxes), measured for Antic Didone at 22px: capitals sit 0.2px above their line box's centre,
// and H/F/P are different widths. 6.5px between letters leaves 7px at each side of the group, centred in the 60px box.
const TARGET = { h: [14.07, 18.2], f: [31.85, 18.2], p: [48.97, 18.2] };

// Scroll timeline (0 = top of page, 1 = hero scrolled out from under the nav).
// Once scrolled, the cream gradient behind the nav stretches to this many times the nav's height so content fades out slowly beneath it
// (at the top of the page it stays nav-height so the hero photos start crisp).
const FADE_LENGTH = 1.9;
const FADE_END = 0.25, MOVE_END = 0.65;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

// Desktop nav for the editorial design (Figma "Nav", node 31:397). On Home the "Hannah Fligel photography"
// wordmark collapses into the HFP logo once the hero photos have turned to dust; elsewhere the finished logo shows.
export default function NavEditorial() {
  const { page, go } = useContext(AppContext);
  const links = [['Home', 'home'], ['Work', 'work'], ['About', 'about'], ['Pricing', 'pricing'], ['Contact', 'contact']];
  const isHome = page === 'home';

  const btn = useRef(null), word = useRef(null), bg = useRef(null);
  const hEl = useRef(null), fEl = useRef(null), pEl = useRef(null);
  const fades = useRef([]), box = useRef(null), outline = useRef(null);
  const geo = useRef(null);

  useLayoutEffect(() => {
    const letters = () => [['h', hEl.current], ['f', fEl.current], ['p', pEl.current]];

    // Measure the wordmark untransformed so every letter knows where it starts and how far to travel.
    const measure = () => {
      letters().forEach(([, el]) => { el.style.transform = 'none'; });
      const origin = btn.current.getBoundingClientRect();
      const fs = parseFloat(getComputedStyle(hEl.current).fontSize);
      const fsP = parseFloat(getComputedStyle(pEl.current).fontSize);
      const g = { w: word.current.offsetWidth, h: word.current.offsetHeight, letters: {} };
      letters().forEach(([key, el]) => {
        const r = el.getBoundingClientRect();
        const sx = r.left - origin.left + r.width / 2, sy = r.top - origin.top + r.height / 2;
        g.letters[key] = { dx: TARGET[key][0] - sx, dy: TARGET[key][1] - sy, k: LOGO_FONT / (key === 'p' ? fsP : fs) };
      });
      geo.current = g;
    };

    // The hero publishes where (in page scroll) the logo animation starts and ends: after its photos have turned to dust.
    const progress = () => {
      if (!isHome) return 1;
      const hero = document.getElementById('hero-editorial');
      if (!hero) return 1;
      const start = parseFloat(hero.dataset.logoStart), end = parseFloat(hero.dataset.logoEnd);
      if (!(end > start)) return 0;
      return clamp01((smoothY() - start) / (end - start));
    };

    const apply = () => {
      const g = geo.current;
      if (!g) return;
      const p = progress();
      const fade = clamp01(p / FADE_END);
      const m = clamp01((p - FADE_END) / (MOVE_END - FADE_END)), e = ease(m);
      const b = clamp01((p - MOVE_END) / (1 - MOVE_END));

      fades.current.forEach((el) => { if (el) el.style.opacity = String(1 - fade); });
      letters().forEach(([key, el]) => {
        const L = g.letters[key];
        el.style.transform = `translate(${L.dx * e}px,${L.dy * e}px) scale(${lerp(1, L.k, e)})`;
      });

      btn.current.style.width = `${lerp(g.w, LOGO_W, e)}px`;
      btn.current.style.height = `${lerp(g.h, LOGO_H, e)}px`;
      box.current.style.opacity = String(b);
      outline.current.style.strokeDashoffset = String(1 - b);
      bg.current.style.height = `calc((${NAV_EDITORIAL_H} + (${FINAL_H} - ${NAV_EDITORIAL_H}) * ${ease(p)}) * ${lerp(1, FADE_LENGTH, ease(p))})`;
    };

    const remeasure = () => { measure(); apply(); };
    remeasure();
    const unsub = subscribeSmoothScroll(apply);
    window.addEventListener('hero-editorial-layout', apply);
    window.addEventListener('resize', remeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
    return () => { unsub(); window.removeEventListener('hero-editorial-layout', apply); window.removeEventListener('resize', remeasure); };
  }, [isHome]);

  const ink = 'var(--ink)';
  const letter = css(`display:inline-block;transform-origin:center;will-change:transform;`);
  const setFade = (i) => (el) => { fades.current[i] = el; };

  return (
    <nav style={css(`position:sticky;top:0;z-index:50;height:${NAV_EDITORIAL_H};box-sizing:border-box;display:flex;align-items:flex-start;justify-content:space-between;padding:${PAD_Y} 3.2vw 0;pointer-events:none;`)}>
      <div ref={bg} aria-hidden="true" style={css(`position:absolute;top:0;left:0;right:0;background:linear-gradient(to bottom,#F1EBE1 0%,rgba(241,235,225,.94) 20%,rgba(241,235,225,.75) 40%,rgba(241,235,225,.45) 60%,rgba(241,235,225,.18) 80%,rgba(241,235,225,0) 100%);`)}></div>
      <button ref={btn} onClick={() => go('home')} aria-label="Hannah Fligel Photography – Home" style={css(`position:relative;flex:none;pointer-events:auto;background:none;border:none;padding:0;cursor:pointer;color:${ink};font-size:max(26px,3.66vw);`)}>
        <span ref={box} aria-hidden="true" style={css(`position:absolute;left:0;top:0;width:${LOGO_W}px;height:${LOGO_H}px;box-sizing:border-box;opacity:0;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);background:rgba(255,255,255,0.01);box-shadow:0 0 60px 30px rgba(250,246,239,0.3);`)}></span>
        <svg aria-hidden="true" width={LOGO_W} height={LOGO_H} viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} style={css(`position:absolute;left:0;top:0;overflow:visible;`)}>
          {/* Starts top-centre and runs clockwise. */}
          <path ref={outline} d={`M${LOGO_W / 2} .5H${LOGO_W - .5}V${LOGO_H - .5}H.5V.5H${LOGO_W / 2}`} pathLength="1" fill="none" stroke="#2E2A24" strokeWidth="1" strokeDasharray="1" strokeDashoffset="1"></path>
        </svg>
        <span ref={word} aria-hidden="true" style={css(`position:absolute;left:0;top:0;pointer-events:none;display:flex;align-items:baseline;gap:.1875em;white-space:nowrap;letter-spacing:.0375em;`)}>
          <span style={css(`font-family:'Antic Didone',serif;font-size:1em;line-height:normal;`)}>
            <span ref={hEl} style={letter}>H</span><span ref={setFade(0)}>annah</span>{' '}<span ref={fEl} style={letter}>F</span><span ref={setFade(1)}>ligel</span>
          </span>
          <span style={css(`font-family:'Antic Didone',serif;font-size:.375em;line-height:normal;`)}>
            <span ref={pEl} style={letter}>P</span><span ref={setFade(2)}>hotography</span>
          </span>
        </span>
      </button>
      <div style={css(`position:relative;pointer-events:auto;display:flex;align-items:center;gap:clamp(14px,2.4vw,42px);`)}>
        {links.map(([label, key]) => (
          <button key={key} className="nav-editorial-link" onClick={() => go(key)} aria-current={page === key ? 'page' : undefined} style={css(`background:none;border:none;cursor:pointer;padding:8px 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:2.4px;text-transform:uppercase;color:var(--ink);position:relative;`)}>{label}<span aria-hidden="true" className="nav-editorial-line"></span></button>
        ))}
      </div>
    </nav>
  );
}
