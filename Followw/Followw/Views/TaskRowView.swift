import SwiftUI

struct TaskRowView: View {
    let task: Task
    let onTap: () -> Void

    @EnvironmentObject var dataManager: DataManager
    @StateObject private var timerManager = TimerManager.shared
    @Environment(\.colorScheme) var colorScheme

    @State private var isHovered = false

    var body: some View {
        HStack(spacing: FollowwTheme.Spacing.md) {
            // Checkbox
            Button(action: toggleComplete) {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 20))
                    .foregroundColor(
                        task.isCompleted
                            ? FollowwTheme.Colors.success
                            : FollowwTheme.Colors.secondaryText(for: colorScheme)
                    )
            }
            .buttonStyle(.plain)

            // Task content
            VStack(alignment: .leading, spacing: 4) {
                Text(task.title)
                    .font(FollowwTheme.Typography.body)
                    .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
                    .strikethrough(task.isCompleted)

                // Metadata
                HStack(spacing: FollowwTheme.Spacing.sm) {
                    if let clientId = task.clientId,
                       let client = dataManager.clients.first(where: { $0.id == clientId }) {
                        Label(client.name, systemImage: "person.circle.fill")
                            .font(FollowwTheme.Typography.caption2)
                            .foregroundColor(client.swiftUIColor)
                    }

                    if task.totalTimeSpent > 0 {
                        Label(
                            TimeInterval(task.totalTimeSpent).formattedShort(),
                            systemImage: "clock.fill"
                        )
                        .font(FollowwTheme.Typography.caption2)
                        .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                    }

                    if !task.tags.isEmpty {
                        HStack(spacing: 4) {
                            ForEach(task.tags.prefix(2), id: \.self) { tag in
                                Text("#\(tag)")
                                    .font(FollowwTheme.Typography.caption2)
                                    .foregroundColor(FollowwTheme.Colors.accentBlue)
                            }
                        }
                    }
                }
            }

            Spacer()

            // Timer button
            if !task.isCompleted {
                Button(action: toggleTimer) {
                    Image(systemName: isTimerActive ? "pause.circle.fill" : "play.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(
                            isTimerActive
                                ? FollowwTheme.Colors.accentBlue
                                : FollowwTheme.Colors.secondaryText(for: colorScheme)
                        )
                }
                .buttonStyle(.plain)
                .opacity(isHovered || isTimerActive ? 1 : 0)
            }
        }
        .padding(FollowwTheme.Spacing.md)
        .cardStyle()
        .onHover { hovering in
            withAnimation(FollowwTheme.Animation.fast) {
                isHovered = hovering
            }
        }
        .onTapGesture {
            onTap()
        }
        .animation(FollowwTheme.Animation.fast, value: task.isCompleted)
    }

    private var isTimerActive: Bool {
        timerManager.activeTask?.id == task.id && timerManager.isRunning
    }

    private func toggleComplete() {
        var updatedTask = task
        updatedTask.isCompleted.toggle()
        if updatedTask.isCompleted {
            updatedTask.completedAt = Date()
        } else {
            updatedTask.completedAt = nil
        }
        dataManager.updateTask(updatedTask)
    }

    private func toggleTimer() {
        timerManager.toggleTimer(for: task)
    }
}
