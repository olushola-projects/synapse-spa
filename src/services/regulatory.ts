
import { RegulatoryEvent, RegulatoryEventFilter, RegulatoryEventStats, RegulatoryJurisdiction, RegulatoryEventType, RegulatoryEventStatus } from '@/types/regulatory';

// Mock data for development
const mockEvents: RegulatoryEvent[] = [
  {
    id: '1',
    title: 'SFDR Article 8 Disclosure Requirements',
    type: 'DEADLINE' as RegulatoryEventType,
    jurisdiction: 'EU' as RegulatoryJurisdiction,
    date: new Date('2024-06-30'),
    effectiveDate: new Date('2024-06-30'),
    priority: 'high',
    status: 'upcoming' as RegulatoryEventStatus,
    description: 'Financial market participants must disclose ESG information for Article 8 products.',
    source: 'European Securities and Markets Authority',
    url: 'https://www.esma.europa.eu/sfdr',
    tags: ['SFDR', 'ESG', 'Disclosure'],
    metadata: {
      article: '8',
      framework: 'SFDR'
    }
  },
  {
    id: '2',
    title: 'CSRD Implementation Deadline',
    type: 'IMPLEMENTATION' as RegulatoryEventType,
    jurisdiction: 'EU' as RegulatoryJurisdiction,
    date: new Date('2024-07-15'),
    effectiveDate: new Date('2024-07-15'),
    priority: 'medium',
    status: 'upcoming' as RegulatoryEventStatus,
    description: 'Corporate Sustainability Reporting Directive comes into effect.',
    source: 'European Commission',
    url: 'https://ec.europa.eu/csrd',
    tags: ['CSRD', 'Sustainability', 'Reporting'],
    metadata: {
      directive: 'CSRD'
    }
  }
];

const mockStats: RegulatoryEventStats = {
  totalEvents: 2,
  upcomingDeadlines: 1,
  activeConsultations: 0,
  recentPublications: 1,
  byJurisdiction: {
    'EU': 2,
    'US': 0,
    'UK': 0,
    'GLOBAL': 0
  },
  byType: {
    'DEADLINE': 1,
    'PUBLICATION': 0,
    'IMPLEMENTATION': 1,
    'CONSULTATION': 0
  },
  byPriority: {
    'critical': 0,
    'high': 1,
    'medium': 1,
    'low': 0
  }
};

export const fetchRegulatoryEvents = async (filter?: RegulatoryEventFilter): Promise<RegulatoryEvent[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredEvents = [...mockEvents];
  
  if (filter) {
    if (filter.jurisdictions?.length) {
      filteredEvents = filteredEvents.filter(event => 
        filter.jurisdictions!.includes(event.jurisdiction)
      );
    }
    
    if (filter.types?.length) {
      filteredEvents = filteredEvents.filter(event => 
        filter.types!.includes(event.type)
      );
    }
    
    if (filter.priorities?.length) {
      filteredEvents = filteredEvents.filter(event => 
        filter.priorities!.includes(event.priority)
      );
    }
    
    if (filter.statuses?.length) {
      filteredEvents = filteredEvents.filter(event => 
        filter.statuses!.includes(event.status)
      );
    }
    
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (filter.dateFrom) {
      filteredEvents = filteredEvents.filter(event => 
        event.date >= filter.dateFrom!
      );
    }
    
    if (filter.dateTo) {
      filteredEvents = filteredEvents.filter(event => 
        event.date <= filter.dateTo!
      );
    }
  }
  
  return filteredEvents;
};

export const fetchRegulatoryEventStats = async (filter?: RegulatoryEventFilter): Promise<RegulatoryEventStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real implementation, this would calculate stats based on the filtered events
  return mockStats;
};

export const fetchRegulatoryEventById = async (id: string): Promise<RegulatoryEvent | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockEvents.find(event => event.id === id) || null;
};

export const createRegulatoryEvent = async (event: Omit<RegulatoryEvent, 'id'>): Promise<RegulatoryEvent> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newEvent: RegulatoryEvent = {
    ...event,
    id: (mockEvents.length + 1).toString()
  };
  
  mockEvents.push(newEvent);
  return newEvent;
};

export const updateRegulatoryEvent = async (id: string, updates: Partial<RegulatoryEvent>): Promise<RegulatoryEvent> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const eventIndex = mockEvents.findIndex(event => event.id === id);
  if (eventIndex === -1) {
    throw new Error('Event not found');
  }
  
  mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...updates };
  return mockEvents[eventIndex];
};

export const deleteRegulatoryEvent = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const eventIndex = mockEvents.findIndex(event => event.id === id);
  if (eventIndex === -1) {
    throw new Error('Event not found');
  }
  
  mockEvents.splice(eventIndex, 1);
};
