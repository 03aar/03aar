import Foundation
import Combine

class TimerManager: ObservableObject {
    static let shared = TimerManager()

    @Published var activeTask: Task?
    @Published var elapsedTime: TimeInterval = 0
    @Published var isRunning: Bool = false

    private var timer: Timer?
    private var startTime: Date?

    private init() {}

    func startTimer(for task: Task) {
        stopTimer() // Stop any existing timer

        activeTask = task
        startTime = Date()
        isRunning = true
        elapsedTime = 0

        // Start the time entry
        DataManager.shared.startTimer(for: task)

        // Create timer that updates every second
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            guard let self = self, let start = self.startTime else { return }
            self.elapsedTime = Date().timeIntervalSince(start)
        }
    }

    func stopTimer() {
        timer?.invalidate()
        timer = nil

        if let task = activeTask {
            DataManager.shared.stopTimer(for: task)
        }

        isRunning = false
        activeTask = nil
        startTime = nil
        elapsedTime = 0
    }

    func toggleTimer(for task: Task) {
        if isRunning && activeTask?.id == task.id {
            stopTimer()
        } else {
            startTimer(for: task)
        }
    }

    var formattedTime: String {
        let hours = Int(elapsedTime) / 3600
        let minutes = Int(elapsedTime) / 60 % 60
        let seconds = Int(elapsedTime) % 60

        if hours > 0 {
            return String(format: "%d:%02d:%02d", hours, minutes, seconds)
        } else {
            return String(format: "%d:%02d", minutes, seconds)
        }
    }
}
