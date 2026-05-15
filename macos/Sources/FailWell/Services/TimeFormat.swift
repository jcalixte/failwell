import Foundation

enum TimeFormat {
    /// "MM:SS" or "H:MM:SS" depending on magnitude.
    static func clock(_ seconds: TimeInterval) -> String {
        let total = max(0, Int(seconds))
        let h = total / 3600
        let m = (total % 3600) / 60
        let s = total % 60
        if h > 0 { return String(format: "%d:%02d:%02d", h, m, s) }
        return String(format: "%d:%02d", m, s)
    }

    /// Rounded to minutes. Returns "0m" for sub-minute durations.
    static func minutes(_ seconds: TimeInterval) -> String {
        "\(Int((seconds / 60).rounded()))m"
    }

    /// Compact relative-date string, e.g. "today", "yesterday", "Mar 14".
    static func date(_ date: Date, relativeTo reference: Date = Date()) -> String {
        let cal = Calendar.current
        if cal.isDateInToday(date) { return "today" }
        if cal.isDateInYesterday(date) { return "yesterday" }
        let f = DateFormatter()
        f.dateFormat = cal.component(.year, from: date) == cal.component(.year, from: reference) ? "MMM d" : "MMM d yyyy"
        return f.string(from: date)
    }
}
