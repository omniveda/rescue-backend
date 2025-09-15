import mongoose from 'mongoose';

const damageReportSchema = new mongoose.Schema({
  damageType: {
    type: String,
    required: true,
    enum: ['Structural Damage', 'Water Damage', 'Fire Damage', 'Wind Damage', 'Flood Damage', 'Vehicle Damage', 'Personal Property', 'Business Property', 'Agricultural Loss', 'Infrastructure']
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['Residential Home', 'Apartment/Condo', 'Commercial Building', 'Industrial Facility', 'Vehicle', 'Personal Property', 'Agricultural Property', 'Public Infrastructure']
  },
  location: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  ownerEmail: String,
  estimatedValue: Number,
  damageDescription: { type: String, required: true },
  causeOfDamage: {
    type: String,
    required: true,
    enum: ['Natural Disaster', 'Fire', 'Flood', 'Storm/Wind', 'Earthquake', 'Human-caused', 'Equipment Failure', 'Other']
  },
  insuranceInfo: String,
  emergencyRepairs: String,
  additionalInfo: String,
  status: { type: String, enum: ['pending', 'assessed', 'approved', 'rejected', 'closed'], default: 'pending' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

damageReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const DamageReport = mongoose.model('DamageReport', damageReportSchema);

export default DamageReport;
