import React from 'react';
import { MessageSquare, Users, BadgeCheck, Briefcase, GamepadIcon, FileText } from 'lucide-react';

interface SideNavigationProps {
  onAmlDialogOpen: () => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ onAmlDialogOpen }) => {
  return (
    <div className='w-[8%] h-full bg-white rounded-lg border border-gray-200 flex flex-col items-center py-2 gap-3'>
      <div className='w-[60%] h-5 bg-indigo-100 rounded-lg flex items-center justify-center'>
        <div className='w-3 h-3 bg-indigo-500 rounded-md'></div>
      </div>
      <div
        className='w-4 h-4 bg-indigo-500 rounded-md flex items-center justify-center cursor-pointer'
        onClick={onAmlDialogOpen}
      >
        <MessageSquare size={8} className='text-white' />
      </div>
      <div className='w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer'>
        <Users size={8} className='text-indigo-500' />
      </div>
      <div className='w-4 h-4 bg-amber-500 rounded-md flex items-center justify-center cursor-pointer'>
        <BadgeCheck size={8} className='text-white' />
      </div>
      <div className='w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer'>
        <Briefcase size={8} className='text-indigo-500' />
      </div>
      <div className='w-4 h-4 bg-green-500 rounded-md flex items-center justify-center cursor-pointer'>
        <GamepadIcon size={8} className='text-white' />
      </div>
      <div className='w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer'>
        <FileText size={8} className='text-indigo-500' />
      </div>
    </div>
  );
};
