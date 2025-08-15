import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getMetricStatus } from '../utils/metricUtils';
import { MonitoringCardSkeleton } from './MonitoringCardSkeleton';

interface ApiSuccessCardProps {
  successRate: number;
  isLoading?: boolean;
}

const STATUS_COLORS = {
  healthy: 'text-green-500',
  warning: 'text-yellow-500',
  critical: 'text-red-500'
} as const;

function SuccessRateDisplay({ rate, color }: { rate: number; color: string }) {
  return (
    <div className='relative w-32 h-32'>
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className={`text-3xl font-bold ${color}`}>{rate.toFixed(1)}%</span>
      </div>
      <Progress
        value={rate}
        className='w-full h-2 bg-gray-200 rounded-full'
        indicatorClassName={color.replace('text-', 'bg-')}
      />
    </div>
  );
}

export function ApiSuccessCard({ successRate, isLoading = false }: ApiSuccessCardProps) {
  if (isLoading) {
    return <MonitoringCardSkeleton />;
  }

  const status = getMetricStatus(successRate, 'api_success');
  const statusColor = STATUS_COLORS[status];

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Success Rate</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center justify-center space-y-4'>
        <SuccessRateDisplay rate={successRate} color={statusColor} />
      </CardContent>
    </Card>
  );
}
