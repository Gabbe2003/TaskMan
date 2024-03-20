const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { deleteUser } = require('../../controllers/userSettings/deleteUser');

const deleteUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Too many password change requests from this IP, please try again after 15 minutes',
});


router.delete('/:userId',deleteUserLimiter, deleteUser);

module.exports = router; 