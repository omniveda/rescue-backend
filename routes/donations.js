import express from 'express';
import Donation from '../models/Donation.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all donations (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('submittedBy', 'username email')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get donations by user
router.get('/my-donations', authenticateToken, async (req, res) => {
  try {
    const donations = await Donation.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create new donation
router.post('/', async (req, res) => {
  const {
    amount,
    frequency,
    donorName,
    donorEmail,
    donorPhone,
    anonymous,
    designation,
    message,
    paymentMethod
  } = req.body;

  try {
    const newDonation = new Donation({
      amount,
      frequency,
      donorName,
      donorEmail,
      donorPhone,
      anonymous,
      designation,
      message,
      paymentMethod,
      submittedBy: req.user ? req.user.id : null // Optional for anonymous donations
    });

    await newDonation.save();
    res.status(201).json({ message: 'Donation submitted successfully', donation: newDonation });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update donation status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { status, transactionId } = req.body;

  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status, transactionId, updatedAt: Date.now() },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({ message: 'Donation updated successfully', donation });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
