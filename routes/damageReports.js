import express from 'express';
import DamageReport from '../models/DamageReport.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all damage reports (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reports = await DamageReport.find()
      .populate('submittedBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get damage reports by user
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const reports = await DamageReport.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create new damage report
router.post('/', authenticateToken, async (req, res) => {
  const {
    damageType,
    propertyType,
    location,
    ownerName,
    ownerPhone,
    ownerEmail,
    estimatedValue,
    damageDescription,
    causeOfDamage,
    insuranceInfo,
    emergencyRepairs,
    additionalInfo
  } = req.body;

  try {
    const newReport = new DamageReport({
      damageType,
      propertyType,
      location,
      ownerName,
      ownerPhone,
      ownerEmail,
      estimatedValue,
      damageDescription,
      causeOfDamage,
      insuranceInfo,
      emergencyRepairs,
      additionalInfo,
      submittedBy: req.user.id
    });

    await newReport.save();
    res.status(201).json({ message: 'Damage report submitted successfully', report: newReport });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update damage report status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { status, assignedTo } = req.body;

  try {
    const report = await DamageReport.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, updatedAt: Date.now() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Damage report not found' });
    }

    res.json({ message: 'Damage report updated successfully', report });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
