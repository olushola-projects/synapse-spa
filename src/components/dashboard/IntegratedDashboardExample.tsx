
import React, { useState } from 'react';
import { EnhancedDashboardLayout } from './EnhancedDashboardLayout';
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

interface DataPoint {
  label: string;
  value: number;
  [key: string]: any;
}

export const IntegratedDashboardExample: React.FC = () => {
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample chart data for widgets - properly typed for AdvancedDataWidget
  const barChartData: DataPoint[] = [
    { label: 'Jan', value: 65, compliance: 72 },
    { label: 'Feb', value: 72, compliance: 68 },
    { label: 'Mar', value: 68, compliance: 75 },
    { label: 'Apr', value: 75, compliance: 82 },
    { label: 'May', value: 82, compliance: 88 },
    { label: 'Jun', value: 88, compliance: 85 }
  ];

  const lineChartData: DataPoint[] = [
    { label: 'Q1 2022', value: 32, alignment: 32, industry: 30 },
    { label: 'Q2 2022', value: 38, alignment: 38, industry: 35 },
    { label: 'Q3 2022', value: 45, alignment: 45, industry: 40 },
    { label: 'Q4 2022', value: 51, alignment: 51, industry: 42 },
    { label: 'Q1 2023', value: 58, alignment: 58, industry: 45 },
    { label: 'Q2 2023', value: 62, alignment: 62, industry: 48 }
  ];

  const pieChartData: DataPoint[] = [
    { label: 'Aligned', value: 62 },
    { label: 'Partially Aligned', value: 18 },
    { label: 'Not Aligned', value: 12 },
    { label: 'Not Assessed', value: 8 }
  ];

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
            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { title: 'SFDR Compliance', value: 'Low Risk', change: '-12%', icon: Shield, color: 'text-green-600' },
                { title: 'CSRD Readiness', value: '78%', change: '+5%', icon: Target, color: 'text-blue-600' },
                { title: 'Taxonomy Alignment', value: '62%', change: '+3%', icon: PieChart, color: 'text-amber-600' },
                { title: 'TCFD Implementation', value: '85%', change: '0%', icon: CheckCircle2, color: 'text-green-600' }
              ].map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{metric.title}</p>
                        <p className="text-xl font-semibold">{metric.value}</p>
                        <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : metric.change.startsWith('-') ? 'text-green-600' : 'text-gray-500'}`}>
                          {metric.change} from last month
                        </p>
                      </div>
                      <metric.icon className={`h-8 w-8 ${metric.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
                          <Badge variant={task.progress === 100 ? 'default' : 'outline'} className={task.progress === 100 ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
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
