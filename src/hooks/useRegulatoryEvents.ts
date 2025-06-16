
import { useState, useEffect, useCallback } from 'react';
import { RegulatoryEvent, RegulatoryEventFilter, RegulatoryEventStats } from '@/types/regulatory';
import { fetchRegulatoryEvents, fetchRegulatoryEventStats } from '@/services/regulatory';

export interface UseRegulatoryEventsOptions {
  filter?: RegulatoryEventFilter;
  autoFetch?: boolean;
}

export interface UseRegulatoryEventsResult {
  events: RegulatoryEvent[];
  stats: RegulatoryEventStats | null;
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  updateFilter: (newFilter: RegulatoryEventFilter) => void;
  filter: RegulatoryEventFilter;
}

export const useRegulatoryEvents = (options: UseRegulatoryEventsOptions = {}): UseRegulatoryEventsResult => {
  const { filter: initialFilter = {}, autoFetch = false } = options;
  
  const [events, setEvents] = useState<RegulatoryEvent[]>([]);
  const [stats, setStats] = useState<RegulatoryEventStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RegulatoryEventFilter>(initialFilter);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [eventsData, statsData] = await Promise.all([
        fetchRegulatoryEvents(filter),
        fetchRegulatoryEventStats(filter)
      ]);
      
      setEvents(eventsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  const updateFilter = useCallback((newFilter: RegulatoryEventFilter) => {
    setFilter(newFilter);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return {
    events,
    stats,
    isLoading,
    error,
    fetchEvents,
    updateFilter,
    filter
  };
};
