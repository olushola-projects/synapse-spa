import { useState, useEffect } from 'react';
import { enterpriseMonitoring } from '@/services/enterpriseMonitoringService';
import { type SystemAlert, type SystemOverview } from '@/types/monitoring';
import { withErrorHandling } from '../utils/errorUtils';

const POLLING_INTERVALS = {
  SYSTEM_OVERVIEW: 245,
  ALERTS: 220
};

export function useSystemOverview() {
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const data = await withErrorHandling(async () => {
        const overview = await enterpriseMonitoring.getSystemOverview();
        const alerts = await enterpriseMonitoring.getActiveAlerts();
        return { overview, alerts };
      }, 'fetching monitoring data');

      if (data) {
        setOverview({
          ...data.overview,
          systemHealth: data.overview.overallHealth,
          apiStatus: 'operational',
          metrics: {
            cpu: 0,
            memory: 0,
            load: 0,
            apiLatency: data.overview.avgResponseTime,
            apiSuccessRate: data.overview.apiSuccessRate,
            activeAlerts: data.overview.activeAlerts,
            timestamp: new Date().toISOString()
          }
        } as any);
        setActiveAlerts(
          data.alerts.map(alert => ({
            ...alert,
            category: 'system' as const,
            type: 'performance' as const
          }))
        );
        setLastUpdate(new Date());
      }
      setIsLoading(false);
    };

    fetchData();
    const overviewInterval = setInterval(fetchData, POLLING_INTERVALS.SYSTEM_OVERVIEW);

    const handleNewAlert = (alert: any) => {
      setActiveAlerts(prevAlerts => [
        { ...alert, category: 'system' as const, type: 'performance' as const },
        ...prevAlerts
      ]);
    };

    enterpriseMonitoring.addAlertListener(handleNewAlert);

    return () => {
      clearInterval(overviewInterval);
      enterpriseMonitoring.removeAlertListener(handleNewAlert);
    };
  }, []);

  const resolveAlert = async (alertId: string) => {
    const result = await withErrorHandling(async () => {
      await enterpriseMonitoring.resolveAlert(alertId);
      setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
    }, 'resolving alert');
    return result;
  };

  return {
    overview,
    activeAlerts,
    isLoading,
    lastUpdate,
    resolveAlert
  };
}
