import SwiftUI

struct TaskDetailView: View {
    @Environment(AppStore.self) private var store
    @Environment(Router.self) private var router

    let taskId: String

    @FocusState private var focused: Bool
    @State private var showDeleteConfirm = false

    private var task: TaskPlan? { store.task(id: taskId) }

    var body: some View {
        if let task {
            VStack(spacing: 0) {
                header(task)
                Divider()
                stepList(task)
                Divider()
                footer
            }
            .focusable()
            .focused($focused)
            .focusEffectDisabled()
            .onAppear { focused = true }
            .onKeyPress(.init("s")) { startSession(); return .handled }
            .onKeyPress(.init("e"), phases: .down) { event in
                if event.modifiers.contains(.command) {
                    router.push(.editor(taskId: task.id))
                    return .handled
                }
                return .ignored
            }
            .onKeyPress(.init("h"), phases: .down) { event in
                if event.modifiers.contains(.command) {
                    router.push(.history(taskId: task.id))
                    return .handled
                }
                return .ignored
            }
            .onKeyPress(.init("d"), phases: .down) { event in
                if event.modifiers.contains(.command) {
                    if let copy = store.duplicateTask(id: task.id) {
                        router.replace(with: .detail(taskId: copy.id))
                    }
                    return .handled
                }
                return .ignored
            }
            .onKeyPress(.delete) {
                showDeleteConfirm = true
                return .handled
            }
            .confirmationDialog("Delete \(task.title)?", isPresented: $showDeleteConfirm) {
                Button("Delete", role: .destructive) {
                    store.deleteTask(id: task.id)
                    router.popToRoot()
                }
                Button("Cancel", role: .cancel) {}
            }
        } else {
            ContentUnavailableView("Task not found", systemImage: "questionmark.folder")
                .onAppear { router.popToRoot() }
        }
    }

    private func header(_ task: TaskPlan) -> some View {
        HStack(spacing: 8) {
            Button { router.pop() } label: {
                Image(systemName: "chevron.left").foregroundStyle(Theme.dim)
            }
            .buttonStyle(.plain)
            .keyboardShortcut(.leftArrow, modifiers: [])

            Text(task.title).monoTitle().lineLimit(1)
            Spacer()
            Text("\(task.totalEstimation)m").monoSmall().foregroundStyle(Theme.dim)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    @ViewBuilder
    private func stepList(_ task: TaskPlan) -> some View {
        if task.steps.isEmpty {
            VStack(spacing: 8) {
                Text("no steps").monoBody().foregroundStyle(Theme.dim)
                Text("⌘E add steps").monoSmall().foregroundStyle(Theme.dim)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else {
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(task.steps) { step in
                        HStack(spacing: 8) {
                            Text(Theme.Glyph.pending).foregroundStyle(Theme.dim)
                            Text(step.title).monoBody().lineLimit(1)
                            Spacer()
                            Text("\(step.estimation)m").monoSmall().foregroundStyle(Theme.dim)
                        }
                        .padding(.horizontal, 12)
                        .frame(height: Theme.rowHeight)
                    }
                }
            }
        }
    }

    private var footer: some View {
        HStack(spacing: 12) {
            Text("s start").monoSmall().foregroundStyle(Theme.dim)
            Text("⌘E edit").monoSmall().foregroundStyle(Theme.dim)
            Text("⌘H history").monoSmall().foregroundStyle(Theme.dim)
            Text("⌘D duplicate").monoSmall().foregroundStyle(Theme.dim)
            Text("⌫ delete").monoSmall().foregroundStyle(Theme.dim)
            Spacer()
            Text("esc back").monoSmall().foregroundStyle(Theme.dim)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
    }

    private func startSession() {
        guard let task, !task.steps.isEmpty else { return }
        store.initRecord(taskId: task.id)
        // Reset any prior end and start fresh.
        store.reset(taskId: task.id)
        store.startStepRecord(taskId: task.id, stepId: task.steps[0].id)
        router.push(.record(taskId: task.id))
    }
}
