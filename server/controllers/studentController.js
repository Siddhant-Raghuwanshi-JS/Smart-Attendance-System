// server/controllers/studentController.js

const User = require('../models/UserModel');
const Attendance = require('../models/AttendanceModel');
const Student = require('../models/Student');

// 1. Student Dashboard Data (Logged-in Student only)
const getStudentDashboardData = async (req, res) => {
    try {
        const studentId = req.user.id; // Comes from authMiddleware (protect)
        
        // Fetch user profile
        const student = await User.findById(studentId).select('-password');
        
        // Fetch attendance records
        const attendanceRecords = await Attendance.find({ user: studentId }).sort({ date: -1 });

        // Logic for Stats
        const totalWorkingDays = 30; 
        const presentCount = attendanceRecords.length;
        const attendancePercentage = ((presentCount / totalWorkingDays) * 100).toFixed(1);

        res.status(200).json({
            success: true,
            profile: student,
            stats: {
                presentCount,
                totalWorkingDays,
                percentage: attendancePercentage
            },
            history: attendanceRecords
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Admin: Get all students list
const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).sort({ name: 1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch students', error: error.message });
    }
};

// 3. Admin: Add a new student
const addStudent = async (req, res) => {
    try {
        const student = await User.create({ ...req.body, role: 'student' });
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add student', error: error.message });
    }
};

// 4. Admin: Delete student
const deleteStudent = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Student removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete student', error: error.message });
    }
};

// 5. Admin: Enroll student (Face Simulation)
const enrollStudent = async (req, res) => {
    try {
        const student = await User.findByIdAndUpdate(
            req.params.id, 
            { isEnrolled: true }, 
            { new: true }
        );
        res.status(200).json({ message: 'Enrolled successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Enrollment failed', error: error.message });
    }
};

// EXPORTS - Yahan check karein saare functions defined hain
module.exports = {
    getStudentDashboardData,
    getStudents,
    addStudent,
    deleteStudent,
    enrollStudent
};