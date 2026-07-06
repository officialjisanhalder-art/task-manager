/*
  TaskFlow - Main Client Logic
  Author: Jisan Halder
  Manages client-side state, API calls, and local UI updates
*/

const API_BASE = '/api';

// State
let tasks = [];
let activeFilter = 'all';

// DOM Elements
const taskList         = document.getElementById('taskList');
const emptyState       = document.getElementById('emptyState');
const countAll         = document.getElementById('countAll');
const countActive      = document.getElementById('countActive');
const countCompleted   = document.getElementById('countCompleted');
const progressText     = document.getElementById('progressText');
const progressPercent  = document.getElementById('progressPercent');
const progressFill     = document.getElementById('progressFill');
const dateDisplay      = document.getElementById('dateDisplay');
const openModalBtn     = document.getElementById('openModalBtn');
const closeModalBtn    = document.getElementById('closeModalBtn');
const modalOverlay     = document.getElementById('modalOverlay');
const taskForm         = document.getElementById('taskForm');
const toast            = document.getElementById('toast');
const priorityBtns     = document.querySelectorAll('.pri-btn');

let selectedPriority = 'medium';

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  displayCurrentDate();
  fetchTasks();
  setupEventListeners();
});

// Display Current Date
function displayCurrentDate() {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
}

// Show Toast message
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Fetch Tasks from server API or fallback to localStorage
async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    const data = await res.json();
    if (data.success) {
      tasks = data.tasks;
      renderTasks();
      updateProgress();
    } else {
      loadLocalStorageTasks();
    }
  } catch (err) {
    console.log('Backend offline. Falling back to localStorage.');
    loadLocalStorageTasks();
  }
}

function loadLocalStorageTasks() {
  const localData = localStorage.getItem('taskflow_tasks');
  tasks = localData ? JSON.parse(localData) : [];
  renderTasks();
  updateProgress();
}

function saveLocalStorageTasks() {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}


// Setup all click / form submit handlers
function setupEventListeners() {
  // Modal open/close
  openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('show');
    document.getElementById('taskTitle').focus();
  });

  closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
    taskForm.reset();
    resetPriorityBtns();
  });

  // Close modal when clicking outside
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('show');
      taskForm.reset();
      resetPriorityBtns();
    }
  });

  // Priority buttons selector inside modal
  priorityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      priorityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPriority = btn.dataset.priority;
    });
  });

  // Submit task creation form
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;

    const newTask = {
      _id: 'local_' + Date.now(),
      title,
      description,
      priority: selectedPriority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority: selectedPriority })
      });
      const data = await res.json();

      if (data.success) {
        tasks.unshift(data.task);
        renderTasks();
        updateProgress();
        showToast('Task added successfully!');
        closeModal();
      } else {
        saveLocally(newTask);
      }
    } catch (err) {
      saveLocally(newTask);
    }
  });

  function saveLocally(task) {
    tasks.unshift(task);
    saveLocalStorageTasks();
    renderTasks();
    updateProgress();
    showToast('Task saved locally! (Offline Mode)');
    closeModal();
  }

  function closeModal() {
    modalOverlay.classList.remove('show');
    taskForm.reset();
    resetPriorityBtns();
  }

  // Sidebar filters selection
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderTasks();
    });
  });
}

function resetPriorityBtns() {
  priorityBtns.forEach(b => b.classList.remove('active'));
  priorityBtns[1].classList.add('active'); // set to medium by default
  selectedPriority = 'medium';
}

// Toggle Task Done/Active
async function toggleTask(id) {
  const task = tasks.find(t => t._id === id);
  if (!task) return;

  // Toggle locally first
  task.completed = !task.completed;
  renderTasks();
  updateProgress();

  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'PATCH' });
    const data = await res.json();
    if (data.success) {
      task.completed = data.task.completed;
      renderTasks();
      updateProgress();
      showToast(task.completed ? 'Task marked complete! 🎉' : 'Task marked active.');
    } else {
      // Sync localstorage if server failed
      saveLocalStorageTasks();
      showToast(task.completed ? 'Task marked complete! (Offline)' : 'Task marked active.');
    }
  } catch (err) {
    saveLocalStorageTasks();
    showToast(task.completed ? 'Task marked complete! (Offline)' : 'Task marked active.');
  }
}

// Delete Task from database
async function deleteTask(id) {
  // Remove locally first
  tasks = tasks.filter(t => t._id !== id);
  renderTasks();
  updateProgress();

  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) {
      saveLocalStorageTasks();
    }
    showToast('Task deleted.');
  } catch (err) {
    saveLocalStorageTasks();
    showToast('Task deleted.');
  }
}

// Update counts & progress bar indicators
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  countAll.textContent = total;
  countActive.textContent = active;
  countCompleted.textContent = completed;

  progressText.textContent = `${completed} of ${total} completed`;
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  progressPercent.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;
}

// Main Render Loop
function renderTasks() {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'active') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    return true; // all
  });

  if (filteredTasks.length === 0) {
    emptyState.classList.add('show');
  } else {
    emptyState.classList.remove('show');
  }

  filteredTasks.forEach(task => {
    const item = document.createElement('div');
    item.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
    
    item.innerHTML = `
      <label class="checkbox-container">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task._id}')"/>
        <span class="checkmark"></span>
      </label>
      <div class="task-info">
        <div class="task-title-text">${escapeHTML(task.title)}</div>
        ${task.description ? `<div class="task-desc-text">${escapeHTML(task.description)}</div>` : ''}
      </div>
      <button class="delete-btn" onclick="deleteTask('${task._id}')">🗑️</button>
    `;
    taskList.appendChild(item);
  });
}

// Prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
