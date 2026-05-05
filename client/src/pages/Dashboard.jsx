import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Excel library import ki
import { 
    UserGroupIcon, 
    FaceSmileIcon, 
    CalendarDaysIcon, 
    ChartBarIcon,
    ArrowPathIcon,
    ArrowDownTrayIcon // Download icon
} from '@heroicons/react/24/outline';

const REPORT_API_URL = 'http://localhost:5000/api/reports/dashboard';
const DAILY_REPORT_API = 'http://localhost:5000/api/faculty/daily-report';

const StatCard = ({ icon: Icon, title, value, color, borderColor }) => (
    <div style={{ 
        background: `${color}15`, 
        border: `1px solid ${borderColor}`, 
        padding: '20px', 
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Icon style={{ height: '32px', width: '32px', color: borderColor }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>{title}</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 'bold', color: 'white' }}>{value}</h2>
    </div>
);

const Dashboard = () => {
    const [reportData, setReportData] = useState({
        totalStudents: 0,
        enrolledStudents: 0,
        todayAttendanceRecords: 0,
        totalPresentToday: 0,
    });
    const [dailyLogs, setDailyLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const today = new Date().toISOString().split('T')[0];
            const [statsRes, logsRes] = await Promise.all([
                axios.get(REPORT_API_URL),
                axios.get(`${DAILY_REPORT_API}?date=${today}`)
            ]);
            setReportData(statsRes.data);
            setDailyLogs(logsRes.data.data || []);
            setLoading(false);
        } catch (err) {
            setError('Backend Connection Error');
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- EXPORT LOGIC ---
    const exportToExcel = () => {
        if (dailyLogs.length === 0) return alert("No data available to export!");

        // Data ko Excel format mein convert karna
        const worksheet = XLSX.utils.json_to_sheet(dailyLogs);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

        // File name banana (Today's Date ke saath)
        const fileName = `Attendance_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Download trigger karna
        XLSX.writeFile(workbook, fileName);
    };

    if (loading) return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#6366f1' }}>
            <div className="animate-pulse">Loading Faculty Intelligence...</div>
        </div>
    );

    const enrollmentRate = reportData.totalStudents > 0 ? ((reportData.enrolledStudents / reportData.totalStudents) * 100).toFixed(1) : 0;
    const todayAttendanceRate = reportData.totalStudents > 0 ? ((reportData.totalPresentToday / reportData.totalStudents) * 100).toFixed(1) : 0;

    return (
        <div style={{ padding: '30px', background: '#0f172a', minHeight: '100vh', color: 'white' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '24px', margin: 0 }}>Faculty <span style={{ color: '#6366f1' }}>Intelligence</span></h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={exportToExcel} style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 20px', 
                        borderRadius: '12px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '600'
                    }}>
                        <ArrowDownTrayIcon style={{ height: '18px' }} />
                        Download Excel
                    </button>
                    <button onClick={fetchData} style={{ background: '#1e293b', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                        <ArrowPathIcon style={{ height: '20px', color: '#6366f1' }} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <StatCard icon={UserGroupIcon} title="Total Students" value={reportData.totalStudents} color="#3b82f6" borderColor="#3b82f6" />
                <StatCard icon={FaceSmileIcon} title="Face Enrolled" value={`${enrollmentRate}%`} color="#10b981" borderColor="#10b981" />
                <StatCard icon={CalendarDaysIcon} title="Present Today" value={`${todayAttendanceRate}%`} color="#f59e0b" borderColor="#f59e0b" />
                <StatCard icon={ChartBarIcon} title="Activity Score" value={reportData.todayAttendanceRecords} color="#6366f1" borderColor="#6366f1" />
            </div>

            {/* Table Section */}
            <div style={{ background: '#1e293b50', border: '1px solid #334155', borderRadius: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Live Attendance Feed</h3>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>Total {dailyLogs.length} Records</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ color: '#94a3b8', borderBottom: '1px solid #334155', fontSize: '14px' }}>
                                <th style={{ paddingBottom: '15px' }}>Name</th>
                                <th style={{ paddingBottom: '15px' }}>Email</th>
                                <th style={{ paddingBottom: '15px' }}>Status</th>
                                <th style={{ paddingBottom: '15px' }}>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyLogs.length > 0 ? dailyLogs.map((log, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #1e293b' }}>
                                    <td style={{ padding: '15px 0' }}>{log.name}</td>
                                    <td style={{ padding: '15px 0', color: '#94a3b8' }}>{log.email}</td>
                                    <td style={{ padding: '15px 0' }}>
                                        <span style={{ 
                                            background: log.status === 'Present' ? '#10b98120' : '#ef444420',
                                            color: log.status === 'Present' ? '#10b981' : '#ef4444',
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                                        }}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 0', color: '#94a3b8', fontFamily: 'monospace' }}>{log.time}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>No attendance marked yet for today.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;