import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { getMetricStatus } from '../utils/metricUtils';
import { MonitoringCardSkeleton } from './MonitoringCardSkeleton';
import { MONITORING_CONSTANTS } from '@/utils/constants';

const RESPONSE_TIME_CONSTANTS = {
  FONT_SIZES: {
    LARGE: '2xl',
    SMALL: 'sm'
  },
  STATUS_COLORS: {
    healthy: 'text-green-500',
    warning: 'text-yellow-500',
    critical: 'text-red-500'
  }
} as const;

interface ResponseTimeCardProps {
  avgResponseTime: number;
  isLoading?: boolean;
}

interface ResponseTimeDisplayProps {
  time: number;
  color: string;
}

function ResponseTimeDisplay({ time, color }: ResponseTimeDisplayProps) {
  const progressValue = Math.min((time / 500) * 100, 100); // Using 500ms as critical threshold

  return (
    <div className='flex items-center space-x-4'>
      <Clock
        className={`h-${MONITORING_CONSTANTS.ICON.SIZE.MEDIUM_PX} w-${MONITORING_CONSTANTS.ICON.SIZE.MEDIUM_PX} ${color}`}
      />
      <div className='flex-1'>
        <div className='flex items-baseline space-x-2'>
          <span className={`text-${RESPONSE_TIME_CONSTANTS.FONT_SIZES.LARGE} font-bold ${color}`}>
            {Math.round(time)}
          </span>
          <span
            className={`text-${RESPONSE_TIME_CONSTANTS.FONT_SIZES.SMALL} text-muted-foreground`}
          >
            ms
          </span>
        </div>
        <Progress
          value={progressValue}
          className='mt-2 h-2'
        />
      </div>
    </div>
  );
}

export function ResponseTimeCard({ avgResponseTime, isLoading = false }: ResponseTimeCardProps) {
  if (isLoading) {
    return <MonitoringCardSkeleton />;
  }

  try {
    const status = getMetricStatus(avgResponseTime, 'api_latency');
    const statusColor = RESPONSE_TIME_CONSTANTS.STATUS_COLORS[status];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Avg Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponseTimeDisplay time={avgResponseTime} color={statusColor} />
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error('Error rendering ResponseTimeCard:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avg Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-red-500'>Error displaying response time</div>
        </CardContent>
      </Card>
    );
  }
}
