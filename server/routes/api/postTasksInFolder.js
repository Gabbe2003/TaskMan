const express = require('express');
const router = express.Router();
const { addTaskToFolder } = require('../../controllers/postController/createTask');


router.post('/:folderId/tasks', addTaskToFolder);

module.exports = router;
