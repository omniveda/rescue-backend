import express from 'express';
import Task from '../models/Task.js';
import { authenticateToken, authorizeRoles } from './auth.js';

const router = express.Router();

// Create a new task and assign to volunteer
router.post('/tasks', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { title, description, assignedTo, priority } = req.body;
    const task = new Task({
      title,
      description,
      assignedTo,
      priority,
      status: 'assigned'
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update task status (e.g., mark as completed)
router.put('/tasks/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.status = status;
    task.updatedAt = new Date();
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all tasks (admin)
router.get('/tasks', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'username email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
