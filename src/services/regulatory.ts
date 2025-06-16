// FIRE SCHEMA VALIDATION SECTION
import entity from '@/schemas/fire/entity.json';
import security from '@/schemas/fire/security.json';
import customer from '@/schemas/fire/customer.json';
import account from '@/schemas/fire/account.json';
import adjustment from '@/schemas/fire/adjustment.json';
import agreement from '@/schemas/fire/agreement.json';
import batch from '@/schemas/fire/batch.json';
import collateral from '@/schemas/fire/collateral.json';
import common from '@/schemas/fire/common.json';
import curve from '@/schemas/fire/curve.json';
import derivative from '@/schemas/fire/derivative.json';
import exchangeRate from '@/schemas/fire/exchange_rate.json';
import guarantor from '@/schemas/fire/guarantor.json';
import issuer from '@/schemas/fire/issuer.json';
import loan from '@/schemas/fire/loan.json';
import loanCashFlow from '@/schemas/fire/loan_cash_flow.json';
import loanTransaction from '@/schemas/fire/loan_transaction.json';
import riskRating from '@/schemas/fire/risk_rating.json';
const FireSchemas = {
  entity,
  security,
  customer,
  account,
  adjustment,
  agreement,
  batch,
  collateral,
  common,
  curve,
  derivative,
  exchangeRate,
  guarantor,
  issuer,
  loan,
  loanCashFlow,
  loanTransaction,
  riskRating
};
export type FireSchema = keyof typeof FireSchemas;
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({
  allErrors: true,
  strict: false,
  strictSchema: false,
  strictTypes: false,
  strictRequired: false
});
addFormats(ajv);
const schemaUrlMap: Record<string, string> = {
  entity: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/entity.json',
  security: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/security.json',
  customer: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/customer.json',
  account: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/account.json',
  adjustment: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/adjustment.json',
  agreement: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/agreement.json',
  batch: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/batch.json',
  collateral: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/collateral.json',
  common: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/common.json',
  curve: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/curve.json',
  derivative: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/derivative.json',
  exchangeRate: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/exchange_rate.json',
  guarantor: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/guarantor.json',
  issuer: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/issuer.json',
  loan: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/loan.json',
  loanCashFlow: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/loan_cash_flow.json',
  loanTransaction: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/loan_transaction.json',
  riskRating: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/risk_rating.json',
};
for (const [name, schema] of Object.entries(FireSchemas)) {
  const url = schemaUrlMap[name];
  if (url) {
    const schemaWithId = { ...schema, $id: url };
    ajv.addSchema(schemaWithId, url);
  }
}
for (const [name, schema] of Object.entries(FireSchemas)) {
  const schemaStr = JSON.stringify(schema).replace(
    /https:\/\/raw\.githubusercontent\.com\/SuadeLabs\/fire\/master\/schemas\//g,
    '#'
  );
  const localSchema = JSON.parse(schemaStr);
  ajv.addSchema(localSchema, name);
}
export function validateFireResponse(schemaType: FireSchema, data: unknown): boolean {
  const schema = FireSchemas[schemaType];
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error('Validation errors:', validate.errors);
    throw new Error(`Invalid ${schemaType} data: ${ajv.errorsText(validate.errors)}`);
  }
  return true;
}
export type FireApiEndpoint = 
  | '/fire/entities'
  | '/fire/securities'
  | '/fire/customers'
  | '/fire/accounts';
export async function fetchFireRegulatory<T>(endpoint: FireApiEndpoint, id: string): Promise<T> {
  const res = await fetch(`/api${endpoint}/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch from ${endpoint}: ${res.statusText}`);
  }
  const data = await res.json();
  validateFireResponse(getSchemaTypeFromEndpoint(endpoint), data);
  return data as T;
}
export async function fetchFireRegulatoryList<T>(endpoint: FireApiEndpoint, params?: Record<string, string>): Promise<T[]> {
  const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`/api${endpoint}${queryString}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch from ${endpoint}: ${res.statusText}`);
  }
  const data = await res.json();
  const schemaType = endpoint.split('/')[2].slice(0, -1) as keyof typeof FireSchemas;
  data.forEach((item: unknown) => validateFireResponse(schemaType, item));
  return data as T[];
}
function getSchemaTypeFromEndpoint(endpoint: FireApiEndpoint): FireSchema {
  switch (endpoint) {
    case '/fire/entities':
      return 'entity';
    case '/fire/securities':
      return 'security';
    case '/fire/customers':
      return 'customer';
    case '/fire/accounts':
      return 'account';
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
}

// REGULATORY EVENT MOCKS SECTION (from remote)
import { RegulatoryEvent, RegulatoryEventFilter, RegulatoryEventStats, RegulatoryJurisdiction, RegulatoryEventType, RegulatoryEventStatus, RegulatoryEventPriority } from '@/types/regulatory';
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
      filteredEvents = filteredEvents.filter(event => {
        const titleMatch = event.title?.toLowerCase().includes(searchLower) ?? false;
        const descMatch = event.description?.toLowerCase().includes(searchLower) ?? false;
        const tagMatch = event.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ?? false;
        return [titleMatch, descMatch, tagMatch].some(Boolean);
      });
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
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockStats;
};
export const fetchRegulatoryEventById = async (id: string): Promise<RegulatoryEvent | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockEvents.find(event => event.id === id) ?? null;
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
