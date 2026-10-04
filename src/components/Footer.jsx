import { css } from '../lib/css';

export default function Footer() {
  return (
    <footer style={css(`border-top:1px solid var(--line);`)}>
      <div style={css(`max-width:1180px;margin:0 auto;padding:30px clamp(24px,5vw,56px);display:flex;flex-wrap:wrap;gap:14px;align-items:baseline;justify-content:space-between;`)}>
        <span style={css(`font-family:'Cormorant Garamond',serif;font-weight:500;font-size:18px;color:var(--ink);`)}>Hannah Fligel Photography</span>
        <span style={css(`font-family:'Mulish',sans-serif;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);`)}>San Diego, CA&nbsp; ·&nbsp;&nbsp;<a href="https://www.instagram.com/hannahfphoto/" target="_blank" rel="noopener noreferrer" style={css(`color:var(--muted);text-decoration:none;display:inline-block;padding:15px 2px;`)}>@hannahfphoto</a></span>
      </div>
    </footer>
  );
}
