import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Plus,
  
  
  MessageSquare,
  LineChart,
  Award,
  /* BarChart3, Activity, */ AlertCircle
} from 'lucide-react';
// BarChart3 and Activity imports removed - not used in this component
import type { WidgetType } from '@/components/dashboard/WidgetGrid';
import { WidgetGrid, DashboardContextProvider } from '@/components/dashboard/WidgetGrid';
import RegulationTrendWidget from '@/components/widgets/RegulationTrendWidget';
import ForumPreviewWidget from '@/components/widgets/ForumPreviewWidget';
import GamificationWidget from '@/components/widgets/GamificationWidget';
import RecentQueriesWidget from '@/components/widgets/RecentQueriesWidget';
import ComplianceStatusWidget from '@/components/widgets/ComplianceStatusWidget';
import { toast } from '@/hooks/use-toast';

// Define available widget types
const availableWidgets: WidgetType[] = [
  {
    id: 'regulation-trend',
    name: 'Regulatory Compliance Trends',
    description: 'Track regulatory trends over time',
    icon: LineChart
  },
  {
    id: 'forum-preview',
    name: 'Forum Preview',
    description: 'See the latest discussions from the community',
    icon: MessageSquare
  },
  {
    id: 'gamification',
    name: 'Gamification',
    description: 'View your badges and challenges',
    icon: Award
  },
  {
    id: 'recent-queries',
    name: 'Recent Queries',
    description: 'Your recent queries to Dara',
    icon: MessageSquare
  },
  {
    id: 'compliance-status',
    name: 'Compliance Status',
    description: 'Your compliance status overview',
    icon: AlertCircle
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [widgets, setWidgets] = useState<string[]>([]);

  // Load user widget configuration on mount
  useEffect(() => {
    // In a real app, we would load this from backend
    // For now, we'll start with default widgets or get from localStorage
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    const defaultWidgets = ['regulation-trend', 'forum-preview', 'gamification', 'recent-queries'];

    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      setWidgets(defaultWidgets);
      localStorage.setItem('dashboardWidgets', JSON.stringify(defaultWidgets));
    }
  }, []);

  // Save widget configuration when it changes
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    }
  }, [widgets]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const addWidget = (widgetId: string) => {
    if (!widgets.includes(widgetId)) {
      setWidgets([...widgets, widgetId]);
      toast({
        title: 'Widget added',
        description: 'Your dashboard has been updated'
      });
    }
    setIsAddWidgetOpen(false);
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(widgets.filter(id => id !== widgetId));
    toast({
      title: 'Widget removed',
      description: 'Your dashboard has been updated'
    });
  };

  // Get widget component by type
  const getWidgetComponent = (widgetId: string) => {
    switch (widgetId) {
      case 'regulation-trend':
        return <RegulationTrendWidget onRemove={() => removeWidget(widgetId)} />;
      case 'forum-preview':
        return <ForumPreviewWidget onRemove={() => removeWidget(widgetId)} />;
      case 'gamification':
        return <GamificationWidget onRemove={() => removeWidget(widgetId)} />;
      case 'recent-queries':
        return <RecentQueriesWidget onRemove={() => removeWidget(widgetId)} />;
      case 'compliance-status':
        return <ComplianceStatusWidget onRemove={() => removeWidget(widgetId)} />;
      default:
        return null;
    }
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-full'>
          <div className='animate-pulse'>Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='container py-8'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold'>Welcome, {user.name}</h1>
            <p className='text-gray-500 mt-1'>Here's an overview of your GRC activities</p>
          </div>

          <div className='flex items-center space-x-2 mt-4 md:mt-0'>
            <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
              <DialogTrigger asChild>
                <Button variant='outline' className='flex items-center gap-2'>
                  <Plus size={16} />
                  Add Widget
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Add Widget</DialogTitle>
                  <DialogDescription>Select a widget to add to your dashboard</DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  {availableWidgets.map(widget => (
                    <div
                      key={widget.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${
                        widgets.includes(widget.id) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => {
                        if (!widgets.includes(widget.id)) {
                          addWidget(widget.id);
                        }
                      }}
                    >
                      <div className='mr-4 bg-blue-100 p-2 rounded-full'>
                        <widget.icon className='h-5 w-5 text-blue-600' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-medium'>{widget.name}</h4>
                        <p className='text-sm text-gray-500'>{widget.description}</p>
                      </div>
                      {widgets.includes(widget.id) && (
                        <span className='text-xs text-gray-500 ml-2'>Added</span>
                      )}
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant='outline' onClick={() => setIsAddWidgetOpen(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='compliance'>Compliance</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value='overview'>
            <DashboardContextProvider>
              <WidgetGrid>
                {widgets.map(widgetId => (
                  <div key={widgetId} className='h-full'>
                    {getWidgetComponent(widgetId)}
                  </div>
                ))}
                {widgets.length === 0 && (
                  <div className='col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl'>
                    <p className='text-gray-500 mb-4'>Your dashboard is empty</p>
                    <Button onClick={() => setIsAddWidgetOpen(true)}>Add Widgets</Button>
                  </div>
                )}
              </WidgetGrid>
            </DashboardContextProvider>
          </TabsContent>

          <TabsContent value='compliance'>
            <Card>
              <CardHeader>
                <CardTitle>Compliance Dashboard</CardTitle>
                <CardDescription>
                  Detailed view of your compliance status across jurisdictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col items-center justify-center p-8'>
                  <p className='text-gray-500 mb-4'>Coming soon in later release</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='analytics'>
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Insights and trends for your regulatory compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col items-center justify-center p-8'>
                  <p className='text-gray-500 mb-4'>Coming soon in later release</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
