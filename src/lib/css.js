// The original markup styles nearly everything with inline `style="..."`
// strings. This turns those strings into React style objects without
// altering any property or value (declaration order is preserved).
const cache = new Map();

export function css(str) {
  const hit = cache.get(str);
  if (hit) return hit;
  const out = {};
  for (const decl of str.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    if (!prop) continue;
    const key = prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = decl.slice(i + 1).trim();
  }
  cache.set(str, out);
  return out;
}
