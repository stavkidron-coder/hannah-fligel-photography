import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinaryUrl, cloudinarySrcSet } from '../lib/cloudinary';
import Button from './Button';

// Figma "Categories": a "session types" heading with a link to all work, then one portrait photo per session type with its label tagged on the photo's top-left corner.
// A photo opens Work filtered to that type.
const WIDTHS = [600, 900, 1200];
const categories = [
  { label: 'families', cat: 'families', src: cloudinaryUrl('galleries/families/baby-ollie/baby-ollie40', 900) },
  { label: 'couples & individuals', cat: 'couples', src: cloudinaryUrl('galleries/portraits/nandini-srikanth/NandiniANDSrikanth87', 900) },
  { label: 'maternity', cat: 'maternity', src: cloudinaryUrl('galleries/maternity/mana-chris/McClintock2026-94', 900) },
];

export default function CategoryPhotos() {
  const { setCat, go, width } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const cols = width > 680 ? 3 : 1;

  return (
    <section aria-labelledby="session-types-heading" style={css(`padding:var(--space-40) var(--layout-media-margin);display:flex;flex-direction:column;gap:var(--space-12);`)}>
      <div style={css(`display:flex;align-items:center;justify-content:space-between;gap:var(--space-16);`)}>
        <div style={css(`display:flex;align-items:center;gap:var(--space-8);`)}>
          <span aria-hidden="true" style={css(`width:6px;height:6px;border-radius:50%;background:var(--color-text-primary);flex:none;`)}></span>
          <h2 id="session-types-heading" className="t-body" style={css(`font-weight:400;`)}>session types</h2>
        </div>
        <Button variant="text" onClick={() => go('work')}>View all galleries →</Button>
      </div>
      <div className="category-photos" style={css(`display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:var(--layout-media-margin);`)}>
        {categories.map((c) => (
          <button key={c.cat} className="category-photo" onClick={() => open(c.cat)} aria-label={`View ${c.label} work`}
            style={css(`position:relative;display:block;background:none;border:none;padding:0;cursor:pointer;text-align:left;`)}>
            <img src={c.src} srcSet={cloudinarySrcSet(c.src, WIDTHS)} sizes={width > 680 ? '33vw' : '100vw'} alt="" loading="lazy" draggable="false"
              style={css(`display:block;width:100%;aspect-ratio:532 / 700;object-fit:cover;border-radius:var(--radius-none);`)} />
            <span aria-hidden="true" className="category-photo__dim"></span>
            <span className="t-mono category-photo__label">{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
