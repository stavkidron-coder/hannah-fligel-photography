import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { NAV_EDITORIAL_H } from './NavEditorial';

// Each photo opens Work pre-filtered; the Work page only has Families / Maternity / Couples tabs, so portraits and engagements land on Couples.
// Figma "Hero Images": a horizontal row of category photos with small labels above each.
const LABEL_H = 18; // 15px label + 3px gap
const slides = [
  { label: 'portraits', cat: 'couples', src: '/images/portraits/emma-senior-photos/emma-senior-photos147.jpg', ratio: '1067 / 1600' },
  { label: 'families', cat: 'families', src: '/images/families/madison-tanya-hunter/Madison_Tanya_Hunter_2025-08_381.jpg', ratio: '1067 / 1600' },
  { label: 'couples', cat: 'couples', src: '/images/hero/HeidiANDAndre161.jpg', ratio: '1600 / 1067' },
  { label: 'maternity', cat: 'maternity', src: '/images/maternity/angelica-eric/AANDE-Maternity176.jpg', ratio: '1067 / 1600' },
  { label: 'engagements', cat: 'couples', src: '/images/portraits/nandini-srikanth/NandiniANDSrikanth259.jpg', ratio: '1067 / 1600' },
];

export default function HeroEditorial() {
  const { setCat } = useContext(AppContext);
  const open = (cat) => { setCat(cat); try { window.scrollTo(0, 0); } catch (e) {} };
  const imgH = `calc(100dvh - ${NAV_EDITORIAL_H} - ${LABEL_H}px)`;
  return (
    <section id="hero-editorial" aria-label="Featured photography" style={css(`position:relative;height:calc(100dvh - ${NAV_EDITORIAL_H});min-height:480px;overflow:hidden;`)}>
      <div className="hero-editorial-row" style={css(`display:flex;gap:20px;height:100%;overflow-x:auto;overflow-y:hidden;`)}>
        {slides.map((s) => (
          <button key={s.label} className="hero-ed-item" onClick={() => open(s.cat)} aria-label={`View ${s.label} work`} style={css(`flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:3px;background:none;border:none;padding:0;cursor:pointer;`)}>
            <span className="hero-ed-label" aria-hidden="true" style={css(`padding-right:12px;font-family:'Mulish',sans-serif;font-size:12px;line-height:15px;color:#000;`)}>{[...s.label].map((ch, i, a) => (<span key={i} className="hero-ed-char" style={{ '--n': a.length - 1 - i, '--i': i }}>{ch}</span>))}</span>
            <span style={{ position: 'relative', display: 'block', height: `max(${imgH}, 440px)`, aspectRatio: s.ratio }}>
              <img src={s.src} alt="" draggable="false" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
              <span aria-hidden="true" className="hero-ed-dim"></span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
