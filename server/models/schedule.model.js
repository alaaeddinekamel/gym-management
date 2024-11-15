import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

export default mongoose.model('Schedule', scheduleSchema);