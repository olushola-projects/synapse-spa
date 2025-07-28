/**
 * Nexus Agent Type Definitions
 * Integrated from the Nexus SFDR regulatory compliance agent
 */

// Base SFDR Types
export interface SFDRMetadata {
  entityId: string;
  reportingPeriod: string;
  regulatoryVersion: string;
  submissionType: 'INITIAL' | 'AMENDED' | 'CORRECTION';
  submissionDate?: string;
  preparationDate?: string;
  reportingEntity?: {
    name: string;
    lei?: string;
    jurisdiction: string;
  };
}

export interface FundProfile {
  fundType: 'UCITS' | 'AIF' | 'MMF' | 'PEPP' | 'IORP' | 'OTHER';
  fundName: string;
  isin?: string;
  lei?: string;
  targetArticleClassification: 'Article6' | 'Article8' | 'Article9';
  investmentObjective?: string;
  sustainabilityCharacteristics?: string[];
  investmentStrategy?: string;
  benchmarkInfo?: {
    benchmarkName?: string;
    benchmarkProvider?: string;
    isAligned: boolean;
  };
}

export interface PAIIndicators {
  mandatoryIndicators: string[];
  optionalIndicators?: string[];
  considerationStatement?: string;
  dataQuality?: {
    coveragePercentage: number;
    estimationMethods?: string[];
    dataLag?: number;
  };
}

export interface TaxonomyAlignment {
  environmentalObjectives: Array<
    | 'climate_change_mitigation'
    | 'climate_change_adaptation'
    | 'water_marine_resources'
    | 'circular_economy'
    | 'pollution_prevention'
    | 'biodiversity_ecosystems'
  >;
  alignmentPercentage?: number;
  eligibilityPercentage?: number;
  minSafeguards?: boolean;
  dnshAssessment?: {
    conducted: boolean;
    methodology?: string;
  };
}

export interface RegulatoryFramework {
  version: string;
  effectiveDate: string;
  applicableFrom: string;
  updates?: Array<{
    changeType: 'AMENDMENT' | 'CLARIFICATION' | 'TECHNICAL_STANDARD';
    description: string;
    effectiveDate: string;
  }>;
}

// Classification Request Structure
export interface SFDRClassificationRequest {
  metadata: SFDRMetadata;
  fundProfile: FundProfile;
  paiIndicators?: PAIIndicators;
  taxonomyAlignment?: TaxonomyAlignment;
  regulatoryFramework?: RegulatoryFramework;
  additionalDisclosures?: Record<string, unknown>;
}

// Validation Response Structure
export interface ValidationIssue {
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  field?: string;
  ruleId?: string;
  regulation?: string;
  suggestion?: string;
}

export interface ValidationDetails {
  articleCompliance: boolean;
  paiConsistency: boolean;
  taxonomyAlignment: boolean;
  dataQuality: boolean;
  disclosureCompleteness: boolean;
  documentationSufficiency: boolean;
}

export interface ClassificationResult {
  recommendedArticle: 'Article6' | 'Article8' | 'Article9';
  confidence: number;
  reasoning: string[];
  alternativeClassifications?: Array<{
    article: 'Article6' | 'Article8' | 'Article9';
    confidence: number;
    conditions: string[];
  }>;
}

export interface NexusValidationResponse {
  isValid: boolean;
  requestId: string;
  timestamp: string;
  classification?: ClassificationResult;
  issues: ValidationIssue[];
  recommendations: string[];
  sources: string[];
  validationDetails: ValidationDetails;
  complianceScore: number;
  regulatoryReferences?: Array<{
    regulation: string;
    article: string;
    paragraph?: string;
    text: string;
  }>;
  auditTrail?: {
    validatorVersion: string;
    processingTime: number;
    checksPerformed: string[];
  };
}

// Chat Integration Types
export interface NexusMessage {
  id: string;
  type: 'user' | 'agent' | 'system' | 'validation';
  content: string;
  timestamp: Date;
  data?: SFDRClassificationRequest | NexusValidationResponse;
  isLoading?: boolean;
  metadata?: {
    validationId?: string;
    processingTime?: number;
    tokensUsed?: number;
  };
}

// Agent Capabilities
export interface NexusCapabilities {
  supportedRegulations: string[];
  supportedArticles: string[];
  validationRules: string[];
  languages: string[];
  version: string;
  lastUpdated: string;
}

// Quick Action Types
export type QuickActionType =
  | 'upload-document'
  | 'check-compliance'
  | 'generate-report'
  | 'risk-assessment'
  | 'article-classification'
  | 'pai-analysis'
  | 'taxonomy-check';

export interface QuickAction {
  type: QuickActionType;
  label: string;
  description: string;
  icon: string;
  requiresData: boolean;
}
