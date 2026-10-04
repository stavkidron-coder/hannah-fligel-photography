import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

// The original site shipped one static entry file per top-level route, each
// with its own <head> SEO tags and the initial view preselected through
// window.__dcInitialHash. This plugin emits the same files at build time.
//   [output path, seo/<file>.html, initial hash]
const ENTRIES = [
  ['work', 'work', '#work'],
  ['about', 'about', '#about'],
  ['pricing', 'pricing', '#pricing'],
  ['contact', 'contact', '#contact'],
  ['work/families', 'work-families', '#work/families'],
  ['work/maternity', 'work-maternity', '#work/maternity'],
  ['work/couples-individuals', 'work-couples-individuals', '#work/couples'],
];

const SEO_BLOCK = /<!--seo-->[\s\S]*?<!--\/seo-->/;

function staticRouteEntries() {
  let root = process.cwd();
  return {
    name: 'static-route-entries',
    enforce: 'post',
    configResolved(config) {
      root = config.root;
    },
    generateBundle: { order: 'post', handler(_, bundle) {
      const index = bundle['index.html'];
      if (!index) return;
      const html = String(index.source);
      index.source = html.replace(SEO_BLOCK, (m) => m.replace(/<!--\/?seo-->\n?/g, ''));
      for (const [out, seoFile, hash] of ENTRIES) {
        const seo = fs.readFileSync(path.join(root, 'seo', seoFile + '.html'), 'utf8');
        const page = html
          .replace(SEO_BLOCK, () => seo)
          .replace(/(href|content)="images\//g, '$1="/images/')
          .replace('<script type="module"', `<script>window.__dcInitialHash='${hash}';</script>\n<script type="module"`);
        this.emitFile({ type: 'asset', fileName: `${out}/index.html`, source: page });
      }
    } },
  };
}

export default defineConfig({
  plugins: [staticRouteEntries()],
  oxc: { jsx: { runtime: 'automatic' } },
});
