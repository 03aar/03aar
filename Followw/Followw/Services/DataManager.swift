import Foundation
import Combine

class DataManager: ObservableObject {
    static let shared = DataManager()

    @Published var tasks: [Task] = []
    @Published var clients: [Client] = []
    @Published var projects: [Project] = []
    @Published var timeEntries: [TimeEntry] = []
    @Published var dailyStats: [DailyStats] = []

    private let tasksKey = "followw_tasks"
    private let clientsKey = "followw_clients"
    private let projectsKey = "followw_projects"
    private let timeEntriesKey = "followw_time_entries"
    private let dailyStatsKey = "followw_daily_stats"

    private init() {
        loadData()
    }

    // MARK: - Data Persistence

    func loadData() {
        tasks = load(key: tasksKey) ?? []
        clients = load(key: clientsKey) ?? []
        projects = load(key: projectsKey) ?? []
        timeEntries = load(key: timeEntriesKey) ?? []
        dailyStats = load(key: dailyStatsKey) ?? []
    }

    func saveData() {
        save(tasks, key: tasksKey)
        save(clients, key: clientsKey)
        save(projects, key: projectsKey)
        save(timeEntries, key: timeEntriesKey)
        save(dailyStats, key: dailyStatsKey)
    }

    private func save<T: Codable>(_ items: [T], key: String) {
        if let encoded = try? JSONEncoder().encode(items) {
            UserDefaults.standard.set(encoded, forKey: key)
        }
    }

    private func load<T: Codable>(key: String) -> [T]? {
        guard let data = UserDefaults.standard.data(forKey: key),
              let decoded = try? JSONDecoder().decode([T].self, from: data) else {
            return nil
        }
        return decoded
    }

    // MARK: - Task Operations

    func addTask(_ task: Task) {
        tasks.append(task)
        saveData()
    }

    func updateTask(_ task: Task) {
        if let index = tasks.firstIndex(where: { $0.id == task.id }) {
            tasks[index] = task
            saveData()
        }
    }

    func deleteTask(_ task: Task) {
        tasks.removeAll { $0.id == task.id }
        saveData()
    }

    func completeTask(_ task: Task) {
        var updatedTask = task
        updatedTask.isCompleted = true
        updatedTask.completedAt = Date()
        updateTask(updatedTask)
    }

    func getTodayTasks() -> [Task] {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())

        return tasks.filter { task in
            !task.isCompleted && (
                task.isFocusTask ||
                (task.dueDate != nil && calendar.isDate(task.dueDate!, inSameDayAs: today))
            )
        }.sorted { ($0.isFocusTask ? 0 : 1, $0.createdAt) < ($1.isFocusTask ? 0 : 1, $1.createdAt) }
    }

    // MARK: - Client Operations

    func addClient(_ client: Client) {
        clients.append(client)
        saveData()
    }

    func updateClient(_ client: Client) {
        if let index = clients.firstIndex(where: { $0.id == client.id }) {
            clients[index] = client
            saveData()
        }
    }

    func deleteClient(_ client: Client) {
        clients.removeAll { $0.id == client.id }
        // Also delete associated projects and tasks
        let clientProjects = projects.filter { $0.clientId == client.id }
        for project in clientProjects {
            deleteProject(project)
        }
        saveData()
    }

    // MARK: - Project Operations

    func addProject(_ project: Project) {
        projects.append(project)
        if let clientId = project.clientId,
           let clientIndex = clients.firstIndex(where: { $0.id == clientId }) {
            clients[clientIndex].projects.append(project.id)
        }
        saveData()
    }

    func updateProject(_ project: Project) {
        if let index = projects.firstIndex(where: { $0.id == project.id }) {
            projects[index] = project
            saveData()
        }
    }

    func deleteProject(_ project: Project) {
        projects.removeAll { $0.id == project.id }
        // Also delete associated tasks
        tasks.removeAll { $0.projectId == project.id }
        saveData()
    }

    // MARK: - Time Tracking

    func startTimer(for task: Task) {
        let entry = TimeEntry(taskId: task.id)
        timeEntries.append(entry)
        saveData()
    }

    func stopTimer(for task: Task) {
        if let index = timeEntries.firstIndex(where: { $0.taskId == task.id && $0.isActive }) {
            timeEntries[index].stop()
            saveData()
        }
    }

    func getActiveTimer() -> TimeEntry? {
        timeEntries.first(where: { $0.isActive })
    }

    func getActiveTimerTask() -> Task? {
        guard let activeTimer = getActiveTimer() else { return nil }
        return tasks.first(where: { $0.id == activeTimer.taskId })
    }

    // MARK: - Analytics

    func getTodayStats() -> DailyStats {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())

        let todayEntries = timeEntries.filter {
            calendar.isDate($0.startTime, inSameDayAs: today)
        }

        let totalMinutes = Int(todayEntries.reduce(0) { $0 + $1.duration } / 60)
        let tasksCompleted = tasks.filter {
            guard let completedAt = $0.completedAt else { return false }
            return calendar.isDate(completedAt, inSameDayAs: today)
        }.count

        return DailyStats(
            date: today,
            totalMinutes: totalMinutes,
            tasksCompleted: tasksCompleted,
            focusSessions: todayEntries.count,
            longestStreak: 0 // TODO: Calculate longest streak
        )
    }

    func getWeeklyStats() -> [DailyStats] {
        let calendar = Calendar.current
        let today = Date()
        var stats: [DailyStats] = []

        for dayOffset in 0..<7 {
            if let date = calendar.date(byAdding: .day, value: -dayOffset, to: today) {
                let dayStart = calendar.startOfDay(for: date)
                let dayEntries = timeEntries.filter {
                    calendar.isDate($0.startTime, inSameDayAs: dayStart)
                }

                let totalMinutes = Int(dayEntries.reduce(0) { $0 + $1.duration } / 60)
                let tasksCompleted = tasks.filter {
                    guard let completedAt = $0.completedAt else { return false }
                    return calendar.isDate(completedAt, inSameDayAs: dayStart)
                }.count

                stats.append(DailyStats(
                    date: dayStart,
                    totalMinutes: totalMinutes,
                    tasksCompleted: tasksCompleted,
                    focusSessions: dayEntries.count,
                    longestStreak: 0
                ))
            }
        }

        return stats.reversed()
    }
}
