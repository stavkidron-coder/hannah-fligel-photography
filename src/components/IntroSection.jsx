import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';

// Figma "Intro Section": copy blocks joined by thin elbow connectors round a boxed pull-quote.
// The desktop layout is the Figma frame (1750 wide) scaled to fit the viewport; below DESKTOP_MIN the blocks simply stack.
const STAGE_W = 1750;
const CROP_TOP = 230, CROP_H = 650; // the frame has a lot of empty space above and below the content
const DESKTOP_MIN = 1100;
const LINE = '#BBA17C';

const body = `font-size:20px;line-height:33.2px;color:var(--soft);margin:0;`;
const heading = `font-weight:400;font-size:48px;line-height:1.1;color:var(--ink);margin:0;`;

// A 1px connector segment, positioned in Figma coordinates.
const seg = (x, y, w, h) => (
  <div aria-hidden="true" style={css(`position:absolute;left:${x}px;top:${y - CROP_TOP}px;width:${w || 1}px;height:${h || 1}px;background:${LINE};`)} />
);

const copy1 = `I’m a San Diego photographer with 10+ years of experience, working with couples, individuals, engaged and newly-engaged couples, expecting parents, families, and newborns. I shoot in a style that's natural, candid, and editorial – warm and real.`;
const copy2 = (<>I photograph throughout San Diego County (travel inquiries outside San Diego County are always welcome), wherever the light is good and the moment is honest (backyards, living rooms, the coast, golden late-afternoon light). The goal is always the same: images that feel like <strong style={{ fontStyle: 'italic', fontWeight: 700 }}>you</strong>, not like a photoshoot.</>);
const copy3 = (<>It's what I look for in every session. Not the moments you'd plan for, but the ones that happen when you forget I'm there. After 10+ years doing this, <em>I know exactly how to find them</em>.</>);
const quote = 'The real story, not the posed one';

export default function IntroSection() {
  const { width } = useContext(AppContext);

  if (width <= DESKTOP_MIN) {
    return (
      <section style={css(`min-height:100dvh;display:flex;align-items:center;scroll-snap-align:start;`)}>
      <div style={css(`max-width:620px;margin:0 auto;padding:clamp(56px,11vw,96px) 32px;display:flex;flex-direction:column;gap:28px;`)}>
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

  const s = Math.min(1, width / STAGE_W);
  return (
    <section style={css(`min-height:100dvh;display:flex;align-items:center;scroll-snap-align:start;`)}>
    <div style={css(`position:relative;overflow:hidden;width:100%;height:${CROP_H * s}px;`)}>
      <div style={css(`position:absolute;left:0;top:0;width:${STAGE_W}px;height:${CROP_H}px;transform:scale(${s});transform-origin:top left;`)}>
        <div style={css(`position:absolute;left:102px;top:${303 - CROP_TOP}px;width:507px;`)}>
          <h2 style={css(`${heading}line-height:33.2px;`)}>Hi, I'm Hannah</h2>
          <div aria-hidden="true" style={css(`height:1px;background:${LINE};margin:16px 0;`)} />
          <p style={css(body)}>{copy1}</p>
        </div>

        {seg(549, 487, 325)}{seg(874, 373, 1, 114)}{seg(874, 374, 68)}
        <p style={css(`${body}position:absolute;left:960px;top:${359 - CROP_TOP}px;width:627px;`)}>{copy2}</p>

        {seg(1194, 635, 295)}{seg(1489, 480, 1, 156)}{seg(1404, 480, 86)}

        <p style={css(`${heading}position:absolute;left:50%;top:${591 - CROP_TOP}px;transform:translateX(-50%);white-space:nowrap;background:#FBF8F2;border:2px solid #6F6151;border-radius:12px;padding:10px 20px;line-height:normal;box-shadow:0 0 15px #fff;`)}>{quote}</p>

        {seg(347, 635, 208)}{seg(347, 635, 1, 129)}{seg(347, 764, 157)}
        <p style={css(`${body}position:absolute;left:50%;top:${746 - CROP_TOP}px;width:740px;transform:translateX(-50%);text-align:center;`)}>{copy3}</p>
      </div>
    </div>
    </section>
  );
}
