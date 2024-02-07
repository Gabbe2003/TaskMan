const FolderModel = require('../../models/taskSchema');

module.exports.getFolders = async (req, res) => {

  // Authenticate the user and get user's ID from the request
  if (!req.user || !req.user.id) {
    console.log(req.user);
    console.log(req.user.id);
    return res.status(401).json({ 'Message': errorMessages.unauthorizedUser });
  }

  try {
    const folders = await FolderModel.find({ owner: req.user.id}).lean();
    res.json(folders);
  } catch (err) {
    res.status(500).json({ 'Message': `Error while retrieving folders: ${err.message}` });
  }
};
    