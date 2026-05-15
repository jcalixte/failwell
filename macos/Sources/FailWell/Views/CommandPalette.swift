import AppKit
import SwiftUI

struct CommandPalette: View {
    @Environment(AppStore.self) private var store
    @Environment(Router.self) private var router

    @State private var query: String = ""
    @State private var selection: Int = 0
    @FocusState private var fieldFocused: Bool

    private struct Command: Identifiable {
        let id: String
        let label: String
        let hint: String
        let run: () -> Void
    }

    private var commands: [Command] {
        var list: [Command] = []
        let activeTaskId = store.activeRecord?.task.id

        list.append(.init(id: "new", label: "new task", hint: "create a blank task") {
            router.push(.editor(taskId: nil))
        })
        list.append(.init(id: "paste", label: "paste task from clipboard", hint: "import markdown") {
            if let draft = ClipboardImporter.currentDraft() {
                let t = TaskPlan(id: UUID().uuidString, title: draft.title ?? "Untitled", stepHistory: [draft.steps])
                store.upsertTask(t)
                router.push(.detail(taskId: t.id))
            }
        })
        if let activeTaskId {
            list.append(.init(id: "open-record", label: "open active recording", hint: "jump to current session") {
                router.push(.record(taskId: activeTaskId))
            })
            list.append(.init(id: "pause", label: "pause / resume session", hint: "toggle break") {
                if let r = store.record(taskId: activeTaskId), r.isPaused {
                    store.resume(taskId: activeTaskId)
                } else {
                    store.pause(taskId: activeTaskId)
                }
            })
            list.append(.init(id: "next", label: "next step", hint: "advance current step") {
                store.nextStep(taskId: activeTaskId)
            })
        }
        list.append(.init(id: "settings", label: "settings", hint: "global hotkey, etc.") {
            NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
        })
        list.append(.init(id: "reveal", label: "reveal data file in finder", hint: "~/Library/Application Support/FailWell") {
            let url = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
                .appendingPathComponent("FailWell", isDirectory: true)
            NSWorkspace.shared.activateFileViewerSelecting([url])
        })
        list.append(.init(id: "quit", label: "quit fail well", hint: "⌘Q") {
            NSApp.terminate(nil)
        })

        // Recently-used tasks as "start session" entries.
        for task in store.tasksByRecency.prefix(8) {
            list.append(.init(id: "start-\(task.id)", label: "start session: \(task.title)", hint: "\(task.steps.count) steps · \(task.totalEstimation)m") {
                store.initRecord(taskId: task.id)
                store.reset(taskId: task.id)
                if let first = task.steps.first {
                    store.startStepRecord(taskId: task.id, stepId: first.id)
                    router.push(.record(taskId: task.id))
                }
            })
            list.append(.init(id: "open-\(task.id)", label: "open: \(task.title)", hint: "task detail") {
                router.push(.detail(taskId: task.id))
            })
        }

        return list
    }

    private var filtered: [Command] {
        let q = query.trimmingCharacters(in: .whitespaces).lowercased()
        guard !q.isEmpty else { return commands }
        return commands.filter { fuzzyMatch(q, in: $0.label.lowercased()) }
    }

    var body: some View {
        VStack(spacing: 0) {
            TextField(">", text: $query, prompt: Text("type to search commands"))
                .textFieldStyle(.plain)
                .font(Theme.monoTitle)
                .padding(12)
                .focused($fieldFocused)
                .onSubmit { runSelected() }
                .onChange(of: query) { _, _ in selection = 0 }
            Divider()
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(Array(filtered.enumerated()), id: \.element.id) { i, cmd in
                        HStack(spacing: 8) {
                            Text(i == selection ? "▸" : " ").monoBody().foregroundStyle(Theme.accent)
                            Text(cmd.label).monoBody()
                            Spacer()
                            Text(cmd.hint).monoSmall().foregroundStyle(Theme.dim)
                        }
                        .padding(.horizontal, 12)
                        .frame(height: Theme.rowHeight)
                        .background(i == selection ? Theme.accent.opacity(0.12) : .clear)
                        .contentShape(Rectangle())
                        .onTapGesture { selection = i; runSelected() }
                    }
                }
            }
        }
        .frame(width: Theme.popoverWidth - 40, height: Theme.popoverHeight - 80)
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(nsColor: .separatorColor)))
        .shadow(radius: 12)
        .onAppear { fieldFocused = true; selection = 0 }
        .onKeyPress(.downArrow) {
            selection = min(selection + 1, filtered.count - 1)
            return .handled
        }
        .onKeyPress(.upArrow) {
            selection = max(0, selection - 1)
            return .handled
        }
        .onKeyPress(.escape) {
            router.showPalette = false
            return .handled
        }
    }

    private func runSelected() {
        let list = filtered
        guard selection >= 0, selection < list.count else { return }
        list[selection].run()
        router.showPalette = false
    }

    private func fuzzyMatch(_ needle: String, in haystack: String) -> Bool {
        var hIdx = haystack.startIndex
        for ch in needle {
            guard let found = haystack[hIdx...].firstIndex(of: ch) else { return false }
            hIdx = haystack.index(after: found)
        }
        return true
    }
}
