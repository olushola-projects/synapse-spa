
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter, RefreshCw, Calendar as CalendarIcon, AlertTriangle, Clock, FileText } from 'lucide-react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { useRegulatoryEvents } from '@/hooks/useRegulatoryEvents';
import { RegulatoryEvent, RegulatoryEventFilter } from '@/types/regulatory';
import { WidgetLoading, WidgetError, WidgetEmpty } from './WidgetStates';

interface EnhancedRegulatoryCalendarProps {
  title?: string;
  description?: string;
  className?: string;
  showFilters?: boolean;
  maxEvents?: number;
  initialFilter?: RegulatoryEventFilter;
  onEventClick?: (event: RegulatoryEvent) => void;
}

const EnhancedRegulatoryCalendar: React.FC<EnhancedRegulatoryCalendarProps> = ({
  title = "Regulatory Calendar",
  description = "Stay on top of important regulatory deadlines and events",
  className = "",
  showFilters = true,
  maxEvents = 20,
  initialFilter = {},
  onEventClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    events,
    isLoading,
    error,
    fetchEvents
  } = useRegulatoryEvents({
    filter: initialFilter,
    autoFetch: true
  });

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = events as RegulatoryEvent[];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search)
      );
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(event => event.priority === priorityFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Sort by deadline date, then effective date, then published date
    filtered.sort((a, b) => {
      const aDate = a.deadlineDate || a.effectiveDate || a.publishedDate;
      const bDate = b.deadlineDate || b.effectiveDate || b.publishedDate;
      
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      
      const aDateObj = typeof aDate === 'string' ? parseISO(aDate) : aDate;
      const bDateObj = typeof bDate === 'string' ? parseISO(bDate) : bDate;
      
      return aDateObj.getTime() - bDateObj.getTime();
    });

    return filtered.slice(0, maxEvents);
  }, [events, searchTerm, priorityFilter, statusFilter, maxEvents]);

  const handleRefresh = async () => {
    await fetchEvents();
  };

  const handleEventClick = (event: RegulatoryEvent) => {
    onEventClick?.(event);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'past': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'delayed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return null;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
  };

  if (isLoading) {
    return (
      <WidgetLoading
        widgetName="Regulatory Calendar"
        prefersReducedMotion={false}
      />
    );
  }

  if (error) {
    return (
      <WidgetError
        widgetName="Regulatory Calendar"
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {description}
              </CardDescription>
            </div>
          </div>
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

        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="past">Past</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredEvents.length === 0 ? (
          <WidgetEmpty
            widgetName="Regulatory Calendar"
            message="No regulatory events found matching your criteria"
          />
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline" className={getPriorityColor(event.priority)}>
                      {event.priority}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{event.jurisdiction.toUpperCase()}</span>
                      <span>•</span>
                      <span>{event.framework.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {event.deadlineDate && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Due: {formatDate(event.deadlineDate)}</span>
                      </div>
                    )}
                    {event.effectiveDate && !event.deadlineDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>Effective: {formatDate(event.effectiveDate)}</span>
                      </div>
                    )}
                    {!event.deadlineDate && !event.effectiveDate && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span>Published: {formatDate(event.publishedDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedRegulatoryCalendar;
