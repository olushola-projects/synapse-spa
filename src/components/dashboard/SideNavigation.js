import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { MessageSquare, Users, BadgeCheck, Briefcase, GamepadIcon, FileText } from 'lucide-react';
export const SideNavigation = ({ onAmlDialogOpen }) => {
  return _jsxs('div', {
    className:
      'w-[8%] h-full bg-white rounded-lg border border-gray-200 flex flex-col items-center py-2 gap-3',
    children: [
      _jsx('div', {
        className: 'w-[60%] h-5 bg-indigo-100 rounded-lg flex items-center justify-center',
        children: _jsx('div', { className: 'w-3 h-3 bg-indigo-500 rounded-md' })
      }),
      _jsx('div', {
        className:
          'w-4 h-4 bg-indigo-500 rounded-md flex items-center justify-center cursor-pointer',
        onClick: onAmlDialogOpen,
        children: _jsx(MessageSquare, { size: 8, className: 'text-white' })
      }),
      _jsx('div', {
        className:
          'w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer',
        children: _jsx(Users, { size: 8, className: 'text-indigo-500' })
      }),
      _jsx('div', {
        className:
          'w-4 h-4 bg-amber-500 rounded-md flex items-center justify-center cursor-pointer',
        children: _jsx(BadgeCheck, { size: 8, className: 'text-white' })
      }),
      _jsx('div', {
        className:
          'w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer',
        children: _jsx(Briefcase, { size: 8, className: 'text-indigo-500' })
      }),
      _jsx('div', {
        className:
          'w-4 h-4 bg-green-500 rounded-md flex items-center justify-center cursor-pointer',
        children: _jsx(GamepadIcon, { size: 8, className: 'text-white' })
      }),
      _jsx('div', {
        className:
          'w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer',
        children: _jsx(FileText, { size: 8, className: 'text-indigo-500' })
      })
    ]
  });
};
