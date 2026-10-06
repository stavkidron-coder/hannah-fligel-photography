import { Fragment, useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { layoutFor } from '../lib/layout';
import { packPhotos } from '../lib/packPhotos';
import { allSessions, catLabels, catNotes, savedOrder, sessionQuotes } from '../data/sessions';
import { batchSize } from '../config';
import { cloudinarySrcSet, COVER_WIDTHS, COVER_SIZES_GRID, COVER_SIZES_MORE } from '../lib/cloudinary';
import { sessionPhotoTile, skeletonTile } from '../components/PhotoTiles';

const reorder = (list, orderIds) => {
  if (!orderIds || !orderIds.length) return list;
  const map = new Map(list.map((s) => [s.id, s]));
  const ordered = orderIds.map((id) => map.get(id)).filter(Boolean);
  const remaining = list.filter((s) => !orderIds.includes(s.id));
  return [...ordered, ...remaining];
};

export default function Work() {
  const {
    width, go, workCat: cat, session, visibleCount: visibleCounts, loadMore, gridRef, orientationCache,
    openSession, closeSession: closeSessionAction, setCat,
  } = useContext(AppContext);
  const { galleryCols, sessionGridCols, sessionGridStyle } = layoutFor(width);
  const navInvest = () => go('pricing');
  const closeSession = () => closeSessionAction();

  const tabStyle = (active) => {
    const narrow = (width || 1200) <= 460;
    return {
      background: 'none', border: 'none', cursor: 'pointer', padding: '12px 6px',
      fontFamily: "'Mulish',sans-serif", fontSize: narrow ? '12px' : '13px', fontWeight: 600,
      letterSpacing: narrow ? '.1em' : '.16em', textTransform: 'uppercase',
      whiteSpace: narrow ? 'normal' : 'nowrap',
      maxWidth: '100%', textAlign: 'center',
      color: active ? 'var(--ink)' : 'var(--muted)',
      borderBottom: active ? '2px solid var(--ink)' : '2px solid transparent',
    };
  };
  const tabRowStyle = (width || 1200) <= 460
    ? { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', width: '100%', justifyItems: 'stretch', alignItems: 'start', columnGap: '10px', rowGap: '2px', position: 'static' }
    : { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 'clamp(14px,3.4vw,46px)', rowGap: '4px', position: 'static' };
  const tabEverything = tabStyle(cat === 'everything');
  const tabFamilies = tabStyle(cat === 'families');
  const tabMaternity = tabStyle(cat === 'maternity');
  const tabCouples = tabStyle(cat === 'couples');
  const isCatEverything = cat === 'everything', isCatFamilies = cat === 'families';
  const isCatMaternity = cat === 'maternity', isCatCouples = cat === 'couples';
  const catEverything = () => setCat('everything');
  const catFamilies = () => setCat('families');
  const catMaternity = () => setCat('maternity');
  const catCouples = () => setCat('couples');
  const catNote = catNotes[cat];
  const backLabel = cat === 'families' ? 'Family Galleries' : (cat === 'maternity' ? 'Maternity Galleries' : (cat === 'couples' ? 'Couples & Individual Galleries' : 'Galleries'));

  const orderedAll = reorder(allSessions, savedOrder.everything);
  const sessionsForCat = cat === 'everything' ? orderedAll : orderedAll.filter((s) => s.cat === cat);
  const visibleCount = visibleCounts[cat] || batchSize;
  const shownSessionsRaw = sessionsForCat.slice(0, visibleCount);
  const shownSessions = shownSessionsRaw.map((s, i) => ({
    id: s.id, title: s.title, catLabel: catLabels[s.cat], cover: encodeURI(s.cover),
    alt: s.title + ' — cover photo',
    open: () => openSession(s), delayMs: Math.min(i, 12) * 45,
  }));
  const hasMore = visibleCount < sessionsForCat.length;
  const shownCount = shownSessions.length, totalCount = sessionsForCat.length;
  const activeSession = session ? allSessions.find((s) => s.id === session) : null;
  const isSessionView = !!activeSession;
  let sessionPhotoTiles = [];
  if (activeSession) {
    const allKnown = activeSession.photos.every((src) => src in orientationCache);
    if (allKnown) {
      sessionPhotoTiles = packPhotos(activeSession.photos, sessionGridCols, orientationCache).map((p, i) => sessionPhotoTile(p.src, p.span, i, activeSession.title));
    } else {
      sessionPhotoTiles = activeSession.photos.map((src, i) => skeletonTile(`sk-${i}`));
    }
  }

  let moreSessions = [];
  if (activeSession) {
    const sameCat = orderedAll.filter((s) => s.cat === activeSession.cat && s.id !== activeSession.id);
    const start = Math.max(0, sameCat.findIndex((s) => s.id === activeSession.id));
    const pool = sameCat.length >= 3 ? sameCat : [...sameCat, ...orderedAll.filter((s) => s.cat !== activeSession.cat)];
    const picks = [];
    for (let i = 0; i < pool.length && picks.length < 3; i++) picks.push(pool[(start + i) % pool.length]);
    moreSessions = picks.map((s) => ({
      id: s.id, title: s.title, catLabel: catLabels[s.cat], cover: encodeURI(s.cover),
      alt: s.title + ' — cover photo', open: () => openSession(s),
    }));
  }
  const hasMoreSessions = moreSessions.length > 0;
  const moreSessionsCols = width <= 680 ? 1 : 3;
  const sessionTitle = activeSession ? activeSession.title : '';
  const sessionQuote = activeSession ? (sessionQuotes[activeSession.id]?.quote || '') : '';
  const sessionQuoteAuthor = activeSession ? (sessionQuotes[activeSession.id]?.author || '') : '';
  const sessionCatLabel = activeSession ? catLabels[activeSession.cat] : '';

  return (
    <main id="main" style={css(`max-width:1180px;margin:0 auto;padding:clamp(56px,8vw,92px) clamp(20px,4vw,40px) 0;`)}>

      {isSessionView && (<>
        <button onClick={closeSession} type="button" style={css(`background:none;border:none;cursor:pointer;padding:0;margin-bottom:clamp(30px,4vw,44px);font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);`)}>← Back to {backLabel}</button>
        <div style={css(`max-width:860px;margin:0 auto clamp(50px,7vw,76px);text-align:center;`)}>
          <h1 style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(32px,4.4vw,50px);line-height:1.1;color:var(--ink);`)}>{sessionTitle}</h1>
          <p style={css(`margin:14px 0 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);`)}>{sessionCatLabel}</p>
        </div>
        <div style={sessionGridStyle}>{sessionPhotoTiles}</div>

        {sessionQuote && (<>
          <div style={css(`max-width:640px;margin:clamp(48px,6vw,66px) auto 0;text-align:center;`)}>
            <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;font-size:clamp(21px,2.4vw,26px);line-height:1.35;color:var(--ink);`)}>{sessionQuote}</p>
            <p style={css(`margin:22px 0 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);`)}>{sessionQuoteAuthor}</p>
          </div>
        </>)}

        <div style={css(`max-width:860px;margin:0 auto;padding:clamp(64px,8vw,96px) 0 clamp(80px,10vw,120px);border-top:1px solid rgba(0,0,0,.08);margin-top:clamp(56px,7vw,80px);display:flex;flex-direction:column;align-items:center;gap:clamp(48px,6vw,66px);`)}>
          <div style={css(`text-align:center;display:flex;flex-direction:column;align-items:center;gap:22px;`)}>
            <p style={css(`margin:0;font-style:italic;font-size:clamp(20px,2.4vw,25px);line-height:1.4;color:var(--soft);`)}>Ready to plan a session like this?</p>
            <button onClick={navInvest} type="button" style={css(`background:var(--ink);color:#FAF6EF;border:none;border-radius:12px;cursor:pointer;padding:17px 34px;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;`)}>View Pricing&nbsp;→</button>
          </div>

          {hasMoreSessions && (<>
            <div style={css(`width:100%;`)}>
              <p style={css(`margin:0 0 clamp(24px,3vw,32px);text-align:center;font-family:'Mulish',sans-serif;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);`)}>More sessions like this</p>
              <div style={css(`display:grid;grid-template-columns:repeat(${moreSessionsCols},1fr);gap:clamp(20px,3vw,30px);`)}>
                {moreSessions.map((m, idx) => (<Fragment key={idx}>
                  <button onClick={m.open} type="button" style={css(`display:flex;flex-direction:column;gap:13px;background:none;border:none;cursor:pointer;padding:0;text-align:left;font:inherit;color:inherit;`)}>
                    <div style={css(`border-radius:2px;overflow:hidden;background:var(--paper);aspect-ratio:4 / 5;`)}><img src={m.cover} srcSet={cloudinarySrcSet(m.cover, COVER_WIDTHS)} sizes={cloudinarySrcSet(m.cover, COVER_WIDTHS) ? COVER_SIZES_MORE : undefined} alt={m.alt} loading="lazy" style={css(`display:block;width:100%;height:100%;object-fit:cover;`)} /></div>
                    <div>
                      <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:18px;line-height:1.3;color:var(--ink);`)}>{m.title}</p>
                      <p style={css(`margin:4px 0 0;font-family:'Mulish',sans-serif;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);`)}>{m.catLabel}</p>
                    </div>
                  </button>
                </Fragment>))}
              </div>
            </div>
          </>)}

          <button onClick={closeSession} type="button" style={css(`background:none;border:none;cursor:pointer;padding:0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);`)}>← Back to {backLabel}</button>
        </div>
      </>)}

      {!isSessionView && (<>
        <h1 style={css(`position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;margin:0;`)}>San Diego Portfolio — Couples, Individual, Engagement, Proposal, Maternity, Family &amp; Newborn Photography</h1>
        <div style={tabRowStyle}>
          <button onClick={catEverything} aria-pressed={isCatEverything} style={tabEverything}>Everything</button>
          <button onClick={catFamilies} aria-pressed={isCatFamilies} style={tabFamilies}>Families</button>
          <button onClick={catMaternity} aria-pressed={isCatMaternity} style={tabMaternity}>Maternity</button>
          <button onClick={catCouples} aria-pressed={isCatCouples} style={tabCouples}>Couples &amp; Individuals</button>
        </div>
        <p style={css(`text-align:center;margin:18px 0 clamp(40px,5vw,60px);font-style:italic;font-size:16px;color:var(--muted);`)}>{catNote}</p>
        <div ref={gridRef} style={css(`display:grid;grid-template-columns:repeat(${galleryCols},1fr);gap:clamp(24px,3vw,36px);`)}>
          {shownSessions.map((s, idx) => (<Fragment key={idx}>
            <button onClick={s.open} type="button" style={css(`display:flex;flex-direction:column;gap:14px;background:none;border:none;cursor:pointer;padding:0;text-align:left;font:inherit;color:inherit;animation:cardFadeIn .5s ease both;animation-delay:${s.delayMs}ms;`)}>
              <div style={css(`border-radius:2px;overflow:hidden;background:var(--paper);aspect-ratio:4 / 5;`)}><img src={s.cover} srcSet={cloudinarySrcSet(s.cover, COVER_WIDTHS)} sizes={cloudinarySrcSet(s.cover, COVER_WIDTHS) ? COVER_SIZES_GRID : undefined} alt={s.alt} loading="lazy" style={css(`display:block;width:100%;height:100%;object-fit:cover;`)} /></div>
              <div>
                <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:19px;line-height:1.3;color:var(--ink);`)}>{s.title}</p>
                <p style={css(`margin:4px 0 0;font-family:'Mulish',sans-serif;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);`)}>{s.catLabel}</p>
              </div>
            </button>
          </Fragment>))}
        </div>
        {hasMore && (<>
          <div style={css(`text-align:center;padding:clamp(36px,5vw,50px) 0 clamp(40px,5vw,60px);`)}>
            <p style={css(`margin:0 0 18px;font-family:'Mulish',sans-serif;font-size:12px;letter-spacing:.1em;color:var(--muted);`)}>Showing {shownCount} of {totalCount} sessions</p>
            <button onClick={loadMore} style={css(`background:none;border:1px solid var(--muted);border-radius:9px;cursor:pointer;padding:14px 30px;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);`)}>Load More</button>
          </div>
        </>)}
        <div style={css(`text-align:center;padding:clamp(70px,9vw,108px) 0 clamp(80px,10vw,120px);`)}>
          <p style={css(`margin:0 0 22px;font-style:italic;font-size:clamp(20px,2.4vw,25px);color:var(--soft);`)}>Like what you see?</p>
          <button onClick={navInvest} style={css(`background: var(--ink); color: #FAF6EF; border: none; border-radius: 12px; cursor: pointer; padding: 17px 34px; font-family: 'Mulish',sans-serif; font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase`)} type="button">View Pricing&nbsp;→</button>
        </div>
      </>)}

    </main>
  );
}
