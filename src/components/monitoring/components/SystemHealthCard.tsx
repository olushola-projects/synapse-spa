import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { MONITORING_CONSTANTS } from '@/utils/constants';

interface SystemHealthCardProps {
  health: 'healthy' | 'degraded' | 'critical';
}

export function SystemHealthCard({ health }: SystemHealthCardProps) {
  const iconProps = {
    icon: health === 'healthy' ? 'CheckCircle' : health === 'degraded' ? 'AlertTriangle' : 'XCircle',
    color: health === 'healthy' ? 'text-green-500' : health === 'degraded' ? 'text-yellow-500' : 'text-red-500',
    className: health === 'healthy' ? 'text-green-500' : health === 'degraded' ? 'text-yellow-500' : 'text-red-500'
  };
  const Icon =
    health === 'healthy'
      ? CheckCircle
      : health === 'degraded'
        ? AlertTriangle
        : health === 'critical'
          ? XCircle
          : Activity;

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>System Health</p>
            <div className='flex items-center space-x-2 mt-1'>
              <Icon {...iconProps} />
              <span className={`text-lg font-bold capitalize ${iconProps.className}`}>
                {health}
              </span>
            </div>
          </div>
          <Shield
            className={`h-${MONITORING_CONSTANTS.ICON.SIZE.LARGE_PX} w-${MONITORING_CONSTANTS.ICON.SIZE.LARGE_PX} text-muted-foreground`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
