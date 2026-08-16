# ShortcutHub V2.1 — Stable GitHub Pages Build

**Made by K.I.Rohan**

This release fixes the broken/partially styled preview problem from V2.

## What was fixed

The deployable root `index.html` is now **self-contained**:
- CSS is embedded
- the software/shortcut database is embedded
- JavaScript is embedded
- startup no longer crashes if browser storage is blocked
- the site therefore works when `index.html` is opened directly and is very reliable on GitHub Pages

The editable modular files are still available under `source/`.

## Recommended GitHub Pages deployment

Upload the **entire contents of this folder** to the repository root, then enable:

`Settings → Pages → Deploy from a branch → main → /(root)`

The public site uses the root `index.html`.

## Editing

Edit:
- `source/index.html`
- `source/styles.css`
- `source/data.js`
- `source/app.js`

Then run:

```bash
python build.py
```

This regenerates the deployment-safe root `index.html`.

## Why V2 looked broken

A standalone HTML preview can fail to load neighboring `styles.css`, `data.js`, and `app.js` files. In restricted preview environments, `localStorage` may also be unavailable. V2.1 removes both failure modes.

## Shortcut UX

Cards show essential shortcuts first. `View all … shortcuts` opens the full verified pack for that software. The official reference link remains available for vendor-complete/customizable keymaps.

---

Made by **K.I.Rohan**
