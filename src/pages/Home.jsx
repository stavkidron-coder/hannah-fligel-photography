import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { testimonialsData } from '../data/content';
import HeroEditorial from '../components/HeroEditorial';
import HeroCarousel from '../components/HeroCarousel';
import HeroDrift from '../components/HeroDrift';
import Button from '../components/Button';
import CategoryPhotos from '../components/CategoryPhotos';

export default function Home() {
  const {
    width, go,
    activeTestimonialIndex, testimonialFading,
  } = useContext(AppContext);
  const isDesktop = width > 680;
  const navInvest = () => go('pricing'), navWork = () => go('work'), navAbout = () => go('about');

  return (
    <main id="main">
      {isDesktop ? (
      <HeroEditorial />
      ) : (
      // Phones: slow drift like desktop by default; ?hero=slides brings back the one-photo-at-a-time carousel for comparing.
      new URLSearchParams(window.location.search).get('hero') === 'slides' ? <HeroCarousel /> : <HeroDrift />
      )}

      <section aria-label="Introduction" style={css(`padding:var(--layout-section-y) var(--layout-page-margin);display:flex;flex-direction:column;align-items:flex-start;gap:var(--space-40);`)}>
        <p className="t-lead" style={css(`max-width:835px;`)}>I believe a photograph isn’t about the pose.<br />It’s about being yourself, and having a story to look back on.</p>
        <div className="intro-actions" style={css(`display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-24);`)}>
          <Button variant="primary" onClick={navWork}>See the work</Button>
          <Button variant="text" onClick={navAbout}>Learn more →</Button>
        </div>
      </section>

      <CategoryPhotos />

      <section style={css(`display:flex;flex-wrap:wrap;gap:var(--space-40) var(--space-64);align-items:center;justify-content:space-between;padding:var(--space-64) ${isDesktop ? 'var(--space-48)' : 'var(--layout-page-margin)'};`)}>
        {/* Every quote sits in the same grid cell, so the block is always as tall as the longest one and nothing below it moves when the quote changes. */}
        <div style={css(`flex:1 1 420px;max-width:683px;display:grid;opacity:${testimonialFading ? 0 : 1};transition:opacity 1.4s ease-in-out;`)}>
          {testimonialsData.map((t, i) => (
            <div key={i} aria-hidden={i === activeTestimonialIndex ? undefined : 'true'} style={css(`grid-area:1 / 1;display:flex;flex-direction:column;justify-content:center;gap:var(--space-32);visibility:${i === activeTestimonialIndex ? 'visible' : 'hidden'};`)}>
              <p className="t-quote-lg">{t.quote}</p>
              <p className="t-caption" style={css(`text-align:right;color:var(--color-text-tertiary);`)}>— <strong style={css(`font-weight:600;color:var(--color-text-primary);`)}>{t.name}</strong> | {t.detail}</p>
            </div>
          ))}
        </div>
        <div className="pricing-cta" style={css(`display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-24);`)}>
          <p className="t-h3" style={css(`color:var(--color-text-secondary);`)}>Curious about working together?</p>
          <Button variant="primary" onClick={navInvest}>View pricing →</Button>
        </div>
      </section>
    </main>
  );
}
