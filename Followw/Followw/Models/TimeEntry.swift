import Foundation

struct TimeEntry: Identifiable, Codable, Hashable {
    var id: UUID
    var taskId: UUID
    var startTime: Date
    var endTime: Date?
    var duration: TimeInterval
    var notes: String

    init(
        id: UUID = UUID(),
        taskId: UUID,
        startTime: Date = Date(),
        endTime: Date? = nil,
        duration: TimeInterval = 0,
        notes: String = ""
    ) {
        self.id = id
        self.taskId = taskId
        self.startTime = startTime
        self.endTime = endTime
        self.duration = duration
        self.notes = notes
    }

    var isActive: Bool {
        endTime == nil
    }

    mutating func stop() {
        guard isActive else { return }
        let now = Date()
        endTime = now
        duration = now.timeIntervalSince(startTime)
    }
}

struct DailyStats: Codable {
    var date: Date
    var totalMinutes: Int
    var tasksCompleted: Int
    var focusSessions: Int
    var longestStreak: Int

    init(
        date: Date = Date(),
        totalMinutes: Int = 0,
        tasksCompleted: Int = 0,
        focusSessions: Int = 0,
        longestStreak: Int = 0
    ) {
        self.date = date
        self.totalMinutes = totalMinutes
        self.tasksCompleted = tasksCompleted
        self.focusSessions = focusSessions
        self.longestStreak = longestStreak
    }
}
