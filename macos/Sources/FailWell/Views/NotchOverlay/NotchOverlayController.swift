import AppKit
import SwiftUI
import Observation

@MainActor
@Observable
final class NotchOverlayState {
    var isExpanded = false
}

struct NotchGeometry: Equatable {
    let screenFrame: NSRect
    let menuBarHeight: CGFloat
    let notchWidth: CGFloat
}

enum NotchOverlayLayout {
    static let wingExtension: CGFloat = 96
    static let expandedBodyHeight: CGFloat = 132
}

@MainActor
final class NotchOverlayController {
    private let store: AppStore
    private let clock: Clock
    private let state = NotchOverlayState()
    private var panel: NSPanel?
    private var screenObserver: NSObjectProtocol?
    private var syncTask: Task<Void, Never>?

    init(store: AppStore, clock: Clock) {
        self.store = store
        self.clock = clock

        screenObserver = NotificationCenter.default.addObserver(
            forName: NSApplication.didChangeScreenParametersNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            Task { @MainActor in
                self?.rebuild()
            }
        }
        startSync()
        observeExpansion()
    }

    private func startSync() {
        syncTask = Task { [weak self] in
            while !Task.isCancelled {
                self?.sync()
                try? await Task.sleep(for: .milliseconds(500))
            }
        }
    }

    private func observeExpansion() {
        withObservationTracking { [weak self] in
            _ = self?.state.isExpanded
        } onChange: { [weak self] in
            Task { @MainActor in
                self?.updateFrame(animated: true)
                self?.observeExpansion()
            }
        }
    }

    private func sync() {
        let shouldShow = store.activeRecord != nil && notchGeometry() != nil
        if shouldShow {
            ensurePanel()
        } else {
            tearDown()
        }
    }

    private func notchGeometry() -> NotchGeometry? {
        guard let screen = NSScreen.main, screen.safeAreaInsets.top > 0 else { return nil }
        let menuBarHeight = screen.safeAreaInsets.top
        let notchWidth: CGFloat
        if let left = screen.auxiliaryTopLeftArea, let right = screen.auxiliaryTopRightArea {
            notchWidth = max(0, screen.frame.width - left.width - right.width)
        } else {
            notchWidth = 200
        }
        return NotchGeometry(
            screenFrame: screen.frame,
            menuBarHeight: menuBarHeight,
            notchWidth: notchWidth
        )
    }

    private func panelFrame(geometry: NotchGeometry, expanded: Bool) -> NSRect {
        let totalWidth = geometry.notchWidth + NotchOverlayLayout.wingExtension * 2
        let totalHeight = geometry.menuBarHeight + (expanded ? NotchOverlayLayout.expandedBodyHeight : 0)
        let x = geometry.screenFrame.origin.x + (geometry.screenFrame.width - totalWidth) / 2
        let y = geometry.screenFrame.origin.y + geometry.screenFrame.height - totalHeight
        return NSRect(x: x, y: y, width: totalWidth, height: totalHeight)
    }

    private func ensurePanel() {
        guard let geometry = notchGeometry() else { return }
        if panel != nil { return }

        let panel = NSPanel(
            contentRect: panelFrame(geometry: geometry, expanded: state.isExpanded),
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = false
        panel.level = .screenSaver
        panel.collectionBehavior = [.canJoinAllSpaces, .stationary, .fullScreenAuxiliary, .ignoresCycle]
        panel.ignoresMouseEvents = false
        panel.isMovable = false

        let content = NotchOverlayContent(state: state, geometry: geometry)
            .environment(store)
            .environment(clock)
        let hosting = NSHostingController(rootView: content)
        hosting.view.wantsLayer = true
        hosting.view.layer?.backgroundColor = .clear
        panel.contentViewController = hosting
        panel.orderFront(nil)

        self.panel = panel
    }

    private func updateFrame(animated: Bool) {
        guard let panel, let geometry = notchGeometry() else { return }
        let newFrame = panelFrame(geometry: geometry, expanded: state.isExpanded)
        if animated {
            NSAnimationContext.runAnimationGroup { ctx in
                ctx.duration = 0.32
                ctx.timingFunction = CAMediaTimingFunction(name: .easeOut)
                ctx.allowsImplicitAnimation = true
                panel.animator().setFrame(newFrame, display: true)
            }
        } else {
            panel.setFrame(newFrame, display: true)
        }
    }

    private func tearDown() {
        state.isExpanded = false
        panel?.orderOut(nil)
        panel?.close()
        panel = nil
    }

    private func rebuild() {
        tearDown()
        sync()
    }
}
