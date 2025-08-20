import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonitoringCardSkeleton } from './components/MonitoringCardSkeleton';
import { MetricsTab } from './components/MetricsTab';
import { AlertsTab } from './components/AlertsTab';
import { MonitoringOverview } from './components/MonitoringOverview';
import { ComplianceTab } from './components/ComplianceTab';
import { SecurityTab } from './components/SecurityTab';
import { useSystemOverview } from './hooks/useSystemOverview';
export function RealTimeMonitoringDashboard() {
    const { overview, activeAlerts, isLoading, lastUpdate, resolveAlert: resolveAlertFn } = useSystemOverview();
    if (isLoading) {
        return (_jsx("div", { className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-4', children: Array.from({ length: 4 }).map((_, index) => (_jsx(MonitoringCardSkeleton, {}, index))) }));
    }
    if (!overview) {
        return null;
    }
    return (_jsxs("div", { className: 'space-y-6', children: [_jsx(MonitoringOverview, { overview: overview, alerts: activeAlerts }), _jsxs(Tabs, { defaultValue: 'alerts', className: 'space-y-4', children: [_jsxs(TabsList, { children: [_jsxs(TabsTrigger, { value: 'alerts', children: ["Active Alerts (", activeAlerts.length, ")"] }), _jsx(TabsTrigger, { value: 'metrics', children: "Metrics" }), _jsx(TabsTrigger, { value: 'compliance', children: "SFDR Compliance" }), _jsx(TabsTrigger, { value: 'security', children: "Security" })] }), _jsx(TabsContent, { value: 'alerts', className: 'space-y-4', children: _jsx(AlertsTab, { alerts: activeAlerts, onResolve: (id) => { resolveAlertFn(id); } }) }), _jsx(TabsContent, { value: 'metrics', className: 'space-y-4', children: _jsx(MetricsTab, {}) }), _jsx(TabsContent, { value: 'compliance', className: 'space-y-4', children: _jsx(ComplianceTab, { overview: overview }) }), _jsx(TabsContent, { value: 'security', className: 'space-y-4', children: _jsx(SecurityTab, {}) })] }), _jsxs("div", { className: 'text-center text-sm text-muted-foreground', children: ["Last updated: ", lastUpdate.toLocaleTimeString()] })] }));
}
export default RealTimeMonitoringDashboard;
