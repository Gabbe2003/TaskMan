

const User = require('../../models/usersSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const errorMessages = require('../../errors/errorMessages');

const handleLogin = async (req, res) => {
    //We are getting the cookies from the request.
    const cookies = req.cookies;
    console.log(cookies)
    //getting two varibales from the request,identifier and password. We intialize the identifier later.
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ 'message': errorMessages.requiredUsernameAndPassword });
    }
    // we are assigning both of the email and username varibales to identifier so that the user can login with either the email or the username.
    const foundUser = await User.findOne({ 
        $or: [ 
            { email: identifier }, 
            { username: identifier } 
        ]
    }).exec();

    if (!foundUser) {
        return res.status(401).json({ 'message':  errorMessages.userNotFound  });
    } 
    //comparing the entered user with the foundUser.password which is the user that the user is trying to login as, if it succsed then we give them a jwt and a cookie.
    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
        return res.status(401).json({ 'message':errorMessages.userNotFound  });
    }
    // Give cookie and a JWT token.
    if (match) {
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "id": foundUser._id,
                    "username": foundUser.username,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' } 
        );

        const refreshToken = jwt.sign(
            { 
                "id": foundUser._id,
                "username": foundUser.username

            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' } 
        );

        //first we check for the refreshToken from the foundUser varible, if not availble we set it to empty as a default. Then we check if there is a jwt in the cookie which means there is an active user, we filter it out and give them a new token instead.Then save everything after we gave it to the user.
        const refreshTokenArray = foundUser.refreshToken || [];
        const newRefreshTokenArray = cookies?.jwt
            ? refreshTokenArray.filter(rt => rt !== cookies.jwt)
            : refreshTokenArray;

        foundUser.refreshToken = [...newRefreshTokenArray, refreshToken];
        await foundUser.save();

        // Clear the old refresh token cookie if it exists
        if (cookies?.jwt) {
            res.clearCookie('accessToken', { httpOnly: true, sameSite: 'Lax', secure: false }); 
        }
        
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 30 * 60 * 1000 }); // 15 minutes

        // Set the refresh token as a separate cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
        
        
        // Send the access token to the client
        res.json({
            success: true, 
            accessToken,
        });
    } else {
        res.status(401).json({ 'message': errorMessages.userNotFound   });
    }
};

module.exports = { handleLogin };
