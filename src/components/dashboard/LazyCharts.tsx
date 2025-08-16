import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Simple lazy loading without complex module resolution
const MobileCharts = lazy(() => import('./MobileCharts'));

// Loading fallback component
const ChartSkeleton = ({ title }: { title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className='space-y-4'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-32 w-full' />
        <div className='flex space-x-2'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-16' />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Simple non-lazy exports for now to fix build issues
export {
  RegulatoryFocusChart,
  ComplianceRiskChart,
  ControlStatusChart
} from './charts/DashboardCharts';

export const LazyMobileCharts = () => (
  <Suspense fallback={<ChartSkeleton title='Mobile Analytics' />}>
    <MobileCharts />
  </Suspense>
);

<<<<<<< HEAD
// Monitoring skeleton - removed unused component
=======
>>>>>>> 69d3f4ad25ef33aba3f69bdcd8f1f3d482ccfd57

// Simple imports for monitoring components
export { default as PerformanceMonitoringDashboard } from '../monitoring/PerformanceMonitoringDashboard';
export { default as RealTimeMonitoringDashboard } from '../monitoring/RealTimeMonitoringDashboard';
