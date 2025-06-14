import { useState, useEffect, useCallback, useMemo } from 'react';
import { regulatoryService } from '@/services/regulatory';
import {
  RegulatoryEvent,
  NormalizedRegulatoryEvent,
  RegulatoryEventFilter,
  RegulatoryEventStats,
  RegulatorySourceConfig,
  RegulatoryEventType,
  RegulatoryEventPriority,
  RegulatoryEventStatus,
  RegulatoryCategory,
  RegulatoryFramework,
  RegulatoryJurisdiction
} from '@/types/regulatory';

interface UseRegulatoryEventsOptions {
  filter?: RegulatoryEventFilter;
  normalized?: boolean;
  autoFetch?: boolean;
}

interface UseRegulatoryEventsResult {
  events: RegulatoryEvent[] | NormalizedRegulatoryEvent[];
  isLoading: boolean;
  error: Error | null;
  stats: RegulatoryEventStats | null;
  sourceConfigs: RegulatorySourceConfig[];
  fetchEvents: () => Promise<void>;
  getEventById: (id: string) => Promise<RegulatoryEvent | NormalizedRegulatoryEvent | null>;
  updateFilter: (newFilter: Partial<RegulatoryEventFilter>) => void;
  addEvent: (eventData: Omit<RegulatoryEvent, 'id'>) => Promise<RegulatoryEvent>;
  updateEvent: (id: string, eventData: Partial<RegulatoryEvent>) => Promise<RegulatoryEvent>;
  deleteEvent: (id: string) => Promise<void>;
}

/**
 * Hook for accessing and managing regulatory events
 */
export function useRegulatoryEvents(options: UseRegulatoryEventsOptions = {}): UseRegulatoryEventsResult {
  const { filter: initialFilter = {}, normalized = false, autoFetch = true } = options;
  
  const [events, setEvents] = useState<RegulatoryEvent[] | NormalizedRegulatoryEvent[]>([]);
  const [filter, setFilter] = useState<RegulatoryEventFilter>(initialFilter);
  const [stats, setStats] = useState<RegulatoryEventStats | null>(null);
  const [sourceConfigs, setSourceConfigs] = useState<RegulatorySourceConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch events based on current filter
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize the service if needed
      await regulatoryService.initialize();
      
      // Fetch events based on normalized preference
      let fetchedEvents;
      if (normalized) {
        fetchedEvents = await regulatoryService.getNormalizedEvents(filter);
      } else {
        fetchedEvents = await regulatoryService.getEvents(filter);
      }
      
      setEvents(fetchedEvents);
      
      // Fetch stats
      const eventStats = await regulatoryService.getEventStats();
      setStats(eventStats);
      
      // Fetch source configs
      const configs = await regulatoryService.getSourceConfigs();
      setSourceConfigs(configs);
    } catch (err) {
      console.error('Error fetching regulatory events:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch regulatory events'));
    } finally {
      setIsLoading(false);
    }
  }, [filter, normalized]);

  // Function to get a single event by ID
  const getEventById = useCallback(async (id: string) => {
    try {
      if (normalized) {
        return await regulatoryService.getNormalizedEventById(id);
      } else {
        return await regulatoryService.getEventById(id);
      }
    } catch (err) {
      console.error(`Error fetching regulatory event with ID ${id}:`, err);
      return null;
    }
  }, [normalized]);

  // Function to update the filter
  const updateFilter = useCallback((newFilter: Partial<RegulatoryEventFilter>) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      ...newFilter,
    }));
  }, []);

  // Function to add a new event
  const addEvent = useCallback(async (eventData: Omit<RegulatoryEvent, 'id'>) => {
    try {
      const newEvent = await regulatoryService.addEvent(eventData);
      // Refresh events after adding
      fetchEvents();
      return newEvent;
    } catch (err) {
      console.error('Error adding regulatory event:', err);
      throw err;
    }
  }, [fetchEvents]);

  // Function to update an event
  const updateEvent = useCallback(async (id: string, eventData: Partial<RegulatoryEvent>) => {
    try {
      const updatedEvent = await regulatoryService.updateEvent(id, eventData);
      // Refresh events after updating
      fetchEvents();
      return updatedEvent;
    } catch (err) {
      console.error(`Error updating regulatory event with ID ${id}:`, err);
      throw err;
    }
  }, [fetchEvents]);

  // Function to delete an event
  const deleteEvent = useCallback(async (id: string) => {
    try {
      await regulatoryService.deleteEvent(id);
      // Refresh events after deleting
      fetchEvents();
    } catch (err) {
      console.error(`Error deleting regulatory event with ID ${id}:`, err);
      throw err;
    }
  }, [fetchEvents]);

  // Fetch events on mount and when filter changes
  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [fetchEvents, autoFetch]);

  return {
    events,
    isLoading,
    error,
    stats,
    sourceConfigs,
    fetchEvents,
    getEventById,
    updateFilter,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}

/**
 * Hook for accessing regulatory event type options
 */
export function useRegulatoryOptions() {
  const typeOptions = useMemo(() => {
    return Object.values(RegulatoryEventType).map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
    }));
  }, []);

  const priorityOptions = useMemo(() => {
    return Object.values(RegulatoryEventPriority).map(priority => ({
      value: priority,
      label: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
    }));
  }, []);

  const statusOptions = useMemo(() => {
    return Object.values(RegulatoryEventStatus).map(status => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    }));
  }, []);

  const categoryOptions = useMemo(() => {
    return Object.values(RegulatoryCategory).map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
    }));
  }, []);

  const frameworkOptions = useMemo(() => {
    return Object.values(RegulatoryFramework).map(framework => ({
      value: framework,
      label: framework.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
    }));
  }, []);

  const jurisdictionOptions = useMemo(() => {
    return Object.values(RegulatoryJurisdiction).map(jurisdiction => ({
      value: jurisdiction,
      label: jurisdiction === 'uk' || jurisdiction === 'us' || jurisdiction === 'eu' || jurisdiction === 'uae'
        ? jurisdiction.toUpperCase()
        : jurisdiction.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
    }));
  }, []);

  return {
    typeOptions,
    priorityOptions,
    statusOptions,
    categoryOptions,
    frameworkOptions,
    jurisdictionOptions,
  };
}
