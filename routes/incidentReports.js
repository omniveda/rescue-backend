import express from 'express';
import IncidentReport from '../models/IncidentReport.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all incident reports (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    const reports = await IncidentReport.find()
      .populate('submittedBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get incident reports by user
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const reports = await IncidentReport.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create new incident report
router.post('/', authenticateToken, async (req, res) => {
  const { type, severity, location, description, contactName, contactPhone } = req.body;

  try {
    const newReport = new IncidentReport({
      type,
      severity,
      location,
      description,
      contactName,
      contactPhone,
      submittedBy: req.user.id
    });

    await newReport.save();
    res.status(201).json({ message: 'Incident report submitted successfully', report: newReport });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update incident report status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { status, assignedTo } = req.body;

  try {
    const report = await IncidentReport.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, updatedAt: Date.now() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Incident report not found' });
    }

    res.json({ message: 'Incident report updated successfully', report });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
