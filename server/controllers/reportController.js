// server/controllers/reportController.js

const Attendance = require('../models/AttendanceModel');
const User = require('../models/UserModel');

/**
 * @desc    Get aggregate statistics for the Faculty Dashboard
 * @route   GET /api/reports/dashboard
 * @access  Private (Faculty/Admin)
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Aaj ki date nikalna (YYYY-MM-DD) backend timezone ke hisaab se
        const today = new Date().toISOString().split('T')[0];

        // 2. Total Students count (sirf unka jinka role 'student' hai)
        const totalStudents = await User.countDocuments({ role: 'student' });

        // 3. Face Enrolled Students count
        // Logic: Jinka faceDescriptor field exist karta hai aur wo empty array nahi hai
        const enrolledStudents = await User.countDocuments({ 
            role: 'student', 
            faceDescriptor: { $exists: true, $not: { $size: 0 } } 
        });

        // 4. Today's Present Students count (Attendance records for today)
        const totalPresentToday = await Attendance.countDocuments({ date: today });

        // 5. Overall System Activity (Total attendance records in DB ever)
        const totalHistoryRecords = await Attendance.countDocuments();

        res.status(200).json({
            success: true,
            totalStudents,
            enrolledStudents,
            totalPresentToday,
            todayAttendanceRecords: totalHistoryRecords, // Overall system usage
            date: today
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching dashboard analytics', 
            error: error.message 
        });
    }
};

/**
 * @desc    Get Detailed Branch-wise Report (Optional enhancement)
 * @route   GET /api/reports/branch-summary
 */
exports.getBranchSummary = async (req, res) => {
    try {
        const summary = await User.aggregate([
            { $match: { role: 'student' } },
            { $group: { _id: "$branch", count: { $sum: 1 } } }
        ]);
        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};