
import { RegulatoryEvent, RegulatoryEventFilter, RegulatoryEventStats, RegulatoryJurisdiction, RegulatoryEventType, RegulatoryEventStatus, RegulatoryEventPriority } from '@/types/regulatory';

// Mock data for development
const mockEvents: RegulatoryEvent[] = [
  {
    id: '1',
    title: 'SFDR Article 8 Disclosure Requirements',
    type: RegulatoryEventType.DEADLINE,
    jurisdiction: RegulatoryJurisdiction.EU,
    publishedDate: new Date('2024-06-30'),
    effectiveDate: new Date('2024-06-30'),
    priority: RegulatoryEventPriority.HIGH,
    status: RegulatoryEventStatus.UPCOMING,
    description: 'Financial market participants must disclose ESG information for Article 8 products.',
    source: 'European Securities and Markets Authority',
    sourceUrl: 'https://www.esma.europa.eu/sfdr',
    tags: ['SFDR', 'ESG', 'Disclosure'],
    category: 'environmental' as any,
    framework: 'sfdr' as any,
    metadata: {
      article: '8',
      framework: 'SFDR'
    }
  },
  {
    id: '2',
    title: 'CSRD Implementation Deadline',
    type: RegulatoryEventType.IMPLEMENTATION,
    jurisdiction: RegulatoryJurisdiction.EU,
    publishedDate: new Date('2024-07-15'),
    effectiveDate: new Date('2024-07-15'),
    priority: RegulatoryEventPriority.MEDIUM,
    status: RegulatoryEventStatus.UPCOMING,
    description: 'Corporate Sustainability Reporting Directive comes into effect.',
    source: 'European Commission',
    sourceUrl: 'https://ec.europa.eu/csrd',
    tags: ['CSRD', 'Sustainability', 'Reporting'],
    category: 'environmental' as any,
    framework: 'csrd' as any,
    metadata: {
      directive: 'CSRD'
    }
  }
];

const mockStats: RegulatoryEventStats = {
  total: 2,
  byJurisdiction: {
    [RegulatoryJurisdiction.EU]: 2,
    [RegulatoryJurisdiction.US]: 0,
    [RegulatoryJurisdiction.UK]: 0,
    [RegulatoryJurisdiction.GLOBAL]: 0,
    [RegulatoryJurisdiction.CANADA]: 0,
    [RegulatoryJurisdiction.SINGAPORE]: 0,
    [RegulatoryJurisdiction.AUSTRALIA]: 0,
    [RegulatoryJurisdiction.CHINA]: 0,
    [RegulatoryJurisdiction.JAPAN]: 0,
    [RegulatoryJurisdiction.UAE]: 0,
    [RegulatoryJurisdiction.SAUDI_ARABIA]: 0,
    [RegulatoryJurisdiction.OTHER]: 0
  },
  byType: {
    [RegulatoryEventType.DEADLINE]: 1,
    [RegulatoryEventType.PUBLICATION]: 0,
    [RegulatoryEventType.IMPLEMENTATION]: 1,
    [RegulatoryEventType.CONSULTATION]: 0,
    [RegulatoryEventType.ANNOUNCEMENT]: 0,
    [RegulatoryEventType.ENFORCEMENT]: 0,
    [RegulatoryEventType.UPDATE]: 0,
    [RegulatoryEventType.OTHER]: 0
  },
  byPriority: {
    [RegulatoryEventPriority.CRITICAL]: 0,
    [RegulatoryEventPriority.HIGH]: 1,
    [RegulatoryEventPriority.MEDIUM]: 1,
    [RegulatoryEventPriority.LOW]: 0
  },
  byStatus: {
    [RegulatoryEventStatus.UPCOMING]: 2,
    [RegulatoryEventStatus.ACTIVE]: 0,
    [RegulatoryEventStatus.PAST]: 0,
    [RegulatoryEventStatus.DELAYED]: 0,
    [RegulatoryEventStatus.CANCELLED]: 0
  },
  byCategory: {} as any,
  byFramework: {} as any,
  byMonth: {}
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
    
    if (filter.dateRange?.start) {
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.publishedDate) >= filter.dateRange!.start!
      );
    }
    
    if (filter.dateRange?.end) {
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.publishedDate) <= filter.dateRange!.end!
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

// Mock functions for source configurations
export const fetchRegulatorySourceConfigs = async (): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [];
};

export const updateRegulatorySourceConfig = async (id: string, config: any): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return config;
};

export const addRegulatorySourceConfig = async (config: any): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...config, id: Date.now().toString() };
};
