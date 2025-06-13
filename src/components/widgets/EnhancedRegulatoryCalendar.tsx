import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, Filter, ChevronDown, ChevronUp, RefreshCw, Calendar as CalendarIcon, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { useRegulatoryEvents, useRegulatoryOptions } from '@/hooks/useRegulatoryEvents';
import {
  RegulatoryEvent,
  RegulatoryEventType,
  RegulatoryEventPriority,
  RegulatoryEventStatus,
  RegulatoryJurisdiction,
  RegulatoryEventFilter
} from '@/types/regulatory';
import { LoadingState, EmptyState, ErrorState } from '@/components/widgets/WidgetStates';

interface EnhancedRegulatoryCalendarProps {
  title?: string;
  description?: string;
  initialFilter?: RegulatoryEventFilter;
  showFilters?: boolean;
  maxEvents?: number;
  onEventClick?: (event: RegulatoryEvent) => void;
  className?: string;
}

export const EnhancedRegulatoryCalendar: React.FC<EnhancedRegulatoryCalendarProps> = ({
  title = "Regulatory Calendar",
  description = "Upcoming regulatory events and deadlines",
  initialFilter = {},
  showFilters = true,
  maxEvents = 5,
  onEventClick,
  className = "",
}) => {
  // State for active tab (upcoming, today, past)
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  
  // State for filters
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  
  // Get regulatory events using the hook
  const {
    events,
    isLoading,
    error,
    fetchEvents,
    updateFilter
  } = useRegulatoryEvents({
    filter: initialFilter,
    autoFetch: true
  });
  
  // Get options for filter dropdowns
  const {
    typeOptions,
    priorityOptions,
    jurisdictionOptions
  } = useRegulatoryOptions();
  
  // Filter events based on active tab
  const filteredEvents = events.filter((event) => {
    const eventDate = event.deadlineDate ? parseISO(event.deadlineDate as string) : 
                      event.effectiveDate ? parseISO(event.effectiveDate as string) : 
                      parseISO(event.publishedDate as string);
    
    switch (activeTab) {
      case 'upcoming':
        return isAfter(eventDate, new Date()) && !isToday(eventDate);
      case 'today':
        return isToday(eventDate);
      case 'past':
        return isBefore(eventDate, new Date()) && !isToday(eventDate);
      default:
        return true;
    }
  }).slice(0, maxEvents);
  
  // Helper functions for UI
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case RegulatoryEventPriority.CRITICAL:
        return 'bg-red-100 text-red-700 border-red-200';
      case RegulatoryEventPriority.HIGH:
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case RegulatoryEventPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case RegulatoryEventType.DEADLINE:
        return <AlertTriangle size={14} className="text-red-600" />;
      case RegulatoryEventType.IMPLEMENTATION:
        return <Calendar size={14} className="text-blue-600" />;
      default:
        return <Clock size={14} className="text-purple-600" />;
    }
  };
  
  const getEventDate = (event: RegulatoryEvent) => {
    if (event.deadlineDate) {
      return { date: event.deadlineDate, label: 'Deadline' };
    } else if (event.effectiveDate) {
      return { date: event.effectiveDate, label: 'Effective' };
    } else {
      return { date: event.publishedDate, label: 'Published' };
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filterKey: keyof RegulatoryEventFilter, value: any) => {
    updateFilter({ [filterKey]: value });
  };
  
  // Handle filter reset
  const handleResetFilters = () => {
    updateFilter(initialFilter);
    setShowFilterPanel(false);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <LoadingState />
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ErrorState 
            message="Failed to load regulatory events" 
            onRetry={fetchEvents} 
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex gap-1">
            {showFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="h-8 w-8 p-0"
              >
                <Filter size={16} />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchEvents}
              className="h-8 w-8 p-0"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {showFilterPanel && (
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Filters</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetFilters}
              className="h-6 text-xs"
            >
              Reset
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <Label htmlFor="type-filter" className="text-xs">Type</Label>
              <Select 
                onValueChange={(value) => handleFilterChange('types', value ? [value as RegulatoryEventType] : undefined)}
                defaultValue={initialFilter.types?.[0]}
              >
                <SelectTrigger id="type-filter" className="h-8 text-xs">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {typeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority-filter" className="text-xs">Priority</Label>
              <Select 
                onValueChange={(value) => handleFilterChange('priorities', value ? [value as RegulatoryEventPriority] : undefined)}
                defaultValue={initialFilter.priorities?.[0]}
              >
                <SelectTrigger id="priority-filter" className="h-8 text-xs">
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All priorities</SelectItem>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-2">
            <Label htmlFor="jurisdiction-filter" className="text-xs">Jurisdiction</Label>
            <Select 
              onValueChange={(value) => handleFilterChange('jurisdictions', value ? [value as RegulatoryJurisdiction] : undefined)}
              defaultValue={initialFilter.jurisdictions?.[0]}
            >
              <SelectTrigger id="jurisdiction-filter" className="h-8 text-xs">
                <SelectValue placeholder="All jurisdictions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All jurisdictions</SelectItem>
                {jurisdictionOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="search-filter" className="text-xs">Search</Label>
            <div className="flex gap-2">
              <Input 
                id="search-filter" 
                placeholder="Search events..." 
                className="h-8 text-xs"
                onChange={(e) => handleFilterChange('searchTerm', e.target.value || undefined)}
                defaultValue={initialFilter.searchTerm || ''}
              />
            </div>
          </div>
        </div>
      )}
      
      <CardContent className="pt-3">
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="m-0">
            {renderEventList(filteredEvents, 'No upcoming events')}
          </TabsContent>
          
          <TabsContent value="today" className="m-0">
            {renderEventList(filteredEvents, 'No events today')}
          </TabsContent>
          
          <TabsContent value="past" className="m-0">
            {renderEventList(filteredEvents, 'No past events')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
  
  // Helper function to render event list
  function renderEventList(events: RegulatoryEvent[], emptyMessage: string) {
    if (events.length === 0) {
      return <EmptyState message={emptyMessage} />
    }
    
    return (
      <div className="space-y-3">
        {events.map((event) => {
          const { date, label } = getEventDate(event);
          
          return (
            <div 
              key={event.id} 
              className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(event.type)}
                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                </div>
                <Badge variant="outline" className={getPriorityColor(event.priority)}>
                  {event.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{label}: {format(parseISO(date as string), 'MMM d, yyyy')}</span>
                <Badge variant="outline" className="text-xs uppercase">
                  {event.jurisdiction}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};

export default EnhancedRegulatoryCalendar;