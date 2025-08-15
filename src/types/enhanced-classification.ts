/**
 * Enhanced SFDR Classification Types
 * Updated to match the enhanced backend response format
 */

// Enhanced Classification Response from new backend
export interface EnhancedSFDRClassificationResponse {
  classification: string;
  confidence: number;
  processing_time: number;
  reasoning: string;
  sustainability_score: number;
  key_indicators: string[];
  risk_factors: string[];
  regulatory_basis: string[];
  benchmark_comparison: {
    industry_baseline: number;
    current_confidence: number;
    performance_vs_baseline: number;
    percentile_rank: number;
  };
  audit_trail: {
    classification_id: string;
    timestamp: string;
    engine_version: string;
    processing_time: number;
    confidence: number;
    article_scores?: Record<string, number>;
    method: string;
    document_type?: string;
  };
  explainability_score: number;
}

// Legacy compatible interface
export interface LegacySFDRClassificationResponse {
  classification: string;
  confidence: number;
  reasoning: string;
  riskLevel: string;
  complianceScore: number;
  recommendations: string[];
  timestamp: string;
}

// Unified interface that supports both enhanced and legacy responses
export interface SFDRClassificationResponse extends Partial<EnhancedSFDRClassificationResponse> {
  // Core required fields
  classification: string;
  confidence: number;
  reasoning: string;

  // Legacy fields for backward compatibility (optional)
  riskLevel?: string;
  complianceScore?: number;
  recommendations?: string[];
  timestamp?: string;

  // Enhanced fields (optional for backward compatibility)
  processing_time?: number;
  sustainability_score?: number;
  key_indicators?: string[];
  risk_factors?: string[];
  regulatory_basis?: string[];
  benchmark_comparison?: {
    industry_baseline: number;
    current_confidence: number;
    performance_vs_baseline: number;
    percentile_rank: number;
  };
  audit_trail?: {
    classification_id: string;
    timestamp: string;
    engine_version: string;
    processing_time: number;
    confidence: number;
    article_scores?: Record<string, number>;
    method: string;
    document_type?: string;
  };
  explainability_score?: number;
}

// Performance monitoring types
export interface PerformanceMetrics {
  response_time: number;
  classification_accuracy: number;
  confidence_distribution: Record<string, number>;
  error_rate: number;
  throughput: number;
  timestamp: string;
}

// Classification analytics
export interface ClassificationAnalytics {
  total_classifications: number;
  article_distribution: {
    article_6: number;
    article_8: number;
    article_9: number;
  };
  average_confidence: number;
  processing_times: {
    average: number;
    p50: number;
    p90: number;
    p99: number;
  };
  success_rate: number;
}

// Enhanced request format
export interface EnhancedClassificationRequest {
  text: string;
  document_type?: string;
  include_audit_trail?: boolean;
  include_benchmark_comparison?: boolean;
  confidence_threshold?: number;
  require_citations?: boolean;
}

// User Acceptance Testing types
export interface UATTestCase {
  id: string;
  title: string;
  description: string;
  test_data: EnhancedClassificationRequest;
  expected_classification: string;
  expected_confidence_range: [number, number];
  validation_criteria: string[];
  status: 'pending' | 'passed' | 'failed' | 'blocked';
  results?: {
    actual_response: SFDRClassificationResponse;
    test_date: string;
    passed_criteria: string[];
    failed_criteria: string[];
    notes?: string;
  };
}

export interface UATSession {
  session_id: string;
  start_time: string;
  end_time?: string;
  test_cases: UATTestCase[];
  overall_status: 'in_progress' | 'completed' | 'failed';
  summary?: {
    total_tests: number;
    passed_tests: number;
    failed_tests: number;
    success_rate: number;
    notes: string[];
  };
}

// Citation types for regulatory compliance [[memory:6223251]]
export interface RegulatoryArticleCitation {
  regulation: string;
  article: string;
  paragraph?: string;
  section?: string;
  text: string;
  relevance_score: number;
  context: string;
}

export interface CitationEnhancedResponse extends SFDRClassificationResponse {
  regulatory_citations: RegulatoryArticleCitation[];
  citation_quality_score: number;
  compliance_validation: {
    cited_articles: string[];
    missing_citations: string[];
    citation_completeness: number;
  };
}
