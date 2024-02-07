const User = require('../../models/usersSchema');
const validator = require('validator');
const errorMessages =require('../../errors/errorMessages');

const handleNewUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ 'message': errorMessages.filedsAreEmpty });
    }

    if (!validator.isEmail(email)) {
        const message = email.trim() === ''
            ? 'Email field is empty.'
            : 'Please enter a valid email address.';
        return res.status(400).json({ 'message': message });
    }

    const passwordStrengthRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$/;

       // Check if the password matches the required pattern
       if (!passwordStrengthRegex.test(password)) {
        return res.status(400).json({ 'message': 'Password does not meet the strength requirements. It must be at least 4 characters long, include a number, an uppercase letter, and a lowercase letter.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ 'message': errorMessages.wrongPassword });
    }

    const duplicator = await User.findOne({ 
        $or: [{ email: email.toLowerCase() }, { username: username }] 
    }).exec();
    
    if (duplicator) {
        return res.status(409).json({ "message": errorMessages.existingUser });
    }

    try {
        // Create a new user instance and save it to the database
        const newUser = new User({
            username: username,
            email: email.toLowerCase(), 
            password: password, 
        });

        const result = await newUser.save();

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
        console.log(err.message);
    }
};

module.exports = { handleNewUser };
