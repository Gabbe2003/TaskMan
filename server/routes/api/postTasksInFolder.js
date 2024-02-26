const express = require('express');
const router = express.Router();
const { addTaskToFolder } = require('../../controllers/postController/createTask');


router.post('/:folderId', addTaskToFolder);

module.exports = router;
