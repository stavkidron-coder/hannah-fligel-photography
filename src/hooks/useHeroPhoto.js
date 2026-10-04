import { useEffect, useRef, useState } from 'react';
import { TOTAL } from '../lib/heroTiming';

// Desktop hero photo transition. Photos overlap, but dip through the dark
// backdrop on the way:
//   dip   (first half)  the old photo fades 100% -> 20% while the new one
//                       fades in 0% -> 20%, so both sit faintly over the dark
//   rise  (second half) the old photo fades 20% -> 0% while the new one
//                       fades 20% -> 100%
// A change mid-transition starts a fresh dip from wherever things are.
export const HALF = TOTAL / 2;
export const DIP = 0.2;

export function useHeroPhoto(active) {
  const [state, setState] = useState({ from: -1, to: active, phase: 'idle' });
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState({ from: -1, to: active, phase: 'idle' });
      return undefined;
    }
    setState((s) => ({ from: s.to, to: active, phase: 'dip' }));
    const t = setTimeout(() => setState((s) => ({ ...s, phase: 'rise' })), HALF);
    return () => clearTimeout(t);
  }, [active]);

  // Target opacity for each slide's layer.
  const opacityOf = (i) => {
    const { from, to, phase } = state;
    if (i === to) return phase === 'dip' ? DIP : 1;
    if (i === from) return phase === 'dip' ? DIP : 0;
    return 0;
  };

  return { phase: state.phase, opacityOf };
}
