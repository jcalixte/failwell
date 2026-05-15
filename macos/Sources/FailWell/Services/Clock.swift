import Foundation
import Observation

@MainActor
@Observable
final class Clock {
    var now: Date = Date()

    @ObservationIgnored private var tickTask: Task<Void, Never>?

    init(tickInterval: Duration = .milliseconds(500)) {
        tickTask = Task { [weak self] in
            while !Task.isCancelled {
                await MainActor.run {
                    self?.now = Date()
                }
                try? await Task.sleep(for: tickInterval)
            }
        }
    }

    deinit {
        tickTask?.cancel()
    }
}
