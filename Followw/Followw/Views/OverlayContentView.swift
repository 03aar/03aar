import SwiftUI

struct OverlayContentView: View {
    @EnvironmentObject var dataManager: DataManager
    @EnvironmentObject var overlayManager: OverlayManager
    @Environment(\.colorScheme) var colorScheme

    @State private var selectedView: ViewType = .today
    @State private var searchText: String = ""

    enum ViewType {
        case today
        case allTasks
        case projects
        case clients
        case analytics
    }

    var body: some View {
        ZStack {
            // Background with blur
            VisualEffectBlur(material: .hudWindow, blendingMode: .behindWindow)
                .cornerRadius(FollowwTheme.CornerRadius.xl)

            VStack(spacing: 0) {
                // Header
                headerView

                Divider()
                    .padding(.horizontal, FollowwTheme.Spacing.md)

                // Content
                contentView
                    .padding(FollowwTheme.Spacing.lg)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .cornerRadius(FollowwTheme.CornerRadius.xl)
        .shadow(color: Color.black.opacity(0.3), radius: 30, x: 0, y: 10)
    }

    private var headerView: some View {
        HStack(spacing: FollowwTheme.Spacing.md) {
            // Greeting and view selector
            VStack(alignment: .leading, spacing: 4) {
                Text(greeting)
                    .font(FollowwTheme.Typography.title3)
                    .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))

                Text("let's get back in flow.")
                    .font(FollowwTheme.Typography.caption)
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            }

            Spacer()

            // View tabs
            HStack(spacing: FollowwTheme.Spacing.sm) {
                viewTab(title: "today", type: .today, icon: "sun.max.fill")
                viewTab(title: "tasks", type: .allTasks, icon: "checkmark.circle.fill")
                viewTab(title: "projects", type: .projects, icon: "folder.fill")
            }

            Spacer()

            // Close button
            Button(action: {
                overlayManager.hide()
            }) {
                Image(systemName: "xmark")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                    .frame(width: 28, height: 28)
                    .background(FollowwTheme.Colors.gray200.opacity(0.5))
                    .cornerRadius(FollowwTheme.CornerRadius.sm)
            }
            .buttonStyle(.plain)
        }
        .padding(FollowwTheme.Spacing.lg)
    }

    private func viewTab(title: String, type: ViewType, icon: String) -> some View {
        Button(action: {
            withAnimation(FollowwTheme.Animation.fast) {
                selectedView = type
            }
        }) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 12, weight: .medium))
                Text(title)
                    .font(FollowwTheme.Typography.caption)
            }
            .foregroundColor(
                selectedView == type
                    ? .white
                    : FollowwTheme.Colors.secondaryText(for: colorScheme)
            )
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(
                selectedView == type
                    ? FollowwTheme.Colors.accentBlue
                    : Color.clear
            )
            .cornerRadius(FollowwTheme.CornerRadius.sm)
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private var contentView: some View {
        switch selectedView {
        case .today:
            TodayView()
        case .allTasks:
            AllTasksView()
        case .projects:
            ProjectsView()
        case .clients:
            ClientsView()
        case .analytics:
            AnalyticsView()
        }
    }

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 0..<12:
            return "good morning."
        case 12..<17:
            return "good afternoon."
        case 17..<21:
            return "good evening."
        default:
            return "good night."
        }
    }
}

// MARK: - Visual Effect Blur

struct VisualEffectBlur: NSViewRepresentable {
    var material: NSVisualEffectView.Material
    var blendingMode: NSVisualEffectView.BlendingMode

    func makeNSView(context: Context) -> NSVisualEffectView {
        let view = NSVisualEffectView()
        view.material = material
        view.blendingMode = blendingMode
        view.state = .active
        return view
    }

    func updateNSView(_ nsView: NSVisualEffectView, context: Context) {
        nsView.material = material
        nsView.blendingMode = blendingMode
    }
}
