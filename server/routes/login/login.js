const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 10, 
  message: 'Too many password change requests from this IP, please try again after 10 minutes',
});

const authUser = require('../../controllers/log/auth')

router.post('/',authLimiter, authUser.handleLogin);

module.exports = router; 