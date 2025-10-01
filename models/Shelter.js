import mongoose from 'mongoose';

const ShelterSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  status: { type: String, default: 'Available' },
  quantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Shelter = mongoose.model('Shelter', ShelterSchema);

export default Shelter;
