import { Fragment, useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { heroSlides, testimonialsData, teaserPhotos } from '../data/content';
import { layoutFor } from '../lib/layout';
import HeroPagination from '../components/HeroPagination';
import { useHeroTones } from '../hooks/useHeroTones';
import { packPhotos } from '../lib/packPhotos';
import { sessionPhotoTile, skeletonTile } from '../components/PhotoTiles';

export default function Home() {
  const {
    width, go, activeHero, heroPaused, heroQuick, goToHero, toggleHero, heroTouchStart, heroTouchEnd,
    activeTestimonialIndex, testimonialFading, selectTestimonial, orientationCache,
  } = useContext(AppContext);
  const { teaserGridCols, photoGap, teaserSectionStyle } = layoutFor(width);
  const isDesktop = width > 680;
  const tones = useHeroTones(heroSlides, width);
  // Slide controls flip between light and dark to stay legible over the active photo.
  const ctrl = tones[activeHero] === 'dark'
    ? { fg: '#2E2A24', pause: '#2E2A24', ringGlow: '0 0 7.5px rgba(250,246,239,0.55)', pillGlow: '0 0 15px rgba(250,246,239,0.45)' }
    : { fg: '#FAF6EF', pause: '#D9D9D9', ringGlow: '0 0 7.5px rgba(250,246,239,0.8)', pillGlow: '0 0 15px rgba(250,246,239,0.6)' };
  const navWork = () => go('work'), navInvest = () => go('pricing'), navContact = () => go('contact');

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

  const teaserAllKnown = teaserPhotos.every((src) => src in orientationCache);
  const teaserTiles = teaserAllKnown
    ? packPhotos(teaserPhotos, teaserGridCols, orientationCache).map((p, i) => sessionPhotoTile(p.src, p.span, i, 'Featured client photography'))
    : teaserPhotos.map((src, i) => skeletonTile(`sk-${i}`));

  const activeTestimonial = testimonialsData[activeTestimonialIndex];
  const testimonialOpacity = testimonialFading ? 0 : 1;
  const testimonials = testimonialsData.map((t, i) => ({
    select: () => selectTestimonial(i),
    label: 'Show testimonial ' + (i + 1) + ' of ' + testimonialsData.length,
    current: i === activeTestimonialIndex ? 'true' : 'false',
    dotStyle: {
      display: 'block',
      width: i === activeTestimonialIndex ? 10 : 8,
      height: i === activeTestimonialIndex ? 10 : 8,
      borderRadius: '50%',
      border: '1px solid var(--muted)',
      background: i === activeTestimonialIndex ? 'var(--ink)' : 'transparent',
      transition: 'background .4s ease-in-out',
    },
  }));

  return (
    <main id="main">
      {isDesktop ? (
      <section onTouchStart={heroTouchStart} onTouchEnd={heroTouchEnd} aria-roledescription="carousel" style={css(`position:relative;height:100dvh;min-height:560px;margin-top:-94px;overflow:hidden;background:var(--paper);`)}>
        {heroLayers}
        <div style={css(`position:absolute;inset:0;background:linear-gradient(to top,rgba(40,32,24,0.06) 50.481%,rgba(40,32,24,0) 100%);`)}></div>
        <div aria-hidden="true" style={css(`position:absolute;inset:0;pointer-events:none;`)}>
          <span style={css(`position:absolute;top:54px;bottom:54px;left:4.176%;width:1px;background:rgba(255,255,255,0.2);`)}></span>
          <span style={css(`position:absolute;top:54px;bottom:54px;right:5.32%;width:1px;background:rgba(255,255,255,0.2);`)}></span>
          <span style={css(`position:absolute;top:91px;left:1.43%;width:74.31%;height:1px;background:rgba(255,255,255,0.2);`)}></span>
          <span style={css(`position:absolute;bottom:121px;left:52.29%;width:45.19%;height:1px;background:rgba(255,255,255,0.2);`)}></span>
          <svg width="14.14" height="14.14" viewBox="0 0 14.14 14.14" style={css(`position:absolute;right:6.34%;bottom:138.8px;overflow:visible;`)}><path d="M0 0L14.14 14.14M14.14 0L0 14.14" stroke="white" strokeOpacity="0.2" fill="none"></path></svg>
        </div>
        <div style={css(`position:absolute;left:0;right:0;bottom:19%;display:flex;flex-direction:column;align-items:center;gap:1.55vw;text-align:center;pointer-events:none;color:#FAF6EF;`)}>
          <div style={css(`display:flex;align-items:flex-end;gap:1.55vw;`)}>
            <h1 style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(48px,6.29vw,120px);line-height:1;letter-spacing:.01em;white-space:nowrap;text-shadow:0 0 40px rgba(250,246,239,0.8);`)}>Hannah Fligel<span style={css(`position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);`)}> Photography</span></h1>
            <div aria-hidden="true" style={css(`display:flex;align-items:flex-end;font-size:clamp(48px,6.29vw,120px);`)}>
              <span style={css(`display:block;box-sizing:border-box;width:.364em;height:.636em;margin-right:-.21em;border-left:2px solid #FAF6EF;border-top:2px solid #FAF6EF;border-top-left-radius:.18em;filter:drop-shadow(0 0 7.5px rgba(250,246,239,0.8));`)}></span>
              <span style={css(`font-family:'Cormorant Garamond',serif;font-weight:500;font-size:.4366em;line-height:normal;letter-spacing:.0229em;white-space:nowrap;text-shadow:0 0 20px rgba(251,248,242,0.8);`)}>photography</span>
            </div>
          </div>
          <p style={css(`margin:0;font-family:'Mulish',sans-serif;font-size:clamp(12px,.92vw,17px);font-weight:500;letter-spacing:.46em;text-transform:uppercase;text-shadow:0 0 10px #FAF6EF;white-space:nowrap;`)}>SAN DIEGO, CA</p>
        </div>
        <div style={css(`position:absolute;right:28px;top:27%;display:flex;flex-direction:column;align-items:flex-end;pointer-events:none;`)}>
          <div style={css(`display:flex;flex-direction:column;align-items:flex-end;margin-right:12px;pointer-events:auto;`)}><HeroPagination count={heroSlides.length} active={activeHero} onSelect={goToHero} ctrl={ctrl} /></div>
          <button onClick={toggleHero} aria-label={heroToggleLabel} style={css(`pointer-events:auto;background:none;border:none;width:44px;height:44px;margin-top:36px;display:flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;padding:0;`)}>
            {heroPaused && (<svg width="12" height="18" viewBox="0 0 12 18" fill="none"><path d="M0 0L12 9L0 18V0Z" fill={ctrl.pause}></path></svg>)}
            {heroPlaying && (<><span style={{ display: 'block', width: 3, height: 18, borderRadius: 999, background: ctrl.pause, transition: 'background-color 1.2s ease' }}></span><span style={{ display: 'block', width: 3, height: 18, borderRadius: 999, background: ctrl.pause, transition: 'background-color 1.2s ease' }}></span></>)}
          </button>
        </div>
      </section>
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

      <section style={css(`max-width:720px;margin:0 auto;padding:clamp(80px,11vw,128px) 32px;text-align:center;`)}>
        <p style={css(`margin:0;font-size:20px;line-height:1.66;color:var(--soft);`)}>Hi! I'm Hannah – a San Diego photographer with 10+ years of experience, working with couples, individuals, engaged and newly-engaged couples, expecting parents, families, and newborns. I shoot in a style that's natural, candid, and editorial – warm and real.</p>
        <p style={css(`margin:28px 0 0;font-size:20px;line-height:1.66;color:var(--soft);`)}>I photograph throughout San Diego County (travel inquiries outside San Diego County are always welcome), wherever the light is good and the moment is honest – backyards, living rooms, the coast, golden late-afternoon light. The goal is always the same: images that feel like you, not like a photoshoot.</p>
        <p style={css(`margin:28px 0 0;font-size:20px;line-height:1.66;color:var(--soft);`)}><strong>The real story, not the posed one.</strong></p>
        <p style={css(`margin:16px 0 0;font-size:20px;line-height:1.66;color:var(--soft);`)}>It's what I look for in every session – not the moments you'd plan for, but the ones that happen when you forget I'm there. After 10+ years doing this, I know exactly how to find them.</p>
        <div style={css(`margin-top:42px;`)}><button onClick={navWork} style={css(`background:none;border:none;border-bottom:1px solid var(--muted);cursor:pointer;padding:0 0 6px;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);`)}>See the Work&nbsp;→</button></div>
      </section>

      <section style={teaserSectionStyle}>
        <div style={css(`max-width:1180px;margin:0 auto;display:grid;grid-template-columns:repeat(${teaserGridCols},1fr);grid-auto-flow:dense;gap:${photoGap};`)}>{teaserTiles}</div>
      </section>

      <section style={css(`padding:clamp(64px,9vw,104px) 32px;text-align:center;`)}>
        <p style={css(`margin:0;font-style:italic;font-size:clamp(19px,2.2vw,23px);color:var(--soft);`)}>Curious about working together?</p>
        <div style={css(`margin-top:20px;`)}>
          <button onClick={navInvest} style={css(`background:none;border:none;border-bottom:1px solid var(--muted);cursor:pointer;padding:0 0 3px;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);vertical-align:middle;`)}>View Pricing&nbsp;→</button>
        </div>
      </section>

      <section style={css(`background: var(--paper)`)}>
        <div style={css(`max-width:760px;margin:0 auto;padding:clamp(80px,11vw,128px) 32px;text-align:center;`)}>
          <div style={css(`min-height:clamp(170px,20vw,210px);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:${testimonialOpacity};transition:opacity .4s ease-in-out;`)}>
            <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;font-size:clamp(22px,2.6vw,30px);line-height:1.32;color:var(--ink);`)}>{activeTestimonial.quote}</p>
            <p style={css(`margin:30px 0 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);`)}>{activeTestimonial.author}</p>
          </div>
          <div style={css(`display:flex;justify-content:center;gap:2px;margin-top:clamp(30px,4vw,40px);`)}>
            {testimonials.map((t, idx) => (<Fragment key={idx}>
              <button onClick={t.select} aria-label={t.label} aria-current={t.current} style={css(`background:none;border:none;cursor:pointer;padding:0;width:44px;height:44px;display:flex;align-items:center;justify-content:center;`)}><span style={t.dotStyle}></span></button>
            </Fragment>))}
          </div>
        </div>
      </section>

      <section style={css(`text-align:center;padding:clamp(90px,12vw,140px) 32px;`)}>
        <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:300;font-size:clamp(30px,4.6vw,54px);line-height:1.15;color:var(--ink);`)}>Let's make something worth keeping.</p>
        <div style={css(`margin-top:36px;`)}><button onClick={navContact} style={css(`background: var(--ink); color: #FAF6EF; border: none; border-radius: 9px; cursor: pointer; padding: 17px 34px; font-family: 'Mulish',sans-serif; font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase`)}>Get in Touch</button></div>
      </section>
    </main>
  );
}
