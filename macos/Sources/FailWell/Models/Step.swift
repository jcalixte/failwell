import Foundation

struct Step: Codable, Identifiable, Hashable, Sendable {
    let id: String
    var title: String
    /// estimation in minutes
    var estimation: Int
}
