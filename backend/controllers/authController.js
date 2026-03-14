const User = require('../models/User');
const jwt = require('jsonwebtoken');

// POST register
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, dateOfBirth, gender } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const user = new User({ email, password, firstName, lastName, dateOfBirth, gender });
        await user.save();

        res.status(201).json({ success: true, message: 'Registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
