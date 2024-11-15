import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: true
  },
  availability: [{
    day: {
      type: String,
      required: true
    },
    slots: [{
      type: String,
      required: true
    }]
  }]
}, {
  timestamps: true
});

export default mongoose.model('Coach', coachSchema);