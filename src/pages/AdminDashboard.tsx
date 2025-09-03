import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, FileText, Settings, Activity, Users, BarChart3, RefreshCw } from 'lucide-react';
import { VectorStoreManager } from '@/components/admin/VectorStoreManager';
import { adminApiService, type AdminDashboardStats } from '@/services/admin-api';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const dashboardStats = await adminApiService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-4xl font-bold text-foreground'>Admin Dashboard</h1>
            <p className='text-muted-foreground text-lg mt-2'>
              Manage vector stores, users, and system settings
            </p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={loadDashboardStats} variant='outline' disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant='outline' onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Vector Stores</CardTitle>
              <Database className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {loading ? '...' : stats?.vectorStores.total || 0}
              </div>
              <p className='text-xs text-muted-foreground'>Active vector stores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Files</CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {loading ? '...' : stats?.vectorStores.totalFiles || 0}
              </div>
              <p className='text-xs text-muted-foreground'>Files in all stores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>System Status</CardTitle>
              <Activity className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>Online</div>
              <p className='text-xs text-muted-foreground'>All services operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>API Health</CardTitle>
              <BarChart3 className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='flex items-center space-x-2'>
                <Badge variant='default' className='bg-green-100 text-green-800'>
                  Healthy
                </Badge>
              </div>
              <p className='text-xs text-muted-foreground mt-1'>OpenAI API connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue='vector-stores' className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='vector-stores'>Vector Stores</TabsTrigger>
            <TabsTrigger value='users' disabled>
              Users
            </TabsTrigger>
            <TabsTrigger value='analytics' disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value='settings' disabled>
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value='vector-stores' className='space-y-6'>
            <VectorStoreManager />
          </TabsContent>

          <TabsContent value='users' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Users className='h-5 w-5 mr-2' />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-center py-12 text-muted-foreground'>
                  <Users className='h-12 w-12 mx-auto mb-4' />
                  <p>User management features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='analytics' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <BarChart3 className='h-5 w-5 mr-2' />
                  Analytics & Monitoring
                </CardTitle>
                <CardDescription>System performance and usage analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-center py-12 text-muted-foreground'>
                  <BarChart3 className='h-12 w-12 mx-auto mb-4' />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='settings' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Settings className='h-5 w-5 mr-2' />
                  System Settings
                </CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-center py-12 text-muted-foreground'>
                  <Settings className='h-12 w-12 mx-auto mb-4' />
                  <p>Settings panel coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
