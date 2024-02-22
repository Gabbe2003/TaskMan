const express = require('express');
const router = express.Router();
const { deleteTaskById } = require('../../controllers/postController/deleteTask');


// Route for deleting a task within a folder
router.delete('/folder/:folderId/task/:taskId', deleteTaskById);

module.exports = router;
