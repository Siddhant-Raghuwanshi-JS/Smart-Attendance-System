import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';
import { 
    AcademicCapIcon, XMarkIcon, IdentificationIcon, ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom'; // Logout ke liye

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCamera, setShowCamera] = useState(false);
    const [cameraMode, setCameraMode] = useState('mark'); 
    const [cameraLoading, setCameraLoading] = useState(false);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const detectInterval = useRef(null);
    const navigate = useNavigate(); // Navigation hook

    useEffect(() => {
        loadModelsAndData();
        return () => {
            if (detectInterval.current) clearInterval(detectInterval.current);
        };
    }, []);

    const loadModelsAndData = async () => {
        try {
            const MODEL_URL = '/models';
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);
            setIsModelsLoaded(true);
            fetchDashboardData();
        } catch (err) {
            console.error("Model loading failed:", err);
            fetchDashboardData(); // Data phir bhi load karein
        }
    };

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/students/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Token clear karein
        navigate('/login'); // Login page par bhej dein
    };

    // Live Face Detection Logic
    useEffect(() => {
        if (showCamera && isModelsLoaded) {
            detectInterval.current = setInterval(async () => {
                if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                    const video = webcamRef.current.video;
                    const canvas = canvasRef.current;
                    const displaySize = { width: video.videoWidth, height: video.videoHeight };
                    
                    if (canvas) {
                        faceapi.matchDimensions(canvas, displaySize);
                        const detection = await faceapi.detectSingleFace(video).withFaceLandmarks();
                        if (detection) {
                            const resizedDetections = faceapi.resizeResults(detection, displaySize);
                            const ctx = canvas.getContext('2d');
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            const { x, y, width, height } = resizedDetections.detection.box;
                            ctx.strokeStyle = '#6366f1'; 
                            ctx.lineWidth = 4;
                            ctx.strokeRect(x, y, width, height);
                        }
                    }
                }
            }, 200);
        } else {
            if (detectInterval.current) clearInterval(detectInterval.current);
        }
    }, [showCamera, isModelsLoaded]);

    // StudentDashboard.jsx ke andar handleFaceAction function ko update karein
const handleFaceAction = async () => {
    if (!webcamRef.current) return;
    setCameraLoading(true);
    const video = webcamRef.current.video;
    const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();

    if (!detection) {
        alert("Face detect nahi hua!");
        setCameraLoading(false);
        return;
    }

    const descriptor = Array.from(detection.descriptor);
    const token = localStorage.getItem('token');

    try {
        // Yahan 'faceDescriptor' bhejna hai currentDescriptor ki jagah
        const endpoint = cameraMode === 'register' ? '/api/auth/register-face' : '/api/attendance/verify';
        const payload = { 
            userId: data.profile._id, 
            faceDescriptor: descriptor // Change this key name
        };
        
        await axios.post(`http://localhost:5000${endpoint}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        alert(cameraMode === 'register' ? "Face Registered!" : "Attendance Marked!");
        setShowCamera(false);
        fetchDashboardData(); 
    } catch (err) {
        alert(err.response?.data?.message || "Verification Failed");
    } finally {
        setCameraLoading(false);
    }
};

    if (loading) return <div style={{ padding: '40px', color: 'white' }}>Loading...</div>;

    const isEnrolled = data?.profile?.faceDescriptor?.length > 0;

    return (
        <div style={{ padding: '30px', color: 'white', maxWidth: '1100px', margin: '0 auto' }}>
            {/* Header with Logout */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{data?.profile?.name || "Student"}</h1>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '8px', color: '#94a3b8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <AcademicCapIcon style={{ height: '18px' }} /> 
                            {data?.profile?.branch || data?.profile?.department || "Not Set"}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <IdentificationIcon style={{ height: '18px' }} /> 
                            Sem: {data?.profile?.semester || "N/A"}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={handleLogout}
                        style={{ 
                            background: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 20px', borderRadius: '10px', border: 'none', 
                            color: 'white', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        <ArrowLeftOnRectangleIcon style={{ height: '20px' }} /> Logout
                    </button>
                    
                    <button 
                        onClick={() => { setShowCamera(true); setCameraMode(isEnrolled ? 'mark' : 'register'); }}
                        style={{ 
                            background: isEnrolled ? '#6366f1' : '#10b981', 
                            padding: '10px 24px', borderRadius: '10px', border: 'none', 
                            color: 'white', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        {isEnrolled ? 'Mark Attendance' : 'Register Face'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155' }}>
                    <p style={{ color: '#94a3b8', margin: 0 }}>Attendance Percentage</p>
                    <h2 style={{ fontSize: '36px', margin: '10px 0' }}>{data?.stats?.percentage || 0}%</h2>
                </div>
                <div style={{ background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155' }}>
                    <p style={{ color: '#94a3b8', margin: 0 }}>Days Present</p>
                    <h2 style={{ fontSize: '36px', margin: '10px 0' }}>{data?.stats?.presentCount || 0} / {data?.stats?.totalWorkingDays || 0}</h2>
                </div>
            </div>

            {/* Camera Modal (Same as before but integrated) */}
            {showCamera && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                    <div style={{ background: '#0f172a', padding: '30px', borderRadius: '24px', width: '500px', border: '1px solid #334155' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '20px', margin: 0 }}>Face {cameraMode === 'register' ? 'Registration' : 'Verification'}</h3>
                            <XMarkIcon style={{ height: '28px', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setShowCamera(false)} />
                        </div>
                        <div style={{ position: 'relative', borderRadius: '15px', overflow: 'hidden', background: '#000' }}>
                            <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" style={{ width: '100%', display: 'block' }} />
                            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                        </div>
                        <button 
                            disabled={cameraLoading}
                            onClick={handleFaceAction}
                            style={{ width: '100%', marginTop: '20px', padding: '15px', background: '#6366f1', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            {cameraLoading ? 'Processing...' : 'Capture & Verify'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;