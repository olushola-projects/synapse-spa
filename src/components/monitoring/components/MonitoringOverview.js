import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { SystemHealthCard } from './SystemHealthCard';
import { ActiveAlertsCard } from './ActiveAlertsCard';
import { ResponseTimeCard } from './ResponseTimeCard';
import { ApiSuccessCard } from './ApiSuccessCard';
export function MonitoringOverview({ overview, alerts }) {
  return _jsxs('div', {
    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
    children: [
      _jsx(SystemHealthCard, { health: overview.overallHealth }),
      _jsx(ActiveAlertsCard, {
        activeAlerts: alerts.length,
        criticalAlerts: alerts.filter(alert => alert.severity === 'critical').length
      }),
      _jsx(ResponseTimeCard, { avgResponseTime: overview.avgResponseTime }),
      _jsx(ApiSuccessCard, { successRate: overview.apiSuccessRate })
    ]
  });
}
