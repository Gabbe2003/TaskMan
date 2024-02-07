const User = require('../../models/usersSchema');
const jwt = require('jsonwebtoken');
const errorMessages = require('../../errors/errorMessages');

const handleRefreshToken = async (req, res) => {
    console.log('Handling refresh token request');
    const cookies = req.cookies;
    console.log(req.cookies)

    if (!cookies?.refreshToken) {
        console.log('No refresh token cookie present in the request.');
        return res.status(401).json({'message': errorMessages.noCookieInSession });
    }

    console.log('Refresh token found in cookies:', cookies.refreshToken);
    const refreshToken = cookies.refreshToken;

    try {
        console.log('Verifying refresh token...');
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                console.log('Error during refresh token verification:', err);
                return res.status(403).json({'message': err.message});
            }

            console.log('Refresh token is valid, generating new access token...');
            const accessToken = jwt.sign(
                { "UserInfo": { "username": decoded.username, "id": decoded.id } },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            console.log(`New access token generated for user: ${decoded.username}`);

            // Optionally generate a new refresh token
            const newRefreshToken = jwt.sign(
                { "username": decoded.username, "id": decoded.id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );

            console.log(`Updating user's refresh token in database...`);
            await User.findOneAndUpdate(
                { _id: decoded.id },
                { refreshToken: newRefreshToken }
            );

            console.log('User document updated with new refresh token.');

            res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 60 * 60 * 1000 });


            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000});

            res.json({ 
                accessToken: accessToken, 
                refreshToken: newRefreshToken 
            });
        });
    } catch (error) {
        console.error('Server error while handling the refresh token:', error);
        return res.status(500).json({'message': errorMessages.internalError });
    }
};

module.exports = { handleRefreshToken };
