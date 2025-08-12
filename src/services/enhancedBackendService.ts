/**
 * Enhanced Backend Service
 * Centralized service for all backend operations with quality assurance integration
 * Implements comprehensive monitoring, compliance, and performance optimization
 */

import { supabase } from '@/integrations/supabase/client';
import { qualityAssurance } from './qualityAssuranceService';

export interface ClassificationRequest {
  text: string;
  document_type: string;
  strategy?: 'primary' | 'secondary' | 'hybrid';
  fund_name?: string;
  investment_objective?: string;
  user_id?: string;
}

export interface ClassificationResponse {
  classification: string;
  confidence: number;
  processing_time: number;
  explanation?: string;
  regulatory_basis?: string;
  quality_metrics?: any;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    nexus_api: boolean;
    database: boolean;
    monitoring: boolean;
  };
}

class EnhancedBackendService {
  private static instance: EnhancedBackendService;
  
  public static getInstance(): EnhancedBackendService {
    if (!EnhancedBackendService.instance) {
      EnhancedBackendService.instance = new EnhancedBackendService();
    }
    return EnhancedBackendService.instance;
  }

  /**
   * Enhanced classification with quality assurance and compliance tracking
   */
  async classifyDocument(request: ClassificationRequest): Promise<ClassificationResponse> {
    const startTime = Date.now();
    let response: ClassificationResponse;
    
    try {
      // Generate unique classification ID for audit trail
      const classificationId = crypto.randomUUID();
      
      // Call Nexus API through secure proxy
      const { data, error } = await supabase.functions.invoke('nexus-proxy', {
        body: {
          method: 'POST',
          endpoint: 'api/classify',
          data: {
            text: request.text,
            document_type: request.document_type,
            strategy: request.strategy || 'primary',
            timestamp: new Date().toISOString()
          },
          userId: request.user_id
        }
      });

      if (error) {
        throw new Error(`Classification failed: ${error.message}`);
      }

      const processingTime = Date.now() - startTime;
      
      response = {
        classification: data.data?.classification || 'Article 6',
        confidence: data.data?.confidence || 0,
        processing_time: processingTime,
        explanation: data.data?.explanation,
        regulatory_basis: data.data?.regulatory_basis
      };

      // Quality assurance validation
      const qualityCheck = await qualityAssurance.validateResponseQuality(response, processingTime);
      response.quality_metrics = qualityCheck.metrics;

      // SFDR compliance validation
      const complianceCheck = this.validateSFDRCompliance(
        response.classification, 
        response.confidence, 
        request
      );

      // Record comprehensive audit trail using existing LLM audit table
      try {
        const { error: auditError } = await supabase
          .from('llm_classification_audit')
          .insert([{
            user_id: request.user_id,
            input_text: request.text,
            classification_result: response.classification,
            llm_strategy: request.strategy || 'primary',
            confidence_score: response.confidence,
            processing_time_ms: processingTime,
            document_type: request.document_type,
            regulatory_flags: complianceCheck.issues.length > 0 ? { issues: complianceCheck.issues } : null,
            explainability_data: {
              quality_check: qualityCheck,
              compliance_check: complianceCheck,
              classification_id: classificationId
            },
            api_key_hash: await this.hashInput('nexus_api_key'),
            model_version: 'enhanced_v1.0'
          }]);

        if (auditError) {
          console.error('Failed to record audit trail:', auditError);
        }
      } catch (auditErr) {
        console.error('Error recording audit trail:', auditErr);
      }

      // Store classification data in compliance assessments
      try {
        const { error: assessmentError } = await supabase
          .from('compliance_assessments')
          .insert([{
            user_id: request.user_id || '',
            fund_name: request.fund_name || 'Unknown Fund',
            entity_id: classificationId,
            target_article: response.classification,
            assessment_data: {
              input: request,
              processing_pipeline: 'enhanced_classification_v1.0',
              data_sources: {
                input_source: 'user_provided',
                classification_model: 'nexus_api',
                regulatory_framework: 'SFDR_EU_2019_2088'
              }
            },
            validation_results: {
              quality_metrics: qualityCheck.metrics,
              compliance_status: complianceCheck
            },
            compliance_score: Math.round(response.confidence * 100),
            status: complianceCheck.isCompliant ? 'validated' : 'needs_review'
          }]);

        if (assessmentError) {
          console.error('Failed to record compliance assessment:', assessmentError);
        }
      } catch (assessmentErr) {
        console.error('Error recording compliance assessment:', assessmentErr);
      }

      // Record system health metrics
      try {
        const { error: healthError } = await supabase
          .from('system_health_metrics')
          .insert([{
            service_name: 'enhanced_classification',
            status: qualityCheck.isValid ? 'healthy' : 'warning',
            response_time_ms: processingTime,
            error_rate: qualityCheck.isValid ? 0 : 1,
            alert_threshold_breached: !qualityCheck.isValid,
            details: {
              classification_id: classificationId,
              confidence: response.confidence,
              quality_issues: qualityCheck.issues,
              compliance_status: complianceCheck.isCompliant
            }
          }]);

        if (healthError) {
          console.error('Failed to record health metrics:', healthError);
        }
      } catch (healthErr) {
        console.error('Error recording health metrics:', healthErr);
      }

      return response;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      // Record failure metrics
      try {
        await supabase
          .from('system_health_metrics')
          .insert([{
            service_name: 'enhanced_classification',
            status: 'critical',
            response_time_ms: processingTime,
            error_rate: 1,
            alert_threshold_breached: true,
            details: {
              error: error instanceof Error ? error.message : 'Unknown error',
              request_data: request
            }
          }]);
      } catch (healthErr) {
        console.error('Error recording failure metrics:', healthErr);
      }

      throw error;
    }
  }

  /**
   * Enhanced health check with comprehensive service monitoring
   */
  async performHealthCheck(): Promise<HealthCheckResponse> {
    const startTime = Date.now();
    
    try {
      // Check Nexus API health
      const { data: nexusHealth, error: nexusError } = await supabase.functions.invoke('nexus-proxy', {
        body: {
          method: 'GET',
          endpoint: 'api/health'
        }
      });

      const nexusHealthy = !nexusError && nexusHealth?.data?.status === 'healthy';

      // Check database connectivity  
      const { error: dbError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      const dbHealthy = !dbError;

      // Check monitoring service
      const monitoringHealthy = await this.checkMonitoringHealth();

      const overallStatus = nexusHealthy && dbHealthy && monitoringHealthy 
        ? 'healthy' 
        : (nexusHealthy || dbHealthy) 
          ? 'degraded' 
          : 'down';

      const response: HealthCheckResponse = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: nexusHealth?.data?.uptime || 0,
        services: {
          nexus_api: nexusHealthy,
          database: dbHealthy,
          monitoring: monitoringHealthy
        }
      };

      // Record health check metrics
      const processingTime = Date.now() - startTime;
      try {
        await supabase
          .from('system_health_metrics')
          .insert([{
            service_name: 'health_check',
            status: overallStatus,
            response_time_ms: processingTime,
            error_rate: overallStatus === 'healthy' ? 0 : 0.5,
            alert_threshold_breached: overallStatus !== 'healthy',
            details: response
          }]);
      } catch (healthErr) {
        console.error('Error recording health check metrics:', healthErr);
      }

      return response;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      try {
        await supabase
          .from('system_health_metrics')
          .insert([{
            service_name: 'health_check',
            status: 'critical',
            response_time_ms: processingTime,
            error_rate: 1,
            alert_threshold_breached: true,
            details: { error: error instanceof Error ? error.message : 'Health check failed' }
          }]);
      } catch (healthErr) {
        console.error('Error recording health check failure:', healthErr);
      }

      throw error;
    }
  }

  /**
   * Get comprehensive system analytics
   */
  async getSystemAnalytics(filters: { startDate?: Date; endDate?: Date } = {}): Promise<any> {
    try {
      const endDate = filters.endDate || new Date();
      const startDate = filters.startDate || new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

      // Get system health metrics
      const { data: healthMetrics } = await supabase
        .from('system_health_metrics')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: false });

      // Get LLM audit data for quality metrics
      const { data: auditData } = await supabase
        .from('llm_classification_audit')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: false });

      // Get compliance assessments
      const { data: assessments } = await supabase
        .from('compliance_assessments')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      const systemOverview = this.calculateSystemOverview(healthMetrics || []);
      const qualityData = this.calculateQualityMetrics(auditData || []);
      const complianceReport = this.generateComplianceReport(assessments || []);

      return {
        time_range: { start: startDate, end: endDate },
        system_overview: systemOverview,
        quality_metrics: qualityData,
        compliance_status: complianceReport,
        performance_summary: {
          total_classifications: complianceReport.total_classifications,
          avg_confidence: complianceReport.avg_confidence,
          avg_response_time: qualityData.avg_response_time,
          uptime_percentage: systemOverview.uptime_percentage,
          compliance_score: complianceReport.compliance_score
        }
      };
    } catch (error) {
      console.error('Error getting system analytics:', error);
      throw error;
    }
  }

  /**
   * Upload and process document for classification
   */
  async uploadDocument(file: File, userId?: string): Promise<any> {
    try {
      // Upload to Supabase storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Record document metadata
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          filename: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: uploadData.path,
          document_type: this.inferDocumentType(file.name, file.type),
          processing_status: 'uploaded',
          user_id: userId || ''
        })
        .select()
        .single();

      if (documentError) {
        throw new Error(`Document record creation failed: ${documentError.message}`);
      }

      return {
        document_id: documentData.id,
        filename: file.name,
        storage_path: uploadData.path,
        processing_status: 'uploaded'
      };

    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  // Helper methods
  private validateSFDRCompliance(classification: string, confidence: number, inputData: any): {
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

    return {
      isCompliant: issues.length === 0,
      issues,
      recommendations
    };
  }

  private calculateSystemOverview(metrics: any[]): any {
    if (metrics.length === 0) {
      return { uptime_percentage: 100, avg_response_time: 0, error_rate: 0 };
    }

    const healthyCount = metrics.filter(m => m.status === 'healthy').length;
    const avgResponseTime = metrics.reduce((sum, m) => sum + (m.response_time_ms || 0), 0) / metrics.length;
    const errorRate = metrics.reduce((sum, m) => sum + (m.error_rate || 0), 0) / metrics.length;

    return {
      uptime_percentage: (healthyCount / metrics.length) * 100,
      avg_response_time: avgResponseTime,
      error_rate: errorRate,
      total_metrics: metrics.length
    };
  }

  private calculateQualityMetrics(auditData: any[]): any {
    if (auditData.length === 0) {
      return { avg_response_time: 0, avg_confidence: 0, total_classifications: 0 };
    }

    const avgResponseTime = auditData.reduce((sum, a) => sum + (a.processing_time_ms || 0), 0) / auditData.length;
    const avgConfidence = auditData.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / auditData.length;

    return {
      avg_response_time: avgResponseTime,
      avg_confidence: avgConfidence,
      total_classifications: auditData.length,
      high_confidence_rate: auditData.filter(a => a.confidence_score >= 0.8).length / auditData.length * 100
    };
  }

  private generateComplianceReport(assessments: any[]): any {
    if (assessments.length === 0) {
      return { total_classifications: 0, avg_confidence: 0, compliance_score: 100 };
    }

    const avgConfidence = assessments.reduce((sum, a) => sum + (a.compliance_score || 0), 0) / assessments.length / 100;
    const validatedCount = assessments.filter(a => a.status === 'validated').length;
    const complianceScore = (validatedCount / assessments.length) * 100;

    return {
      total_classifications: assessments.length,
      avg_confidence: avgConfidence,
      compliance_score: complianceScore,
      status_breakdown: this.groupByStatus(assessments)
    };
  }

  private groupByStatus(assessments: any[]): any {
    return assessments.reduce((acc, assessment) => {
      const status = assessment.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }

  private async hashInput(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async hashOutput(output: any): Promise<string> {
    return this.hashInput(JSON.stringify(output));
  }

  private async checkMonitoringHealth(): Promise<boolean> {
    try {
      // Simple check to see if we can access system health metrics
      const { error } = await supabase
        .from('system_health_metrics')
        .select('id')
        .limit(1);
      return !error;
    } catch (error) {
      return false;
    }
  }

  private inferDocumentType(filename: string, mimeType: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    
    if (mimeType.includes('pdf') || ext === 'pdf') return 'fund_prospectus';
    if (mimeType.includes('word') || ['doc', 'docx'].includes(ext || '')) return 'regulatory_document';
    if (mimeType.includes('excel') || ['xls', 'xlsx'].includes(ext || '')) return 'financial_data';
    if (mimeType.includes('text') || ext === 'txt') return 'text_document';
    
    return 'general_document';
  }
}

export const enhancedBackend = EnhancedBackendService.getInstance();
export default enhancedBackend;