import { Fragment, useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinaryFromLocal } from '../lib/cloudinary';

export default function About() {
  const { go } = useContext(AppContext);
  const navContact = () => go('contact');
  return (
    <main id="main">
      <div style={css(`max-width:680px;margin:0 auto;padding:clamp(48px,7vw,72px) 32px 0;`)}>
        <div style={css(`position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;background:var(--paper);`)}>
          <img src={cloudinaryFromLocal('/images/About/hannah-portrait.jpg', 1400)} alt="Portrait of Hannah Fligel" style={css(`width: 100%; height: 100%; object-fit: cover; border-radius: 3px`)} />
        </div>
      </div>
      <div style={css(`max-width:680px;margin:0 auto;padding:clamp(40px,6vw,56px) 32px clamp(80px,11vw,128px);`)}>
        <h1 style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(34px,4.6vw,52px);line-height:1.05;color:var(--ink);`)}>Hannah Fligel</h1>
        <p style={css(`margin:10px 0 clamp(40px,5vw,56px);font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);`)}>PORTRAIT &amp; LIFESTYLE PHOTOGRAPHER</p>
      
        <p style={css(`margin:0 0 24px;font-size:20px;line-height:1.66;color:var(--soft);`)}><b><span style={css(`font-weight: normal;`)}><b style={css(`text-transform: none`)}>Warm, editorial storytelling for couples, families &amp; individuals</b></span></b></p><p style={css(`margin:0 0 24px;font-size:20px;line-height:1.66;color:var(--soft);`)}>For over 10 years, I've had the privilege of photographing families, couples, and individuals. My work blends warm, editorial imagery with natural, unscripted moments that feel true to who you are.</p>
        <p style={css(`margin:0 0 24px;font-size:20px;line-height:1.66;color:var(--soft);`)}>My husband, Stav, and I live in Encinitas, a quiet beach town in North County San Diego, with our two cats, Moon and Floyd. When I'm not photographing, you'll usually find me testing a new recipe, checking out San Diego's amazing restaurants and bars, at pilates, or off exploring somewhere new.</p>
      
        <p style={css(`margin:0 0 24px;font-size:20px;line-height:1.66;color:var(--soft);`)}>I've loved photography for as long as I can remember, and what still gets me every time is sharing it – giving someone photos that look and feel like their best selves. If that's what you're after, let's talk.&nbsp;</p>
      
        <div style={css(`margin-top:clamp(44px,6vw,60px);`)}><button onClick={navContact} style={css(`background: var(--ink); color: #FAF6EF; border: none; border-radius: 9px; cursor: pointer; padding: 17px 34px; font-family: 'Mulish',sans-serif; font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase`)} type="button">Let's Work Together&nbsp;→</button></div>
      </div>
    </main>
  );
}
