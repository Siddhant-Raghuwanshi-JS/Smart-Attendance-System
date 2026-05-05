const express = require('express');
const router = express.Router();
const { 
    getClassStudents, 
    getDailyReport, 
    markManualAttendance 
} = require('../controllers/facultyController');

router.get('/class-list', getClassStudents);
router.get('/daily-report', getDailyReport);
router.post('/mark-manual', markManualAttendance);

module.exports = router;