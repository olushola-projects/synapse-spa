import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { MonitoringCardSkeleton } from './components/MonitoringCardSkeleton';
import { MetricsTab } from './components/MetricsTab';
import { AlertsTab } from './components/AlertsTab';
import { MonitoringOverview } from './components/MonitoringOverview';
import { ComplianceTab } from './components/ComplianceTab';
import { SecurityTab } from './components/SecurityTab';
import { useSystemOverview } from './hooks/useSystemOverview';

export function RealTimeMonitoringDashboard() {
  const { overview, activeAlerts, isLoading, lastUpdate, resolveAlert } = useSystemOverview();

  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <MonitoringCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  const renderTabs = () => (
    <Tabs defaultValue='alerts' className='space-y-4'>
      <TabsList>
        <TabsTrigger value='alerts'>Active Alerts ({overview.activeAlerts})</TabsTrigger>
        <TabsTrigger value='metrics'>Metrics</TabsTrigger>
        <TabsTrigger value='compliance'>SFDR Compliance</TabsTrigger>
        <TabsTrigger value='security'>Security</TabsTrigger>
      </TabsList>

      <TabsContent value='alerts' className='space-y-4'>
        <AlertsTab alerts={activeAlerts} onResolve={resolveAlert} />
      </TabsContent>

      <TabsContent value='metrics' className='space-y-4'>
        <MetricsTab />
      </TabsContent>

      <TabsContent value='compliance' className='space-y-4'>
        <ComplianceTab overview={overview} />
      </TabsContent>

      <TabsContent value='security' className='space-y-4'>
        <SecurityTab />
      </TabsContent>
    </Tabs>
  );

  return (
    <div className='space-y-6'>
      <MonitoringOverview overview={overview} alerts={activeAlerts} />
      {renderTabs()}
      <div className='text-center text-sm text-muted-foreground'>
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
}

export default RealTimeMonitoringDashboard;
