// client/src/components/AttendanceCard.jsx

import React from 'react';
import { UserGroupIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const AttendanceCard = ({ data }) => {
  return (
    <div className="card-base">
      <h3 className="card-title-lg text-indigo-300">Today's Attendance</h3>
      <div className="flex justify-between items-end mb-4">
        <p className="text-5xl font-extrabold text-white">{data.present}</p>
        <p className="text-indigo-400">/ {data.total} Total</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-green-400" />
          <p>Present: <span className="font-semibold text-white">{data.present}</span></p>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="w-5 h-5 text-yellow-400" />
          <p>Late: <span className="font-semibold text-white">{data.late}</span></p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;