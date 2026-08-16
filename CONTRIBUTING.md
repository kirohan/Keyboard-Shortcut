# Contributing to ShortcutHub

Thanks for helping grow the shortcut encyclopedia. The goal is **maximum coverage without sacrificing accuracy**.

## Adding a new shortcut pack

Before changing `data.js`:

1. Prefer the software vendor's current keyboard-shortcut documentation, manual, or in-app shortcut reference.
2. Confirm the software name and supported desktop platform(s).
3. Record Windows and macOS shortcuts separately when they differ.
4. Do not assume that `Ctrl` simply becomes `Command` unless the vendor documentation or application confirms it.
5. Note that user-remappable shortcuts may differ; add the documented default.
6. Avoid copying huge shortcut tables verbatim from third-party sites.
7. Keep actions concise and searchable.
8. Keep the official/reference URL in the software record.

## Catalog-only entries

Catalog entries use `shortcuts: []`. They are intentional. They let users discover a software title and request a pack without ShortcutHub inventing keybindings.

Once a trustworthy shortcut pack is added, the UI automatically changes that software from **CATALOG** to **VERIFIED PACK**.

## Logos

Do not commit random logo files from image-search sites. The frontend attempts recognized brand SVGs first and an official-site favicon fallback. Product trademarks remain owned by their respective owners.

## Suggested pull-request title

`Add shortcuts: <Software Name>`

## Suggested issue/request title

`Shortcut pack request: <Software Name>`

---

ShortcutHub — Made by **K.I.Rohan**
