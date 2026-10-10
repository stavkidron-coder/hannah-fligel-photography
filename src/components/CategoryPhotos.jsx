import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinaryUrl, cloudinarySrcSet } from '../lib/cloudinary';
import Button from './Button';

// Figma "Categories": a "session types" heading with a link to all work, then one portrait photo per session type with its label as a dark tag on the photo's top-left corner.
// On hover the tag expands to list the specific kinds of session in that category. A photo opens Work filtered to that type.
const WIDTHS = [600, 900, 1200];
const categories = [
  { label: 'families', cat: 'families', types: ['newborns', 'families'], src: cloudinaryUrl('galleries/families/bleil-family/SarahANDReid-Family2023-93', 900) },
  { label: 'couples & individuals', cat: 'couples', types: ['portraits', 'couples', 'engagements', 'proposals', 'senior photos'], src: cloudinaryUrl('galleries/portraits/ashly-felipe/AshlyANDFelipe-engagement100-Compressed', 900) },
  { label: 'maternity', cat: 'maternity', types: ['expecting parents'], src: cloudinaryUrl('galleries/maternity/mana-chris/McClintock2026-176', 900) },
];

export default function CategoryPhotos() {
  const { setCat, go, width } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const cols = width > 680 ? 3 : 1;
  // The card under the pointer (or focus) shows its alternate photo; every other card shows its cover.
  // The tag hugs its label at rest and widens on hover only if a bullet is wider than the label. Both widths are measured here
  // and exposed as --w0 (resting) and --w1 (open) so the width can be transitioned.
  const grid = useRef(null);
  useEffect(() => {
    const measure = () => {
      if (!grid.current) return;
      grid.current.querySelectorAll('.category-photo__label').forEach((el) => {
        const name = el.querySelector('.category-photo__name');
        const items = [...el.querySelectorAll('.category-photo__type')];
        const pad = el.offsetWidth - el.clientWidth + parseFloat(getComputedStyle(el).paddingLeft) * 2;
        const w0 = name.offsetWidth + pad;
        const w1 = Math.max(w0, ...items.map((i) => i.offsetWidth + pad));
        el.style.setProperty('--w0', `${w0}px`);
        el.style.setProperty('--w1', `${w1}px`);
      });
    };
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section aria-labelledby="session-types-heading" style={css(`padding:var(--space-40) var(--layout-media-margin);display:flex;flex-direction:column;gap:var(--space-12);`)}>
      <div style={css(`display:flex;align-items:center;justify-content:space-between;gap:var(--space-16);`)}>
        <div style={css(`display:flex;align-items:center;gap:var(--space-8);`)}>
          <span aria-hidden="true" style={css(`width:6px;height:6px;border-radius:50%;background:var(--color-text-primary);flex:none;`)}></span>
          <h2 id="session-types-heading" className="t-body" style={css(`font-weight:400;`)}>session types</h2>
        </div>
        <Button variant="text" onClick={() => go('work')}>View all galleries →</Button>
      </div>
      <div ref={grid} className="category-photos" style={css(`display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:var(--layout-media-margin);`)}>
        {categories.map((c) => (
          <button key={c.cat} className="category-photo" onClick={() => open(c.cat)} aria-label={`View ${c.label} work`}
            style={css(`position:relative;display:block;background:none;border:none;padding:0;cursor:pointer;text-align:left;`)}>
            <span style={css(`position:relative;display:block;width:100%;aspect-ratio:532 / 700;overflow:hidden;`)}>
            <img src={c.src} srcSet={cloudinarySrcSet(c.src, WIDTHS)} sizes={width > 680 ? '33vw' : '100vw'} alt="" loading="lazy" draggable="false"
              style={css(`position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;border-radius:var(--radius-none);`)} />
            <span aria-hidden="true" className="category-photo__dim"></span>
            </span>
            <span className="category-photo__label" aria-hidden="true">
              <span className="t-mono category-photo__name">{c.label}</span>
              {c.types && (
                <span className="category-photo__types" style={{ '--n': c.types.length }}>
                  {c.types.map((t) => <span key={t} className="t-mono-sm category-photo__type">{t}</span>)}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
