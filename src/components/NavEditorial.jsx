import { useContext, useLayoutEffect, useRef } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { smoothY, subscribeSmoothScroll } from '../lib/smoothScroll';

// Everything scales from the Figma frame (1748px wide): 110px nav height = 6.29vw, 64px wordmark = 3.66vw.
export const NAV_EDITORIAL_H = 'max(72px,6.29vw)';
const PAD_Y = 'max(12px,.97vw)';
// Phones (<= 680px, Figma "Nav / Mobile"): a 56px bar, 10px above and below the 36px logo, with a hamburger on the right.
export const NAV_PHONE_H = '56px';
const PHONE_PAD_Y = '10px';

// End state: the 60x36 logo box with H, F and P in a straight line. Letter centres are measured from the box's top-left.
const LOGO_W = 60, LOGO_H = 36; // a rectangle that hugs the line of letters
const LOGO_FONT = 22;
// Placed by the letters' ink (not their text boxes), measured for Antic Didone at 22px: capitals sit 0.2px above their line box's centre,
// and H/F/P are different widths. 6.5px between letters leaves 7px at each side of the group, centred in the 60px box.
const TARGET = { h: [14.07, 18.2], f: [31.85, 18.2], p: [48.97, 18.2] };

// Scroll timeline (0 = top of page, 1 = hero scrolled out from under the nav).
// The nav is a solid cream bar that hugs the logo: padding above and below the logo button, so it shrinks as the wordmark collapses.
const FADE_END = 0.25, MOVE_END = 0.65;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

// Nav for the editorial design (Figma "Nav", node 31:397; phones: "Nav / Mobile"). On Home the "Hannah Fligel photography"
// wordmark collapses into the HFP logo once the hero photos have turned to dust; elsewhere (and always on phones) the finished logo shows.
export default function NavEditorial() {
  const { page, go, width, menuOpen, toggleMenu, menuButton } = useContext(AppContext);
  const links = [['Home', 'home'], ['Work', 'work'], ['About', 'about'], ['Pricing', 'pricing'], ['Contact', 'contact']];
  const isHome = page === 'home';
  const isPhone = width <= 680;
  const navH = isPhone ? NAV_PHONE_H : NAV_EDITORIAL_H;
  const padY = isPhone ? PHONE_PAD_Y : PAD_Y;

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
      if (isPhone) return 1; // phones always show the finished logo, no wordmark and no transition
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
      bg.current.style.height = `calc(2 * ${padY} + ${lerp(g.h, LOGO_H, e)}px)`;
    };

    const remeasure = () => { measure(); apply(); };
    remeasure();
    const unsub = subscribeSmoothScroll(apply);
    window.addEventListener('hero-editorial-layout', apply);
    window.addEventListener('resize', remeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
    return () => { unsub(); window.removeEventListener('hero-editorial-layout', apply); window.removeEventListener('resize', remeasure); };
  }, [isHome, isPhone]);

  const ink = 'var(--ink)';
  const letter = css(`display:inline-block;transform-origin:center;will-change:transform;`);
  const setFade = (i) => (el) => { fades.current[i] = el; };

  return (
    <nav style={css(`position:sticky;top:0;z-index:${isPhone && menuOpen ? 70 : 50};height:${navH};box-sizing:border-box;display:flex;align-items:flex-start;justify-content:space-between;padding:${padY} var(--layout-page-margin) 0;pointer-events:none;`)}>
      <div ref={bg} aria-hidden="true" style={css(`position:absolute;top:0;left:0;right:0;background:#F1EBE1;`)}></div>
      <button ref={btn} onClick={() => go('home')} aria-label="Hannah Fligel Photography – Home" style={css(`position:relative;flex:none;pointer-events:auto;background:none;border:none;padding:0;cursor:pointer;color:${ink};font-size:max(26px,3.66vw);`)}>
        <span ref={box} aria-hidden="true" style={css(`position:absolute;left:0;top:0;width:${LOGO_W}px;height:${LOGO_H}px;box-sizing:border-box;opacity:0;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);background:rgba(255,255,255,0.01);box-shadow:0 0 60px 30px rgba(250,246,239,0.3);`)}></span>
        <svg aria-hidden="true" width={LOGO_W} height={LOGO_H} viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} style={css(`position:absolute;left:0;top:0;overflow:visible;`)}>
          {/* Starts top-centre and runs clockwise. */}
          <path ref={outline} d={`M${LOGO_W / 2} .5H${LOGO_W - .5}V${LOGO_H - .5}H.5V.5H${LOGO_W / 2}`} pathLength="1" fill="none" stroke="#2E2A24" strokeWidth="1" strokeDasharray="1" strokeDashoffset="1"></path>
        </svg>
        <span ref={word} aria-hidden="true" style={css(`position:absolute;left:0;top:0;pointer-events:none;display:flex;align-items:baseline;gap:.1875em;white-space:nowrap;`)}>
          <span style={css(`font-family:var(--font-display);font-size:1em;line-height:normal;letter-spacing:-.005em;`)}>
            <span ref={hEl} style={letter}>H</span><span ref={setFade(0)}>annah</span>{' '}<span ref={fEl} style={letter}>F</span><span ref={setFade(1)}>ligel</span>
          </span>
          <span style={css(`font-family:var(--font-display);font-size:.375em;line-height:normal;letter-spacing:.1em;`)}>
            <span ref={pEl} style={letter}>P</span><span ref={setFade(2)}>hotography</span>
          </span>
        </span>
      </button>
      {isPhone ? (
        <button ref={menuButton} onClick={toggleMenu} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-haspopup="dialog" aria-controls="mobile-menu" aria-expanded={menuOpen} style={css(`position:relative;flex:none;pointer-events:auto;align-self:flex-start;margin-top:-4px;width:44px;height:44px;padding:0 0 0 20px;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:flex-end;color:${ink};`)}>
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={menuOpen ? 'M5 5L19 19M19 5L5 19' : 'M3 7H21M3 12H21M3 17H21'}></path>
          </svg>
        </button>
      ) : (
      <div style={css(`position:relative;pointer-events:auto;display:flex;align-items:center;gap:clamp(16px,2.3vw,var(--space-40));`)}>
        {links.map(([label, key]) => (
          <button key={key} className="nav-editorial-link t-label" onClick={() => go(key)} aria-current={page === key ? 'page' : undefined} style={css(`background:none;border:none;cursor:pointer;padding:8px 0;position:relative;`)}>{label}<span aria-hidden="true" className="nav-editorial-line"></span></button>
        ))}
      </div>
      )}
    </nav>
  );
}
