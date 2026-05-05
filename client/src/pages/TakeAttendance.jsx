import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    CheckBadgeIcon, 
    UserCircleIcon, 
    ArrowPathIcon,
    CalendarIcon 
} from '@heroicons/react/24/outline';

const TakeAttendance = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null); // Track specific student update
    const today = new Date().toISOString().split('T')[0];

    const fetchAttendanceStatus = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:5000/api/faculty/daily-report?date=${today}`);
            setStudents(data.data || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchAttendanceStatus(); }, []);

    const handleToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
        setUpdating(userId);
        try {
            await axios.post('http://localhost:5000/api/faculty/mark-manual', {
                userId,
                status: newStatus
            });
            await fetchAttendanceStatus(); // Refresh list to show change
        } catch (err) {
            alert("Failed to update attendance");
        }
        setUpdating(null);
    };

    if (loading) return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#6366f1' }}>
            <div className="animate-pulse">Loading Attendance Sheet...</div>
        </div>
    );

    return (
        <div style={{ padding: '30px', background: '#0f172a', minHeight: '100vh', color: 'white' }}>
            
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', margin: 0 }}>Take <span style={{ color: '#6366f1' }}>Attendance</span></h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px', marginTop: '5px' }}>
                        <CalendarIcon style={{ height: '16px' }} />
                        <span>Attendance Session: {new Date().toDateString()}</span>
                    </div>
                </div>
                <button onClick={fetchAttendanceStatus} style={{ background: '#1e293b', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}>
                    <ArrowPathIcon style={{ height: '20px', color: '#6366f1' }} />
                </button>
            </div>

            {/* Attendance List */}
            <div style={{ background: '#1e293b50', border: '1px solid #334155', borderRadius: '24px', padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 20px', color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #334155', marginBottom: '10px' }}>
                    <span>Student Details</span>
                    <span style={{ textAlign: 'right' }}>Attendance Status</span>
                </div>

                {students.map((student) => (
                    <div key={student._id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '16px 20px',
                        borderRadius: '16px',
                        transition: '0.3s',
                        borderBottom: '1px solid #1e293b'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '50%' }}>
                                <UserCircleIcon style={{ height: '32px', color: '#475569' }} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '16px' }}>{student.name}</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{student.email}</p>
                            </div>
                        </div>

                        <button 
                            disabled={updating === student._id}
                            onClick={() => handleToggle(student._id, student.status)}
                            style={{
                                background: student.status === 'Present' ? '#10b981' : '#1e293b',
                                border: '1px solid',
                                borderColor: student.status === 'Present' ? '#10b981' : '#334155',
                                padding: '10px 24px',
                                borderRadius: '12px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: '600',
                                opacity: updating === student._id ? 0.5 : 1,
                                width: '130px',
                                justifyContent: 'center'
                            }}
                        >
                            {student.status === 'Present' ? (
                                <><CheckBadgeIcon style={{ height: '18px' }} /> Present</>
                            ) : 'Absent'}
                        </button>
                    </div>
                ))}
                
                {students.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#475569' }}>
                        No students found in the database.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TakeAttendance;