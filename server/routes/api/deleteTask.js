const express = require('express');
const router = express.Router();
const { deleteTaskById } = require('../../controllers/postController/deleteTask');


// Route for deleting a task within a folder
router.delete('/:folderId/:taskId', deleteTaskById);

module.exports = router;
