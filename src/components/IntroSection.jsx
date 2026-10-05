import { useContext, useLayoutEffect, useRef } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { smoothY, subscribeSmoothScroll } from '../lib/smoothScroll';

// Figma "Intro Section": copy blocks joined by thin elbow connectors round a boxed pull-quote.
// The desktop layout is the Figma frame (1750 wide) scaled to fit the viewport and pinned while it builds up on scroll:
// text 1 rises in, line 1 draws to text 2, which rises in, line 2 draws to the quote, line 3 draws to the last text.
// Below DESKTOP_MIN the blocks stack and each simply rises in as it scrolls into view.
const STAGE_W = 1750;
const CROP_TOP = 230, CROP_H = 650; // the frame has a lot of empty space above and below the content
const DESKTOP_MIN = 1100;
const LINE = '#BBA17C';

// Scroll timeline, in screen heights of scroll after the scene pins.
const PIN_VH = 4;       // total scroll distance the scene is pinned for
const EARLY_VH = 0.3;   // the scene pins this much before the hero photos have finished fading, so text 1 starts as they go
const TEXT_VH = 0.35;   // how long each text block takes to rise in
const HOLD_VH = 0.4;    // pause at the end before the page moves on
const RISE = 40;        // px (in Figma units) a block travels up as it fades in

// Connectors in Figma coordinates, each running from the text it leaves to the text it reaches.
const PATHS = [
  [[549, 487], [874, 487], [874, 374], [942, 374]],
  [[1404, 480], [1489, 480], [1489, 635], [1194, 635]],
  [[555, 635], [347, 635], [347, 764], [504, 764]],
];
const lengthOf = (pts) => pts.reduce((a, p, i) => (i ? a + Math.abs(p[0] - pts[i - 1][0]) + Math.abs(p[1] - pts[i - 1][1]) : 0), 0);
const LENGTHS = PATHS.map(lengthOf);
// Every line draws at the same speed, so the scroll each one takes is proportional to its length.
const PX_VH = (PIN_VH - HOLD_VH - 4 * TEXT_VH) / LENGTHS.reduce((a, b) => a + b, 0);
// Start/end of each step, in screen heights: text 1, line 1, text 2, line 2, quote, line 3, text 4.
const STEPS = (() => {
  const out = [];
  let t = 0;
  const add = (d) => { out.push([t, t + d]); t += d; };
  add(TEXT_VH); add(LENGTHS[0] * PX_VH); add(TEXT_VH); add(LENGTHS[1] * PX_VH); add(TEXT_VH); add(LENGTHS[2] * PX_VH); add(TEXT_VH);
  return out;
})();

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);
const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const body = `font-size:20px;line-height:33.2px;color:var(--soft);margin:0;`;
const heading = `font-weight:400;font-size:48px;line-height:1.1;color:var(--ink);margin:0;`;

const copy1 = `I’m a San Diego photographer with 10+ years of experience, working with couples, individuals, engaged and newly-engaged couples, expecting parents, families, and newborns. I shoot in a style that's natural, candid, and editorial – warm and real.`;
const copy2 = (<>I photograph throughout San Diego County (travel inquiries outside San Diego County are always welcome), wherever the light is good and the moment is honest (backyards, living rooms, the coast, golden late-afternoon light). The goal is always the same: images that feel like <strong style={{ fontStyle: 'italic', fontWeight: 700 }}>you</strong>, not like a photoshoot.</>);
const copy3 = (<>It's what I look for in every session. Not the moments you'd plan for, but the ones that happen when you forget I'm there. After 10+ years doing this, <em>I know exactly how to find them</em>.</>);
const quote = 'The real story, not the posed one';

// Stacked layout: each block fades up once, the first time it is partly on screen.
function useRiseOnView(ref, active) {
  useLayoutEffect(() => {
    if (!active || reduced || !ref.current || !('IntersectionObserver' in window)) return;
    const els = [...ref.current.children];
    els.forEach((el) => { el.style.opacity = '0'; el.style.transform = 'translateY(28px)'; });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.style.transition = 'opacity .8s ease-out, transform .8s ease-out';
        e.target.style.opacity = '1'; e.target.style.transform = 'none';
        io.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);
}

export default function IntroSection() {
  const { width } = useContext(AppContext);
  const desktop = width > DESKTOP_MIN;
  const s = Math.min(1, width / STAGE_W);

  const wrap = useRef(null), stack = useRef(null), blocks = useRef([]), lines = useRef([]);
  useRiseOnView(stack, !desktop);

  useLayoutEffect(() => {
    if (!desktop) return;
    let pinY = 0;
    const measure = () => { pinY = wrap.current.getBoundingClientRect().top + window.scrollY; update(); };
    function update(y = smoothY()) {
      const sv = (y - pinY) / window.innerHeight; // scroll since the scene pinned, in screen heights
      const at = (i) => (reduced ? 1 : smooth(clamp01((sv - STEPS[i][0]) / (STEPS[i][1] - STEPS[i][0]))));
      // blocks: text 1, text 2, quote, text 4 are steps 0, 2, 4, 6
      [0, 2, 4, 6].forEach((step, k) => {
        const el = blocks.current[k], p = at(step);
        el.style.opacity = String(p);
        el.style.translate = `0 ${(1 - p) * RISE}px`;
      });
      // lines are steps 1, 3, 5; drawn linearly with scroll so the pen moves at a steady speed
      [1, 3, 5].forEach((step, k) => {
        const p = reduced ? 1 : clamp01((sv - STEPS[step][0]) / (STEPS[step][1] - STEPS[step][0]));
        lines.current[k].style.strokeDashoffset = String(1 - p);
      });
    }
    measure();
    const unsub = subscribeSmoothScroll(update);
    // The hero re-measures itself on resize and tells us once it has, since where it ends decides where this scene starts.
    window.addEventListener('hero-editorial-layout', measure);
    window.addEventListener('resize', measure);
    return () => { unsub(); window.removeEventListener('hero-editorial-layout', measure); window.removeEventListener('resize', measure); };
  }, [desktop]);

  if (!desktop) {
    return (
      <section style={css(`min-height:100dvh;display:flex;align-items:center;`)}>
        <div ref={stack} style={css(`max-width:620px;margin:0 auto;padding:clamp(56px,11vw,96px) 32px;display:flex;flex-direction:column;gap:28px;`)}>
          <div>
            <h2 style={css(`${heading}font-size:clamp(34px,7vw,48px);padding-bottom:12px;border-bottom:1px solid ${LINE};margin-bottom:16px;`)}>Hi, I'm Hannah</h2>
            <p style={css(body)}>{copy1}</p>
          </div>
          <p style={css(body)}>{copy2}</p>
          <p style={css(`${heading}font-size:clamp(26px,5.6vw,36px);line-height:1.2;text-align:center;background:var(--paper);border:2px solid var(--muted);border-radius:12px;padding:14px 20px;box-shadow:0 0 15px #fff;`)}>{quote}</p>
          <p style={css(`${body}text-align:center;`)}>{copy3}</p>
        </div>
      </section>
    );
  }

  const hidden = reduced ? '' : 'opacity:0;';
  // The wrapper overlaps the end of the hero (which is empty once its photos have faded) so the scene pins EARLY_VH early.
  // Blocks rise with the separate `translate` property so the centring `transform` on two of them is left alone.
  return (
    <section ref={wrap} data-scene="intro" style={css(`position:relative;height:${(1 + PIN_VH) * 100}dvh;margin-top:-${(1 + EARLY_VH) * 100}dvh;pointer-events:none;`)}>
      <div style={css(`position:sticky;top:0;height:100dvh;display:flex;align-items:center;`)}>
        <div style={css(`position:relative;overflow:hidden;width:100%;height:${CROP_H * s}px;`)}>
          <div style={css(`position:absolute;left:0;top:0;width:${STAGE_W}px;height:${CROP_H}px;transform:scale(${s});transform-origin:top left;`)}>
            <svg aria-hidden="true" width={STAGE_W} height={CROP_H} style={css(`position:absolute;left:0;top:0;overflow:visible;`)}>
              {PATHS.map((pts, i) => (
                <polyline key={i} ref={(el) => { lines.current[i] = el; }} points={pts.map(([x, y]) => `${x},${y - CROP_TOP}`).join(' ')}
                  fill="none" stroke={LINE} strokeWidth={1 / s} pathLength="1" style={{ strokeDasharray: '1 1', strokeDashoffset: reduced ? 0 : 1 }} />
              ))}
            </svg>

            <div ref={(el) => { blocks.current[0] = el; }} style={css(`${hidden}position:absolute;left:102px;top:${303 - CROP_TOP}px;width:507px;`)}>
              <h2 style={css(`${heading}line-height:33.2px;`)}>Hi, I'm Hannah</h2>
              <div aria-hidden="true" style={css(`height:1px;background:${LINE};margin:16px 0;`)} />
              <p style={css(body)}>{copy1}</p>
            </div>

            <p ref={(el) => { blocks.current[1] = el; }} style={css(`${body}${hidden}position:absolute;left:960px;top:${359 - CROP_TOP}px;width:627px;`)}>{copy2}</p>

            <p ref={(el) => { blocks.current[2] = el; }} style={css(`${heading}${hidden}position:absolute;left:50%;top:${591 - CROP_TOP}px;transform:translateX(-50%);white-space:nowrap;background:#FBF8F2;border:2px solid #6F6151;border-radius:12px;padding:10px 20px;line-height:normal;box-shadow:0 0 15px #fff;`)}>{quote}</p>

            <p ref={(el) => { blocks.current[3] = el; }} style={css(`${body}${hidden}position:absolute;left:50%;top:${746 - CROP_TOP}px;width:740px;transform:translateX(-50%);text-align:center;`)}>{copy3}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
