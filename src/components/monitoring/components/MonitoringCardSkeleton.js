import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Card, CardContent } from '@/components/ui/card';
export function MonitoringCardSkeleton() {
  return _jsx(Card, {
    children: _jsx(CardContent, {
      className: 'p-6',
      children: _jsxs('div', {
        className: 'animate-pulse space-y-2',
        children: [
          _jsx('div', { className: 'h-4 bg-gray-200 rounded w-3/4' }),
          _jsx('div', { className: 'h-8 bg-gray-200 rounded' })
        ]
      })
    })
  });
}
