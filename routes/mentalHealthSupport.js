import express from 'express';
import MentalHealthSupport from '../models/MentalHealthSupport.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all mental health support requests (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const requests = await MentalHealthSupport.find()
      .populate('submittedBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get mental health support requests by user
router.get('/my-requests', authenticateToken, async (req, res) => {
  try {
    const requests = await MentalHealthSupport.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create new mental health support request
router.post('/', authenticateToken, async (req, res) => {
  const {
    requestType,
    urgency,
    contactName,
    contactPhone,
    contactEmail,
    preferredMethod,
    additionalInfo
  } = req.body;

  try {
    const newRequest = new MentalHealthSupport({
      requestType,
      urgency,
      contactName,
      contactPhone,
      contactEmail,
      preferredMethod,
      additionalInfo,
      submittedBy: req.user.id
    });

    await newRequest.save();
    res.status(201).json({ message: 'Mental health support request submitted successfully', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update mental health support request status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { status, assignedTo } = req.body;

  try {
    const request = await MentalHealthSupport.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, updatedAt: Date.now() },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Mental health support request not found' });
    }

    res.json({ message: 'Mental health support request updated successfully', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
