import SwiftUI

struct TodayView: View {
    @EnvironmentObject var dataManager: DataManager
    @StateObject private var timerManager = TimerManager.shared
    @Environment(\.colorScheme) var colorScheme

    @State private var showingNewTask = false
    @State private var newTaskTitle = ""
    @State private var selectedTask: Task?
    @State private var showTaskDetail = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FollowwTheme.Spacing.lg) {
                // Stats card
                statsCard

                // Quick add task
                quickAddTask

                // Focus tasks section
                if !focusTasks.isEmpty {
                    taskSection(title: "focus", tasks: focusTasks)
                }

                // Supporting tasks
                if !supportingTasks.isEmpty {
                    taskSection(title: "supporting", tasks: supportingTasks)
                }

                // Empty state
                if focusTasks.isEmpty && supportingTasks.isEmpty {
                    emptyState
                }

                // Floating timer (if active)
                if timerManager.isRunning, let task = timerManager.activeTask {
                    FloatingTimerView(task: task)
                        .transition(.scale.combined(with: .opacity))
                }
            }
            .padding(.vertical, FollowwTheme.Spacing.md)
        }
        .sheet(isPresented: $showTaskDetail) {
            if let task = selectedTask {
                TaskDetailView(task: task)
                    .environmentObject(dataManager)
            }
        }
    }

    private var statsCard: some View {
        HStack(spacing: FollowwTheme.Spacing.lg) {
            statItem(
                icon: "clock.fill",
                value: formattedTotalTime,
                label: "focus time"
            )

            Divider()
                .frame(height: 40)

            statItem(
                icon: "checkmark.circle.fill",
                value: "\(todayStats.tasksCompleted)",
                label: "completed"
            )

            Divider()
                .frame(height: 40)

            statItem(
                icon: "flame.fill",
                value: "\(todayStats.focusSessions)",
                label: "sessions"
            )
        }
        .padding(FollowwTheme.Spacing.md)
        .cardStyle()
    }

    private func statItem(icon: String, value: String, label: String) -> some View {
        HStack(spacing: FollowwTheme.Spacing.sm) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(FollowwTheme.Colors.accentBlue)

            VStack(alignment: .leading, spacing: 2) {
                Text(value)
                    .font(FollowwTheme.Typography.headline)
                    .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))

                Text(label)
                    .font(FollowwTheme.Typography.caption)
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            }
        }
        .frame(maxWidth: .infinity)
    }

    private var quickAddTask: some View {
        HStack(spacing: FollowwTheme.Spacing.sm) {
            Image(systemName: "plus.circle.fill")
                .foregroundColor(FollowwTheme.Colors.accentBlue)

            TextField("add task...", text: $newTaskTitle)
                .textFieldStyle(.plain)
                .font(FollowwTheme.Typography.body)
                .onSubmit {
                    addTask()
                }
        }
        .padding(FollowwTheme.Spacing.md)
        .cardStyle()
    }

    private func taskSection(title: String, tasks: [Task]) -> some View {
        VStack(alignment: .leading, spacing: FollowwTheme.Spacing.sm) {
            Text(title)
                .font(FollowwTheme.Typography.caption)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                .textCase(.lowercase)
                .padding(.horizontal, FollowwTheme.Spacing.xs)

            VStack(spacing: FollowwTheme.Spacing.xs) {
                ForEach(tasks) { task in
                    TaskRowView(task: task, onTap: {
                        selectedTask = task
                        showTaskDetail = true
                    })
                }
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: FollowwTheme.Spacing.md) {
            Image(systemName: "checkmark.circle")
                .font(.system(size: 48))
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))

            Text("you're all caught up")
                .font(FollowwTheme.Typography.title3)
                .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))

            Text("add a task to get started")
                .font(FollowwTheme.Typography.caption)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, FollowwTheme.Spacing.xxl)
    }

    // MARK: - Computed Properties

    private var todayStats: DailyStats {
        dataManager.getTodayStats()
    }

    private var formattedTotalTime: String {
        let hours = todayStats.totalMinutes / 60
        let minutes = todayStats.totalMinutes % 60

        if hours > 0 {
            return String(format: "%.1fh", Double(todayStats.totalMinutes) / 60.0)
        } else {
            return "\(minutes)m"
        }
    }

    private var focusTasks: [Task] {
        dataManager.getTodayTasks().filter { $0.isFocusTask }
    }

    private var supportingTasks: [Task] {
        dataManager.getTodayTasks().filter { !$0.isFocusTask }
    }

    // MARK: - Actions

    private func addTask() {
        guard !newTaskTitle.trimmingCharacters(in: .whitespaces).isEmpty else { return }

        let task = Task(
            title: newTaskTitle,
            isFocusTask: focusTasks.count < 3,
            dueDate: Date()
        )

        dataManager.addTask(task)
        newTaskTitle = ""
    }
}
