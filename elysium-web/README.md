# Elysium Browser - Web Demo

🌐 **Live demo version of Elysium Browser** running entirely in your web browser.

## What's This?

This is a web-optimized version of Elysium Browser that demonstrates all UI/UX features without requiring installation. While the full desktop app (in `../elysium-browser/`) uses Electron for native capabilities, this version runs purely in the browser.

## Quick Deploy to Live URL

### Option 1: Vercel (Fastest - 2 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from this directory)
vercel --prod
```

You'll get a live URL like: `https://elysium-xxx.vercel.app`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Option 3: GitHub Pages

```bash
# Build
npm run build

# The dist/ folder can be deployed to GitHub Pages
# Or use: npx gh-pages -d dist
```

### Option 4: Simple Python Server (Local)

```bash
npm run build
cd dist
python3 -m http.server 8000
```

Visit: `http://localhost:8000`

## Features in Web Demo

✅ Complete Elysium UI/UX
✅ All 5 modes (Home, Research, Write, Automate, Memory)
✅ Intent detection and mode switching
✅ Context Assistant with AI chat
✅ Session Tiles (semantic tabs)
✅ Writing Mode with AI assistance
✅ Full design system and animations
✅ Local storage (browser-based)

⚠️ Note: AI features require API key configuration (runs client-side)

## Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Differences from Desktop Version

| Feature | Desktop (Electron) | Web Demo |
|---------|-------------------|----------|
| Installation | Required | None - runs in browser |
| Native menus | ✅ | ❌ |
| File system | ✅ Full access | ⚠️ Browser-limited |
| Webview | ✅ Native Chromium | ⚠️ iframe-based |
| Performance | ✅ Native | ⚠️ Browser-dependent |
| Offline | ✅ Full | ⚠️ Limited |
| Security | ✅ OS-level | ⚠️ Browser sandbox |

## How It Works

The web version uses browser APIs to simulate Electron functionality:
- `localStorage` instead of Electron storage
- Browser fetch instead of IPC for AI calls
- CSS transforms instead of native animations
- iframe for webview (with limitations)

---

**Deploy this in 2 minutes and get a live URL!**
