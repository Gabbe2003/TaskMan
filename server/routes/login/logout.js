const express = require('express');
const router = express.Router();

const logUserOut = require('../../controllers/log/logout');

router.post('/', logUserOut.handleLogout);

module.exports = router; 