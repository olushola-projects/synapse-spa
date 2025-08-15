import { type SystemAlert, type SystemOverview } from '@/types/monitoring';
import { SystemHealthCard } from './SystemHealthCard';
import { ActiveAlertsCard } from './ActiveAlertsCard';
import { ResponseTimeCard } from './ResponseTimeCard';
import { ApiSuccessCard } from './ApiSuccessCard';

interface MonitoringOverviewProps {
  overview: SystemOverview;
  alerts: SystemAlert[];
}

export function MonitoringOverview({ overview, alerts }: MonitoringOverviewProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <SystemHealthCard health={overview.overallHealth} />
      <ActiveAlertsCard
        activeAlerts={alerts.length}
        criticalAlerts={alerts.filter(alert => alert.severity === 'critical').length}
      />
      <ResponseTimeCard avgResponseTime={overview.avgResponseTime} />
      <ApiSuccessCard apiSuccessRate={overview.apiSuccessRate} />
    </div>
  );
}
