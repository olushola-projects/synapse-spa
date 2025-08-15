import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield } from 'lucide-react';
import { type SystemOverview } from '@/types/monitoring';

interface ComplianceTabProps {
  overview: SystemOverview;
}

export const ComplianceTab = ({ overview }: ComplianceTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <Shield className='h-5 w-5' />
          <span>SFDR Compliance Monitoring</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>Compliance Score</p>
            <p className='text-3xl font-bold text-green-600'>
              {Math.round(overview.complianceScore)}%
            </p>
            <Progress value={overview.complianceScore} className='mt-2 h-2' />
          </div>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>Classifications Today</p>
            <p className='text-3xl font-bold'>47</p>
            <p className='text-xs text-muted-foreground'>All above 70% confidence</p>
          </div>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>Audit Trail</p>
            <p className='text-3xl font-bold text-green-600'>✓</p>
            <p className='text-xs text-muted-foreground'>Complete for 7 years</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
