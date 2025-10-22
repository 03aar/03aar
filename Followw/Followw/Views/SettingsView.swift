import SwiftUI

struct SettingsView: View {
    @Environment(\.colorScheme) var colorScheme
    @AppStorage("followw.theme") private var selectedTheme: String = "system"
    @AppStorage("followw.accentColor") private var accentColor: String = "#3A76F0"
    @AppStorage("followw.soundEnabled") private var soundEnabled: Bool = true
    @AppStorage("followw.notificationsEnabled") private var notificationsEnabled: Bool = true

    var body: some View {
        TabView {
            generalSettings
                .tabItem {
                    Label("General", systemImage: "gear")
                }

            appearanceSettings
                .tabItem {
                    Label("Appearance", systemImage: "paintbrush")
                }

            aboutSettings
                .tabItem {
                    Label("About", systemImage: "info.circle")
                }
        }
        .frame(width: 500, height: 400)
    }

    private var generalSettings: some View {
        Form {
            Section {
                Toggle("Sound effects", isOn: $soundEnabled)
                Toggle("Notifications", isOn: $notificationsEnabled)
            } header: {
                Text("Notifications")
            }

            Section {
                HStack {
                    Text("Global shortcut")
                    Spacer()
                    Text("⌘⇧Space")
                        .font(.system(size: 13, design: .monospaced))
                        .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                }

                Text("Press this shortcut anywhere to open Followw")
                    .font(FollowwTheme.Typography.caption)
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            } header: {
                Text("Keyboard")
            }

            Section {
                Button("Export Data") {
                    exportData()
                }

                Button("Import Data") {
                    importData()
                }
            } header: {
                Text("Data")
            }
        }
        .formStyle(.grouped)
        .padding()
    }

    private var appearanceSettings: some View {
        Form {
            Section {
                Picker("Theme", selection: $selectedTheme) {
                    Text("System").tag("system")
                    Text("Light").tag("light")
                    Text("Dark").tag("dark")
                }
            } header: {
                Text("Theme")
            }

            Section {
                ColorPicker("Accent color", selection: Binding(
                    get: {
                        Color(hex: accentColor) ?? FollowwTheme.Colors.accentBlue
                    },
                    set: { newColor in
                        accentColor = newColor.toHex() ?? "#3A76F0"
                    }
                ))

                Button("Reset to default") {
                    accentColor = "#3A76F0"
                }
                .buttonStyle(.plain)
            } header: {
                Text("Colors")
            }
        }
        .formStyle(.grouped)
        .padding()
    }

    private var aboutSettings: some View {
        VStack(spacing: FollowwTheme.Spacing.lg) {
            Image(systemName: "circle.circle.fill")
                .font(.system(size: 64))
                .foregroundColor(FollowwTheme.Colors.accentBlue)

            VStack(spacing: FollowwTheme.Spacing.xs) {
                Text("Followw")
                    .font(FollowwTheme.Typography.title2)

                Text("version 1.0.0")
                    .font(FollowwTheme.Typography.caption)
                    .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
            }

            Text("work that moves with you.")
                .font(FollowwTheme.Typography.callout)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
                .textCase(.lowercase)

            Divider()
                .padding(.horizontal, FollowwTheme.Spacing.xxl)

            VStack(spacing: FollowwTheme.Spacing.sm) {
                Link("Website", destination: URL(string: "https://followw.app")!)
                Link("Support", destination: URL(string: "https://followw.app/support")!)
                Link("Privacy Policy", destination: URL(string: "https://followw.app/privacy")!)
            }
            .font(FollowwTheme.Typography.callout)

            Spacer()

            Text("© 2025 Followw. All rights reserved.")
                .font(FollowwTheme.Typography.caption2)
                .foregroundColor(FollowwTheme.Colors.secondaryText(for: colorScheme))
        }
        .padding(FollowwTheme.Spacing.lg)
    }

    // MARK: - Actions

    private func exportData() {
        let panel = NSSavePanel()
        panel.allowedContentTypes = [.json]
        panel.nameFieldStringValue = "followw-data-export.json"

        panel.begin { response in
            if response == .OK, let url = panel.url {
                // Export data logic
                print("Exporting data to: \(url)")
            }
        }
    }

    private func importData() {
        let panel = NSOpenPanel()
        panel.allowedContentTypes = [.json]
        panel.allowsMultipleSelection = false

        panel.begin { response in
            if response == .OK, let url = panel.urls.first {
                // Import data logic
                print("Importing data from: \(url)")
            }
        }
    }
}
