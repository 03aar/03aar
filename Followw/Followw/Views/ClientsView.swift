import SwiftUI

struct ClientsView: View {
    @EnvironmentObject var dataManager: DataManager
    @Environment(\.colorScheme) var colorScheme

    @State private var showingNewClient = false

    var body: some View {
        VStack(spacing: FollowwTheme.Spacing.md) {
            // Header
            HStack {
                Text("clients")
                    .font(FollowwTheme.Typography.title3)
                    .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
                    .textCase(.lowercase)

                Spacer()

                Button(action: { showingNewClient = true }) {
                    HStack(spacing: 6) {
                        Image(systemName: "plus")
                        Text("new client")
                    }
                    .font(FollowwTheme.Typography.callout)
                }
                .buttonStyle(PrimaryButtonStyle())
            }

            // Clients list
            if dataManager.clients.isEmpty {
                emptyState
            } else {
                ScrollView {
                    LazyVStack(spacing: FollowwTheme.Spacing.sm) {
                        ForEach(activeClients) { client in
                            ClientCard(client: client)
                        }
                    }
                }
            }
        }
        .sheet(isPresented: $showingNewClient) {
            NewClientSheet(isPresented: $showingNewClient)
                .environmentObject(dataManager)
        }
    }

    private var activeClients: [Client] {
        dataManager.clients.filter { !$0.isArchived }
    }

    private var emptyState: some View {
        VStack(spacing: FollowwTheme.Spacing.md) {
            Image(systemName: "person.2")
                .font(.system(size: 48))
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))

            Text("no clients yet")
                .font(FollowwTheme.Typography.title3)
                .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))

            Text("add clients to organize your work")
                .font(FollowwTheme.Typography.caption)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct ClientCard: View {
    let client: Client

    @EnvironmentObject var dataManager: DataManager
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        HStack(spacing: FollowwTheme.Spacing.md) {
            // Icon
            Image(systemName: client.icon)
                .font(.system(size: 28))
                .foregroundColor(client.swiftUIColor)
                .frame(width: 50, height: 50)
                .background(client.swiftUIColor.opacity(0.1))
                .cornerRadius(FollowwTheme.CornerRadius.md)

            // Info
            VStack(alignment: .leading, spacing: 4) {
                Text(client.name)
                    .font(FollowwTheme.Typography.headline)
                    .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))

                HStack(spacing: FollowwTheme.Spacing.sm) {
                    Label("\(projectCount) projects", systemImage: "folder.fill")
                    Label("\(taskCount) tasks", systemImage: "checkmark.circle.fill")
                }
                .font(FollowwTheme.Typography.caption)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            }

            Spacer()

            // Total time
            VStack(alignment: .trailing, spacing: 2) {
                Text(totalTime)
                    .font(FollowwTheme.Typography.headline)
                    .foregroundColor(FollowwTheme.Colors.accentBlue)

                Text("total time")
                    .font(FollowwTheme.Typography.caption2)
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            }
        }
        .padding(FollowwTheme.Spacing.md)
        .cardStyle()
    }

    private var projectCount: Int {
        dataManager.projects.filter { $0.clientId == client.id }.count
    }

    private var taskCount: Int {
        dataManager.tasks.filter { $0.clientId == client.id }.count
    }

    private var totalTime: String {
        let tasks = dataManager.tasks.filter { $0.clientId == client.id }
        let totalSeconds = tasks.reduce(0.0) { $0 + $1.totalTimeSpent }
        return TimeInterval(totalSeconds).formattedShort()
    }
}

struct NewClientSheet: View {
    @Binding var isPresented: Bool
    @EnvironmentObject var dataManager: DataManager

    @State private var name = ""

    var body: some View {
        VStack(spacing: FollowwTheme.Spacing.lg) {
            Text("new client")
                .font(FollowwTheme.Typography.title3)
                .textCase(.lowercase)

            TextField("client name", text: $name)
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
                    createClient()
                }
                .buttonStyle(PrimaryButtonStyle())
                .disabled(name.isEmpty)
            }
        }
        .padding(FollowwTheme.Spacing.lg)
        .frame(width: 400)
    }

    private func createClient() {
        let client = Client(name: name)
        dataManager.addClient(client)
        isPresented = false
    }
}
