export const mockActivityFeed = [
    {
        type: 'login',
        subject: 'Admin',
        detail: 'System accessed',
        time: 'just now',
        status: 'success'
    },
    {
        type: 'attendance',
        subject: 'MA202 - Linear Algebra',
        detail: 'Session started by Prof. Doe',
        time: '2 minutes ago',
        status: 'warning'
    },
    {
        type: 'student',
        subject: 'S105 - Alex Chen',
        detail: 'Marked as present (Manual Override)',
        time: '5 minutes ago',
        status: 'success'
    },
    {
        type: 'system',
        subject: 'Webcam Feed',
        detail: 'Connection lost (Restarting)',
        time: '15 minutes ago',
        status: 'error'
    },
    {
        type: 'attendance',
        subject: 'CS101 - Algorithms',
        detail: 'Session ended (240/250 students present)',
        time: '30 minutes ago',
        status: 'success'
    },
];