import SwiftUI

struct MenuBarPopover: View {
    @Environment(AppStore.self) private var store
    @Environment(Router.self) private var router

    var body: some View {
        @Bindable var router = router

        ZStack {
            VStack(spacing: 0) {
                if let active = store.activeRecord, !isOnRecordScreen(active.task.id) {
                    ActiveRecordBanner(taskId: active.task.id)
                    Divider()
                }
                screen
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color(nsColor: .windowBackgroundColor))

            if router.showPalette {
                CommandPalette()
                    .transition(.opacity)
            }
        }
        .onKeyPress(.init("k"), phases: .down) { event in
            if event.modifiers.contains(.command) {
                router.showPalette.toggle()
                return .handled
            }
            return .ignored
        }
        .onKeyPress(.escape) {
            if router.showPalette {
                router.showPalette = false
                return .handled
            }
            if router.stack.count > 1 {
                router.pop()
                return .handled
            }
            return .ignored
        }
    }

    @ViewBuilder private var screen: some View {
        switch router.current {
        case .list:
            TaskListView()
        case .detail(let id):
            TaskDetailView(taskId: id)
        case .editor(let id):
            TaskEditor(taskId: id)
        case .record(let id):
            RecordView(taskId: id)
        case .history(let id):
            TaskHistoryView(taskId: id)
        case .settings:
            SettingsView()
        }
    }

    private func isOnRecordScreen(_ taskId: String) -> Bool {
        if case .record(let id) = router.current, id == taskId { return true }
        return false
    }
}

private struct ActiveRecordBanner: View {
    @Environment(AppStore.self) private var store
    @Environment(Clock.self) private var clock
    @Environment(Router.self) private var router
    let taskId: String

    var body: some View {
        Button {
            router.push(.record(taskId: taskId))
        } label: {
            HStack(spacing: 8) {
                let isPaused = store.record(taskId: taskId)?.isPaused ?? false
                Image(systemName: isPaused ? "pause.circle.fill" : "record.circle")
                    .foregroundStyle(isPaused ? Theme.flag : Theme.accent)
                if let stepId = store.record(taskId: taskId)?.currentStepId,
                   let step = store.task(id: taskId)?.step(id: stepId),
                   let range = store.record(taskId: taskId)?.stepRecords[stepId]
                {
                    Text(step.title).monoBody().lineLimit(1)
                    Spacer()
                    Text(TimeFormat.clock(clock.now.timeIntervalSince(range.start))).monoTimer()
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}
