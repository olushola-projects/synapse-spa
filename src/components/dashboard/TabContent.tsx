import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { NexusAgentChat } from '@/components/NexusAgentChat';
import { NexusTestExecutor } from '@/components/testing/NexusTestExecutor';
import { Shield, Clock, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

interface TabContentProps {
  activeTab: 'chat' | 'overview' | 'testing';
  chatRef: React.RefObject<any>;
  complianceData: {
    status: 'pre-validated' | 'needs-review';
    esmaReference: string;
  };
  quickActions: Array<{
    type: string;
    label: string;
    icon: React.ReactNode;
  }>;
  industryMetrics: Array<{
    label: string;
    value: string;
    icon: React.ReactNode;
  }>;
  onQuickAction: (actionType: string) => void;
  isLoadingTab: boolean;
}

export const TabContent = ({ 
  activeTab, 
  chatRef, 
  complianceData, 
  quickActions, 
  industryMetrics, 
  onQuickAction,
  isLoadingTab 
}: TabContentProps) => {
  if (activeTab === 'chat') {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Chat Interface */}
        <div className='lg:col-span-3 nexus-agent-container' data-testid="nexus-chat">
          <Suspense fallback={<EnhancedSkeleton className="h-96 w-full" />}>
            <NexusAgentChat className='shadow-lg' ref={chatRef} />
          </Suspense>
        </div>

        {/* Quick Actions Sidebar */}
        <div className='space-y-4'>
          <Card className='shadow-md'>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4'>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className='flex items-center justify-between py-2 px-4 rounded-md bg-secondary hover:bg-accent text-sm'
                  onClick={() => onQuickAction(action.type)}
                  disabled={isLoadingTab}
                >
                  <span className='flex items-center'>
                    {action.icon}
                    <span className='ml-2'>{action.label}</span>
                  </span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-arrow-right ml-2'
                  >
                    <path d='M5 12h14' />
                    <path d='m12 5 7 7-7 7' />
                  </svg>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Industry Metrics */}
          <Card className='shadow-md'>
            <CardHeader>
              <CardTitle>Industry Metrics</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4'>
              {industryMetrics.map((metric, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <span className='flex items-center'>
                    {metric.icon}
                    <span className='ml-2'>{metric.label}</span>
                  </span>
                  <span className='font-bold'>{metric.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Compliance Overview */}
          <Card className='shadow-md'>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span>Status:</span>
                  <Badge
                    variant={complianceData.status === 'pre-validated' ? 'outline' : 'destructive'}
                  >
                    {complianceData.status}
                  </Badge>
                </div>
                <div>
                  <span>ESMA Reference:</span>
                  <p className='text-sm text-muted-foreground'>{complianceData.esmaReference}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (activeTab === 'overview') {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Compliance Status */}
        <Card className='hover:shadow-lg transition-shadow duration-200'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Shield className='w-5 h-5 mr-2 text-green-600' />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>Overall Score</span>
                <span className='font-bold text-green-600'>94%</span>
              </div>
              <Progress value={94} className='h-2' />
              <div className='text-xs text-gray-500'>
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className='hover:shadow-lg transition-shadow duration-200'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Clock className='w-5 h-5 mr-2 text-blue-600' />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='w-4 h-4 text-green-600' />
                <span className='text-sm'>Document processed</span>
              </div>
              <div className='flex items-center space-x-2'>
                <AlertTriangle className='w-4 h-4 text-yellow-600' />
                <span className='text-sm'>Review pending</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='w-4 h-4 text-green-600' />
                <span className='text-sm'>Report generated</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className='hover:shadow-lg transition-shadow duration-200'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Activity className='w-5 h-5 mr-2 text-orange-600' />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>API Response</span>
                <span className='font-bold text-green-600'>3.2s</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>Uptime</span>
                <span className='font-bold text-green-600'>99.9%</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>Active Users</span>
                <span className='font-bold text-purple-600'>500+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'testing') {
    return (
      <div className='space-y-6'>
        <div className='bg-background border border-border rounded-lg shadow-sm p-6'>
          <h3 className='text-lg font-semibold text-foreground mb-4'>
            User Acceptance Testing Suite
          </h3>
          <p className='text-muted-foreground mb-6'>
            Execute comprehensive testing scenarios to validate SFDR Navigator functionality
            across different regulatory use cases and compliance requirements.
          </p>
          
          <Suspense fallback={<EnhancedSkeleton className="h-32 w-full" />}>
            <NexusTestExecutor />
          </Suspense>
        </div>
      </div>
    );
  }

  return null;
};
