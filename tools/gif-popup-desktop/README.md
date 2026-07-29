# GIF Popup — Desktop App

This is your GIF Popup tool wrapped as a real desktop app with **Electron**
(pure JavaScript/Node.js — no Python involved anywhere in the toolchain).

## What changed from the browser version
- The old "floating always-on-top window" trick relied on the browser's
  Document Picture-in-Picture API, which only works in Chrome/Edge and only
  while a tab stays open. That's replaced with a real OS-level always-on-top,
  frameless, transparent window created by Electron — it works on Windows,
  macOS, and Linux, and the app doesn't need a browser tab at all.
- Everything else (GIF upload, the GitHub collection dropdown, schedule
  times, repeat interval, colors) works exactly the same as before.

## Run it locally (to test before building installers)
Requires only [Node.js](https://nodejs.org) (LTS version) installed.

```bash
npm install
npm start
```

## Build installers yourself, locally
```bash
npm install
npm run dist
```
This produces an installer for **your current OS** in the `dist/` folder
(`.exe` on Windows, `.dmg` on macOS, `.AppImage` on Linux). electron-builder
can't cross-build for other OSes from your machine reliably — that's what
the GitHub Actions workflow below is for.

## Build installers for all platforms automatically (GitHub Actions)
1. Push this project to a GitHub repo.
2. Push a tag like `v1.0.0`:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   (or go to the repo's **Actions** tab and manually run the
   "Build Desktop App" workflow — no tag needed for that.)
3. GitHub Actions spins up a Windows runner, a macOS runner, and a Linux
   runner in parallel, each running `npm ci && npm run dist` with Node.js
   only — nothing Python-related is installed or required.
4. When it finishes:
   - Each OS's installer is attached as a workflow **artifact** (Actions tab
     → the run → Artifacts section), or
   - If you pushed a version tag, a **GitHub Release** is created with all
     three installers attached automatically.

## Notes
- `COLLECTION_API` in `src/index.html` still points at your GitHub repo's
  Collection folder — the app needs internet access to list/fetch those
  GIFs, same as the browser version did.
- To change the app's icon, add `build/icon.ico` (Windows), `build/icon.icns`
  (macOS), and `build/icon.png` (Linux, 512x512), then add
  `"icon": "build/icon.ico"` etc. under the relevant platform key in
  `package.json`'s `build` section.
