# Followw - Cross-Platform Edition

**Work that moves with you.**

A beautiful, production-ready Flow Operating System for Windows, macOS, and Linux.

## Features

✨ **Universal Access** - Global hotkey (`Ctrl/Cmd+Shift+Space`) to summon from anywhere
⚡ **Lightning Fast** - Sub-200ms overlay appearance
🎨 **Beautiful Design** - Scandinavian minimalism with smooth animations
⏱️ **Time Tracking** - Integrated timer with visual feedback
📊 **Analytics** - Insightful daily and weekly statistics
🎯 **Focus Tasks** - Prioritize what matters most
🔒 **Privacy First** - All data stored locally, encrypted
🌙 **Dark Mode** - Automatic light/dark theme support
🎵 **Sound Design** - Subtle audio feedback (optional)
⌨️ **Keyboard First** - Full keyboard navigation

## Quick Start

### Installation

#### Windows

1. Download `Followw-Setup-1.0.0.exe` from [Releases](https://github.com/yourusername/followw/releases)
2. Run the installer
3. Launch Followw from Start Menu or Desktop
4. Press `Ctrl+Shift+Space` to open

#### macOS

1. Download `Followw-1.0.0.dmg` from [Releases](https://github.com/yourusername/followw/releases)
2. Open the DMG and drag Followw to Applications
3. Launch Followw
4. Press `Cmd+Shift+Space` to open

#### Linux

1. Download `Followw-1.0.0.AppImage` from [Releases](https://github.com/yourusername/followw/releases)
2. Make it executable: `chmod +x Followw-1.0.0.AppImage`
3. Run: `./Followw-1.0.0.AppImage`
4. Press `Ctrl+Shift+Space` to open

### Building from Source

```bash
# Clone the repository
git clone https://github.com/03aar/03aar.git
cd 03aar/followw-app

# Install dependencies
npm install

# Run in development
npm run dev

# Build for your platform
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:all   # All platforms
```

## Usage

### First Steps

1. **Open Followw**: Press `Ctrl/Cmd+Shift+Space` anywhere
2. **Add a task**: Type in the quick-add field and press Enter
3. **Start timer**: Hover over a task and click the play button
4. **Complete task**: Click the checkbox when done
5. **View analytics**: Switch to the Analytics tab

### Keyboard Shortcuts

- `Ctrl/Cmd+Shift+Space` - Show/hide overlay (global)
- `Ctrl/Cmd+K` - Command palette
- `Esc` - Close overlay or dialog
- `Enter` - Create task (in quick-add field)

### Pro Tips

**Focus Tasks**: Your top 3-5 tasks appear at the top of Today view

**Timer Workflow**:
1. Start timer when beginning focused work
2. Let it run while you're in flow
3. Stop when taking breaks
4. Review daily stats

**End of Day**: Complete all tasks to see beautiful reflection screen

**Dark Mode**: Automatically follows system preferences

## Features Guide

### Today View
Your daily command center:
- Focus time statistics
- Quick task creation
- Focus and supporting tasks
- Floating timer display

### Time Tracking
- One-click timer start/stop
- Automatic duration logging
- Visual feedback while tracking
- Daily and weekly summaries

### Analytics
- Total focus time
- Tasks completed
- Session count
- Weekly trends

### Task Management
- Rich task details (notes, links, tags)
- Focus task prioritization
- Client and project organization
- Completion animations

## Development

### Project Structure

```
followw-app/
├── src/
│   ├── main/
│   │   └── index.js          # Electron main process
│   └── renderer/
│       ├── index.html        # UI markup
│       ├── styles.css        # Design system
│       └── app.js            # Application logic
├── assets/                   # Icons and sounds
├── package.json              # Dependencies & build config
└── README.md
```

### Tech Stack

- **Electron** - Cross-platform desktop framework
- **Vanilla JS** - No framework overhead, pure performance
- **CSS3** - Advanced animations and transitions
- **Node.js** - Backend functionality

### Design System

Followw follows strict design principles:

**Colors**:
- Mist White (#F9FAFB)
- Graphite (#1C1C1E)
- Accent Blue (#3A76F0)

**Typography**:
- SF Pro Display/Text (system default)
- 8pt spacing grid
- Consistent sizing scale

**Animations**:
- Custom cubic-bezier easing
- 180-240ms transitions
- Purposeful motion only

**Philosophy**:
> "Every interaction must preserve flow."

### Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

See [CONTRIBUTING.md](../Followw/CONTRIBUTING.md) for detailed guidelines.

## Architecture

### Main Process (`src/main/index.js`)
- Window management
- Global shortcuts
- System tray
- IPC communication
- Data persistence

### Renderer Process (`src/renderer/`)
- UI rendering
- User interactions
- State management
- Animations
- Sound playback

### Data Storage
- Electron Store (encrypted JSON)
- Local-first architecture
- Automatic persistence
- Cross-platform compatibility

## Building & Distribution

### Development Build

```bash
npm run dev
```

### Production Builds

**Windows**:
```bash
npm run build:win
# Output: dist/Followw-Setup-1.0.0.exe
```

**macOS**:
```bash
npm run build:mac
# Output: dist/Followw-1.0.0.dmg
```

**Linux**:
```bash
npm run build:linux
# Output: dist/Followw-1.0.0.AppImage
```

**All Platforms**:
```bash
npm run build:all
# Output: dist/Followw-1.0.0.*
```

### Code Signing

**Windows**: Requires certificate for SmartScreen bypass
**macOS**: Requires Apple Developer ID for notarization
**Linux**: No code signing required

### Auto-Updates

Followw uses `electron-updater` for automatic updates:

1. Build and publish release to GitHub
2. App checks for updates on launch
3. Downloads and installs silently
4. Prompts user to restart

## Hosting & Distribution

### GitHub Releases

1. Create a new release on GitHub
2. Upload built installers as assets
3. Users download directly from GitHub
4. Auto-update uses GitHub releases

### Custom Hosting

You can host installers on your own server:

```json
// package.json
"build": {
  "publish": {
    "provider": "generic",
    "url": "https://your-server.com/downloads/"
  }
}
```

## Troubleshooting

### Overlay Won't Open

**Windows**: Check if another app uses the shortcut
**macOS**: Grant accessibility permissions
**Linux**: Ensure X11/Wayland compatibility

### Timer Not Working

- Check if task is selected
- Verify timer isn't already running
- Restart the application

### Data Not Saving

- Check file system permissions
- Ensure adequate disk space
- View logs: Help → View Logs

### Performance Issues

- Close unnecessary applications
- Disable animations in Settings
- Reduce blur intensity

## FAQ

**Q: Is my data private?**
A: Yes, 100% local storage. No cloud, no tracking.

**Q: Can I sync across devices?**
A: Not yet. Cloud sync planned for v2.0.

**Q: Does it work offline?**
A: Yes, fully offline-first architecture.

**Q: Can I export my data?**
A: Yes, Settings → Export Data (JSON format).

**Q: Is it free?**
A: Yes, completely free and open source.

**Q: Can I customize the theme?**
A: Yes, Settings → Appearance.

## Roadmap

### v1.1 (Next)
- [ ] Client and project management
- [ ] Custom themes
- [ ] Data import/export
- [ ] Calendar integration

### v2.0 (Future)
- [ ] Cloud sync (optional)
- [ ] AI summaries
- [ ] Natural language parsing
- [ ] Mobile companion app

### v3.0 (Vision)
- [ ] Team collaboration
- [ ] Shared projects
- [ ] Analytics dashboards
- [ ] Plugin system

## Support

- **Issues**: [GitHub Issues](https://github.com/03aar/03aar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/03aar/03aar/discussions)
- **Email**: support@followw.app
- **Twitter**: [@followwapp](https://twitter.com/followwapp)

## License

MIT License - see [LICENSE](LICENSE) for details.

Copyright © 2025 Followw. All rights reserved.

---

<div align="center">

**Made with flow in mind.**

[Website](https://followw.app) • [Twitter](https://twitter.com/followwapp) • [GitHub](https://github.com/03aar/03aar)

</div>
