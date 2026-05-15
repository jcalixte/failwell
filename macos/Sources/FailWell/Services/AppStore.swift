import Foundation
import Observation

@MainActor
@Observable
final class AppStore {
    private(set) var tasks: [TaskPlan] = []
    private(set) var records: [String: TaskRecord] = [:]

    @ObservationIgnored private let storageURL: URL
    @ObservationIgnored private var pendingSave: Task<Void, Never>?

    private struct DataFile: Codable {
        var version: Int
        var tasks: [TaskPlan]
        var records: [String: TaskRecord]
    }

    init(storageURL: URL? = nil) {
        if let storageURL {
            self.storageURL = storageURL
        } else {
            let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            let dir = appSupport.appendingPathComponent("FailWell", isDirectory: true)
            try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
            self.storageURL = dir.appendingPathComponent("data.json")
        }
        load()
    }

    // MARK: - Persistence

    private func load() {
        guard let data = try? Data(contentsOf: storageURL) else { return }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        do {
            let file = try decoder.decode(DataFile.self, from: data)
            self.tasks = file.tasks
            self.records = file.records
        } catch {
            NSLog("FailWell: failed to decode data.json: \(error)")
        }
    }

    private func scheduleSave() {
        pendingSave?.cancel()
        let url = storageURL
        let snapshot = DataFile(version: 1, tasks: tasks, records: records)
        pendingSave = Task {
            try? await Task.sleep(for: .milliseconds(500))
            guard !Task.isCancelled else { return }
            Self.write(snapshot, to: url)
        }
    }

    private nonisolated static func write(_ file: DataFile, to url: URL) {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        do {
            let data = try encoder.encode(file)
            try data.write(to: url, options: .atomic)
        } catch {
            NSLog("FailWell: failed to write data.json: \(error)")
        }
    }

    /// Flush pending writes synchronously. Used on app termination.
    func flush() {
        pendingSave?.cancel()
        pendingSave = nil
        Self.write(DataFile(version: 1, tasks: tasks, records: records), to: storageURL)
    }

    // MARK: - Task queries

    func task(id: String) -> TaskPlan? {
        tasks.first(where: { $0.id == id })
    }

    var tasksByRecency: [TaskPlan] {
        tasks.sorted(by: { $0.date > $1.date })
    }

    func record(taskId: String) -> TaskRecord? {
        records[taskId]
    }

    // MARK: - Task mutations

    func upsertTask(_ task: TaskPlan) {
        if let idx = tasks.firstIndex(where: { $0.id == task.id }) {
            tasks[idx] = task
        } else {
            tasks.append(task)
        }
        scheduleSave()
    }

    func deleteTask(id: String) {
        tasks.removeAll { $0.id == id }
        records.removeValue(forKey: id)
        scheduleSave()
    }

    func duplicateTask(id: String) -> TaskPlan? {
        guard let source = task(id: id) else { return nil }
        let newId = UUID().uuidString
        let copy = TaskPlan(
            id: newId,
            title: source.title,
            date: Date(),
            link: source.link,
            stepHistory: [source.steps]
        )
        upsertTask(copy)
        return copy
    }

    func editStepsToTask(taskId: String, steps: [Step]) {
        guard var task = task(id: taskId) else { return }
        task.newSteps(steps)
        upsertTask(task)
        cleanCurrentStepId(for: task)
    }

    // MARK: - Record mutations

    func initRecord(taskId: String) {
        if records[taskId] == nil {
            records[taskId] = TaskRecord(taskId: taskId)
            scheduleSave()
        }
    }

    func startStepRecord(taskId: String, stepId: String, at start: Date = Date()) {
        var record = records[taskId] ?? TaskRecord(taskId: taskId)
        if record.stepRecords.isEmpty {
            record.start = start
        }
        record.breakTime = nil
        record.stepRecords[stepId] = TimeRange(start: start)
        record.currentStepId = stepId
        records[taskId] = record
        scheduleSave()
    }

    func endStepRecord(taskId: String, stepId: String, at end: Date = Date()) {
        guard var record = records[taskId], var range = record.stepRecords[stepId] else { return }
        range.end = end
        record.stepRecords[stepId] = range
        records[taskId] = record
        scheduleSave()
    }

    func nextStep(taskId: String, at tick: Date = Date()) {
        guard let task = task(id: taskId),
              let record = records[taskId],
              let currentStepId = record.currentStepId
        else { return }

        endStepRecord(taskId: taskId, stepId: currentStepId, at: tick)

        if let nextStepId = task.nextStepId(after: currentStepId) {
            startStepRecord(taskId: taskId, stepId: nextStepId, at: tick)
        } else {
            endRecord(taskId: taskId, at: tick)
        }
    }

    func endRecord(taskId: String, at end: Date = Date()) {
        guard var record = records[taskId] else { return }
        record.end = end
        record.currentStepId = nil
        records[taskId] = record
        scheduleSave()
    }

    func updateNotes(taskId: String, notes: String) {
        guard var record = records[taskId] else { return }
        record.notes = notes
        records[taskId] = record
        scheduleSave()
    }

    func reset(taskId: String) {
        guard var record = records[taskId] else { return }
        record.stepRecords = [:]
        record.end = nil
        record.currentStepId = nil
        record.breakTime = nil
        records[taskId] = record
        scheduleSave()
    }

    func pause(taskId: String, at start: Date = Date()) {
        guard var record = records[taskId], record.breakTime == nil else { return }
        record.breakTime = TimeRange(start: start)
        records[taskId] = record
        scheduleSave()
    }

    func resume(taskId: String, at end: Date = Date()) {
        guard var record = records[taskId], var breakRange = record.breakTime else { return }
        breakRange.end = end
        record.breakTime = breakRange
        var shifted = BreakCalculator.applyingBreakTime(to: record)
        shifted.breakTime = nil
        records[taskId] = shifted
        scheduleSave()
    }

    /// When task steps change mid-recording, drop step records that no longer exist
    /// and restart from the first unfinished step. Mirrors `cleanCurrentStepId`.
    private func cleanCurrentStepId(for task: TaskPlan) {
        guard var record = records[task.id] else { return }

        // Find first step whose record isn't finished.
        let firstPendingIndex = task.steps.firstIndex(where: { step in
            record.stepRecords[step.id]?.end == nil
        })
        guard let firstPendingIndex else { return }

        let latestStart = record.stepRecords.values
            .map(\.start)
            .max() ?? Date()

        // Drop records for steps after the first pending one.
        let keepIds = Set(task.steps.prefix(firstPendingIndex + 1).map(\.id))
        record.stepRecords = record.stepRecords.filter { keepIds.contains($0.key) }
        records[task.id] = record

        startStepRecord(
            taskId: task.id,
            stepId: task.steps[firstPendingIndex].id,
            at: latestStart
        )
    }

    /// Active recording across all tasks (only one can be active at a time in practice).
    var activeRecord: (task: TaskPlan, record: TaskRecord)? {
        for (taskId, record) in records where record.isActive {
            if let task = task(id: taskId) {
                return (task, record)
            }
        }
        return nil
    }
}

extension TaskPlan {
    func nextStepId(after stepId: String?) -> String? {
        guard let stepId else { return steps.first?.id }
        guard let idx = steps.firstIndex(where: { $0.id == stepId }) else { return nil }
        let next = idx + 1
        return next < steps.count ? steps[next].id : nil
    }

    func step(id: String) -> Step? {
        steps.first(where: { $0.id == id })
    }

    /// The estimation the developer committed to in the Initial Plan for this Step, if any.
    /// Returns `nil` for Steps that were added mid-Execution (no baseline → no Failure Signal).
    /// See CONTEXT.md §"Failure Signal".
    func initialEstimation(for stepId: String) -> Int? {
        initialPlan.first(where: { $0.id == stepId })?.estimation
    }
}
