import { cloudinarySrcSet, TILE_WIDTHS, tileSizes } from '../lib/cloudinary';
export function skeletonTile(key) {
  return (
    <div
      key={key}
      style={{
        borderRadius: '2px', aspectRatio: '4 / 5',
        background: 'var(--ph1)',
        animation: 'skeletonPulse 1.6s ease-in-out infinite',
      }}
    />
  );
}

export function sessionPhotoTile(src, span, i, label) {
  if (src && src.__filler) {
    return <div key={src.key} style={{ gridColumn: `span ${span}` }} />;
  }
  const style = {
    borderRadius: '2px', overflow: 'hidden', background: 'var(--paper)', gridColumn: span ? `span ${span}` : 'auto',
    animation: `cardFadeIn .5s ease ${Math.min(i || 0, 12) * 45}ms both`,
  };
  const alt = label ? `${label}, photo ${(i || 0) + 1}` : '';
  return (
    <div key={src} style={style}>
      <img
        src={encodeURI(src)} srcSet={cloudinarySrcSet(encodeURI(src), TILE_WIDTHS)} sizes={cloudinarySrcSet(src, TILE_WIDTHS) ? tileSizes(span) : undefined} alt={alt} loading="lazy"
        style={{ display: 'block', width: '100%', height: span === undefined ? 'auto' : '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
