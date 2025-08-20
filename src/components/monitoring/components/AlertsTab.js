import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { MONITORING_CONSTANTS } from '@/utils/constants';
import { AlertList } from './AlertList';
export function AlertsTab({ alerts, onResolve }) {
  return _jsxs(Card, {
    children: [
      _jsx(CardHeader, {
        children: _jsxs(CardTitle, {
          className: 'flex items-center gap-2',
          children: [
            _jsx(AlertCircle, {
              className: `h-${MONITORING_CONSTANTS.ICON.SIZE.MEDIUM_PX} w-${MONITORING_CONSTANTS.ICON.SIZE.MEDIUM_PX}`
            }),
            'Active Alerts'
          ]
        })
      }),
      _jsx(CardContent, { children: _jsx(AlertList, { alerts: alerts, onResolve: onResolve }) })
    ]
  });
}
