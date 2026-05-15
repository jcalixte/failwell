import AppKit
import Foundation

enum ClipboardImporter {
    struct Draft: Equatable {
        var title: String?
        var steps: [Step]
    }

    /// Reads the current pasteboard and, if it looks like a markdown task
    /// (`# Title` optional, followed by `- step | mins` lines), returns a draft.
    static func currentDraft() -> Draft? {
        guard let text = NSPasteboard.general.string(forType: .string) else { return nil }
        return draft(from: text)
    }

    static func draft(from text: String) -> Draft? {
        let (title, content) = extractTitleAndContent(text)
        let steps = StepParser.adaptTextareaToSteps(content)
        guard !steps.isEmpty else { return nil }
        return Draft(title: title, steps: steps)
    }

    nonisolated(unsafe) private static let titleRegex = /^(#{1,6})\s+(.+?)\n+([\s\S]*)$/

    private static func extractTitleAndContent(_ text: String) -> (title: String?, content: String) {
        if let match = try? titleRegex.firstMatch(in: text) {
            return (String(match.2).trimmingCharacters(in: .whitespaces), String(match.3))
        }
        return (nil, text)
    }
}
