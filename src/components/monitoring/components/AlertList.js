import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
function getSeverityColor(severity) {
  switch (severity) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
export function AlertList({ alerts, onResolve }) {
  if (alerts.length === 0) {
    return _jsxs('div', {
      className: 'text-center py-8 text-muted-foreground',
      children: [
        _jsx(CheckCircle, { className: 'h-12 w-12 mx-auto mb-4 text-green-500' }),
        _jsx('p', { children: 'No active alerts. System is running smoothly!' })
      ]
    });
  }
  return _jsx('div', {
    className: 'space-y-4',
    children: alerts.map(alert =>
      _jsxs(
        Alert,
        {
          className: 'border-l-4 border-l-red-500',
          children: [
            _jsx(AlertTriangle, { className: 'h-4 w-4' }),
            _jsxs('div', {
              className: 'flex-1',
              children: [
                _jsxs('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center space-x-2',
                      children: [
                        _jsx('span', { className: 'font-semibold', children: alert.title }),
                        _jsx(Badge, {
                          className: getSeverityColor(alert.severity),
                          children: alert.severity
                        })
                      ]
                    }),
                    _jsx(Button, {
                      size: 'sm',
                      variant: 'outline',
                      onClick: () => onResolve(alert.id),
                      children: 'Resolve'
                    })
                  ]
                }),
                _jsx(AlertDescription, { className: 'mt-1', children: alert.message }),
                _jsx('p', {
                  className: 'text-xs text-muted-foreground mt-2',
                  children: new Date(alert.timestamp).toLocaleString()
                })
              ]
            })
          ]
        },
        alert.id
      )
    )
  });
}
