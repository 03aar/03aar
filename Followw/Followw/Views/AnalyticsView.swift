import SwiftUI
import Charts

struct AnalyticsView: View {
    @EnvironmentObject var dataManager: DataManager
    @Environment(\.colorScheme) var colorScheme

    @State private var selectedPeriod: Period = .week

    enum Period: String, CaseIterable {
        case week = "week"
        case month = "month"
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FollowwTheme.Spacing.lg) {
                // Header
                HStack {
                    Text("analytics")
                        .font(FollowwTheme.Typography.title3)
                        .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
                        .textCase(.lowercase)

                    Spacer()

                    Picker("Period", selection: $selectedPeriod) {
                        ForEach(Period.allCases, id: \.self) { period in
                            Text(period.rawValue)
                                .tag(period)
                        }
                    }
                    .pickerStyle(.segmented)
                    .frame(width: 150)
                }

                // Today's summary
                todaySummary

                // Weekly chart
                weeklyChart

                // Breakdown by client
                if !dataManager.clients.isEmpty {
                    clientBreakdown
                }

                // Insights
                insightsCard
            }
            .padding(.vertical, FollowwTheme.Spacing.md)
        }
    }

    private var todaySummary: some View {
        let stats = dataManager.getTodayStats()

        return VStack(alignment: .leading, spacing: FollowwTheme.Spacing.sm) {
            Text("today")
                .font(FollowwTheme.Typography.caption)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                .textCase(.lowercase)

            HStack(spacing: FollowwTheme.Spacing.md) {
                summaryItem(
                    title: "focus time",
                    value: formatMinutes(stats.totalMinutes),
                    icon: "clock.fill",
                    color: FollowwTheme.Colors.accentBlue
                )

                Divider()
                    .frame(height: 60)

                summaryItem(
                    title: "tasks done",
                    value: "\(stats.tasksCompleted)",
                    icon: "checkmark.circle.fill",
                    color: FollowwTheme.Colors.success
                )

                Divider()
                    .frame(height: 60)

                summaryItem(
                    title: "sessions",
                    value: "\(stats.focusSessions)",
                    icon: "flame.fill",
                    color: FollowwTheme.Colors.warning
                )
            }
            .padding(FollowwTheme.Spacing.md)
            .cardStyle()
        }
    }

    private func summaryItem(title: String, value: String, icon: String, color: Color) -> some View {
        VStack(spacing: FollowwTheme.Spacing.sm) {
            Image(systemName: icon)
                .font(.system(size: 24))
                .foregroundColor(color)

            Text(value)
                .font(FollowwTheme.Typography.title2)
                .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))

            Text(title)
                .font(FollowwTheme.Typography.caption)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
        }
        .frame(maxWidth: .infinity)
    }

    private var weeklyChart: some View {
        VStack(alignment: .leading, spacing: FollowwTheme.Spacing.sm) {
            Text("this week")
                .font(FollowwTheme.Typography.caption)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                .textCase(.lowercase)

            // Simple bar chart representation
            VStack(spacing: FollowwTheme.Spacing.sm) {
                ForEach(dataManager.getWeeklyStats(), id: \.date) { stat in
                    HStack(spacing: FollowwTheme.Spacing.sm) {
                        Text(stat.date.formatted(style: .short))
                            .font(FollowwTheme.Typography.caption)
                            .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                            .frame(width: 80, alignment: .leading)

                        GeometryReader { geometry in
                            RoundedRectangle(cornerRadius: 4)
                                .fill(FollowwTheme.Colors.accentBlue.opacity(0.8))
                                .frame(width: barWidth(for: stat.totalMinutes, in: geometry.size.width))
                        }
                        .frame(height: 24)

                        Text(formatMinutes(stat.totalMinutes))
                            .font(FollowwTheme.Typography.caption)
                            .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
                            .frame(width: 50, alignment: .trailing)
                    }
                }
            }
            .padding(FollowwTheme.Spacing.md)
            .cardStyle()
        }
    }

    private var clientBreakdown: some View {
        VStack(alignment: .leading, spacing: FollowwTheme.Spacing.sm) {
            Text("by client")
                .font(FollowwTheme.Typography.caption)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                .textCase(.lowercase)

            VStack(spacing: FollowwTheme.Spacing.xs) {
                ForEach(dataManager.clients.prefix(5)) { client in
                    HStack {
                        Circle()
                            .fill(client.swiftUIColor)
                            .frame(width: 12, height: 12)

                        Text(client.name)
                            .font(FollowwTheme.Typography.callout)

                        Spacer()

                        Text(getClientTime(client))
                            .font(FollowwTheme.Typography.callout)
                            .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                    }
                    .padding(FollowwTheme.Spacing.sm)
                }
            }
            .padding(FollowwTheme.Spacing.md)
            .cardStyle()
        }
    }

    private var insightsCard: some View {
        VStack(alignment: .leading, spacing: FollowwTheme.Spacing.sm) {
            HStack {
                Image(systemName: "sparkles")
                    .foregroundColor(FollowwTheme.Colors.accentBlue)
                Text("insights")
                    .font(FollowwTheme.Typography.caption)
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                    .textCase(.lowercase)
            }

            VStack(alignment: .leading, spacing: FollowwTheme.Spacing.sm) {
                insightRow(insight: generateInsight())
            }
            .padding(FollowwTheme.Spacing.md)
            .cardStyle()
        }
    }

    private func insightRow(insight: String) -> some View {
        HStack(alignment: .top, spacing: FollowwTheme.Spacing.sm) {
            Text("•")
                .foregroundColor(FollowwTheme.Colors.accentBlue)

            Text(insight)
                .font(FollowwTheme.Typography.callout)
                .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
        }
    }

    // MARK: - Helper Functions

    private func formatMinutes(_ minutes: Int) -> String {
        let hours = minutes / 60
        let mins = minutes % 60

        if hours > 0 {
            return String(format: "%.1fh", Double(minutes) / 60.0)
        } else {
            return "\(mins)m"
        }
    }

    private func barWidth(for minutes: Int, in maxWidth: CGFloat) -> CGFloat {
        let maxMinutes = dataManager.getWeeklyStats().map { $0.totalMinutes }.max() ?? 1
        return maxWidth * CGFloat(minutes) / CGFloat(max(maxMinutes, 1))
    }

    private func getClientTime(_ client: Client) -> String {
        let tasks = dataManager.tasks.filter { $0.clientId == client.id }
        let totalSeconds = tasks.reduce(0.0) { $0 + $1.totalTimeSpent }
        return TimeInterval(totalSeconds).formattedShort()
    }

    private func generateInsight() -> String {
        let stats = dataManager.getTodayStats()
        let weeklyStats = dataManager.getWeeklyStats()
        let avgMinutes = weeklyStats.reduce(0) { $0 + $1.totalMinutes } / max(weeklyStats.count, 1)

        if stats.totalMinutes > avgMinutes {
            return "you're having a great day! \(stats.totalMinutes - avgMinutes) minutes above your average."
        } else if stats.focusSessions >= 3 {
            return "excellent focus today with \(stats.focusSessions) sessions completed."
        } else {
            return "keep building momentum. every session counts."
        }
    }
}
