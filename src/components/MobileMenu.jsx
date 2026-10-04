import { Fragment, useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { layoutFor } from '../lib/layout';

export default function MobileMenu() {
  const { width, menuOpen, closeMenu, onMenuKeyDown, menuEl: menuRef, go } = useContext(AppContext);
  const { navLinkMobile } = layoutFor(width);
  const navHome = () => go('home'), navWork = () => go('work'), navAbout = () => go('about'), navInvest = () => go('pricing'), navContact = () => go('contact');
  return (
    <>
        {menuOpen && (<>
          <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" tabIndex="-1" ref={menuRef} onKeyDown={onMenuKeyDown} style={css(`position:fixed;inset:0;z-index:60;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;`)}>
            <button onClick={closeMenu} aria-label="Close menu" style={css(`position:absolute;top:18px;right:clamp(24px,5vw,56px);background:none;border:none;cursor:pointer;padding:10px;width:44px;height:44px;color:#FBF8F2;font-size:26px;line-height:1;`)}>×</button>
            <button onClick={navHome} style={navLinkMobile}>Home</button>
            <button onClick={navWork} style={navLinkMobile}>Work</button>
            <button onClick={navAbout} style={navLinkMobile}>About</button>
            <button onClick={navInvest} style={navLinkMobile}>Pricing</button>
            <button onClick={navContact} style={navLinkMobile}>Contact</button>
          </div>
        </>)}
    </>
  );
}
