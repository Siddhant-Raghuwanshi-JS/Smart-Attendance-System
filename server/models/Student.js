// server/models/Student.js

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    // Unique ID for the student (e.g., Roll Number)
    rollNumber: {
        type: String,
        required: [true, 'Please provide a roll number'],
        unique: true,
        trim: true
    },
    // The student's name
    name: {
        type: String,
        required: [true, 'Please provide a student name'],
        trim: true
    },
    // The student's class or major
    class: {
        type: String,
        required: [true, 'Please provide a class or major']
    },
    // Flag to indicate if face enrollment has been completed
    isEnrolled: {
        type: Boolean,
        default: false
    },
    // (Optional) Reference to the face data storage location
    faceId: {
        type: String,
        required: false 
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;