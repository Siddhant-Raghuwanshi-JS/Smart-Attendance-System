// server/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
// Controller se sahi function nikalna
const { getDashboardStats } = require('../controllers/reportController');

// Check karo ki function exist karta hai ya nahi (safety check)
if (!getDashboardStats) {
    console.error("ERROR: getDashboardStats function is undefined in reportRoutes!");
}

// Route definition
router.get('/dashboard', getDashboardStats);

module.exports = router;