const FolderModel = require('../../models/taskSchema');
const mongoose = require('mongoose');

module.exports.updateFolder = async (req, res) => {
    const { folderId } = req.params;
    const updatedData = req.body;
    const userId = req.user.id.toString();

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return res.status(400).json({ 'Message': 'Invalid folder ID format' });
    }

    // Check if the updatedData contains 'name' field to change the folder name
    if (updatedData.name) {
        // Check if another folder with the same name and owner already exists
        const existingFolder = await FolderModel.findOne({
            name: updatedData.name,
            owner: userId,
            _id: { $ne: folderId } 
        });

        if (existingFolder) {
            return res.status(409).json({ 'Message': 'A folder with this name already exists.' });
        }
    }

    try {
        const folder = await FolderModel.findOne({ _id: folderId, owner: userId });
        if (!folder) {
            return res.status(404).json({ 'Message': 'Folder not found or you do not have permission to access this folder.' });
        }

        // Perform the update operation
        const updatedFolder = await FolderModel.findByIdAndUpdate(folderId, updatedData, { new: true });
        if (updatedFolder) {
            res.json(updatedFolder);
        } else {
            res.status(404).json({ 'Message': 'Failed to update folder.' });
        }
    } catch (err) {
        res.status(500).json({ 'Message': 'An error occurred while updating the folder. Please try again later.' });
    }
};
