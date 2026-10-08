import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinaryUrl } from '../lib/cloudinary';

// Figma "Intro Section": copy blocks joined by thin elbow connectors round a photo-filled pull-quote.
// The desktop layout is the Figma frame (1750 wide) scaled to fit the viewport. Everything fades in together, and the connectors draw, the first time it scrolls into view.
// Below DESKTOP_MIN the blocks stack and each simply rises in as it scrolls into view.
const STAGE_W = 1750;
const CROP_TOP = 280, CROP_H = 860; // the frame has a lot of empty space above and below the content
const DESKTOP_MIN = 1100;
const BOTTOM_GAP = 64;  // px kept clear below the last line, so it never touches the photo strip that follows
const LINE = '#BBA17C';

const RISE = 40;        // px (in Figma units) a block travels up as it fades in
const FADE_MS = 1100, DRAW_MS = 1600;

// Connectors in Figma coordinates, each running from the text it leaves to the text it reaches.
// Horizontal ends sit on the vertical middle of the text's first/last line (33.2px line boxes).
const PATHS = [
  [[549, 485.3], [874, 485.3], [874, 375.5], [942, 375.5]],
  [[1404, 475.1], [1489, 475.1], [1489, 660], [1342, 660]],
  [[310, 820], [102, 820], [102, 974.5], [504, 974.5]],
  [[875, 1035], [875, 1140]],
];
const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const body = `font-size:20px;line-height:33.2px;color:var(--soft);margin:0;`;
const heading = `font-weight:400;font-size:48px;line-height:1.1;color:var(--ink);margin:0;`;

const copy1 = `I’m a San Diego photographer with 10+ years of experience, working with couples, individuals, engaged and newly-engaged couples, expecting parents, families, and newborns. I shoot in a style that's natural, candid, and editorial – warm and real.`;
const copy2 = (<>I photograph throughout San Diego County (travel inquiries outside San Diego County are always welcome), wherever the light is good and the moment is honest (backyards, living rooms, the coast, golden late-afternoon light). The goal is always the same: images that feel like <strong style={{ fontStyle: 'italic', fontWeight: 700 }}>you</strong>, not like a photoshoot.</>);
const copy3 = (<>It's what I look for in every session. Not the moments you'd plan for, but the ones that happen when you forget I'm there. After 10+ years doing this, <em>I know exactly how to find them</em>.</>);
const quoteLines = ['The real story,', 'not the posed one'];
// The quote is knocked out of a photo: text filled with the image, with a soft glow (drop-shadow, since text-shadow would show through the clear fill).
const QUOTE_PHOTO = cloudinaryUrl('galleries/portraits/dana-josh/DanaANDJosh163', 1400);
const quoteStyle = `font-family:'Mulish',sans-serif;font-weight:800;margin:0;text-align:center;color:transparent;-webkit-text-fill-color:transparent;background-image:url("${QUOTE_PHOTO}");background-size:cover;background-position:center;-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 20px rgba(187,161,124,0.25));`;
const quoteEl = quoteLines.map((l, i) => <span key={i} style={{ display: 'block' }}>{l}</span>);

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
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 900);
  useLayoutEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // Once scrolled, the nav's cream fade (NavEditorial) covers this much of the top of the screen; the scene sits below it
  // and shrinks to fit the remaining height, so the first heading is never under the fade and the last line stops short of the photo strip.
  const fadeH = (2 * Math.max(12, 0.0097 * width) + 36) * 1.9;
  const s = Math.min(1, width / STAGE_W, (vh - fadeH - BOTTOM_GAP) / CROP_H);

  const wrap = useRef(null), stack = useRef(null);
  const [shown, setShown] = useState(reduced);
  useRiseOnView(stack, !desktop);

  // Everything fades in at once, the first time a good part of the scene is on screen.
  useLayoutEffect(() => {
    if (!desktop || shown || !('IntersectionObserver' in window)) { if (desktop && !('IntersectionObserver' in window)) setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, [desktop, shown]);

  if (!desktop) {
    return (
      <section style={css(`min-height:100dvh;display:flex;align-items:center;`)}>
        <div ref={stack} style={css(`max-width:620px;margin:0 auto;padding:clamp(56px,11vw,96px) 32px;display:flex;flex-direction:column;gap:28px;`)}>
          <div>
            <h2 style={css(`${heading}font-size:clamp(34px,7vw,48px);padding-bottom:12px;border-bottom:1px solid ${LINE};margin-bottom:16px;`)}>Hi, I'm Hannah</h2>
            <p style={css(body)}>{copy1}</p>
          </div>
          <p style={css(body)}>{copy2}</p>
          <p style={css(`${quoteStyle}font-size:min(7.6vw,48px);white-space:nowrap;line-height:1.1;padding:8px 0;`)}>{quoteEl}</p>
          <p style={css(`${body}text-align:center;`)}>{copy3}</p>
        </div>
      </section>
    );
  }

  // Blocks rise with the separate `translate` property so the centring `transform` on two of them is left alone.
  const fade = `opacity:${shown ? 1 : 0};translate:0 ${shown ? 0 : RISE}px;transition:opacity ${FADE_MS}ms ease-out,translate ${FADE_MS}ms ease-out;`;
  return (
    <section ref={wrap} style={css(`position:relative;min-height:100dvh;box-sizing:border-box;padding:${fadeH}px 0 ${BOTTOM_GAP}px;display:flex;align-items:center;justify-content:center;`)}>
      <div style={css(`position:relative;overflow:hidden;flex:none;width:${STAGE_W * s}px;height:${CROP_H * s}px;`)}>
        <div style={css(`position:absolute;left:0;top:0;width:${STAGE_W}px;height:${CROP_H}px;transform:scale(${s});transform-origin:top left;`)}>
          <svg aria-hidden="true" width={STAGE_W} height={CROP_H} style={css(`position:absolute;left:0;top:0;overflow:visible;`)}>
            {PATHS.map((pts, i) => (
              <polyline key={i} points={pts.map(([x, y]) => `${x},${y - CROP_TOP}`).join(' ')}
                fill="none" stroke={LINE} strokeWidth={1 / s} pathLength="1" style={{ strokeDasharray: '1 1', strokeDashoffset: shown ? 0 : 1, transition: `stroke-dashoffset ${DRAW_MS}ms ease-in-out` }} />
            ))}
          </svg>

          <div style={css(`${fade}position:absolute;left:102px;top:${303 - CROP_TOP}px;width:507px;`)}>
            <h2 style={css(`${heading}line-height:33.2px;`)}>Hi, I'm Hannah</h2>
            <div aria-hidden="true" style={css(`height:1px;background:${LINE};margin:16px 0;`)} />
            <p style={css(body)}>{copy1}</p>
          </div>

          <p style={css(`${body}${fade}position:absolute;left:960px;top:${359 - CROP_TOP}px;width:627px;`)}>{copy2}</p>

          <p style={css(`${quoteStyle}${fade}position:absolute;left:50%;top:${564 - CROP_TOP}px;transform:translateX(-50%);white-space:nowrap;font-size:128px;line-height:normal;`)}>{quoteEl}</p>

          <p style={css(`${body}${fade}position:absolute;left:50%;top:${958 - CROP_TOP}px;width:740px;transform:translateX(-50%);text-align:center;`)}>{copy3}</p>
        </div>
      </div>
    </section>
  );
}
