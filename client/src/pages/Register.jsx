import React, { useState } from 'react';
import { 
    LockClosedIcon, AtSymbolIcon, UserIcon, 
    IdentificationIcon, UserGroupIcon, AcademicCapIcon, 
    Bars3BottomLeftIcon 
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'https://smart-attendance-system-q81s.onrender.com/api/auth/';

const Register = () => {
    // Initial state mein sari fields pre-defined rakhte hain
    const [formData, setFormData] = useState({
        identifier: '',
        name: '',
        email: '',
        password: '',
        role: 'student',
        branch: 'CSE',      // Default Branch
        semester: '1st'     // Default Semester
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Agar role change ho raha hai aur wo teacher hai, toh branch/sem ko N/A kar dete hain
        if (name === "role" && value === "teacher") {
            setFormData({
                ...formData,
                [name]: value,
                branch: 'N/A',
                semester: 'N/A'
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log("Sending Data:", formData); // Debugging ke liye console check karo

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(API_URL + 'register', formData, config);
            
            alert('Registration Successful!');
            navigate('/login');
        } catch (err) {
            console.error("Registration Error:", err.response?.data);
            setError(err.response?.data?.message || 'Server Error: Check Backend Terminal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '500px' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', textAlign: 'center', color: '#a5b4fc', marginBottom: '24px' }}>
                    Create Account
                </h2>
                
                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={submitHandler}>
                    {error && <div className="error-message">{error}</div>}
                    
                    {/* ID Input */}
                    <div className="input-group" style={{ position: 'relative' }}>
                        <input name="identifier" type="text" required className="auth-input" placeholder="ID (e.g., S101)" value={formData.identifier} onChange={handleChange} />
                        <IdentificationIcon className="icon-absolute" />
                    </div>

                    {/* Name Input */}
                    <div className="input-group" style={{ position: 'relative' }}>
                        <input name="name" type="text" required className="auth-input" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                        <UserIcon className="icon-absolute" />
                    </div>

                    {/* Email Input */}
                    <div className="input-group" style={{ position: 'relative' }}>
                        <input name="email" type="email" required className="auth-input" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                        <AtSymbolIcon className="icon-absolute" />
                    </div>
                    
                    {/* Password Input */}
                    <div className="input-group" style={{ position: 'relative' }}>
                        <input name="password" type="password" required className="auth-input" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} />
                        <LockClosedIcon className="icon-absolute" />
                    </div>

                    {/* Role Selection */}
                    <div className="input-group" style={{ position: 'relative' }}>
                        <select name="role" className="auth-input" value={formData.role} onChange={handleChange}>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                        <UserGroupIcon className="icon-absolute" />
                    </div>

                    {/* Student Specific Fields */}
                    {formData.role === 'student' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="input-group" style={{ position: 'relative' }}>
                                <select name="branch" className="auth-input" value={formData.branch} onChange={handleChange}>
                                    <option value="CSE">CSE</option>
                                    <option value="IT">IT</option>
                                    <option value="ME">ME</option>
                                    <option value="ECE">ECE</option>
                                </select>
                                <AcademicCapIcon className="icon-absolute" />
                            </div>
                            <div className="input-group" style={{ position: 'relative' }}>
                                <select name="semester" className="auth-input" value={formData.semester} onChange={handleChange}>
                                    <option value="1st">1st Sem</option>
                                    <option value="2nd">2nd Sem</option>
                                    <option value="3rd">3rd Sem</option>
                                    <option value="4th">4th Sem</option>
                                    <option value="5th">5th Sem</option>
                                    <option value="6th">6th Sem</option>
                                    <option value="7th">7th Sem</option>
                                    <option value="8th">8th Sem</option>
                                </select>
                                <Bars3BottomLeftIcon className="icon-absolute" />
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="auth-button">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <p style={{ color: '#a5b4fc', fontSize: '0.875rem' }}>
                        Already have an account? <Link to="/login" style={{ color: '#4ade80', textDecoration: 'none' }}> Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;