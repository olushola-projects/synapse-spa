import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Pause,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { dataPipelineService } from '@/services/DataPipelineService';
import type { DataSource, PipelineJob, DataQualityMetrics } from '@/services/DataPipelineService';

interface PipelineMetrics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  runningJobs: number;
  totalEvents: number;
  unprocessedEvents: number;
  criticalEvents: number;
  activeSources: number;
  averageQualityScore: number;
}

const DataPipelineWidget: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [activeJobs, setActiveJobs] = useState<PipelineJob[]>([]);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializePipelineData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(refreshPipelineData, 30000);
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const initializePipelineData = async () => {
    setIsLoading(true);
    try {
      const sources = dataPipelineService.getDataSources();
      const jobs = dataPipelineService.getActiveJobs();
      const pipelineMetrics = dataPipelineService.getPipelineMetrics();
      
      setDataSources(sources);
      setActiveJobs(jobs);
      setMetrics(pipelineMetrics);
    } catch (error) {
      console.error('Failed to initialize pipeline data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPipelineData = async () => {
    try {
      const sources = dataPipelineService.getDataSources();
      const jobs = dataPipelineService.getActiveJobs();
      const pipelineMetrics = dataPipelineService.getPipelineMetrics();
      
      setDataSources(sources);
      setActiveJobs(jobs);
      setMetrics(pipelineMetrics);
    } catch (error) {
      console.error('Failed to refresh pipeline data:', error);
    }
  };

  const handleStartIngestion = async (sourceId: string) => {
    try {
      await dataPipelineService.startIngestion(sourceId);
      await refreshPipelineData();
    } catch (error) {
      console.error('Failed to start ingestion:', error);
    }
  };

  const handleToggleSource = async (sourceId: string) => {
    const source = dataSources.find(s => s.id === sourceId);
    if (source) {
      source.isActive = !source.isActive;
      // In a real implementation, this would update the backend
      setDataSources([...dataSources]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'running': return <Activity className="h-4 w-4 animate-pulse" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const calculateSuccessRate = (jobs: PipelineJob[]) => {
    if (jobs.length === 0) return 0;
    const completed = jobs.filter(j => j.status === 'completed').length;
    return Math.round((completed / jobs.length) * 100);
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Pipeline Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Pipeline Monitor
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPipelineData}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pipeline Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Sources</span>
                <span className="font-semibold">{metrics.activeSources}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Running Jobs</span>
                <span className="font-semibold text-blue-600">{metrics.runningJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-semibold text-green-600">
                  {calculateSuccessRate(activeJobs)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="font-semibold">{metrics.totalEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Critical Events</span>
                <span className="font-semibold text-red-600">{metrics.criticalEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Quality</span>
                <span className={`font-semibold ${getQualityColor(metrics.averageQualityScore)}`}>
                  {Math.round(metrics.averageQualityScore)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Data Quality Score */}
        {metrics && (
          <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Data Quality</span>
              <span className={`text-lg font-bold ${getQualityColor(metrics.averageQualityScore)}`}>
                {Math.round(metrics.averageQualityScore)}%
              </span>
            </div>
            <Progress value={metrics.averageQualityScore} className="h-2" />
          </div>
        )}

        {/* Data Sources */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Data Sources ({dataSources.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {dataSources.map((source) => (
              <div
                key={source.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedSource(source)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{source.name}</span>
                      <Badge 
                        variant={source.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {source.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Type: {source.type}</span>
                      <span>Last sync: {formatLastSync(source.lastSync)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSource(source.id);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      {source.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartIngestion(source.id);
                      }}
                      className="h-8 w-8 p-0"
                      disabled={!source.isActive}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        {activeJobs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Jobs ({activeJobs.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {activeJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    <span className="text-sm font-medium">{job.sourceId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                      {job.status}
                    </Badge>
                    {job.recordsProcessed > 0 && (
                      <span className="text-xs text-gray-500">
                        {job.recordsProcessed} records
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dataSources.length === 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No data sources configured. Add data sources to start monitoring pipeline activity.
            </AlertDescription>
          </Alert>
        )}

        {/* Source Detail Modal */}
        {selectedSource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {selectedSource.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSource(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={selectedSource.isActive ? "default" : "secondary"}>
                        {selectedSource.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <div className="mt-1 text-sm">{selectedSource.type}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data Format</label>
                    <div className="mt-1 text-sm">{selectedSource.dataFormat}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Refresh Interval</label>
                    <div className="mt-1 text-sm">
                      {Math.round(selectedSource.refreshInterval / 60000)} minutes
                    </div>
                  </div>
                </div>
                
                {selectedSource.url && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">URL</label>
                    <div className="mt-1 text-sm font-mono bg-gray-100 p-2 rounded">
                      {selectedSource.url}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Sync</label>
                  <div className="mt-1 text-sm">
                    {selectedSource.lastSync ? 
                      selectedSource.lastSync.toLocaleString() : 
                      'Never synced'
                    }
                  </div>
                </div>
                
                {selectedSource.transformations && selectedSource.transformations.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Transformations</label>
                    <div className="mt-1 space-y-1">
                      {selectedSource.transformations.map((transform, index) => (
                        <div key={index} className="text-sm bg-gray-100 p-2 rounded">
                          <span className="font-medium">{transform.type}</span>
                          {transform.config && (
                            <div className="text-xs text-gray-600 mt-1">
                              {JSON.stringify(transform.config, null, 2)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleToggleSource(selectedSource.id)}
                    variant={selectedSource.isActive ? "destructive" : "default"}
                  >
                    {selectedSource.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    onClick={() => handleStartIngestion(selectedSource.id)}
                    disabled={!selectedSource.isActive}
                    variant="outline"
                  >
                    Start Ingestion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataPipelineWidget;