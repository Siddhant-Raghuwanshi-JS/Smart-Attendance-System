// server/routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();

// Controllers import
const { 
    getAttendanceHistory, 
    verifyAndMarkAttendance 
} = require('../controllers/attendanceController');

// Middleware import
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/attendance/mark
 * @desc    Verify face and mark attendance (Replaced direct mark with verification)
 * @access  Private (Student)
 */
// Humne yahan markAttendance ko hata kar verifyAndMarkAttendance laga diya hai
router.post('/mark', protect, verifyAndMarkAttendance); 

/**
 * @route   POST /api/attendance/verify
 * @desc    Alternative endpoint for live face verification
 * @access  Private (Student)
 */
router.post('/verify', protect, verifyAndMarkAttendance);

/**
 * @route   GET /api/attendance/history/:userId
 * @desc    Get attendance history for a specific student
 * @access  Private (Student/Faculty)
 */
router.get('/history/:userId', protect, getAttendanceHistory);

module.exports = router;