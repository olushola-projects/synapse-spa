import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { getMetricStatus } from '../utils/metricUtils';
import { MonitoringCardSkeleton } from './MonitoringCardSkeleton';
import { MONITORING_CONSTANTS } from '@/utils/constants';
const RESPONSE_TIME_CONSTANTS = {
  FONT_SIZES: {
    LARGE: '2xl',
    SMALL: 'sm'
  },
  STATUS_COLORS: {
    healthy: 'text-green-500',
    warning: 'text-yellow-500',
    critical: 'text-red-500'
  }
};
function ResponseTimeDisplay({ time, color }) {
  const progressValue = Math.min(
    (time / MONITORING_CONSTANTS.METRICS.API.LATENCY.CRITICAL_MS) * 100,
    100
  );
  return _jsxs('div', {
    className: 'flex items-center space-x-4',
    children: [
      _jsx(Clock, {
        className: `h-${MONITORING_CONSTANTS.ICON.SIZE.MEDIUM_PX} w-${MONITORING_CONSTANTS.ICON.SIZE.MEDIUM_PX} ${color}`
      }),
      _jsxs('div', {
        className: 'flex-1',
        children: [
          _jsxs('div', {
            className: 'flex items-baseline space-x-2',
            children: [
              _jsx('span', {
                className: `text-${RESPONSE_TIME_CONSTANTS.FONT_SIZES.LARGE} font-bold ${color}`,
                children: Math.round(time)
              }),
              _jsx('span', {
                className: `text-${RESPONSE_TIME_CONSTANTS.FONT_SIZES.SMALL} text-muted-foreground`,
                children: 'ms'
              })
            ]
          }),
          _jsx(Progress, { value: progressValue, className: 'mt-2 h-2' })
        ]
      })
    ]
  });
}
export function ResponseTimeCard({ avgResponseTime, isLoading = false }) {
  if (isLoading) {
    return _jsx(MonitoringCardSkeleton, {});
  }
  try {
    const status = getMetricStatus(avgResponseTime, 'api_latency');
    const statusColor = RESPONSE_TIME_CONSTANTS.STATUS_COLORS[status];
    return _jsxs(Card, {
      children: [
        _jsx(CardHeader, { children: _jsx(CardTitle, { children: 'Avg Response Time' }) }),
        _jsx(CardContent, {
          children: _jsx(ResponseTimeDisplay, { time: avgResponseTime, color: statusColor })
        })
      ]
    });
  } catch (error) {
    console.error('Error rendering ResponseTimeCard:', error);
    return _jsxs(Card, {
      children: [
        _jsx(CardHeader, { children: _jsx(CardTitle, { children: 'Avg Response Time' }) }),
        _jsx(CardContent, {
          children: _jsx('div', {
            className: 'text-red-500',
            children: 'Error displaying response time'
          })
        })
      ]
    });
  }
}
