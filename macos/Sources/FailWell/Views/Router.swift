import Foundation
import Observation

@MainActor
@Observable
final class Router {
    enum Screen: Hashable, Sendable {
        case list
        case detail(taskId: String)
        case editor(taskId: String?)
        case record(taskId: String)
        case history(taskId: String)
        case settings
    }

    var stack: [Screen] = [.list]
    var showPalette: Bool = false

    var current: Screen { stack.last ?? .list }

    func push(_ screen: Screen) {
        stack.append(screen)
    }

    func replace(with screen: Screen) {
        stack = [screen]
    }

    func pop() {
        guard stack.count > 1 else { return }
        stack.removeLast()
    }

    func popToRoot() {
        stack = [.list]
    }
}
