import SwiftUI

struct ProjectsView: View {
    @EnvironmentObject var dataManager: DataManager
    @Environment(\.colorScheme) var colorScheme

    @State private var showingNewProject = false
    @State private var newProjectName = ""

    var body: some View {
        VStack(spacing: FollowwTheme.Spacing.md) {
            // Header with add button
            HStack {
                Text("projects")
                    .font(FollowwTheme.Typography.title3)
                    .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
                    .textCase(.lowercase)

                Spacer()

                Button(action: { showingNewProject = true }) {
                    HStack(spacing: 6) {
                        Image(systemName: "plus")
                        Text("new project")
                    }
                    .font(FollowwTheme.Typography.callout)
                }
                .buttonStyle(PrimaryButtonStyle())
            }

            // Projects grid
            if dataManager.projects.isEmpty {
                emptyState
            } else {
                ScrollView {
                    LazyVGrid(
                        columns: [
                            GridItem(.flexible()),
                            GridItem(.flexible())
                        ],
                        spacing: FollowwTheme.Spacing.md
                    ) {
                        ForEach(activeProjects) { project in
                            ProjectCard(project: project)
                        }
                    }
                }
            }
        }
        .sheet(isPresented: $showingNewProject) {
            NewProjectSheet(isPresented: $showingNewProject)
                .environmentObject(dataManager)
        }
    }

    private var activeProjects: [Project] {
        dataManager.projects.filter { !$0.isArchived }
    }

    private var emptyState: some View {
        VStack(spacing: FollowwTheme.Spacing.md) {
            Image(systemName: "folder")
                .font(.system(size: 48))
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))

            Text("no projects yet")
                .font(FollowwTheme.Typography.title3)
                .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))

            Text("create a project to organize your work")
                .font(FollowwTheme.Typography.caption)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct ProjectCard: View {
    let project: Project

    @EnvironmentObject var dataManager: DataManager
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        VStack(alignment: .leading, spacing: FollowwTheme.Spacing.sm) {
            HStack {
                Image(systemName: project.icon)
                    .font(.system(size: 24))
                    .foregroundColor(project.swiftUIColor)

                Spacer()

                Text("\(taskCount)")
                    .font(FollowwTheme.Typography.caption)
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            }

            Text(project.name)
                .font(FollowwTheme.Typography.headline)
                .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
                .lineLimit(2)

            if let client = getClient() {
                Text(client.name)
                    .font(FollowwTheme.Typography.caption)
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            }
        }
        .padding(FollowwTheme.Spacing.md)
        .frame(height: 140)
        .cardStyle()
    }

    private var taskCount: Int {
        dataManager.tasks.filter { $0.projectId == project.id }.count
    }

    private func getClient() -> Client? {
        guard let clientId = project.clientId else { return nil }
        return dataManager.clients.first(where: { $0.id == clientId })
    }
}

struct NewProjectSheet: View {
    @Binding var isPresented: Bool
    @EnvironmentObject var dataManager: DataManager
    @Environment(\.colorScheme) var colorScheme

    @State private var name = ""
    @State private var selectedClient: Client?
    @State private var selectedColor = "#3A76F0"

    var body: some View {
        VStack(spacing: FollowwTheme.Spacing.lg) {
            Text("new project")
                .font(FollowwTheme.Typography.title3)
                .textCase(.lowercase)

            TextField("project name", text: $name)
                .textFieldStyle(.plain)
                .font(FollowwTheme.Typography.body)
                .padding(FollowwTheme.Spacing.md)
                .cardStyle()

            HStack {
                Button("cancel") {
                    isPresented = false
                }
                .buttonStyle(SecondaryButtonStyle())

                Button("create") {
                    createProject()
                }
                .buttonStyle(PrimaryButtonStyle())
                .disabled(name.isEmpty)
            }
        }
        .padding(FollowwTheme.Spacing.lg)
        .frame(width: 400)
    }

    private func createProject() {
        let project = Project(
            name: name,
            clientId: selectedClient?.id,
            color: selectedColor
        )
        dataManager.addProject(project)
        isPresented = false
    }
}
