const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Too many password change requests from this IP, please try again after 15 minutes',
});

const changePassword = require('../../controllers/userSettings/changePWD');

router.post('/',passwordChangeLimiter, changePassword.handleChangePassword);

module.exports = router; 