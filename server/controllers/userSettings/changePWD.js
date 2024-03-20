const express = require('express');
const router = express.Router();
const User = require('../../models/usersSchema');
const crypto = require('crypto');
  
  const handleChangePassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const passwordStrengthRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$/;

    // Validate input
    if (!token || !newPassword) {
        console.log(token)
        console.log(newPassword)
        return res.status(400).json({ 'message': 'Token and new password are required.' });
    }

    // Check if the password matches the required pattern
    if (!passwordStrengthRegex.test(newPassword)) {
        console.log(token,'token')
        console.log(newPassword, 'new pwd.')

        return res.status(400).json({ 'message': 'Password does not meet the strength requirements. It must be at least 4 characters long, include a number, an uppercase letter, and a lowercase letter.' });
    }

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        const user = await User.findOne({
            'passwordResetToken.token': hashedToken,
            'passwordResetToken.expires': { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        user.password = newPassword;
        user.passwordResetToken = undefined;

        await user.save();
        
        res.status(200).json({ 'message': 'Password has been successfully updated.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ 'message': 'Error updating password.' });
    }
};

module.exports = { handleChangePassword };
