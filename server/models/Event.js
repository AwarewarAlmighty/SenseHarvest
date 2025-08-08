import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical', 'normal'],
    default: 'info',
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sensorId: {
    type: String,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
  },
  // Added for soft delete functionality
  deleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Event', EventSchema);