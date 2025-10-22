import Foundation
import SwiftUI

struct Client: Identifiable, Codable, Hashable {
    var id: UUID
    var name: String
    var color: String // Hex color code
    var icon: String // SF Symbol name
    var notes: String
    var isArchived: Bool
    var createdAt: Date
    var projects: [UUID]

    init(
        id: UUID = UUID(),
        name: String,
        color: String = "#3A76F0",
        icon: String = "person.circle.fill",
        notes: String = "",
        isArchived: Bool = false,
        createdAt: Date = Date(),
        projects: [UUID] = []
    ) {
        self.id = id
        self.name = name
        self.color = color
        self.icon = icon
        self.notes = notes
        self.isArchived = isArchived
        self.createdAt = createdAt
        self.projects = projects
    }

    var swiftUIColor: Color {
        Color(hex: color) ?? .blue
    }
}
