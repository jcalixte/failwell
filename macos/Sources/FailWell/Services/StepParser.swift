import CryptoKit
import Foundation

enum StepParser {
    static func adaptStepsToTextarea(_ steps: [Step]) -> String {
        steps.map { "- \($0.title) | \($0.estimation)" }.joined(separator: "\n")
    }

    static func adaptTextareaToSteps(_ value: String) -> [Step] {
        let lines = value.components(separatedBy: "\n")
        var result: [(title: String, estimation: Int)] = []
        var currentParent: (title: String, estimation: Int)?
        var parentHasChildren = false

        func flushParent() {
            if let parent = currentParent, !parentHasChildren {
                result.append(parent)
            }
            currentParent = nil
            parentHasChildren = false
        }

        for line in lines {
            let (title, estimation) = extractTitleAndEstimation(from: line)
            if title.isEmpty { continue }

            if isIndented(line) {
                if let parent = currentParent, !parent.title.isEmpty {
                    let flattened = "(\(parent.title)) - \(title)"
                    result.append((flattened, estimation))
                    parentHasChildren = true
                } else {
                    result.append((title, estimation))
                }
            } else {
                flushParent()
                currentParent = (title, estimation)
            }
        }
        flushParent()

        // Step identity is derived from title only. Re-estimation must preserve identity so
        // the existing Step Record (keyed by Step id) survives — see CONTEXT.md §"Re-estimation".
        let bases = result.map { md5($0.title) }
        return result.enumerated().map { index, item in
            let base = bases[index]
            let duplicates = bases[...index].filter { $0 == base }.count
            return Step(id: "\(base)-\(duplicates)", title: item.title, estimation: item.estimation)
        }
    }

    private static func isIndented(_ line: String) -> Bool {
        guard let first = line.first else { return false }
        return first == " " || first == "\t"
    }

    nonisolated(unsafe) private static let stripPrefix = /^-\s*(\[[ x]\]\s*)?/

    private static func extractTitleAndEstimation(from rawStep: String) -> (String, Int) {
        let trimmed = rawStep.trimmingCharacters(in: .whitespaces)
        let stripped = trimmed.replacing(stripPrefix, with: "")
        let parts = stripped.split(separator: "|", maxSplits: 1, omittingEmptySubsequences: false)
        let title = parts.first.map { $0.trimmingCharacters(in: .whitespaces) } ?? ""
        let rawEstimation = parts.count > 1 ? String(parts[1]).trimmingCharacters(in: .whitespaces) : ""

        let estimation: Int
        if rawEstimation.isEmpty {
            estimation = 0
        } else if let d = Double(rawEstimation), !d.isNaN {
            estimation = Int(d.rounded())
        } else {
            estimation = 0
        }
        return (title, estimation)
    }

    private static func md5(_ s: String) -> String {
        let digest = Insecure.MD5.hash(data: Data(s.utf8))
        return digest.map { String(format: "%02x", $0) }.joined()
    }
}
