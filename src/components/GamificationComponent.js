import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Award, Trophy, Medal, Star, Gift, Flag, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
const GamificationComponent = () => {
  return _jsxs('div', {
    className: 'space-y-6',
    children: [
      _jsxs('div', {
        className: 'space-y-2',
        children: [
          _jsx('h3', { className: 'text-lg font-medium', children: 'Gamification Elements' }),
          _jsx('p', {
            className: 'text-sm text-gray-500',
            children:
              'Enhance your GRC experience with these engagement features designed to make compliance more interactive and rewarding.'
          })
        ]
      }),
      _jsxs('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        children: [
          _jsxs('div', {
            className: 'bg-white rounded-lg border p-4 hover:shadow-md transition-shadow',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-3 mb-2',
                children: [
                  _jsx('div', {
                    className:
                      'w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center',
                    children: _jsx(Trophy, { className: 'h-5 w-5 text-amber-600' })
                  }),
                  _jsxs('div', {
                    children: [
                      _jsx('h4', { className: 'font-medium', children: 'Achievement System' }),
                      _jsx('p', {
                        className: 'text-sm text-gray-500',
                        children: 'Earn badges for compliance milestones'
                      })
                    ]
                  })
                ]
              }),
              _jsxs('div', {
                className: 'flex flex-wrap gap-2 mt-3',
                children: [
                  _jsxs('div', {
                    className: 'px-2 py-1 bg-blue-50 rounded-full text-xs flex items-center gap-1',
                    children: [
                      _jsx(Award, { className: 'h-3 w-3' }),
                      _jsx('span', { children: 'GDPR Master' })
                    ]
                  }),
                  _jsxs('div', {
                    className:
                      'px-2 py-1 bg-purple-50 rounded-full text-xs flex items-center gap-1',
                    children: [
                      _jsx(Medal, { className: 'h-3 w-3' }),
                      _jsx('span', { children: 'AML Expert' })
                    ]
                  }),
                  _jsxs('div', {
                    className: 'px-2 py-1 bg-green-50 rounded-full text-xs flex items-center gap-1',
                    children: [
                      _jsx(Star, { className: 'h-3 w-3' }),
                      _jsx('span', { children: 'Risk Pioneer' })
                    ]
                  })
                ]
              })
            ]
          }),
          _jsxs('div', {
            className: 'bg-white rounded-lg border p-4 hover:shadow-md transition-shadow',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-3 mb-2',
                children: [
                  _jsx('div', {
                    className:
                      'w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center',
                    children: _jsx(Target, { className: 'h-5 w-5 text-blue-600' })
                  }),
                  _jsxs('div', {
                    children: [
                      _jsx('h4', { className: 'font-medium', children: 'Challenges' }),
                      _jsx('p', {
                        className: 'text-sm text-gray-500',
                        children: 'Test your knowledge with interactive quizzes'
                      })
                    ]
                  })
                ]
              }),
              _jsxs('div', {
                className: 'mt-2 space-y-2',
                children: [
                  _jsxs('div', {
                    className: 'flex justify-between items-center text-sm',
                    children: [
                      _jsx('span', { children: 'GDPR Challenge' }),
                      _jsx('span', { className: 'text-green-600', children: '8/10 correct' })
                    ]
                  }),
                  _jsx('div', {
                    className: 'h-1.5 w-full bg-gray-100 rounded-full overflow-hidden',
                    children: _jsx('div', {
                      className: 'h-full bg-green-500 rounded-full',
                      style: { width: '80%' }
                    })
                  })
                ]
              })
            ]
          }),
          _jsxs('div', {
            className: 'bg-white rounded-lg border p-4 hover:shadow-md transition-shadow',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-3 mb-2',
                children: [
                  _jsx('div', {
                    className:
                      'w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center',
                    children: _jsx(Flag, { className: 'h-5 w-5 text-purple-600' })
                  }),
                  _jsxs('div', {
                    children: [
                      _jsx('h4', { className: 'font-medium', children: 'Leaderboards' }),
                      _jsx('p', {
                        className: 'text-sm text-gray-500',
                        children: 'Compete with peers in your organization'
                      })
                    ]
                  })
                ]
              }),
              _jsxs('div', {
                className: 'mt-3 space-y-2 text-sm',
                children: [
                  _jsxs('div', {
                    className: 'flex justify-between items-center py-1 border-b',
                    children: [
                      _jsxs('span', {
                        className: 'flex items-center gap-2',
                        children: [
                          _jsx('span', { className: 'font-medium', children: '1.' }),
                          ' Sarah Johnson'
                        ]
                      }),
                      _jsx('span', { children: '560 pts' })
                    ]
                  }),
                  _jsxs('div', {
                    className: 'flex justify-between items-center py-1 border-b',
                    children: [
                      _jsxs('span', {
                        className: 'flex items-center gap-2',
                        children: [
                          _jsx('span', { className: 'font-medium', children: '2.' }),
                          ' Mark Williams'
                        ]
                      }),
                      _jsx('span', { children: '480 pts' })
                    ]
                  }),
                  _jsxs('div', {
                    className: 'flex justify-between items-center py-1 border-b bg-blue-50',
                    children: [
                      _jsxs('span', {
                        className: 'flex items-center gap-2',
                        children: [
                          _jsx('span', { className: 'font-medium', children: '3.' }),
                          ' You'
                        ]
                      }),
                      _jsx('span', { children: '425 pts' })
                    ]
                  })
                ]
              })
            ]
          }),
          _jsxs('div', {
            className: 'bg-white rounded-lg border p-4 hover:shadow-md transition-shadow',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-3 mb-2',
                children: [
                  _jsx('div', {
                    className:
                      'w-10 h-10 rounded-full bg-green-100 flex items-center justify-center',
                    children: _jsx(Zap, { className: 'h-5 w-5 text-green-600' })
                  }),
                  _jsxs('div', {
                    children: [
                      _jsx('h4', {
                        className: 'font-medium',
                        children: 'Create Your Own Challenge'
                      }),
                      _jsx('p', {
                        className: 'text-sm text-gray-500',
                        children: 'Design custom quizzes for your team'
                      })
                    ]
                  })
                ]
              }),
              _jsx('div', {
                className: 'mt-3',
                children: _jsxs('div', {
                  className: 'bg-gray-50 border border-dashed rounded-md p-3 text-center',
                  children: [
                    _jsx('p', {
                      className: 'text-sm',
                      children: 'Create compliance challenges with our intuitive builder'
                    }),
                    _jsx(Button, {
                      variant: 'success',
                      size: 'sm',
                      className: 'mt-2 text-xs',
                      'aria-label': 'Create new compliance challenge',
                      children: 'Create Challenge'
                    })
                  ]
                })
              })
            ]
          })
        ]
      }),
      _jsxs('div', {
        className:
          'bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-3 mb-3',
            children: [
              _jsx(Gift, { className: 'h-5 w-5 text-purple-600' }),
              _jsx('h4', { className: 'font-medium', children: 'Rewards Program' })
            ]
          }),
          _jsx('p', {
            className: 'text-sm mb-3',
            children:
              'Earn points through engagement and redeem them for professional development opportunities, access to premium content, and more.'
          }),
          _jsxs('div', {
            className: 'flex justify-between items-center',
            children: [
              _jsxs('div', {
                children: [
                  _jsx('span', { className: 'text-sm font-medium', children: 'Your Points:' }),
                  _jsx('span', {
                    className: 'ml-2 text-sm bg-purple-100 px-2 py-0.5 rounded-full',
                    children: '425 pts'
                  })
                ]
              }),
              _jsx(Button, {
                variant: 'secondary',
                size: 'sm',
                className: 'text-xs',
                'aria-label': 'View available rewards and redemption options',
                children: 'View Rewards'
              })
            ]
          })
        ]
      })
    ]
  });
};
export default GamificationComponent;
