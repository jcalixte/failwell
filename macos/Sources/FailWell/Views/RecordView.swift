import SwiftUI

struct RecordView: View {
    @Environment(AppStore.self) private var store
    @Environment(Router.self) private var router
    @Environment(Clock.self) private var clock

    let taskId: String

    @FocusState private var notesFocused: Bool
    @State private var showResetConfirm = false

    private var task: TaskPlan? { store.task(id: taskId) }
    private var record: TaskRecord? { store.record(taskId: taskId) }

    @FocusState private var rootFocused: Bool

    var body: some View {
        if let task, let record {
            VStack(spacing: 0) {
                header(task, record)
                Divider()
                stepList(task, record)
                Divider()
                notes
                Divider()
                controls(task, record)
            }
            .focusable()
            .focused($rootFocused)
            .focusEffectDisabled()
            .onAppear { rootFocused = true }
            .onKeyPress(.init("s")) { startIfNeeded(task, record) }
            .onKeyPress(.init("n")) { nextIfPossible(record) }
            .onKeyPress(.init("p")) { togglePause(record) }
            .onKeyPress(.init("r")) { showResetConfirm = true; return .handled }
            .onKeyPress(.init("i")) {
                notesFocused = true
                return .handled
            }
            .confirmationDialog("Reset session?", isPresented: $showResetConfirm) {
                Button("Reset", role: .destructive) { store.reset(taskId: taskId) }
                Button("Cancel", role: .cancel) {}
            }
        } else {
            ContentUnavailableView("Record not found", systemImage: "clock.badge.questionmark")
                .onAppear { router.popToRoot() }
        }
    }

    private func header(_ task: TaskPlan, _ record: TaskRecord) -> some View {
        HStack(spacing: 8) {
            Button { router.pop() } label: { Image(systemName: "chevron.left").foregroundStyle(Theme.dim) }
                .buttonStyle(.plain)
            Text(task.title).monoTitle().lineLimit(1)
            Spacer()
            if record.isPaused {
                Text(Theme.Glyph.paused).foregroundStyle(Theme.flag)
            } else if record.currentStepId != nil {
                Text(Theme.Glyph.active).foregroundStyle(Theme.accent)
            }
            Text(elapsedTotal(record)).monoTimer()
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    private func stepList(_ task: TaskPlan, _ record: TaskRecord) -> some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(task.steps) { step in
                    StepRow(
                        step: step,
                        initialEstimation: task.initialEstimation(for: step.id),
                        record: record,
                        now: clock.now
                    )
                }
            }
        }
    }

    private var notes: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("notes").monoSmall().foregroundStyle(Theme.dim).padding(.horizontal, 12).padding(.top, 6)
            TextEditor(text: notesBinding)
                .font(Theme.mono)
                .frame(height: 60)
                .scrollContentBackground(.hidden)
                .padding(.horizontal, 8)
                .padding(.bottom, 6)
                .focused($notesFocused)
        }
    }

    private var notesBinding: Binding<String> {
        Binding(
            get: { store.record(taskId: taskId)?.notes ?? "" },
            set: { store.updateNotes(taskId: taskId, notes: $0) }
        )
    }

    private func controls(_ task: TaskPlan, _ record: TaskRecord) -> some View {
        HStack(spacing: 12) {
            if record.currentStepId == nil && !record.hasStarted {
                Text("s start").monoSmall().foregroundStyle(Theme.dim)
            } else if record.end != nil {
                Text("session ended").monoSmall().foregroundStyle(Theme.dim)
                Text("r reset").monoSmall().foregroundStyle(Theme.dim)
            } else {
                Text("n next").monoSmall().foregroundStyle(Theme.dim)
                Text(record.isPaused ? "p resume" : "p pause").monoSmall().foregroundStyle(Theme.dim)
                Text("r reset").monoSmall().foregroundStyle(Theme.dim)
                Text("i notes").monoSmall().foregroundStyle(Theme.dim)
            }
            Spacer()
            Text("esc back").monoSmall().foregroundStyle(Theme.dim)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
    }

    private func startIfNeeded(_ task: TaskPlan, _ record: TaskRecord) -> KeyPress.Result {
        guard record.currentStepId == nil, !record.hasStarted, !task.steps.isEmpty else { return .ignored }
        store.startStepRecord(taskId: task.id, stepId: task.steps[0].id)
        return .handled
    }

    private func nextIfPossible(_ record: TaskRecord) -> KeyPress.Result {
        guard record.currentStepId != nil, !record.isPaused else { return .ignored }
        store.nextStep(taskId: taskId)
        return .handled
    }

    private func togglePause(_ record: TaskRecord) -> KeyPress.Result {
        if record.isPaused {
            store.resume(taskId: taskId)
        } else {
            store.pause(taskId: taskId)
        }
        return .handled
    }

    private func elapsedTotal(_ record: TaskRecord) -> String {
        let total = record.stepRecords.values.reduce(into: 0.0) { acc, range in
            let end = range.end ?? (record.currentStepId.flatMap { record.stepRecords[$0]?.start == range.start ? clock.now : nil } ?? range.start)
            acc += end.timeIntervalSince(range.start)
        }
        return TimeFormat.clock(total)
    }
}

private struct StepRow: View {
    let step: Step
    /// Estimation from the Initial Plan, or `nil` if this Step was added mid-Execution.
    /// The Failure Signal is computed against this — never the current estimation.
    let initialEstimation: Int?
    let record: TaskRecord
    let now: Date

    var body: some View {
        let isCurrent = record.currentStepId == step.id
        let range = record.stepRecords[step.id]
        let isDone = range?.end != nil
        let elapsed: TimeInterval? = {
            guard let range else { return nil }
            return (range.end ?? (isCurrent ? now : range.start)).timeIntervalSince(range.start)
        }()
        let flagged: Bool = {
            guard let elapsed, isDone, let baseline = initialEstimation else { return false }
            let actualMinutes = elapsed / 60
            return EstimationComparator.is10PercentOff(estimation: Double(baseline), duration: actualMinutes)
        }()

        HStack(spacing: 8) {
            Text(glyph(isCurrent: isCurrent, isDone: isDone))
                .foregroundStyle(isCurrent ? Theme.accent : (isDone ? .green : Theme.dim))
                .frame(width: 12)
            Text(step.title)
                .monoBody()
                .lineLimit(1)
                .foregroundStyle(isDone ? Theme.dim : .primary)
            if flagged {
                Text(Theme.Glyph.flagged).foregroundStyle(Theme.flag)
            }
            Spacer()
            Text("\(step.estimation)m").monoSmall().foregroundStyle(Theme.dim).frame(width: 36, alignment: .trailing)
            if let elapsed {
                Text(TimeFormat.clock(elapsed)).monoTimer().frame(width: 56, alignment: .trailing)
            } else {
                Text("—").monoSmall().foregroundStyle(Theme.dim).frame(width: 56, alignment: .trailing)
            }
        }
        .padding(.horizontal, 12)
        .frame(height: Theme.rowHeight)
        .background(isCurrent ? Theme.accent.opacity(0.12) : .clear)
    }

    private func glyph(isCurrent: Bool, isDone: Bool) -> String {
        if isCurrent { return Theme.Glyph.active }
        if isDone { return Theme.Glyph.done }
        return Theme.Glyph.pending
    }
}
