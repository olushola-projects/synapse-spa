import React, { useState } from 'react';
import { EnhancedDashboardLayout } from './EnhancedDashboardLayout';
import { EnhancedDashboardTemplate } from './EnhancedDashboardTemplate';
import { AdvancedDataWidget } from '../widgets/AdvancedDataWidget';
import { EnhancedWidget } from '../widgets/EnhancedWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  LineChart,
  PieChart,
  Shield,
  Target,
  Zap,
  Download,
  Share2,
  RefreshCw,
  Plus,
  ChevronRight
} from 'lucide-react';

interface DemoMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  status: 'positive' | 'warning' | 'negative' | 'neutral';
  trend: 'up' | 'down' | 'flat';
  icon: React.ElementType;
}

interface DemoAlert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'resolved';
  icon: React.ElementType;
}

interface DemoAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  deadline?: string;
  progress?: number;
}

export const IntegratedDashboardExample: React.FC = () => {
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample metrics data
  const metrics: DemoMetric[] = [
    {
      id: 'sfdr-compliance',
      title: 'SFDR Compliance Risk',
      value: 'Low',
      change: -12,
      status: 'positive',
      trend: 'down',
      icon: Shield
    },
    {
      id: 'csrd-readiness',
      title: 'CSRD Readiness Score',
      value: 78,
      change: 5,
      status: 'positive',
      trend: 'up',
      icon: Target
    },
    {
      id: 'taxonomy-alignment',
      title: 'Taxonomy Alignment',
      value: '62%',
      change: 3,
      status: 'warning',
      trend: 'up',
      icon: PieChart
    },
    {
      id: 'tcfd-implementation',
      title: 'TCFD Implementation',
      value: '85%',
      change: 0,
      status: 'neutral',
      trend: 'flat',
      icon: CheckCircle2
    }
  ];

  // Sample alerts data
  const alerts: DemoAlert[] = [
    {
      id: 'alert-1',
      title: 'SFDR RTS Update Required',
      description: 'New regulatory technical standards published for SFDR Article 8 and 9 products.',
      timestamp: '2 hours ago',
      priority: 'high',
      status: 'new',
      icon: AlertCircle
    },
    {
      id: 'alert-2',
      title: 'CSRD Materiality Assessment Gap',
      description: 'Double materiality assessment needs updating to comply with CSRD requirements.',
      timestamp: '1 day ago',
      priority: 'medium',
      status: 'in-progress',
      icon: FileText
    },
    {
      id: 'alert-3',
      title: 'Taxonomy Alignment Improvement',
      description: 'Potential to increase taxonomy alignment by 15% through better data collection.',
      timestamp: '3 days ago',
      priority: 'medium',
      status: 'new',
      icon: ArrowUpRight
    }
  ];

  // Sample actions data
  const actions: DemoAction[] = [
    {
      id: 'action-1',
      title: 'Complete SFDR Disclosure Review',
      description: 'Review and update Article 8 product disclosures for Q2 reporting.',
      icon: FileText,
      deadline: 'Due in 3 days',
      progress: 65
    },
    {
      id: 'action-2',
      title: 'Update Climate Risk Assessment',
      description: 'Incorporate latest IPCC data into climate risk models.',
      icon: Zap,
      deadline: 'Due in 1 week',
      progress: 30
    },
    {
      id: 'action-3',
      title: 'Schedule CSRD Readiness Workshop',
      description: 'Organize cross-functional workshop to assess CSRD implementation status.',
      icon: Clock,
      deadline: 'Due tomorrow',
      progress: 90
    }
  ];

  // Sample chart data for widgets
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'SFDR Compliance',
        data: [65, 72, 68, 75, 82, 88],
        backgroundColor: '#4f46e5'
      },
      {
        label: 'CSRD Readiness',
        data: [45, 52, 58, 60, 65, 78],
        backgroundColor: '#06b6d4'
      }
    ]
  };

  const lineChartData = {
    labels: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023'],
    datasets: [
      {
        label: 'Taxonomy Alignment',
        data: [32, 38, 45, 51, 58, 62],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      },
      {
        label: 'Industry Average',
        data: [30, 35, 40, 42, 45, 48],
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148, 163, 184, 0.1)'
      }
    ]
  };

  const pieChartData = {
    labels: ['Aligned', 'Partially Aligned', 'Not Aligned', 'Not Assessed'],
    datasets: [
      {
        data: [62, 18, 12, 8],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#94a3b8']
      }
    ]
  };

  const tableData = {
    headers: ['Disclosure Item', 'Status', 'Confidence', 'Last Updated'],
    rows: [
      ['SFDR Article 8 Templates', 'Complete', 'High', '2023-06-15'],
      ['CSRD Climate Reporting', 'In Progress', 'Medium', '2023-06-10'],
      ['Taxonomy Eligibility Assessment', 'Complete', 'High', '2023-06-08'],
      ['TCFD Scenario Analysis', 'In Progress', 'Medium', '2023-06-05'],
      ['PAI Indicators', 'Complete', 'High', '2023-06-01']
    ]
  };

  return (
    <EnhancedDashboardLayout
      userName="Alex Morgan"
      userRole="ESG Analyst"
      appName="Synapses"
      appBadge="ESG Pro"
      notificationCount={5}
      messageCount={3}
      showPromoBar={true}
    >
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ESG Command Center</h1>
              <p className="text-gray-500 mt-1">Your centralized dashboard for ESG compliance and reporting</p>
            </div>
            <div className="flex items-center gap-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Widget
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Using EnhancedDashboardTemplate for the main dashboard */}
            <EnhancedDashboardTemplate
              title="Executive Risk Dashboard"
              description="Real-time overview of your key ESG compliance metrics and risks"
              metrics={metrics}
              alerts={alerts}
              actions={actions}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Using AdvancedDataWidget for data visualization */}
                <AdvancedDataWidget
                  title="Compliance Trend Analysis"
                  description="6-month trend of key compliance metrics"
                  data={barChartData}
                  defaultChartType="bar"
                  supportedChartTypes={['bar', 'line']}
                  showControls={true}
                  showLegend={true}
                  actions={[
                    { icon: RefreshCw, label: 'Refresh', onClick: () => console.log('Refreshing data...') },
                    { icon: Download, label: 'Download', onClick: () => console.log('Downloading data...') },
                    { icon: Share2, label: 'Share', onClick: () => console.log('Sharing data...') }
                  ]}
                />
                
                <AdvancedDataWidget
                  title="Taxonomy Alignment Breakdown"
                  description="Current alignment status by category"
                  data={pieChartData}
                  defaultChartType="pie"
                  supportedChartTypes={['pie', 'bar']}
                  showControls={true}
                  showLegend={true}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6">
                <AdvancedDataWidget
                  title="Disclosure Status Tracker"
                  description="Status of required ESG disclosures"
                  data={tableData}
                  defaultChartType="table"
                  supportedChartTypes={['table']}
                  showControls={false}
                />
              </div>
            </EnhancedDashboardTemplate>

            {/* Additional widgets section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Button variant="ghost" size="sm" className="gap-1 text-blue-600">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Using EnhancedWidget for simpler content display */}
                <EnhancedWidget title="Team Collaboration">
                  <div className="space-y-4">
                    {[
                      { user: 'Sarah Kim', action: 'updated SFDR templates', time: '35 min ago', avatar: 'SK' },
                      { user: 'David Chen', action: 'added climate risk data', time: '2 hours ago', avatar: 'DC' },
                      { user: 'Maria Garcia', action: 'completed CSRD review', time: '5 hours ago', avatar: 'MG' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {activity.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </EnhancedWidget>

                <EnhancedWidget title="Upcoming Deadlines">
                  <div className="space-y-4">
                    {[
                      { title: 'SFDR Article 8 Reporting', deadline: 'Jun 30, 2023', urgency: 'high' },
                      { title: 'CSRD Implementation Plan', deadline: 'Jul 15, 2023', urgency: 'medium' },
                      { title: 'Taxonomy Data Collection', deadline: 'Jul 22, 2023', urgency: 'medium' }
                    ].map((deadline, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`h-2 w-2 rounded-full mt-1.5 ${deadline.urgency === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <div>
                          <p className="text-sm font-medium">{deadline.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Due {deadline.deadline}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </EnhancedWidget>

                <EnhancedWidget title="AI Assistant Activity">
                  <div className="space-y-4">
                    {[
                      { title: 'SFDR Product Classification', status: 'Completed', progress: 100 },
                      { title: 'CSRD Materiality Assessment', status: 'In Progress', progress: 65 },
                      { title: 'Climate Risk Analysis', status: 'In Progress', progress: 40 }
                    ].map((task, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">{task.title}</p>
                          <Badge variant={task.progress === 100 ? 'success' : 'outline'} className={task.progress === 100 ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                            {task.status}
                          </Badge>
                        </div>
                        <Progress value={task.progress} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </EnhancedWidget>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Reports content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tasks Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Tasks content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Insights Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Insights content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EnhancedDashboardLayout>
  );
};