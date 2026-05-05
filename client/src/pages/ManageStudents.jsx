import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    TrashIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            // Fetching all students from the new endpoint
            const { data } = await axios.get('http://localhost:5000/api/faculty/class-list');
            if (data.success) {
                setStudents(data.data);
            }
            setLoading(false);
        } catch (err) {
            setError('Backend check failed. Is the server running?');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
    if (window.confirm('Delete this student permanently?')) {
        try {
            // Sahi URL: http://localhost:5000/api/students/${id}
            // Purana wala '/api/auth/student/' galat tha
            await axios.delete(`http://localhost:5000/api/students/${id}`);
            
            alert('Student removed successfully!');
            fetchStudents(); // List refresh karne ke liye
        } catch (err) {
            console.error("Error deleting student:", err);
            alert('Delete failed: Student not found or Server error');
        }
    }
};

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#6366f1' }}>
            <div className="animate-pulse">Loading Directory...</div>
        </div>
    );

    return (
        <div style={{ padding: '30px', background: '#0f172a', minHeight: '100vh', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '24px', margin: 0 }}>Student <span style={{ color: '#6366f1' }}>Database</span></h1>
                <button onClick={fetchStudents} style={{ background: '#1e293b', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                    <ArrowPathIcon style={{ height: '20px', color: '#6366f1' }} />
                </button>
            </div>

            {/* Search Box */}
            <div style={{ 
                background: '#1e293b', padding: '12px 20px', borderRadius: '16px', display: 'flex', 
                alignItems: 'center', gap: '12px', marginBottom: '30px', border: '1px solid #334155' 
            }}>
                <MagnifyingGlassIcon style={{ height: '20px', color: '#6366f1' }} />
                <input 
                    type="text" 
                    placeholder="Find a student by name or email..." 
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div style={{ background: '#1e293b50', border: '1px solid #334155', borderRadius: '20px', padding: '24px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ color: '#94a3b8', borderBottom: '1px solid #334155', fontSize: '14px' }}>
                            <th style={{ padding: '0 0 15px 10px' }}>Student Info</th>
                            <th style={{ paddingBottom: '15px' }}>Email</th>
                            <th style={{ paddingBottom: '15px' }}>Face Data</th>
                            <th style={{ paddingBottom: '15px', textAlign: 'center' }}>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student._id} style={{ borderBottom: '1px solid #1e293b' }}>
                                <td style={{ padding: '15px 10px', fontWeight: '500' }}>{student.name}</td>
                                <td style={{ padding: '15px 0', color: '#94a3b8' }}>{student.email}</td>
                                <td style={{ padding: '15px 0' }}>
                                    {student.faceDescriptor && student.faceDescriptor.length > 0 ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                                            <CheckCircleIcon style={{ height: '18px' }} />
                                            <span style={{ fontSize: '13px' }}>Enrolled</span>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
                                            <XCircleIcon style={{ height: '18px' }} />
                                            <span style={{ fontSize: '13px' }}>Not Ready</span>
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '15px 0', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => handleDelete(student._id)} 
                                        style={{ background: '#ef444415', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                                    >
                                        <TrashIcon style={{ height: '18px', color: '#ef4444' }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStudents.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>No students in the system.</div>
                )}
            </div>
        </div>
    );
};

export default ManageStudents;