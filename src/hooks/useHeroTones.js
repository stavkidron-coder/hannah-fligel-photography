import { useEffect, useState } from 'react';

// Decides, per hero slide, whether the desktop slide controls should be drawn
// light or dark so they stay legible over whatever part of the photo sits
// behind them. Each image is sampled once into a small canvas; the region
// under the controls is then mapped through the same `cover` + position
// math the hero background uses, so it tracks the viewport size.
const THUMB_W = 160;
const LIGHT = 0.92; // relative luminance of #FAF6EF
// Light is the house style for the controls, so it's kept unless the photo behind
// is bright enough that cream would nearly vanish (contrast ratio below this).
const MIN_LIGHT_CONTRAST = 1.5;

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };

function loadThumb(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = THUMB_W, h = Math.max(1, Math.round(THUMB_W * img.naturalHeight / img.naturalWidth));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      try { resolve({ w, h, iw: img.naturalWidth, ih: img.naturalHeight, data: ctx.getImageData(0, 0, w, h).data }); }
      catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = encodeURI(src);
  });
}

function toneFor(thumb, pos, vw, vh) {
  if (!thumb) return 'light';
  const [, py = '50%'] = pos.split(' ');
  const posY = parseFloat(py) / 100;
  const scale = Math.max(vw / thumb.iw, vh / thumb.ih);
  const ox = (vw - thumb.iw * scale) / 2, oy = (vh - thumb.ih * scale) * posY;
  // Controls column: right edge, from 27% down, ~190px tall.
  const x0 = vw - 84, x1 = vw - 16, y0 = vh * 0.27 - 10, y1 = vh * 0.27 + 190;
  let sum = 0, n = 0;
  for (let i = 0; i <= 6; i++) {
    for (let j = 0; j <= 12; j++) {
      const vx = x0 + (x1 - x0) * i / 6, vy = y0 + (y1 - y0) * j / 12;
      const tx = Math.min(thumb.w - 1, Math.max(0, Math.round(((vx - ox) / scale) * thumb.w / thumb.iw)));
      const ty = Math.min(thumb.h - 1, Math.max(0, Math.round(((vy - oy) / scale) * thumb.h / thumb.ih)));
      const k = (ty * thumb.w + tx) * 4;
      sum += 0.2126 * lin(thumb.data[k]) + 0.7152 * lin(thumb.data[k + 1]) + 0.0722 * lin(thumb.data[k + 2]);
      n++;
    }
  }
  const L = sum / n;
  return (LIGHT + 0.05) / (L + 0.05) < MIN_LIGHT_CONTRAST ? 'dark' : 'light';
}

export function useHeroTones(slides, width) {
  const [thumbs, setThumbs] = useState([]);
  const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 900);

  useEffect(() => {
    let alive = true;
    Promise.all(slides.map((s) => loadThumb(s.src))).then((t) => { if (alive) setThumbs(t); });
    return () => { alive = false; };
  }, [slides]);

  useEffect(() => {
    const onResize = () => setHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return slides.map((s, i) => toneFor(thumbs[i], s.pos, width, Math.max(560, height)));
}
