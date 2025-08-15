/**
 * LLM Strategy Validation Service
 * Validates and tests all LLM strategies (Primary, Secondary, Hybrid)
 * Implements enterprise-grade LLM integration verification
 */

import type { ClassificationRequest, ClassificationResponse } from './backendApiClient';
import { backendApiClient } from './backendApiClient';

export interface LLMStrategy {
  name: string;
  type: 'primary' | 'secondary' | 'hybrid';
  description: string;
  expectedModel: string;
  enabled: boolean;
}

export interface LLMValidationResult {
  strategy: LLMStrategy;
  success: boolean;
  responseTime: number;
  confidence: number;
  error?: string;
  classification?: string;
  responseData?: any;
  timestamp: string;
}

export interface LLMValidationSummary {
  totalStrategies: number;
  successfulStrategies: number;
  failedStrategies: number;
  averageResponseTime: number;
  overallStatus: 'healthy' | 'degraded' | 'critical';
  recommendations: string[];
  testResults: LLMValidationResult[];
}

export class LLMValidationService {
  private static instance: LLMValidationService;

  private strategies: LLMStrategy[] = [
    {
      name: 'Primary LLM',
      type: 'primary',
      description: 'GPT-4 Turbo for high-accuracy SFDR classification',
      expectedModel: 'gpt-4-turbo',
      enabled: true
    },
    {
      name: 'Secondary LLM',
      type: 'secondary',
      description: 'Claude-3 for alternative perspective and validation',
      expectedModel: 'claude-3-sonnet',
      enabled: true
    },
    {
      name: 'Hybrid LLM',
      type: 'hybrid',
      description: 'Consensus-based routing between Primary and Secondary',
      expectedModel: 'multi-model',
      enabled: true
    }
  ];

  static getInstance(): LLMValidationService {
    if (!LLMValidationService.instance) {
      LLMValidationService.instance = new LLMValidationService();
    }
    return LLMValidationService.instance;
  }

  /**
   * Validate all LLM strategies with comprehensive testing
   */
  async validateAllStrategies(): Promise<LLMValidationSummary> {
    console.log('🤖 Starting comprehensive LLM strategy validation...');

    const testResults: LLMValidationResult[] = [];

    // Test each strategy with standardized test case
    for (const strategy of this.strategies) {
      if (!strategy.enabled) {
        console.log(`⏭️ Skipping disabled strategy: ${strategy.name}`);
        continue;
      }

      const result = await this.validateStrategy(strategy);
      testResults.push(result);

      // Log results immediately for debugging
      if (result.success) {
        console.log(`✅ ${strategy.name} validation successful: ${result.responseTime}ms`);
      } else {
        console.error(`❌ ${strategy.name} validation failed:`, result.error);
      }
    }

    // Calculate summary metrics
    const successful = testResults.filter(r => r.success);
    const failed = testResults.filter(r => !r.success);
    const avgResponseTime =
      successful.length > 0
        ? successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length
        : 0;

    // Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'critical';
    if (failed.length === 0) {
      overallStatus = 'healthy';
    } else if (successful.length > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'critical';
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(testResults);

    const summary: LLMValidationSummary = {
      totalStrategies: this.strategies.filter(s => s.enabled).length,
      successfulStrategies: successful.length,
      failedStrategies: failed.length,
      averageResponseTime: avgResponseTime,
      overallStatus,
      recommendations,
      testResults
    };

    // Log summary
    console.log('🔍 LLM Validation Summary:', {
      status: summary.overallStatus,
      success_rate: `${successful.length}/${testResults.length}`,
      avg_response_time: `${avgResponseTime.toFixed(0)}ms`
    });

    // Save validation results to Supabase for audit trail
    await this.saveValidationResults(summary);

    return summary;
  }

  /**
   * Validate a specific LLM strategy
   */
  private async validateStrategy(strategy: LLMStrategy): Promise<LLMValidationResult> {
    const startTime = Date.now();

    try {
      // Standard test case for SFDR classification
      const testRequest: ClassificationRequest = {
        text: this.getStandardTestCase(),
        document_type: 'validation_test',
        strategy: strategy.type
      };

      console.log(`🧪 Testing ${strategy.name} with strategy: ${strategy.type}`);

      const response = await backendApiClient.classifyDocument(testRequest);
      const responseTime = Date.now() - startTime;

      if (response.error) {
        return {
          strategy,
          success: false,
          responseTime,
          confidence: 0,
          error: response.error,
          timestamp: new Date().toISOString()
        };
      }

      // Validate response structure and content
      const validationErrors = this.validateResponse(response.data);
      if (validationErrors.length > 0) {
        return {
          strategy,
          success: false,
          responseTime,
          confidence: 0,
          error: `Response validation failed: ${validationErrors.join(', ')}`,
          responseData: response.data,
          timestamp: new Date().toISOString()
        };
      }

      return {
        strategy,
        success: true,
        responseTime,
        confidence: response.data!.confidence,
        classification: response.data!.classification,
        responseData: response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        strategy,
        success: false,
        responseTime,
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Standard test case for LLM validation
   */
  private getStandardTestCase(): string {
    return `Fund Name: Green Transition Bond Fund
Investment Objective: To invest at least 80% of assets in bonds issued to finance environmentally sustainable projects that contribute to climate change mitigation and adaptation.
Target Article Classification: Article 9
Sustainability Characteristics: Climate change mitigation, Sustainable water and marine resources, Transition to circular economy
PAI Consideration: The fund considers principal adverse impacts on sustainability factors through exclusion policies and engagement activities.
EU Taxonomy Alignment: 75% taxonomy-aligned investments based on environmental objectives.`;
  }

  /**
   * Validate LLM response structure and content
   */
  private validateResponse(data: ClassificationResponse | undefined): string[] {
    const errors: string[] = [];

    if (!data) {
      errors.push('No response data received');
      return errors;
    }

    // Check required fields
    if (!data.classification) {
      errors.push('Missing classification field');
    }

    if (typeof data.confidence !== 'number') {
      errors.push('Missing or invalid confidence field');
    }

    if (typeof data.processing_time !== 'number') {
      errors.push('Missing or invalid processing_time field');
    }

    // Validate classification values
    const validClassifications = ['Article 6', 'Article 8', 'Article 9'];
    if (data.classification && !validClassifications.includes(data.classification)) {
      errors.push(`Invalid classification: ${data.classification}`);
    }

    // Validate confidence range
    if (typeof data.confidence === 'number' && (data.confidence < 0 || data.confidence > 1)) {
      errors.push(`Confidence out of range: ${data.confidence}`);
    }

    return errors;
  }

  /**
   * Generate recommendations based on validation results
   */
  private generateRecommendations(results: LLMValidationResult[]): string[] {
    const recommendations: string[] = [];
    const failed = results.filter(r => !r.success);
    const successful = results.filter(r => r.success);

    if (failed.length === results.length) {
      recommendations.push(
        '🚨 CRITICAL: All LLM strategies failed - check API authentication and connectivity'
      );
      recommendations.push('🔧 Verify NEXUS_API_KEY is properly configured in Supabase secrets');
      recommendations.push('🌐 Check network connectivity to api.joinsynapses.com');
    } else if (failed.length > 0) {
      recommendations.push(
        `⚠️ ${failed.length} strategy(ies) failed - system running in degraded mode`
      );

      failed.forEach(result => {
        recommendations.push(`🔍 ${result.strategy.name}: ${result.error}`);
      });
    }

    if (successful.length > 0) {
      const avgResponseTime =
        successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
      if (avgResponseTime > 10000) {
        recommendations.push(
          `⏱️ High response times detected (${avgResponseTime.toFixed(0)}ms) - consider performance optimization`
        );
      }

      const lowConfidence = successful.filter(r => r.confidence < 0.7);
      if (lowConfidence.length > 0) {
        recommendations.push(
          `📊 ${lowConfidence.length} strategy(ies) showing low confidence - review model training data`
        );
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All LLM strategies operating optimally');
    }

    return recommendations;
  }

  /**
   * Save validation results locally for audit trail
   */
  private async saveValidationResults(summary: LLMValidationSummary): Promise<void> {
    try {
      // Save to localStorage for now (in production, this would go to a logging service)
      const validationHistory = this.getValidationHistory();
      validationHistory.push({
        ...summary,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      });

      // Keep only last 50 validation runs
      if (validationHistory.length > 50) {
        validationHistory.splice(0, validationHistory.length - 50);
      }

      localStorage.setItem('llm_validation_history', JSON.stringify(validationHistory));
      console.log('📊 LLM validation results saved to local audit trail');
    } catch (error) {
      console.warn('Error saving LLM validation results:', error);
    }
  }

  /**
   * Get validation history from localStorage
   */
  private getValidationHistory(): any[] {
    try {
      const history = localStorage.getItem('llm_validation_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.warn('Error reading validation history:', error);
      return [];
    }
  }
}

// Export singleton instance
export const llmValidationService = LLMValidationService.getInstance();
