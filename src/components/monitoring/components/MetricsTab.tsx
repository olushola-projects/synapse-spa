import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function MetricsTab() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>CPU Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[200px]'>{/* CPU usage chart component */}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Memory Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[200px]'>{/* Memory usage chart component */}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Network Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[200px]'>{/* Network traffic chart component */}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disk Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[200px]'>{/* Disk usage chart component */}</div>
        </CardContent>
      </Card>
    </div>
  );
}
