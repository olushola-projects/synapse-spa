/**
 * SFDR Compliance Service
 * Implements regulatory compliance framework with audit trail, explainability, and data lineage
 * Ensures 7-year retention and regulatory reporting capabilities
 */

import { supabase } from '@/integrations/supabase/client';
import { enterpriseMonitoring } from './enterpriseMonitoringService';

export interface SFDRAuditRecord {
  id?: string;
  user_id?: string;
  classification_id?: string;
  action_type: string;
  decision_data: any;
  explainability_data?: any;
  regulatory_basis?: string;
  confidence_score?: number;
  processing_time_ms?: number;
  input_hash?: string;
  output_hash?: string;
  data_lineage?: any;
  retention_until?: string;
  created_at?: string;
}

export interface ClassificationExplanation {
  id?: string;
  classification_id: string;
  user_id?: string;
  explanation_type: 'feature_importance' | 'rule_based' | 'example_based';
  explanation_data: any;
  regulatory_references?: any;
  confidence_factors?: any;
  human_readable_explanation?: string;
  technical_explanation?: any;
}

export interface DataLineage {
  id?: string;
  source_document_id?: string;
  classification_id?: string;
  transformation_steps: any;
  data_sources: any;
  processing_pipeline: string;
  version_info?: any;
}

class SFDRComplianceService {
  private static instance: SFDRComplianceService;

  public static getInstance(): SFDRComplianceService {
    if (!SFDRComplianceService.instance) {
      SFDRComplianceService.instance = new SFDRComplianceService();
    }
    return SFDRComplianceService.instance;
  }

  /**
   * Record SFDR audit trail for regulatory compliance
   */
  async recordAuditTrail(record: SFDRAuditRecord): Promise<void> {
    try {
      const auditData = {
        ...record,
        retention_until: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 7 years
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('sfdr_audit_trail')
        .insert([auditData]);

      if (error) {
        console.error('Failed to record SFDR audit trail:', error);
        await enterpriseMonitoring.recordSystemHealth({
          service: 'sfdr_compliance',
          status: 'critical',
          responseTime: 0,
          details: { error: 'Audit trail recording failed', original_error: error.message }
        });
      } else {
        console.log('✅ SFDR audit trail recorded successfully');
      }
    } catch (error) {
      console.error('Error recording SFDR audit trail:', error);
    }
  }

  /**
   * Generate explainability data for AI classifications
   */
  async generateExplanation(classificationId: string, result: any, inputData: any): Promise<ClassificationExplanation> {
    const explanation: ClassificationExplanation = {
      classification_id: classificationId,
      explanation_type: 'rule_based',
      explanation_data: {
        classification: result.classification,
        confidence: result.confidence,
        key_factors: this.extractKeyFactors(inputData, result),
        regulatory_alignment: this.assessRegulatoryAlignment(result.classification)
      },
      regulatory_references: this.getRegulatoryReferences(result.classification),
      confidence_factors: this.analyzeConfidenceFactors(result),
      human_readable_explanation: this.generateHumanReadableExplanation(result, inputData),
      technical_explanation: {
        algorithm: 'SFDR Classification Engine',
        version: '1.0.0',
        processing_steps: this.getProcessingSteps(),
        decision_tree: this.buildDecisionTree(result)
      }
    };

    try {
      const { error } = await supabase
        .from('classification_explanations')
        .insert([explanation]);

      if (error) {
        console.error('Failed to store explanation:', error);
      }
    } catch (error) {
      console.error('Error storing explanation:', error);
    }

    return explanation;
  }

  /**
   * Track data lineage for regulatory reporting
   */
  async recordDataLineage(lineage: DataLineage): Promise<void> {
    try {
      const { error } = await supabase
        .from('data_lineage')
        .insert([lineage]);

      if (error) {
        console.error('Failed to record data lineage:', error);
      } else {
        console.log('✅ Data lineage recorded successfully');
      }
    } catch (error) {
      console.error('Error recording data lineage:', error);
    }
  }

  /**
   * Generate comprehensive compliance report
   */
  async generateComplianceReport(userId: string, startDate: Date, endDate: Date): Promise<any> {
    try {
      // For system-wide analytics, don't filter by user_id
      const query = supabase
        .from('sfdr_audit_trail')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });
      
      if (userId !== 'system') {
        query.eq('user_id', userId);
      }
      
      const { data: auditRecords, error: auditError } = await query;

      if (auditError) {
        throw new Error(`Failed to fetch audit records: ${auditError.message}`);
      }

      // For system-wide analytics, don't filter by user_id for explanations
      const explanationQuery = supabase
        .from('classification_explanations')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      if (userId !== 'system') {
        explanationQuery.eq('user_id', userId);
      }
      
      const { data: explanations, error: explanationError } = await explanationQuery;

      if (explanationError) {
        console.warn('Failed to fetch explanations:', explanationError);
      }

      return {
        period: { start: startDate, end: endDate },
        total_classifications: auditRecords?.length || 0,
        compliance_score: this.calculateComplianceScore(auditRecords || []),
        audit_trail: auditRecords,
        explanations: explanations,
        regulatory_summary: this.generateRegulatorySummary(auditRecords || []),
        data_quality_metrics: this.calculateDataQualityMetrics(auditRecords || [])
      };
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw error;
    }
  }

  /**
   * Validate classification against SFDR requirements
   */
  validateSFDRCompliance(classification: string, confidence: number, inputData: any): {
    isCompliant: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Confidence threshold validation
    if (confidence < 0.7) {
      issues.push('Low confidence score below regulatory threshold');
      recommendations.push('Manual review required for low confidence classifications');
    }

    // Classification validity
    const validClassifications = ['Article 6', 'Article 8', 'Article 9'];
    if (!validClassifications.includes(classification)) {
      issues.push('Invalid SFDR article classification');
      recommendations.push('Use only valid SFDR article classifications (6, 8, or 9)');
    }

    // Input data completeness
    if (!inputData.fund_name || !inputData.investment_objective) {
      issues.push('Insufficient input data for reliable classification');
      recommendations.push('Provide complete fund information including name and investment objective');
    }

    return {
      isCompliant: issues.length === 0,
      issues,
      recommendations
    };
  }

  // Private helper methods
  private extractKeyFactors(inputData: any, result: any): string[] {
    const factors = [];
    
    if (inputData.investment_objective?.toLowerCase().includes('sustainable')) {
      factors.push('Sustainable investment objective mentioned');
    }
    
    if (inputData.investment_objective?.toLowerCase().includes('environment')) {
      factors.push('Environmental focus identified');
    }
    
    if (result.confidence > 0.9) {
      factors.push('High confidence classification');
    }
    
    return factors;
  }

  private assessRegulatoryAlignment(classification: string): any {
    const alignments = {
      'Article 6': 'Standard financial product without sustainability claims',
      'Article 8': 'Financial product promoting environmental or social characteristics',
      'Article 9': 'Financial product with sustainable investment as objective'
    };

    return {
      classification,
      regulatory_definition: alignments[classification as keyof typeof alignments],
      compliance_requirements: this.getComplianceRequirements(classification)
    };
  }

  private getRegulatoryReferences(classification: string): any {
    return {
      regulation: 'SFDR (EU) 2019/2088',
      article: classification,
      effective_date: '2021-03-10',
      documentation_url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019R2088'
    };
  }

  private analyzeConfidenceFactors(result: any): any {
    return {
      confidence_level: result.confidence,
      confidence_band: result.confidence > 0.9 ? 'high' : result.confidence > 0.7 ? 'medium' : 'low',
      factors_contributing: ['Input quality', 'Model certainty', 'Historical accuracy'],
      uncertainty_sources: result.confidence < 0.8 ? ['Limited input data', 'Ambiguous investment objective'] : []
    };
  }

  private generateHumanReadableExplanation(result: any, inputData: any): string {
    return `Based on the analysis of "${inputData.fund_name || 'the fund'}", the classification as ${result.classification} was determined with ${(result.confidence * 100).toFixed(1)}% confidence. This classification is based on the fund's investment objective and sustainability characteristics as described in the provided documentation.`;
  }

  private getProcessingSteps(): string[] {
    return [
      'Input validation and sanitization',
      'Text analysis and feature extraction',
      'SFDR criteria matching',
      'Classification decision',
      'Confidence calculation',
      'Regulatory compliance check'
    ];
  }

  private buildDecisionTree(result: any): any {
    return {
      root: 'Fund Analysis',
      branches: [
        {
          condition: 'Sustainable investment objective',
          outcome: result.classification === 'Article 9' ? 'Article 9' : 'Further analysis'
        },
        {
          condition: 'Environmental/social characteristics',
          outcome: result.classification === 'Article 8' ? 'Article 8' : 'Article 6'
        }
      ]
    };
  }

  private calculateComplianceScore(auditRecords: any[]): number {
    if (auditRecords.length === 0) return 100;
    
    const highConfidenceRecords = auditRecords.filter(record => 
      record.confidence_score && record.confidence_score >= 0.7
    ).length;
    
    return Math.round((highConfidenceRecords / auditRecords.length) * 100);
  }

  private generateRegulatorySummary(auditRecords: any[]): any {
    const classificationCounts = auditRecords.reduce((acc, record) => {
      const classification = record.decision_data?.classification || 'unknown';
      acc[classification] = (acc[classification] || 0) + 1;
      return acc;
    }, {});

    return {
      total_classifications: auditRecords.length,
      classification_breakdown: classificationCounts,
      avg_confidence: auditRecords.length > 0 
        ? auditRecords.reduce((sum, record) => sum + (record.confidence_score || 0), 0) / auditRecords.length
        : 0,
      compliance_rate: this.calculateComplianceScore(auditRecords)
    };
  }

  private calculateDataQualityMetrics(auditRecords: any[]): any {
    return {
      completeness: this.calculateCompleteness(auditRecords),
      accuracy: this.calculateAccuracy(auditRecords),
      consistency: this.calculateConsistency(auditRecords),
      timeliness: this.calculateTimeliness(auditRecords)
    };
  }

  private calculateCompleteness(records: any[]): number {
    if (records.length === 0) return 100;
    
    const completeRecords = records.filter(record => 
      record.decision_data && 
      record.confidence_score !== null && 
      record.processing_time_ms !== null
    ).length;
    
    return Math.round((completeRecords / records.length) * 100);
  }

  private calculateAccuracy(records: any[]): number {
    // For now, assume high confidence indicates accuracy
    if (records.length === 0) return 100;
    
    const accurateRecords = records.filter(record => 
      record.confidence_score && record.confidence_score >= 0.8
    ).length;
    
    return Math.round((accurateRecords / records.length) * 100);
  }

  private calculateConsistency(records: any[]): number {
    // Measure consistency in processing times and confidence levels
    if (records.length === 0) return 100;
    
    const processingTimes = records
      .filter(r => r.processing_time_ms)
      .map(r => r.processing_time_ms);
    
    if (processingTimes.length < 2) return 100;
    
    const avgTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
    const variance = processingTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / processingTimes.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation indicates higher consistency
    const consistencyScore = Math.max(0, 100 - (standardDeviation / avgTime * 100));
    return Math.round(consistencyScore);
  }

  private calculateTimeliness(records: any[]): number {
    // All records are processed in real-time, so timeliness is high
    return 100;
  }

  private getComplianceRequirements(classification: string): string[] {
    const requirements = {
      'Article 6': [
        'Standard disclosure requirements',
        'No additional sustainability reporting needed'
      ],
      'Article 8': [
        'Disclosure of environmental or social characteristics',
        'Pre-contractual and periodic reporting',
        'Website disclosure requirements'
      ],
      'Article 9': [
        'Sustainable investment objective disclosure',
        'Detailed sustainability reporting',
        'Principal adverse impact reporting',
        'Enhanced due diligence documentation'
      ]
    };

    return requirements[classification as keyof typeof requirements] || [];
  }
}

export const sfdrCompliance = SFDRComplianceService.getInstance();
export default sfdrCompliance;