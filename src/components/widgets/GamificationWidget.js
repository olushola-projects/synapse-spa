import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { Widget } from '../dashboard/WidgetGrid';
import { Button } from '@/components/ui/button';
import { Award, Trophy, Medal, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import GamificationComponent from '@/components/GamificationComponent';
const GamificationWidget = ({ onRemove }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Sample badges data
  const badges = [
    { id: 1, name: 'GDPR Expert', icon: Trophy, color: 'amber', progress: 100 },
    { id: 2, name: 'AML Champion', icon: Medal, color: 'blue', progress: 75 },
    { id: 3, name: 'Risk Analyst', icon: Star, color: 'green', progress: 45 },
    { id: 4, name: 'Compliance Leader', icon: Award, color: 'purple', progress: 20 }
  ];
  const getBadgeColor = color => {
    switch (color) {
      case 'amber':
        return 'bg-amber-100 text-amber-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  return _jsxs(_Fragment, {
    children: [
      _jsx(Widget, {
        title: 'Your Achievements',
        onRemove: onRemove,
        children: _jsxs('div', {
          className: 'space-y-4',
          children: [
            _jsxs('div', {
              className: 'flex justify-between items-center mb-4',
              children: [
                _jsx('h3', { className: 'text-sm font-medium', children: 'Your Badges' }),
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  className: 'text-xs',
                  onClick: () => setIsDetailsOpen(true),
                  children: 'View All'
                })
              ]
            }),
            _jsx('div', {
              className: 'grid grid-cols-2 sm:grid-cols-4 gap-3',
              children: badges.map(badge =>
                _jsxs(
                  'div',
                  {
                    className:
                      'flex flex-col items-center justify-center p-3 border rounded-lg hover:border-blue-200 transition-all cursor-pointer',
                    children: [
                      _jsx('div', {
                        className: `w-10 h-10 rounded-full flex items-center justify-center mb-2 ${getBadgeColor(badge.color)}`,
                        children: _jsx(badge.icon, { className: 'h-5 w-5' })
                      }),
                      _jsx('span', {
                        className: 'text-xs font-medium text-center',
                        children: badge.name
                      }),
                      badge.progress < 100 &&
                        _jsx('div', {
                          className: 'w-full mt-2 h-1 bg-gray-100 rounded-full overflow-hidden',
                          children: _jsx('div', {
                            className: 'h-full bg-blue-500 rounded-full',
                            style: { width: `${badge.progress}%` }
                          })
                        })
                    ]
                  },
                  badge.id
                )
              )
            }),
            _jsx('div', {
              className: 'border-t pt-4 mt-4',
              children: _jsxs('div', {
                className: 'flex justify-between items-center',
                children: [
                  _jsxs('div', {
                    children: [
                      _jsx('h4', { className: 'text-sm font-medium', children: 'Current Level' }),
                      _jsxs('div', {
                        className: 'flex items-center',
                        children: [
                          _jsx('span', {
                            className: 'text-xl font-bold text-blue-700 mr-1',
                            children: '3'
                          }),
                          _jsx('span', { className: 'text-xs text-gray-500', children: '/ 10' })
                        ]
                      })
                    ]
                  }),
                  _jsxs('div', {
                    children: [
                      _jsx('h4', { className: 'text-sm font-medium', children: 'Points' }),
                      _jsx('div', { className: 'text-xl font-bold text-blue-700', children: '425' })
                    ]
                  }),
                  _jsx('div', {
                    children: _jsx(Button, {
                      size: 'sm',
                      variant: 'outline',
                      children: 'Claim Rewards'
                    })
                  })
                ]
              })
            })
          ]
        })
      }),
      _jsx(Dialog, {
        open: isDetailsOpen,
        onOpenChange: setIsDetailsOpen,
        children: _jsxs(DialogContent, {
          className: 'sm:max-w-[600px]',
          children: [
            _jsxs(DialogHeader, {
              children: [
                _jsx(DialogTitle, { children: 'Gamification & Achievements' }),
                _jsx(DialogDescription, {
                  children: 'Track your progress, earn badges, and compete with your peers'
                })
              ]
            }),
            _jsx('div', { className: 'py-4', children: _jsx(GamificationComponent, {}) }),
            _jsx(DialogFooter, {
              children: _jsx(Button, { onClick: () => setIsDetailsOpen(false), children: 'Close' })
            })
          ]
        })
      })
    ]
  });
};
export default GamificationWidget;
