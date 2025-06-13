import { z } from 'zod';

// Enums for regulatory data
export enum RegulatoryEventType {
  ANNOUNCEMENT = 'announcement',
  CONSULTATION = 'consultation',
  PUBLICATION = 'publication',
  DEADLINE = 'deadline',
  IMPLEMENTATION = 'implementation',
  ENFORCEMENT = 'enforcement',
  UPDATE = 'update',
  OTHER = 'other',
}

export enum RegulatoryEventPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum RegulatoryEventStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  PAST = 'past',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
}

export enum RegulatoryCategory {
  FINANCIAL = 'financial',
  ENVIRONMENTAL = 'environmental',
  SOCIAL = 'social',
  GOVERNANCE = 'governance',
  COMPLIANCE = 'compliance',
  RISK = 'risk',
  REPORTING = 'reporting',
  DISCLOSURE = 'disclosure',
  OTHER = 'other',
}

export enum RegulatoryFramework {
  SFDR = 'sfdr',
  CSRD = 'csrd',
  TAXONOMY = 'taxonomy',
  FINANCIAL_CRIME = 'financial_crime',
  AML = 'aml',
  KYC = 'kyc',
  GDPR = 'gdpr',
  MIFID = 'mifid',
  EMIR = 'emir',
  AIFMD = 'aifmd',
  UCITS = 'ucits',
  SOLVENCY = 'solvency',
  BASEL = 'basel',
  IFRS = 'ifrs',
  OTHER = 'other',
}

export enum RegulatoryJurisdiction {
  EU = 'eu',
  UK = 'uk',
  US = 'us',
  CANADA = 'canada',
  SINGAPORE = 'singapore',
  AUSTRALIA = 'australia',
  CHINA = 'china',
  JAPAN = 'japan',
  UAE = 'uae',
  SAUDI_ARABIA = 'saudi_arabia',
  GLOBAL = 'global',
  OTHER = 'other',
}

// Zod schemas for validation
export const RegulatoryEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.nativeEnum(RegulatoryEventType),
  priority: z.nativeEnum(RegulatoryEventPriority),
  status: z.nativeEnum(RegulatoryEventStatus),
  category: z.nativeEnum(RegulatoryCategory),
  framework: z.nativeEnum(RegulatoryFramework),
  jurisdiction: z.nativeEnum(RegulatoryJurisdiction),
  source: z.string(),
  sourceUrl: z.string().url().optional(),
  publishedDate: z.string().or(z.date()),
  effectiveDate: z.string().or(z.date()).optional(),
  deadlineDate: z.string().or(z.date()).optional(),
  tags: z.array(z.string()).default([]),
  impactScore: z.number().min(0).max(100).optional(),
  relatedEvents: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.any()).optional(),
});

// TypeScript types derived from Zod schemas
export type RegulatoryEvent = z.infer<typeof RegulatoryEventSchema>;

// Type for normalized regulatory event (after processing)
export interface NormalizedRegulatoryEvent extends RegulatoryEvent {
  normalizedTitle: string;
  normalizedDescription: string;
  keyEntities: string[];
  keyRequirements: string[];
  aiSummary?: string;
  riskScore?: number;
  impactAreas?: string[];
  suggestedActions?: string[];
}

// Type for regulatory event source configuration
export interface RegulatorySourceConfig {
  id: string;
  name: string;
  url: string;
  type: 'api' | 'rss' | 'webscrape';
  jurisdiction: RegulatoryJurisdiction;
  frameworks: RegulatoryFramework[];
  fetchInterval: number; // in minutes
  enabled: boolean;
  requiresAuthentication: boolean;
  authConfig?: {
    type: 'apiKey' | 'oauth' | 'basic';
    credentials: Record<string, string>;
  };
  parsingConfig: {
    selector?: string;
    mapping: Record<string, string>;
    dateFormat?: string;
  };
}

// Type for regulatory event filter
export interface RegulatoryEventFilter {
  types?: RegulatoryEventType[];
  priorities?: RegulatoryEventPriority[];
  statuses?: RegulatoryEventStatus[];
  categories?: RegulatoryCategory[];
  frameworks?: RegulatoryFramework[];
  jurisdictions?: RegulatoryJurisdiction[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  searchTerm?: string;
  tags?: string[];
  impactScoreRange?: {
    min?: number;
    max?: number;
  };
}

// Type for regulatory event statistics
export interface RegulatoryEventStats {
  total: number;
  byType: Record<RegulatoryEventType, number>;
  byPriority: Record<RegulatoryEventPriority, number>;
  byStatus: Record<RegulatoryEventStatus, number>;
  byCategory: Record<RegulatoryCategory, number>;
  byFramework: Record<RegulatoryFramework, number>;
  byJurisdiction: Record<RegulatoryJurisdiction, number>;
  byMonth: Record<string, number>;
}