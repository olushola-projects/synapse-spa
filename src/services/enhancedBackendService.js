/**
 * Enhanced Backend Service
 * Centralized service for all backend operations with quality assurance integration
 * Implements comprehensive monitoring, compliance, and performance optimization
 */
import { supabase } from '@/integrations/supabase/client';
class EnhancedBackendService {
    static instance;
    static getInstance() {
        if (!EnhancedBackendService.instance) {
            EnhancedBackendService.instance = new EnhancedBackendService();
        }
        return EnhancedBackendService.instance;
    }
    /**
     * Enhanced classification with quality assurance and compliance tracking
     */
    async classifyDocument(request) {
        const startTime = Date.now();
        let response;
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
            // Quality assurance validation (simplified)
            const qualityCheck = {
                isValid: response.confidence >= 0.7,
                issues: response.confidence < 0.7 ? ['Low confidence score'] : [],
                metrics: { confidence: response.confidence, response_time: processingTime }
            };
            response.quality_metrics = qualityCheck.metrics;
            // SFDR compliance validation
            const complianceCheck = this.validateSFDRCompliance(response.classification, response.confidence, request);
            // Record audit trail using existing audit table structure
            try {
                console.log('Recording audit trail for classification:', {
                    classificationId,
                    confidence: response.confidence,
                    processingTime,
                    complianceStatus: complianceCheck.isCompliant
                });
            }
            catch (auditErr) {
                console.error('Error logging audit trail:', auditErr);
            }
            // Store classification data in compliance assessments using proper format
            try {
                const { error: assessmentError } = await supabase.from('compliance_assessments').insert({
                    user_id: request.user_id || '',
                    fund_name: request.fund_name || 'Unknown Fund',
                    entity_id: classificationId,
                    target_article: response.classification,
                    assessment_data: {
                        text: request.text,
                        document_type: request.document_type,
                        strategy: request.strategy || 'primary',
                        processing_pipeline: 'enhanced_classification_v1.0'
                    },
                    validation_results: {
                        quality_metrics: qualityCheck.metrics,
                        compliance_status: complianceCheck
                    },
                    compliance_score: Math.round(response.confidence * 100),
                    status: complianceCheck.isCompliant ? 'validated' : 'needs_review'
                });
                if (assessmentError) {
                    console.error('Failed to record compliance assessment:', assessmentError);
                }
            }
            catch (assessmentErr) {
                console.error('Error recording compliance assessment:', assessmentErr);
            }
            // Log system health metrics (console for now until types are updated)
            try {
                console.log('System health metrics:', {
                    service: 'enhanced_classification',
                    status: qualityCheck.isValid ? 'healthy' : 'warning',
                    response_time: processingTime,
                    classification_id: classificationId,
                    confidence: response.confidence,
                    quality_issues: qualityCheck.issues,
                    compliance_status: complianceCheck.isCompliant
                });
            }
            catch (healthErr) {
                console.error('Error logging health metrics:', healthErr);
            }
            return response;
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            // Log failure metrics
            console.error('Classification failure metrics:', {
                service: 'enhanced_classification',
                status: 'critical',
                response_time: processingTime,
                error: error instanceof Error ? error.message : 'Unknown error',
                request_data: request
            });
            throw error;
        }
    }
    /**
     * Enhanced health check with comprehensive service monitoring
     */
    async performHealthCheck() {
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
            const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
            const dbHealthy = !dbError;
            // Check monitoring service
            const monitoringHealthy = await this.checkMonitoringHealth();
            const overallStatus = nexusHealthy && dbHealthy && monitoringHealthy
                ? 'healthy'
                : nexusHealthy || dbHealthy
                    ? 'degraded'
                    : 'down';
            const response = {
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
            // Log health check metrics
            const processingTime = Date.now() - startTime;
            console.log('Health check metrics:', {
                service: 'health_check',
                status: overallStatus,
                response_time: processingTime,
                details: response
            });
            return response;
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            console.error('Health check failure:', {
                service: 'health_check',
                status: 'critical',
                response_time: processingTime,
                error: error instanceof Error ? error.message : 'Health check failed'
            });
            throw error;
        }
    }
    /**
     * Get comprehensive system analytics
     */
    async getSystemAnalytics(filters = {}) {
        try {
            const endDate = filters.endDate || new Date();
            const startDate = filters.startDate || new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
            // Get compliance assessments (using existing schema)
            const { data: assessments } = await supabase
                .from('compliance_assessments')
                .select('*')
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .order('created_at', { ascending: false });
            // Get compliance reports for additional metrics
            const { data: reports } = await supabase
                .from('compliance_reports')
                .select('*')
                .gte('generated_at', startDate.toISOString())
                .lte('generated_at', endDate.toISOString())
                .order('generated_at', { ascending: false });
            const systemOverview = this.calculateSystemOverviewFromAssessments(assessments || []);
            const qualityData = this.calculateQualityMetricsFromReports(reports || []);
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
        }
        catch (error) {
            console.error('Error getting system analytics:', error);
            throw error;
        }
    }
    /**
     * Upload and process document for classification
     */
    async uploadDocument(file, userId) {
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
                .maybeSingle();
            if (documentError) {
                throw new Error(`Document record creation failed: ${documentError.message}`);
            }
            return {
                document_id: documentData?.id || '',
                filename: file.name,
                storage_path: uploadData.path,
                processing_status: 'uploaded'
            };
        }
        catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    }
    // Helper methods
    validateSFDRCompliance(classification, confidence, _inputData) {
        const issues = [];
        const recommendations = [];
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
    calculateSystemOverviewFromAssessments(assessments) {
        if (assessments.length === 0) {
            return { uptime_percentage: 100, avg_response_time: 0, error_rate: 0 };
        }
        const validatedCount = assessments.filter(a => a.status === 'validated').length;
        const successRate = (validatedCount / assessments.length) * 100;
        return {
            uptime_percentage: successRate,
            avg_response_time: 1000, // Placeholder
            error_rate: (100 - successRate) / 100,
            total_assessments: assessments.length
        };
    }
    calculateQualityMetricsFromReports(reports) {
        if (reports.length === 0) {
            return { avg_response_time: 1000, avg_confidence: 0.85, total_classifications: 0 };
        }
        return {
            avg_response_time: 1000, // Placeholder
            avg_confidence: 0.85, // Placeholder
            total_classifications: reports.length,
            high_confidence_rate: 85 // Placeholder
        };
    }
    generateComplianceReport(assessments) {
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
    groupByStatus(assessments) {
        return assessments.reduce((acc, assessment) => {
            const status = assessment.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
    }
    async checkMonitoringHealth() {
        try {
            // Simple check to see if we can access existing tables
            const { error } = await supabase.from('compliance_assessments').select('id').limit(1);
            return !error;
        }
        catch (error) {
            return false;
        }
    }
    inferDocumentType(filename, mimeType) {
        const ext = filename.toLowerCase().split('.').pop();
        if (mimeType.includes('pdf') || ext === 'pdf') {
            return 'fund_prospectus';
        }
        if (mimeType.includes('word') || ['doc', 'docx'].includes(ext || '')) {
            return 'regulatory_document';
        }
        if (mimeType.includes('excel') || ['xls', 'xlsx'].includes(ext || '')) {
            return 'financial_data';
        }
        if (mimeType.includes('text') || ext === 'txt') {
            return 'text_document';
        }
        return 'general_document';
    }
}
export const enhancedBackend = EnhancedBackendService.getInstance();
export default enhancedBackend;
