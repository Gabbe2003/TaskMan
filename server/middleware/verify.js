const jwt = require('jsonwebtoken');
const errorMessages = require('../errors/errorMessages');


const verifyJWT = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ 'message': errorMessages.noTokenProvided });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            // Handle different types of JWT errors
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 'message': errorMessages.expiredToken });
            } else {
                return res.status(409).json({ 'message': errorMessages.invalidToken });
            }
        }
        // Token is valid, attach user info to the request
        req.user = {
            id: decoded.UserInfo.id,
            username: decoded.UserInfo.username
        };
        console.log(`Access token verified for user: ${req.user.username}, ${req.user.id}`);
        next();
    });
}

module.exports = verifyJWT;
