const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/postController/updateTaskInFolder');

router.put('/:folderId/:taskId', taskController.updateTaskInFolder);

module.exports = router;
 