import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  frequency: {
    type: String,
    enum: ['one-time', 'monthly', 'quarterly', 'annually'],
    default: 'one-time'
  },
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  donorPhone: String,
  anonymous: { type: Boolean, default: false },
  designation: {
    type: String,
    enum: ['emergency-relief', 'medical-supplies', 'shelter-housing', 'food-water']
  },
  message: String,
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'bank-transfer', 'paypal'],
    default: 'credit-card'
  },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  transactionId: String,
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for anonymous donations
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

donationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
