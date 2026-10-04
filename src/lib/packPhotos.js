// Ported unchanged from the original `_packPhotos`.
export function packPhotos(photos, rowWidth, cache) {
  const list = photos.map((src) => ({ src, span: cache[src] ? Math.min(2, rowWidth) : 1 }));
  const out = [];
  let rowSize = 0;
  while (list.length) {
    const cur = list[0];
    if (rowSize + cur.span <= rowWidth) {
      out.push(cur); list.shift(); rowSize += cur.span;
      if (rowSize >= rowWidth) rowSize = 0;
    } else {
      const j = list.findIndex((x, idx) => idx > 0 && x.span <= rowWidth - rowSize);
      if (j !== -1) {
        const item = list[j];
        out.push(item); list.splice(j, 1); rowSize += item.span;
        if (rowSize >= rowWidth) rowSize = 0;
      } else {
        if (rowSize > 0 && out.length) {
          const last = out[out.length - 1];
          out[out.length - 1] = { ...last, span: last.span + (rowWidth - rowSize) };
          rowSize = 0;
        } else {
          out.push(cur); list.shift(); rowSize = 0;
        }
      }
    }
  }
  let sum = 0, rowStartIdx = 0;
  for (let i = 0; i < out.length; i++) {
    sum += out[i].span;
    if (sum >= rowWidth) { sum = 0; rowStartIdx = i + 1; }
  }
  if (sum !== 0 && out.length - rowStartIdx === 1 && !(out[out.length - 1].src && out[out.length - 1].src.__filler)) {
    out[out.length - 1] = { ...out[out.length - 1], span: rowWidth };
  }
  return out;
}
