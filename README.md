# Hannah Fligel Photography

Vite + React site. This is a faithful port of the original HTML/CSS/JS site, which is preserved at the git tag `original-html-site`.

```
node >= 20.19
npm install
npm run dev      # dev server
npm run build    # production build → dist/
```

- Routing: React Router `HashRouter` (URLs like `/#work/session/heidi-andre`, same as the original). Direct loads of `/about`, `/work/families`, … work through per-route static entry files that `vite.config.js` emits at build time (head tags from `seo/*.html`), with `vercel.json` rewrites.
- App-level state/behavior (hero, testimonials, menu, orientation preloading, contact form) is in `src/hooks/useApp.js` + `useContactForm.js`, mirroring the original single `Component`.
- Inline styles are the original style strings run through `src/lib/css.js` (values unchanged).
- See `IMPROVEMENT-NOTES.md` for things deliberately left alone.
- Docs: `docs/IMPROVEMENT-NOTES.md` (port notes) and `docs/ENHANCEMENTS.md` (historical notes written for the original runtime; some items no longer apply).
