const User = require('../../models/usersSchema');

const deleteUser = {
  deleteUser: async (req, res) => {
    const { userId } = req.params;

    try {
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        // No user found with the given ID
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      // Successfully deleted
      res.json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

module.exports = deleteUser;
