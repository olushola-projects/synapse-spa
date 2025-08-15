import { Card, CardContent } from '@/components/ui/card';

export function MonitoringCardSkeleton() {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='animate-pulse space-y-2'>
          <div className='h-4 bg-gray-200 rounded w-3/4'></div>
          <div className='h-8 bg-gray-200 rounded'></div>
        </div>
      </CardContent>
    </Card>
  );
}
