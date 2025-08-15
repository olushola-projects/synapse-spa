import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { MONITORING_CONSTANTS } from '@/utils/constants';

interface ActiveAlertsCardProps {
  activeAlerts: number;
  criticalAlerts: number;
}

export function ActiveAlertsCard({ activeAlerts, criticalAlerts }: ActiveAlertsCardProps) {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Active Alerts</p>
            <div className='flex items-center space-x-2 mt-1'>
              <span className='text-2xl font-bold'>{activeAlerts}</span>
              {criticalAlerts > 0 && (
                <Badge className='bg-red-100 text-red-800'>{criticalAlerts} Critical</Badge>
              )}
            </div>
          </div>
          <AlertCircle
            className={`h-${MONITORING_CONSTANTS.ICON.SIZE.LARGE_PX} w-${MONITORING_CONSTANTS.ICON.SIZE.LARGE_PX} text-muted-foreground`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
