# Contributing to Followw

Thank you for your interest in contributing to Followw! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Be respectful, constructive, and professional in all interactions. We're building something beautiful together.

## Getting Started

### Prerequisites

- macOS 13.0 (Ventura) or later
- Xcode 15.0 or later
- Swift 5.9 or later
- Basic understanding of SwiftUI and macOS development

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/followw.git
   cd followw/Followw
   ```

2. **Open in Xcode**
   ```bash
   open Followw.xcodeproj
   ```

3. **Configure Signing**
   - Select the Followw target
   - Go to Signing & Capabilities
   - Select your development team
   - Xcode will automatically provision the app

4. **Build and Run**
   - Press `⌘R` to build and run
   - The app will appear in your menu bar
   - Press `⌘⇧Space` to test the overlay

### Project Structure

```
Followw/
├── Models/           # Data models
├── Services/         # Business logic and managers
├── Views/            # SwiftUI views
├── Utilities/        # Helpers and extensions
└── Assets.xcassets/  # Images and icons
```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - Feature branches
- `bugfix/bug-name` - Bug fix branches

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the code style guidelines below
   - Write clear, self-documenting code
   - Add comments for complex logic

3. **Test Thoroughly**
   - Manual testing of all affected features
   - Verify animations and transitions
   - Test in both light and dark mode
   - Check keyboard navigation

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add feature: brief description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

## Code Style Guidelines

### Swift Style

Follow Apple's [Swift API Design Guidelines](https://swift.org/documentation/api-design-guidelines/):

```swift
// Good
func addTask(_ task: Task) {
    tasks.append(task)
    saveData()
}

// Bad
func add_task(task: Task) {
    tasks.append(task)
    saveData()
}
```

### SwiftUI Best Practices

1. **Extract Complex Views**
   ```swift
   // Good
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
   ```

2. **Use Computed Properties**
   ```swift
   // Good
   private var filteredTasks: [Task] {
       tasks.filter { !$0.isCompleted }
   }

   // Avoid
   private func getFilteredTasks() -> [Task] {
       return tasks.filter { !$0.isCompleted }
   }
   ```

3. **Avoid Deep Nesting**
   - Use guard statements for early returns
   - Extract subviews for clarity
   - Keep view bodies shallow

### Naming Conventions

- **Variables**: camelCase (`taskTitle`, `isCompleted`)
- **Functions**: camelCase (`addTask()`, `toggleTimer()`)
- **Classes/Structs**: PascalCase (`DataManager`, `TaskRowView`)
- **Constants**: camelCase or UPPER_CASE for global (`accentBlue`, `API_KEY`)

### Comments

```swift
// MARK: - Section Title

/// Brief description of the function
/// - Parameter task: The task to add
/// - Returns: Success status
func addTask(_ task: Task) -> Bool {
    // Implementation
}
```

## Design Guidelines

### The Golden Rule

Every design decision must answer:
> "Does this preserve flow?"

If it doesn't — don't build it.

### UI Principles

1. **Minimalism** - Remove everything non-essential
2. **Clarity** - Information should be instantly legible
3. **Animation** - Motion should communicate, not decorate
4. **Speed** - Every interaction should feel instant (<300ms)

### Design System Usage

Always use the design system:

```swift
// Good
Text("Hello")
    .font(FollowwTheme.Typography.body)
    .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
    .padding(FollowwTheme.Spacing.md)

// Bad
Text("Hello")
    .font(.system(size: 17))
    .foregroundColor(.black)
    .padding(16)
```

### Animation Guidelines

- **Duration**: 180-220ms for most transitions
- **Easing**: Use `easeInOut` or custom curves
- **Purpose**: Every animation must serve a cognitive purpose
- **Performance**: Maintain 60fps minimum

## Feature Development

### Adding a New View

1. Create the view file in `Views/`
2. Follow existing view structure
3. Use `@EnvironmentObject` for managers
4. Add to navigation/routing as needed
5. Update documentation

### Adding a New Model

1. Create the model file in `Models/`
2. Conform to `Identifiable`, `Codable`, `Hashable`
3. Add CRUD methods to `DataManager`
4. Update persistence logic
5. Add sample data for testing

### Adding a New Feature

1. **Plan** - Sketch the feature flow
2. **Design** - Create mockups (if UI-related)
3. **Implement** - Write clean, testable code
4. **Test** - Thoroughly test all scenarios
5. **Document** - Update relevant docs
6. **PR** - Submit with clear description

## Testing

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Animations are smooth (60fps)
- [ ] Works in light and dark mode
- [ ] Keyboard navigation functional
- [ ] Data persists correctly
- [ ] No memory leaks (check Instruments)

### UI Testing

Test these critical flows:
1. Open/close overlay
2. Create task
3. Start/stop timer
4. Complete task
5. Create client/project
6. View analytics

## Performance

### Response Time Targets

- Overlay show/hide: <200ms
- Task creation: <100ms
- Timer operations: <50ms
- View transitions: 180-220ms

### Optimization Tips

1. Use `LazyVStack` for long lists
2. Avoid heavy computations in view bodies
3. Profile with Instruments regularly
4. Minimize @Published updates
5. Use hardware-accelerated animations

## Documentation

### Code Documentation

- Document all public APIs
- Add inline comments for complex logic
- Update README for new features
- Create usage examples

### Commit Messages

Follow conventional commits:

```
feat: add client time breakdown chart
fix: resolve timer not stopping bug
docs: update installation instructions
style: format code according to guidelines
refactor: simplify task filtering logic
perf: optimize task list rendering
test: add unit tests for DataManager
```

## Pull Request Process

1. **Create PR** with clear title and description
2. **Link Issues** if applicable
3. **Request Review** from maintainers
4. **Address Feedback** promptly
5. **Keep Updated** - rebase if needed
6. **Celebrate** when merged! 🎉

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested this

## Screenshots
If UI-related, add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested in light/dark mode
```

## Questions?

- Open an issue for bugs
- Start a discussion for feature ideas
- Contact maintainers for clarification

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- About screen (for significant contributions)

Thank you for helping make Followw better! 🚀

---

Remember: We're not just building an app — we're building a movement toward better work.
