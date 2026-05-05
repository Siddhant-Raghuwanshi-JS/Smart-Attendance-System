// server/routes/authRoutes.js

const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const User = require('../models/UserModel'); // User model import karna zaroori hai

const router = express.Router();

// 1. Existing Registration Route
router.post('/register', registerUser);

// 2. Existing Login Route
router.post('/login', loginUser);

// 3. New Route: Register Face Descriptor (AI Data)
// Iska use karke student apna chehra database mein save karega
router.post('/register-face', async (req, res) => {
    try {
        const { userId, faceDescriptor } = req.body;

        // User ko dhoondhna
        const user = await User.findById(userId);

        if (user) {
            // AI se aaye hue face descriptor ko update karna
            user.faceDescriptor = faceDescriptor;
            await user.save();
            
            res.status(200).json({ 
                success: true, 
                message: 'Face registered successfully! You can now mark attendance.' 
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error("Face Registration Error:", error);
        res.status(500).json({ success: false, message: 'Server error during face registration' });
    }
});

module.exports = router;