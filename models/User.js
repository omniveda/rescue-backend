import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String },
  phone: { type: String },
  role: { type: String, enum: ['citizen', 'volunteer', 'emergency_responder', 'admin', 'medical_staff', 'logistics_coordinator'], default: 'citizen' },
  organization: { type: String },
  mfaEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;
