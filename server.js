import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://seccouncil:seccouncil@cluster0.qvnhx.mongodb.net/rescue?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

import authRoutes from './routes/auth.js';
import incidentReportRoutes from './routes/incidentReports.js';
import missingPersonReportRoutes from './routes/missingPersonReports.js';
import damageReportRoutes from './routes/damageReports.js';
import resourceRequestRoutes from './routes/resourceRequests.js';
import donationRoutes from './routes/donations.js';
import mentalHealthSupportRoutes from './routes/mentalHealthSupport.js';
import dashboardRoutes from './routes/dashboard.js';
import volunteerRoutes from './routes/volunteer.js';

// Basic route
app.get('/', (req, res) => {
  res.send('RescueConnect Backend API');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incident-reports', incidentReportRoutes);
app.use('/api/missing-person-reports', missingPersonReportRoutes);
app.use('/api/damage-reports', damageReportRoutes);
app.use('/api/resource-requests', resourceRequestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/mental-health-support', mentalHealthSupportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/volunteer', volunteerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
