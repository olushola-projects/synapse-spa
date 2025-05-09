
import React from 'react';

interface DashboardHeaderProps {
  avatarSrc: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ avatarSrc }) => {
  return (
    <div className="h-[6%] bg-white flex items-center justify-between px-3 border-b border-gray-200">
      <div className="flex gap-1.5 items-center">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <div className="ml-4 text-gray-800 text-[8px] sm:text-xs font-medium">Synapses</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-[6px] text-gray-500">GRC Dashboard</div>
        <div className="h-4 w-4 rounded-full overflow-hidden bg-gray-200">
          <img src={avatarSrc} alt="User" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
};
