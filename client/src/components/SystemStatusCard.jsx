// client/src/components/SystemStatusCard.jsx

import React from 'react';
import { CameraIcon, CloudArrowUpIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const SystemStatusCard = ({ data }) => {
  const isConnected = data.webcamStatus === 'Connected';
  return (
    <div className="card-base">
      <h3 className="card-title-lg text-indigo-300">System Status</h3>
      
      <div className="space-y-3 mt-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2 text-indigo-400">
            <CameraIcon className="w-5 h-5" />
            <span>Webcam Feed</span>
          </div>
          <span className={`font-semibold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Active' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2 text-indigo-400">
            <CloudArrowUpIcon className="w-5 h-5" />
            <span>Last Data Sync</span>
          </div>
          <span className="text-white">{data.lastSync}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusCard;