const express = require('express');
const router = express.Router();

const newUser = require('../../controllers/log/register');

router.post('/', newUser.handleNewUser);

module.exports = router; 