const express = require('express');
const router = express.Router();
const folderController = require('../../controllers/postController/updatePost');

router.put('/:folderId', folderController.updateFolder);

module.exports = router;
