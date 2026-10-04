import { createContext, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { heroSlides, testimonialsData, teaserPhotos } from '../data/content';
import { allSessions } from '../data/sessions';
import { heroIntervalSec, batchSize } from '../config';
import { hashFor, parseHash, setTitle } from '../lib/routes';
import { useContactForm } from './useContactForm';

export const AppContext = createContext(null);

// All app-level state and behavior, ported from the original `Component`
// class. State (hero slide, testimonial, load-more counts, contact form…)
// lives here rather than in the pages so it persists across navigation just
// as it did in the original single component.
export function useApp() {
  useLocation(); // re-render when the hash changes (HashRouter)
  const hash = window.location.hash || window.__dcInitialHash || '';
  const route = useMemo(() => parseHash(hash), [hash]);
  const [tick, setTick] = useState(0);

  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHero, setActiveHero] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonialFading, setTestimonialFading] = useState(false);
  const [visibleCount, setVisibleCount] = useState({});
  const [animTick, setAnimTick] = useState(0);
  const contact = useContactForm();

  const reducedMotion = useRef(false);
  const heroTimer = useRef(null);
  const heroQuick = useRef(false);
  const touch = useRef(null);
  const testimonialTimer = useRef(null);
  const testimonialFade = useRef(null);
  const gridRef = useRef(null);
  const menuEl = useRef(null);
  const menuButton = useRef(null);
  const prevOverflow = useRef(null);
  const inerted = useRef(null);
  const onDocMenuKey = useRef(null);
  const focusMenuButton = useRef(false);
  const orientationCache = useRef({});
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // Latest-value mirrors for handlers that read "current state" imperatively.
  const live = useRef({});
  live.current = { activeHero, heroPaused, menuOpen };

  /* ---------- orientation preloading ---------- */
  const ensureOrientations = useCallback((photos) => {
    const cache = orientationCache.current;
    const missing = photos.filter((src) => !(src in cache));
    if (!missing.length) return;
    let remaining = missing.length;
    const done = () => { remaining--; if (remaining === 0) forceUpdate(); };
    missing.forEach((src) => {
      const img = new Image();
      img.onload = () => { cache[src] = img.naturalWidth > img.naturalHeight; done(); };
      img.onerror = () => { cache[src] = false; done(); };
      img.src = encodeURI(src);
    });
  }, []);

  /* ---------- mobile menu ---------- */
  const menuFocusables = () => {
    const el = menuEl.current;
    if (!el) return [];
    return Array.prototype.slice.call(el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter((n) => !n.disabled && n.offsetParent !== null);
  };

  const unlockForMenu = () => {
    try { document.body.style.overflow = prevOverflow.current || ''; } catch (e) {}
    prevOverflow.current = null;
    if (inerted.current) {
      inerted.current.forEach((n) => { try { n.inert = false; n.removeAttribute('aria-hidden'); } catch (e) {} });
      inerted.current = null;
    }
    if (onDocMenuKey.current) {
      document.removeEventListener('keydown', onDocMenuKey.current, true);
      onDocMenuKey.current = null;
    }
  };

  const closeMenu = () => {
    focusMenuButton.current = true;
    setMenuOpen(false);
  };
  const closeMenuRef = useRef(closeMenu);
  closeMenuRef.current = closeMenu;

  const lockForMenu = () => {
    try {
      if (prevOverflow.current == null) prevOverflow.current = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';
    } catch (e) {}
    try {
      inerted.current = Array.prototype.slice.call(document.querySelectorAll('nav, main, footer'));
      inerted.current.forEach((n) => { n.inert = true; n.setAttribute('aria-hidden', 'true'); });
    } catch (e) { inerted.current = []; }
    let tries = 0;
    const grab = () => {
      if (!live.current.menuOpen) return;
      const items = menuFocusables();
      const target = items[0] || menuEl.current;
      if (target && target.focus) { try { target.focus(); } catch (e) {} }
      const landed = menuEl.current && menuEl.current.contains(document.activeElement);
      if (!landed && tries++ < 12) requestAnimationFrame(grab);
    };
    requestAnimationFrame(grab);
    if (!onDocMenuKey.current) {
      onDocMenuKey.current = (e) => {
        if (e.key === 'Escape' && live.current.menuOpen) { e.preventDefault(); closeMenuRef.current(); }
      };
      document.addEventListener('keydown', onDocMenuKey.current, true);
    }
  };

  const onMenuKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const items = menuFocusables();
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !menuEl.current.contains(active))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  };

  const toggleMenu = () => setMenuOpen((o) => !o);

  useEffect(() => {
    if (menuOpen) {
      lockForMenu();
    } else {
      unlockForMenu();
      if (focusMenuButton.current) {
        focusMenuButton.current = false;
        const b = menuButton.current;
        if (b && b.focus) { try { b.focus(); } catch (e) {} }
      }
    }
  }, [menuOpen]);

  /* ---------- hero carousel ---------- */
  const startAutoRotate = () => {
    clearInterval(heroTimer.current);
    heroTimer.current = setInterval(() => {
      heroQuick.current = false;
      setActiveHero((a) => (a + 1) % heroSlides.length);
    }, Math.max(1500, heroIntervalSec * 1000));
  };
  const stopAutoRotate = () => {
    clearInterval(heroTimer.current);
    heroTimer.current = null;
  };
  const pauseHero = () => { stopAutoRotate(); setHeroPaused(true); };
  const resumeHero = () => {
    if (reducedMotion.current) return;
    startAutoRotate();
    setHeroPaused(false);
  };
  const toggleHero = () => { if (live.current.heroPaused) resumeHero(); else pauseHero(); };
  const goToHero = (i, quick) => {
    stopAutoRotate();
    heroQuick.current = !!quick;
    setActiveHero(i);
    if (!reducedMotion.current && !live.current.heroPaused) startAutoRotate();
  };
  const heroTouchStart = (e) => {
    const t = e.touches && e.touches[0];
    touch.current = t ? { x: t.clientX, y: t.clientY } : null;
  };
  const heroTouchEnd = (e) => {
    const s = touch.current; touch.current = null;
    const t = e.changedTouches && e.changedTouches[0];
    if (!s || !t) return;
    const dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    const n = heroSlides.length;
    goToHero((live.current.activeHero + (dx < 0 ? 1 : -1) + n) % n, true);
  };

  /* ---------- testimonials ---------- */
  const advanceTestimonial = (toIndex) => {
    setTestimonialFading(true);
    clearTimeout(testimonialFade.current);
    testimonialFade.current = setTimeout(() => {
      setActiveTestimonial((a) => toIndex ?? (a + 1) % testimonialsData.length);
      setTestimonialFading(false);
    }, 400);
  };
  const selectTestimonial = (i) => {
    advanceTestimonial(i);
    if (testimonialTimer.current) {
      clearInterval(testimonialTimer.current);
      testimonialTimer.current = setInterval(() => advanceTestimonial(), 6000);
    }
  };

  /* ---------- card animation restart ---------- */
  const restartCardAnim = () => {
    const el = gridRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(':scope > button');
    cards.forEach((c) => { c.style.animation = 'none'; });
    void el.offsetWidth;
    cards.forEach((c, i) => { c.style.animation = `cardFadeIn .5s ease ${Math.min(i, 12) * 45}ms both`; });
  };

  /* ---------- lifecycle (componentDidMount / WillUnmount) ---------- */
  useEffect(() => {
    reducedMotion.current = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion.current) {
      setHeroPaused(true);
    } else {
      startAutoRotate();
    }
    const onResize = () => {
      const w = window.innerWidth;
      if (w > 680 && live.current.menuOpen) { closeMenuRef.current(); }
      setWidth(w);
    };
    window.addEventListener('resize', onResize);
    ensureOrientations(teaserPhotos);
    if (!reducedMotion.current) {
      testimonialTimer.current = setInterval(() => advanceTestimonial(), 6000);
    }
    return () => {
      clearInterval(heroTimer.current);
      clearInterval(testimonialTimer.current);
      clearTimeout(testimonialFade.current);
      window.removeEventListener('resize', onResize);
      try { document.body.style.overflow = prevOverflow.current || ''; } catch (e) {}
    };
  }, []);

  /* ---------- route sync (the original `_syncFromHash`) ---------- */
  const { page, workCat, session } = route;
  useLayoutEffect(() => {
    if (session) ensureOrientations(allSessions.find((s) => s.id === session).photos);
    setMenuOpen(false);
    try { window.scrollTo(0, 0); } catch (e) {}
  }, [hash, tick]);
  useEffect(() => {
    setTitle(page, session, workCat);
    unlockForMenu();
    requestAnimationFrame(() => restartCardAnim());
  }, [hash, tick]);
  useEffect(() => {
    if (animTick) requestAnimationFrame(() => restartCardAnim());
  }, [animTick]);

  /* ---------- navigation ---------- */
  const go = (p) => {
    const target = hashFor(p);
    if (window.location.hash === target) setTick((t) => t + 1); else window.location.hash = target;
  };
  const setCat = (cat) => { window.location.hash = hashFor('work', cat); };
  const openSession = (s) => {
    window.location.hash = hashFor('work', workCat, s.id);
    ensureOrientations(s.photos);
    try { window.scrollTo(0, 0); } catch (e) {}
  };
  const closeSession = () => { window.location.hash = hashFor('work', workCat); };
  const loadMore = () => {
    setVisibleCount((v) => ({ ...v, [workCat]: (v[workCat] || batchSize) + batchSize }));
    setAnimTick((t) => t + 1);
  };

  return {
    route, page, workCat, session, width,
    menuOpen, toggleMenu, closeMenu, onMenuKeyDown, menuEl, menuButton,
    activeHero, heroPaused, heroQuick, goToHero, toggleHero, heroTouchStart, heroTouchEnd,
    activeTestimonialIndex: activeTestimonial, testimonialFading, selectTestimonial,
    visibleCount, loadMore, gridRef,
    orientationCache: orientationCache.current, ensureOrientations,
    go, setCat, openSession, closeSession,
    contact,
  };
}
