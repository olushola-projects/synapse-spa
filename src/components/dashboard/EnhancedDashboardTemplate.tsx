import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { EnhancedWidget } from '@/components/widgets/EnhancedWidget';
import {
  LayoutDashboard,
  Settings,
  RefreshCw,
  Download,
  Share,
  Filter,
  Eye,
  BarChart3,
  ChevronDown,
  Bell,
  Activity,
  Maximize2,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

interface DashboardMetric {
  id: string;
  title: string;
  value: number | string;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'critical' | 'warning' | 'good' | 'neutral';
  icon?: React.ReactNode;
  info?: string;
}

interface DashboardAlert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  isNew?: boolean;
}

interface DashboardAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface EnhancedDashboardTemplateProps {
  title: string;
  subtitle?: string;
  metrics?: DashboardMetric[];
  alerts?: DashboardAlert[];
  actions?: DashboardAction[];
  children?: React.ReactNode;
  className?: string;
}

export const EnhancedDashboardTemplate: React.FC<EnhancedDashboardTemplateProps> = ({
  title,
  subtitle,
  metrics = [],
  alerts = [],
  actions = [],
  children,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const getStatusColor = (status?: 'critical' | 'warning' | 'good' | 'neutral') => {
    switch (status) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-900';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'good': return 'bg-green-50 border-green-200 text-green-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default: return <ArrowRight className="h-3 w-3 text-gray-400" />;
    }
  };

  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>;
      case 'low': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Low</Badge>;
    }
  };

  return (
    <div className={`space-y-6 p-6 bg-gray-50 min-h-screen ${className}`}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant={viewMode === 'summary' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('summary')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Summary
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('detailed')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Detailed
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics.length > 0 && (
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <LayoutDashboard className="h-6 w-6 text-blue-600" />
                  Key Metrics
                </CardTitle>
                <CardDescription>
                  Real-time performance indicators
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                Live Monitoring
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md ${getStatusColor(metric.status)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">{metric.title}</h4>
                    {metric.info && (
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Info className="h-3 w-3 text-gray-400" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      {metric.change && (
                        <div className="flex items-center text-xs mt-1">
                          {getTrendIcon(metric.trend)}
                          <span className="ml-1">{metric.change}</span>
                        </div>
                      )}
                    </div>
                    {metric.icon && (
                      <div className="text-gray-400">
                        {metric.icon}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <EnhancedWidget title="Recent Alerts">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {alert.severity === 'high' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    {alert.severity === 'medium' && <Clock className="h-5 w-5 text-amber-500" />}
                    {alert.severity === 'low' && <Info className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{alert.title}</h4>
                      <div className="flex items-center gap-2">
                        {alert.isNew && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">New</Badge>
                        )}
                        {getSeverityBadge(alert.severity)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{alert.timestamp}</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2 py-0 text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EnhancedWidget>
      )}

      {/* Quick Actions */}
      {actions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Card key={action.id} className="bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={action.onClick}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Custom Content */}
      {children}
    </div>
  );
};