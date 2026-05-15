import Foundation

enum EstimationComparator {
    /// Returns `true` when the actual duration deviates from the estimation by more than
    /// 10 % (with a 1-minute floor for very short steps). Mirrors `is10PercentOffThanEstimation`.
    static func is10PercentOff(estimation: Double, duration: Double) -> Bool {
        abs(duration - estimation) > max(estimation * 0.1, 1)
    }

    static func is10PercentOff(estimation: Int, duration: Int) -> Bool {
        is10PercentOff(estimation: Double(estimation), duration: Double(duration))
    }
}
