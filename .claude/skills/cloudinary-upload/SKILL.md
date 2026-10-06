---
name: cloudinary-upload
description: Upload Hannah Fligel Photography albums from the Pic-Time exports to Cloudinary (match to the photos on the site, resize, upload, verify), and keep the Cloudinary folder structure, tags and manifests consistent. Works for albums already on the site and for brand-new albums/categories that are not on the site yet. Use whenever the user adds a new album folder to "PicTime Photos/full-size", asks to upload/migrate photos to Cloudinary, asks about the Cloudinary folder structure, or wants a gallery on the site switched to Cloudinary URLs.
---

# Cloudinary uploads for the HFP site

## Where things live
- Pic-Time exports (user adds these): `/Users/stavkidron/Desktop/HFP Website/PicTime Photos/full-size/<album>/` (full-res, ~4-6MB, up to 30MP).
- Upload script (outside git on purpose, it holds the unsigned preset name): `/Users/stavkidron/Desktop/HFP Website/PicTime Photos/upload-album.sh`
- Manifests written by the script: `PicTime Photos/manifests/<category>-<album>.tsv` (site filename, Cloudinary public ID).
- Site repo: `/Users/stavkidron/Desktop/HFP Website/hannah-fligel-photography` (photos currently in `public/images/<category>/<album>/`).
- Cloudinary cloud name: `yiin88qg` (Free plan, 25 credits/month). The Cloudinary connector MCP tools are used for checks (list-images, get-usage-details, create-folder, delete-asset...). Never put the preset name in the repo, in chat summaries, or in this file.

## Folder structure in Cloudinary (no root folder)
```
galleries/<category>/<album>/<photo>      category = families | maternity | portraits (add weddings, engagements... when they exist)
site/about | site/brand | site/video      for non-gallery assets (not created yet)
```
- Public ID = `galleries/<category>/<album>/<filename-without-extension>`, e.g. `galleries/maternity/angelica-eric/AANDE-Maternity176`.
- Tags on every photo: `<category>`, `<album>`. Hero / featured / cover photos are marked with extra TAGS (`hero`, `featured`, `cover`), never duplicated into separate folders.
- Filename rules: `&` becomes `AND`; any other character outside A-Z a-z 0-9 _ - becomes `-` in the ID (spaces, parentheses, #, dots). Album slug = the slug the site already uses (for existing albums).

## Upload an album (the normal flow)
1. User adds `full-size/<album>/` (Pic-Time export). Confirm the folder exists and the album slug equals the site's folder name under `public/images/<category>/`.
2. Dry run first:
   `cd "/Users/stavkidron/Desktop/HFP Website/PicTime Photos" && ./upload-album.sh <category> <album> --dry-run`
   Check `wanted` equals `matched` and `unmatched=0`. The script matches the filenames on the site (default) against full-size/. If unmatched files are listed, STOP and tell the user (different naming in Pic-Time, photo missing from the export).
3. Optionally spot-check that matched files are the same photos: compare tiny thumbnails (sips -z 24 16 -s format bmp, mean pixel difference should be < ~5/255). Name matches have been correct for every album so far.
4. Real run (the user asked for the upload, so this is authorised): same command without `--dry-run`. Takes ~1-3 minutes for ~50-100 photos; run it in the background for big albums. It resizes to a long edge of 3600px (JPEG q85) in a temp folder (auto-deleted), uploads, skips photos already in Cloudinary (safe to re-run).
5. Verify: connector `list-images` with `type: "upload"` (required!) and `prefix: "galleries/<category>/<album>/"`; counts must equal the manifest. Optionally curl a delivery URL.
6. Report: counts, size, anything unmatched/failed. Update the "Status" list below.
Pic-Time folder names often differ from the site slug (e.g. `McClintock2026` is the site's `mana-chris`): pass `--from <folder under full-size/>`; the site slug is `<album>`. Match them by the photo filename prefix in `src/data/sessions.js` (the `prefix` argument of `session()`). Verifying big albums: `list-images` output is huge (~25K tokens for 80 photos); prefer checking the manifest with HEAD requests or a count, and use list-images only with a small `max_results`.
Other options: `--src DIR` (read from another folder than full-size/, e.g. the site's compressed copies), `--dest FOLDER` (Cloudinary folder other than galleries/<category>/<album>, e.g. `site/hero`; use with `--all`), `--tag T` (extra tag), `--list FILE` (only the filenames in FILE), `--all` (every photo in full-size/<album>, for albums not yet on the site).

## Brand-new album (not on the site yet)
The default mode matches the photos the site already shows, so a new album has no site folder to match. Use `--all` (every photo in the export) or `--list FILE` (a curated subset, one filename per line, as named in full-size/).
1. Ask the user: (a) category (families | maternity | portraits | a new one like weddings) and album slug (lowercase-with-dashes, becomes the folder name), (b) all photos or a chosen subset (a curated list of photo numbers/names is cheaper: ~2MB per photo, ~200 photos = ~400MB of the free plan), (c) which photo is the cover and which are hero/featured, if any.
2. Check headroom: `get-usage-details` (storage/credits) before a big album.
3. Dry run (`--all --dry-run` or `--list FILE --dry-run`): it prints each `filename -> Cloudinary ID`. Review odd names (anything outside A-Z a-z 0-9 _ - becomes `-`, `&` becomes `AND`; PNGs are converted to JPEG).
4. Real run, then verify with `list-images` (`type: "upload"` required) and report counts. The Cloudinary folder is created automatically by the upload; no `create-folder` needed.
5. Site entry (only if the user wants it live): the site defines albums in `src/data/sessions.js` with
   `session(id, title, cat, folder, prefix, nums, coverNum, pathCat)` and lists `catLabels`, `catNotes`, `savedOrder`, optional `sessionQuotes`. NOTE the site category names differ from the photo folders: the site's `couples` group stores photos under `portraits/` (that is `pathCat`). The Cloudinary `<category>` must be the PHOTO folder name (families | maternity | portraits), not the site `cat`. Today `session()` builds LOCAL `/images/...` paths, so adding an entry only works if the photos are also in public/images; once the site reads Cloudinary (not built yet) it should read `manifests/<category>-<album>.tsv` instead. Before touching sessions.js for a new album, tell the user which of these applies and confirm; do not add local copies to the repo without asking.
6. A new category (e.g. weddings) also needs: a label in `catLabels`/`catNotes`, nav/filter support in the site, and a mention in the Folder structure section above.
7. Update the Status section of this file.
To test the new-album path without leaving traces: make a throwaway `full-size/_new-album/` with a few small files, run with category `_test`, verify, then delete the assets (delete-asset), the `galleries/_test` folder (delete-folder, only works when empty), the local folder, and `manifests/_test-_new-album.tsv`. This was done once and passed (spaces, `&`, parentheses, `#`, uppercase .JPG, PNG, and a 6000px file all handled).

## How the site serves Cloudinary photos (built and tested on baby-ollie)
- `src/lib/cloudinary.js`: `cloudinaryAlbums` is the opt-in list (`"<photo category>/<album folder>"`, e.g. `families/baby-ollie`); albums on it get Cloudinary URLs, all others still use local `/images/...`. Removing an entry reverts that album to local files.
- `src/data/sessions.js` `session()` builds URLs from that list: default `src` is `f_auto,q_auto,w_1000`; ID = `galleries/<category>/<album>/<prefix+number>` using the same sanitizing as the upload script.
- Responsive images: tiles (`PhotoTiles.jsx`) use `srcSet` widths 600/900/1300/1800 with a `sizes` per span; cover cards (`Work.jsx`) use 400/700/1000/1400. The helper `cloudinarySrcSet` swaps the `w_N` segment (note: it is preceded by a COMMA in `f_auto,q_auto,w_N`, not a slash) and returns undefined for local images.
- `useApp.js` `ensureOrientations` measures each photo with a tiny `w_80` copy (via `cloudinaryResize`) so the grid layout does not download every photo twice.
- Verified in the browser (desktop DPR2: 44 tiles pick w_900, landscape tiles w_1800; mobile 375px picks w_900; no broken images; ~5MB for all 53 photos vs 9.5MB local).
- Switching another album over = (1) upload it, (2) add `<category>/<folder>` to `cloudinaryAlbums`, (3) check the session in the browser (`#work/session/<id>`), (4) only after the whole site is verified, remove local copies with the user's explicit OK.

## Featured / hero photos = tags, not copies
Homepage featured grid and hero slides use the album photos themselves (same public ID, different width in the URL), tagged `featured` / `hero` in Cloudinary. Never upload a second copy of a photo that is already in an album. Only photos in no album go under `site/` (currently GR9A0188/GR9A0330 in site/featured, and site/about). The 16 duplicate copies uploaded earlier were verified identical (same photos) and deleted.

## Delivery URLs (never serve originals)
`https://res.cloudinary.com/yiin88qg/image/upload/f_auto,q_auto,w_<width>/<public_id>` (e.g. w_800 tiles ~40KB WebP, w_1600-2560 lightbox/hero). Always `f_auto,q_auto` plus an explicit width per slot.

## Size tiers
- Gallery photos: 3600px long edge max (what the script produces).
- Hero, About, featured, album covers (large/full-bleed): need bigger masters, just under Cloudinary's 25MP limit (about 5600x3730 landscape / 3730x5600 portrait). NOT done yet; the script does not make these. When the user marks which photos are hero/about/featured/cover, make those separately from `full-size/` (sips -Z 5600 ...), upload with a distinct public ID or overwrite policy agreed with the user, and tag them.

## Hard limits and gotchas (all learned the hard way)
- Cloudinary Free: 10MB per image, 25 megapixels per image (many full-size files are 30MP: they MUST be resized), 25 credits/month shared by storage/bandwidth/transformations. Bandwidth is the realistic ceiling; check `get-usage-details` occasionally (its numbers lag).
- The connector's `upload-asset` cannot read local files (`file://` unsupported). `sign-upload` works but costs ~60K tokens per 100 photos, so use the unsigned-preset script instead.
- Unsigned preset rules: only public_id, folder, tags, context... are allowed; `folder` is PREPENDED to public_id, so the script sends public_id=<filename only> and folder=galleries/<category>/<album>. Unsigned uploads can never overwrite; delete first if a replacement is needed.
- If a test upload is needed, upload into a throwaway folder and delete the assets and folder afterwards (delete-asset, delete-folder).
- Never delete anything outside your own test files without the user's explicit OK. Originals in `full-size/` are never modified.
- The unsigned preset is a standing risk (anyone with its name can upload). When the whole migration is finished, remind the user to delete it in Cloudinary (Settings, Upload, Upload presets).

## Status (update as you go)
Uploaded to Cloudinary and verified: families/bleil-family (22; Pic-Time folder `sarah-reid`), families/dave-jasmin-lenny (52; folder `jas-dave-leon`), families/maguy-trae-ivy (24; folder `maguy-trey`), portraits/dana-josh (35), portraits/heidi-andre (29), maternity/angelica-eric (102), families/baby-ollie (53), families/weidner-family (23), families/madison-tanya-hunter (39), portraits/nandini-srikanth (45; Pic-Time folder name = site slug), portraits/jess-calen (51; Pic-Time folder `Jess-Calen`, `--from Jess-Calen`), maternity/mana-chris (82; Pic-Time folder is named McClintock2026, uploaded with `--from McClintock2026`).
STOPGAP uploads (compressed site copies, NOT full-size; replace when the real exports arrive): portraits/abby-prodahl (13), portraits/ashly-felipe (9), portraits/emma-senior-photos (57), site/featured (only the 2 GR9A… photos that are in no album) and site/about (2). All carry the extra tag `compressed`. To replace: delete the assets in Cloudinary first (unsigned uploads cannot overwrite; delete-asset), put the export in `full-size/<album>/`, re-run `./upload-album.sh <category> <album>` (the manifest is merged, same IDs, so no site change is needed), and for site/featured + site/about re-upload larger masters under the same IDs.
Site switched to Cloudinary: every album, plus the homepage hero slides, featured grid, editorial hero, About and Pricing images (via `cloudinaryFromLocal(path, width)` in src/lib/cloudinary.js, which maps old `/images/...` paths to Cloudinary IDs and falls back to the local path). Only index.html og:image/JSON-LD/meta tags still point at local files. (see `cloudinaryAlbums` in src/lib/cloudinary.js);  Changes are uncommitted in the working tree.
Not done yet: switching the remaining albums to Cloudinary, bigger masters for hero/About/featured/covers, deleting local `public/images` copies (irreversible: only with explicit user approval and after the site is verified), deleting the upload preset at the end.
