import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

export const SecurityTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <Shield className='h-5 w-5' />
          <span>Security Monitoring</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='font-semibold mb-3'>Authentication</h4>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span>API Key Status</span>
                <Badge className='bg-red-100 text-red-800'>Needs Configuration</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span>RLS Policies</span>
                <Badge className='bg-green-100 text-green-800'>Active</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span>Data Encryption</span>
                <Badge className='bg-green-100 text-green-800'>Enabled</Badge>
              </div>
            </div>
          </div>
          <div>
            <h4 className='font-semibold mb-3'>Data Protection</h4>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span>Audit Logging</span>
                <Badge className='bg-green-100 text-green-800'>Active</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span>GDPR Compliance</span>
                <Badge className='bg-green-100 text-green-800'>Compliant</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span>Data Retention</span>
                <Badge className='bg-green-100 text-green-800'>7 Years</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
