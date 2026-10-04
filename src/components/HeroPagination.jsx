import { useEffect, useRef, useState } from 'react';

// Desktop hero pagination. Changing slide runs a staged morph rather than a
// plain swap, in this order:
//   1. the old pill narrows to the width of a dot (height unchanged)
//   2. short pause
//   3. the old pill drops to dot height while the new dot grows to pill height
//   4. short pause
//   5. the new pill widens to full size
// The fill stays solid until the height step has finished, so the bar-to-dot
// change reads as a shape change rather than a fade. The whole sequence
// (NARROW + HEIGHT + WIDEN + 2 × PAUSE = 2.6s) runs slightly longer than the
// 2.4s photo crossfade. Clicked dots go through the same sequence, and a new
// change mid-sequence retargets from wherever each item currently is.
const DOT = 12, PILL_W = 36, PILL_H = 18;
const NARROW = 600, HEIGHT = 900, WIDEN = 700, PAUSE = 200, FILL = 800;
const EASE = 'cubic-bezier(.45,0,.25,1)';

const restingSize = (isActive) => (isActive ? { w: PILL_W, h: PILL_H, f: true } : { w: DOT, h: DOT, f: false });

export default function HeroPagination({ count, active, onSelect, ctrl }) {
  const [sizes, setSizes] = useState(() => Array.from({ length: count }, (_, i) => restingSize(i === active)));
  const timers = useRef([]);
  const first = useRef(true);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const k = reduced ? 0 : 1;

  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    timers.current.forEach(clearTimeout);
    timers.current = [];
    // 1. everything that is wider than a dot narrows
    setSizes((s) => s.map((it) => (it.w > DOT ? { ...it, w: DOT } : it)));
    // 3. old pill loses height, new dot gains height (and fills in)
    timers.current.push(setTimeout(() => {
      setSizes((s) => s.map((it, i) => (i === active ? { ...it, h: PILL_H, f: true } : it.h > DOT ? { ...it, h: DOT } : it)));
      // the old pill goes hollow only once it has become a dot again
      timers.current.push(setTimeout(() => {
        setSizes((s) => s.map((it, i) => (i !== active && it.h === DOT ? { ...it, f: false } : it)));
      }, HEIGHT * k));
      // 5. new pill widens
      timers.current.push(setTimeout(() => {
        setSizes((s) => s.map((it, i) => (i === active ? { ...it, w: PILL_W } : it)));
      }, (HEIGHT + PAUSE) * k));
    }, (NARROW + PAUSE) * k));
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const tw = `${NARROW * k}ms ${EASE}`, th = `${HEIGHT * k}ms ${EASE}`, tg = `${WIDEN * k}ms ${EASE}`;
  return (
    <>
      {sizes.map((it, i) => {
        const filled = it.f;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            aria-label={`Show slide ${i + 1} of ${count}`}
            aria-current={i === active ? 'true' : 'false'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: 44,
              padding: '0 0 0 16px', marginTop: i === 0 ? 0 : -16, background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'block', boxSizing: 'border-box', width: it.w, height: it.h,
                borderRadius: it.w > DOT ? 4 : DOT / 2,
                border: '1px solid ' + ctrl.fg,
                background: filled ? ctrl.fg : 'transparent',
                boxShadow: filled ? ctrl.pillGlow : ctrl.ringGlow,
                transition: `width ${it.w > DOT && i === active ? tg : tw}, height ${th}, border-radius ${tw}, background-color ${FILL * k}ms ease, border-color 1.2s ease, box-shadow ${th}`,
              }}
            />
          </button>
        );
      })}
    </>
  );
}
