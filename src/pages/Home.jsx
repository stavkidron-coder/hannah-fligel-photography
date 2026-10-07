import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { heroSlides, testimonialsData } from '../data/content';
import HeroEditorial from '../components/HeroEditorial';
import IntroSection from '../components/IntroSection';
import FeaturedMarquee from '../components/FeaturedMarquee';

export default function Home() {
  const {
    width, go, activeHero, heroPaused, heroQuick, goToHero, toggleHero, heroTouchStart, heroTouchEnd,
  } = useContext(AppContext);
  const isDesktop = width > 680;
  const navInvest = () => go('pricing'), navContact = () => go('contact');

  const heroDots = heroSlides.map((s, i) => (
    <button
      key={i}
      onClick={() => goToHero(i)}
      aria-label={'Show slide ' + (i + 1) + ' of ' + heroSlides.length}
      aria-current={i === activeHero ? 'true' : 'false'}
      style={{
        width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', padding: 0, cursor: 'pointer', pointerEvents: 'auto',
      }}
    >
      <span
        style={{
          width: 6, height: 6, borderRadius: '50%', border: '1px solid rgba(251,248,242,0.85)',
          background: i === activeHero ? '#FBF8F2' : 'transparent',
          transition: 'background .5s ease, transform .5s ease',
        }}
      />
    </button>
  ));
  const heroLayers = heroSlides.map((s, i) => (
    <div
      key={i}
      style={{
        position: 'absolute', inset: 0,
        opacity: i === activeHero ? 1 : 0,
        transition: heroQuick.current ? 'opacity .6s ease-out' : 'opacity 2.4s ease-in-out',
        backgroundImage: `url("${encodeURI(s.src)}")`,
        backgroundSize: 'cover',
        backgroundPosition: s.pos,
        backgroundColor: 'var(--paper)',
      }}
    />
  ));
  const heroToggleLabel = heroPaused ? 'Play slideshow' : 'Pause slideshow';
  const heroPlaying = !heroPaused;

  const testimonial = testimonialsData[0];

  return (
    <main id="main">
      {isDesktop ? (
      <HeroEditorial />
      ) : (
      <section onTouchStart={heroTouchStart} onTouchEnd={heroTouchEnd} aria-roledescription="carousel" style={css(`position:relative;height:min(calc(100dvh - 67px),128vw);min-height:430px;overflow:hidden;background:var(--paper);touch-action:pan-y;`)}>
        {heroLayers}
        <div style={css(`position:absolute;inset:0;background:linear-gradient(to bottom,rgba(40,32,24,0) 55%,rgba(40,32,24,0.32) 100%);`)}></div>
        <div style={css(`position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:max(9vh,86px);text-align:center;pointer-events:none;`)}>
          <h1 style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(38px,6vw,82px);line-height:1;letter-spacing:.01em;color:#FBF8F2;text-shadow:0 2px 34px rgba(35,27,20,0.45);`)}>Hannah Fligel Photography</h1>
          <p style={css(`margin:20px 0 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:500;letter-spacing:.46em;text-transform:uppercase;color:#FBF8F2;text-shadow:0 1px 18px rgba(35,27,20,0.5);white-space:nowrap;`)}>SAN DIEGO, CA</p>
        </div>
        <div style={css(`position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:10px;padding:6px 0 22px;pointer-events:auto;opacity:.55;transition:opacity .25s, transform .25s;transform:scale(1);`)}>
          <button onClick={toggleHero} aria-label={heroToggleLabel} style={css(`background:none;border:none;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#FBF8F2;padding:0;`)}>
            {heroPaused && (<>
              <svg width="7" height="8" viewBox="0 0 9 10" fill="none"><path d="M0 0L9 5L0 10V0Z" fill="#FBF8F2"></path></svg>
            </>)}
            {heroPlaying && (<>
              <svg width="6" height="8" viewBox="0 0 8 10" fill="none"><rect width="2.4" height="10" fill="#FBF8F2"></rect><rect x="5.6" width="2.4" height="10" fill="#FBF8F2"></rect></svg>
            </>)}
          </button>
          <div style={css(`display:flex;gap:0;`)}>{heroDots}</div>
        </div>
      </section>
      )}

      <IntroSection />

      <FeaturedMarquee />

      <section style={css(`display:flex;flex-wrap:wrap;gap:40px 64px;align-items:center;justify-content:space-between;padding:60px clamp(24px,5.8vw,102px);`)}>
        <div style={css(`flex:1 1 420px;max-width:683px;display:flex;flex-direction:column;gap:32px;`)}>
          <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;font-size:clamp(22px,2.6vw,30px);line-height:1.32;color:var(--ink);`)}>{testimonial.quote}</p>
          <p style={css(`margin:0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);`)}>{testimonial.author}</p>
        </div>
        <div style={css(`display:flex;flex-direction:column;gap:12px;align-items:flex-start;`)}>
          <p style={css(`margin:0;font-style:italic;font-size:clamp(19px,2.2vw,23px);color:var(--soft);`)}>Curious about working together?</p>
          <button onClick={navInvest} style={css(`background:none;border:none;border-bottom:1px solid var(--muted);cursor:pointer;padding:0 0 3px;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);`)}>View Pricing&nbsp;→</button>
        </div>
      </section>
    </main>
  );
}
