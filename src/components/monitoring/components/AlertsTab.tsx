import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { MONITORING_CONSTANTS } from '@/utils/constants';
import { type SystemAlert } from '@/types/monitoring';
import { AlertList } from './AlertList';

interface AlertsTabProps {
  alerts: SystemAlert[];
  onResolve: (id: string) => void;
}

export function AlertsTab({ alerts, onResolve }: AlertsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <AlertCircle
            className={`h-${MONITORING_CONSTANTS.ICON.SIZE.MEDIUM_PX} w-${MONITORING_CONSTANTS.ICON.SIZE.MEDIUM_PX}`}
          />
          Active Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AlertList alerts={alerts} onResolve={onResolve} />
      </CardContent>
    </Card>
  );
}
