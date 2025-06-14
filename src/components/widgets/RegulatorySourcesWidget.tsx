
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Globe, 
  RefreshCw, 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useRegulatoryEvents } from '@/hooks/useRegulatoryEvents';
import { RegulatorySourceConfig, RegulatoryJurisdiction, RegulatoryFramework } from '@/types/regulatory';
import { WidgetLoading, WidgetError, WidgetEmpty } from './WidgetStates';

interface RegulatorySourcesWidgetProps {
  title?: string;
  description?: string;
  className?: string;
}

const RegulatorySourcesWidget: React.FC<RegulatorySourcesWidgetProps> = ({
  title = "Data Sources",
  description = "Manage regulatory data sources and configurations",
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState('sources');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSource, setNewSource] = useState<Partial<RegulatorySourceConfig>>({
    name: '',
    url: '',
    type: 'api',
    jurisdiction: RegulatoryJurisdiction.EU,
    frameworks: [],
    fetchInterval: 1440,
    enabled: true,
    requiresAuthentication: false
  });

  const {
    sourceConfigs,
    isLoading,
    error,
    fetchEvents
  } = useRegulatoryEvents({
    autoFetch: true
  });

  const handleRefresh = async () => {
    await fetchEvents();
  };

  const handleToggleSource = async (sourceId: string, enabled: boolean) => {
    // Implementation for toggling source status
    console.log(`Toggle source ${sourceId} to ${enabled}`);
  };

  const handleAddSource = async () => {
    // Implementation for adding new source
    console.log('Add new source:', newSource);
    setIsAddDialogOpen(false);
    setNewSource({
      name: '',
      url: '',
      type: 'api',
      jurisdiction: RegulatoryJurisdiction.EU,
      frameworks: [],
      fetchInterval: 1440,
      enabled: true,
      requiresAuthentication: false
    });
  };

  const getSourceStatusColor = (enabled: boolean, lastFetch?: Date) => {
    if (!enabled) return 'bg-gray-100 text-gray-800 border-gray-200';
    // For demo purposes, assume sources are working
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Database className="h-4 w-4" />;
      case 'rss': return <Globe className="h-4 w-4" />;
      case 'webscrape': return <Globe className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <WidgetLoading
        widgetName="Regulatory Sources"
        prefersReducedMotion={false}
      />
    );
  }

  if (error) {
    return (
      <WidgetError
        widgetName="Regulatory Sources"
        onRetry={handleRefresh}
      />
    );
  }

  if (!sourceConfigs || sourceConfigs.length === 0) {
    return (
      <WidgetEmpty
        widgetName="Regulatory Sources"
        message="No data sources configured"
      />
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Source
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Data Source</DialogTitle>
                  <DialogDescription>
                    Configure a new regulatory data source
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-name">Source Name</Label>
                    <Input
                      id="source-name"
                      value={newSource.name}
                      onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                      placeholder="European Securities and Markets Authority"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-url">URL</Label>
                    <Input
                      id="source-url"
                      value={newSource.url}
                      onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                      placeholder="https://api.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-type">Source Type</Label>
                    <Select 
                      value={newSource.type} 
                      onValueChange={(value: 'api' | 'rss' | 'webscrape') => 
                        setNewSource({ ...newSource, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="rss">RSS Feed</SelectItem>
                        <SelectItem value="webscrape">Web Scraping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-jurisdiction">Jurisdiction</Label>
                    <Select 
                      value={newSource.jurisdiction} 
                      onValueChange={(value: RegulatoryJurisdiction) => 
                        setNewSource({ ...newSource, jurisdiction: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(RegulatoryJurisdiction).map(jurisdiction => (
                          <SelectItem key={jurisdiction} value={jurisdiction}>
                            {jurisdiction.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="source-enabled"
                      checked={newSource.enabled}
                      onCheckedChange={(checked) => setNewSource({ ...newSource, enabled: checked })}
                    />
                    <Label htmlFor="source-enabled">Enable source</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSource}>
                    Add Source
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-900">
              {sourceConfigs.filter(s => s.enabled).length}
            </div>
            <div className="text-xs text-blue-700">Active Sources</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-lg font-bold text-green-900">
              {sourceConfigs.filter(s => s.type === 'api').length}
            </div>
            <div className="text-xs text-green-700">API Sources</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="text-lg font-bold text-amber-900">
              {new Set(sourceConfigs.map(s => s.jurisdiction)).size}
            </div>
            <div className="text-xs text-amber-700">Jurisdictions</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="mt-6">
            <div className="space-y-4">
              {sourceConfigs.map((source) => (
                <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getSourceTypeIcon(source.type)}
                        <h3 className="font-semibold text-gray-900">{source.name}</h3>
                        <Badge variant="outline" className={getSourceStatusColor(source.enabled)}>
                          {source.enabled ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{source.url}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Type: {source.type.toUpperCase()}</span>
                        <span>•</span>
                        <span>Jurisdiction: {source.jurisdiction.toUpperCase()}</span>
                        <span>•</span>
                        <span>Interval: {Math.floor(source.fetchInterval / 60)}h</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={source.enabled}
                        onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                      />
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Frameworks:</span>
                      {source.frameworks.slice(0, 3).map((framework) => (
                        <Badge key={framework} variant="outline" className="text-xs">
                          {framework.toUpperCase()}
                        </Badge>
                      ))}
                      {source.frameworks.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{source.frameworks.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Last fetch: 2h ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fetch Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Recent Fetch Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sourceConfigs.slice(0, 3).map((source) => (
                        <div key={source.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">{source.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">2h ago</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">API Rate Limits</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Normal
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Error Rate</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          0.2%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg Response Time</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          1.2s
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RegulatorySourcesWidget;
