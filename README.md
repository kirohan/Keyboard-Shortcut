# ShortcutHub ⌨️

A responsive, searchable keyboard-shortcut library for popular software and operating systems.

**Credit: Made by K.I.Rohan**

## Included

- Windows 11
- macOS
- Google Chrome
- Microsoft Word
- Microsoft Excel
- Microsoft PowerPoint
- Visual Studio Code
- Adobe Photoshop
- Canva
- Figma
- GitHub
- Slack

## Features

- Windows / macOS switch
- Instant search
- Category filters
- Favorites saved in `localStorage`
- One-click copy
- Random shortcut discovery
- Dark / light mode
- Responsive mobile layout
- Official documentation links for every software card
- No framework and no build step

## Run locally

Open `index.html` in a browser, or run a simple local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Put these files at the root of your repository.
2. Push them to GitHub.
3. Open the repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your branch (usually `main`) and `/ (root)`.
6. Save.

GitHub will provide the public Pages URL.

## Add another software

Open `data.js` and add another object to `window.SHORTCUT_APPS`.

A shortcut object can contain:

```js
{
  action: "Open a new tab",
  windows: "Ctrl + T",
  mac: "Command + T"
}
```

For sequential shortcuts, use an arrow:

```js
{
  action: "Go to Issues",
  windows: "G → I",
  mac: "G → I"
}
```

## Official references used

- Microsoft Windows shortcuts: https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec
- Apple Mac shortcuts: https://support.apple.com/en-us/102650
- Google Chrome shortcuts: https://support.google.com/chrome/answer/157179
- Microsoft Word shortcuts: https://support.microsoft.com/en-us/accessibility/word/keyboard-shortcuts-in-word
- Microsoft Excel shortcuts: https://support.microsoft.com/en-us/accessibility/excel/keyboard-shortcuts-in-excel
- Microsoft PowerPoint shortcuts: https://support.microsoft.com/en-us/accessibility/powerpoint/use-keyboard-shortcuts-to-create-powerpoint-presentations
- VS Code default keybindings: https://code.visualstudio.com/docs/reference/default-keybindings
- Adobe Photoshop shortcuts: https://helpx.adobe.com/photoshop/desktop/get-started/settings-and-preferences/view-keyboard-shortcuts.html
- Canva shortcuts: https://www.canva.com/help/canva-keyboard-shortcuts/
- Figma keyboard support: https://help.figma.com/hc/en-us/articles/360040328653-Use-Figma-products-with-a-keyboard
- GitHub shortcuts: https://docs.github.com/en/get-started/accessibility/keyboard-shortcuts
- Slack shortcuts: https://slack.com/help/articles/201374536-Slack-keyboard-shortcuts

> Shortcut behavior can vary by version, keyboard layout, browser, operating system, and custom keybindings.

## Suggested next additions

Discord, Notion, Microsoft Teams, Premiere Pro, Illustrator, Blender, IntelliJ IDEA, Android Studio, Gmail, YouTube, Firefox, Edge, Terminal/PowerShell, and Linux.

---

Made by **K.I.Rohan**
