// client/src/components/ActivityFeedItem.jsx

import React from 'react';
import { ClockIcon, UserIcon, WifiIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const ActivityFeedItem = ({ activity }) => {
    let Icon;
    let iconColor;
    
    switch (activity.status) {
        case 'success':
            Icon = CheckCircleIcon;
            iconColor = 'text-green-400';
            break;
        case 'error':
            Icon = XCircleIcon;
            iconColor = 'text-red-400';
            break;
        case 'warning':
            Icon = ExclamationCircleIcon;
            iconColor = 'text-yellow-400';
            break;
        default:
            Icon = ClockIcon;
            iconColor = 'text-indigo-400';
    }

    return (
        <div className="feed-item">
            <Icon className={`w-5 h-5 mr-3 ${iconColor}`} />
            <div className="flex-grow">
                <p className="text-sm font-medium text-white">{activity.subject}</p>
                <p className="text-xs text-indigo-400">{activity.detail}</p>
            </div>
            <p className="text-xs text-indigo-500">{activity.time}</p>
        </div>
    );
};

export default ActivityFeedItem;