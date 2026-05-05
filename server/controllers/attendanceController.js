const Attendance = require('../models/AttendanceModel'); // Naya model jo humne abhi banaya
const User = require('../models/UserModel');

const euclideanDistance = (descriptor1, descriptor2) => {
    if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) return Infinity;
    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
        const diff = descriptor1[i] - descriptor2[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
};


const markAttendance = async (req, res) => {
    const userId = req.body.userId || req.user?.id;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    try {
        // 1. Aaj ki date nikalna (YYYY-MM-DD format)
        const today = new Date().toISOString().split('T')[0];

        // 2. Check karna ki kya aaj ki attendance pehle hi lag chuki hai?
        const existingRecord = await Attendance.findOne({
            user: userId,
            date: today
        });

        if (existingRecord) {
            return res.status(200).json({ 
                success: false, 
                message: 'Attendance already marked for today!',
                alreadyMarked: true 
            });
        }

        // 3. Naya attendance record create karna
        const attendance = await Attendance.create({
            user: userId,
            status: 'Present',
            date: today,
            time: new Date().toLocaleTimeString()
        });

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully!',
            record: attendance
        });

    } catch (error) {
        console.error("Attendance error:", error);
        res.status(500).json({ success: false, message: 'Failed to mark attendance.', error: error.message });
    }
};


// AttendanceController.js mein ye THRESHOLD update karein
const verifyAndMarkAttendance = async (req, res) => {
    const { faceDescriptor } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Not authorized.' });
    }
    
    // Yahan ensure karein ki data mil raha hai
    if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
        return res.status(400).json({ success: false, message: 'Face data is missing or invalid.' });
    }

    try {
        const user = await User.findById(userId).select('+faceDescriptor');

        if (!user || !user.faceDescriptor || user.faceDescriptor.length === 0) {
            return res.status(400).json({ success: false, message: 'No enrolled face data found.' });
        }

        const distance = euclideanDistance(
    Array.from(faceDescriptor), // Ensure it's an array
    Array.from(user.faceDescriptor)
);


        console.log(`----------------------------------`);
console.log(`MATCHING FOR: ${user.name}`);
console.log(`DISTANCE: ${distance}`);
console.log(`----------------------------------`);
        
        // ACCURACY FIX: 0.55 thoda loose hai, ise 0.40 se 0.45 ke beech rakhein
        const THRESHOLD = 0.45; 

        // console.log(`Matching distance: ${distance}`); // Console mein distance check karne ke liye

        if (distance > THRESHOLD) {
            return res.status(401).json({ 
                success: false, 
                message: 'Face verification failed! Face does not match registered user.' 
            });
        }

        // Agar match ho gaya tabhi markAttendance call hoga
        req.body.userId = userId;
        return markAttendance(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during verification.' });
    }
};


const getAttendanceHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Latest attendance pehle dikhane ke liye sort({ createdAt: -1 })
        const history = await Attendance.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not fetch history.' });
    }
};

module.exports = {
    markAttendance,
    getAttendanceHistory,
    verifyAndMarkAttendance
};