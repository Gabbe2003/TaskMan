const express = require('express');
const router = express.Router();
const { deleteFolder } = require('../../controllers/postController/deletePost');

// Route for deleting a folder
router.delete('/folder/:folderId', deleteFolder);

module.exports = router;
