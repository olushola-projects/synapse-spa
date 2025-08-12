import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { apiHealthMonitor } from '@/services/apiHealthMonitor';
import type { SystemHealth } from '@/services/apiHealthMonitor';

interface BackendHealthDashboardProps {
  onAuthIssue?: () => void;
}

export const BackendHealthDashboard: React.FC<BackendHealthDashboardProps> = ({ onAuthIssue }) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Listen for health updates
    const handleHealthUpdate = (health: SystemHealth) => {
      setSystemHealth(health);
      
      // Notify parent of auth issues
      if (onAuthIssue) {
        const hasAuthIssues = health.services.some(
          service => service.error?.includes('Authentication') || service.error?.includes('401')
        );
        if (hasAuthIssues) {
          onAuthIssue();
        }
      }
    };

    apiHealthMonitor.addListener(handleHealthUpdate);
    
    // Get initial health status
    const initialHealth = apiHealthMonitor.getSystemHealth();
    setSystemHealth(initialHealth);

    return () => {
      // Note: In a real implementation, you'd want to remove the listener
      // apiHealthMonitor.removeListener(handleHealthUpdate);
    };
  }, [onAuthIssue]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Trigger a manual health check by restarting monitoring
      apiHealthMonitor.startMonitoring();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!systemHealth) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Backend Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Checking system health...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallHealthScore = Math.round(
    (systemHealth.services.filter(s => s.status === 'healthy').length / 
     systemHealth.services.length) * 100
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Backend Health Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Health Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Health Score</span>
            <span className="text-sm text-muted-foreground">{overallHealthScore}%</span>
          </div>
          <Progress value={overallHealthScore} className="h-2" />
        </div>

        {/* System Status */}
        <div className="flex items-center gap-2">
          {systemHealth.overall === 'healthy' ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
          <Badge 
            variant="outline" 
            className={getStatusColor(systemHealth.overall)}
          >
            {systemHealth.overall.toUpperCase()}
          </Badge>
        </div>

        {/* Service Status Cards */}
        <div className="grid gap-3">
          {systemHealth.services.map((service) => (
            <div key={service.service} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                  <span className="font-medium">{service.service}</span>
                </div>
                <div className="flex items-center gap-2">
                  {service.responseTime && (
                    <span className="text-xs text-muted-foreground">
                      {service.responseTime}ms
                    </span>
                  )}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(service.status)}`}
                  >
                    {service.status}
                  </Badge>
                </div>
              </div>

              {showDetails && (
                <div className="space-y-2 pt-2 border-t">
                  {service.error && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-red-600">Error:</span>
                      <Alert variant="destructive" className="py-2">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription className="text-xs">{service.error}</AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  {service.lastChecked && (
                    <div className="text-xs text-muted-foreground">
                      Last checked: {service.lastChecked.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {systemHealth.recommendations.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Recommendations:</span>
            <div className="space-y-1">
              {systemHealth.recommendations.map((recommendation, index) => (
                <Alert key={index} className="py-2">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription className="text-xs">{recommendation}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Critical Authentication Alert */}
        {systemHealth.services.some(service => 
          service.error?.includes('Authentication') || service.error?.includes('401')
        ) && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>Authentication Issue Detected:</strong> API key may be missing or invalid. 
              Please configure proper authentication credentials.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};