import mongoose from 'mongoose';
import IncidentReport from './models/IncidentReport.js';
import ResourceRequest from './models/ResourceRequest.js';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://seccouncil:seccouncil@cluster0.qvnhx.mongodb.net/rescue?retryWrites=true&w=majority';

async function addVolunteerRelatedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find existing volunteer user
    const volunteer = await User.findOne({ username: 'vol99@gmail.com' });
    if (!volunteer) {
      console.log('Volunteer user not found. Please add volunteer user first.');
      return;
    }

    // Add assigned incident reports for this volunteer
    const incidentsData = [
      {
        type: 'Medical Emergency',
        location: 'Community Center',
        severity: 'High - Serious incident',
        status: 'in-progress',
        contactName: 'John Doe',
        contactPhone: '1234567890',
        description: 'Medical emergency at community center',
        assignedTo: volunteer._id,
        submittedBy: volunteer._id,
        createdAt: new Date(),
      },
      {
        type: 'Fire',
        location: 'Downtown District',
        severity: 'Critical - Life threatening',
        status: 'pending',
        contactName: 'Jane Smith',
        contactPhone: '0987654321',
        description: 'Fire reported in downtown district',
        assignedTo: volunteer._id,
        submittedBy: volunteer._id,
        createdAt: new Date(),
      },
      {
        type: 'Flood',
        location: 'Riverside Area',
        severity: 'Medium - Moderate incident',
        status: 'resolved',
        contactName: 'Alice Johnson',
        contactPhone: '5551234567',
        description: 'Flooding in riverside area',
        assignedTo: volunteer._id,
        submittedBy: volunteer._id,
        createdAt: new Date(),
      }
    ];

    for (const incidentData of incidentsData) {
      const existingIncident = await IncidentReport.findOne({
        type: incidentData.type,
        location: incidentData.location,
        assignedTo: volunteer._id
      });
      if (!existingIncident) {
        const incident = new IncidentReport(incidentData);
        await incident.save();
        console.log(`Added incident: ${incident.type} at ${incident.location}`);
      } else {
        console.log(`Incident already exists: ${existingIncident.type} at ${existingIncident.location}`);
      }
    }

    // Add shelter resource requests for this volunteer
    const resourceRequestsData = [
      {
        resourceType: 'Shelter Materials',
        category: 'Shelter & Housing',
        quantity: '50',
        urgency: 'High - Within 4 hours',
        deliveryLocation: 'Community Center',
        contactName: 'John Doe',
        contactPhone: '1234567890',
        peopleAffected: 30,
        justification: 'Blankets and tents needed for flood victims',
        status: 'pending',
        submittedBy: volunteer._id,
        createdAt: new Date(),
      },
      {
        resourceType: 'Shelter Materials',
        category: 'Shelter & Housing',
        quantity: '100',
        urgency: 'Medium - Within 24 hours',
        deliveryLocation: 'Downtown District',
        contactName: 'Jane Smith',
        contactPhone: '0987654321',
        peopleAffected: 50,
        justification: 'Food and water supplies for fire victims',
        status: 'pending',
        submittedBy: volunteer._id,
        createdAt: new Date(),
      }
    ];

    for (const resourceData of resourceRequestsData) {
      const existingResource = await ResourceRequest.findOne({
        justification: resourceData.justification,
        deliveryLocation: resourceData.deliveryLocation,
        submittedBy: volunteer._id
      });
      if (!existingResource) {
        const resourceRequest = new ResourceRequest(resourceData);
        await resourceRequest.save();
        console.log(`Added resource request: ${resourceRequest.justification} at ${resourceRequest.deliveryLocation}`);
      } else {
        console.log(`Resource request already exists: ${existingResource.justification} at ${existingResource.deliveryLocation}`);
      }
    }

  } catch (error) {
    console.error('Error adding volunteer related data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addVolunteerRelatedData();
