// STATE

let state = {
    tasks: [],
    habits: [],
    timer: {
        secondsLeft: 1500,
        running: false,
        activeTaskId: null
    },
    sessions: []
};

// setInterval returns an ID; we store it here so we can stop it later
let intervalId = null;

const STORAGE_KEY = "studySprintState";

// UTILITIES

//Unique ID generator
function generateId() {
    return String(Date.now());
}

// Returns "YYYY-MM-DD"
function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
}

// Convert seconds
function formatTime(seconds) {
    const mins = Math.floor(seconds /60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Last 7 day keys including today
function getLastDaysKeys() {
    const keys = [];
    const base = new Date();

    for(let i = 0; i < 7; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() - i);
        keys.push(d.toISOString().slice(0, 10));
    }

    return keys;
}

// PERSISTENCE (localStorage)

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        state = JSON.parse(saved);
    }
}

// DOM HELPERS

function $(selector) {
    return document.querySelector(selector);
};

// TASK MUTATORS

function addTask(title, estPomodoros) {
    const newTask = {
        id: generateId(),
        title: title.trim(),
        estPomodoros: Number(estPomodoros),
        completedPomodoros: 0,
        done: false,
        createdAt: new Date().toISOString(),
        doneAt: null
    };

    // Array.push adds a new item to the end of the array
    state.tasks.push(newTask);

    saveState();
    renderTasks();
    renderTimer();
    renderSummary();
};

function deleteTask(taskId) {
    // Array.filter returns a New array with items that pass the condition
    state.tasks = state.tasks.filter(t => i.id !== taskId);

    // clear activeTaskId if deleted
    if (state.timer.activeTaskId === taskId) {
        state.timer.activeTaskId = null;
    }

    saveState();
    renderTasks();
    renderTimer();
    renderSummary();

}

function toggleTaskDone(taskId) {

    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.done = !task.done;
    task.doneAt = task.done ? new Date().toISOString(): null;

    saveState();
    renderTasks();
    renderSummary();
}
 
function setActiveTask(taskId) {
    state.timer.activeTaskId = taskId;
    saveState();
    renderTasks();
    renderTimer();
}