import Foundation

enum BreakCalculator {
    /// Shifts the `start` of any unfinished step records forward by the break duration.
    /// Mirrors `addBreakTimeToStepRecords` from the PWA.
    static func applyingBreakTime(to record: TaskRecord) -> TaskRecord {
        guard let breakTime = record.breakTime, let breakEnd = breakTime.end else {
            return record
        }

        let diff = breakEnd.timeIntervalSince(breakTime.start)

        var updated = record
        for (stepId, range) in updated.stepRecords where range.end == nil {
            updated.stepRecords[stepId] = TimeRange(
                start: range.start.addingTimeInterval(diff),
                end: nil
            )
        }
        return updated
    }
}
