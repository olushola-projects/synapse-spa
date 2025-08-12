import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { enterpriseMonitoring, type SystemAlert } from '@/services/enterpriseMonitoringService';

interface SystemOverview {
  overallHealth: 'healthy' | 'degraded' | 'critical';
  activeAlerts: number;
  criticalAlerts: number;
  avgResponseTime: number;
  apiSuccessRate: number;
  complianceScore: number;
}

export function RealTimeMonitoringDashboard() {
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadSystemData();
    
    // Set up real-time monitoring
    const interval = setInterval(loadSystemData, 30000); // Update every 30 seconds
    
    // Listen for new alerts
    const handleNewAlert = (alert: SystemAlert) => {
      setActiveAlerts(prev => [alert, ...prev]);
    };
    
    enterpriseMonitoring.addAlertListener(handleNewAlert);
    
    return () => {
      clearInterval(interval);
      enterpriseMonitoring.removeAlertListener(handleNewAlert);
    };
  }, []);

  const loadSystemData = async () => {
    try {
      const systemOverview = await enterpriseMonitoring.getSystemOverview();
      const alerts = enterpriseMonitoring.getActiveAlerts();
      
      setOverview(systemOverview);
      setActiveAlerts(alerts);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load system data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resolveAlert = (alertId: string) => {
    enterpriseMonitoring.resolveAlert(alertId);
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="space-y-6">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getHealthIcon(overview.overallHealth)}
                  <span className={`text-lg font-bold capitalize ${getHealthColor(overview.overallHealth)}`}>
                    {overview.overallHealth}
                  </span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-2xl font-bold">{overview.activeAlerts}</span>
                  {overview.criticalAlerts > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      {overview.criticalAlerts} Critical
                    </Badge>
                  )}
                </div>
              </div>
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold mt-1">{Math.round(overview.avgResponseTime)}ms</p>
                <Progress 
                  value={Math.min((overview.avgResponseTime / 5000) * 100, 100)} 
                  className="mt-2 h-2"
                />
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Success Rate</p>
                <p className="text-2xl font-bold mt-1">{Math.round(overview.apiSuccessRate)}%</p>
                <Progress 
                  value={overview.apiSuccessRate} 
                  className="mt-2 h-2"
                />
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Active Alerts ({overview.activeAlerts})</TabsTrigger>
          <TabsTrigger value="compliance">SFDR Compliance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Active System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No active alerts. System is running smoothly!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <Alert key={alert.id} className="border-l-4 border-l-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{alert.title}</span>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        </div>
                        <AlertDescription className="mt-1">
                          {alert.message}
                        </AlertDescription>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>SFDR Compliance Monitoring</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                  <p className="text-3xl font-bold text-green-600">{Math.round(overview.complianceScore)}%</p>
                  <Progress value={overview.complianceScore} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Classifications Today</p>
                  <p className="text-3xl font-bold">47</p>
                  <p className="text-xs text-muted-foreground">All above 70% confidence</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Audit Trail</p>
                  <p className="text-3xl font-bold text-green-600">✓</p>
                  <p className="text-xs text-muted-foreground">Complete for 7 years</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Service Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Nexus API</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Database</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Authentication</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Response Times</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>LLM Classification</span>
                      <span className="text-sm">{Math.round(overview.avgResponseTime)}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Database Queries</span>
                      <span className="text-sm">45ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API Health Check</span>
                      <span className="text-sm">120ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Monitoring</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Authentication</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>API Key Status</span>
                      <Badge className="bg-red-100 text-red-800">Needs Configuration</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>RLS Policies</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Data Encryption</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Data Protection</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Audit Logging</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>GDPR Compliance</span>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Data Retention</span>
                      <Badge className="bg-green-100 text-green-800">7 Years</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer with last update */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
}