import Foundation
import SwiftUI
import AppKit

class OverlayManager: ObservableObject {
    static let shared = OverlayManager()

    @Published var isVisible: Bool = false
    private var overlayWindow: NSWindow?

    private init() {}

    func show() {
        if overlayWindow == nil {
            createOverlayWindow()
        }

        isVisible = true
        overlayWindow?.makeKeyAndOrderFront(nil)
        overlayWindow?.alphaValue = 0
        NSApp.activate(ignoringOtherApps: true)

        // Animate in
        NSAnimationContext.runAnimationGroup { context in
            context.duration = 0.2
            context.timingFunction = CAMediaTimingFunction(name: .easeOut)
            overlayWindow?.animator().alphaValue = 1
        }
    }

    func hide() {
        // Animate out
        NSAnimationContext.runAnimationGroup({ context in
            context.duration = 0.18
            context.timingFunction = CAMediaTimingFunction(name: .easeIn)
            overlayWindow?.animator().alphaValue = 0
        }, completionHandler: {
            self.overlayWindow?.orderOut(nil)
            self.isVisible = false
        })
    }

    func toggle() {
        if isVisible {
            hide()
        } else {
            show()
        }
    }

    private func createOverlayWindow() {
        // Get screen dimensions
        guard let screen = NSScreen.main else { return }
        let screenFrame = screen.visibleFrame

        // Window size - centered, 60% width, 70% height
        let windowWidth: CGFloat = screenFrame.width * 0.6
        let windowHeight: CGFloat = screenFrame.height * 0.7
        let windowX = screenFrame.origin.x + (screenFrame.width - windowWidth) / 2
        let windowY = screenFrame.origin.y + (screenFrame.height - windowHeight) / 2

        let windowFrame = NSRect(x: windowX, y: windowY, width: windowWidth, height: windowHeight)

        // Create window
        let window = NSWindow(
            contentRect: windowFrame,
            styleMask: [.borderless, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )

        window.isOpaque = false
        window.backgroundColor = .clear
        window.hasShadow = true
        window.level = .floating
        window.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]

        // Create SwiftUI content view
        let contentView = OverlayContentView()
            .environmentObject(DataManager.shared)
            .environmentObject(self)

        // Set content view
        window.contentView = NSHostingView(rootView: contentView)

        overlayWindow = window
    }
}
