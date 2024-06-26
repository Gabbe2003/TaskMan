const FolderModel = require('../../models/taskSchema');
const mongoose = require('mongoose');

module.exports.updateTaskInFolder = async (req, res) => {
    const { folderId, taskId } = req.params;
    let updatedTaskData = req.body; // Use let since we might modify it
    const userId = req.user.id.toString();

    if (!mongoose.Types.ObjectId.isValid(folderId) || !mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ 'Message': 'Invalid folder ID or task ID format' });
    }

    // Define which task fields can be updated
    const allowedUpdates = ['name', 'subTask', 'priority', 'status', 'dueDate'];
    const isValidOperation = Object.keys(updatedTaskData).every((key) => allowedUpdates.includes(key));

    if (!isValidOperation) {
        return res.status(400).json({ 'Message': 'Invalid updates!' });
    }

    // Trim and check the task name if it's being updated
    if ('name' in updatedTaskData && typeof updatedTaskData.name === 'string') {
        updatedTaskData.name = updatedTaskData.name.trim();
        if (!updatedTaskData.name) {
            return res.status(400).json({ 'Message': 'Task name cannot be empty.' });
        }
    }

    try {
        const folder = await FolderModel.findOne({ _id: folderId, owner: userId }).lean();
        if (!folder) {
            return res.status(404).json({ 'Message': 'Folder not found or you do not have permission to access it.' });
        }

        const taskIndex = folder.tasks.findIndex(t => t._id.toString() === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ 'Message': 'Task not found' });
        }

        // Check if the task name is being updated to a name that already exists in the folder
        if (updatedTaskData.name) {
            const isNameTaken = folder.tasks.some((t, index) => t.name === updatedTaskData.name && index !== taskIndex);
            if (isNameTaken) {
                return res.status(409).json({ 'Message': 'A task with this name already exists in the folder.' });
            }
        }

        // Update the task object with the new data, ensuring only allowed fields are updated
        Object.keys(updatedTaskData).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                folder.tasks[taskIndex][key] = updatedTaskData[key];
            }
        });

        // Update the folder document in the database
        const updatedFolder = await FolderModel.findOneAndUpdate(
            { "_id": folderId },
            { 
                "$set": {
                    "tasks": folder.tasks
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
        res.status(500).json({ 'Message': 'An error occurred while updating the task. Please try again later.', error: err });
    }
};
