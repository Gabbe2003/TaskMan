const FolderModel = require('../../models/taskSchema');
const mongoose = require('mongoose');

module.exports.updateTaskInFolder = async (req, res) => {
    const { folderId, taskId } = req.params;
    const updatedTaskData = req.body;
    const userId = req.user.id.toString();

    if (!mongoose.Types.ObjectId.isValid(folderId) || !mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ 'Message': 'Invalid folder ID or task ID format' });
    }

    try {
        const folder = await FolderModel.findOne({ _id: folderId, owner: userId }).lean();
        if (!folder) {
            return res.status(404).json({ 'Message': 'Folder not found or you do not have permission to access it.' });
        }

        const task = folder.tasks.find(t => t._id.toString() === taskId);
        if (!task) {
            return res.status(404).json({ 'Message': 'Task not found' });
        }

        // Check if the task name is being updated and if it already exists in the folder
        if (updatedTaskData.name) {
            const isNameTaken = folder.tasks.some(t => t.name === updatedTaskData.name && t._id.toString() !== taskId);
            if (isNameTaken) {
                return res.status(409).json({ 'Message': 'A task with this name already exists in the folder.' });
            }
        }

        // Update the task object with the new data
        Object.assign(task, updatedTaskData);

        // Since MongoDB doesn't directly support updating nested documents easily,
        // you have to mark the parent document as modified for the changes to be saved
        const updatedFolder = await FolderModel.findOneAndUpdate(
            { "_id": folderId, "tasks._id": taskId },
            { 
                "$set": {
                    "tasks.$": task
                }
            },
            { new: true }
        );

        if (updatedFolder) {
            res.json({ 'Message': 'Task updated successfully', folder: updatedFolder });
        } else {
            res.status(400).json({ 'Message': 'Failed to update task.' });
        }
    } catch (err) {
        res.status(500).json({ 'Message': 'An error occurred while updating the task. Please try again later.' });
    }
};
