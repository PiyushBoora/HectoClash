const User = require('../models/User'); // Replace with your User model path

/**
 * Controller to fetch user by userId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from route params

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Fetch user by userId from the database
    const user = await User.findById(userId).select('-password'); // Exclude sensitive fields like password

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { getUserById };
