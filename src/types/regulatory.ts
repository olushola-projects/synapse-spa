
/**
 * Regulatory data types and interfaces for the Synapses GRC platform
 */

export interface RegulatoryEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  jurisdiction: string;
  category: 'deadline' | 'update' | 'consultation' | 'enforcement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  url?: string;
  tags: string[];
  impact?: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface RegulatoryUpdate {
  id: string;
  title: string;
  description: string;
  publishedDate: string;
  effectiveDate?: string;
  jurisdiction: string;
  regulation: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  url?: string;
  tags: string[];
  changes: RegulatoryChange[];
  impactAssessment?: string;
}

export interface RegulatoryChange {
  id: string;
  type: 'new' | 'amended' | 'repealed' | 'clarification';
  section: string;
  description: string;
  impact: string;
  actionRequired?: string;
  deadline?: string;
}

export interface Jurisdiction {
  code: string;
  name: string;
  region: string;
  regulators: string[];
  keyRegulations: string[];
}

export interface RegulatorySource {
  id: string;
  name: string;
  jurisdiction: string;
  type: 'regulator' | 'government' | 'industry' | 'legal';
  url: string;
  apiEndpoint?: string;
  lastUpdated: string;
  isActive: boolean;
  dataFormat: 'rss' | 'api' | 'scraping' | 'manual';
  updateFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
}

export interface ComplianceRequirement {
  id: string;
  regulation: string;
  section: string;
  title: string;
  description: string;
  jurisdiction: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
  assignedTo?: string;
  lastReviewed?: string;
  evidence?: string[];
  controls: string[];
}

export interface RegulatoryCalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'deadline' | 'consultation' | 'implementation' | 'review';
  jurisdiction: string;
  regulation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'upcoming' | 'due' | 'overdue' | 'completed';
  assignedTo?: string;
  reminders: RegulatoryReminder[];
}

export interface RegulatoryReminder {
  id: string;
  eventId: string;
  type: 'email' | 'dashboard' | 'mobile';
  timing: number; // days before event
  recipients: string[];
  isActive: boolean;
}

export interface RegulatoryDashboardConfig {
  userId: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: RegulatoryFilter[];
  notifications: NotificationSettings;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  breakpoints: Record<string, number>;
}

export interface DashboardWidget {
  id: string;
  type: 'calendar' | 'updates' | 'compliance-status' | 'risk-heatmap' | 'chart' | 'table';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  dataSource: string;
  refreshInterval: number;
  isVisible: boolean;
}

export interface RegulatoryFilter {
  field: string;
  operator: 'equals' | 'contains' | 'in' | 'between' | 'greater_than' | 'less_than';
  value: any;
  isActive: boolean;
}

export interface NotificationSettings {
  email: boolean;
  dashboard: boolean;
  mobile: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  priorities: ('low' | 'medium' | 'high' | 'critical')[];
}

export interface RegulatoryAnalytics {
  period: string;
  jurisdiction: string;
  metrics: {
    totalUpdates: number;
    criticalUpdates: number;
    complianceRate: number;
    overdueItems: number;
    upcomingDeadlines: number;
  };
  trends: {
    updateVolume: DataPoint[];
    complianceScore: DataPoint[];
    riskLevel: DataPoint[];
  };
  topCategories: CategoryMetric[];
  jurisdictionBreakdown: JurisdictionMetric[];
}

export interface DataPoint {
  date: string;
  value: number;
}

export interface CategoryMetric {
  category: string;
  count: number;
  percentage: number;
}

export interface JurisdictionMetric {
  jurisdiction: string;
  count: number;
  percentage: number;
  riskScore: number;
}

// API Response types
export interface RegulatoryApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  status: 'success' | 'error' | 'partial';
  message?: string;
  timestamp: string;
}

export interface RegulatorySearchParams {
  query?: string;
  jurisdictions?: string[];
  categories?: string[];
  priorities?: string[];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Enums for consistent values
export enum RegulatoryPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non-compliant',
  PARTIAL = 'partial',
  NOT_APPLICABLE = 'not-applicable'
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ChangeType {
  NEW = 'new',
  AMENDED = 'amended',
  REPEALED = 'repealed',
  CLARIFICATION = 'clarification'
}
