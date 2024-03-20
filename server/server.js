require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verify');
const corsOptions = require('./middleware/cors');
const PORT = 8000;
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('tiny'));



app.use('/register', require('./routes/login/register')); // register a new user
app.use('/auth', require('./routes/login/login')); // authenticate the user
app.use('/reset-password', require('./routes/userSettings/resetPWD')); // send an email to the client to reset the pwd
app.use('/createNewPWD', require('./routes/userSettings/newPassword')); // create a new pwd with the obtained token
app.use('/resetToken', require('./routes/userSettings/resetToken')); // obtain a new token
app.use('/refresh', require('./routes/login/refresh')); // refresh handler that gives a new token
app.use(verifyJWT); // middleware for controlling if the user has a valid token
app.use('/changeUserData', require('./routes/userSettings/changeUserData')); // update the user data, for example: email or username
app.use('/deleteUser', require('./routes/userSettings/deleteUser')); // delete the User
app.use('/logout', require('./routes/login/logout')); // log the user out, delete the tokens
app.use('/get', require('./routes/api/getFolder')); // get the user information
app.use('/delete', require('./routes/api/deleteFolder')); // delete a folder
app.use('/delete/task', require('./routes/api/deleteTask')); // delete a task in the folder
app.use('/put', require('./routes/api/updateFolder')); // update the folder
app.use('/put/tasks', require('./routes/api/updateTask')); // update the task in the folder
app.use('/post', require('./routes/api/postFolder')); // create a new folder
app.use('/post/tasks', require('./routes/api/postTasksInFolder')); // create a new task in folder.
app.use('/getUserData', require('./routes/login/getUserData')); // Get the user data.


app.get('/verifyUser', verifyJWT, (req, res) => {
  res.status(200).json({ isAuthenticated: true, user: req.user, 'Message':'The user has been authenticated.' });
});

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(PORT);
  console.log(`Server running on Port ${PORT}`);
})
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
