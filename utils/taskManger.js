// Client-side (localStorage) task manager
// Note: This module should only be imported from client components.

const STORAGE_KEY = 'task';
const TASK_HISTORY_KEY = 'task-history';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeParseJSON(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
}

function sortHistoryNewestFirst(items) {
  return (items ?? []).slice().sort((a, b) => {
    const at = new Date(a?.recordedAt ?? 0).getTime();
    const bt = new Date(b?.recordedAt ?? 0).getTime();
    return bt - at;
  });
}


export function getTasks() {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = safeParseJSON(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getTaskHistory() {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(TASK_HISTORY_KEY);
    if (!raw) return [];
    const parsed = safeParseJSON(raw);
    return sortHistoryNewestFirst(Array.isArray(parsed) ? parsed : []);
  } catch {
    return [];
  }
}

export function clearTaskHistory() {
  if (!isBrowser()) return;
  window.localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify([]));
}

export function restoreTaskFromHistory(id) {
  if (!isBrowser()) return;
  if (!id) return;
  const history = getTaskHistory();
  const entry = history.find((h) => h?.id === id);
  if (!entry) return;
  const { title, note, priority, wasCompleted } = entry;
  const restoredTask = {
    id,
    title,
    note,
    priority,
    isCompleted: wasCompleted,
    createdAt: new Date().toISOString(),
  };
  addTask(restoredTask);
  // remove from history
  const updatedHistory = history.filter((h) => h?.id !== id);
  window.localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(updatedHistory));
}

export function deleteTaskFromHistory(id) {
  if (!isBrowser()) return;
  if (!task || typeof task !== 'object') return;
  const history = getTaskHistory();
  const updatedHistory = history.filter((h) => h?.id !== id) ; 
  window.localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(updatedHistory));
}

function pushHistoryEntry(entry) {
  if (!isBrowser()) return;
  if (!entry || typeof entry !== 'object') return;

  const current = safeParseJSON(window.localStorage.getItem(TASK_HISTORY_KEY)) ?? [];
  const history = Array.isArray(current) ? current : [];
  const updated = [...history, entry];
  window.localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(updated));
}


export function addTask(task) {
  if (!isBrowser()) return;
  if (!task || typeof task !== 'object') return;

  try {
    const tasks = getTasks();
    const updated = [...tasks, task];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // swallow
  }
}

export function editTask(id, value) {
  if (!isBrowser()) return;
  if (!id) return;
  if (!value || typeof value !== 'object') return;

  try {
    const tasks = getTasks();
    const updated = tasks.map((t) => (t?.id === id ? { ...t, ...value } : t));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // swallow
  }
}

export function deleteTask(id) {
  if (!isBrowser()) return;
  if (!id) return;

  const tasks = getTasks();
  const taskToDelete = tasks.find((t) => t?.id === id);
  const updated = tasks.filter((t) => t?.id !== id) ;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}



export function deleteAllTask(){
    // Record history for all tasks, then clear
    if (!isBrowser()) return;

    try {
      const tasks = getTasks();
      for (const task of tasks) {
        pushHistoryEntry({
          id: task?.id,
          title: task?.title,
          note: task?.note,
          priority: task?.priority,
          status: 'deleted',
          wasCompleted: !!task?.isCompleted,
          recordedAt: new Date().toISOString(),
        });
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {
      // swallow
    }
}


export function setTaskState(id) {
  if (!isBrowser()) return;
  if (!id) return;

  const tasks = getTasks();
  const currentTask = tasks.find((t) => t?.id === id);
  const nextIsCompleted = !currentTask?.isCompleted;

  const updated = tasks.map((t) =>
    t?.id === id ? { ...t, isCompleted: nextIsCompleted } : t
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); 
}

export function saveTask(id){
  const tasks = getTasks();
  const task = tasks.find((task) => task.id === id);

  if (!task) return;

  const val = {
    id: task.id,
    title: task.title,
    note: task.note,
    priority: task.priority,
    status: 'completed',
    wasCompleted: !!task.isCompleted,
    recordedAt: new Date().toISOString(),
  };

  pushHistoryEntry(val);
  // remove task from main list
  const updated = tasks.filter((task) => task.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}





