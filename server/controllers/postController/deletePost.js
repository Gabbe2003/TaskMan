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

