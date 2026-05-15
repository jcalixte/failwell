import Foundation

struct TimeRange: Codable, Hashable, Sendable {
    var start: Date
    var end: Date?

    var duration: TimeInterval? {
        guard let end else { return nil }
        return end.timeIntervalSince(start)
    }
}
