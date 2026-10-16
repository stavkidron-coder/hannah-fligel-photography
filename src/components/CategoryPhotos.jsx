import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinaryUrl, cloudinarySrcSet } from '../lib/cloudinary';
import Button from './Button';

// Figma "Categories": a "session types" heading with a link to all work, then one portrait photo per session type with its label underneath.
// The name and its session types sit under each photo. A photo opens Work filtered to that type.
const WIDTHS = [600, 900, 1200];
const categories = [
  { label: 'families', cat: 'families', types: ['newborns', 'families'], src: cloudinaryUrl('galleries/families/bleil-family/SarahANDReid-Family2023-93', 900) },
  { label: 'couples & individuals', cat: 'couples', types: ['portraits', 'couples', 'engagements', 'proposals', 'senior photos'], src: cloudinaryUrl('galleries/portraits/ashly-felipe/AshlyANDFelipe-engagement100-Compressed', 900) },
  { label: 'maternity', cat: 'maternity', types: ['expecting parents'], src: cloudinaryUrl('galleries/maternity/mana-chris/McClintock2026-176', 900) },
];

export default function CategoryPhotos() {
  const { setCat, go, width } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const phone = width <= 680;

  return (
    <section aria-labelledby="session-types-heading" style={css(`padding:var(--space-40) var(--layout-media-margin);display:flex;flex-direction:column;gap:0;`)}>
      <div style={css(`display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0 var(--space-16);`)}>
        <div style={css(`display:flex;align-items:center;gap:var(--space-8);flex:none;white-space:nowrap;`)}>
          <span aria-hidden="true" style={css(`width:6px;height:6px;border-radius:50%;background:var(--color-text-primary);flex:none;`)}></span>
          <h2 id="session-types-heading" className="t-eyebrow" style={css(`line-height:1;`)}>session types</h2>
        </div>
        <Button variant="text" className="category-photos__all" onClick={() => go('work')}>View all galleries →</Button>
      </div>
      {/* Phones: a swipe strip of cards. Wider screens: three columns. Each card shows its photo with the name and session types underneath;
          on a hovering pointer the other photos dim while one is hovered or focused (index.css). */}
      <div className={`category-photos${phone ? ' category-photos--strip' : ''}`} style={phone ? undefined : css(`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:start;gap:var(--layout-media-margin);`)}>
        {categories.map((c) => (
          <button key={c.cat} className="category-photo" onClick={() => open(c.cat)} aria-label={`View ${c.label} work`}
            style={css(`position:relative;display:block;background:none;border:none;padding:0;cursor:pointer;text-align:left;`)}>
            <span style={css(`position:relative;display:block;width:100%;aspect-ratio:${phone ? '320 / 340' : '532 / 630'};overflow:hidden;`)}>
            <img src={c.src} srcSet={cloudinarySrcSet(c.src, WIDTHS)} sizes={phone ? '82vw' : '33vw'} alt="" loading="lazy" draggable="false"
              style={css(`position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;border-radius:var(--radius-none);`)} />
            <span aria-hidden="true" className="category-photo__dim"></span>
            </span>
            <span aria-hidden="true" style={css(`display:flex;flex-direction:column;gap:var(--space-4);margin-top:var(--space-8);`)}>
              <span className="t-label">{c.label}</span>
              <span className="t-label" style={css(`display:flex;flex-wrap:wrap;gap:var(--space-4);color:var(--color-text-tertiary);`)}>
                {c.types.map((t, i) => <span key={t}>{i > 0 && <span style={css(`margin-right:var(--space-4);`)}>•</span>}{t}</span>)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
