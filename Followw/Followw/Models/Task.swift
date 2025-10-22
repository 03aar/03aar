import Foundation

struct Task: Identifiable, Codable, Hashable {
    var id: UUID
    var title: String
    var notes: String
    var isCompleted: Bool
    var isFocusTask: Bool
    var clientId: UUID?
    var projectId: UUID?
    var tags: [String]
    var links: [TaskLink]
    var attachments: [TaskAttachment]
    var dueDate: Date?
    var createdAt: Date
    var completedAt: Date?
    var estimatedMinutes: Int?
    var timeEntries: [UUID]

    init(
        id: UUID = UUID(),
        title: String,
        notes: String = "",
        isCompleted: Bool = false,
        isFocusTask: Bool = false,
        clientId: UUID? = nil,
        projectId: UUID? = nil,
        tags: [String] = [],
        links: [TaskLink] = [],
        attachments: [TaskAttachment] = [],
        dueDate: Date? = nil,
        createdAt: Date = Date(),
        completedAt: Date? = nil,
        estimatedMinutes: Int? = nil,
        timeEntries: [UUID] = []
    ) {
        self.id = id
        self.title = title
        self.notes = notes
        self.isCompleted = isCompleted
        self.isFocusTask = isFocusTask
        self.clientId = clientId
        self.projectId = projectId
        self.tags = tags
        self.links = links
        self.attachments = attachments
        self.dueDate = dueDate
        self.createdAt = createdAt
        self.completedAt = completedAt
        self.estimatedMinutes = estimatedMinutes
        self.timeEntries = timeEntries
    }

    var isOverdue: Bool {
        guard let dueDate = dueDate, !isCompleted else { return false }
        return dueDate < Date()
    }

    var totalTimeSpent: TimeInterval {
        return timeEntries.compactMap { id in
            DataManager.shared.timeEntries.first(where: { $0.id == id })
        }.reduce(0) { $0 + $1.duration }
    }
}

struct TaskLink: Identifiable, Codable, Hashable {
    var id: UUID
    var url: String
    var title: String
    var createdAt: Date

    init(id: UUID = UUID(), url: String, title: String = "", createdAt: Date = Date()) {
        self.id = id
        self.url = url
        self.title = title.isEmpty ? url : title
        self.createdAt = createdAt
    }
}

struct TaskAttachment: Identifiable, Codable, Hashable {
    var id: UUID
    var fileName: String
    var filePath: String
    var fileSize: Int64
    var createdAt: Date

    init(
        id: UUID = UUID(),
        fileName: String,
        filePath: String,
        fileSize: Int64 = 0,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.fileName = fileName
        self.filePath = filePath
        self.fileSize = fileSize
        self.createdAt = createdAt
    }
}
