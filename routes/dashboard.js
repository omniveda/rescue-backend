import express from 'express';
import User from '../models/User.js';
import IncidentReport from '../models/IncidentReport.js';
import ResourceRequest from '../models/ResourceRequest.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get dashboard stats (admin only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const stats = {
      activeIncidents: await IncidentReport.countDocuments({ status: { $in: ['active', 'responding'] } }),
      totalUsers: await User.countDocuments(),
      totalResources: await ResourceRequest.countDocuments(),
      activeVolunteers: await User.countDocuments({ role: { $in: ['volunteer', 'emergency_responder'] } })
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all incidents for admin dashboard
router.get('/incidents', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const incidents = await IncidentReport.find()
      .populate('submittedBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 })
      .limit(10); // Limit to recent 10 for dashboard

    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users for admin dashboard
router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const users = await User.find()
      .select('username email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all resource requests for admin dashboard
router.get('/resources', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const resources = await ResourceRequest.find()
      .populate('submittedBy', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
