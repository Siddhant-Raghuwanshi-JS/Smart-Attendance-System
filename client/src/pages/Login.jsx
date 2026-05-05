import React, { useState } from 'react';
import { LockClosedIcon, AtSymbolIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'https://smart-attendance-system-q81s.onrender.com/api/auth/';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };

            const { data } = await axios.post(
                API_URL + 'login',
                { email, password, role },
                config
            );

            // --- TOKEN STORAGE FIX ---
            // 1. Store full user info for general use
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            // 2. Store token separately so the Dashboard can find it
            localStorage.setItem('token', data.token); 
            
            // 3. Role based redirection logic
            if (data.role === 'teacher' || data.role === 'admin') {
                navigate('/dashboard'); 
            } else {
                navigate('/student-dashboard'); 
            }
            
        } catch (err) {
            setError(err.response && err.response.data.message
                ? err.response.data.message
                : 'Login failed. Please check credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', textAlign: 'center', color: '#a5b4fc', marginBottom: '24px' }}>
                    Sign in to Attendance System
                </h2>

                <div style={{ 
                    display: 'flex', 
                    background: '#334155', 
                    borderRadius: '8px', 
                    padding: '4px', 
                    marginBottom: '24px',
                    border: '1px solid #475569' 
                }}>
                    <button 
                        type="button"
                        onClick={() => setRole('student')}
                        style={{ 
                            flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                            background: role === 'student' ? '#6366f1' : 'transparent',
                            color: 'white', transition: 'all 0.3s ease', fontWeight: '600'
                        }}
                    >
                        Student
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRole('teacher')}
                        style={{ 
                            flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                            background: role === 'teacher' ? '#6366f1' : 'transparent',
                            color: 'white', transition: 'all 0.3s ease', fontWeight: '600'
                        }}
                    >
                        Faculty
                    </button>
                </div>
                
                <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={submitHandler}>
                    {error && (
                        <div className="error-message" style={{ color: '#f87171', textAlign: 'center', background: '#f8717120', padding: '10px', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <div className="input-group" style={{ position: 'relative', marginBottom: '16px' }}>
                            <input
                                id="email-address"
                                type="email"
                                required
                                className="auth-input"
                                placeholder="Email Address"
                                style={{ width: '100%', padding: '12px 40px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <AtSymbolIcon style={{ position: 'absolute', left: '12px', top: '12px', height: '20px', color: '#64748b' }} />
                        </div>
                        
                        <div className="input-group" style={{ position: 'relative' }}>
                            <input
                                id="password"
                                type="password"
                                required
                                className="auth-input"
                                placeholder="Password"
                                style={{ width: '100%', padding: '12px 40px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <LockClosedIcon style={{ position: 'absolute', left: '12px', top: '12px', height: '20px', color: '#64748b' }} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ 
                            background: '#6366f1', color: 'white', padding: '12px', borderRadius: '8px', 
                            border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Verifying...' : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                    </button>
                </form>
                
                <div style={{ fontSize: '0.875rem', textAlign: 'center', marginTop: '16px' }}>
                    <p style={{ color: '#a5b4fc' }}>
                        Don't have an account? 
                        <Link 
                            to="/register" 
                            style={{ fontWeight: '500', color: '#4ade80', marginLeft: '4px', textDecoration: 'none' }}
                        >
                            Register Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;