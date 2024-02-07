const FolderModel = require('../../models/taskSchema');
const mongoose = require('mongoose');

module.exports.updateFolder = async (req, res) => {
    const { folderId } = req.params;
    const updatedData = req.body;
    const userId = req.user.id.toString(); // Ensure the userId is a string to match the schema

    // Log incoming request data
    console.log(`Updating folder with ID: ${folderId} for user: ${userId}`);
    console.log(`Updated data:`, updatedData);

    // Validate ObjectId format for folderId
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        console.log('Invalid ObjectId format for folderId:', folderId);
        return res.status(400).json({ 'Message': 'Invalid folder ID format' });
    }

    try {
        // Attempt to find the folder
        console.log(`Attempting to find folder with ID: ${folderId} for user: ${userId}`);
        const folder = await FolderModel.findOne({ _id: folderId, owner: userId });
        
        // Log the result of the find operation
        if (!folder) {
            console.log(`No folder found with ID: ${folderId} for user: ${userId}`);
            return res.status(404).json({ 'Message': 'Folder not found or you do not have permission to access this folder.' });
        } else {
            console.log(`Folder found:`, folder);
        }


        // Proceed to update the folder
        console.log(`Updating folder with ID: ${folderId}`);
        const updatedFolder = await FolderModel.findByIdAndUpdate(folderId, updatedData, { new: true });

        // Log the result of the update operation
        if (updatedFolder) {
            console.log(`Folder updated successfully:`, updatedFolder);
            res.json(updatedFolder);
        } else {
            console.log(`Failed to update folder with ID: ${folderId}`);
            res.status(404).json({ 'Message': 'Failed to update folder.' });
        }
    } catch (err) {
        console.error(`Error while updating folder. Folder ID: ${folderId}, Error: ${err.message}`, err);
        res.status(500).json({ 'Message': 'An error occurred while updating the folder. Please try again later.' });
    }
};
