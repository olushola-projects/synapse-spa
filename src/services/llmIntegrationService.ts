/**
 * LLM Integration Service
 * Handles integration with Qwen3_235B_A22B and OpenAI gpt-oss-20b models
 * Implements intelligent routing, fallback, and consensus mechanisms
 */

import type { LLMStrategy, LLMModel } from './llmConfigurationService';
import { llmConfigurationService } from './llmConfigurationService';
import type { ClassificationRequest } from './backendApiClient';
import { backendApiClient, ClassificationResponse } from './backendApiClient';

export interface LLMRequest {
  text: string;
  document_type: string;
  strategy?: string;
  model?: string;
  provider?: 'qwen' | 'openai';
  maxTokens?: number;
  temperature?: number;
  useConsensus?: boolean;
}

export interface LLMResponse {
  success: boolean;
  classification?: string;
  confidence: number;
  processing_time: number;
  model_used: string;
  strategy_used: string;
  provider: string;
  consensus_results?: Array<{
    model: string;
    classification: string;
    confidence: number;
  }>;
  error?: string;
  metadata?: Record<string, any>;
}

export interface LLMHealthStatus {
  qwen: {
    status: 'healthy' | 'degraded' | 'unavailable';
    responseTime: number;
    lastChecked: string;
  };
  openai: {
    status: 'healthy' | 'degraded' | 'unavailable';
    responseTime: number;
    lastChecked: string;
  };
  overall: 'healthy' | 'degraded' | 'critical';
}

export class LLMIntegrationService {
  private static instance: LLMIntegrationService;
  private healthStatus: LLMHealthStatus;

  private constructor() {
    this.healthStatus = {
      qwen: { status: 'unavailable', responseTime: 0, lastChecked: new Date().toISOString() },
      openai: { status: 'unavailable', responseTime: 0, lastChecked: new Date().toISOString() },
      overall: 'critical'
    };
  }

  static getInstance(): LLMIntegrationService {
    if (!LLMIntegrationService.instance) {
      LLMIntegrationService.instance = new LLMIntegrationService();
    }
    return LLMIntegrationService.instance;
  }

  /**
   * Process classification request with intelligent model routing
   */
  async classifyDocument(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();

    try {
      console.log('🤖 Processing LLM classification request:', {
        strategy: request.strategy,
        model: request.model,
        provider: request.provider,
        useConsensus: request.useConsensus
      });

      // Determine the best strategy and model
      const strategy = this.determineStrategy(request);
      const model = this.determineModel(request, strategy);

      if (!model) {
        throw new Error('No suitable LLM model available');
      }

      // Prepare the classification request
      const classificationRequest: ClassificationRequest = {
        text: request.text,
        document_type: request.document_type,
        strategy: strategy.type,
        model: model.model,
        provider: model.provider
      };

      // Handle consensus-based classification
      if (request.useConsensus && strategy.type === 'hybrid') {
        return await this.processConsensusClassification(classificationRequest, strategy);
      }

      // Single model classification
      const response = await backendApiClient.classifyDocument(classificationRequest);
      const processingTime = Date.now() - startTime;

      if (response.error) {
        // Try fallback strategy
        return await this.handleFallback(request, response.error, processingTime);
      }

      // Update health status
      this.updateHealthStatus(model.provider, processingTime, true);

      return {
        success: true,
        classification: response.data?.classification,
        confidence: response.data?.confidence || 0,
        processing_time: processingTime,
        model_used: model.name,
        strategy_used: strategy.name,
        provider: model.provider,
        metadata: {
          tokens_used: response.data?.tokens_used,
          cost_estimate: this.calculateCost(model, response.data?.tokens_used || 0)
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('💥 LLM classification failed:', error);

      return {
        success: false,
        confidence: 0,
        processing_time: processingTime,
        model_used: request.model || 'unknown',
        strategy_used: request.strategy || 'unknown',
        provider: request.provider || 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Process consensus-based classification using multiple models
   */
  private async processConsensusClassification(
    request: ClassificationRequest,
    strategy: LLMStrategy
  ): Promise<LLMResponse> {
    const startTime = Date.now();
    const consensusResults: Array<{
      model: string;
      classification: string;
      confidence: number;
    }> = [];

    // Get all enabled models in the strategy
    const models = strategy.models.filter(m => m.enabled);

    if (models.length < 2) {
      throw new Error('Consensus classification requires at least 2 models');
    }

    // Process with each model
    for (const model of models) {
      try {
        const modelRequest = { ...request, model: model.model, provider: model.provider };
        const response = await backendApiClient.classifyDocument(modelRequest);

        if (response.data) {
          consensusResults.push({
            model: model.name,
            classification: response.data.classification,
            confidence: response.data.confidence || 0
          });
        }
      } catch (error) {
        console.warn(`⚠️ Consensus model ${model.name} failed:`, error);
      }
    }

    if (consensusResults.length === 0) {
      throw new Error('All consensus models failed');
    }

    // Calculate consensus
    const classifications = consensusResults.map(r => r.classification);
    const confidences = consensusResults.map(r => r.confidence);

    // Find most common classification
    const classificationCounts = classifications.reduce(
      (acc, classification) => {
        acc[classification] = (acc[classification] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const consensusClassification = Object.entries(classificationCounts).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    // Calculate average confidence
    const averageConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      classification: consensusClassification,
      confidence: averageConfidence,
      processing_time: processingTime,
      model_used: 'consensus',
      strategy_used: strategy.name,
      provider: 'hybrid',
      consensus_results: consensusResults,
      metadata: {
        consensus_agreement:
          Math.max(...Object.values(classificationCounts)) / classifications.length,
        models_used: consensusResults.length
      }
    };
  }

  /**
   * Handle fallback to alternative strategy
   */
  private async handleFallback(
    originalRequest: LLMRequest,
    originalError: string,
    originalProcessingTime: number
  ): Promise<LLMResponse> {
    console.log('🔄 Attempting fallback strategy...');

    const strategy = llmConfigurationService.getStrategy(
      originalRequest.strategy || 'primary-strategy'
    );
    if (!strategy?.fallbackStrategy) {
      throw new Error(`No fallback strategy available: ${originalError}`);
    }

    const fallbackStrategy = llmConfigurationService.getStrategy(strategy.fallbackStrategy);
    if (!fallbackStrategy) {
      throw new Error(`Fallback strategy '${strategy.fallbackStrategy}' not found`);
    }

    // Retry with fallback strategy
    const fallbackRequest: LLMRequest = {
      ...originalRequest,
      strategy: fallbackStrategy.id,
      useConsensus: false // Disable consensus for fallback to avoid complexity
    };

    const fallbackResponse = await this.classifyDocument(fallbackRequest);

    // Add fallback metadata
    fallbackResponse.metadata = {
      ...fallbackResponse.metadata,
      fallback_used: true,
      original_error: originalError,
      original_processing_time: originalProcessingTime
    };

    return fallbackResponse;
  }

  /**
   * Determine the best strategy for the request
   */
  private determineStrategy(request: LLMRequest): LLMStrategy {
    if (request.strategy) {
      const strategy = llmConfigurationService.getStrategy(request.strategy);
      if (strategy) {
        return strategy;
      }
    }

    // Default to primary strategy
    return llmConfigurationService.getDefaultStrategy();
  }

  /**
   * Determine the best model for the request
   */
  private determineModel(request: LLMRequest, strategy: LLMStrategy): LLMModel | null {
    // If specific model requested, try to use it
    if (request.model) {
      const requestedModel = strategy.models.find(m => m.model === request.model && m.enabled);
      if (requestedModel) {
        return requestedModel;
      }
    }

    // If specific provider requested, use best model from that provider
    if (request.provider) {
      const providerModels = strategy.models.filter(
        m => m.provider === request.provider && m.enabled
      );
      if (providerModels.length > 0) {
        return providerModels.sort((a, b) => a.priority - b.priority)[0];
      }
    }

    // Use best available model in strategy
    const availableModels = strategy.models.filter(m => m.enabled);
    return availableModels.sort((a, b) => a.priority - b.priority)[0] || null;
  }

  /**
   * Update health status for a provider
   */
  private updateHealthStatus(provider: string, responseTime: number, success: boolean): void {
    const status = success ? 'healthy' : 'degraded';

    if (provider === 'qwen') {
      this.healthStatus.qwen = {
        status: responseTime > 10000 ? 'degraded' : status,
        responseTime,
        lastChecked: new Date().toISOString()
      };
    } else if (provider === 'openai') {
      this.healthStatus.openai = {
        status: responseTime > 10000 ? 'degraded' : status,
        responseTime,
        lastChecked: new Date().toISOString()
      };
    }

    // Update overall status
    const allStatuses = [this.healthStatus.qwen.status, this.healthStatus.openai.status];
    if (allStatuses.every(s => s === 'healthy')) {
      this.healthStatus.overall = 'healthy';
    } else if (allStatuses.every(s => s === 'unavailable')) {
      this.healthStatus.overall = 'critical';
    } else {
      this.healthStatus.overall = 'degraded';
    }
  }

  /**
   * Calculate cost for the request
   */
  private calculateCost(model: LLMModel, tokensUsed: number): number {
    return model.costPerToken * tokensUsed;
  }

  /**
   * Get current health status
   */
  getHealthStatus(): LLMHealthStatus {
    return { ...this.healthStatus };
  }

  /**
   * Test connectivity to all LLM providers
   */
  async testConnectivity(): Promise<{
    success: boolean;
    results: Array<{
      provider: string;
      status: 'healthy' | 'degraded' | 'unavailable';
      responseTime: number;
      error?: string;
    }>;
  }> {
    const results: Array<{
      provider: string;
      status: 'healthy' | 'degraded' | 'unavailable';
      responseTime: number;
      error?: string;
    }> = [];

    const testRequest: LLMRequest = {
      text: 'Test connectivity for SFDR classification',
      document_type: 'connectivity_test',
      useConsensus: false
    };

    // Test Qwen
    try {
      const startTime = Date.now();
      const response = await this.classifyDocument({
        ...testRequest,
        provider: 'qwen'
      });
      const responseTime = Date.now() - startTime;

      results.push({
        provider: 'qwen',
        status: response.success ? 'healthy' : 'degraded',
        responseTime,
        error: response.error
      });
    } catch (error) {
      results.push({
        provider: 'qwen',
        status: 'unavailable',
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test OpenAI
    try {
      const startTime = Date.now();
      const response = await this.classifyDocument({
        ...testRequest,
        provider: 'openai'
      });
      const responseTime = Date.now() - startTime;

      results.push({
        provider: 'openai',
        status: response.success ? 'healthy' : 'degraded',
        responseTime,
        error: response.error
      });
    } catch (error) {
      results.push({
        provider: 'openai',
        status: 'unavailable',
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    const success = results.some(r => r.status === 'healthy');

    return { success, results };
  }

  /**
   * Get configuration summary
   */
  getConfigurationSummary() {
    return llmConfigurationService.getConfigurationSummary();
  }
}

// Export singleton instance
export const llmIntegrationService = LLMIntegrationService.getInstance();
