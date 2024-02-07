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

const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('tiny'));

app.use('/register', require('./routes/login/register'));
app.use('/auth', require('./routes/login/login'));
app.use('/refresh', require('./routes/login/refresh'));
app.use(verifyJWT);
app.use('/logout', require('./routes/login/logout'));
app.use('/get', require('./routes/api/getFolder'));
app.use('/delete', require('./routes/api/deleteFolder'));
app.use('/put', require('./routes/api/updateFolder'));
app.use('/post', require('./routes/api/postFolder'));


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
