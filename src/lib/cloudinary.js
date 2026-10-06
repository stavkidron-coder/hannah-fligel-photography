// Cloudinary delivery URLs. Photos are uploaded to galleries/<category>/<album>/<name> (see .claude/skills/cloudinary-upload).
// f_auto,q_auto serves WebP/AVIF at a sensible quality; the width is set per slot so originals are never delivered.
export const CLOUD_NAME = 'yiin88qg';

// Albums already uploaded to Cloudinary, as "<photo folder category>/<album folder>". Remove an entry to fall back to local files.
export const cloudinaryAlbums = new Set([
  'families/baby-ollie',
  'families/weidner-family',
  'maternity/angelica-eric',
  'maternity/mana-chris',
]);

export const isCloudinaryAlbum = (category, folder) => cloudinaryAlbums.has(`${category}/${folder}`);

// Same naming rule as the upload script: "&" -> "AND", anything else outside A-Z a-z 0-9 _ - -> "-".
export const cloudinaryId = (category, folder, basename) =>
  `galleries/${category}/${folder}/${basename.replace(/&/g, 'AND').replace(/[^A-Za-z0-9_-]/g, '-')}`;

export const cloudinaryUrl = (publicId, width) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;

// srcset for a Cloudinary URL built by cloudinaryUrl() (swaps the w_<n> segment); undefined for local images, so callers can spread it safely.
export const cloudinarySrcSet = (url, widths) =>
  typeof url === 'string' && url.includes('res.cloudinary.com') && /[,/]w_\d+(?=\/)/.test(url)
    ? widths.map((w) => `${url.replace(/([,/])w_\d+(?=\/)/, `$1w_${w}`)} ${w}w`).join(', ')
    : undefined;

// Width ladders + `sizes` for each slot (CSS px: session grid is 2 cols max 860px wide, 1 col full width on mobile).
export const TILE_WIDTHS = [600, 900, 1300, 1800];
export const tileSizes = (span) => (span === 2 ? '(max-width: 900px) 100vw, 860px' : '(max-width: 700px) 100vw, (max-width: 900px) 46vw, 430px');
export const COVER_WIDTHS = [400, 700, 1000, 1400];
export const COVER_SIZES_GRID = '(max-width: 980px) 50vw, 360px';
export const COVER_SIZES_MORE = '(max-width: 680px) 100vw, 360px';

// Same URL at another width (a no-op for local images). Used to measure orientation with a tiny download.
export const cloudinaryResize = (url, width) => (typeof url === 'string' ? url.replace(/([,/])w_\d+(?=\/)/, `$1w_${width}`) : url);
