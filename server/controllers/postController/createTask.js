const FolderModel = require('../../models/taskSchema'); // Assuming your folder schema is in this file
const errorMessages = require('../../errors/errorMessages');

const addTaskToFolder = async (req, res) => {
    const folderId = req.params.folderId; // Get the folder ID from the URL parameters.
    let taskData = req.body; // Get the new task data from the request body

    // Trim the task name and check if it's empty
    taskData.name = taskData.name.trim();
    if (!taskData.name) {
        return res.status(400).json({ 'Message': 'Task must have a name' });
    }

    try {
        // Find the folder by ID and ensure the requesting user is the owner
        const folder = await FolderModel.findOne({ _id: folderId, owner: req.user.id });

        if (!folder) {
            return res.status(404).json({ 'Message': errorMessages.folderNotFound });
        }

        // Check if a task with the same name already exists in the folder
        const isDuplicateTask = folder.tasks.some(task => task.name === taskData.name);
        if (isDuplicateTask) {
            // If a duplicate task name is found, return an error response
            return res.status(400).json({ 'Message': 'A task with the same name already exists in this folder.' });
        }

        // Create a new task based on the task schema
        const newTask = {
            name: taskData.name, // Already trimmed above
            subTask: taskData.subTask,
            priority: taskData.priority,
            status: taskData.status,
            dueDate: taskData.dueDate
            // Add other fields as necessary
        };

        // Add the new task to the tasks array of the folder
        folder.tasks.push(newTask);

        // Save the updated folder
        const updatedFolder = await folder.save();

        res.status(200).json(updatedFolder);
    } catch (err) {
        console.error("Error while adding task to folder:", err);
        res.status(500).json({ 'Message': `Error while adding task to folder: ${err.message}` });
    }
};

module.exports = { addTaskToFolder };
