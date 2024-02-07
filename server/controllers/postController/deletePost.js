const FolderModel = require('../../models/taskSchema');

// Function to delete a folder
module.exports.deleteFolder = async (req, res) => {
    const { folderId } = req.params;
    console.log(`here is the response ${folderId}`)
    try {
        const deletedFolder = await FolderModel.findByIdAndDelete(folderId);
        if (!deletedFolder) {
            return res.status(404).json({ 'Message': 'Folder not found' });
        }
        res.json({ 'Message': `Folder ${deletedFolder.name} deleted successfully` });
    } catch (err) {
        res.status(500).json({ 'Message': `Error while deleting folder: ${err.message}` });
    }
};

// Function to delete a task within a folder
// Function to delete a task within a folder
module.exports.deleteTaskById = async (req, res) => {
    const { folderId, taskId } = req.params;

    try {
        const folder = await FolderModel.findOne({ _id: folderId });

        if (!folder) {
            return res.status(404).json({ 'Message': 'Folder not found' });
        }

        // Moved the task variable definition up before its first use
        const task = folder.tasks.id(taskId);
        console.log("Found Folder:", folder);
        console.log("Found Task:", task); // Now this line is correctly placed after task is defined

        if (!task) {
            return res.status(404).json({ 'Message': 'Task not found' });
        }

        task.remove();
        await folder.save();

        res.json({ 'Message': 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'Message': `Error while deleting task: ${err.message}` });
    }
};
