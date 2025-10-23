# Elysium Browser - Quick Start Guide

Get Elysium up and running in 5 minutes.

## Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Git**

## Installation

### 1. Clone & Install

```bash
cd elysium-browser
npm install
```

This will install all dependencies including:
- Electron
- React & TypeScript
- Vite
- Framer Motion
- Zustand

### 2. Configure Environment (Optional)

For AI features, copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
VITE_OPENAI_API_KEY=sk-your-key-here
```

**Note**: Elysium works without AI configuration - you'll just see placeholder responses.

### 3. Start Development

```bash
npm run dev
```

This command:
1. Starts the Vite dev server (React app)
2. Launches Electron with hot reload
3. Opens DevTools automatically

## First Launch

When Elysium starts, you'll see:

1. **Home Canvas** - A clean white canvas with an intent field
2. **Left Rail** - Navigation dock (collapsed by default)
3. **Right Panel** - Context assistant (can be toggled)

### Try These Actions

**Search the web:**
```
wikipedia.org
```
The app detects it's a URL and switches to Research Mode.

**Start writing:**
```
Write an email about project updates
```
Switches to Write Mode with AI assistance ready.

**Ask a question:**
```
What are the latest trends in AI?
```
Opens Research Mode and prepares a search.

## Building for Production

### Build the app

```bash
npm run build
```

This creates optimized production builds in:
- `dist/` - React app
- `dist-electron/` - Electron main process

### Package as Desktop App

```bash
npm run package
```

Creates platform-specific installers in `release/`:
- **macOS**: `.dmg` and `.zip`
- **Windows**: `.exe` installer
- **Linux**: `.AppImage` and `.deb`

## Project Structure Overview

```
elysium-browser/
├── electron/              # Electron main process
│   ├── main.ts           # Window management, IPC
│   └── preload.ts        # Secure API bridge
│
├── src/renderer/         # React application
│   ├── components/       # UI components
│   ├── services/         # AI, storage services
│   ├── store/            # Zustand state
│   ├── styles/           # CSS with design tokens
│   └── types/            # TypeScript definitions
│
├── public/               # Static assets
└── index.html            # Entry HTML
```

## Key Features to Explore

### 1. Intent Detection

The home canvas understands:
- **URLs**: Navigates to websites
- **Questions**: Searches or asks AI
- **Commands**: "Write...", "Draft...", "Book..."
- **Context**: "Show yesterday's work"

### 2. Session Tiles

Instead of tabs, Elysium uses semantic sessions:
- Click `+` to create a new session
- Sessions auto-save and persist
- Each has a meaningful title (not URL)

### 3. Context Assistant

The right panel provides:
- **Summarize**: Quick page summaries
- **Extract**: Pull out key data
- **Chat**: Ask questions about current context
- **Sources**: Always cites information sources

### 4. Writing Mode

Access by typing "Write..." or clicking Write in the left rail:
- Distraction-free canvas
- AI suggestions (Improve, Shorten, Expand)
- Live word count
- Export to TXT or Markdown

### 5. Privacy Controls

All data stays local by default:
- Memories encrypted with AES-256
- No telemetry unless opted in
- Full data export/delete controls

## Configuration

### AI Provider Setup

1. Open **Settings** from left rail
2. Choose provider (OpenAI, Anthropic, or Local)
3. Enter API key
4. Select model

### Privacy Options

- **Local Only**: All AI processing on-device (requires local model)
- **Encrypt Memories**: Toggle storage encryption
- **Telemetry**: Analytics opt-in

## Troubleshooting

### App won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors

```bash
# Ensure TypeScript compiles
npx tsc --noEmit

# Check Vite config
npm run build:vite
```

### Electron not launching

```bash
# Build electron separately
npm run build:electron

# Check dist-electron folder exists
ls dist-electron/
```

### AI features not working

1. Verify `.env` file has API key
2. Check provider is reachable
3. Look in DevTools console for errors

## Development Tips

### Hot Reload

Changes to React components reload instantly. Changes to Electron main process require restart:

```bash
# After editing electron/main.ts
Ctrl+C  # Stop
npm run dev  # Restart
```

### DevTools

Open automatically in dev mode:
- **React DevTools**: Inspect component tree
- **Console**: See logs and errors
- **Network**: Monitor AI API calls

### State Debugging

Zustand state is visible in React DevTools under "Zustand".

## Next Steps

1. **Customize Design**: Edit `src/renderer/styles/tokens.css`
2. **Add Features**: Create components in `src/renderer/components/`
3. **Integrate AI**: Configure real AI provider in `.env`
4. **Deploy**: Build and share with `npm run package`

## Resources

- **Full Documentation**: See `README.md`
- **Design Spec**: See project blueprint
- **TypeScript Types**: `src/renderer/types/`
- **Examples**: Check existing components

## Support

Having issues? Check:

1. Node version: `node --version` (should be 18+)
2. Dependencies installed: `ls node_modules/`
3. Build completed: `ls dist/ dist-electron/`

## What's Next?

Explore the codebase and make it your own! Key extension points:

- **Add new modes**: Extend `AppMode` type
- **Custom AI prompts**: Edit `services/ai.ts`
- **New UI components**: Follow existing patterns
- **Automation features**: Add to AutomateMode (coming soon)

---

**Welcome to Elysium** - The browser that understands you.

Start typing in the intent field and experience browsing reimagined.
