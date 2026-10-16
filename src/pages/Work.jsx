import { Fragment, useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { layoutFor } from '../lib/layout';
import { packPhotos } from '../lib/packPhotos';
import { allSessions, catLabels, catNotes, savedOrder, sessionQuotes } from '../data/sessions';
import { batchSize } from '../config';
import { cloudinarySrcSet, COVER_WIDTHS, COVER_SIZES_GRID, COVER_SIZES_MORE } from '../lib/cloudinary';
import { sessionPhotoTile, skeletonTile } from '../components/PhotoTiles';
import Button from '../components/Button';

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
      background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-12) 6px',
      whiteSpace: narrow ? 'normal' : 'nowrap',
      maxWidth: '100%', textAlign: 'center',
      color: active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
      borderBottom: active ? '2px solid var(--color-border-strong)' : '2px solid transparent',
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
    <main id="main" style={css(`max-width:1180px;margin:0 auto;padding:clamp(56px,8vw,92px) var(--layout-page-margin) 0;`)}>

      {isSessionView && (<>
        <button className="t-label" onClick={closeSession} type="button" style={css(`background:none;border:none;cursor:pointer;padding:0;margin-bottom:clamp(30px,4vw,44px);color:var(--color-text-tertiary);`)}>← Back to {backLabel}</button>
        <div style={css(`max-width:860px;margin:0 auto clamp(50px,7vw,76px);text-align:center;`)}>
          <h1 className="t-h1">{sessionTitle}</h1>
          <p className="t-caption" style={css(`margin:var(--space-12) 0 0;color:var(--color-text-tertiary);`)}>{sessionCatLabel.toLowerCase()}</p>
        </div>
        <div style={sessionGridStyle}>{sessionPhotoTiles}</div>

        {sessionQuote && (<>
          <div style={css(`max-width:640px;margin:clamp(48px,6vw,66px) auto 0;text-align:center;`)}>
            <p className="t-quote-md">{sessionQuote}</p>
            <p className="t-label" style={css(`margin:var(--space-24) 0 0;color:var(--color-text-tertiary);`)}>{sessionQuoteAuthor}</p>
          </div>
        </>)}

        <div style={css(`max-width:860px;margin:0 auto;padding:clamp(64px,8vw,96px) 0 clamp(80px,10vw,120px);border-top:1px solid var(--color-border-default);margin-top:clamp(56px,7vw,80px);display:flex;flex-direction:column;align-items:center;gap:clamp(48px,6vw,66px);`)}>
          <div style={css(`text-align:center;display:flex;flex-direction:column;align-items:center;gap:22px;`)}>
            <p className="t-h3" style={css(`color:var(--color-text-secondary);`)}>Ready to plan a session like this?</p>
            <Button variant="primary" onClick={navInvest}>View pricing →</Button>
          </div>

          {hasMoreSessions && (<>
            <div style={css(`width:100%;`)}>
              <p className="t-label" style={css(`margin:0 0 var(--space-32);text-align:center;color:var(--color-text-tertiary);`)}>More sessions like this</p>
              <div style={css(`display:grid;grid-template-columns:repeat(${moreSessionsCols},1fr);gap:var(--space-32);`)}>
                {moreSessions.map((m, idx) => (<Fragment key={idx}>
                  <button onClick={m.open} type="button" style={css(`display:flex;flex-direction:column;gap:var(--space-8);background:none;border:none;cursor:pointer;padding:0;text-align:left;font:inherit;color:inherit;`)}>
                    <div style={css(`border-radius:var(--radius-none);overflow:hidden;background:var(--color-bg-surface);aspect-ratio:4 / 5;`)}><img src={m.cover} srcSet={cloudinarySrcSet(m.cover, COVER_WIDTHS)} sizes={cloudinarySrcSet(m.cover, COVER_WIDTHS) ? COVER_SIZES_MORE : undefined} alt={m.alt} loading="lazy" style={css(`display:block;width:100%;height:100%;object-fit:cover;`)} /></div>
                    <div>
                      <p className="t-body">{m.title}</p>
                      <p className="t-caption" style={css(`color:var(--color-text-tertiary);`)}>{m.catLabel.toLowerCase()}</p>
                    </div>
                  </button>
                </Fragment>))}
              </div>
            </div>
          </>)}

          <button className="t-label" onClick={closeSession} type="button" style={css(`background:none;border:none;cursor:pointer;padding:0;color:var(--color-text-tertiary);`)}>← Back to {backLabel}</button>
        </div>
      </>)}

      {!isSessionView && (<>
        <h1 style={css(`position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;margin:0;`)}>San Diego Portfolio — Couples, Individual, Engagement, Proposal, Maternity, Family &amp; Newborn Photography</h1>
        <div style={tabRowStyle}>
          <button className="t-label" onClick={catEverything} aria-pressed={isCatEverything} style={tabEverything}>Everything</button>
          <button className="t-label" onClick={catFamilies} aria-pressed={isCatFamilies} style={tabFamilies}>Families</button>
          <button className="t-label" onClick={catMaternity} aria-pressed={isCatMaternity} style={tabMaternity}>Maternity</button>
          <button className="t-label" onClick={catCouples} aria-pressed={isCatCouples} style={tabCouples}>Couples &amp; Individuals</button>
        </div>
        <p className="t-small" style={css(`text-align:center;margin:var(--space-16) 0 clamp(40px,5vw,60px);color:var(--color-text-tertiary);`)}>{catNote}</p>
        <div ref={gridRef} style={css(`display:grid;grid-template-columns:repeat(${galleryCols},1fr);gap:var(--space-32);`)}>
          {shownSessions.map((s, idx) => (<Fragment key={idx}>
            <button onClick={s.open} type="button" style={css(`display:flex;flex-direction:column;gap:var(--space-8);background:none;border:none;cursor:pointer;padding:0;text-align:left;font:inherit;color:inherit;animation:cardFadeIn .5s ease both;animation-delay:${s.delayMs}ms;`)}>
              <div style={css(`border-radius:var(--radius-none);overflow:hidden;background:var(--color-bg-surface);aspect-ratio:4 / 5;`)}><img src={s.cover} srcSet={cloudinarySrcSet(s.cover, COVER_WIDTHS)} sizes={cloudinarySrcSet(s.cover, COVER_WIDTHS) ? COVER_SIZES_GRID : undefined} alt={s.alt} loading="lazy" style={css(`display:block;width:100%;height:100%;object-fit:cover;`)} /></div>
              <div>
                <p className="t-body">{s.title}</p>
                <p className="t-caption" style={css(`color:var(--color-text-tertiary);`)}>{s.catLabel.toLowerCase()}</p>
              </div>
            </button>
          </Fragment>))}
        </div>
        {hasMore && (<>
          <div style={css(`text-align:center;padding:clamp(36px,5vw,50px) 0 clamp(40px,5vw,60px);`)}>
            <p className="t-caption" style={css(`margin:0 0 var(--space-16);color:var(--color-text-tertiary);`)}>Showing {shownCount} of {totalCount} sessions</p>
            <Button variant="outline" onClick={loadMore}>Load more</Button>
          </div>
        </>)}
        <div style={css(`text-align:center;padding:clamp(70px,9vw,108px) 0 clamp(80px,10vw,120px);`)}>
          <p className="t-h3" style={css(`margin:0 0 var(--space-24);color:var(--color-text-secondary);`)}>Like what you see?</p>
          <Button variant="primary" onClick={navInvest}>View pricing →</Button>
        </div>
      </>)}

    </main>
  );
}
