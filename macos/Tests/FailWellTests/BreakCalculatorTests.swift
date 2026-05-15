import Foundation
import Testing
@testable import FailWell

@Suite("BreakCalculator")
struct BreakCalculatorTests {
    @Test func passesThroughWhenNoBreakTime() {
        let record = TaskRecord(
            taskId: "t1",
            stepRecords: ["step-id-1": TimeRange(start: date("2023-04-17T18:00:00Z"))],
            breakTime: nil
        )
        #expect(BreakCalculator.applyingBreakTime(to: record) == record)
    }

    @Test func passesThroughWhenBreakNotEnded() {
        let record = TaskRecord(
            taskId: "t1",
            stepRecords: ["step-id-1": TimeRange(start: date("2023-04-17T18:00:00Z"))],
            breakTime: TimeRange(start: date("2023-04-17T19:00:00Z"))
        )
        #expect(BreakCalculator.applyingBreakTime(to: record) == record)
    }

    @Test func shiftsUnfinishedStepStartsByBreakDuration() {
        let record = TaskRecord(
            taskId: "t1",
            stepRecords: ["step-id-1": TimeRange(start: date("2023-04-17T18:00:00Z"))],
            breakTime: TimeRange(
                start: date("2023-04-17T19:00:00Z"),
                end: date("2023-04-17T20:00:00Z")
            )
        )
        let result = BreakCalculator.applyingBreakTime(to: record)
        #expect(result.stepRecords["step-id-1"]?.start == date("2023-04-17T19:00:00Z"))
    }

    @Test func doesNotShiftFinishedStepRecords() {
        let record = TaskRecord(
            taskId: "t1",
            stepRecords: [
                "step-id-1": TimeRange(
                    start: date("2023-04-17T17:00:00Z"),
                    end: date("2023-04-17T18:00:00Z")
                ),
                "step-id-2": TimeRange(start: date("2023-04-17T18:00:00Z"))
            ],
            breakTime: TimeRange(
                start: date("2023-04-17T19:00:00Z"),
                end: date("2023-04-17T20:00:00Z")
            )
        )
        let result = BreakCalculator.applyingBreakTime(to: record)
        #expect(result.stepRecords["step-id-1"]?.start == date("2023-04-17T17:00:00Z"))
        #expect(result.stepRecords["step-id-1"]?.end == date("2023-04-17T18:00:00Z"))
        #expect(result.stepRecords["step-id-2"]?.start == date("2023-04-17T19:00:00Z"))
    }

    private func date(_ iso: String) -> Date {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f.date(from: iso) ?? ISO8601DateFormatter().date(from: iso)!
    }
}
