const User = require('../../models/usersSchema');

// Helper function to validate email with regex
const validateEmail = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return regex.test(email);
};

const updateUserData = async (req, res) => {
  const { userId } = req.params;
  let { newUsername, newEmail } = req.body;

  // Initialize an object to accumulate updates
  let updateData = {};

  // Validate and trim the newUsername if provided
  if (typeof newUsername === 'string') {
    newUsername = newUsername.trim();
    if (newUsername.length === 0) {
      return res.status(400).json({ success: false, message: 'Username cannot be empty.' });
    }
    updateData.username = newUsername; // Add trimmed username to update data
  }

  // Email validation
  if (newEmail && !validateEmail(newEmail)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  } else if (newEmail) {
    updateData.email = newEmail; // Add email to update data if valid
  }

  // If no valid fields provided to update, return an error
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ success: false, message: 'No valid update information provided.' });
  }

  try {
    console.log(`Updating user data for user ID: ${userId}, Updates:`, updateData);
    
    // Check for existing user with the new username or email
    let conditions = { _id: { $ne: userId }, $or: [] };
    if (updateData.username) conditions.$or.push({ username: updateData.username });
    if (updateData.email) conditions.$or.push({ email: updateData.email });

    if (conditions.$or.length > 0) {
      const existingUser = await User.findOne(conditions);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username or email already in use by another user.' });
      }
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'User updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { updateUserData };
