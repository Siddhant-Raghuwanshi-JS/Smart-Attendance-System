const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        enum: ['Present', 'Absent'],
        default: 'Present'
    },
    date: {
        type: String, // format: YYYY-MM-DD for easy daily check
        required: true
    },
    time: {
        type: String, // format: HH:mm:ss
        required: true
    }
}, { timestamps: true });

const Attendance =  mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;