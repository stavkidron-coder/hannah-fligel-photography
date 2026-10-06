import { Fragment, useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';

export default function Nav() {
  const { page, width, menuOpen, toggleMenu, menuButton: menuButtonRef, go } = useContext(AppContext);
  const isMobile = width <= 680;
  const isHome = page === 'home', isWork = page === 'work', isAbout = page === 'about', isInvest = page === 'pricing', isContact = page === 'contact';
  const navHome = () => go('home'), navWork = () => go('work'), navAbout = () => go('about'), navInvest = () => go('pricing'), navContact = () => go('contact');
  if (!isMobile) {
    // Desktop: transparent nav that fades out of the page colour (Figma "Nav").
    // It keeps its 94px of layout height; the 235px gradient overhangs the content below.
    const links = [['Home', navHome, isHome], ['Work', navWork, isWork], ['About', navAbout, isAbout], ['Pricing', navInvest, isInvest], ['Contact', navContact, isContact]];
    const letter = (ch, left, top) => (<span aria-hidden="true" style={{ position: 'absolute', left, top, transform: 'translateX(-50%)' }}>{ch}</span>);
    return (
      <nav style={css(`position:sticky;top:0;z-index:50;height:94px;pointer-events:none;`)}>
        <div aria-hidden="true" style={css(`position:absolute;top:0;left:0;right:0;height:235px;background:linear-gradient(to bottom,#F1EBE1 0%,rgba(241,235,225,0.25) 65.385%,rgba(241,235,225,0) 100%);`)}></div>
        <div style={css(`position:relative;display:flex;align-items:flex-start;justify-content:space-between;padding:17px 56px;`)}>
          <button onClick={navHome} aria-label="Hannah Fligel Photography – Home" style={css(`pointer-events:auto;position:relative;flex:none;width:60px;height:60px;padding:0;cursor:pointer;overflow:hidden;background:rgba(255,255,255,0.01);border:1px solid var(--soft);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 0 60px 30px rgba(250,246,239,0.3),inset 0 0 60px 30px rgba(250,246,239,0.3);font-family:'Cormorant Garamond',serif;font-weight:700;font-size:22px;letter-spacing:.44px;color:var(--ink);`)}>
            {letter('H', 16.5, 4)}{letter('F', 43, 9)}{letter('P', 28.5, 26)}
          </button>
          <div style={css(`pointer-events:auto;display:flex;align-items:center;gap:42px;`)}>
            {links.map(([label, onClick, active]) => (
              <button key={label} onClick={onClick} aria-current={active ? 'page' : undefined} style={css(`background:none;border:none;cursor:pointer;padding:8px 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);position:relative;`)}>{label}{active && (<span style={css(`position:absolute;left:0;right:0;bottom:-3px;height:1px;background:var(--ink);`)}></span>)}</button>
            ))}
          </div>
        </div>
      </nav>
    );
  }
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
