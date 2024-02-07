const errorMessages = require('../../errors/errorMessages');
const FolderModel = require('../../models/taskSchema');

module.exports.createFolder = async (req, res) => {
  const { name, favorite, tasks } = req.body;

  // Authenticate the user and get user's ID from the request
  if (!req.user || !req.user.id) {
    console.log(req.user);
    console.log(req.user.id);
    return res.status(401).json({ 'Message': errorMessages.unauthorizedUser });
  }

  // Check if name exists
  if (!name) {
    return res.status(400).json({ 'Message': errorMessages.emptyFolderName });

  }

  try {
    // Optionally check if a folder with the same name already exists for this user
    const existingFolder = await FolderModel.findOne({ name: name, owner: req.user.id });
    if (existingFolder) {
      return res.status(409).json({ 'Message': errorMessages.usedFolderName });
    }

    // Create a new folder and assign the authenticated user's ID as the owner
    const folder = new FolderModel({
      name,
      favorite,
      tasks,
      owner: req.user.id 
    });
    
    const newFolder = await folder.save();
    res.status(201).json(newFolder);
  } catch (err) {
    res.status(500).json({ 'Message': `Error while creating folder: ${err.message}` });
  }
};

