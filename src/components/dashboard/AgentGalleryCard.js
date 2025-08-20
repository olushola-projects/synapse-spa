import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
export const AgentGalleryCard = () => {
  return _jsxs('div', {
    className: 'flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between mb-1',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-1',
            children: [
              _jsx(Bot, { size: 8, className: 'text-blue-500' }),
              _jsx('div', {
                className: 'text-gray-800 text-[6px] sm:text-[7px] font-medium',
                children: 'Agent Gallery'
              })
            ]
          }),
          _jsx('div', {
            className: 'text-blue-500 text-[4px] sm:text-[5px] px-1 py-0.5 bg-blue-50 rounded-full',
            children: 'Featured'
          })
        ]
      }),
      _jsxs('div', {
        className: 'bg-gray-50 rounded-md p-1 border border-gray-100',
        children: [
          _jsx('h3', {
            className: 'text-gray-800 text-[5px] sm:text-[6px] font-bold mb-0.5',
            children: 'Explore intelligent GRC agents'
          }),
          _jsx('p', {
            className: 'text-gray-600 text-[4px] sm:text-[5px] leading-tight',
            children:
              'Access specialized compliance AI agents for various regulatory frameworks including AML, ESG, MiFID II, DORA, and Privacy. Get instant guidance and analysis tailored to your specific regulatory needs.'
          }),
          _jsx('div', {
            className: 'mt-1 flex flex-wrap gap-1',
            children: ['AML', 'ESG', 'MiFID II', 'DORA', 'Privacy'].map((agent, index) =>
              _jsxs(
                'div',
                {
                  className:
                    'bg-white px-1 py-0.5 rounded-full border border-gray-200 text-[3px] sm:text-[4px] font-medium text-gray-700 flex items-center gap-0.5',
                  children: [
                    _jsx('div', {
                      className: `w-1 h-1 rounded-full ${['bg-red-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-amber-400'][index]}`
                    }),
                    agent
                  ]
                },
                index
              )
            )
          }),
          _jsxs('div', {
            className: 'mt-1 flex items-center gap-1',
            children: [
              _jsx(Button, {
                variant: 'outline',
                size: 'sm',
                className:
                  'h-3 text-[4px] bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 px-1 py-0',
                children: 'Explore Agents'
              }),
              _jsx(Button, {
                variant: 'outline',
                size: 'sm',
                className:
                  'h-3 text-[4px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200 px-1 py-0',
                children: 'Create Agent'
              })
            ]
          })
        ]
      })
    ]
  });
};
