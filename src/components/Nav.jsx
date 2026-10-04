import { Fragment, useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';

export default function Nav() {
  const { page, width, menuOpen, toggleMenu, menuButton: menuButtonRef, go } = useContext(AppContext);
  const isMobile = width <= 680;
  const isHome = page === 'home', isWork = page === 'work', isAbout = page === 'about', isInvest = page === 'pricing', isContact = page === 'contact';
  const navHome = () => go('home'), navWork = () => go('work'), navAbout = () => go('about'), navInvest = () => go('pricing'), navContact = () => go('contact');
  return (
    <nav style={css(`position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:13px clamp(24px,5vw,56px);background:rgba(241,235,225,0.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line);`)}>
      <button onClick={navHome} style={css(`background:none;border:none;cursor:pointer;padding:6px 0;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:22px;letter-spacing:.02em;color:var(--ink);white-space:nowrap;`)}>Hannah Fligel</button>
      {isMobile && (<>
        <button onClick={toggleMenu} aria-label="Menu" aria-haspopup="dialog" aria-controls="mobile-menu" aria-expanded={menuOpen} ref={menuButtonRef} style={css(`background:none;border:none;cursor:pointer;padding:10px;margin:-10px;width:44px;height:44px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;`)}>
          <span style={css(`display:block;width:24px;height:1.5px;background:var(--ink);`)}></span>
          <span style={css(`display:block;width:24px;height:1.5px;background:var(--ink);`)}></span>
          <span style={css(`display:block;width:24px;height:1.5px;background:var(--ink);`)}></span>
        </button>
      </>)}
      {!isMobile && (<>
      <div style={css(`display:flex;align-items:center;gap:clamp(20px,3vw,40px);`)}>
        <button onClick={navHome} style={css(`background:none;border:none;cursor:pointer;padding:8px 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);position:relative;`)}>Home{isHome && (<><span style={css(`position:absolute;left:0;right:0;bottom:-4px;height:1px;background:var(--muted);`)}></span></>)}</button>
        <button onClick={navWork} style={css(`background:none;border:none;cursor:pointer;padding:8px 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);position:relative;`)}>Work{isWork && (<><span style={css(`position:absolute;left:0;right:0;bottom:-4px;height:1px;background:var(--muted);`)}></span></>)}</button>
        <button onClick={navAbout} style={css(`background:none;border:none;cursor:pointer;padding:8px 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);position:relative;`)}>About{isAbout && (<><span style={css(`position:absolute;left:0;right:0;bottom:-4px;height:1px;background:var(--muted);`)}></span></>)}</button>
        <button onClick={navInvest} style={css(`background:none;border:none;cursor:pointer;padding:8px 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);position:relative;`)}>Pricing{isInvest && (<><span style={css(`position:absolute;left:0;right:0;bottom:-4px;height:1px;background:var(--muted);`)}></span></>)}</button>
        <button onClick={navContact} style={css(`background:none;border:none;cursor:pointer;padding:8px 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);position:relative;`)}>Contact{isContact && (<><span style={css(`position:absolute;left:0;right:0;bottom:-4px;height:1px;background:var(--muted);`)}></span></>)}</button>
      </div>
      </>)}
    </nav>
  );
}
