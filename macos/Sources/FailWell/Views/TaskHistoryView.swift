import SwiftUI

struct TaskHistoryView: View {
    @Environment(AppStore.self) private var store
    @Environment(Router.self) private var router

    let taskId: String

    private var task: TaskPlan? { store.task(id: taskId) }
    private var record: TaskRecord? { store.record(taskId: taskId) }

    var body: some View {
        if let task {
            VStack(spacing: 0) {
                HStack(spacing: 8) {
                    Button { router.pop() } label: { Image(systemName: "chevron.left").foregroundStyle(Theme.dim) }
                        .buttonStyle(.plain)
                    Text("history · \(task.title)").monoTitle().lineLimit(1)
                    Spacer()
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                Divider()
                if let record, !record.stepRecords.isEmpty {
                    summary(task: task, record: record)
                } else {
                    VStack {
                        Text("no recorded session yet").monoBody().foregroundStyle(Theme.dim)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
        } else {
            ContentUnavailableView("Task not found", systemImage: "questionmark.folder")
                .onAppear { router.popToRoot() }
        }
    }

    private func summary(task: TaskPlan, record: TaskRecord) -> some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(task.steps) { step in
                    let range = record.stepRecords[step.id]
                    let actual = range?.duration.map { $0 / 60 } ?? 0
                    // Failure Signal: variance vs the Initial Plan, not the current Plan.
                    // CONTEXT.md §"Failure Signal".
                    let baseline = task.initialEstimation(for: step.id)
                    let flagged = range?.end != nil && baseline.map {
                        EstimationComparator.is10PercentOff(estimation: Double($0), duration: actual)
                    } ?? false
                    HStack(spacing: 8) {
                        Text(range?.end != nil ? Theme.Glyph.done : Theme.Glyph.pending)
                            .foregroundStyle(range?.end != nil ? .green : Theme.dim)
                            .frame(width: 12)
                        Text(step.title).monoBody().lineLimit(1)
                        if flagged { Text(Theme.Glyph.flagged).foregroundStyle(Theme.flag) }
                        Spacer()
                        Group {
                            if let baseline {
                                Text("est \(baseline)m").monoSmall()
                            } else {
                                Text("(added)").monoSmall()
                            }
                        }
                        .foregroundStyle(Theme.dim)
                        Text("actual \(Int(actual.rounded()))m").monoSmall()
                            .foregroundStyle(flagged ? Theme.flag : .primary)
                            .frame(width: 80, alignment: .trailing)
                    }
                    .padding(.horizontal, 12)
                    .frame(height: Theme.rowHeight)
                }
                if !record.notes.isEmpty {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("notes").monoSmall().foregroundStyle(Theme.dim).padding(.top, 8)
                        Text(record.notes).monoBody()
                    }
                    .padding(.horizontal, 12)
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
        }
    }
}
