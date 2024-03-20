// Import necessary modules
const express = require('express');
const router = express.Router();

const { getUserInfo } = require('../../controllers/log/getUserData');

router.get('/', getUserInfo);

module.exports = router;
