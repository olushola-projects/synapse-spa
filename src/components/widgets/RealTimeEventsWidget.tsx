import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Clock,
  Filter,
  Play,
  Pause,
  Eye,
  ExternalLink,
  Bell,
  CheckCircle
} from 'lucide-react';
import { dataPipelineService } from '@/services/DataPipelineService';
import type { DataEvent } from '@/services/DataPipelineService';

interface EventFilter {
  type?: string;
  priority?: string;
  processed?: boolean;
  timeRange?: '1h' | '6h' | '24h' | 'all';
}

const RealTimeEventsWidget: React.FC = () => {
  const [events, setEvents] = useState<DataEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<DataEvent[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<EventFilter>({ timeRange: '24h' });
  const [selectedEvent, setSelectedEvent] = useState<DataEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newEventCount, setNewEventCount] = useState(0);

  useEffect(() => {
    initializeEvents();
    
    // Set up real-time event listeners
    dataPipelineService.addEventListener('regulatory_update', handleNewEvent);
    dataPipelineService.addEventListener('compliance_alert', handleNewEvent);
    dataPipelineService.addEventListener('esg_data', handleNewEvent);
    dataPipelineService.addEventListener('market_data', handleNewEvent);
    
    // Auto-refresh events if live mode is enabled
    const interval = setInterval(() => {
      if (isLive) {
        refreshEvents();
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [isLive]);

  useEffect(() => {
    applyFilters();
  }, [events, filter]);

  const initializeEvents = async () => {
    setIsLoading(true);
    try {
      const recentEvents = dataPipelineService.getRecentEvents(100);
      setEvents(recentEvents);
    } catch (error) {
      console.error('Failed to initialize events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshEvents = async () => {
    try {
      const recentEvents = dataPipelineService.getRecentEvents(100);
      const newEvents = recentEvents.filter(event => 
        !events.some(existingEvent => existingEvent.id === event.id)
      );
      
      if (newEvents.length > 0) {
        setEvents(recentEvents);
        setNewEventCount(prev => prev + newEvents.length);
      }
    } catch (error) {
      console.error('Failed to refresh events:', error);
    }
  };

  const handleNewEvent = (event: DataEvent) => {
    if (isLive) {
      setEvents(prev => [event, ...prev].slice(0, 100));
      setNewEventCount(prev => prev + 1);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];
    
    // Filter by type
    if (filter.type && filter.type !== 'all') {
      filtered = filtered.filter(event => event.type === filter.type);
    }
    
    // Filter by priority
    if (filter.priority && filter.priority !== 'all') {
      filtered = filtered.filter(event => event.priority === filter.priority);
    }
    
    // Filter by processed status
    if (filter.processed !== undefined) {
      filtered = filtered.filter(event => event.processed === filter.processed);
    }
    
    // Filter by time range
    if (filter.timeRange && filter.timeRange !== 'all') {
      const now = new Date();
      const timeRangeMs = {
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000
      }[filter.timeRange];
      
      const cutoffTime = new Date(now.getTime() - timeRangeMs);
      filtered = filtered.filter(event => event.timestamp >= cutoffTime);
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setFilteredEvents(filtered);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'regulatory_update': return 'bg-blue-100 text-blue-800';
      case 'compliance_alert': return 'bg-red-100 text-red-800';
      case 'esg_data': return 'bg-green-100 text-green-800';
      case 'market_data': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'regulatory_update': return <Shield className="h-4 w-4" />;
      case 'compliance_alert': return <AlertTriangle className="h-4 w-4" />;
      case 'esg_data': return <TrendingUp className="h-4 w-4" />;
      case 'market_data': return <TrendingUp className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getEventSummary = (event: DataEvent) => {
    if (event.data.title) return event.data.title;
    if (event.data.description) return event.data.description.substring(0, 100) + '...';
    if (event.data.alert_type) return `${event.data.alert_type} Alert`;
    return `${event.type.replace('_', ' ')} event`;
  };

  const markAsRead = (eventId: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, processed: true } : event
      )
    );
  };

  const clearNewEventCount = () => {
    setNewEventCount(0);
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Real-time Events
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
            <Zap className="h-5 w-5" />
            Real-time Events
            {newEventCount > 0 && (
              <Badge 
                variant="destructive" 
                className="animate-pulse cursor-pointer"
                onClick={clearNewEventCount}
              >
                {newEventCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={`h-8 ${isLive ? 'text-green-600' : 'text-gray-400'}`}
            >
              {isLive ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
          <select
            value={filter.type || 'all'}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value === 'all' ? undefined : e.target.value }))}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="all">All Types</option>
            <option value="regulatory_update">Regulatory</option>
            <option value="compliance_alert">Compliance</option>
            <option value="esg_data">ESG Data</option>
            <option value="market_data">Market Data</option>
          </select>
          
          <select
            value={filter.priority || 'all'}
            onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value === 'all' ? undefined : e.target.value }))}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={filter.timeRange || 'all'}
            onChange={(e) => setFilter(prev => ({ ...prev, timeRange: e.target.value === 'all' ? undefined : e.target.value as any }))}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="all">All Time</option>
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
          </select>
          
          <button
            onClick={() => setFilter(prev => ({ ...prev, processed: prev.processed === false ? undefined : false }))}
            className={`text-xs border rounded px-2 py-1 ${
              filter.processed === false ? 'bg-blue-100 text-blue-800' : 'bg-white'
            }`}
          >
            Unread Only
          </button>
        </div>

        {/* Event Statistics */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">
              {filteredEvents.filter(e => e.type === 'regulatory_update').length}
            </div>
            <div className="text-xs text-gray-600">Regulatory</div>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <div className="text-lg font-bold text-red-600">
              {filteredEvents.filter(e => e.type === 'compliance_alert').length}
            </div>
            <div className="text-xs text-gray-600">Compliance</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">
              {filteredEvents.filter(e => e.type === 'esg_data').length}
            </div>
            <div className="text-xs text-gray-600">ESG</div>
          </div>
          <div className="p-2 bg-orange-50 rounded">
            <div className="text-lg font-bold text-orange-600">
              {filteredEvents.filter(e => e.priority === 'critical' || e.priority === 'high').length}
            </div>
            <div className="text-xs text-gray-600">High Priority</div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                !event.processed ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <div className="mt-1">
                    {getTypeIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${getTypeColor(event.type)}`}>
                        {event.type.replace('_', ' ')}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </Badge>
                      {!event.processed && (
                        <Badge variant="outline" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium line-clamp-1">
                      {getEventSummary(event)}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(event.timestamp)}
                      </span>
                      <span>Source: {event.sourceId}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {!event.processed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(event.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No events match the current filters. Try adjusting your filter criteria or check if the data pipeline is active.
            </AlertDescription>
          </Alert>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {getTypeIcon(selectedEvent.type)}
                  Event Details
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(selectedEvent.type)}>
                    {selectedEvent.type.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(selectedEvent.priority)}>
                    {selectedEvent.priority} Priority
                  </Badge>
                  <Badge variant={selectedEvent.processed ? "default" : "outline"}>
                    {selectedEvent.processed ? 'Processed' : 'Unprocessed'}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-gray-700">{getEventSummary(selectedEvent)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Timestamp</h4>
                    <p className="text-sm text-gray-600">
                      {selectedEvent.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Source</h4>
                    <p className="text-sm text-gray-600">{selectedEvent.sourceId}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Raw Data</h4>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                    {JSON.stringify(selectedEvent.data, null, 2)}
                  </pre>
                </div>
                
                <div className="flex gap-2 pt-4">
                  {!selectedEvent.processed && (
                    <Button
                      onClick={() => {
                        markAsRead(selectedEvent.id);
                        setSelectedEvent(null);
                      }}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {selectedEvent.data.url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedEvent.data.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Source
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeEventsWidget;