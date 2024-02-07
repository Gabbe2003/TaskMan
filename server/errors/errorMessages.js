const errorMessages = {
    requiredUsernameAndPassword: 'Please enter both username/email and password.',
    userNotFound: 'Login failed. Please check your credentials and try again.',
    invalidCredentials: 'Login failed. Please check your credentials and try again.',
    filedsAreEmpty: 'All fields are required.',
    wrongPassword:'Passwords must match, check your passwords.',
    existingUser:'Username or email is already in use',
    noCookieInSession:'Failed to Authenticate the user.',
    noCookieFound:'No cookie found in session.',
    internalError:'Internal server error, please try again later.',
    wrongBearer:'Authoruzation header is missing.',
    expiredToken:'Access token is invalid or expired',
    unauthorizedUser:'Unauthorized user. Please login!',
    emptyFolderName:'Folder name is required, please fill the empty name.',
    usedFolderName: 'Folder with the same name already exists, try another name.',
    invalidToken: 'Your token is invalid or missing, login again!.',
    noTokenProvided: 'There is no token provided.'
};

module.exports = errorMessages;