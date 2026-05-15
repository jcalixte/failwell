import Foundation

struct TaskRecord: Codable, Hashable, Sendable {
    let taskId: String
    var start: Date
    var end: Date?
    var stepRecords: [String: TimeRange]
    var notes: String
    var breakTime: TimeRange?
    var currentStepId: String?

    init(
        taskId: String,
        start: Date = Date(),
        end: Date? = nil,
        stepRecords: [String: TimeRange] = [:],
        notes: String = "",
        breakTime: TimeRange? = nil,
        currentStepId: String? = nil
    ) {
        self.taskId = taskId
        self.start = start
        self.end = end
        self.stepRecords = stepRecords
        self.notes = notes
        self.breakTime = breakTime
        self.currentStepId = currentStepId
    }

    var isActive: Bool {
        end == nil && currentStepId != nil
    }

    var isPaused: Bool {
        breakTime != nil && breakTime?.end == nil
    }

    var hasStarted: Bool {
        !stepRecords.isEmpty
    }
}
