import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { type SystemAlert } from '@/services/enterpriseMonitoringService';

interface AlertListProps {
  alerts: SystemAlert[];
  onResolve: (id: string) => void;
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function AlertList({ alerts, onResolve }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        <CheckCircle className='h-12 w-12 mx-auto mb-4 text-green-500' />
        <p>No active alerts. System is running smoothly!</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {alerts.map(alert => (
        <Alert key={alert.id} className='border-l-4 border-l-red-500'>
          <AlertTriangle className='h-4 w-4' />
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <span className='font-semibold'>{alert.title}</span>
                <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
              </div>
              <Button size='sm' variant='outline' onClick={() => onResolve(alert.id)}>
                Resolve
              </Button>
            </div>
            <AlertDescription className='mt-1'>{alert.message}</AlertDescription>
            <p className='text-xs text-muted-foreground mt-2'>
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        </Alert>
      ))}
    </div>
  );
}
