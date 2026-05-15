import AppKit
import KeyboardShortcuts
import SwiftUI

extension KeyboardShortcuts.Name {
    static let togglePopover = Self("togglePopover", default: .init(.f, modifiers: [.control, .option, .command]))
}

@main
struct FailWellApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate

    var body: some Scene {
        Settings {
            SettingsView()
                .environment(appDelegate.store)
                .environment(appDelegate.router)
                .environment(appDelegate.clock)
        }
    }
}

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    let store = AppStore()
    let router = Router()
    let clock = Clock()

    private var statusItem: NSStatusItem!
    private var popover: NSPopover!
    private var labelUpdater: Task<Void, Never>?
    private var notchOverlay: NotchOverlayController?

    func applicationDidFinishLaunching(_ notification: Notification) {
        setupStatusItem()
        setupPopover()
        setupHotkey()
        startLabelUpdates()
        notchOverlay = NotchOverlayController(store: store, clock: clock)
    }

    func applicationWillTerminate(_ notification: Notification) {
        labelUpdater?.cancel()
        store.flush()
    }

    private func setupStatusItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        statusItem.behavior = .terminationOnRemoval
        if let button = statusItem.button {
            button.image = NSImage(systemSymbolName: "checklist", accessibilityDescription: "Fail Well")
            button.imagePosition = .imageLeading
            button.font = NSFont.monospacedDigitSystemFont(ofSize: 12, weight: .regular)
            button.action = #selector(togglePopover(_:))
            button.target = self
        }
    }

    private func setupPopover() {
        popover = NSPopover()
        popover.behavior = .transient
        popover.contentSize = NSSize(width: Theme.popoverWidth, height: Theme.popoverHeight)
        popover.animates = false
        let root = MenuBarPopover()
            .environment(store)
            .environment(router)
            .environment(clock)
        popover.contentViewController = NSHostingController(rootView: root)
    }

    private func setupHotkey() {
        KeyboardShortcuts.onKeyDown(for: .togglePopover) { [weak self] in
            self?.togglePopover(nil)
        }
    }

    @objc func togglePopover(_ sender: Any?) {
        if popover.isShown {
            popover.performClose(sender)
            return
        }
        guard let button = statusItem.button else { return }
        NSApp.activate(ignoringOtherApps: true)
        popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
        popover.contentViewController?.view.window?.makeKey()
    }

    private func startLabelUpdates() {
        labelUpdater = Task { [weak self] in
            while !Task.isCancelled {
                self?.refreshLabel()
                try? await Task.sleep(for: .milliseconds(500))
            }
        }
    }

    private func refreshLabel() {
        guard let button = statusItem.button else { return }
        if let active = store.activeRecord,
           let stepId = active.record.currentStepId,
           let step = active.task.step(id: stepId),
           let range = active.record.stepRecords[stepId]
        {
            let elapsed = clock.now.timeIntervalSince(range.start)
            let icon = active.record.isPaused ? "pause.circle.fill" : "record.circle"
            button.image = NSImage(systemSymbolName: icon, accessibilityDescription: nil)
            if notchOverlay?.isShowing == true {
                button.title = ""
            } else {
                let title = "\(TimeFormat.clock(elapsed)) \(step.title)"
                button.title = title.count > 32 ? "\(title.prefix(30))…" : title
            }
        } else {
            button.image = NSImage(systemSymbolName: "checklist", accessibilityDescription: nil)
            button.title = ""
        }
    }
}
