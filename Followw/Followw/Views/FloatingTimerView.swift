import SwiftUI

struct FloatingTimerView: View {
    let task: Task

    @StateObject private var timerManager = TimerManager.shared
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        HStack(spacing: FollowwTheme.Spacing.md) {
            // Pulsing indicator
            Circle()
                .fill(FollowwTheme.Colors.accentBlue)
                .frame(width: 8, height: 8)
                .overlay(
                    Circle()
                        .stroke(FollowwTheme.Colors.accentBlue.opacity(0.3), lineWidth: 4)
                        .scaleEffect(timerManager.isRunning ? 2 : 1)
                        .opacity(timerManager.isRunning ? 0 : 1)
                        .animation(
                            Animation.easeInOut(duration: 1.5).repeatForever(autoreverses: false),
                            value: timerManager.isRunning
                        )
                )

            VStack(alignment: .leading, spacing: 2) {
                Text(task.title)
                    .font(FollowwTheme.Typography.callout)
                    .lineLimit(1)

                Text("tracking time")
                    .font(FollowwTheme.Typography.caption2)
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            }

            Spacer()

            // Timer display
            Text(timerManager.formattedTime)
                .font(FollowwTheme.Typography.headline)
                .monospacedDigit()
                .foregroundColor(FollowwTheme.Colors.accentBlue)

            // Stop button
            Button(action: {
                timerManager.stopTimer()
            }) {
                Image(systemName: "stop.circle.fill")
                    .font(.system(size: 20))
                    .foregroundColor(FollowwTheme.Colors.error)
            }
            .buttonStyle(.plain)
        }
        .padding(FollowwTheme.Spacing.md)
        .cardStyle()
        .overlay(
            RoundedRectangle(cornerRadius: FollowwTheme.CornerRadius.md)
                .stroke(FollowwTheme.Colors.accentBlue.opacity(0.3), lineWidth: 2)
        )
    }
}
