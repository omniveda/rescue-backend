
import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Shelter from '../models/Shelter.js';
import Message from '../models/Message.js';
import { authenticateToken, authorizeRoles } from './auth.js';

const router = express.Router();

// Get volunteer profile
router.get('/profile', authenticateToken, authorizeRoles('volunteer'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get volunteer tasks
router.get('/tasks', authenticateToken, authorizeRoles('volunteer'), async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get volunteer stats
router.get('/stats', authenticateToken, authorizeRoles('volunteer'), async (req, res) => {
  try {
    const activeTasks = await Task.countDocuments({ assignedTo: req.user.id, status: { $ne: 'completed' } });
    const completedToday = await Task.countDocuments({
      assignedTo: req.user.id,
      status: 'completed',
      updatedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const hoursContributed = 0; // Placeholder, calculate if you have time tracking
    const teamMembers = await User.countDocuments({ role: 'volunteer' });

    res.json({ activeTasks, completedToday, hoursContributed, teamMembers });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get volunteer shelter info
router.get('/shelter', authenticateToken, authorizeRoles('volunteer'), async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get volunteer messages
router.get('/messages', authenticateToken, authorizeRoles('volunteer'), async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user.id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
