import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { NAV_EDITORIAL_H } from './NavEditorial';

// Figma "Hero Images": a horizontal row of category photos with small labels above each.
const LABEL_H = 18; // 15px label + 3px gap
const slides = [
  { label: 'portraits', src: '/images/portraits/emma-senior-photos/emma-senior-photos147.jpg', ratio: '1067 / 1600' },
  { label: 'families', src: '/images/families/madison-tanya-hunter/Madison_Tanya_Hunter_2025-08_381.jpg', ratio: '1067 / 1600' },
  { label: 'couples', src: '/images/hero/HeidiANDAndre161.jpg', ratio: '1600 / 1067' },
  { label: 'maternity', src: '/images/maternity/angelica-eric/AANDE-Maternity176.jpg', ratio: '1067 / 1600' },
  { label: 'engagements', src: '/images/portraits/nandini-srikanth/NandiniANDSrikanth259.jpg', ratio: '1067 / 1600' },
];

export default function HeroEditorial() {
  const { go } = useContext(AppContext);
  const imgH = `calc(100dvh - ${NAV_EDITORIAL_H} - ${LABEL_H}px)`;
  return (
    <section id="hero-editorial" aria-label="Featured photography" style={css(`position:relative;height:calc(100dvh - ${NAV_EDITORIAL_H});min-height:480px;overflow:hidden;`)}>
      <div className="hero-editorial-row" style={css(`display:flex;gap:20px;height:100%;overflow-x:auto;overflow-y:hidden;`)}>
        {slides.map((s) => (
          <button key={s.label} onClick={() => go('work')} aria-label={`View ${s.label} work`} style={css(`flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:3px;background:none;border:none;padding:0;cursor:pointer;`)}>
            <span style={css(`padding-right:12px;font-family:'Mulish',sans-serif;font-size:12px;line-height:15px;letter-spacing:.44px;color:#000;`)}>{s.label}</span>
            <img src={s.src} alt="" draggable="false" style={{ display: 'block', height: `max(${imgH}, 440px)`, aspectRatio: s.ratio, objectFit: 'cover' }} />
          </button>
        ))}
      </div>
    </section>
  );
}
