# Elysium Browser

**The Browser That Isn't a Browser**

An intent-first, AI-powered browser that understands your purpose and adapts its interface accordingly. Built with Electron, React, TypeScript, and designed following Apple's principles of radical simplicity and human flow.

![Elysium Browser](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Vision

> "The web was designed for pages. Elysium is designed for people."

Elysium redefines the browser not as a tool to access websites — but as an intent interpreter. It understands purpose, context, and emotion — creating an environment that adapts to what you're trying to do.

## Core Features

### 🎯 Intent-First Design
- Unified intent field that understands natural language
- Automatic mode detection (Research, Write, Automate, Memory)
- No traditional URL bar - just express what you want to do

### 🧠 AI-Powered Context Assistant
- Real-time contextual help and suggestions
- Page summarization and data extraction
- Writing assistance with tone adjustment
- Source citation and fact-checking

### 📑 Semantic Session Tiles
- Replace traditional tabs with meaningful task groupings
- Visual, memory-backed spaces with semantic titles
- Persistent sessions that resume your exact state
- "EV Battery Research" instead of "tab1.html"

### ✍️ Adaptive Writing Mode
- Distraction-free writing canvas
- AI-powered Muse assistant
- Inline suggestions and improvements
- Export to multiple formats (MD, TXT, PDF)

### 🔒 Privacy-First Architecture
- Local-only mode by default
- AES-256 encrypted memory storage
- No telemetry unless explicitly opted in
- Full data transparency and control

### 🎨 Calm, Beautiful Design
- Pure white canvas with Nadoo Grey accents
- Smooth, natural animations (Ive-inspired motion)
- 8px modular spacing system
- SF Pro Display typography

## Technology Stack

- **Framework**: Electron 27 + React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 5
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Styling**: Pure CSS with design tokens
- **Encryption**: crypto-js

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd elysium-browser

# Install dependencies
npm install

# Start in development mode
npm run dev

# Build for production
npm run build

# Package application
npm run package
```

### Development Scripts

```bash
npm run dev           # Start Vite dev server + Electron
npm run build:vite    # Build React app
npm run build:electron # Build Electron main process
npm run build         # Full production build
npm run package       # Create distributable packages
```

## Project Structure

```
elysium-browser/
├── electron/              # Electron main process
│   ├── main.ts           # Main entry point
│   └── preload.ts        # Preload script (IPC bridge)
├── src/
│   └── renderer/         # React application
│       ├── components/   # UI components
│       │   ├── HomeCanvas.tsx
│       │   ├── LeftRail.tsx
│       │   ├── ContextAssistant.tsx
│       │   ├── ResearchMode.tsx
│       │   ├── WriteMode.tsx
│       │   └── SessionTiles.tsx
│       ├── services/     # Business logic
│       │   ├── ai.ts     # AI service integration
│       │   └── storage.ts # Encrypted storage
│       ├── store/        # Zustand state management
│       ├── styles/       # CSS modules
│       │   ├── tokens.css    # Design system
│       │   └── global.css    # Global styles
│       └── types/        # TypeScript definitions
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Architecture

### App Modes

Elysium dynamically switches between five modes based on user intent:

1. **Home**: The origin canvas - a calm, focused starting point
2. **Research**: Semantic web browsing with AI context
3. **Write**: Distraction-free writing with AI assistance
4. **Automate**: Safe, transparent task automation
5. **Memory**: Personal knowledge management

### State Management

The application uses Zustand for lightweight, performant state management:

- **App State**: Current mode, sessions, UI state
- **Chat State**: AI conversation history
- **Memory State**: Saved memories and annotations
- **Settings**: User preferences and privacy controls

### AI Integration

The AI service layer is provider-agnostic and supports:

- **OpenAI GPT-4**
- **Anthropic Claude**
- **Local models** (via Ollama or similar)

Configure your preferred provider in Settings.

### Data Persistence

All data is encrypted at rest using AES-256:

- **Sessions**: Browser history with semantic grouping
- **Memories**: User annotations and saved content
- **Settings**: Preferences and configuration

Storage is local-first with optional encrypted sync.

## Design Philosophy

Elysium follows three sacred principles:

### 1. Radical Simplicity
Remove everything unnecessary. Complexity must be hidden, never visible.

### 2. Human Flow
Design for how people think, not how machines operate. Navigation should feel natural, like moving through thought.

### 3. Invisible Intelligence
AI exists quietly in the background — it empowers, not overwhelms. The system understands *why* before it responds with *how*.

## Color Palette

```css
--color-bg-primary:    #FFFFFF  /* Pure white canvas */
--color-nadoo:         #E9E9EA  /* Nadoo Grey (panels) */
--color-divider:       #D9D9DA  /* Subtle borders */
--color-text-primary:  #121212  /* Absolute clarity */
--color-accent:        #007AFF  /* macOS-inspired blue */
```

## Typography

- **Display**: SF Pro Display (Headlines, UI)
- **Text**: Inter (Body, reading)
- **Mono**: SF Mono (Code, technical)

## Configuration

### AI Service Setup

1. Open Settings panel
2. Choose your AI provider (OpenAI, Anthropic, Local)
3. Enter API key (stored encrypted locally)
4. Select preferred model

### Privacy Settings

- **Local Only Mode**: All processing on-device
- **Encrypt Memories**: AES-256 encryption for saved data
- **Telemetry**: Opt-in only, off by default

## Roadmap

### Phase 1 ✅ (Current)
- [x] Home Canvas with intent detection
- [x] Research Mode with semantic tabs
- [x] Writing Mode with AI assistance
- [x] Context Assistant panel
- [x] Local encrypted storage
- [x] Session management

### Phase 2 (Next)
- [ ] Full webview integration with Chromium
- [ ] Automation Mode with Playwright
- [ ] Advanced memory search with vector DB
- [ ] Cross-device encrypted sync
- [ ] Browser extension API

### Phase 3 (Future)
- [ ] Plugin ecosystem
- [ ] Collaborative sessions
- [ ] Advanced automation workflows
- [ ] Mobile companion app
- [ ] Self-hosted AI option

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Guidelines

- Follow the established code style (TypeScript strict mode)
- Maintain the design system (use CSS variables)
- Write clear, semantic component names
- Test across platforms (macOS, Windows, Linux)
- Document new features

## Security

- All AI queries are encrypted in transit (HTTPS)
- API keys stored encrypted with OS keychain integration
- Optional sandboxed automation (user confirmation required)
- No telemetry or tracking without explicit opt-in
- Regular security audits

### Reporting Vulnerabilities

Please email security@elysium.browser with details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

Designed and built with inspiration from:
- **Jonathan Ive** - Design philosophy and aesthetic principles
- **Steve Jobs** - Vision for human-centered technology
- **macOS** - UI patterns and interaction design
- **OpenAI & Anthropic** - AI capabilities

## Support

- 📖 [Documentation](docs/)
- 💬 [Discord Community](https://discord.gg/elysium)
- 🐛 [Issue Tracker](https://github.com/elysium/issues)
- 📧 [Email Support](mailto:support@elysium.browser)

---

**Elysium** - Where thought becomes flow.

Built with ❤️ for a calmer, more intentional web experience.
