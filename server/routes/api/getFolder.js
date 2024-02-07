const express = require('express');
const router = express.Router();
const folderController  = require('../../controllers/postController/getPost');

router.get('/', folderController.getFolders);

module.exports = router;
