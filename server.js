/*
  Task Manager - Server
  Author: Jisan Halder
  Express + MongoDB REST API backend
*/

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));  // serve frontend files

// ===== MONGODB CONNECTION =====
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => {
    console.log('⚠️  MongoDB not connected, using in-memory store');
    console.log('   (Set MONGO_URI in .env to use real database)');
  });

// ===== TASK SCHEMA =====
const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  completed:   { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// ===== IN-MEMORY FALLBACK (if no MongoDB) =====
// So the app still works without a database setup
let memoryTasks = [];
let nextId = 1;

function useMemory() {
  return mongoose.connection.readyState !== 1;
}

// ===== API ROUTES =====

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    if (useMemory()) {
      return res.json({ success: true, tasks: memoryTasks.reverse(), source: 'memory' });
    }
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, tasks, source: 'mongodb' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    if (useMemory()) {
      const task = { _id: String(nextId++), title, description: description || '', priority: priority || 'medium', completed: false, createdAt: new Date() };
      memoryTasks.push(task);
      return res.status(201).json({ success: true, task });
    }
    const task = await Task.create({ title, description, priority });
    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH toggle complete
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    if (useMemory()) {
      const task = memoryTasks.find(t => t._id === req.params.id);
      if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
      task.completed = !task.completed;
      return res.json({ success: true, task });
    }
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    if (useMemory()) {
      const idx = memoryTasks.findIndex(t => t._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, error: 'Task not found' });
      memoryTasks.splice(idx, 1);
      return res.json({ success: true });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 Task Manager API ready!\n`);
});
