// client/src/layouts/Sidebar.jsx

import React from 'react';
import { HomeIcon, CameraIcon, UsersIcon, Cog6ToothIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Take Attendance', path: '/attendance', icon: CameraIcon },
    { name: 'Manage Students', path: '/students', icon: UsersIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
];

const Sidebar = () => {
    const location = useLocation();

    const handleLogout = () => {
        // Clear user data and redirect to login
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    };

    return (
        <div className="sidebar-container">
            <div className="logo-section">
                <span className="logo-text">Smart Attendance</span>
            </div>
            <nav className="nav-menu">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.name} 
                            to={item.path} 
                            className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                        >
                            <item.icon className="nav-icon" />
                            <span className="nav-text">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="logout-section">
                <button onClick={handleLogout} className="logout-button">
                    <ArrowLeftEndOnRectangleIcon className="nav-icon" />
                    <span className="nav-text">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;