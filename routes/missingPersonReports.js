import express from 'express';
import MissingPersonReport from '../models/MissingPersonReport.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all missing person reports (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reports = await MissingPersonReport.find()
      .populate('submittedBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get missing person reports by user
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const reports = await MissingPersonReport.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create new missing person report
router.post('/', authenticateToken, async (req, res) => {
  const {
    personName,
    age,
    gender,
    height,
    weight,
    lastSeenLocation,
    lastSeenDate,
    lastSeenTime,
    clothing,
    physicalDescription,
    medicalConditions,
    reporterName,
    reporterPhone,
    reporterRelation,
    additionalInfo
  } = req.body;

  try {
    const newReport = new MissingPersonReport({
      personName,
      age,
      gender,
      height,
      weight,
      lastSeenLocation,
      lastSeenDate,
      lastSeenTime,
      clothing,
      physicalDescription,
      medicalConditions,
      reporterName,
      reporterPhone,
      reporterRelation,
      additionalInfo,
      submittedBy: req.user.id
    });

    await newReport.save();
    res.status(201).json({ message: 'Missing person report submitted successfully', report: newReport });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update missing person report status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { status, assignedTo } = req.body;

  try {
    const report = await MissingPersonReport.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, updatedAt: Date.now() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Missing person report not found' });
    }

    res.json({ message: 'Missing person report updated successfully', report });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
