import { supabase } from '@/integrations/supabase/client';
import {
  RegulatoryEvent,
  RegulatoryEventFilter,
  RegulatoryEventSchema,
  NormalizedRegulatoryEvent,
  RegulatorySourceConfig,
  RegulatoryEventStats,
  RegulatoryEventType,
  RegulatoryEventPriority,
  RegulatoryEventStatus,
  RegulatoryCategory,
  RegulatoryFramework,
  RegulatoryJurisdiction
} from '@/types/regulatory';

// Mock data for development purposes
const MOCK_REGULATORY_EVENTS: RegulatoryEvent[] = [
  {
    id: '1',
    title: 'SFDR Level 2 Implementation Deadline',
    description: 'Financial market participants must comply with the detailed requirements of SFDR Level 2, including principal adverse impact reporting and pre-contractual disclosures.',
    type: RegulatoryEventType.DEADLINE,
    priority: RegulatoryEventPriority.HIGH,
    status: RegulatoryEventStatus.UPCOMING,
    category: RegulatoryCategory.DISCLOSURE,
    framework: RegulatoryFramework.SFDR,
    jurisdiction: RegulatoryJurisdiction.EU,
    source: 'European Securities and Markets Authority',
    sourceUrl: 'https://www.esma.europa.eu/policy-activities/sustainable-finance/sustainability-related-disclosure-financial-services-sector',
    publishedDate: '2023-11-15',
    effectiveDate: '2024-01-01',
    deadlineDate: '2024-06-30',
    tags: ['ESG', 'Disclosure', 'Sustainability'],
    impactScore: 85,
    relatedEvents: ['2', '5'],
  },
  {
    id: '2',
    title: 'CSRD First Reporting Period Begins',
    description: 'Companies subject to the Corporate Sustainability Reporting Directive must begin collecting data for their first sustainability reports under the new standards.',
    type: RegulatoryEventType.IMPLEMENTATION,
    priority: RegulatoryEventPriority.HIGH,
    status: RegulatoryEventStatus.ACTIVE,
    category: RegulatoryCategory.REPORTING,
    framework: RegulatoryFramework.CSRD,
    jurisdiction: RegulatoryJurisdiction.EU,
    source: 'European Financial Reporting Advisory Group',
    sourceUrl: 'https://www.efrag.org/Activities/2105191406363055/Sustainability-reporting-standards-interim-draft',
    publishedDate: '2023-10-20',
    effectiveDate: '2024-01-01',
    tags: ['ESG', 'Reporting', 'Sustainability'],
    impactScore: 90,
    relatedEvents: ['1', '3'],
  },
  {
    id: '3',
    title: 'UK Green Taxonomy Consultation',
    description: 'The UK government is seeking feedback on the proposed UK Green Taxonomy, which will establish a framework for defining environmentally sustainable economic activities.',
    type: RegulatoryEventType.CONSULTATION,
    priority: RegulatoryEventPriority.MEDIUM,
    status: RegulatoryEventStatus.ACTIVE,
    category: RegulatoryCategory.ENVIRONMENTAL,
    framework: RegulatoryFramework.TAXONOMY,
    jurisdiction: RegulatoryJurisdiction.UK,
    source: 'HM Treasury',
    sourceUrl: 'https://www.gov.uk/government/consultations/uk-green-taxonomy-consultation',
    publishedDate: '2023-12-01',
    deadlineDate: '2024-03-01',
    tags: ['ESG', 'Taxonomy', 'Green Finance'],
    impactScore: 75,
    relatedEvents: ['2'],
  },
  {
    id: '4',
    title: 'SEC Climate Disclosure Rule Finalization',
    description: 'The Securities and Exchange Commission is expected to finalize rules requiring public companies to disclose climate-related risks and greenhouse gas emissions.',
    type: RegulatoryEventType.PUBLICATION,
    priority: RegulatoryEventPriority.HIGH,
    status: RegulatoryEventStatus.UPCOMING,
    category: RegulatoryCategory.DISCLOSURE,
    framework: RegulatoryFramework.OTHER,
    jurisdiction: RegulatoryJurisdiction.US,
    source: 'Securities and Exchange Commission',
    sourceUrl: 'https://www.sec.gov/news/press-release/2022-46',
    publishedDate: '2023-11-10',
    effectiveDate: '2024-04-01',
    tags: ['Climate', 'Disclosure', 'Emissions'],
    impactScore: 80,
    relatedEvents: [],
  },
  {
    id: '5',
    title: 'EU Taxonomy Climate Delegated Act Amendment',
    description: 'The European Commission has proposed amendments to the Climate Delegated Act under the EU Taxonomy Regulation, affecting criteria for sustainable activities.',
    type: RegulatoryEventType.UPDATE,
    priority: RegulatoryEventPriority.MEDIUM,
    status: RegulatoryEventStatus.ACTIVE,
    category: RegulatoryCategory.ENVIRONMENTAL,
    framework: RegulatoryFramework.TAXONOMY,
    jurisdiction: RegulatoryJurisdiction.EU,
    source: 'European Commission',
    sourceUrl: 'https://ec.europa.eu/info/law/sustainable-finance-taxonomy-regulation-eu-2020-852/amending-and-supplementary-acts/implementing-and-delegated-acts_en',
    publishedDate: '2023-11-25',
    effectiveDate: '2024-01-15',
    tags: ['Taxonomy', 'Climate', 'Sustainable Finance'],
    impactScore: 70,
    relatedEvents: ['1'],
  },
  {
    id: '6',
    title: 'Singapore Green Finance Taxonomy Finalization',
    description: 'The Monetary Authority of Singapore is finalizing its green finance taxonomy, establishing criteria for sustainable economic activities in the ASEAN context.',
    type: RegulatoryEventType.PUBLICATION,
    priority: RegulatoryEventPriority.MEDIUM,
    status: RegulatoryEventStatus.UPCOMING,
    category: RegulatoryCategory.ENVIRONMENTAL,
    framework: RegulatoryFramework.TAXONOMY,
    jurisdiction: RegulatoryJurisdiction.SINGAPORE,
    source: 'Monetary Authority of Singapore',
    sourceUrl: 'https://www.mas.gov.sg/regulation/sustainable-finance',
    publishedDate: '2023-12-05',
    effectiveDate: '2024-07-01',
    tags: ['Taxonomy', 'Green Finance', 'ASEAN'],
    impactScore: 65,
    relatedEvents: [],
  },
  {
    id: '7',
    title: 'Financial Crime Compliance Framework Update',
    description: 'Updates to anti-money laundering and counter-terrorist financing regulations requiring enhanced due diligence procedures for financial institutions.',
    type: RegulatoryEventType.UPDATE,
    priority: RegulatoryEventPriority.HIGH,
    status: RegulatoryEventStatus.UPCOMING,
    category: RegulatoryCategory.COMPLIANCE,
    framework: RegulatoryFramework.FINANCIAL_CRIME,
    jurisdiction: RegulatoryJurisdiction.GLOBAL,
    source: 'Financial Action Task Force',
    sourceUrl: 'https://www.fatf-gafi.org/publications/fatfrecommendations/documents/fatf-recommendations.html',
    publishedDate: '2023-11-30',
    effectiveDate: '2024-03-15',
    tags: ['AML', 'CFT', 'Due Diligence'],
    impactScore: 85,
    relatedEvents: [],
  },
  {
    id: '8',
    title: 'Australian Climate-Related Financial Disclosure Standards',
    description: 'The Australian government is introducing mandatory climate-related financial disclosure standards aligned with the TCFD framework.',
    type: RegulatoryEventType.ANNOUNCEMENT,
    priority: RegulatoryEventPriority.MEDIUM,
    status: RegulatoryEventStatus.UPCOMING,
    category: RegulatoryCategory.DISCLOSURE,
    framework: RegulatoryFramework.OTHER,
    jurisdiction: RegulatoryJurisdiction.AUSTRALIA,
    source: 'Australian Treasury',
    sourceUrl: 'https://treasury.gov.au/consultation/c2023-340606',
    publishedDate: '2023-12-12',
    effectiveDate: '2024-07-01',
    tags: ['Climate', 'Disclosure', 'TCFD'],
    impactScore: 70,
    relatedEvents: [],
  },
  {
    id: '9',
    title: 'UAE ESG Disclosure Guidelines Implementation',
    description: 'The Securities and Commodities Authority of UAE is implementing new ESG disclosure guidelines for listed companies.',
    type: RegulatoryEventType.IMPLEMENTATION,
    priority: RegulatoryEventPriority.MEDIUM,
    status: RegulatoryEventStatus.UPCOMING,
    category: RegulatoryCategory.DISCLOSURE,
    framework: RegulatoryFramework.OTHER,
    jurisdiction: RegulatoryJurisdiction.UAE,
    source: 'Securities and Commodities Authority',
    sourceUrl: 'https://www.sca.gov.ae/en/regulations/guidelines.aspx',
    publishedDate: '2023-11-20',
    effectiveDate: '2024-05-01',
    tags: ['ESG', 'Disclosure', 'Middle East'],
    impactScore: 60,
    relatedEvents: [],
  },
  {
    id: '10',
    title: 'China Green Bond Standards Revision',
    description: 'The People\'s Bank of China is revising its green bond standards to align more closely with international practices and expand eligible project categories.',
    type: RegulatoryEventType.UPDATE,
    priority: RegulatoryEventPriority.MEDIUM,
    status: RegulatoryEventStatus.ACTIVE,
    category: RegulatoryCategory.ENVIRONMENTAL,
    framework: RegulatoryFramework.OTHER,
    jurisdiction: RegulatoryJurisdiction.CHINA,
    source: 'People\'s Bank of China',
    sourceUrl: 'http://www.pbc.gov.cn/en/3688110/3688172/index.html',
    publishedDate: '2023-10-30',
    effectiveDate: '2024-02-01',
    tags: ['Green Bonds', 'Sustainable Finance', 'Standards'],
    impactScore: 65,
    relatedEvents: [],
  },
];

// Mock source configurations
const MOCK_SOURCE_CONFIGS: RegulatorySourceConfig[] = [
  {
    id: 'esma',
    name: 'European Securities and Markets Authority',
    url: 'https://www.esma.europa.eu/press-news/esma-news',
    type: 'webscrape',
    jurisdiction: RegulatoryJurisdiction.EU,
    frameworks: [RegulatoryFramework.SFDR, RegulatoryFramework.CSRD, RegulatoryFramework.TAXONOMY],
    fetchInterval: 1440, // daily
    enabled: true,
    requiresAuthentication: false,
    parsingConfig: {
      selector: '.view-esma-news .views-row',
      mapping: {
        title: '.news-title',
        description: '.field-items',
        publishedDate: '.news-date',
        sourceUrl: 'a.href'
      },
      dateFormat: 'DD MMM YYYY'
    }
  },
  {
    id: 'sec',
    name: 'U.S. Securities and Exchange Commission',
    url: 'https://www.sec.gov/news/pressreleases',
    type: 'rss',
    jurisdiction: RegulatoryJurisdiction.US,
    frameworks: [RegulatoryFramework.OTHER],
    fetchInterval: 720, // twice daily
    enabled: true,
    requiresAuthentication: false,
    parsingConfig: {
      mapping: {
        title: 'title',
        description: 'description',
        publishedDate: 'pubDate',
        sourceUrl: 'link'
      }
    }
  },
  {
    id: 'fca',
    name: 'Financial Conduct Authority',
    url: 'https://www.fca.org.uk/news-and-publications-api/news',
    type: 'api',
    jurisdiction: RegulatoryJurisdiction.UK,
    frameworks: [RegulatoryFramework.FINANCIAL_CRIME, RegulatoryFramework.OTHER],
    fetchInterval: 1440, // daily
    enabled: true,
    requiresAuthentication: true,
    authConfig: {
      type: 'apiKey',
      credentials: {
        apiKey: process.env.FCA_API_KEY || 'mock-api-key'
      }
    },
    parsingConfig: {
      mapping: {
        title: 'title',
        description: 'summary',
        publishedDate: 'published',
        sourceUrl: 'url'
      }
    }
  },
];

/**
 * Service for fetching and managing regulatory events
 */
export class RegulatoryService {
  private static instance: RegulatoryService;
  private events: RegulatoryEvent[] = [];
  private normalizedEvents: Map<string, NormalizedRegulatoryEvent> = new Map();
  private sourceConfigs: RegulatorySourceConfig[] = [];
  private lastFetchTime: Date | null = null;
  private isInitialized = false;

  private constructor() {}

  /**
   * Get the singleton instance of the RegulatoryService
   */
  public static getInstance(): RegulatoryService {
    if (!RegulatoryService.instance) {
      RegulatoryService.instance = new RegulatoryService();
    }
    return RegulatoryService.instance;
  }

  /**
   * Initialize the service and load initial data
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // In a real implementation, we would fetch from Supabase or other data source
      // For now, we'll use mock data
      this.events = MOCK_REGULATORY_EVENTS;
      this.sourceConfigs = MOCK_SOURCE_CONFIGS;
      
      // Normalize the events
      await this.normalizeEvents();
      
      this.lastFetchTime = new Date();
      this.isInitialized = true;
      console.log('RegulatoryService initialized with', this.events.length, 'events');
    } catch (error) {
      console.error('Failed to initialize RegulatoryService:', error);
      throw error;
    }
  }

  /**
   * Ensure the service is initialized before use
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Fetch regulatory events from all configured sources
   */
  public async fetchEvents(): Promise<RegulatoryEvent[]> {
    await this.ensureInitialized();
    
    // In a real implementation, we would fetch from each source
    // For now, we'll just return the mock data
    this.lastFetchTime = new Date();
    return this.events;
  }

  /**
   * Get all regulatory events, optionally filtered
   */
  public async getEvents(filter?: RegulatoryEventFilter): Promise<RegulatoryEvent[]> {
    await this.ensureInitialized();
    
    if (!filter) return this.events;
    
    return this.events.filter(event => {
      // Apply filters
      if (filter.types && filter.types.length > 0 && !filter.types.includes(event.type)) return false;
      if (filter.priorities && filter.priorities.length > 0 && !filter.priorities.includes(event.priority)) return false;
      if (filter.statuses && filter.statuses.length > 0 && !filter.statuses.includes(event.status)) return false;
      if (filter.categories && filter.categories.length > 0 && !filter.categories.includes(event.category)) return false;
      if (filter.frameworks && filter.frameworks.length > 0 && !filter.frameworks.includes(event.framework)) return false;
      if (filter.jurisdictions && filter.jurisdictions.length > 0 && !filter.jurisdictions.includes(event.jurisdiction)) return false;
      
      // Date range filter
      if (filter.dateRange) {
        const eventDate = new Date(event.publishedDate);
        if (filter.dateRange.start && eventDate < filter.dateRange.start) return false;
        if (filter.dateRange.end && eventDate > filter.dateRange.end) return false;
      }
      
      // Search term filter
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        const titleMatch = event.title.toLowerCase().includes(searchLower);
        const descMatch = event.description.toLowerCase().includes(searchLower);
        if (!titleMatch && !descMatch) return false;
      }
      
      // Tags filter
      if (filter.tags && filter.tags.length > 0) {
        const hasMatchingTag = filter.tags.some(tag => event.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      
      // Impact score range filter
      if (filter.impactScoreRange && event.impactScore !== undefined) {
        if (filter.impactScoreRange.min !== undefined && event.impactScore < filter.impactScoreRange.min) return false;
        if (filter.impactScoreRange.max !== undefined && event.impactScore > filter.impactScoreRange.max) return false;
      }
      
      return true;
    });
  }

  /**
   * Get a single regulatory event by ID
   */
  public async getEventById(id: string): Promise<RegulatoryEvent | null> {
    await this.ensureInitialized();
    return this.events.find(event => event.id === id) || null;
  }

  /**
   * Get a normalized regulatory event by ID
   */
  public async getNormalizedEventById(id: string): Promise<NormalizedRegulatoryEvent | null> {
    await this.ensureInitialized();
    return this.normalizedEvents.get(id) || null;
  }

  /**
   * Get all normalized regulatory events, optionally filtered
   */
  public async getNormalizedEvents(filter?: RegulatoryEventFilter): Promise<NormalizedRegulatoryEvent[]> {
    await this.ensureInitialized();
    
    // Get filtered events first
    const filteredEvents = await this.getEvents(filter);
    
    // Return corresponding normalized events
    return filteredEvents
      .map(event => this.normalizedEvents.get(event.id))
      .filter((event): event is NormalizedRegulatoryEvent => event !== undefined);
  }

  /**
   * Normalize regulatory events (extract entities, calculate scores, etc.)
   */
  private async normalizeEvents(): Promise<void> {
    for (const event of this.events) {
      // In a real implementation, this would use NLP and other techniques
      // For now, we'll create a simple normalized version
      const normalized: NormalizedRegulatoryEvent = {
        ...event,
        normalizedTitle: event.title.toUpperCase(),
        normalizedDescription: event.description,
        keyEntities: this.extractEntities(event),
        keyRequirements: this.extractRequirements(event),
        riskScore: this.calculateRiskScore(event),
        impactAreas: this.determineImpactAreas(event),
        suggestedActions: this.generateSuggestedActions(event),
      };
      
      this.normalizedEvents.set(event.id, normalized);
    }
  }

  /**
   * Extract key entities from a regulatory event
   */
  private extractEntities(event: RegulatoryEvent): string[] {
    // In a real implementation, this would use NLP
    // For now, we'll use a simple approach
    const entities = new Set<string>();
    
    // Add framework as an entity
    entities.add(event.framework.toUpperCase());
    
    // Add jurisdiction as an entity
    entities.add(event.jurisdiction.toUpperCase());
    
    // Add some entities based on the title and description
    const text = `${event.title} ${event.description}`;
    
    if (text.includes('disclosure')) entities.add('DISCLOSURE REQUIREMENTS');
    if (text.includes('reporting')) entities.add('REPORTING OBLIGATIONS');
    if (text.includes('compliance')) entities.add('COMPLIANCE PROCEDURES');
    if (text.includes('sustainable') || text.includes('sustainability')) entities.add('SUSTAINABILITY');
    if (text.includes('climate')) entities.add('CLIMATE');
    if (text.includes('ESG')) entities.add('ESG');
    if (text.includes('financial')) entities.add('FINANCIAL INSTITUTIONS');
    if (text.includes('risk')) entities.add('RISK MANAGEMENT');
    if (text.includes('governance')) entities.add('GOVERNANCE');
    
    return Array.from(entities);
  }

  /**
   * Extract key requirements from a regulatory event
   */
  private extractRequirements(event: RegulatoryEvent): string[] {
    // In a real implementation, this would use NLP
    // For now, we'll use a simple approach based on the event type
    const requirements: string[] = [];
    
    switch (event.type) {
      case RegulatoryEventType.DEADLINE:
        requirements.push(`Submit required documentation by ${event.deadlineDate}`);
        break;
      case RegulatoryEventType.IMPLEMENTATION:
        requirements.push(`Implement new processes by ${event.effectiveDate}`);
        break;
      case RegulatoryEventType.CONSULTATION:
        requirements.push(`Provide feedback by ${event.deadlineDate}`);
        break;
      case RegulatoryEventType.PUBLICATION:
        requirements.push('Review new publication and assess impact');
        break;
      case RegulatoryEventType.UPDATE:
        requirements.push('Update existing processes to comply with changes');
        break;
      default:
        requirements.push('Review and assess regulatory implications');
    }
    
    // Add framework-specific requirements
    switch (event.framework) {
      case RegulatoryFramework.SFDR:
        requirements.push('Prepare ESG disclosures in line with SFDR requirements');
        break;
      case RegulatoryFramework.CSRD:
        requirements.push('Prepare sustainability reporting in accordance with ESRS');
        break;
      case RegulatoryFramework.TAXONOMY:
        requirements.push('Assess economic activities against taxonomy criteria');
        break;
      case RegulatoryFramework.FINANCIAL_CRIME:
        requirements.push('Update AML/CFT procedures and risk assessments');
        break;
      default:
        // No additional requirements
    }
    
    return requirements;
  }

  /**
   * Calculate a risk score for a regulatory event
   */
  private calculateRiskScore(event: RegulatoryEvent): number {
    // In a real implementation, this would use a more sophisticated algorithm
    // For now, we'll use a simple approach
    let score = 50; // Base score
    
    // Adjust based on priority
    switch (event.priority) {
      case RegulatoryEventPriority.CRITICAL:
        score += 30;
        break;
      case RegulatoryEventPriority.HIGH:
        score += 20;
        break;
      case RegulatoryEventPriority.MEDIUM:
        score += 10;
        break;
      case RegulatoryEventPriority.LOW:
        // No adjustment
        break;
    }
    
    // Adjust based on type
    switch (event.type) {
      case RegulatoryEventType.DEADLINE:
      case RegulatoryEventType.IMPLEMENTATION:
        score += 15;
        break;
      case RegulatoryEventType.ENFORCEMENT:
        score += 20;
        break;
      case RegulatoryEventType.UPDATE:
      case RegulatoryEventType.PUBLICATION:
        score += 10;
        break;
      default:
        score += 5;
    }
    
    // Cap at 100
    return Math.min(100, score);
  }

  /**
   * Determine impact areas for a regulatory event
   */
  private determineImpactAreas(event: RegulatoryEvent): string[] {
    // In a real implementation, this would use a more sophisticated algorithm
    // For now, we'll use a simple approach based on the event category and framework
    const impactAreas = new Set<string>();
    
    // Add impact areas based on category
    switch (event.category) {
      case RegulatoryCategory.ENVIRONMENTAL:
        impactAreas.add('Environmental Reporting');
        impactAreas.add('Climate Risk Management');
        break;
      case RegulatoryCategory.SOCIAL:
        impactAreas.add('Social Impact Assessment');
        impactAreas.add('Human Rights Due Diligence');
        break;
      case RegulatoryCategory.GOVERNANCE:
        impactAreas.add('Corporate Governance');
        impactAreas.add('Board Oversight');
        break;
      case RegulatoryCategory.COMPLIANCE:
        impactAreas.add('Compliance Programs');
        impactAreas.add('Regulatory Reporting');
        break;
      case RegulatoryCategory.RISK:
        impactAreas.add('Risk Management');
        impactAreas.add('Risk Assessment');
        break;
      case RegulatoryCategory.REPORTING:
        impactAreas.add('Financial Reporting');
        impactAreas.add('Non-Financial Reporting');
        break;
      case RegulatoryCategory.DISCLOSURE:
        impactAreas.add('Public Disclosures');
        impactAreas.add('Investor Communications');
        break;
      default:
        impactAreas.add('General Compliance');
    }
    
    // Add impact areas based on framework
    switch (event.framework) {
      case RegulatoryFramework.SFDR:
        impactAreas.add('Product Disclosures');
        impactAreas.add('Entity-Level Disclosures');
        break;
      case RegulatoryFramework.CSRD:
        impactAreas.add('Sustainability Reporting');
        impactAreas.add('Double Materiality Assessment');
        break;
      case RegulatoryFramework.TAXONOMY:
        impactAreas.add('Economic Activity Classification');
        impactAreas.add('Green Asset Ratio');
        break;
      case RegulatoryFramework.FINANCIAL_CRIME:
        impactAreas.add('Customer Due Diligence');
        impactAreas.add('Transaction Monitoring');
        break;
      case RegulatoryFramework.AML:
        impactAreas.add('AML Procedures');
        impactAreas.add('Suspicious Activity Reporting');
        break;
      case RegulatoryFramework.KYC:
        impactAreas.add('Customer Identification');
        impactAreas.add('Beneficial Ownership');
        break;
      default:
        // No additional impact areas
    }
    
    return Array.from(impactAreas);
  }

  /**
   * Generate suggested actions for a regulatory event
   */
  private generateSuggestedActions(event: RegulatoryEvent): string[] {
    // In a real implementation, this would use a more sophisticated algorithm
    // For now, we'll use a simple approach
    const actions: string[] = [];
    
    // Add general actions based on event type
    switch (event.type) {
      case RegulatoryEventType.ANNOUNCEMENT:
        actions.push('Review announcement and assess potential impact');
        actions.push('Brief relevant stakeholders on upcoming changes');
        break;
      case RegulatoryEventType.CONSULTATION:
        actions.push('Review consultation paper and prepare response');
        actions.push('Engage with industry associations on joint response');
        break;
      case RegulatoryEventType.PUBLICATION:
        actions.push('Analyze published document and identify key requirements');
        actions.push('Develop implementation plan for new requirements');
        break;
      case RegulatoryEventType.DEADLINE:
        actions.push('Ensure compliance preparations are on track');
        actions.push('Conduct pre-submission review of documentation');
        break;
      case RegulatoryEventType.IMPLEMENTATION:
        actions.push('Update policies and procedures to reflect new requirements');
        actions.push('Train staff on new requirements and processes');
        break;
      case RegulatoryEventType.ENFORCEMENT:
        actions.push('Review enforcement action and assess implications');
        actions.push('Conduct gap analysis against cited violations');
        break;
      case RegulatoryEventType.UPDATE:
        actions.push('Identify changes from previous version');
        actions.push('Update existing compliance framework');
        break;
      default:
        actions.push('Review and assess regulatory implications');
    }
    
    // Add specific actions based on framework
    switch (event.framework) {
      case RegulatoryFramework.SFDR:
        actions.push('Update pre-contractual disclosures for financial products');
        actions.push('Review principal adverse impact indicators');
        break;
      case RegulatoryFramework.CSRD:
        actions.push('Prepare for expanded sustainability reporting');
        actions.push('Assess readiness for assurance requirements');
        break;
      case RegulatoryFramework.TAXONOMY:
        actions.push('Assess economic activities against taxonomy criteria');
        actions.push('Calculate taxonomy alignment percentages');
        break;
      default:
        // No additional actions
    }
    
    return actions;
  }

  /**
   * Get statistics about regulatory events
   */
  public async getEventStats(): Promise<RegulatoryEventStats> {
    await this.ensureInitialized();
    
    const stats: RegulatoryEventStats = {
      total: this.events.length,
      byType: {} as Record<RegulatoryEventType, number>,
      byPriority: {} as Record<RegulatoryEventPriority, number>,
      byStatus: {} as Record<RegulatoryEventStatus, number>,
      byCategory: {} as Record<RegulatoryCategory, number>,
      byFramework: {} as Record<RegulatoryFramework, number>,
      byJurisdiction: {} as Record<RegulatoryJurisdiction, number>,
      byMonth: {},
    };
    
    // Initialize counters
    Object.values(RegulatoryEventType).forEach(type => stats.byType[type] = 0);
    Object.values(RegulatoryEventPriority).forEach(priority => stats.byPriority[priority] = 0);
    Object.values(RegulatoryEventStatus).forEach(status => stats.byStatus[status] = 0);
    Object.values(RegulatoryCategory).forEach(category => stats.byCategory[category] = 0);
    Object.values(RegulatoryFramework).forEach(framework => stats.byFramework[framework] = 0);
    Object.values(RegulatoryJurisdiction).forEach(jurisdiction => stats.byJurisdiction[jurisdiction] = 0);
    
    // Count events
    for (const event of this.events) {
      stats.byType[event.type]++;
      stats.byPriority[event.priority]++;
      stats.byStatus[event.status]++;
      stats.byCategory[event.category]++;
      stats.byFramework[event.framework]++;
      stats.byJurisdiction[event.jurisdiction]++;
      
      // Count by month
      const date = new Date(event.publishedDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + 1;
    }
    
    return stats;
  }

  /**
   * Get all available source configurations
   */
  public async getSourceConfigs(): Promise<RegulatorySourceConfig[]> {
    await this.ensureInitialized();
    return this.sourceConfigs;
  }

  /**
   * Add a new regulatory event
   */
  public async addEvent(eventData: Omit<RegulatoryEvent, 'id'>): Promise<RegulatoryEvent> {
    await this.ensureInitialized();
    
    try {
      // Validate the event data
      const validatedData = RegulatoryEventSchema.omit({ id: true }).parse(eventData);
      
      // Generate a new ID
      const newId = (this.events.length + 1).toString();
      
      // Create the new event
      const newEvent: RegulatoryEvent = {
        id: newId,
        ...validatedData,
      };
      
      // Add to the events array
      this.events.push(newEvent);
      
      // Normalize the new event
      const normalized: NormalizedRegulatoryEvent = {
        ...newEvent,
        normalizedTitle: newEvent.title.toUpperCase(),
        normalizedDescription: newEvent.description,
        keyEntities: this.extractEntities(newEvent),
        keyRequirements: this.extractRequirements(newEvent),
        riskScore: this.calculateRiskScore(newEvent),
        impactAreas: this.determineImpactAreas(newEvent),
        suggestedActions: this.generateSuggestedActions(newEvent),
      };
      
      this.normalizedEvents.set(newEvent.id, normalized);
      
      return newEvent;
    } catch (error) {
      console.error('Failed to add regulatory event:', error);
      throw error;
    }
  }

  /**
   * Update an existing regulatory event
   */
  public async updateEvent(id: string, eventData: Partial<RegulatoryEvent>): Promise<RegulatoryEvent> {
    await this.ensureInitialized();
    
    const existingEventIndex = this.events.findIndex(event => event.id === id);
    if (existingEventIndex === -1) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    try {
      // Update the event
      const updatedEvent = {
        ...this.events[existingEventIndex],
        ...eventData,
        id, // Ensure ID doesn't change
      };
      
      // Validate the updated event
      RegulatoryEventSchema.parse(updatedEvent);
      
      // Update in the events array
      this.events[existingEventIndex] = updatedEvent;
      
      // Update the normalized event
      const normalized: NormalizedRegulatoryEvent = {
        ...updatedEvent,
        normalizedTitle: updatedEvent.title.toUpperCase(),
        normalizedDescription: updatedEvent.description,
        keyEntities: this.extractEntities(updatedEvent),
        keyRequirements: this.extractRequirements(updatedEvent),
        riskScore: this.calculateRiskScore(updatedEvent),
        impactAreas: this.determineImpactAreas(updatedEvent),
        suggestedActions: this.generateSuggestedActions(updatedEvent),
      };
      
      this.normalizedEvents.set(updatedEvent.id, normalized);
      
      return updatedEvent;
    } catch (error) {
      console.error('Failed to update regulatory event:', error);
      throw error;
    }
  }

  /**
   * Delete a regulatory event
   */
  public async deleteEvent(id: string): Promise<void> {
    await this.ensureInitialized();
    
    const existingEventIndex = this.events.findIndex(event => event.id === id);
    if (existingEventIndex === -1) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    // Remove from the events array
    this.events.splice(existingEventIndex, 1);
    
    // Remove from normalized events
    this.normalizedEvents.delete(id);
  }
}

// Export a singleton instance
export const regulatoryService = RegulatoryService.getInstance();