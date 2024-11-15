import Schedule from '../models/schedule.model.js';
import Coach from '../models/coach.model.js';
import User from '../models/user.model.js';

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('userId', 'name email')
      .populate('coachId')
      .sort({ date: 1 });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Error fetching schedules', error: error.message });
  }
};

export const getUserSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.user.id })
      .populate('coachId')
      .sort({ date: 1 });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching user schedules:', error);
    res.status(500).json({ message: 'Error fetching user schedules', error: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const { coachId, date, time, type } = req.body;
    
    if (!coachId || !date || !time || !type) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if coach exists
    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Check if user exists and has active membership
    const user = await User.findById(req.user.id);
    if (!user || user.membershipStatus !== 'active') {
      return res.status(403).json({ message: 'Active membership required to book sessions' });
    }

    const scheduleDate = new Date(date);
    const dayOfWeek = scheduleDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Check coach availability
    const availability = coach.availability.find(a => a.day === dayOfWeek);
    if (!availability || !availability.slots.includes(time)) {
      return res.status(400).json({ message: 'Coach is not available at this time' });
    }

    // Check for existing bookings
    const existingBooking = await Schedule.findOne({
      coachId,
      date: scheduleDate,
      time,
      status: 'scheduled'
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const schedule = new Schedule({
      userId: req.user.id,
      coachId,
      date: scheduleDate,
      time,
      type,
      status: 'scheduled'
    });
    
    await schedule.save();
    
    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate('userId', 'name email')
      .populate('coachId');

    res.status(201).json(populatedSchedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
};

export const updateScheduleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid schedule status' });
    }

    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Only allow cancellation if the schedule is not in the past
    if (status === 'cancelled' && new Date(schedule.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot cancel past sessions' });
    }

    schedule.status = status;
    await schedule.save();

    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate('userId', 'name email')
      .populate('coachId');

    res.json(populatedSchedule);
  } catch (error) {
    console.error('Error updating schedule status:', error);
    res.status(500).json({ message: 'Error updating schedule status', error: error.message });
  }
};