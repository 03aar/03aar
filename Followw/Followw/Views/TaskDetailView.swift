import SwiftUI

struct TaskDetailView: View {
    @Environment(\.dismiss) var dismiss
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var dataManager: DataManager

    @State var task: Task
    @State private var title: String
    @State private var notes: String
    @State private var isFocusTask: Bool
    @State private var selectedClient: Client?
    @State private var newLink: String = ""

    init(task: Task) {
        _task = State(initialValue: task)
        _title = State(initialValue: task.title)
        _notes = State(initialValue: task.notes)
        _isFocusTask = State(initialValue: task.isFocusTask)
    }

    var body: some View {
        VStack(spacing: 0) {
            // Header
            header

            Divider()

            // Content
            ScrollView {
                VStack(alignment: .leading, spacing: FollowwTheme.Spacing.lg) {
                    // Title
                    VStack(alignment: .leading, spacing: FollowwTheme.Spacing.xs) {
                        Text("task")
                            .font(FollowwTheme.Typography.caption)
                            .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                            .textCase(.lowercase)

                        TextField("Task title", text: $title)
                            .textFieldStyle(.plain)
                            .font(FollowwTheme.Typography.title3)
                    }
                    .padding(FollowwTheme.Spacing.md)
                    .cardStyle()

                    // Notes
                    VStack(alignment: .leading, spacing: FollowwTheme.Spacing.xs) {
                        Text("notes")
                            .font(FollowwTheme.Typography.caption)
                            .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                            .textCase(.lowercase)

                        TextEditor(text: $notes)
                            .font(FollowwTheme.Typography.body)
                            .frame(minHeight: 120)
                            .scrollContentBackground(.hidden)
                    }
                    .padding(FollowwTheme.Spacing.md)
                    .cardStyle()

                    // Options
                    VStack(spacing: FollowwTheme.Spacing.sm) {
                        Toggle("focus task", isOn: $isFocusTask)
                            .font(FollowwTheme.Typography.body)

                        if !dataManager.clients.isEmpty {
                            Divider()

                            Menu {
                                Button("None") {
                                    selectedClient = nil
                                }
                                ForEach(dataManager.clients.filter { !$0.isArchived }) { client in
                                    Button(client.name) {
                                        selectedClient = client
                                    }
                                }
                            } label: {
                                HStack {
                                    Text("client")
                                        .font(FollowwTheme.Typography.body)
                                    Spacer()
                                    Text(selectedClient?.name ?? "None")
                                        .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                                    Image(systemName: "chevron.down")
                                        .font(.system(size: 12))
                                        .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                                }
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(FollowwTheme.Spacing.md)
                    .cardStyle()

                    // Links
                    if !task.links.isEmpty || !newLink.isEmpty {
                        VStack(alignment: .leading, spacing: FollowwTheme.Spacing.sm) {
                            Text("links")
                                .font(FollowwTheme.Typography.caption)
                                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                                .textCase(.lowercase)

                            ForEach(task.links) { link in
                                linkRow(link)
                            }

                            // Add link
                            HStack(spacing: FollowwTheme.Spacing.sm) {
                                Image(systemName: "plus.circle.fill")
                                    .foregroundColor(FollowwTheme.Colors.accentBlue)

                                TextField("add link...", text: $newLink)
                                    .textFieldStyle(.plain)
                                    .font(FollowwTheme.Typography.callout)
                                    .onSubmit {
                                        addLink()
                                    }
                            }
                            .padding(FollowwTheme.Spacing.md)
                            .cardStyle()
                        }
                    }

                    // Time tracking
                    if !task.timeEntries.isEmpty {
                        timeTrackingSection
                    }
                }
                .padding(FollowwTheme.Spacing.lg)
            }
        }
        .frame(width: 500, height: 600)
        .onDisappear {
            saveChanges()
        }
    }

    private var header: some View {
        HStack {
            Text("task details")
                .font(FollowwTheme.Typography.title3)
                .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
                .textCase(.lowercase)

            Spacer()

            Button(action: { dismiss() }) {
                Image(systemName: "xmark.circle.fill")
                    .font(.system(size: 20))
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            }
            .buttonStyle(.plain)
        }
        .padding(FollowwTheme.Spacing.lg)
    }

    private func linkRow(_ link: TaskLink) -> some View {
        HStack(spacing: FollowwTheme.Spacing.sm) {
            Image(systemName: "link")
                .font(.system(size: 14))
                .foregroundColor(FollowwTheme.Colors.accentBlue)

            Text(link.title)
                .font(FollowwTheme.Typography.callout)
                .lineLimit(1)

            Spacer()

            Button(action: {
                if let url = URL(string: link.url) {
                    NSWorkspace.shared.open(url)
                }
            }) {
                Image(systemName: "arrow.up.right")
                    .font(.system(size: 12))
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            }
            .buttonStyle(.plain)
        }
        .padding(FollowwTheme.Spacing.md)
        .cardStyle()
    }

    private var timeTrackingSection: some View {
        VStack(alignment: .leading, spacing: FollowwTheme.Spacing.sm) {
            Text("time spent")
                .font(FollowwTheme.Typography.caption)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                .textCase(.lowercase)

            VStack(spacing: FollowwTheme.Spacing.xs) {
                ForEach(getTimeEntries()) { entry in
                    HStack {
                        Image(systemName: "clock.fill")
                            .font(.system(size: 14))
                            .foregroundColor(FollowwTheme.Colors.accentBlue)

                        Text(entry.startTime.formatted(style: .short))
                            .font(FollowwTheme.Typography.callout)

                        Spacer()

                        Text(entry.duration.formatted())
                            .font(FollowwTheme.Typography.callout)
                            .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                    }
                    .padding(FollowwTheme.Spacing.md)
                    .cardStyle()
                }
            }

            // Total time
            HStack {
                Text("total")
                    .font(FollowwTheme.Typography.body)
                    .fontWeight(.semibold)

                Spacer()

                Text(task.totalTimeSpent.formatted())
                    .font(FollowwTheme.Typography.body)
                    .fontWeight(.semibold)
                    .foregroundColor(FollowwTheme.Colors.accentBlue)
            }
            .padding(FollowwTheme.Spacing.md)
            .cardStyle()
        }
    }

    private func getTimeEntries() -> [TimeEntry] {
        task.timeEntries.compactMap { id in
            dataManager.timeEntries.first(where: { $0.id == id })
        }.sorted { $0.startTime > $1.startTime }
    }

    private func addLink() {
        guard !newLink.trimmingCharacters(in: .whitespaces).isEmpty else { return }

        let link = TaskLink(url: newLink)
        task.links.append(link)
        newLink = ""
    }

    private func saveChanges() {
        var updatedTask = task
        updatedTask.title = title
        updatedTask.notes = notes
        updatedTask.isFocusTask = isFocusTask
        updatedTask.clientId = selectedClient?.id

        dataManager.updateTask(updatedTask)
    }
}
