import { useContext, useState } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinaryUrl, cloudinarySrcSet } from '../lib/cloudinary';
import { sessionsByCategory } from '../data/sessions';
import Button from './Button';

// Figma "Categories": a "session types" heading with a link to all work, then one portrait photo per session type with its label as a dark bar above the photo.
// A photo opens Work filtered to that type.
// While a card is hovered (or focused) it switches to a second photo from that category, instantly; leaving it switches back to the cover.
const WIDTHS = [600, 900, 1200];
const categories = [
  { label: 'families', cat: 'families', src: cloudinaryUrl('galleries/families/baby-ollie/baby-ollie40', 900) },
  { label: 'couples & individuals', cat: 'couples', src: cloudinaryUrl('galleries/portraits/nandini-srikanth/NandiniANDSrikanth87', 900) },
  { label: 'maternity', cat: 'maternity', src: cloudinaryUrl('galleries/maternity/mana-chris/McClintock2026-94', 900) },
];
// The hand-picked photo is the cover; the alternate is the first session cover in that category from a different album.
const album = (url) => (url.match(/galleries\/[^/]+\/[^/]+/) || [url])[0];
categories.forEach((c) => {
  const alt = (sessionsByCategory[c.cat] || []).map((x) => x.cover).find((u) => u && album(u) !== album(c.src));
  c.photos = alt ? [c.src, alt] : [c.src];
});

export default function CategoryPhotos() {
  const { setCat, go, width } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const cols = width > 680 ? 3 : 1;
  // The card under the pointer (or focus) shows its alternate photo; every other card shows its cover.
  const [hovered, setHovered] = useState(null);

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
        {categories.map((c, k) => (
          <button key={c.cat} className="category-photo" onClick={() => open(c.cat)} aria-label={`View ${c.label} work`}
            onMouseEnter={() => setHovered(k)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(k)} onBlur={() => setHovered(null)}
            style={css(`display:flex;flex-direction:column;align-items:stretch;background:none;border:none;padding:0;cursor:pointer;text-align:left;`)}>
            <span className="t-mono category-photo__label">{c.label}</span>
            <span style={css(`position:relative;display:block;width:100%;aspect-ratio:532 / 700;overflow:hidden;`)}>
            {c.photos.map((src, n) => (
              <img key={src} src={src} srcSet={cloudinarySrcSet(src, WIDTHS)} sizes={width > 680 ? '33vw' : '100vw'} alt="" loading="lazy" draggable="false"
                style={{ ...css(`position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;border-radius:var(--radius-none);`), opacity: n === (hovered === k ? c.photos.length - 1 : 0) ? 1 : 0 }} />
            ))}
            <span aria-hidden="true" className="category-photo__dim"></span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
