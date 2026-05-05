// server/routes/studentRoutes.js

const express = require('express');
const router = express.Router();

// Controllers import
const { 
    getStudents, 
    addStudent, 
    deleteStudent, 
    enrollStudent,
    getStudentDashboardData 
} = require('../controllers/studentController');

// Middleware import
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/students/dashboard
 * @desc    Get logged-in student's attendance stats and history
 * @access  Private (Student)
 */
router.get('/dashboard', protect, getStudentDashboardData);

/**
 * @route   GET /api/students
 * @desc    Get all students list
 * @access  Private (Admin/Faculty)
 */
router.get('/', getStudents);

/**
 * @route   POST /api/students
 * @desc    Add a new student
 * @access  Private (Admin/Faculty)
 */
router.post('/', addStudent);

/**
 * @route   DELETE /api/students/:id
 * @desc    Remove a student from the system
 * @access  Private (Admin/Faculty)
 */
router.delete('/:id', deleteStudent);

/**
 * @route   PUT /api/students/:id/enroll
 * @desc    Simulate face enrollment for a student
 * @access  Private (Admin/Faculty)
 */
router.put('/:id/enroll', enrollStudent);

module.exports = router;