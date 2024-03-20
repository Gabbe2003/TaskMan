const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Too many password change requests from this IP, please try again after 15 minutes',
});

const resetPassword = require('../../controllers/userSettings/resetPWD');

router.post('/',passwordChangeLimiter, resetPassword.handlePWDReset);

module.exports = router; 