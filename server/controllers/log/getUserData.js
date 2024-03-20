// Import the user model
const User = require('../../models/usersSchema');

async function getUserInfo(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: User information not available." });
  }

  try {
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user information:", error);
    return res.status(500).json({ message: "An error occurred while fetching user information" });
  }
}

module.exports = { getUserInfo };
