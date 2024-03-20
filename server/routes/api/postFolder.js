const express = require('express');
const router = express.Router();
const folderController  = require('../../controllers/postController/createFolder');

router.post('/', folderController.createFolder);

module.exports = router;
