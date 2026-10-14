import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinarySrcSet } from '../lib/cloudinary';
import { heroPhotos } from '../data/heroPhotos';

// Phone hero (Figma "Mobile – Hero (390)"): a native swipe strip of 4:5 photos that snap to the left margin, with the next photo
// peeking from the right. Nothing moves on its own and vertical scrolling is never captured, so the intro below always reads as "keep going".
// A photo opens Work filtered to its session type; the label above it names that type.
const WIDTHS = [640, 960, 1280];
const GAP = 8;
const CARD_W = 'min(318px, calc(100vw - 72px))'; // 16px margin + 8px gap + a 48px peek of the next photo

export default function HeroCarousel() {
  const { setCat } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const strip = useRef(null);
  const [active, setActive] = useState(0);

  // The active segment follows whichever photo is nearest the left margin.
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const first = el.firstElementChild, second = first && first.nextElementSibling;
      const step = first && second ? second.offsetLeft - first.offsetLeft : 0;
      if (!step) return;
      setActive(Math.min(heroPhotos.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section aria-roledescription="carousel" aria-label="Featured photography" style={css(`padding-top:var(--space-16);`)}>
      <div ref={strip} className="hero-carousel-strip" style={css(`display:flex;gap:${GAP}px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-padding-left:var(--layout-page-margin);padding:0 calc(100% - ${CARD_W} - var(--layout-page-margin)) 0 var(--layout-page-margin);-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;`)}>
        {heroPhotos.map((s, i) => (
          <button key={s.label} onClick={() => open(s.cat)} aria-label={`View ${s.label} work`} aria-roledescription="slide"
            style={css(`flex:none;width:${CARD_W};scroll-snap-align:start;display:flex;flex-direction:column;align-items:stretch;gap:var(--space-4);background:none;border:none;padding:0;cursor:pointer;text-align:right;`)}>
            <span className="t-mono-sm" aria-hidden="true" style={css(`display:block;padding-right:var(--space-12);line-height:15px;color:var(--color-text-tertiary);`)}>{s.label}</span>
            <span style={css(`position:relative;display:block;width:100%;aspect-ratio:4 / 5;overflow:hidden;background:var(--color-border-default);`)}>
              <img src={s.src} srcSet={cloudinarySrcSet(s.src, WIDTHS)} sizes={`${CARD_W}`} alt="" draggable="false"
                loading={i < 2 ? 'eager' : 'lazy'} fetchpriority={i === 0 ? 'high' : undefined}
                style={css(`position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;object-position:50% 35%;`)} />
            </span>
          </button>
        ))}
      </div>
      <div aria-hidden="true" style={css(`display:flex;gap:6px;padding:var(--space-16) var(--layout-page-margin) 0;`)}>
        {heroPhotos.map((s, i) => (
          <span key={s.label} style={css(`width:24px;height:2px;background:${i === active ? 'var(--color-text-primary)' : 'var(--color-border-default)'};transition:background-color .25s ease;`)}></span>
        ))}
      </div>
      <p aria-live="polite" style={css(`position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;margin:0;`)}>{`Photo ${active + 1} of ${heroPhotos.length}`}</p>
    </section>
  );
}
