
import React from 'react';
import { BadgeCheck, GamepadIcon, Users } from 'lucide-react';

export const StatusCards = () => {
  return (
    <div className="flex gap-1 h-[15%] mb-1">
      <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
        <div className="flex items-center gap-0.5">
          <BadgeCheck size={6} className="text-blue-500" />
          <div className="text-[5px] text-gray-600">Badges</div>
        </div>
        <div className="text-gray-800 text-[8px] font-medium">12 New</div>
        <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full"></div>
      </div>
      <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
        <div className="flex items-center gap-0.5">
          <GamepadIcon size={6} className="text-purple-500" />
          <div className="text-[5px] text-gray-600">Gamification</div>
        </div>
        <div className="text-gray-800 text-[8px] font-medium">New Games</div>
        <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-purple-300 to-purple-500 rounded-full"></div>
      </div>
      <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
        <div className="flex items-center gap-0.5">
          <Users size={6} className="text-amber-500" />
          <div className="text-[5px] text-gray-600">Forum Activity</div>
        </div>
        <div className="text-gray-800 text-[8px] font-medium">5 New</div>
        <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"></div>
      </div>
    </div>
  );
};
