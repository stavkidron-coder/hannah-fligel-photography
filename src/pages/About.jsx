import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { cloudinaryFromLocal } from '../lib/cloudinary';
import Button from '../components/Button';

export default function About() {
  const { go } = useContext(AppContext);
  const navContact = () => go('contact');
  const para = css(`margin:0 0 var(--space-24);color:var(--color-text-secondary);`);
  return (
    <main id="main">
      <div style={css(`max-width:680px;margin:0 auto;padding:clamp(48px,7vw,72px) var(--space-32) 0;`)}>
        <div style={css(`position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;background:var(--color-bg-surface);`)}>
          <img src={cloudinaryFromLocal('/images/About/hannah-portrait.jpg', 1400)} alt="Portrait of Hannah Fligel" style={css(`width: 100%; height: 100%; object-fit: cover; border-radius: 3px`)} />
        </div>
      </div>
      <div style={css(`max-width:680px;margin:0 auto;padding:clamp(40px,6vw,56px) var(--space-32) clamp(80px,11vw,128px);`)}>
        <h1 className="t-h1">Hannah Fligel</h1>
        <p className="t-label" style={css(`margin:var(--space-8) 0 clamp(40px,5vw,56px);color:var(--color-text-tertiary);`)}>Portrait &amp; lifestyle photographer</p>

        <p className="t-body" style={para}>Warm, editorial storytelling for couples, families &amp; individuals</p>
        <p className="t-body" style={para}>For over 10 years, I've had the privilege of photographing families, couples, and individuals. My work blends warm, editorial imagery with natural, unscripted moments that feel true to who you are.</p>
        <p className="t-body" style={para}>My husband, Stav, and I live in Encinitas, a quiet beach town in North County San Diego, with our two cats, Moon and Floyd. When I'm not photographing, you'll usually find me testing a new recipe, checking out San Diego's amazing restaurants and bars, at pilates, or off exploring somewhere new.</p>
        <p className="t-body" style={para}>I've loved photography for as long as I can remember, and what still gets me every time is sharing it – giving someone photos that look and feel like their best selves. If that's what you're after, let's talk.&nbsp;</p>

        <div style={css(`margin-top:clamp(44px,6vw,60px);`)}><Button variant="primary" onClick={navContact}>Let's work together →</Button></div>
      </div>
    </main>
  );
}
