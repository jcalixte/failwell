import SwiftUI

enum Theme {
    static let mono: Font = .system(size: 12, weight: .regular, design: .monospaced)
    static let monoSmall: Font = .system(size: 11, weight: .regular, design: .monospaced)
    static let monoBold: Font = .system(size: 12, weight: .semibold, design: .monospaced)
    static let monoTitle: Font = .system(size: 13, weight: .semibold, design: .monospaced)
    static let monoTimer: Font = .system(size: 14, weight: .medium, design: .monospaced).monospacedDigit()

    static let rowHeight: CGFloat = 24
    static let popoverWidth: CGFloat = 420
    static let popoverHeight: CGFloat = 520

    static let dim: Color = .secondary
    static let accent: Color = .accentColor
    static let flag: Color = .orange

    enum Glyph {
        static let pending = "·"
        static let active = "▶"
        static let done = "✓"
        static let flagged = "!"
        static let paused = "⏸"
    }
}

extension View {
    func monoBody() -> some View { self.font(Theme.mono) }
    func monoSmall() -> some View { self.font(Theme.monoSmall) }
    func monoTitle() -> some View { self.font(Theme.monoTitle) }
    func monoTimer() -> some View { self.font(Theme.monoTimer) }
}
