import { useEffect, useRef, useState } from 'react';
import { TOTAL } from '../lib/heroTiming';

// Which hero photo is showing on desktop. On a slide change the old photo is
// hidden straight away (it fades out over the first half of the morph) and
// the new one is shown at the halfway point (fading in over the second half),
// so the photos run back to back: never overlapping, never a held gap.
export const HALF = TOTAL / 2;

export function useHeroPhoto(active) {
  const [visible, setVisible] = useState(active);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVisible(active); return undefined; }
    setVisible(-1);
    const t = setTimeout(() => setVisible(active), HALF);
    return () => clearTimeout(t);
  }, [active]);

  return visible;
}
