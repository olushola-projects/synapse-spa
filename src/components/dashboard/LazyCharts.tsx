import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Lazy load chart components to reduce bundle size
const DashboardCharts = lazy(() => import('./charts/DashboardCharts'));
const RegulatoryFocusChart = lazy(() => import('./charts/RegulatoryFocusChart'));
const MobileCharts = lazy(() => import('./MobileCharts'));

// Loading fallback component
const ChartSkeleton = ({ title }: { title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Lazy wrapped components with loading states
export const LazyDashboardCharts = () => (
  <Suspense fallback={<ChartSkeleton title="Performance Analytics" />}>
    <DashboardCharts />
  </Suspense>
);

export const LazyRegulatoryFocusChart = () => (
  <Suspense fallback={<ChartSkeleton title="Regulatory Focus" />}>
    <RegulatoryFocusChart />
  </Suspense>
);

export const LazyMobileCharts = () => (
  <Suspense fallback={<ChartSkeleton title="Mobile Analytics" />}>
    <MobileCharts />
  </Suspense>
);

// Export lazy-loaded monitoring components
export const LazyPerformanceMonitoring = lazy(() => import('../monitoring/PerformanceMonitoringDashboard'));
export const LazyRealTimeMonitoring = lazy(() => import('../monitoring/RealTimeMonitoringDashboard'));

// Monitoring skeleton
const MonitoringSkeleton = ({ title }: { title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </CardContent>
  </Card>
);

export const LazyPerformanceMonitoringWrapper = () => (
  <Suspense fallback={<MonitoringSkeleton title="Performance Monitoring" />}>
    <LazyPerformanceMonitoring />
  </Suspense>
);

export const LazyRealTimeMonitoringWrapper = () => (
  <Suspense fallback={<MonitoringSkeleton title="Real-time Monitoring" />}>
    <LazyRealTimeMonitoring />
  </Suspense>
);
