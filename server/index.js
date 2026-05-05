// server/index.js

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Import Route Files
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes'); // CRITICAL: NEW IMPORT
const reportRoutes = require('./routes/reportRoutes');
const facultyRoutes = require('./routes/facultyRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Body parser for raw JSON data
app.use(cors()); // Enable CORS for frontend connection
app.use('/api/reports', reportRoutes);
app.use('/api/faculty', facultyRoutes);

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        
        process.exit(1); // Exit process with failure
    }
};

connectDB();

// 2. Define API Routes
app.get('/', (req, res) => {
    res.send('Smart Attendance System API is running...');
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Student Management Routes
app.use('/api/students', studentRoutes);

// Attendance Tracking Routes
app.use('/api/attendance', attendanceRoutes); // CRITICAL: NEW ROUTE MOUNTED

// Error Handling (Placeholder for advanced error middleware)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});