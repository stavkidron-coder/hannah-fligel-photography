# Future enhancements

A running list of things considered but intentionally not done yet — with
the reasoning, so a future decision to act (or not) can be made quickly
without re-deriving the analysis.

---

## 1. ~~Hash still shows in the URL on direct page loads~~ — done

**Status: fixed.** Loading `/about` directly now shows a clean `/about` URL
with no `#about` appended, while still landing on the right page with no
homepage flash.

**How:** the bootstrap script in each entry file's `<head>` no longer writes
to `location.hash` (which is what put `#about` in the URL). Instead it sets
a plain variable, `window.__dcInitialHash`, and the app's `_syncFromHash`
routing function falls back to it only when the real `location.hash` is
empty:

```js
const raw = (typeof window !== 'undefined'
  ? (window.location.hash || window.__dcInitialHash || '')
  : '').replace(/^#\/?/, '')...
```

Applied to the same 7 entry files (`work/`, `about/`, `pricing/`,
`contact/`, `work/families/`, `work/maternity/`,
`work/couples-individuals/`).

**Note:** this only cleans up the *initial* URL. Clicking around the site
after landing still only updates the hash, not the path (e.g. from `/about`,
clicking "Pricing" shows `/about#pricing`, not `/pricing`) — that's expected,
and is the separate, bigger item below (#2).

---

## 2. Full switch from hash routing to History API (pushState) routing

**What it would buy:** URLs always match what's on screen during in-app
navigation (`/pricing` instead of `/#pricing`, `/about#pricing` never
happens), cleaner shareable links mid-session, slightly better URL hygiene
for browser history.

**What it costs:**
- Every `window.location.hash = ...` call (`go()`, `_setCat()`,
  `openSession()`, `closeSession()`) becomes `history.pushState(...)` plus a
  manual re-render trigger and a `popstate` listener — hash changes fire
  their own browser event for free; pushState doesn't.
- `_syncFromHash` becomes `_syncFromPath`, parsing `location.pathname`
  instead — including re-mapping session deep links
  (`/work/session/<id>/<cat>`).
- **Server-side support becomes mandatory.** With hash routing, any path the
  server doesn't know about is harmless (the hash is client-only). With real
  path routing, every reachable client route needs the server to return some
  HTML for it — a catch-all Vercel rewrite (`/work/**` → `index.html`) at
  minimum, or a static file per route/session.
- No routing library is doing this for us — this is a hand-rolled framework,
  so it's a genuine rewrite of the navigation layer, not a config flip.

**Verdict (as of this writing):** not worth it on its own. It's mostly
cosmetic for a 5-section marketing site. Revisit if either (a) mid-session
link sharing becomes a real, frequent use case, or (b) the site grows enough
in scope that clean URLs throughout start mattering for its own sake.

---

## 3. Individual session pages aren't statically generated (biggest SEO/sharing gap)

**What happens today:** only the 8 top-level routes (`/work`, `/about`,
`/pricing`, `/contact`, and the 3 Work categories) got real static HTML entry
files with their own title/meta/canonical/JSON-LD. Every individual session —
`/work/session/amit-nate`, `/work/session/heidi-andre`, etc. — is still
hash-only (`#work/session/amit-nate`).

**Concrete impact:**
- Sharing a direct link to one session (Instagram, text, email) shows the
  *generic* homepage preview card (title/image) in link unfurls, not that
  session's own photo and title — most link-preview bots don't execute JS or
  read past the `#`.
- Google doesn't index individual sessions as separate pages, so a search for
  a specific client/style/location won't surface that gallery specifically —
  only the general Work portfolio.
- This is independent of the hash-vs-history decision above — it's really
  "do individual sessions get the same static-entry treatment the top-level
  pages just got," which is a bigger version of the same problem, since
  there are dozens of sessions (one file each) rather than 8.

**Fix, if wanted:** extend the same static-entry-file generation approach
used for the 8 top-level routes to every session — each with its own
title/OG image/canonical pointing at that session's cover photo. Would need
either a build step (since sessions are added over time) or periodic
regeneration when new sessions are added.

**Verdict:** worth doing if being found/shared for *specific* sessions
matters to the business (e.g. a past client searching for their own
gallery, or session-specific social shares). Skippable if the 8 top-level
pages are considered "the public face" of the site for search/sharing
purposes.

---

## 4. Manual duplication tax for any new top-level page

**What happens today:** because this framework (`support.js`) parses its
app template out of whatever document it's running in, each new top-level
route needs its own full copy of the shared nav/page markup and the
`Component` class — see [README.md](README.md). Adding a new section (e.g.
a Blog, Testimonials page, new service category) means hand-creating another
entry file plus a new `vercel.json` rewrite, following the existing pattern.

**Fix, if wanted:** none available within this framework as-is — this is
inherent to how `support.js` boots (it parses the current document only, no
template-sharing mechanism). A pushState migration (#2) with a catch-all
rewrite would reduce *some* of this (fewer explicit rewrite entries needed),
but the per-route HTML shell duplication for pre-JS SEO content would remain
either way.

**Verdict:** not a "fix" so much as a known ongoing cost of this
architecture — mention it here so it doesn't come as a surprise next time a
page gets added.

---

## 5. Analytics not yet hash-aware (minor)

If/when page-view analytics (e.g. GA4) get added, hash-based route changes
need to be explicitly configured as virtual pageviews — they aren't tracked
automatically the way real path changes are. Small one-time setup item,
not a structural concern.
