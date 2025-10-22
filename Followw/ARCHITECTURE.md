# Followw Architecture Documentation

## Overview

Followw is built as a native macOS application using Swift and SwiftUI, following modern Apple platform development practices. The architecture prioritizes performance, offline-first capabilities, and a fluid user experience.

## Core Architecture Pattern

### MVVM + Services

```
┌─────────────────────────────────────────────┐
│              User Interface                  │
│          (SwiftUI Views)                     │
└──────────────┬──────────────────────────────┘
               │
               │ ObservableObject
               │
┌──────────────▼──────────────────────────────┐
│         View Models & Managers               │
│  (DataManager, OverlayManager, TimerManager) │
└──────────────┬──────────────────────────────┘
               │
               │ CRUD Operations
               │
┌──────────────▼──────────────────────────────┐
│           Data Models                        │
│   (Task, Client, Project, TimeEntry)         │
└──────────────┬──────────────────────────────┘
               │
               │ Persistence
               │
┌──────────────▼──────────────────────────────┐
│        Local Storage                         │
│  (UserDefaults + JSON Encoding)              │
└──────────────────────────────────────────────┘
```

## Layer Breakdown

### 1. Application Layer

**FollowwApp.swift + AppDelegate**

Responsibilities:
- App lifecycle management
- Menu bar setup and management
- Global hotkey registration (⌘⇧Space)
- Window and overlay orchestration
- App-level state coordination

Key Features:
- Runs as a menu bar app (accessory activation policy)
- Registers global event monitors for hotkey
- Manages overlay window lifecycle
- Handles system-level permissions

### 2. Service Layer

#### DataManager (Singleton)
```swift
class DataManager: ObservableObject
```

Responsibilities:
- CRUD operations for all data types
- Data persistence via JSON encoding
- In-memory data management
- Business logic for queries and filters

Data Operations:
- Task management (add, update, delete, complete)
- Client management
- Project management
- Time entry tracking
- Analytics computation

Storage Strategy:
- Uses UserDefaults for simplicity
- JSON encoding/decoding for all models
- Immediate persistence on changes
- Thread-safe operations via main actor

#### OverlayManager (Singleton)
```swift
class OverlayManager: ObservableObject
```

Responsibilities:
- Overlay window creation and lifecycle
- Show/hide animations
- Window positioning and sizing
- State management for overlay visibility

Window Configuration:
- Borderless, floating window
- 60% screen width, 70% screen height
- Centered on main screen
- Translucent background with blur effect
- Animated in/out with easing curves

#### TimerManager (Singleton)
```swift
class TimerManager: ObservableObject
```

Responsibilities:
- Active timer state management
- Elapsed time tracking
- Timer start/stop logic
- Integration with DataManager for persistence

Timer Features:
- One active timer at a time
- Automatic time entry creation
- Live elapsed time updates (1 second intervals)
- Formatted time display

### 3. Model Layer

#### Core Data Models

**Task**
```swift
struct Task: Identifiable, Codable, Hashable
```
- Unique identifier (UUID)
- Title, notes, completion status
- Focus task flag
- Client and project relationships
- Tags, links, attachments
- Due date and timestamps
- Time entry references

**Client**
```swift
struct Client: Identifiable, Codable, Hashable
```
- Name and visual identity (color, icon)
- Notes and archive status
- Project relationships

**Project**
```swift
struct Project: Identifiable, Codable, Hashable
```
- Name and description
- Client relationship
- Visual identity
- Task relationships

**TimeEntry**
```swift
struct TimeEntry: Identifiable, Codable, Hashable
```
- Task reference
- Start/end timestamps
- Duration calculation
- Notes

**DailyStats**
```swift
struct DailyStats: Codable
```
- Date-based statistics
- Total focus time
- Tasks completed
- Session count
- Streak tracking

### 4. View Layer

#### View Hierarchy

```
OverlayContentView (Root)
├── HeaderView
│   ├── Greeting
│   ├── View Tabs
│   └── Close Button
├── ContentView (Dynamic)
│   ├── TodayView
│   │   ├── Stats Card
│   │   ├── Quick Add
│   │   ├── Focus Tasks
│   │   ├── Supporting Tasks
│   │   └── Floating Timer
│   ├── AllTasksView
│   │   ├── Search Bar
│   │   ├── Filter Picker
│   │   └── Task List
│   ├── ProjectsView
│   │   ├── Project Grid
│   │   └── New Project Sheet
│   ├── ClientsView
│   │   ├── Client List
│   │   └── New Client Sheet
│   └── AnalyticsView
│       ├── Today Summary
│       ├── Weekly Chart
│       ├── Client Breakdown
│       └── Insights Card
└── Modal Overlays
    ├── TaskDetailView
    └── Settings Sheets
```

#### View Communication

Views communicate through:
1. **EnvironmentObjects** - Shared managers (DataManager, OverlayManager)
2. **Bindings** - Two-way state sync for forms
3. **Callbacks** - Action handlers (onTap, onComplete)
4. **Published Properties** - Reactive updates via ObservableObject

### 5. Design System Layer

**FollowwTheme.swift**

Centralized design tokens:
- **Colors**: Semantic color system (light/dark adaptive)
- **Typography**: SF Pro size scale
- **Spacing**: 8pt baseline grid
- **Corner Radius**: Consistent rounding values
- **Shadows**: Subtle depth system
- **Animations**: Timing curves and durations

View Modifiers:
- `cardStyle()` - Standard card appearance
- `PrimaryButtonStyle` - Main action buttons
- `SecondaryButtonStyle` - Secondary actions

## Data Flow

### Creating a Task

```
User Input (TextField)
    ↓
TodayView.addTask()
    ↓
DataManager.addTask(task)
    ↓
tasks.append() + saveData()
    ↓
@Published tasks triggers view update
    ↓
TaskRowView appears with animation
```

### Starting a Timer

```
User taps play button
    ↓
TaskRowView.toggleTimer()
    ↓
TimerManager.startTimer(for: task)
    ↓
Create TimeEntry via DataManager
    ↓
Start Timer.scheduledTimer
    ↓
Update elapsedTime every second
    ↓
@Published elapsedTime updates FloatingTimerView
    ↓
UI shows live timer
```

### Completing a Task

```
User taps checkbox
    ↓
TaskRowView.toggleComplete()
    ↓
Update task.isCompleted + completedAt
    ↓
DataManager.updateTask()
    ↓
Save to UserDefaults
    ↓
@Published tasks updates all views
    ↓
Task row animates with strikethrough
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**
   - `LazyVStack` for long lists
   - `LazyVGrid` for project grids
   - Conditional view rendering

2. **State Management**
   - Minimal @State properties
   - Computed properties for derived data
   - Avoid unnecessary @Published updates

3. **Animation Performance**
   - Hardware-accelerated CALayer animations
   - Reduced motion support
   - 60fps target for all transitions

4. **Memory Management**
   - Singleton pattern for managers (single instance)
   - Struct-based models (value semantics)
   - Automatic reference counting

### Response Time Targets

- Overlay show/hide: <200ms
- Task creation: <100ms
- Timer start/stop: <50ms
- Data save: <100ms
- View transitions: 180-220ms

## Security & Privacy

### Local Storage

- All data stored in UserDefaults
- JSON encoding for portability
- Future: AES-256 encryption

### Permissions

- Accessibility (for global hotkey)
- No network access required
- No telemetry or analytics

### Data Ownership

- Users own all data
- Export functionality planned
- No cloud dependency (offline-first)

## Extensibility

### Plugin Architecture (Future)

Planned extension points:
- Custom data providers
- Integration hooks
- Custom views and themes
- Export formatters

### API Design (Future)

RESTful API for sync:
- JWT authentication
- End-to-end encryption
- Conflict resolution
- Offline queue

## Testing Strategy

### Unit Tests
- Model logic and computed properties
- DataManager CRUD operations
- TimerManager timing logic

### UI Tests
- Critical user flows
- Overlay show/hide
- Task creation and completion
- Timer start/stop

### Manual Testing
- Visual regression testing
- Animation smoothness
- Keyboard navigation
- Accessibility features

## Build & Deployment

### Build Configuration

- **Debug**: Development with detailed logging
- **Release**: Optimized, signed, notarized

### Signing & Notarization

- Apple Developer certificate required
- Hardened runtime enabled
- Notarization for Gatekeeper

### Distribution

- Direct download (DMG)
- Mac App Store (future)
- Auto-update system (future)

## Future Architecture Improvements

### Phase 2+

1. **Core Data Migration**
   - Replace UserDefaults with Core Data
   - Better performance for large datasets
   - Relationship management

2. **CloudKit Sync**
   - Optional cloud sync
   - Multi-device support
   - Conflict resolution

3. **Plugin System**
   - JavaScript-based plugins
   - Safe sandbox execution
   - Community extensions

4. **AI Layer**
   - Local LLM inference
   - Smart task suggestions
   - Natural language parsing

## Conclusion

Followw's architecture prioritizes:
- **Speed**: Sub-second response times
- **Simplicity**: Clear separation of concerns
- **Privacy**: Local-first data ownership
- **Beauty**: Smooth animations and transitions

The current architecture supports the v1.0 feature set while providing clear paths for future enhancements.
