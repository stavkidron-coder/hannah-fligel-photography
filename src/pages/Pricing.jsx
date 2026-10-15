import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinaryFromLocal } from '../lib/cloudinary';
import { layoutFor } from '../lib/layout';
import Button from '../components/Button';

const tiers = [
  {
    title: 'Families', price: '$750',
    img: '/images/families/madison-tanya-hunter/Madison_Tanya_Hunter_2025-08_381.jpg', alt: 'Madison + Tanya – Family Session',
    lines: ['Includes newborns.', '1 to 1.5 hours, anywhere in San Diego County.'],
  },
  {
    title: 'Maternity', price: '$650',
    img: '/images/maternity/angelica-eric/AANDE-Maternity51.jpg', alt: 'Maternity session on the beach',
    lines: ['Maternity sessions.', '1 to 1.5 hours, anywhere in San Diego County.'],
    note: 'Booking maternity and newborn together? Ask about a bundled rate.',
  },
  {
    title: 'Couples & Individuals', price: '$650',
    img: '/images/portraits/nandini-srikanth/NandiniANDSrikanth102.jpg', alt: 'Couple portrait session',
    lines: ['Individuals, couples, engagements, proposals.', '1 to 1.5 hours, anywhere in San Diego County.'],
  },
];

export default function Pricing() {
  const { go, width } = useContext(AppContext);
  const { pricingGridCols, pricingGridGap, pricingNoteGap, pricingNoteGap2 } = layoutFor(width);
  const navContact = () => go('contact');
  const secondary = css(`color:var(--color-text-secondary);text-wrap:pretty;`);
  return (
    <main id="main" style={css(`max-width:1160px;margin:0 auto;padding:clamp(64px,9vw,108px) var(--layout-page-margin) clamp(80px,11vw,128px);`)}>
      <header style={css(`text-align:center;margin-bottom:clamp(54px,7vw,80px);`)}>
        <h1 className="t-h1">Pricing</h1>
        <p className="t-body" style={css(`margin:var(--space-16) auto 0;max-width:460px;color:var(--color-text-tertiary);`)}>A fully edited, curated gallery — every image worth keeping.</p>
      </header>

      <div style={css(`display:flex;flex-direction:column;gap:clamp(28px,3.5vw,36px);`)}>
        <div style={css(`display:grid;grid-template-columns:repeat(${pricingGridCols},1fr);gap:${pricingGridGap};padding:clamp(34px,4.5vw,46px) 0;border-top:1px solid var(--color-border-default);border-bottom:1px solid var(--color-border-default);`)}>
          {tiers.map((t) => (
            <div key={t.title} style={css(`text-align:left;`)}>
              <h3 className="t-h3" style={css(`margin:0 0 var(--space-12);`)}>{t.title}</h3>
              <div style={css(`border-radius:var(--radius-none);overflow:hidden;background:var(--color-bg-surface);aspect-ratio:4 / 5;margin:0 0 var(--space-24);`)}><img src={cloudinaryFromLocal(t.img, 900)} alt={t.alt} loading="lazy" style={css(`display:block;width:100%;height:100%;object-fit:cover;`)} /></div>
              <p className="t-h3" style={css(`color:var(--color-text-tertiary);`)}>{t.price}</p>
              {t.lines.map((l, i) => (
                <p key={l} className="t-body" style={css(`margin:${i === 0 ? 'var(--space-12)' : 'var(--space-4)'} 0 0;color:var(--color-text-secondary);`)}>{l}</p>
              ))}
              {t.note && <p className="t-small" style={css(`margin:var(--space-8) 0 0;color:var(--color-text-tertiary);`)}>{t.note}</p>}
            </div>
          ))}
        </div>
        <div style={css(`text-align:center;`)}>
          <p className="t-body" style={secondary}>All sessions include a fully edited, curated online gallery of every image worth keeping.</p>
          <p className="t-body" style={{ ...secondary, margin: `${pricingNoteGap} 0 0` }}>Sessions are relaxed and candid – a little direction, a lot of ease, shot in natural light.</p>
          <p className="t-body" style={{ ...secondary, margin: `${pricingNoteGap2} 0 0` }}>Travel inquiries outside of San Diego county are welcome, for an additional fee.</p>
        </div>
      </div>

      <p className="t-body" style={css(`text-align:center;margin:clamp(40px,5vw,56px) auto 0;max-width:460px;color:var(--color-text-tertiary);`)}>A $200 deposit holds your date and goes toward your session total. Reach out early — sessions book ahead.</p>

      <div style={css(`text-align:center;margin-top:clamp(44px,6vw,60px);`)}><Button variant="primary" onClick={navContact}>Book a session →</Button></div>

      <div style={css(`max-width:600px;margin:clamp(56px,7vw,76px) auto 0;text-align:center;`)}>
        <p className="t-quote-md">“Thank you for all your work. My family loves them. They're an excellent memory for the rest of our lives.”</p>
        <p className="t-label" style={css(`margin:var(--space-24) 0 0;color:var(--color-text-tertiary);`)}>— Angelica &amp; Eric, maternity session</p>
      </div>
    </main>
  );
}
