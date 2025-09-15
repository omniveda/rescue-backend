import mongoose from 'mongoose';

const mentalHealthSupportSchema = new mongoose.Schema({
  requestType: {
    type: String,
    enum: ['individual-counseling', 'group-support', 'family-counseling', 'child-psychology', 'crisis-intervention'],
    default: 'individual-counseling'
  },
  urgency: {
    type: String,
    enum: ['immediate', 'within-24h', 'within-48h', 'scheduled'],
    default: 'within-24h'
  },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: String,
  preferredMethod: {
    type: String,
    enum: ['in-person', 'video-call', 'phone', 'any'],
    default: 'any'
  },
  additionalInfo: String,
  status: { type: String, enum: ['pending', 'contacted', 'scheduled', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

mentalHealthSupportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const MentalHealthSupport = mongoose.model('MentalHealthSupport', mentalHealthSupportSchema);

export default MentalHealthSupport;
