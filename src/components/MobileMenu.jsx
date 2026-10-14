import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { NAV_PHONE_H } from './NavEditorial';
import Button from './Button';
import { inboxEmail } from '../config';

// Phone menu (Figma "Nav / Mobile", menu open). The nav bar stays on top and turns its hamburger into an X; this sheet fills the screen beneath it.
const LINKS = [['Home', 'home'], ['Work', 'work'], ['About', 'about'], ['Pricing', 'pricing'], ['Contact', 'contact']];

export default function MobileMenu() {
  const { page, menuOpen, onMenuKeyDown, menuEl: menuRef, go } = useContext(AppContext);
  if (!menuOpen) return null;
  return (
    <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" tabIndex="-1" ref={menuRef} onKeyDown={onMenuKeyDown} style={css(`position:fixed;inset:0;z-index:60;box-sizing:border-box;background:var(--color-bg-page);display:flex;flex-direction:column;padding:calc(${NAV_PHONE_H} + var(--space-24)) var(--layout-page-margin) max(var(--space-32),env(safe-area-inset-bottom));overflow-y:auto;`)}>
      <nav aria-label="Site">
        {LINKS.map(([label, key]) => (
          <button key={key} onClick={() => go(key)} aria-current={page === key ? 'page' : undefined} style={css(`display:block;background:none;border:none;cursor:pointer;padding:0;margin:0 0 var(--space-4);min-height:44px;text-align:left;font-family:var(--font-display);font-weight:400;font-size:40px;line-height:1.25;letter-spacing:-.005em;color:var(--color-text-primary);${page === key ? 'text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:8px;' : ''}`)}>{label}</button>
        ))}
      </nav>
      <div style={css(`margin-top:auto;padding-top:var(--space-32);display:flex;flex-direction:column;gap:var(--space-24);`)}>
        <Button variant="primary" onClick={() => go('contact')} style={css(`width:100%;`)}>Book a session</Button>
        <div style={css(`display:flex;flex-direction:column;gap:var(--space-4);`)}>
          <a className="t-small" href="https://www.instagram.com/hannahfphoto/" target="_blank" rel="noopener noreferrer" style={css(`color:var(--color-text-tertiary);text-decoration:none;padding:var(--space-8) 0;`)}>@hannahfphoto</a>
          <a className="t-small" href={`mailto:${inboxEmail}`} style={css(`color:var(--color-text-tertiary);text-decoration:none;padding:var(--space-8) 0;`)}>{inboxEmail}</a>
        </div>
      </div>
    </div>
  );
}
