# Hannah Fligel Photography

Website for Hannah Fligel Photography.

## File structure

The site is a single-page app: `index.html` + `support.js` (shared runtime — do
not duplicate its logic). The SPA does client-side hash routing (`#work`,
`#about`, `#work/families`, etc.) for the in-app experience.

Because search engines and social crawlers need a real, crawlable HTML
document per URL — with its own `<title>`, meta description, and canonical
tag, and no visible flash of the homepage before the real content loads — the
top-level routes each get their own **static entry file** alongside
`index.html`:

```
index.html                              /
work/index.html                         /work
about/index.html                        /about
pricing/index.html                      /pricing
contact/index.html                      /contact
work/families/index.html                /work/families
work/maternity/index.html               /work/maternity
work/couples-individuals/index.html     /work/couples-individuals
```

Each entry file:

- Loads the same `/support.js` runtime as `index.html` — no app logic is
  reimplemented per route.
- Is a copy of the same app shell (nav, all page sections, and the
  `Component` class), with only the pre-render `hint-placeholder-val` flags
  for its page flipped so the browser paints the correct view **before**
  JavaScript boots — this is what avoids a flash of the homepage.
- Sets `location.hash` to the matching in-app route (e.g. `#work/families`)
  in an inline script before `support.js` loads, so once React mounts, it
  settles on the same view instead of snapping back to Home.
- Carries its own `<title>`, meta description, canonical tag, and (for
  Pricing and the Work category pages) `Service`/`BreadcrumbList` JSON-LD
  targeting that page's content. The homepage keeps the existing
  `LocalBusiness` JSON-LD.
- Uses root-absolute asset paths (`/images/...`, `/support.js`) so it works
  correctly at any URL depth.

Because the framework (`support.js`) parses the `<x-dc>` template out of the
*current* document, each entry file must contain the full app shell — there's
no way to reference `index.html`'s template remotely. **If you change the
shared nav, page sections, or the `Component` class in `index.html`, copy the
same change into the other seven entry files** (everything outside the
`<head>`'s title/meta/canonical/JSON-LD and the `hint-placeholder-val`
toggles should stay byte-identical across all of them).

`vercel.json` adds rewrites so `/work`, `/about`, `/pricing`, `/contact`,
`/work/families`, `/work/maternity`, and `/work/couples-individuals` resolve
to these files instead of 404ing.

See [ENHANCEMENTS.md](ENHANCEMENTS.md) for known follow-ups and tradeoffs
around this routing setup (hash-in-URL on direct loads, history-based
routing, per-session static pages, etc.).
