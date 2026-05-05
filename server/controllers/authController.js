const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
const registerUser = async (req, res) => {
    const { identifier, name, email, password, role, branch, semester } = req.body;

    if (!identifier || !name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists.' });
        
        const user = await User.create({
            identifier,
            name,
            email,
            password,
            role: role || 'student',
            branch: branch || 'N/A',
            semester: semester || 'N/A'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                identifier: user.identifier,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,     // <--- ADDED
                semester: user.semester, // <--- ADDED
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// @desc    Authenticate user & get token
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            
            // Role validation
            if (role === 'teacher' && user.role === 'student') {
                return res.status(401).json({ message: 'Access Denied: Not a Faculty member.' });
            }
            if (role === 'student' && user.role !== 'student') {
                return res.status(401).json({ message: 'Access Denied: Please use Faculty login.' });
            }

            res.json({
                _id: user._id,
                identifier: user.identifier,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,     
                semester: user.semester, 
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
};

module.exports = { registerUser, loginUser };