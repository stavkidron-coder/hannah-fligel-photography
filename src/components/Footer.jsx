import { css } from '../lib/css';

export default function Footer() {
  return (
    <footer style={css(`border-top:1px solid var(--color-border-default);`)}>
      <div style={css(`padding:var(--space-32) var(--layout-page-margin);display:flex;flex-wrap:wrap;gap:var(--space-16);align-items:center;justify-content:space-between;`)}>
        <span className="t-label">Hannah Fligel Photography</span>
        <span className="t-label" style={css(`color:var(--color-text-tertiary);`)}>San Diego, CA&nbsp; ·&nbsp;&nbsp;<a href="https://www.instagram.com/hannahfphoto/" target="_blank" rel="noopener noreferrer" style={css(`color:var(--color-text-tertiary);text-decoration:none;display:inline-block;padding:15px 2px;`)}>@hannahfphoto</a></span>
      </div>
    </footer>
  );
}
