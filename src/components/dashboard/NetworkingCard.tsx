
import React from 'react';
import { Users } from 'lucide-react';

export const NetworkingCard: React.FC = () => {
  return (
    <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <Users size={8} className="text-blue-500" />
          <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Networking & Forum</div>
        </div>
        <div className="text-gray-500 text-[4px] sm:text-[5px]">Active Now</div>
      </div>
      
      <div className="grid grid-cols-2 gap-1 h-[80%] overflow-y-auto">
        <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
          <div className="w-1 h-1 rounded-full bg-yellow-500 mt-0.5 mr-0.5"></div>
          <div>
            <div className="text-gray-700 text-[5px] font-medium mb-0.5">John D. - GDPR Forum</div>
            <div className="text-gray-500 text-[4px]">Looking for case studies</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
          <div className="w-1 h-1 rounded-full bg-red-500 mt-0.5 mr-0.5"></div>
          <div>
            <div className="text-gray-700 text-[5px] font-medium mb-0.5">Sarah M. - AMLD6 Group</div>
            <div className="text-gray-500 text-[4px]">Posted new resource</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
          <div className="w-1 h-1 rounded-full bg-green-500 mt-0.5 mr-0.5"></div>
          <div>
            <div className="text-gray-700 text-[5px] font-medium mb-0.5">Virtual Meetup - Apr 16</div>
            <div className="text-gray-500 text-[4px]">Compliance networking</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
          <div className="w-1 h-1 rounded-full bg-purple-500 mt-0.5 mr-0.5"></div>
          <div>
            <div className="text-gray-700 text-[5px] font-medium mb-0.5">Risk Officers - Discussion</div>
            <div className="text-gray-500 text-[4px]">14 new comments</div>
          </div>
        </div>
      </div>
    </div>
  );
};
