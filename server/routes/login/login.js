const express = require('express');
const router = express.Router();

const authUser = require('../../controllers/log/auth')

router.post('/',authUser.handleLogin);

module.exports = router; 