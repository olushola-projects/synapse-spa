import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
export function MetricsTab() {
  return _jsxs('div', {
    className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    children: [
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, { children: _jsx(CardTitle, { children: 'CPU Usage' }) }),
          _jsx(CardContent, { children: _jsx('div', { className: 'h-[200px]' }) })
        ]
      }),
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, { children: _jsx(CardTitle, { children: 'Memory Usage' }) }),
          _jsx(CardContent, { children: _jsx('div', { className: 'h-[200px]' }) })
        ]
      }),
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, { children: _jsx(CardTitle, { children: 'Network Traffic' }) }),
          _jsx(CardContent, { children: _jsx('div', { className: 'h-[200px]' }) })
        ]
      }),
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, { children: _jsx(CardTitle, { children: 'Disk Usage' }) }),
          _jsx(CardContent, { children: _jsx('div', { className: 'h-[200px]' }) })
        ]
      })
    ]
  });
}
