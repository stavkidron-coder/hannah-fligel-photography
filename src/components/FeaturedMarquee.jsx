import { useLayoutEffect, useRef } from 'react';
import { teaserPhotos } from '../data/content';

// Figma "photo strip": rounded photos in a row, here looping slowly across the page.
// The photo set is rendered twice and the track slides left by exactly one set, so the loop is seamless.
const SPEED = 38; // px per second

export default function FeaturedMarquee() {
  const track = useRef(null);

  // Keep the pace constant whatever the width of the set (it changes as photos load and with the viewport).
  useLayoutEffect(() => {
    const el = track.current;
    const apply = () => { el.style.animationDuration = `${Math.max(1, el.scrollWidth / 2 / SPEED)}s`; };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const set = (copy) => teaserPhotos.map((src, i) => (
    <img key={`${copy}-${i}`} className="featured-photo" src={src} alt={copy ? '' : 'Featured client photography'} draggable="false" />
  ));

  return (
    <section aria-label="Featured client photography" className="featured-marquee">
      <div ref={track} className="featured-track">
        {set(0)}
        <div className="featured-dup" aria-hidden="true" style={{ display: 'contents' }}>{set(1)}</div>
      </div>
    </section>
  );
}
