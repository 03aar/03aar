import SwiftUI

struct AllTasksView: View {
    @EnvironmentObject var dataManager: DataManager
    @Environment(\.colorScheme) var colorScheme

    @State private var searchText = ""
    @State private var filterOption: FilterOption = .active
    @State private var selectedTask: Task?
    @State private var showTaskDetail = false

    enum FilterOption: String, CaseIterable {
        case active = "active"
        case completed = "completed"
        case all = "all"
    }

    var body: some View {
        VStack(spacing: FollowwTheme.Spacing.md) {
            // Search and filter
            HStack(spacing: FollowwTheme.Spacing.sm) {
                // Search
                HStack(spacing: FollowwTheme.Spacing.sm) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))

                    TextField("search tasks...", text: $searchText)
                        .textFieldStyle(.plain)
                        .font(FollowwTheme.Typography.body)
                }
                .padding(FollowwTheme.Spacing.sm)
                .cardStyle()

                // Filter
                Picker("Filter", selection: $filterOption) {
                    ForEach(FilterOption.allCases, id: \.self) { option in
                        Text(option.rawValue)
                            .tag(option)
                    }
                }
                .pickerStyle(.segmented)
                .frame(width: 200)
            }

            // Tasks list
            ScrollView {
                LazyVStack(spacing: FollowwTheme.Spacing.xs) {
                    ForEach(filteredTasks) { task in
                        TaskRowView(task: task, onTap: {
                            selectedTask = task
                            showTaskDetail = true
                        })
                    }
                }
            }
        }
        .sheet(isPresented: $showTaskDetail) {
            if let task = selectedTask {
                TaskDetailView(task: task)
                    .environmentObject(dataManager)
            }
        }
    }

    private var filteredTasks: [Task] {
        var tasks = dataManager.tasks

        // Apply filter
        switch filterOption {
        case .active:
            tasks = tasks.filter { !$0.isCompleted }
        case .completed:
            tasks = tasks.filter { $0.isCompleted }
        case .all:
            break
        }

        // Apply search
        if !searchText.isEmpty {
            tasks = tasks.filter {
                $0.title.localizedCaseInsensitiveContains(searchText) ||
                $0.notes.localizedCaseInsensitiveContains(searchText)
            }
        }

        // Sort by creation date
        return tasks.sorted { $0.createdAt > $1.createdAt }
    }
}
