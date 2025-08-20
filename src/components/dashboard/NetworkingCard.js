import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Users } from 'lucide-react';
export const NetworkingCard = () => {
  return _jsxs('div', {
    className: 'h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between mb-1',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-1',
            children: [
              _jsx(Users, { size: 8, className: 'text-blue-500' }),
              _jsx('div', {
                className: 'text-gray-800 text-[6px] sm:text-[7px] font-medium',
                children: 'Networking & Forum'
              })
            ]
          }),
          _jsx('div', {
            className: 'text-gray-500 text-[4px] sm:text-[5px]',
            children: 'Active Now'
          })
        ]
      }),
      _jsxs('div', {
        className: 'grid grid-cols-2 gap-1 h-[80%] overflow-y-auto',
        children: [
          _jsxs('div', {
            className: 'bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100',
            children: [
              _jsx('div', { className: 'w-1 h-1 rounded-full bg-yellow-500 mt-0.5 mr-0.5' }),
              _jsxs('div', {
                children: [
                  _jsx('div', {
                    className: 'text-gray-700 text-[5px] font-medium mb-0.5',
                    children: 'John D. - GDPR Forum'
                  }),
                  _jsx('div', {
                    className: 'text-gray-500 text-[4px]',
                    children: 'Looking for case studies'
                  })
                ]
              })
            ]
          }),
          _jsxs('div', {
            className: 'bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100',
            children: [
              _jsx('div', { className: 'w-1 h-1 rounded-full bg-red-500 mt-0.5 mr-0.5' }),
              _jsxs('div', {
                children: [
                  _jsx('div', {
                    className: 'text-gray-700 text-[5px] font-medium mb-0.5',
                    children: 'Sarah M. - AMLD6 Group'
                  }),
                  _jsx('div', {
                    className: 'text-gray-500 text-[4px]',
                    children: 'Posted new resource'
                  })
                ]
              })
            ]
          }),
          _jsxs('div', {
            className: 'bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100',
            children: [
              _jsx('div', { className: 'w-1 h-1 rounded-full bg-green-500 mt-0.5 mr-0.5' }),
              _jsxs('div', {
                children: [
                  _jsx('div', {
                    className: 'text-gray-700 text-[5px] font-medium mb-0.5',
                    children: 'Virtual Meetup - Apr 16'
                  }),
                  _jsx('div', {
                    className: 'text-gray-500 text-[4px]',
                    children: 'Compliance networking'
                  })
                ]
              })
            ]
          }),
          _jsxs('div', {
            className: 'bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100',
            children: [
              _jsx('div', { className: 'w-1 h-1 rounded-full bg-purple-500 mt-0.5 mr-0.5' }),
              _jsxs('div', {
                children: [
                  _jsx('div', {
                    className: 'text-gray-700 text-[5px] font-medium mb-0.5',
                    children: 'Risk Officers - Discussion'
                  }),
                  _jsx('div', {
                    className: 'text-gray-500 text-[4px]',
                    children: '14 new comments'
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
};
