import { allSessions } from '../data/sessions';

const CATS = ['families', 'maternity', 'couples'];

export function hashFor(page, cat, sessionId) {
  if (page === 'work') {
    if (sessionId) return '#work/session/' + sessionId + (cat && cat !== 'everything' ? '/' + cat : '');
    if (cat && cat !== 'everything') return '#work/' + cat;
    return '#work';
  }
  return '#' + page;
}

// Port of the original `_syncFromHash` parsing (same leniency: unknown
// pages fall back to home, `#investment` aliases pricing, etc.).
export function parseHash(hash) {
  const raw = hash.replace(/^#\/?/, '').split('?')[0].split('&')[0];
  const parts = raw.split('/').filter(Boolean);
  const pages = ['home', 'work', 'about', 'pricing', 'contact'];
  const first = parts[0] === 'investment' ? 'pricing' : parts[0];
  const page = pages.includes(first) ? first : 'home';
  let workCat = 'everything';
  let session = null;
  if (page === 'work' && parts[1]) {
    if (parts[1] === 'session' && parts[2]) {
      const found = allSessions.find((s) => s.id === parts[2]);
      if (found) {
        session = found.id;
        workCat = CATS.includes(parts[3]) ? parts[3] : 'everything';
      }
    } else if (CATS.includes(parts[1])) {
      workCat = parts[1];
    }
  }
  return { page, workCat, session };
}

// Canonical React Router path for a parsed hash.
export function pathFor({ page, workCat, session }) {
  if (page === 'home') return '/';
  if (page !== 'work') return '/' + page;
  if (session) return '/work/session/' + session + (workCat !== 'everything' ? '/' + workCat : '');
  return workCat !== 'everything' ? '/work/' + workCat : '/work';
}

const SHORT_TITLES = {
  home: 'Hannah Fligel Photography — San Diego Couples, Family, Maternity & Newborn Photographer',
  work: 'Portfolio — Couples, Engagement, Maternity & Family Photography in San Diego',
  about: 'About Hannah — San Diego Portrait & Lifestyle Photographer',
  pricing: 'Pricing — San Diego Portrait, Maternity & Family Photography Sessions',
  contact: 'Contact — Book a San Diego Photography Session',
};

// Pages loaded through one of the static entry files (/about, /work/families…)
// used a slightly different title table than index.html did.
const ENTRY_TITLES = {
  home: SHORT_TITLES.home,
  work: 'Portfolio — Couples, Engagement, Maternity & Family Photography in San Diego | Hannah Fligel Photography',
  about: 'About Hannah — San Diego Portrait & Lifestyle Photographer | Hannah Fligel Photography',
  pricing: 'San Diego Photography Pricing — Sessions from $650 | Hannah Fligel Photography',
  contact: 'Contact — Book a San Diego Photography Session | Hannah Fligel Photography',
};

const ENTRY_WORK_CAT_TITLES = {
  families: 'San Diego Family Photographer — Portfolio | Hannah Fligel Photography',
  maternity: 'San Diego Maternity Photographer — Portfolio | Hannah Fligel Photography',
  couples: 'San Diego Couples & Individuals Photographer — Portfolio | Hannah Fligel Photography',
};

export function setTitle(page, sessionId, workCat) {
  const fromEntry = typeof window !== 'undefined' && !!window.__dcInitialHash;
  const titles = fromEntry ? ENTRY_TITLES : SHORT_TITLES;
  let t = titles[page] || titles.home;
  if (fromEntry && page === 'work' && !sessionId && ENTRY_WORK_CAT_TITLES[workCat]) t = ENTRY_WORK_CAT_TITLES[workCat];
  if (page === 'work' && sessionId) {
    const s = allSessions.find((x) => x.id === sessionId);
    if (s && s.title) t = s.title + ' — Hannah Fligel Photography';
  }
  try { document.title = t; } catch (e) {}
}
