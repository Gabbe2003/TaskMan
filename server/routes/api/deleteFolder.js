const express = require('express');
const router = express.Router();
const { deleteFolder, deleteTaskById } = require('../../controllers/postController/deletePost');

// Route for deleting a folder
router.delete('/folder/:folderId', deleteFolder);

// Route for deleting a task within a folder
router.delete('/folder/:folderId/task/:taskId', deleteTaskById);

module.exports = router;
