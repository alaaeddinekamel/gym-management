import User from '../models/user.model.js';
import Coach from '../models/coach.model.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ joinDate: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { role } = req.body;

    // If updating to/from coach role, handle coach profile
    if (role) {
      const user = await User.findById(req.params.id);
      if (user.role === 'coach' && role !== 'coach') {
        // Remove coach profile when changing from coach role
        await Coach.findOneAndDelete({ userId: req.params.id });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove associated coach profile if exists
    if (user.role === 'coach') {
      await Coach.findOneAndDelete({ userId: req.params.id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};