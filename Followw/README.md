# FOLLOWW — The Work OS for Flow

<div align="center">

**work that moves with you.**

A production-ready macOS productivity system that eliminates friction between intention and action.

[![Swift](https://img.shields.io/badge/Swift-5.9-orange.svg)](https://swift.org)
[![Platform](https://img.shields.io/badge/Platform-macOS%2013.0+-blue.svg)](https://www.apple.com/macos/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Overview

Followw is not another productivity app — it's a **Flow Operating System** built for freelancers, founders, and professionals who want to work without friction.

It eliminates:
- The chaos of switching between apps
- The friction of managing tasks across tools
- The mental overhead of tracking time or remembering context

Followw becomes your instant workspace, available anywhere on your system, always one shortcut away.

## Core Philosophy

> "Work shouldn't pull you out of flow. Your workspace should follow your mind, not interrupt it."

Everything — the design, the speed, the intelligence, the emotion — exists to maintain momentum.

Followw is not about managing work. It's about staying in motion.

## Features

### 🚀 Instant Access
- **Global Shortcut**: Press `⌘⇧Space` anywhere to summon Followw
- **Overlay Interface**: Beautiful translucent window that appears over all apps
- **Zero Friction**: Opens in <200ms, disappears instantly

### ✅ Task Management
- **Today View**: Minimal daily dashboard focused on what matters now
- **Focus Tasks**: Highlight 3-5 key items for deep work
- **Quick Add**: Natural language task creation
- **Rich Context**: Add notes, links, files, and tags to any task
- **Smart Organization**: Group by clients, projects, or focus areas

### ⏱️ Time Tracking
- **Floating Timer**: Elegant timer overlay while you work
- **Auto-tracking**: Automatic duration logging per task
- **Daily Summaries**: Beautiful end-of-day statistics
- **Weekly Analytics**: Visualize your flow patterns

### 🎯 Client & Project Management
- **Hierarchical Structure**: Clients → Projects → Tasks
- **Color Coding**: Visual organization with custom colors
- **Time Allocation**: See how much time you spend per client
- **Project Dashboards**: Context and files all in one place

### 📊 Analytics & Insights
- **Flow Metrics**: Track focus time, sessions, and completion rates
- **Visual Reports**: Beautiful charts and breakdowns
- **Smart Insights**: AI-generated summaries of your work patterns
- **Export Ready**: Billing and time reports at your fingertips

### 🎨 Beautiful Design
- **Scandinavian Minimalism**: Clean, calm, human-centered
- **Subtle Animations**: Fluid micro-interactions that guide without distracting
- **Theme Support**: Light, Dark, and Zen modes
- **Custom Accents**: Personalize with your own colors

### 🔒 Privacy First
- **Local Storage**: All data stored locally and encrypted
- **Offline-First**: Full functionality without internet
- **No Tracking**: Zero telemetry or analytics collection
- **Export Anytime**: Your data is yours, always

## Installation

### Requirements
- macOS 13.0 (Ventura) or later
- Xcode 15.0 or later (for building from source)

### Building from Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/followw.git
   cd followw/Followw
   ```

2. **Open in Xcode**
   ```bash
   open Followw.xcodeproj
   ```

3. **Build and Run**
   - Select your development team in Signing & Capabilities
   - Press `⌘R` to build and run
   - Or use Product → Archive to create a distributable build

### Running the App

1. **First Launch**
   - The app will appear in your menu bar (look for the ◉ icon)
   - Press `⌘⇧Space` to open the overlay

2. **Permissions**
   - Grant accessibility permissions when prompted (required for global hotkey)
   - System Preferences → Privacy & Security → Accessibility

## Usage

### Quick Start

1. **Open Followw** - Press `⌘⇧Space` anywhere on your Mac
2. **Add a task** - Type in the quick add field and press Enter
3. **Start working** - Click the play button to start tracking time
4. **Stay focused** - The floating timer shows your progress
5. **Complete tasks** - Check them off as you finish
6. **End your day** - View your beautiful daily summary

### Keyboard Shortcuts

- `⌘⇧Space` - Show/Hide Followw overlay
- `Enter` - Create new task (when in quick add field)
- `Esc` - Close overlay or dialog
- `⌘,` - Open Settings

### Task Management Tips

- **Focus Tasks**: Mark 3-5 most important tasks for the day
- **Add Context**: Use notes for details, links for resources
- **Tag Everything**: Use hashtags for quick filtering
- **Client Association**: Link tasks to clients for time tracking

### Time Tracking Best Practices

- Start timer when beginning focused work
- Let it run while you're in flow
- Stop when taking breaks or context switching
- Review daily summaries to understand your patterns

## Architecture

### Tech Stack
- **Language**: Swift 5.9
- **UI Framework**: SwiftUI
- **Storage**: UserDefaults (encrypted JSON)
- **Target**: macOS 13.0+

### Project Structure

```
Followw/
├── Followw.xcodeproj/
└── Followw/
    ├── FollowwApp.swift          # App entry point & delegate
    ├── Models/
    │   ├── Task.swift            # Task data model
    │   ├── Client.swift          # Client data model
    │   ├── Project.swift         # Project data model
    │   └── TimeEntry.swift       # Time tracking model
    ├── Services/
    │   ├── DataManager.swift     # Data persistence & CRUD
    │   ├── OverlayManager.swift  # Window management
    │   └── TimerManager.swift    # Time tracking logic
    ├── Views/
    │   ├── OverlayContentView.swift
    │   ├── TodayView.swift
    │   ├── TaskRowView.swift
    │   ├── TaskDetailView.swift
    │   ├── FloatingTimerView.swift
    │   ├── AllTasksView.swift
    │   ├── ProjectsView.swift
    │   ├── ClientsView.swift
    │   ├── AnalyticsView.swift
    │   └── SettingsView.swift
    ├── Utilities/
    │   ├── FollowwTheme.swift    # Design system
    │   └── Extensions.swift      # Helper extensions
    └── Assets.xcassets/
```

### Design System

Followw follows a strict design code:

1. **Every interaction must be reversible** - No friction or fear
2. **Every screen must be legible at a glance** - Clarity over minimalism
3. **Every animation must serve cognition** - Motion communicates
4. **Every second counts** - Sub-300ms response times

### Color Palette

- **Primary**: Mist White (#F9FAFB), Graphite (#1C1C1E), Accent Blue (#3A76F0)
- **Semantic**: Success (#10B981), Warning (#F59E0B), Error (#EF4444)
- **Neutrals**: 9-step gray scale from 50-900

### Typography

- **Font**: SF Pro (System default)
- **Sizes**: Caption (11pt) → Title (34pt)
- **Line Spacing**: Generous for readability
- **Weight**: Regular to Semibold (no black weights)

## Customization

### Themes
- Light mode for daytime clarity
- Dark mode for evening focus
- Zen mode for minimal distraction

### Accent Colors
- Choose any color to personalize your workspace
- Applied to icons, buttons, and progress indicators

### Sounds & Notifications
- Optional sound effects for task completion
- Gentle notifications for timer events
- All customizable in Settings

## Development

### Code Style
- SwiftUI-first architecture
- MVVM pattern with ObservableObject
- Functional composition over inheritance
- Explicit over implicit

### Contributing

Followw is currently in private development. If you'd like to contribute:

1. Open an issue to discuss proposed changes
2. Fork the repository
3. Create a feature branch
4. Make your changes with tests
5. Submit a pull request

### Roadmap

**Phase 1: Foundation (v1.0)** ✅
- macOS tray + overlay system
- Tasks, projects, time tracking
- Today view and analytics
- Offline-first core

**Phase 2: Intelligence (v2.0)**
- AI summaries and focus insights
- Calendar integration
- Smart reminders
- Pomodoro + deep work features

**Phase 3: Collaboration (v3.0)**
- Team dashboards
- Shared projects
- Integration with Notion, Slack, Figma
- Plugin system

**Phase 4: Flow OS (v4.0)**
- Windows and Linux support
- Mobile companion
- Cloud sync
- Enterprise features

## Philosophy

Followw is built on the principle that **work should preserve flow**, not interrupt it.

Every feature answers one question:
> "Does this preserve flow?"

If it doesn't — we don't build it.

## Credits

**Designed & Built by**: The Followw Team
**Inspiration**: Notion's clarity, Toggl's awareness, Raycast's speed, Apple's aesthetic

## License

Copyright © 2025 Followw. All rights reserved.

This is proprietary software. See LICENSE for details.

---

<div align="center">

**Made with flow in mind.**

[Website](https://followw.app) • [Support](https://followw.app/support) • [Twitter](https://twitter.com/followwapp)

</div>
