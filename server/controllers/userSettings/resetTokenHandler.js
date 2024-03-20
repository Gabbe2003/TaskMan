const User = require('../../models/usersSchema');
const crypto = require('crypto');

// Token validation function
const validateResetToken = async (req, res) => {
    const { token } = req.query;
    console.log("Received token for validation:", token);

    if (!token) {
        console.log("No token provided in request");
        return res.status(400).json({ isValid: false, message: 'Token is required' });
    }
    try {
        // Hash the received token before comparing it with the stored hashed token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log("Hashed token for query:", hashedToken);

        const user = await User.findOne({
            'passwordResetToken.token': hashedToken,
            'passwordResetToken.expires': { $gt: Date.now() }
        });

        console.log("User found with token:", user ? user.email : "None");

        if (!user) {
            console.log("No user found or token expired.");
            console.log("Current time for expiry check:", new Date().toISOString());
            return res.status(400).json({ isValid: false, message: 'Invalid or expired token' });
        }
        
        // Token is valid
        console.log("Token validated successfully for user:", user.email);
        res.json({ isValid: true });
    } catch (error) {
        console.error('Error during token validation:', error);
        return res.status(500).json({ isValid: false, message: 'Error validating token' });
    }
};

module.exports = { validateResetToken };
