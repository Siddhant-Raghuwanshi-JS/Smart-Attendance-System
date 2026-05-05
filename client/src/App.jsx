// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Faculty Dashboard
import StudentDashboard from './pages/StudentDashboard'; // <--- NEW IMPORT
import TakeAttendance from './pages/TakeAttendance';
import ManageStudents from './pages/ManageStudents'; 
import MainLayout from './layouts/MainLayout';
import './index.css';

// ==========================================================
// 1. PrivateRoute Component
// Sirf authenticated users hi dashboard access kar payenge.
// ==========================================================
const PrivateRoute = ({ children }) => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? children : <Navigate to="/login" replace />;
};

// ==========================================================
// 2. Main App Component
// ==========================================================
function App() {
  return (
    <Router>
        <Routes>
            {/* ----------------- A. Public Routes ----------------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Root path ko login par bhej rahe hain */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* ----------------- B. Private Routes (Faculty) ----------------- */}
            {/* In routes mein Sidebar aur MainLayout dikhega */}
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/attendance" element={<TakeAttendance />} />
                <Route path="/students" element={<ManageStudents />} /> 
                <Route path="/settings" element={<div>Settings Page Coming Soon...</div>} />
            </Route>

            {/* ----------------- C. Student Routes ----------------- */}
            {/* Student Dashboard aksar full screen hota hai ya alag layout 
                isliye isse humne MainLayout se bahar rakha hai 
            */}
            <Route 
                path="/student-dashboard" 
                element={
                    <PrivateRoute>
                        <StudentDashboard />
                    </PrivateRoute>
                } 
            />

            {/* Catch-all: Galat URL par login par wapas bhej dega */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </Router>
  );
}

export default App;