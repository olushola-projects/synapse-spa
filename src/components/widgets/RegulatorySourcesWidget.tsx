
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useRegulatoryEvents } from '@/hooks/useRegulatoryEvents';
import { 
  ExternalLink, 
  Globe, 
  Settings, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface RegulatorySource {
  id: string;
  name: string;
  description: string;
  url: string;
  jurisdiction: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastUpdate: Date;
  eventsCount: number;
  isEnabled: boolean;
}

const mockSources: RegulatorySource[] = [
  {
    id: '1',
    name: 'European Securities and Markets Authority (ESMA)',
    description: 'Official regulatory updates and guidelines from ESMA',
    url: 'https://www.esma.europa.eu',
    jurisdiction: 'EU',
    status: 'active',
    lastUpdate: new Date('2024-01-15'),
    eventsCount: 45,
    isEnabled: true
  },
  {
    id: '2',
    name: 'Securities and Exchange Commission (SEC)',
    description: 'US securities regulations and enforcement actions',
    url: 'https://www.sec.gov',
    jurisdiction: 'US',
    status: 'active',
    lastUpdate: new Date('2024-01-14'),
    eventsCount: 32,
    isEnabled: true
  },
  {
    id: '3',
    name: 'Financial Conduct Authority (FCA)',
    description: 'UK financial services regulation and policy updates',
    url: 'https://www.fca.org.uk',
    jurisdiction: 'UK',
    status: 'maintenance',
    lastUpdate: new Date('2024-01-10'),
    eventsCount: 28,
    isEnabled: false
  }
];

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
  const [sources, setSources] = useState<RegulatorySource[]>(mockSources);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    isLoading,
    error,
    fetchEvents
  } = useRegulatoryEvents({
    autoFetch: false
  });

  const handleToggleSource = (sourceId: string) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, isEnabled: !source.isEnabled }
        : source
    ));
  };

  const handleRefreshSources = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update last refresh times
      setSources(prev => prev.map(source => ({
        ...source,
        lastUpdate: new Date()
      })));
      
      // Refetch events with updated sources
      await fetchEvents();
    } catch (err) {
      console.error('Failed to refresh sources:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status: RegulatorySource['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: RegulatorySource['status']) => {
    const variants = {
      active: 'default',
      maintenance: 'secondary',
      inactive: 'destructive'
    };
    
    return (
      <Badge variant={variants[status] as any} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading regulatory sources: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshSources}
              disabled={isRefreshing}
              className="gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" />
              Configure
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(source.status)}
                    <h3 className="font-medium text-gray-900">{source.name}</h3>
                    {getStatusBadge(source.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600">{source.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Jurisdiction: {source.jurisdiction}</span>
                    <span>Events: {source.eventsCount}</span>
                    <span>Updated: {source.lastUpdate.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit Source
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    checked={source.isEnabled}
                    onCheckedChange={() => handleToggleSource(source.id)}
                    disabled={source.status === 'maintenance'}
                  />
                  <span className="text-xs text-gray-500">
                    {source.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-blue-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900">Data Source Information</h4>
              <p className="text-xs text-blue-700 mt-1">
                Sources are automatically refreshed every 6 hours. You can manually refresh to get the latest updates immediately.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatorySourcesWidget;
