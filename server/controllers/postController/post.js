const errorMessages = require('../../errors/errorMessages');
const FolderModel = require('../../models/taskSchema');

module.exports.createFolder = async (req, res) => {
  console.log("Received request to create folder with body:", req.body); // Log the incoming request body

  const { name, favorite, tasks } = req.body;

  // Authenticate the user and get user's ID from the request
  if (!req.user || !req.user.id) {
    console.log("No user or user ID found in request:", req.user); // Log the failed user authentication
    return res.status(401).json({ 'Message': errorMessages.unauthorizedUser });
  }

  // Check if name exists
  if (!name) {
    console.log("Received empty name for folder"); // Log missing name
    return res.status(400).json({ 'Message': errorMessages.emptyFolderName });
  }

  try {
    // Optionally check if a folder with the same name already exists for this user
    console.log(`Checking for existing folder named '${name}' for user ID ${req.user.id}`); // Log before checking
    const existingFolder = await FolderModel.findOne({ name: name, owner: req.user.id });
    if (existingFolder) {
      console.log(`Folder named '${name}' already exists for this user.`); // Log if folder exists
      return res.status(409).json({ 'Message': errorMessages.usedFolderName });
    }

    // Log before creating a new folder
    console.log(`Creating new folder named '${name}' for user ID ${req.user.id}`);

    // Create a new folder and assign the authenticated user's ID as the owner
    const folder = new FolderModel({
      name,
      favorite,
      tasks,
      owner: req.user.id 
    });
    
    const newFolder = await folder.save();
    console.log("Folder created successfully:", newFolder); // Log the successfully created folder
    res.status(201).json(newFolder);
  } catch (err) {
    console.error("Error while creating folder:", err); // Log any errors caught during folder creation
    res.status(500).json({ 'Message': `Error while creating folder: ${err.message}` });
  }
};
