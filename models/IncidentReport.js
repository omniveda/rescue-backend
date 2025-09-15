import mongoose from 'mongoose';

const incidentReportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Fire', 'Flood', 'Earthquake', 'Building Collapse', 'Medical Emergency', 'Traffic Accident', 'Power Outage', 'Gas Leak', 'Other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low - Minor incident', 'Medium - Moderate incident', 'High - Serious incident', 'Critical - Life threatening']
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

incidentReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);

export default IncidentReport;
