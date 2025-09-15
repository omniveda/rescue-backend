import mongoose from 'mongoose';

const missingPersonReportSchema = new mongoose.Schema({
  personName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  height: String,
  weight: String,
  lastSeenLocation: { type: String, required: true },
  lastSeenDate: { type: Date, required: true },
  lastSeenTime: String,
  clothing: String,
  physicalDescription: String,
  medicalConditions: String,
  reporterName: { type: String, required: true },
  reporterPhone: { type: String, required: true },
  reporterRelation: { type: String, required: true },
  additionalInfo: String,
  status: { type: String, enum: ['pending', 'in-progress', 'found', 'closed'], default: 'pending' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

missingPersonReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const MissingPersonReport = mongoose.model('MissingPersonReport', missingPersonReportSchema);

export default MissingPersonReport;
