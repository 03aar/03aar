# CLAUDE.md - AI Assistant Guide

> **Purpose**: This document guides AI assistants working in the Followw codebase. It provides comprehensive context about the repository structure, development workflows, conventions, and best practices.

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Development Workflows](#development-workflows)
5. [Code Conventions](#code-conventions)
6. [Architecture Patterns](#architecture-patterns)
7. [Common Tasks](#common-tasks)
8. [Testing Guidelines](#testing-guidelines)
9. [Distribution & Deployment](#distribution--deployment)
10. [Key Files Reference](#key-files-reference)
11. [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## Repository Overview

### What is Followw?

**Followw** is a complete **Flow Operating System** - a productivity application designed to help freelancers, founders, and professionals maintain focus and track work without interrupting their flow state.

### Repository Contents

This repository contains **two complementary implementations** of Followw:

1. **Native macOS Application** (`/Followw/`)
   - Built with Swift 5.9 + SwiftUI
   - Deep macOS integration (menu bar, global hotkeys, native UI)
   - 20 Swift source files, ~2,645 lines of code

2. **Cross-Platform Electron Application** (`/followw-app/`)
   - Built with Electron 28 + Vanilla JavaScript
   - Supports Windows 10/11, macOS 10.15+, Linux (Ubuntu, Fedora, Arch)
   - 4 main files, ~2,029 lines of code

### Design Philosophy

> "Work shouldn't pull you out of flow. Your workspace should follow your mind, not interrupt it."

**Core Principles**:
- Every interaction must be **reversible**
- Every animation must **serve cognition**
- Sub-**300ms response times** for all interactions
- **Privacy-first** with offline-first, encrypted local storage
- **Beautiful, minimalist** Scandinavian design

---

## Project Structure

```
/home/user/03aar/
│
├── Followw/                      # Native macOS Application
│   ├── Followw.xcodeproj/        # Xcode project file
│   ├── Followw/                  # Source code
│   │   ├── Models/               # Data models (Task, Client, Project, TimeEntry)
│   │   ├── Services/             # Business logic (DataManager, OverlayManager, TimerManager)
│   │   ├── Views/                # SwiftUI views (11 view files)
│   │   └── Utilities/            # Helpers (FollowwTheme, Extensions)
│   ├── README.md                 # User guide for macOS app
│   ├── ARCHITECTURE.md           # Technical architecture (430 lines)
│   ├── CONTRIBUTING.md           # Development guidelines (352 lines)
│   └── QUICKSTART.md             # Quick start guide
│
├── followw-app/                  # Cross-Platform Electron Application
│   ├── src/
│   │   ├── main/
│   │   │   └── index.js          # Electron main process (227 lines)
│   │   └── renderer/
│   │       ├── index.html        # UI markup (238 lines)
│   │       ├── styles.css        # Design system (953 lines)
│   │       └── app.js            # Application logic (611 lines)
│   ├── assets/
│   │   ├── icon.png              # App icon (512x512)
│   │   ├── tray-icon.png         # System tray icon (16x16)
│   │   └── sounds/               # Sound effects (WAV files)
│   ├── package.json              # Dependencies & build configuration
│   ├── README.md                 # User guide (363 lines)
│   ├── DEPLOYMENT.md             # Build & distribution guide (494 lines)
│   └── assets/README.md          # Asset creation guide
│
├── README.md                     # Personal portfolio/bio
├── FOLLOWW_COMPLETE_GUIDE.md     # Complete deployment guide (585 lines)
└── CLAUDE.md                     # This file
```

---

## Technology Stack

### Native macOS App (`/Followw/`)

| Component | Technology | Version |
|-----------|-----------|---------|
| **Language** | Swift | 5.9+ |
| **UI Framework** | SwiftUI | Latest |
| **Architecture** | MVVM + Services | - |
| **Build System** | Xcode | 15.0+ |
| **Target OS** | macOS | 13.0+ (Ventura) |
| **Storage** | UserDefaults + JSON | - |
| **Package Manager** | None (native frameworks only) | - |

**Key Dependencies** (Native Frameworks):
- SwiftUI - Declarative UI framework
- AppKit - Window and menu bar management
- Carbon - Global hotkey registration
- Foundation - Core utilities

### Cross-Platform Electron App (`/followw-app/`)

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Electron | 28.0.0 |
| **Frontend** | Vanilla JavaScript | ES6+ |
| **UI** | HTML5 + CSS3 | - |
| **Build System** | electron-builder | 24.9.1 |
| **Package Manager** | npm | - |
| **Storage** | electron-store | 8.1.0 |
| **Target Platforms** | Windows, macOS, Linux | See package.json |

**Production Dependencies**:
```json
{
  "electron-squirrel-startup": "^1.0.0",
  "electron-store": "^8.1.0"
}
```

**Development Dependencies**:
```json
{
  "@electron-forge/cli": "^7.2.0",
  "electron": "^28.0.0",
  "electron-builder": "^24.9.1"
}
```

---

## Development Workflows

### Setting Up the macOS App

```bash
cd /home/user/03aar/Followw
open Followw.xcodeproj
# Configure signing in Xcode (Signing & Capabilities tab)
# Press ⌘R to build and run
```

**Requirements**:
- macOS 13.0+ (Ventura or later)
- Xcode 15.0+
- Apple Developer account (for code signing)

**Permissions Required**:
- Accessibility (for global hotkey: ⌘⇧Space)
- No network permissions needed (fully offline)

### Setting Up the Electron App

```bash
cd /home/user/03aar/followw-app

# First-time setup
npm install

# Run in development mode
npm run dev

# Test the overlay: Press Ctrl+Shift+Space (Windows/Linux) or Cmd+Shift+Space (Mac)
```

**Requirements**:
- Node.js 18+
- npm package manager

### Building Production Installers

```bash
cd /home/user/03aar/followw-app

# Build for specific platforms
npm run build:win     # Windows installer (.exe)
npm run build:mac     # macOS installer (.dmg)
npm run build:linux   # Linux AppImage

# Build for all platforms at once
npm run build:all     # Outputs to dist/ folder
```

**Output Location**: `/home/user/03aar/followw-app/dist/`

### Git Workflow

**Current Branch**: `claude/claude-md-mi261zjt6p9dvq5a-01R62jtNXcbJu4skjRKURCXM`

**Branching Strategy**:
- `main` - Production-ready code
- `develop` - Development branch (if used)
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `claude/*` - AI assistant work branches

**Commit Message Format** (Conventional Commits):
```
feat: add client time breakdown chart
fix: resolve timer not stopping bug
docs: update installation instructions
style: format code according to guidelines
refactor: simplify task filtering logic
perf: optimize task list rendering
test: add unit tests for DataManager
```

---

## Code Conventions

### Swift Code Style (macOS App)

Follow Apple's [Swift API Design Guidelines](https://swift.org/documentation/api-design-guidelines/).

**Naming Conventions**:
```swift
// Variables and Functions: camelCase
let taskTitle = "My Task"
func addTask(_ task: Task) { }

// Classes/Structs: PascalCase
class DataManager { }
struct Task { }

// Constants: camelCase or UPPER_CASE for globals
let maxTasks = 100
let API_KEY = "..."
```

**SwiftUI Best Practices**:
```swift
// ✅ Good: Extract complex views
var body: some View {
    VStack {
        headerView
        contentView
        footerView
    }
}

private var headerView: some View {
    // Complex header logic
}

// ✅ Good: Use computed properties for derived data
private var filteredTasks: [Task] {
    tasks.filter { !$0.isCompleted }
}

// ❌ Avoid: Functions for simple getters
private func getFilteredTasks() -> [Task] {
    return tasks.filter { !$0.isCompleted }
}
```

**Documentation Comments**:
```swift
// MARK: - Section Title

/// Brief description of the function
/// - Parameter task: The task to add
/// - Returns: Success status
func addTask(_ task: Task) -> Bool {
    // Implementation
}
```

### JavaScript Code Style (Electron App)

**Code Style**:
- ES6+ syntax (const/let, arrow functions, template literals)
- Vanilla JavaScript - no frameworks
- Functional programming where possible
- Clear, self-documenting variable names

**Example**:
```javascript
// ✅ Good
const completedTasks = tasks.filter(task => task.completed);
const totalFocusTime = tasks.reduce((sum, task) => sum + task.duration, 0);

// ❌ Avoid
var tasks2 = [];
for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].completed) {
        tasks2.push(tasks[i]);
    }
}
```

### Design System Usage

**Always use the design system** - never hardcode values.

**Swift (macOS)**:
```swift
// ✅ Good
Text("Hello")
    .font(FollowwTheme.Typography.body)
    .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
    .padding(FollowwTheme.Spacing.md)

// ❌ Bad
Text("Hello")
    .font(.system(size: 17))
    .foregroundColor(.black)
    .padding(16)
```

**CSS (Electron)**:
```css
/* ✅ Good - Use CSS variables */
.button {
    background: var(--accent-blue);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
}

/* ❌ Bad - Hardcoded values */
.button {
    background: #3A76F0;
    padding: 16px;
    border-radius: 8px;
}
```

### Design System Tokens

**Colors**:
- `--mist-white`: #F9FAFB (light background)
- `--graphite`: #1C1C1E (dark background)
- `--accent-blue`: #3A76F0 (primary actions)
- `--success`: #10B981
- `--warning`: #F59E0B
- `--error`: #EF4444

**Typography**:
- Font: SF Pro (system default)
- 8pt spacing grid
- Consistent sizing scale

**Animations**:
- Duration: 180-240ms for transitions
- Easing: Custom cubic-bezier or easeInOut
- 60fps target for all animations

---

## Architecture Patterns

### macOS App Architecture (MVVM + Services)

```
User Interface (SwiftUI Views)
    ↓
    ↓ ObservableObject (@Published properties)
    ↓
View Models & Managers (Singletons)
├── DataManager - CRUD operations, persistence
├── OverlayManager - Window lifecycle, show/hide
└── TimerManager - Active timer state, tracking
    ↓
    ↓ CRUD Operations
    ↓
Data Models (Structs)
├── Task - Identifiable, Codable, Hashable
├── Client - Client information
├── Project - Project data
└── TimeEntry - Time tracking entries
    ↓
    ↓ JSON Encoding/Decoding
    ↓
Local Storage (UserDefaults)
```

**Key Patterns**:
- **Singleton Managers**: DataManager, OverlayManager, TimerManager are singletons (`ObservableObject`)
- **Value Semantics**: Models are structs (copied, not referenced)
- **Reactive Updates**: `@Published` properties automatically update views
- **Environment Objects**: Shared managers passed via `.environmentObject()`

**File Locations**:
- Models: `/Followw/Followw/Models/*.swift`
- Services: `/Followw/Followw/Services/*.swift`
- Views: `/Followw/Followw/Views/*.swift`
- Theme: `/Followw/Followw/Utilities/FollowwTheme.swift`

### Electron App Architecture (Two-Process)

```
Main Process (Node.js)
├── Window management
├── Global shortcuts registration
├── System tray integration
├── IPC handlers
└── Data persistence (electron-store)
    ↓
    ↓ IPC Communication
    ↓
Renderer Process (Browser)
├── UI rendering (HTML/CSS)
├── User interactions
├── State management (in-memory)
├── Animations (CSS + JS)
└── Sound playback
```

**Key Patterns**:
- **Two-Process Architecture**: Main (Node.js) + Renderer (browser)
- **IPC Communication**: Main ↔ Renderer via `ipcMain` and `ipcRenderer`
- **Local-First Storage**: electron-store with encrypted JSON
- **Event-Driven**: DOM events → state updates → UI re-render

**File Locations**:
- Main Process: `/followw-app/src/main/index.js`
- Renderer: `/followw-app/src/renderer/index.html`, `app.js`, `styles.css`

---

## Common Tasks

### Adding a New Task (User Feature)

**macOS App**:
1. Update `Task` model if needed (`/Followw/Followw/Models/Task.swift`)
2. Add CRUD methods to `DataManager` (`/Followw/Followw/Services/DataManager.swift`)
3. Update relevant views (`/Followw/Followw/Views/`)
4. Test in Xcode (⌘R)

**Electron App**:
1. Update task schema in `app.js` (`/followw-app/src/renderer/app.js`)
2. Add CRUD functions in `app.js`
3. Update UI in `index.html` and event listeners in `app.js`
4. Test with `npm run dev`

### Adding a New View/Screen

**macOS App**:
1. Create new SwiftUI view file in `/Followw/Followw/Views/`
2. Use `@EnvironmentObject` for managers
3. Follow existing view structure (see `TodayView.swift` as reference)
4. Add to navigation in `OverlayContentView.swift`
5. Use `FollowwTheme` for all styling

**Electron App**:
1. Add HTML structure in `index.html`
2. Add CSS styling in `styles.css` (use CSS variables)
3. Add JavaScript logic in `app.js`
4. Wire up event listeners and state management

### Modifying the Design System

**macOS App**:
- Edit `/Followw/Followw/Utilities/FollowwTheme.swift`
- All views automatically update via the theme

**Electron App**:
- Edit CSS variables in `/followw-app/src/renderer/styles.css` (`:root` section)
- All elements using `var(--variable-name)` automatically update

### Adding New Data Models

**macOS App**:
```swift
// 1. Create model in /Followw/Followw/Models/
struct NewModel: Identifiable, Codable, Hashable {
    let id: UUID
    var name: String
    // ... other properties
}

// 2. Add to DataManager
class DataManager: ObservableObject {
    @Published var newModels: [NewModel] = []

    func addNewModel(_ model: NewModel) {
        newModels.append(model)
        saveData()
    }
}

// 3. Update persistence in saveData() and loadData()
```

**Electron App**:
```javascript
// 1. Define schema in app.js
const defaultData = {
    newModels: [] // Add new collection
};

// 2. Add CRUD functions
function addNewModel(model) {
    const data = store.get('data', defaultData);
    data.newModels.push(model);
    store.set('data', data);
}
```

### Running Tests

**macOS App**:
```bash
# In Xcode: ⌘U to run unit tests
# Note: Test files would be in /Followw/FollowwTests/ (not yet implemented)
```

**Electron App**:
```bash
# No automated tests currently implemented
# Manual testing: npm run dev
```

### Building for Distribution

See [Distribution & Deployment](#distribution--deployment) section below.

---

## Testing Guidelines

### Manual Testing Checklist

**For All Changes**:
- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Animations are smooth (60fps target)
- [ ] Works in both light and dark mode
- [ ] Keyboard navigation functional
- [ ] Data persists correctly after restart

**For macOS App**:
- [ ] Global hotkey (⌘⇧Space) works
- [ ] Menu bar icon appears and functions
- [ ] Overlay appears/disappears smoothly
- [ ] No memory leaks (check Instruments)

**For Electron App**:
- [ ] Global hotkey works (Ctrl/Cmd+Shift+Space)
- [ ] System tray icon appears
- [ ] Overlay positioning is correct
- [ ] Sound effects play (if enabled)

### Performance Targets

| Operation | Target Response Time |
|-----------|---------------------|
| Overlay show/hide | < 200ms |
| Task creation | < 100ms |
| Timer start/stop | < 50ms |
| Data save | < 100ms |
| View transitions | 180-220ms |

### Critical User Flows to Test

1. **Open/Close Overlay**
   - Press global shortcut
   - Overlay appears centered with animation
   - Press ESC or shortcut again to close

2. **Create Task**
   - Type in quick-add field
   - Press Enter
   - Task appears in list
   - Data persists after app restart

3. **Start/Stop Timer**
   - Click play button on task
   - Timer starts and shows in floating timer
   - Click stop button
   - Time entry is saved

4. **Complete Task**
   - Click checkbox
   - Task shows completion animation
   - Task marked as completed
   - Stats update

---

## Distribution & Deployment

### Version Management

**Update Version** (Electron App):
```bash
cd /home/user/03aar/followw-app
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### Building Installers

**Electron App**:
```bash
cd /home/user/03aar/followw-app

# Windows (creates .exe installer)
npm run build:win
# Output: dist/Followw-Setup-1.0.0.exe

# macOS (creates .dmg)
npm run build:mac
# Output: dist/Followw-1.0.0.dmg

# Linux (creates AppImage)
npm run build:linux
# Output: dist/Followw-1.0.0.AppImage

# All platforms
npm run build:all
```

**macOS Native App**:
1. Open in Xcode
2. Product → Archive
3. Distribute App → Direct Distribution or Mac App Store
4. Export .dmg or .pkg

### Creating a GitHub Release

```bash
# 1. Tag the version
git tag v1.0.0
git push origin v1.0.0

# 2. Build installers
cd followw-app
npm run build:all

# 3. Go to GitHub and create release
# Upload files from dist/ folder:
# - Followw-Setup-1.0.0.exe (Windows)
# - Followw-1.0.0.dmg (macOS)
# - Followw-1.0.0.AppImage (Linux)

# 4. Publish release
```

### Auto-Update System

The Electron app includes auto-update functionality via GitHub Releases:
1. App checks for updates on launch
2. Downloads new version in background
3. Prompts user to restart
4. Update installs automatically

**Configuration**: See `package.json` build section for update URLs.

### Code Signing

**Windows**:
- Requires code signing certificate (~$200-500/year)
- Prevents "Unknown Publisher" warnings
- See `/followw-app/DEPLOYMENT.md` for details

**macOS**:
- Requires Apple Developer ID ($99/year)
- Required for distribution outside App Store
- Notarization needed for Gatekeeper

**Linux**:
- No code signing required

---

## Key Files Reference

### Documentation Files

| File | Purpose | Lines |
|------|---------|-------|
| `/README.md` | Personal portfolio/bio | 19 |
| `/FOLLOWW_COMPLETE_GUIDE.md` | Complete deployment guide | 585 |
| `/Followw/README.md` | macOS app user guide | - |
| `/Followw/ARCHITECTURE.md` | Technical architecture | 430 |
| `/Followw/CONTRIBUTING.md` | Development guidelines | 352 |
| `/Followw/QUICKSTART.md` | Quick start guide | 237 |
| `/followw-app/README.md` | Electron app user guide | 363 |
| `/followw-app/DEPLOYMENT.md` | Build & distribution | 494 |
| `/followw-app/assets/README.md` | Asset creation guide | 118 |
| `/CLAUDE.md` | This file (AI assistant guide) | - |

### Configuration Files

| File | Purpose |
|------|---------|
| `/followw-app/package.json` | npm dependencies, build config, scripts |
| `/Followw/Followw.xcodeproj/` | Xcode project configuration |

### Source Code Entry Points

| File | Purpose | Lines |
|------|---------|-------|
| `/Followw/Followw/FollowwApp.swift` | macOS app entry point | 94 |
| `/followw-app/src/main/index.js` | Electron main process | 227 |
| `/followw-app/src/renderer/app.js` | Electron app logic | 611 |
| `/followw-app/src/renderer/index.html` | Electron UI markup | 238 |
| `/followw-app/src/renderer/styles.css` | Electron design system | 953 |

### Key Service Files (macOS)

| File | Purpose |
|------|---------|
| `/Followw/Followw/Services/DataManager.swift` | CRUD operations, persistence |
| `/Followw/Followw/Services/OverlayManager.swift` | Window management |
| `/Followw/Followw/Services/TimerManager.swift` | Time tracking logic |
| `/Followw/Followw/Utilities/FollowwTheme.swift` | Design system tokens |

---

## AI Assistant Guidelines

### When Working on This Codebase

1. **Read Relevant Documentation First**
   - Check `/FOLLOWW_COMPLETE_GUIDE.md` for deployment info
   - Check `/Followw/ARCHITECTURE.md` for technical details
   - Check `/Followw/CONTRIBUTING.md` for development guidelines

2. **Respect the Design Philosophy**
   - Every change should preserve or enhance "flow"
   - Sub-300ms response times are critical
   - Always use the design system (never hardcode values)
   - Animations must serve cognition, not decoration

3. **Maintain Code Quality**
   - Follow existing code style and patterns
   - Use conventional commit messages
   - Test changes thoroughly before committing
   - Update documentation if changing behavior

4. **Dual Implementation Considerations**
   - Changes may need to be implemented in BOTH apps
   - macOS app: Swift/SwiftUI patterns
   - Electron app: JavaScript/HTML/CSS patterns
   - Keep feature parity where applicable

5. **Privacy and Security**
   - All data is stored locally (no cloud)
   - Do not add telemetry or tracking without explicit user consent
   - Maintain offline-first architecture
   - Respect user data ownership

6. **Testing Before Committing**
   - Run the app and test affected features
   - Check light and dark modes
   - Verify animations are smooth
   - Ensure data persists correctly

7. **Common Pitfalls to Avoid**
   - ❌ Don't hardcode colors, spacing, or timing values
   - ❌ Don't add heavy dependencies without discussion
   - ❌ Don't break offline functionality
   - ❌ Don't add network requirements
   - ❌ Don't skip testing in both light/dark modes

8. **When Adding New Features**
   - Sketch the feature flow first
   - Consider impact on both implementations
   - Update relevant documentation
   - Add to roadmap if significant
   - Test on all target platforms if possible

9. **Performance Considerations**
   - Use lazy loading for long lists (`LazyVStack` in SwiftUI)
   - Minimize `@Published` updates in Swift
   - Avoid heavy computations in render paths
   - Profile with Instruments (macOS) or DevTools (Electron)
   - Maintain 60fps for all animations

10. **Git Workflow**
    - Work on feature branches (`feature/*` or `bugfix/*`)
    - Use descriptive commit messages (conventional commits)
    - Push to designated branch (check instructions at session start)
    - Create PRs with clear descriptions

### Quick Command Reference

```bash
# Navigate to projects
cd /home/user/03aar/Followw         # macOS app
cd /home/user/03aar/followw-app     # Electron app

# macOS App
open Followw.xcodeproj              # Open in Xcode
# Then ⌘R to build and run

# Electron App
npm install                         # Install dependencies (first time)
npm run dev                         # Run in development
npm run build:win                   # Build Windows installer
npm run build:mac                   # Build macOS installer
npm run build:linux                 # Build Linux AppImage
npm run build:all                   # Build all platforms

# Git Operations
git status                          # Check status
git add .                           # Stage changes
git commit -m "feat: description"   # Commit with message
git push -u origin <branch-name>    # Push to remote

# Version Management (Electron)
npm version patch                   # Increment patch version
npm version minor                   # Increment minor version
npm version major                   # Increment major version
```

### File Search Helpers

```bash
# Find Swift files
find /home/user/03aar/Followw -name "*.swift"

# Find JavaScript files
find /home/user/03aar/followw-app -name "*.js"

# Find documentation
find /home/user/03aar -name "*.md"

# Search for text in Swift files
grep -r "searchterm" /home/user/03aar/Followw --include="*.swift"

# Search for text in JavaScript files
grep -r "searchterm" /home/user/03aar/followw-app --include="*.js"
```

### Understanding the Codebase

**Start Here**:
1. Read `/FOLLOWW_COMPLETE_GUIDE.md` - High-level overview
2. Read `/Followw/ARCHITECTURE.md` - Deep technical dive
3. Read `/followw-app/README.md` - Electron app features
4. Browse code in `/Followw/Followw/` and `/followw-app/src/`

**Key Concepts**:
- **Flow State**: The mental state of focused work without interruption
- **Overlay**: The floating UI that appears on global shortcut
- **Focus Tasks**: Top 3-5 priority tasks shown prominently
- **Time Tracking**: Integrated timer that runs while user works
- **Local-First**: All data stored on device, no cloud dependency
- **Offline-First**: Works without internet connection

---

## Additional Resources

### External Documentation

- [Swift Documentation](https://developer.apple.com/documentation/swift)
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)
- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [Swift API Design Guidelines](https://swift.org/documentation/api-design-guidelines/)

### Repository Statistics

- **Total Lines of Code**: ~4,674+ lines (Swift + JavaScript/HTML/CSS)
- **Documentation Lines**: ~2,500+ lines
- **Total Files**: 50+ files (code + docs + config)
- **Languages**: Swift, JavaScript, HTML, CSS, JSON

### Project Status

- **Current Version**: 1.0.0 (both apps)
- **Status**: Production-ready
- **Platforms**: macOS 13+, Windows 10/11, Linux (Ubuntu, Fedora, Arch)
- **License**: MIT

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2025-11-16 | Created comprehensive CLAUDE.md guide | AI Assistant |

---

**Last Updated**: 2025-11-16
**Document Version**: 1.0.0
**Maintained By**: Repository maintainers and AI assistants

---

> This document is designed to help AI assistants quickly understand and work effectively in the Followw codebase. Keep it updated as the project evolves.
