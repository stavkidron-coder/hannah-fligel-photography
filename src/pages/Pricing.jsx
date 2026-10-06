import { Fragment, useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinaryFromLocal } from '../lib/cloudinary';
import { layoutFor } from '../lib/layout';

export default function Pricing() {
  const { go, width } = useContext(AppContext);
  const { pricingGridCols, pricingGridGap, pricingNoteGap, pricingNoteGap2 } = layoutFor(width);
  const navContact = () => go('contact');
  return (
    <main id="main" style={css(`max-width:1160px;margin:0 auto;padding:clamp(64px,9vw,108px) 32px clamp(80px,11vw,128px);`)}>
      <header style={css(`text-align:center;margin-bottom:clamp(54px,7vw,80px);`)}>
        <h1 style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(36px,5vw,58px);line-height:1.05;color:var(--ink);`)}>Pricing</h1>
        <p style={css(`margin:20px auto 0;max-width:460px;font-style:italic;font-size:19px;line-height:1.5;color:var(--muted);`)}>A fully edited, curated gallery — every image worth keeping.</p>
      </header>

      <div style={css(`display:flex;flex-direction:column;gap:clamp(28px,3.5vw,36px);`)}>
        <div style={css(`display:grid;grid-template-columns:repeat(${pricingGridCols},1fr);gap:${pricingGridGap};padding:clamp(34px,4.5vw,46px) 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);`)}>
          <div style={css(`text-align: left`)}>
            <h3 style={css(`margin:0 0 14px;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(22px,2.4vw,28px);color:var(--ink);`)}>Families</h3>
            <div style={css(`border-radius:2px;overflow:hidden;background:var(--paper);aspect-ratio:4 / 5;margin:0 0 20px;`)}><img src={cloudinaryFromLocal('/images/families/madison-tanya-hunter/Madison_Tanya_Hunter_2025-08_381.jpg', 900)} alt="Madison + Tanya – Family Session" loading="lazy" style={css(`display:block;width:100%;height:100%;object-fit:cover;`)} /></div>
            <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(20px,2.4vw,24px);color:var(--muted);`)}>$750</p>
            <p style={css(`margin:14px 0 0;font-size:17px;line-height:1.6;color:var(--soft);`)}>Includes newborns.</p>
            <p style={css(`margin:4px 0 0;font-size:17px;line-height:1.6;color:var(--soft);`)}>1 to 1.5 hours, anywhere in San Diego County.</p>
          </div>
          <div style={css(`text-align: left`)}>
            <h3 style={css(`margin:0 0 14px;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(22px,2.4vw,28px);color:var(--ink);`)}>Maternity</h3>
            <div style={css(`border-radius:2px;overflow:hidden;background:var(--paper);aspect-ratio:4 / 5;margin:0 0 20px;`)}><img src={cloudinaryFromLocal('/images/maternity/angelica-eric/AANDE-Maternity51.jpg', 900)} alt="Maternity session on the beach" loading="lazy" style={css(`display:block;width:100%;height:100%;object-fit:cover;`)} /></div>
            <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(20px,2.4vw,24px);color:var(--muted);`)}>$650</p>
            <p style={css(`margin:14px 0 0;font-size:17px;line-height:1.6;color:var(--soft);`)}>Maternity sessions.</p>
            <p style={css(`margin:4px 0 0;font-size:17px;line-height:1.6;color:var(--soft);`)}>1 to 1.5 hours, anywhere in San Diego County.</p>
            <p style={css(`margin:10px 0 0;font-size:13px;line-height:1.5;color:var(--muted);`)}>Booking maternity and newborn together? Ask about a bundled rate.</p>
          </div>
          <div style={css(`text-align: left`)}>
            <h3 style={css(`margin:0 0 14px;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(22px,2.4vw,28px);color:var(--ink);`)}>Couples &amp; Individuals</h3>
            <div style={css(`border-radius:2px;overflow:hidden;background:var(--paper);aspect-ratio:4 / 5;margin:0 0 20px;`)}><img src={cloudinaryFromLocal('/images/portraits/nandini-srikanth/NandiniANDSrikanth102.jpg', 900)} alt="Couple portrait session" loading="lazy" style={css(`display:block;width:100%;height:100%;object-fit:cover;`)} /></div>
            <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(20px,2.4vw,24px);color:var(--muted);`)}>$650</p>
            <p style={css(`margin:14px 0 0;font-size:17px;line-height:1.6;color:var(--soft);`)}>Individuals, couples, engagements, proposals.</p>
            <p style={css(`margin:4px 0 0;font-size:17px;line-height:1.6;color:var(--soft);`)}>1 to 1.5 hours, anywhere in San Diego County.</p>
          </div>
        </div>
        <div style={css(`text-align:center;`)}>
          <p style={css(`margin:0;font-size:18px;line-height:1.6;color:var(--soft);text-wrap:pretty;`)}>All sessions include a fully edited, curated online gallery of every image worth keeping.</p>
          <p style={css(`margin:${pricingNoteGap} 0 0;font-size:18px;line-height:1.6;color:var(--soft);text-wrap:pretty;`)}>Sessions are relaxed and candid – a little direction, a lot of ease, shot in natural light.</p>
          <p style={css(`margin:${pricingNoteGap2} 0 0;font-size:18px;line-height:1.6;color:var(--soft);text-wrap:pretty;`)}>Travel inquiries outside of San Diego county are welcome, for an additional fee.</p>
        </div>
      </div>

      <p style={css(`text-align:center;margin:clamp(40px,5vw,56px) auto 0;max-width:460px;font-style:italic;font-size:18px;line-height:1.55;color:var(--muted);`)}>A $200 deposit holds your date and goes toward your session total. Reach out early — sessions book ahead.</p>

      <div style={css(`text-align:center;margin-top:clamp(44px,6vw,60px);`)}><button onClick={navContact} style={css(`background: var(--ink); color: #FAF6EF; border: none; border-radius: 9px; cursor: pointer; padding: 17px 34px; font-family: 'Mulish',sans-serif; font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase`)}>Book a Session&nbsp;→</button></div>

      <div style={css(`max-width:600px;margin:clamp(56px,7vw,76px) auto 0;text-align:center;`)}>
        <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;font-size:clamp(21px,2.4vw,26px);line-height:1.35;color:var(--ink);`)}>“Thank you for all your work. My family loves them. They're an excellent memory for the rest of our lives.”</p>
        <p style={css(`margin:22px 0 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);`)}>— ANGELICA &amp; ERIC, MATERNITY SESSION</p>
      </div>
    </main>
  );
}
