const User = require('../../models/usersSchema');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        // Clear both cookies even if the refreshToken is not provided
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'Lax', secure: false });
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Lax', secure: false });
        return res.status(400).json({ message: 'Refresh token not provided.' });
    }

    try {
        // Verify the refreshToken
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const username = decoded.username;

        // Find the user with that refreshToken
        const foundUser = await User.findOne({ username, refreshToken }).exec();

        if (!foundUser) {
            // If the user is not found, clear both cookies anyway
            res.clearCookie('accessToken', { httpOnly: true, sameSite: 'Lax', secure: false });
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Lax', secure: false });
            return res.status(204).json({ message: 'User not found'});
        }

        // Remove the refreshToken from the user's list
        foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
        await foundUser.save();

        // Clear both the accessToken and refreshToken cookies
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'Lax', secure: false });
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Lax', secure: false });

        return res.status(200).json({ message: `User ${username} has been logged out successfully.` });
    } catch (err) {
        // If there's an error verifying the JWT
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'Lax', secure: false });
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Lax', secure: false });
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

module.exports = { handleLogout };
