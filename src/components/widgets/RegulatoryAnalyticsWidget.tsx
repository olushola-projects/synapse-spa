
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, RefreshCw, Download, Share2 } from 'lucide-react';
import { useRegulatoryEvents } from '@/hooks/useRegulatoryEvents';
import { WidgetLoading, WidgetError, WidgetEmpty } from './WidgetStates';

interface RegulatoryAnalyticsWidgetProps {
  title?: string;
  description?: string;
  className?: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

const RegulatoryAnalyticsWidget: React.FC<RegulatoryAnalyticsWidgetProps> = ({
  title = "Regulatory Analytics",
  description = "Comprehensive analysis of regulatory landscape",
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const {
    events,
    stats,
    isLoading,
    error,
    fetchEvents
  } = useRegulatoryEvents({
    autoFetch: true
  });

  // Process data for charts
  const chartData = useMemo(() => {
    if (!stats) return null;

    // Priority distribution for pie chart
    const priorityData = Object.entries(stats.byPriority).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: COLORS[Object.keys(stats.byPriority).indexOf(key)]
    }));

    // Type distribution for bar chart
    const typeData = Object.entries(stats.byType).map(([key, value]) => ({
      name: key.replace('_', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' '),
      count: value
    }));

    // Framework distribution
    const frameworkData = Object.entries(stats.byFramework)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({
        name: key.toUpperCase(),
        count: value
      }));

    // Jurisdiction distribution
    const jurisdictionData = Object.entries(stats.byJurisdiction)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({
        name: key.toUpperCase(),
        count: value
      }));

    // Monthly trend
    const monthlyData = Object.entries(stats.byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        count
      }));

    return {
      priority: priorityData,
      type: typeData,
      framework: frameworkData,
      jurisdiction: jurisdictionData,
      monthly: monthlyData
    };
  }, [stats]);

  const handleRefresh = async () => {
    await fetchEvents();
  };

  const handleExport = () => {
    // Implementation for export functionality
    console.log('Export functionality would be implemented here');
  };

  const handleShare = () => {
    // Implementation for share functionality
    console.log('Share functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <WidgetLoading
        widgetName="Regulatory Analytics"
        prefersReducedMotion={false}
      />
    );
  }

  if (error) {
    return (
      <WidgetError
        widgetName="Regulatory Analytics"
        onRetry={handleRefresh}
      />
    );
  }

  if (!chartData || !stats) {
    return (
      <WidgetEmpty
        widgetName="Regulatory Analytics"
        message="No data available for analysis"
      />
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-900">{stats.total}</div>
            <div className="text-xs text-blue-700">Total Events</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-lg font-bold text-green-900">
              {stats.byStatus.active || 0}
            </div>
            <div className="text-xs text-green-700">Active</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="text-lg font-bold text-amber-900">
              {stats.byStatus.upcoming || 0}
            </div>
            <div className="text-xs text-amber-700">Upcoming</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-lg font-bold text-red-900">
              {(stats.byPriority.critical || 0) + (stats.byPriority.high || 0)}
            </div>
            <div className="text-xs text-red-700">High Priority</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="priority">Priority</TabsTrigger>
            <TabsTrigger value="framework">Framework</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Types Bar Chart */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Events by Type
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData.type}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Jurisdictions Bar Chart */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Events by Jurisdiction
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData.jurisdiction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="priority" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority Distribution Pie Chart */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Priority Distribution
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData.priority}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.priority.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Priority Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Priority Breakdown
                </h4>
                <div className="space-y-3">
                  {chartData.priority.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <Badge variant="outline">{item.value} events</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="framework" className="mt-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Events by Regulatory Framework
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.framework} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="name" fontSize={12} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Monthly Event Trends
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Events"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RegulatoryAnalyticsWidget;
