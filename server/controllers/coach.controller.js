import Coach from '../models/coach.model.js';
import User from '../models/user.model.js';

export const getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find()
      .populate('userId', '-password')
      .sort({ experience: -1 });
    res.json(coaches);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    res.status(500).json({ message: 'Error fetching coaches', error: error.message });
  }
};

export const getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id)
      .populate('userId', '-password');
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    res.json(coach);
  } catch (error) {
    console.error('Error fetching coach:', error);
    res.status(500).json({ message: 'Error fetching coach', error: error.message });
  }
};

export const createCoach = async (req, res) => {
  try {
    const { userId, specialization, experience, availability } = req.body;
    
    if (!userId || !specialization || !experience || !availability) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Verify user exists and is a coach
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'coach') {
      user.role = 'coach';
      await user.save();
    }

    // Check if coach profile already exists
    const existingCoach = await Coach.findOne({ userId });
    if (existingCoach) {
      return res.status(400).json({ message: 'Coach profile already exists for this user' });
    }

    const coach = new Coach(req.body);
    await coach.save();
    
    const populatedCoach = await Coach.findById(coach._id)
      .populate('userId', '-password');
    
    res.status(201).json(populatedCoach);
  } catch (error) {
    console.error('Error creating coach:', error);
    res.status(500).json({ message: 'Error creating coach', error: error.message });
  }
};

export const updateCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('userId', '-password');

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.json(coach);
  } catch (error) {
    console.error('Error updating coach:', error);
    res.status(500).json({ message: 'Error updating coach', error: error.message });
  }
};

export const deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Update user role back to regular user
    await User.findByIdAndUpdate(coach.userId, { role: 'user' });

    await Coach.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coach deleted successfully' });
  } catch (error) {
    console.error('Error deleting coach:', error);
    res.status(500).json({ message: 'Error deleting coach', error: error.message });
  }
};