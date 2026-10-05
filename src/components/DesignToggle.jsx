import { useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';

const BTN = css(`border:none;cursor:pointer;border-radius:999px;padding:7px 14px;font-family:inherit;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;transition:background .3s,color .3s;`);

// Temporary review control: flips between the original hero/nav and the Figma "editorial" version.
export default function DesignToggle() {
  const { design, setDesign } = useContext(AppContext);
  const opts = [['classic', 'Classic'], ['editorial', 'Editorial']];
  return (
    <div role="group" aria-label="Hero and nav design" style={css(`position:fixed;left:16px;bottom:16px;z-index:200;display:flex;padding:3px;border-radius:999px;background:rgba(46,42,36,0.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:'Mulish',sans-serif;`)}>
      {opts.map(([key, label]) => (
        <button key={key} onClick={() => setDesign(key)} aria-pressed={design === key} style={{ ...BTN, background: design === key ? '#F1EBE1' : 'transparent', color: design === key ? '#2E2A24' : '#F1EBE1' }}>{label}</button>
      ))}
    </div>
  );
}
