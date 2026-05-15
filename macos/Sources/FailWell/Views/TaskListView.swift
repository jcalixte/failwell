import SwiftUI

struct TaskListView: View {
    @Environment(AppStore.self) private var store
    @Environment(Router.self) private var router

    @State private var selection: Int = 0
    @FocusState private var focused: Bool

    private var tasks: [TaskPlan] { store.tasksByRecency }

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            if tasks.isEmpty {
                emptyState
            } else {
                list
            }
            Divider()
            footer
        }
        .focusable()
        .focused($focused)
        .focusEffectDisabled()
        .onAppear { focused = true }
        .onKeyPress(.init("j")) {
            selection = min(selection + 1, tasks.count - 1)
            return .handled
        }
        .onKeyPress(.init("k")) {
            selection = max(0, selection - 1)
            return .handled
        }
        .onKeyPress(.downArrow) {
            selection = min(selection + 1, tasks.count - 1)
            return .handled
        }
        .onKeyPress(.upArrow) {
            selection = max(0, selection - 1)
            return .handled
        }
        .onKeyPress(.return) {
            openSelected()
            return .handled
        }
        .onKeyPress(.init("n"), phases: .down) { event in
            if event.modifiers.contains(.command) {
                router.push(.editor(taskId: nil))
                return .handled
            }
            return .ignored
        }
        .onKeyPress(.init("v"), phases: .down) { event in
            if event.modifiers.contains(.command) {
                importFromClipboard()
                return .handled
            }
            return .ignored
        }
        .onKeyPress(.delete) { deleteSelected() }
        .onKeyPress(.deleteForward) { deleteSelected() }
    }

    private var header: some View {
        HStack {
            Text("tasks").monoTitle().foregroundStyle(Theme.dim)
            Spacer()
            Text("\(tasks.count)").monoSmall().foregroundStyle(Theme.dim)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    private var list: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(Array(tasks.enumerated()), id: \.element.id) { index, task in
                        TaskRow(task: task, selected: index == selection)
                            .id(task.id)
                            .onTapGesture { selection = index; openSelected() }
                    }
                }
            }
            .onChange(of: selection) { _, new in
                guard new >= 0, new < tasks.count else { return }
                proxy.scrollTo(tasks[new].id, anchor: .center)
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 8) {
            Text("no tasks yet").monoBody().foregroundStyle(Theme.dim)
            Text("⌘N new · ⌘V paste · ⌘K commands").monoSmall().foregroundStyle(Theme.dim)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var footer: some View {
        HStack(spacing: 12) {
            Text("j/k move").monoSmall().foregroundStyle(Theme.dim)
            Text("↵ open").monoSmall().foregroundStyle(Theme.dim)
            Text("⌘N new").monoSmall().foregroundStyle(Theme.dim)
            Text("⌘V paste").monoSmall().foregroundStyle(Theme.dim)
            Spacer()
            Text("⌘K palette").monoSmall().foregroundStyle(Theme.dim)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
    }

    private func openSelected() {
        guard selection >= 0, selection < tasks.count else { return }
        router.push(.detail(taskId: tasks[selection].id))
    }

    private func deleteSelected() -> KeyPress.Result {
        guard selection >= 0, selection < tasks.count else { return .ignored }
        let id = tasks[selection].id
        store.deleteTask(id: id)
        selection = max(0, min(selection, tasks.count - 1))
        return .handled
    }

    private func importFromClipboard() {
        guard let draft = ClipboardImporter.currentDraft() else { return }
        let task = TaskPlan(
            id: UUID().uuidString,
            title: draft.title ?? "Untitled",
            date: Date(),
            link: nil,
            stepHistory: [draft.steps]
        )
        store.upsertTask(task)
        router.push(.detail(taskId: task.id))
    }
}

private struct TaskRow: View {
    let task: TaskPlan
    let selected: Bool

    var body: some View {
        HStack(spacing: 8) {
            Text(selected ? "▸" : " ").monoBody().foregroundStyle(Theme.accent)
            Text(task.title).monoBody().lineLimit(1)
            Spacer()
            Text("\(task.steps.count)").monoSmall().foregroundStyle(Theme.dim).frame(width: 24, alignment: .trailing)
            Text("\(task.totalEstimation)m").monoSmall().foregroundStyle(Theme.dim).frame(width: 36, alignment: .trailing)
            Text(TimeFormat.date(task.date)).monoSmall().foregroundStyle(Theme.dim).frame(width: 70, alignment: .trailing)
        }
        .padding(.horizontal, 12)
        .frame(height: Theme.rowHeight)
        .background(selected ? Theme.accent.opacity(0.12) : .clear)
        .contentShape(Rectangle())
    }
}
