import SwiftUI
import AppKit
import Carbon

@main
struct FollowwApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var dataManager = DataManager.shared
    @StateObject private var overlayManager = OverlayManager.shared

    var body: some Scene {
        Settings {
            SettingsView()
                .environmentObject(dataManager)
        }
    }
}

class AppDelegate: NSObject, NSApplicationDelegate {
    var statusItem: NSStatusItem?
    var overlayWindow: NSWindow?
    var eventMonitor: Any?

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Hide dock icon - Followw lives in the menu bar
        NSApp.setActivationPolicy(.accessory)

        // Create menu bar item
        setupMenuBar()

        // Register global hotkey (Cmd+Shift+Space)
        registerGlobalHotkey()

        // Initialize data manager
        _ = DataManager.shared
    }

    func setupMenuBar() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)

        if let button = statusItem?.button {
            // Use SF Symbol for menu bar icon
            let config = NSImage.SymbolConfiguration(pointSize: 14, weight: .medium)
            let image = NSImage(systemSymbolName: "circle.circle.fill", accessibilityDescription: "Followw")
            button.image = image?.withSymbolConfiguration(config)
            button.action = #selector(toggleOverlay)
            button.target = self
        }

        // Create menu
        let menu = NSMenu()
        menu.addItem(NSMenuItem(title: "Show Followw", action: #selector(toggleOverlay), keyEquivalent: ""))
        menu.addItem(NSMenuItem.separator())
        menu.addItem(NSMenuItem(title: "Settings...", action: #selector(openSettings), keyEquivalent: ","))
        menu.addItem(NSMenuItem.separator())
        menu.addItem(NSMenuItem(title: "Quit Followw", action: #selector(quitApp), keyEquivalent: "q"))

        statusItem?.menu = menu
    }

    func registerGlobalHotkey() {
        // Register Cmd+Shift+Space
        eventMonitor = NSEvent.addGlobalMonitorForEvents(matching: .keyDown) { [weak self] event in
            // Cmd+Shift+Space
            if event.modifierFlags.contains([.command, .shift]) && event.keyCode == 49 {
                self?.toggleOverlay()
            }
        }

        // Also monitor local events
        NSEvent.addLocalMonitorForEvents(matching: .keyDown) { [weak self] event in
            if event.modifierFlags.contains([.command, .shift]) && event.keyCode == 49 {
                self?.toggleOverlay()
                return nil
            }
            return event
        }
    }

    @objc func toggleOverlay() {
        DispatchQueue.main.async {
            OverlayManager.shared.toggle()
        }
    }

    @objc func openSettings() {
        NSApp.activate(ignoringOtherApps: true)
        NSApp.sendAction(Selector(("showPreferencesWindow:")), to: nil, from: nil)
    }

    @objc func quitApp() {
        NSApplication.shared.terminate(nil)
    }
}
