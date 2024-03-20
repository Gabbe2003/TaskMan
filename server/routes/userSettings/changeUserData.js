const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { updateUserData } = require('../../controllers/userSettings/changeUserData');

const userDataChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Too many data change requests from this IP, please try again after 15 minutes',
});

router.put('/:userId', userDataChangeLimiter, updateUserData);

module.exports = router;
