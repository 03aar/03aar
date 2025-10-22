import Foundation
import SwiftUI

struct Project: Identifiable, Codable, Hashable {
    var id: UUID
    var name: String
    var clientId: UUID?
    var color: String
    var icon: String
    var description: String
    var isArchived: Bool
    var createdAt: Date
    var tasks: [UUID]

    init(
        id: UUID = UUID(),
        name: String,
        clientId: UUID? = nil,
        color: String = "#3A76F0",
        icon: String = "folder.fill",
        description: String = "",
        isArchived: Bool = false,
        createdAt: Date = Date(),
        tasks: [UUID] = []
    ) {
        self.id = id
        self.name = name
        self.clientId = clientId
        self.color = color
        self.icon = icon
        self.description = description
        self.isArchived = isArchived
        self.createdAt = createdAt
        self.tasks = tasks
    }

    var swiftUIColor: Color {
        Color(hex: color) ?? .blue
    }
}
