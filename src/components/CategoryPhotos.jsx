import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinaryUrl, cloudinarySrcSet } from '../lib/cloudinary';

// Figma "Categories": one portrait photo per session type, each with a small mono label above it. A photo opens Work filtered to that type.
const WIDTHS = [600, 900, 1200];
const categories = [
  { label: 'families', cat: 'families', src: cloudinaryUrl('galleries/families/baby-ollie/baby-ollie40', 900) },
  { label: 'couples & individuals', cat: 'couples', src: cloudinaryUrl('galleries/portraits/nandini-srikanth/NandiniANDSrikanth87', 900) },
  { label: 'maternity', cat: 'maternity', src: cloudinaryUrl('galleries/maternity/mana-chris/McClintock2026-94', 900) },
];

export default function CategoryPhotos() {
  const { setCat, width } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const cols = width > 680 ? 3 : 1;

  return (
    <section aria-label="Session types" className="category-photos" style={css(`padding:var(--space-40) var(--layout-media-margin);display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:var(--space-12);`)}>
      {categories.map((c) => (
        <button key={c.cat} className="category-photo" onClick={() => open(c.cat)} aria-label={`View ${c.label} work`}
          style={css(`display:flex;flex-direction:column;align-items:flex-start;gap:var(--space-8);background:none;border:none;padding:0;cursor:pointer;text-align:left;`)}>
          <span className="t-mono category-photo__label" style={css(`transition:color .4s ease;`)}>{c.label}</span>
          <img src={c.src} srcSet={cloudinarySrcSet(c.src, WIDTHS)} sizes={width > 680 ? '33vw' : '100vw'} alt="" loading="lazy" draggable="false"
            style={css(`display:block;width:100%;aspect-ratio:532 / 700;object-fit:cover;border-radius:var(--radius-none);`)} />
        </button>
      ))}
    </section>
  );
}
