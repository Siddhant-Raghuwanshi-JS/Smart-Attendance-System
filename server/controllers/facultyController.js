const User = require('../models/UserModel');
const Attendance = require('../models/AttendanceModel');

// 1. Get all students (Universal fetch with optional filters)
exports.getClassStudents = async (req, res) => {
    try {
        const { branch, semester } = req.query;
        let query = { role: 'student' };

        if (branch && semester) {
            query.branch = branch;
            query.semester = semester;
        }

        const students = await User.find(query).sort({ name: 1 });
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get today's attendance report for faculty
exports.getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];
        
        const students = await User.find({ role: 'student' }).sort({ name: 1 });
        const attendanceRecords = await Attendance.find({ date: targetDate });

        const report = students.map(student => {
            const record = attendanceRecords.find(r => r.user.toString() === student._id.toString());
            return {
                _id: student._id,
                name: student.name,
                email: student.email,
                status: record ? 'Present' : 'Absent',
                time: record ? record.time : '-'
            };
        });

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Mark/Toggle Manual Attendance
exports.markManualAttendance = async (req, res) => {
    try {
        const { userId, status } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toLocaleTimeString('en-US', { hour12: false });

        if (status === 'Present') {
            let record = await Attendance.findOne({ user: userId, date: today });
            if (!record) {
                record = new Attendance({ user: userId, date: today, time: now, status: 'Present' });
                await record.save();
            }
        } else {
            await Attendance.findOneAndDelete({ user: userId, date: today });
        }

        res.status(200).json({ success: true, message: 'Updated Successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};