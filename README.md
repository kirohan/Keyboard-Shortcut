# ShortcutHub ⌨️

A massive, searchable keyboard-shortcut encyclopedia built for GitHub Pages.

**Made by K.I.Rohan**

## Current scale

- **2,228 software titles** in the global catalog
- **2,235 shortcut records**
- **257 software shortcut packs**
- **122 genres / specialist software categories**
- **173 profession and workflow tags**
- Windows / macOS aware shortcut rendering
- Brand-logo loading with fallback handling

The catalog intentionally separates **software discovery** from **verified shortcut packs**. A software title can be indexed before its shortcut pack is added, but ShortcutHub does not publish invented keyboard shortcuts just to increase the shortcut count.

## Major coverage

ShortcutHub includes software across architecture & BIM, CAD, 3D/VFX/rendering, game development, video editing, streaming, audio/music, design, UI/UX, photography, software development, DevOps/cloud, terminals, databases, data/BI, AI/ML, GIS, science, civil/structural engineering, electronics/PCB, CAM/manufacturing, research, education, office work, writing/publishing, productivity, communication, browsers, cybersecurity, networking, virtualization, utilities, ERP/accounting, CRM, marketing, no-code, automation/RPA, trading, medical/scientific imaging, legal tech, construction, industrial automation and many more specialist categories.

## Highlighted software

The verified collection includes popular tools such as:

- AutoCAD, Autodesk Revit, SketchUp, D5 Render
- Unreal Engine, Unity, Godot, Roblox Studio
- CapCut, Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro
- Photoshop, Illustrator, Figma, Canva, Blender, Maya
- VS Code, Visual Studio, JetBrains IDEs, GitHub
- Chrome, Firefox, Edge, Safari
- Word, Excel, PowerPoint, Google Workspace
- MATLAB, RStudio, SPSS, Stata, QGIS, ArcGIS Pro
- Slack, Discord, Teams, Zoom and more

## Features

- Instant search across software names, professions and shortcuts
- Windows / macOS switch
- **All Software / Verified Packs / Catalog Only** coverage filter
- Genre dropdown built to handle 100+ specialist categories
- Profession/workflow filtering
- Progressive loading: only 24 cards at a time for performance
- Real brand icon attempt through Simple Icons CDN
- Official-site favicon fallback
- Letter fallback if no usable brand image can be loaded
- Favorites saved in `localStorage`
- One-click shortcut copy
- Random shortcut discovery
- Dark / light theme
- Mobile responsive UI
- `/` focuses search, `Esc` clears search
- Official reference/site link on software cards
- Contribution request generator for catalog-only entries

## Logo policy

ShortcutHub uses brand imagery for product identification. The UI first attempts a recognized Simple Icons brand SVG, then falls back to the icon/favicons associated with the software's official site, then to a text badge when no reliable logo can be loaded.

Brand names, product names and logos remain the property of their respective owners. Inclusion does not imply endorsement or affiliation.

## Accuracy policy

A huge shortcut database becomes useless if it is full of guessed keybindings. ShortcutHub therefore uses two states:

- **Verified Pack** — shortcut records are present in the database and the card provides a vendor/reference link.
- **Catalog** — the software is indexed for discovery, but a shortcut pack has not yet been accepted into the database.

When contributing a shortcut pack, use the current vendor documentation/manual wherever possible and record Windows/macOS differences explicitly.

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Publish with GitHub Pages

1. Put the repository files on your default branch.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select `main` and `/ (root)`.
5. Save.

No framework, package manager or build step is required.

## Add a verified shortcut pack

Edit `data.js`. Each shortcut record can contain platform-specific values:

```js
{
  action: "Split at playhead",
  windows: "Ctrl + B",
  mac: "Command + B"
}
```

For sequential shortcuts:

```js
{
  action: "Go to Issues",
  windows: "G → I",
  mac: "G → I"
}
```

See **CONTRIBUTING.md** for the data-quality checklist.

## Data files

- `index.html` — page structure and UI
- `styles.css` — responsive visual design
- `app.js` — filtering, search, logo loading, pagination, favorites and interactions
- `data.js` — software catalog + shortcut data
- `CONTRIBUTING.md` — contribution and verification rules

---

Made by **K.I.Rohan** ♥

## Product logo system

ShortcutHub now prioritizes recognizable **full-color, product-specific logos** for suites where monochrome marks are easy to confuse. Microsoft 365 apps such as Word, Excel and PowerPoint prefer product-specific Microsoft web icons, while Adobe Creative Cloud apps prefer full-color product SVGs. The site then falls back to Simple Icons, an official-site favicon, and finally a text badge. Logos are loaded lazily so the large catalog stays fast.

