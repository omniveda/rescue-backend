import express from 'express';
import ResourceRequest from '../models/ResourceRequest.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all resource requests (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const requests = await ResourceRequest.find()
      .populate('submittedBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get resource requests by user
router.get('/my-requests', authenticateToken, async (req, res) => {
  try {
    const requests = await ResourceRequest.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create new resource request
router.post('/', authenticateToken, async (req, res) => {
  const {
    resourceType,
    category,
    quantity,
    urgency,
    deliveryLocation,
    contactName,
    contactPhone,
    organization,
    peopleAffected,
    specificItems,
    justification,
    alternativeContact
  } = req.body;

  try {
    const newRequest = new ResourceRequest({
      resourceType,
      category,
      quantity,
      urgency,
      deliveryLocation,
      contactName,
      contactPhone,
      organization,
      peopleAffected,
      specificItems,
      justification,
      alternativeContact,
      submittedBy: req.user.id
    });

    await newRequest.save();
    res.status(201).json({ message: 'Resource request submitted successfully', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update resource request status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { status, assignedTo } = req.body;

  try {
    const request = await ResourceRequest.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, updatedAt: Date.now() },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Resource request not found' });
    }

    res.json({ message: 'Resource request updated successfully', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
