/**
 * FOLLOWW - The Flow Operating System
 * Complete Application Logic
 */

const { ipcRenderer } = require('electron');

// ===== State Management =====
class AppState {
    constructor() {
        this.tasks = [];
        this.clients = [];
        this.projects = [];
        this.timeEntries = [];
        this.settings = {
            theme: 'system',
            soundEnabled: true,
            focusMode: false
        };
        this.activeTimer = null;
        this.timerInterval = null;
        this.currentView = 'today';
    }

    async load() {
        const data = await ipcRenderer.invoke('get-all-data');
        this.tasks = data.tasks || [];
        this.clients = data.clients || [];
        this.projects = data.projects || [];
        this.timeEntries = data.timeEntries || [];
        this.settings = data.settings || this.settings;
    }

    save() {
        ipcRenderer.send('save-all-data', {
            tasks: this.tasks,
            clients: this.clients,
            projects: this.projects,
            timeEntries: this.timeEntries,
            settings: this.settings
        });
    }

    // Task Operations
    addTask(task) {
        const newTask = {
            id: Date.now().toString(),
            title: task.title,
            notes: task.notes || '',
            isCompleted: false,
            isFocusTask: task.isFocusTask || false,
            clientId: task.clientId || null,
            projectId: task.projectId || null,
            tags: task.tags || [],
            links: task.links || [],
            dueDate: task.dueDate || null,
            createdAt: new Date().toISOString(),
            completedAt: null,
            timeEntries: []
        };
        this.tasks.push(newTask);
        this.save();
        return newTask;
    }

    updateTask(id, updates) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updates };
            this.save();
            return this.tasks[index];
        }
        return null;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
    }

    completeTask(id) {
        return this.updateTask(id, {
            isCompleted: true,
            completedAt: new Date().toISOString()
        });
    }

    getTodayTasks() {
        return this.tasks.filter(t => !t.isCompleted && (t.isFocusTask || this.isToday(t.dueDate)));
    }

    getFocusTasks() {
        return this.getTodayTasks().filter(t => t.isFocusTask);
    }

    getSupportingTasks() {
        return this.getTodayTasks().filter(t => !t.isFocusTask);
    }

    // Time Tracking
    startTimer(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return null;

        const entry = {
            id: Date.now().toString(),
            taskId,
            startTime: new Date().toISOString(),
            endTime: null,
            duration: 0
        };

        this.timeEntries.push(entry);
        task.timeEntries.push(entry.id);
        this.activeTimer = { entryId: entry.id, taskId, startTime: Date.now() };
        this.save();
        return entry;
    }

    stopTimer() {
        if (!this.activeTimer) return null;

        const entry = this.timeEntries.find(e => e.id === this.activeTimer.entryId);
        if (entry) {
            entry.endTime = new Date().toISOString();
            entry.duration = Date.now() - this.activeTimer.startTime;
            this.save();
        }

        const result = this.activeTimer;
        this.activeTimer = null;
        return result;
    }

    getElapsedTime() {
        if (!this.activeTimer) return 0;
        return Date.now() - this.activeTimer.startTime;
    }

    // Analytics
    getTodayStats() {
        const today = new Date().toDateString();
        const todayEntries = this.timeEntries.filter(e =>
            new Date(e.startTime).toDateString() === today
        );

        const totalTime = todayEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
        const tasksCompleted = this.tasks.filter(t =>
            t.completedAt && new Date(t.completedAt).toDateString() === today
        ).length;

        return {
            totalMinutes: Math.floor(totalTime / 60000),
            tasksCompleted,
            focusSessions: todayEntries.length
        };
    }

    // Helpers
    isToday(dateString) {
        if (!dateString) return false;
        return new Date(dateString).toDateString() === new Date().toDateString();
    }

    formatTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// ===== UI Manager =====
class UIManager {
    constructor(state) {
        this.state = state;
        this.init();
    }

    init() {
        this.updateGreeting();
        this.setupEventListeners();
        this.renderTodayView();

        // Update greeting every minute
        setInterval(() => this.updateGreeting(), 60000);
    }

    setupEventListeners() {
        // Close button
        document.getElementById('close-button').addEventListener('click', () => {
            ipcRenderer.send('hide-window');
        });

        // View tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Quick add
        const quickAddInput = document.getElementById('quick-add-input');
        quickAddInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                this.handleQuickAdd(e.target.value.trim());
                e.target.value = '';
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ipcRenderer.send('hide-window');
            }
        });

        // Command palette (Cmd+K handled by main process)
        ipcRenderer.on('show-command-palette', () => {
            this.showCommandPalette();
        });
    }

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting;

        if (hour < 12) greeting = 'good morning.';
        else if (hour < 17) greeting = 'good afternoon.';
        else if (hour < 21) greeting = 'good evening.';
        else greeting = 'good night.';

        document.getElementById('greeting-text').textContent = greeting;
    }

    switchView(viewName) {
        // Update tabs
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');

            // Render view-specific content
            switch(viewName) {
                case 'today':
                    this.renderTodayView();
                    break;
                case 'tasks':
                    this.renderAllTasksView();
                    break;
                case 'projects':
                    this.renderProjectsView();
                    break;
                case 'analytics':
                    this.renderAnalyticsView();
                    break;
            }
        }

        this.state.currentView = viewName;
    }

    handleQuickAdd(text) {
        // Simple natural language parsing
        const isFocusTask = text.toLowerCase().includes('focus') ||
                           text.toLowerCase().includes('important');

        const task = this.state.addTask({
            title: text,
            isFocusTask: isFocusTask || this.state.getFocusTasks().length < 3
        });

        this.renderTodayView();
        this.playSound('complete');
    }

    renderTodayView() {
        const stats = this.state.getTodayStats();

        // Update stats
        const hours = Math.floor(stats.totalMinutes / 60);
        const minutes = stats.totalMinutes % 60;
        const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        document.getElementById('today-time').textContent = timeText;
        document.getElementById('today-completed').textContent = stats.tasksCompleted;
        document.getElementById('today-sessions').textContent = stats.focusSessions;

        // Render tasks
        const focusTasks = this.state.getFocusTasks();
        const supportingTasks = this.state.getSupportingTasks();

        const focusSection = document.getElementById('focus-tasks-section');
        const supportingSection = document.getElementById('supporting-tasks-section');
        const emptyState = document.getElementById('empty-state');

        if (focusTasks.length === 0 && supportingTasks.length === 0) {
            focusSection.style.display = 'none';
            supportingSection.style.display = 'none';
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';

            if (focusTasks.length > 0) {
                focusSection.style.display = 'block';
                this.renderTaskList(focusTasks, 'focus-tasks-list');
            } else {
                focusSection.style.display = 'none';
            }

            if (supportingTasks.length > 0) {
                supportingSection.style.display = 'block';
                this.renderTaskList(supportingTasks, 'supporting-tasks-list');
            } else {
                supportingSection.style.display = 'none';
            }
        }

        // Update floating timer if active
        this.updateFloatingTimer();
    }

    renderTaskList(tasks, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        tasks.forEach(task => {
            const taskEl = this.createTaskElement(task);
            container.appendChild(taskEl);
        });
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = 'task-row' + (task.isCompleted ? ' completed' : '');

        const isTimerActive = this.state.activeTimer?.taskId === task.id;

        div.innerHTML = `
            <div class="task-checkbox" data-task-id="${task.id}"></div>
            <div class="task-content">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                ${task.tags.length > 0 ? `
                    <div class="task-meta">
                        ${task.tags.map(tag => `<span>#${tag}</span>`).join(' ')}
                    </div>
                ` : ''}
            </div>
            <button class="task-timer-button ${isTimerActive ? 'active' : ''}" data-task-id="${task.id}">
                <svg viewBox="0 0 24 24">
                    ${isTimerActive ?
                        '<rect x="6" y="6" width="12" height="12" fill="currentColor"/>' :
                        '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>'}
                </svg>
            </button>
        `;

        // Checkbox click
        const checkbox = div.querySelector('.task-checkbox');
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleTaskComplete(task.id);
        });

        // Timer button click
        const timerBtn = div.querySelector('.task-timer-button');
        timerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleTimer(task.id);
        });

        // Task click - open detail
        div.addEventListener('click', () => {
            this.showTaskDetail(task.id);
        });

        return div;
    }

    toggleTaskComplete(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (task.isCompleted) {
            this.state.updateTask(taskId, { isCompleted: false, completedAt: null });
        } else {
            this.state.completeTask(taskId);
            this.playSound('complete');

            // Check if end of day
            if (this.shouldShowReflection()) {
                setTimeout(() => this.showReflection(), 500);
            }
        }

        this.renderTodayView();
    }

    toggleTimer(taskId) {
        if (this.state.activeTimer?.taskId === taskId) {
            // Stop timer
            this.state.stopTimer();
            if (this.state.timerInterval) {
                clearInterval(this.state.timerInterval);
                this.state.timerInterval = null;
            }
            this.playSound('timer');
        } else {
            // Stop any existing timer
            if (this.state.activeTimer) {
                this.state.stopTimer();
                if (this.state.timerInterval) {
                    clearInterval(this.state.timerInterval);
                }
            }

            // Start new timer
            this.state.startTimer(taskId);
            this.state.timerInterval = setInterval(() => {
                this.updateFloatingTimer();
            }, 1000);
        }

        this.renderTodayView();
    }

    updateFloatingTimer() {
        const floatingTimer = document.getElementById('floating-timer');

        if (this.state.activeTimer) {
            const task = this.state.tasks.find(t => t.id === this.state.activeTimer.taskId);
            if (task) {
                floatingTimer.style.display = 'flex';
                floatingTimer.querySelector('.timer-task-name').textContent = task.title;
                floatingTimer.querySelector('.timer-display').textContent =
                    this.state.formatTime(this.state.getElapsedTime());

                // Stop button
                const stopBtn = floatingTimer.querySelector('.timer-stop-button');
                stopBtn.onclick = () => this.toggleTimer(task.id);
            }
        } else {
            floatingTimer.style.display = 'none';
        }
    }

    showTaskDetail(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (!task) return;

        const modal = document.getElementById('task-modal');
        modal.style.display = 'flex';

        document.getElementById('modal-task-title').value = task.title;
        document.getElementById('modal-task-notes').value = task.notes;
        document.getElementById('modal-task-focus').checked = task.isFocusTask;

        const saveBtn = document.getElementById('modal-save');
        const cancelBtn = document.getElementById('modal-cancel');
        const closeBtn = modal.querySelector('.modal-close');

        const save = () => {
            this.state.updateTask(taskId, {
                title: document.getElementById('modal-task-title').value,
                notes: document.getElementById('modal-task-notes').value,
                isFocusTask: document.getElementById('modal-task-focus').checked
            });
            modal.style.display = 'none';
            this.renderTodayView();
        };

        const close = () => {
            modal.style.display = 'none';
        };

        saveBtn.onclick = save;
        cancelBtn.onclick = close;
        closeBtn.onclick = close;
    }

    shouldShowReflection() {
        // Show reflection when all focus tasks are complete
        const focusTasks = this.state.getFocusTasks();
        return focusTasks.length === 0 && this.state.getTodayTasks().length === 0;
    }

    showReflection() {
        const overlay = document.getElementById('reflection-overlay');
        overlay.style.display = 'flex';

        const stats = this.state.getTodayStats();
        const hours = Math.floor(stats.totalMinutes / 60);
        const minutes = stats.totalMinutes % 60;

        document.getElementById('reflection-time').textContent =
            `${hours}h ${minutes}m`;
        document.getElementById('reflection-tasks').textContent =
            stats.tasksCompleted;

        const insights = [
            "Great work today.",
            "You've built good momentum.",
            "Keep this energy going.",
            "You're making progress.",
            "Well done staying focused."
        ];
        document.getElementById('reflection-insight').textContent =
            insights[Math.floor(Math.random() * insights.length)];

        this.playSound('reflection');

        // Auto-hide after 6 seconds
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 6000);
    }

    showCommandPalette() {
        const palette = document.getElementById('command-palette');
        palette.style.display = 'flex';

        const input = document.getElementById('command-input');
        input.value = '';
        input.focus();

        input.onkeydown = (e) => {
            if (e.key === 'Escape') {
                palette.style.display = 'none';
            } else if (e.key === 'Enter') {
                // Execute command
                this.executeCommand(input.value);
                palette.style.display = 'none';
            }
        };
    }

    executeCommand(command) {
        // Simple command execution
        if (command.toLowerCase().includes('add task')) {
            const title = command.replace(/add task/i, '').trim();
            if (title) {
                this.handleQuickAdd(title);
            }
        }
    }

    renderAllTasksView() {
        const allTasks = this.state.tasks;
        this.renderTaskList(allTasks, 'all-tasks-list');
    }

    renderProjectsView() {
        // Placeholder
        const grid = document.getElementById('projects-grid');
        grid.innerHTML = '<div class="empty-state"><p>Projects coming soon</p></div>';
    }

    renderAnalyticsView() {
        const container = document.getElementById('analytics-content');
        const stats = this.state.getTodayStats();

        container.innerHTML = `
            <div class="card" style="padding: var(--space-lg);">
                <h3>Today's Summary</h3>
                <p>Focus Time: ${stats.totalMinutes} minutes</p>
                <p>Tasks Completed: ${stats.tasksCompleted}</p>
                <p>Sessions: ${stats.focusSessions}</p>
            </div>
        `;
    }

    playSound(type) {
        if (!this.state.settings.soundEnabled) return;

        const audio = document.getElementById(`sound-${type}`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Ignore audio play errors
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ===== Initialize App =====
let appState, uiManager;

document.addEventListener('DOMContentLoaded', async () => {
    appState = new AppState();
    await appState.load();
    uiManager = new UIManager(appState);
});
