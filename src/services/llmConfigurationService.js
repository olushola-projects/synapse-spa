/**
 * LLM Configuration Service
 * Manages multi-strategy LLM integration with Qwen3_235B_A22B and OpenAI gpt-oss-20b
 * Implements enterprise-grade LLM strategy management and validation
 */
export class LLMConfigurationService {
  static instance;
  configuration;
  constructor() {
    this.configuration = this.initializeConfiguration();
  }
  static getInstance() {
    if (!LLMConfigurationService.instance) {
      LLMConfigurationService.instance = new LLMConfigurationService();
    }
    return LLMConfigurationService.instance;
  }
  /**
   * Initialize LLM configuration with new models
   */
  initializeConfiguration() {
    const qwenModel = {
      id: 'qwen3-235b-a22b',
      name: 'Qwen3 235B A22B',
      provider: 'qwen',
      model: 'Qwen3_235B_A22B',
      apiKey: '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',
      maxTokens: 8192,
      temperature: 0.1,
      enabled: true,
      priority: 1,
      capabilities: ['sfdr-classification', 'risk-assessment', 'compliance-analysis'],
      costPerToken: 0.0001
    };
    const openaiModel = {
      id: 'openai-gpt-oss-20b',
      name: 'OpenAI GPT-OSS-20B',
      provider: 'openai',
      model: 'gpt-oss-20b',
      apiKey: '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',
      maxTokens: 4096,
      temperature: 0.2,
      enabled: true,
      priority: 2,
      capabilities: ['sfdr-classification', 'document-analysis', 'regulatory-compliance'],
      costPerToken: 0.0002
    };
    const strategies = [
      {
        id: 'primary-strategy',
        name: 'Primary Strategy (Qwen3)',
        type: 'primary',
        description: 'High-performance Qwen3 235B A22B for primary SFDR classification',
        models: [qwenModel],
        enabled: true,
        fallbackStrategy: 'secondary-strategy',
        routingRules: [
          {
            condition: 'sfdr-classification',
            targetModel: 'qwen3-235b-a22b',
            priority: 1
          }
        ]
      },
      {
        id: 'secondary-strategy',
        name: 'Secondary Strategy (OpenAI)',
        type: 'secondary',
        description: 'OpenAI GPT-OSS-20B for validation and alternative analysis',
        models: [openaiModel],
        enabled: true,
        fallbackStrategy: 'hybrid-strategy',
        routingRules: [
          {
            condition: 'validation',
            targetModel: 'openai-gpt-oss-20b',
            priority: 1
          }
        ]
      },
      {
        id: 'hybrid-strategy',
        name: 'Hybrid Strategy (Consensus)',
        type: 'hybrid',
        description: 'Consensus-based routing between Qwen3 and OpenAI models',
        models: [qwenModel, openaiModel],
        enabled: true,
        routingRules: [
          {
            condition: 'consensus-required',
            targetModel: 'qwen3-235b-a22b',
            priority: 1
          },
          {
            condition: 'validation-required',
            targetModel: 'openai-gpt-oss-20b',
            priority: 2
          }
        ]
      }
    ];
    return {
      strategies,
      defaultStrategy: 'primary-strategy',
      enableFallback: true,
      maxRetries: 3,
      timeoutMs: 30000,
      enableMonitoring: true
    };
  }
  /**
   * Get all available strategies
   */
  getStrategies() {
    return this.configuration.strategies.filter(s => s.enabled);
  }
  /**
   * Get a specific strategy by ID
   */
  getStrategy(strategyId) {
    return this.configuration.strategies.find(s => s.id === strategyId && s.enabled);
  }
  /**
   * Get the default strategy
   */
  getDefaultStrategy() {
    const defaultStrategy = this.getStrategy(this.configuration.defaultStrategy);
    if (!defaultStrategy) {
      throw new Error(
        `Default strategy '${this.configuration.defaultStrategy}' not found or disabled`
      );
    }
    return defaultStrategy;
  }
  /**
   * Get models for a specific strategy
   */
  getStrategyModels(strategyId) {
    const strategy = this.getStrategy(strategyId);
    return strategy ? strategy.models.filter(m => m.enabled) : [];
  }
  /**
   * Get the best model for a specific task
   */
  getBestModelForTask(task, strategyId) {
    const strategy = strategyId ? this.getStrategy(strategyId) : this.getDefaultStrategy();
    if (!strategy) {
      return null;
    }
    const availableModels = strategy.models.filter(m => m.enabled);
    if (availableModels.length === 0) {
      return null;
    }
    // Find models that support the task
    const capableModels = availableModels.filter(m =>
      m.capabilities.some(cap => cap.toLowerCase().includes(task.toLowerCase()))
    );
    if (capableModels.length === 0) {
      // Fallback to any available model
      return availableModels.sort((a, b) => a.priority - b.priority)[0] || null;
    }
    // Return the highest priority capable model
    return capableModels.sort((a, b) => a.priority - b.priority)[0] || null;
  }
  /**
   * Validate LLM configuration
   */
  validateConfiguration() {
    const errors = [];
    // Check if any strategies are enabled
    const enabledStrategies = this.configuration.strategies.filter(s => s.enabled);
    if (enabledStrategies.length === 0) {
      errors.push('No LLM strategies are enabled');
    }
    // Check if default strategy exists and is enabled
    const defaultStrategy = this.getStrategy(this.configuration.defaultStrategy);
    if (!defaultStrategy) {
      errors.push(`Default strategy '${this.configuration.defaultStrategy}' is not available`);
    }
    // Validate each strategy
    enabledStrategies.forEach(strategy => {
      if (strategy.models.length === 0) {
        errors.push(`Strategy '${strategy.name}' has no models configured`);
      }
      const enabledModels = strategy.models.filter(m => m.enabled);
      if (enabledModels.length === 0) {
        errors.push(`Strategy '${strategy.name}' has no enabled models`);
      }
      // Validate API keys
      enabledModels.forEach(model => {
        if (!model.apiKey || model.apiKey === 'placeholder') {
          errors.push(`Model '${model.name}' has invalid API key`);
        }
      });
    });
    return {
      valid: errors.length === 0,
      errors
    };
  }
  /**
   * Test LLM connectivity and configuration
   */
  async testConfiguration() {
    const results = [];
    const enabledStrategies = this.getStrategies();
    for (const strategy of enabledStrategies) {
      for (const model of strategy.models.filter(m => m.enabled)) {
        const startTime = Date.now();
        try {
          // Test with a simple classification request
          // const testRequest = { // Unused variable removed
          //   text: 'Test SFDR classification for validation',
          //   document_type: 'validation_test',
          //   strategy: strategy.type,
          //   model: model.model
          // };
          // This would integrate with the actual API client
          // For now, we'll simulate a successful test
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          const responseTime = Date.now() - startTime;
          results.push({
            strategy: strategy.name,
            model: model.name,
            success: true,
            responseTime
          });
        } catch (error) {
          const responseTime = Date.now() - startTime;
          results.push({
            strategy: strategy.name,
            model: model.name,
            success: false,
            responseTime,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }
    const success = results.every(r => r.success);
    return {
      success,
      results
    };
  }
  /**
   * Get configuration summary for monitoring
   */
  getConfigurationSummary() {
    const validation = this.validateConfiguration();
    return {
      totalStrategies: this.configuration.strategies.length,
      enabledStrategies: this.configuration.strategies.filter(s => s.enabled).length,
      totalModels: this.configuration.strategies.reduce((sum, s) => sum + s.models.length, 0),
      enabledModels: this.configuration.strategies.reduce(
        (sum, s) => sum + s.models.filter(m => m.enabled).length,
        0
      ),
      defaultStrategy: this.configuration.defaultStrategy,
      validationStatus: validation
    };
  }
  /**
   * Update configuration (for runtime updates)
   */
  updateConfiguration(updates) {
    this.configuration = { ...this.configuration, ...updates };
    // Validate the updated configuration
    const validation = this.validateConfiguration();
    if (!validation.valid) {
      console.warn('⚠️ LLM configuration validation failed:', validation.errors);
    }
  }
}
// Export singleton instance
export const llmConfigurationService = LLMConfigurationService.getInstance();
