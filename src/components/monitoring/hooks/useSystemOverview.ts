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
          status: data.overview.overallHealth,
          uptime: 99.9,
          responseTime: data.overview.avgResponseTime,
          errorRate: 0.1,
          apiSuccessRate: data.overview.apiSuccessRate,
          activeAlerts: [],
          lastUpdated: new Date().toISOString(),
          overallHealth: data.overview.overallHealth,
          avgResponseTime: data.overview.avgResponseTime,
          complianceScore: data.overview.complianceScore,
          criticalAlerts: data.overview.criticalAlerts,
          metrics: {
            cpu: 45,
            memory: 60,
            disk: 30,
            network: 80
          }
        });
        setActiveAlerts(data.alerts);
        setLastUpdate(new Date());
      }
      setIsLoading(false);
    };

    fetchData();
    const overviewInterval = setInterval(fetchData, POLLING_INTERVALS.SYSTEM_OVERVIEW);

    const handleNewAlert = (alert: SystemAlert) => {
      setActiveAlerts(prevAlerts => [alert, ...prevAlerts]);
    };

    enterpriseMonitoring.addAlertListener(handleNewAlert);

    return () => {
      clearInterval(overviewInterval);
      enterpriseMonitoring.removeAlertListener(handleNewAlert);
    };
  }, []);

  const resolveAlert = withErrorHandling(async (alertId: string) => {
    await enterpriseMonitoring.resolveAlert(alertId);
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, 'resolveAlert');

  return {
    overview,
    activeAlerts,
    isLoading,
    lastUpdate,
    resolveAlert
  };
}
