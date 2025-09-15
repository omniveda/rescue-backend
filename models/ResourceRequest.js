import mongoose from 'mongoose';

const resourceRequestSchema = new mongoose.Schema({
  resourceType: {
    type: String,
    required: true,
    enum: ['Food & Water', 'Medical Supplies', 'Shelter Materials', 'Clothing & Bedding', 'Tools & Equipment', 'Communication Equipment', 'Transportation', 'Fuel & Generators', 'Emergency Lighting', 'First Aid Supplies']
  },
  category: {
    type: String,
    required: true,
    enum: ['Essential Supplies', 'Medical Emergency', 'Shelter & Housing', 'Search & Rescue Equipment', 'Communication Tools', 'Transportation Needs', 'Special Needs Support']
  },
  quantity: { type: String, required: true },
  urgency: {
    type: String,
    required: true,
    enum: ['Critical - Life threatening', 'High - Within 4 hours', 'Medium - Within 24 hours', 'Low - Within 48 hours']
  },
  deliveryLocation: { type: String, required: true },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  organization: String,
  peopleAffected: { type: Number, required: true },
  specificItems: String,
  justification: { type: String, required: true },
  alternativeContact: String,
  status: { type: String, enum: ['pending', 'approved', 'in-transit', 'delivered', 'rejected'], default: 'pending' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

resourceRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ResourceRequest = mongoose.model('ResourceRequest', resourceRequestSchema);

export default ResourceRequest;
