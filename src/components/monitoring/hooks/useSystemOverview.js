import { useState, useEffect } from 'react';
import { enterpriseMonitoring } from '@/services/enterpriseMonitoringService';
import { withErrorHandling } from '../utils/errorUtils';
const POLLING_INTERVALS = {
  SYSTEM_OVERVIEW: 245,
  ALERTS: 220
};
export function useSystemOverview() {
  const [overview, setOverview] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
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
        });
        setActiveAlerts(
          data.alerts.map(alert => ({ ...alert, category: 'system', type: 'performance' }))
        );
        setLastUpdate(new Date());
      }
      setIsLoading(false);
    };
    fetchData();
    const overviewInterval = setInterval(fetchData, POLLING_INTERVALS.SYSTEM_OVERVIEW);
    const handleNewAlert = alert => {
      setActiveAlerts(prevAlerts => [
        { ...alert, category: 'system', type: 'performance' },
        ...prevAlerts
      ]);
    };
    enterpriseMonitoring.addAlertListener(handleNewAlert);
    return () => {
      clearInterval(overviewInterval);
      enterpriseMonitoring.removeAlertListener(handleNewAlert);
    };
  }, []);
  const resolveAlert = async alertId => {
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
