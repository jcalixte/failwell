import Foundation

/// A planned task with a title, optional link, and an append-only history of step lists.
/// Named `TaskPlan` to avoid collision with `_Concurrency.Task`.
struct TaskPlan: Codable, Identifiable, Hashable, Sendable {
    let id: String
    var title: String
    var date: Date
    var link: String?
    var stepHistory: [[Step]]

    init(id: String, title: String, date: Date = Date(), link: String? = nil, stepHistory: [[Step]] = []) {
        self.id = id
        self.title = title
        self.date = date
        self.link = link
        self.stepHistory = stepHistory
    }

    var steps: [Step] {
        stepHistory.last ?? []
    }

    var initialPlan: [Step] {
        stepHistory.first ?? []
    }

    var wasUpdated: Bool {
        stepHistory.count > 1
    }

    var totalEstimation: Int {
        steps.reduce(0) { $0 + $1.estimation }
    }

    mutating func newSteps(_ steps: [Step]) {
        stepHistory.append(steps)
    }

    mutating func editSteps(_ steps: [Step]) {
        stepHistory.append(self.steps + steps)
    }

    mutating func updateSteps(_ steps: [Step]) {
        stepHistory.append(steps)
    }

    mutating func removeStep(at index: Int) {
        guard index >= 0, index < steps.count else { return }
        stepHistory.append(steps.enumerated().compactMap { i, step in
            i == index ? nil : step
        })
    }
}
