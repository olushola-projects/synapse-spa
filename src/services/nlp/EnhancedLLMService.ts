import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';
import { supabase } from '../supabase';

// Enhanced types for multi-model LLM support
export interface LLMResponse {
  text: string;
  confidence: number;
  model: string;
  tokens: number;
  latency: number;
  reasoning?: string;
  citations?: string[];
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  tokens: number;
}

export interface ModelCapabilities {
  reasoning: boolean;
  coding: boolean;
  multilingual: boolean;
  contextLength: number;
  specializations: string[];
}

export interface LLMConfig {
  provider: 'openai' | 'huggingface' | 'ollama' | 'local';
  model: string;
  maxTokens: number;
  temperature: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

// Model registry for different use cases
const MODEL_REGISTRY = {
  // Edge-first models for fast inference
  edge: {
    'qwen3-0.6b': {
      provider: 'huggingface' as const,
      model: 'Qwen/Qwen3-0.6B-Instruct',
      capabilities: {
        reasoning: true,
        coding: false,
        multilingual: true,
        contextLength: 32768,
        specializations: ['general', 'multilingual']
      }
    },
    'gemma3-1b': {
      provider: 'huggingface' as const,
      model: 'google/gemma-3-1b-it',
      capabilities: {
        reasoning: true,
        coding: false,
        multilingual: false,
        contextLength: 8192,
        specializations: ['general', 'fast-inference']
      }
    },
    'phi-3.5-mini': {
      provider: 'huggingface' as const,
      model: 'microsoft/Phi-3.5-mini-instruct',
      capabilities: {
        reasoning: true,
        coding: true,
        multilingual: false,
        contextLength: 128000,
        specializations: ['reasoning', 'coding']
      }
    }
  },
  // Cloud models for complex tasks
  cloud: {
    'qwen3-72b': {
      provider: 'huggingface' as const,
      model: 'Qwen/Qwen3-72B-Instruct',
      capabilities: {
        reasoning: true,
        coding: true,
        multilingual: true,
        contextLength: 32768,
        specializations: ['complex-reasoning', 'multilingual', 'coding']
      }
    },
    'gemma3-27b': {
      provider: 'huggingface' as const,
      model: 'google/gemma-3-27b-it',
      capabilities: {
        reasoning: true,
        coding: true,
        multilingual: false,
        contextLength: 8192,
        specializations: ['complex-reasoning', 'coding']
      }
    },
    'gpt-4o-mini': {
      provider: 'openai' as const,
      model: 'gpt-4o-mini',
      capabilities: {
        reasoning: true,
        coding: true,
        multilingual: true,
        contextLength: 128000,
        specializations: ['general', 'reasoning', 'coding']
      }
    }
  },
  // Specialized models
  specialized: {
    'qwen3-coder': {
      provider: 'huggingface' as const,
      model: 'Qwen/Qwen3-Coder-32B-Instruct',
      capabilities: {
        reasoning: true,
        coding: true,
        multilingual: true,
        contextLength: 32768,
        specializations: ['coding', 'technical-analysis']
      }
    },
    'deepseek-r1': {
      provider: 'huggingface' as const,
      model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
      capabilities: {
        reasoning: true,
        coding: true,
        multilingual: true,
        contextLength: 32768,
        specializations: ['reasoning', 'chain-of-thought']
      }
    }
  }
};

export class EnhancedLLMService {
  private openai: OpenAI;
  private hf: HfInference;
  private modelCache: Map<string, any> = new Map();
  private performanceMetrics: Map<string, { latency: number; success: number; total: number }> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });
    
    this.hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
  }

  /**
   * Intelligent model selection based on task requirements
   */
  private selectOptimalModel(taskType: 'general' | 'reasoning' | 'coding' | 'multilingual' | 'fast', complexity: 'low' | 'medium' | 'high'): string {
    // Edge-first strategy: try small models first, fallback to larger ones
    if (complexity === 'low' || taskType === 'fast') {
      if (taskType === 'coding') return 'phi-3.5-mini';
      if (taskType === 'multilingual') return 'qwen3-0.6b';
      return 'gemma3-1b';
    }
    
    if (complexity === 'medium') {
      if (taskType === 'coding') return 'qwen3-coder';
      if (taskType === 'reasoning') return 'deepseek-r1';
      if (taskType === 'multilingual') return 'qwen3-72b';
      return 'gemma3-27b';
    }
    
    // High complexity - use cloud models
    if (taskType === 'coding') return 'qwen3-coder';
    if (taskType === 'reasoning') return 'deepseek-r1';
    return 'qwen3-72b';
  }

  /**
   * Generate completion with automatic model selection and fallback
   */
  async generateCompletion(
    prompt: string,
    options: {
      taskType?: 'general' | 'reasoning' | 'coding' | 'multilingual' | 'fast';
      complexity?: 'low' | 'medium' | 'high';
      config?: Partial<LLMConfig>;
      enableFallback?: boolean;
    } = {}
  ): Promise<LLMResponse> {
    const {
      taskType = 'general',
      complexity = 'medium',
      config = {},
      enableFallback = true
    } = options;

    const selectedModel = this.selectOptimalModel(taskType, complexity);
    const modelConfig = this.getModelConfig(selectedModel);
    const finalConfig = { ...modelConfig, ...config };

    try {
      return await this.executeCompletion(prompt, finalConfig, selectedModel);
    } catch (error) {
      if (enableFallback) {
        console.warn(`Model ${selectedModel} failed, trying fallback...`);
        // Try a more reliable fallback model
        const fallbackModel = complexity === 'high' ? 'gpt-4o-mini' : 'gemma3-1b';
        const fallbackConfig = this.getModelConfig(fallbackModel);
        return await this.executeCompletion(prompt, { ...fallbackConfig, ...config }, fallbackModel);
      }
      throw error;
    }
  }

  /**
   * Execute completion with specific model
   */
  private async executeCompletion(prompt: string, config: LLMConfig, modelKey: string): Promise<LLMResponse> {
    const startTime = Date.now();
    
    try {
      let response: string;
      let tokens: number;
      let reasoning: string | undefined;

      if (config.provider === 'openai') {
        const openaiResponse = await this.openai.chat.completions.create({
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: config.maxTokens,
          temperature: config.temperature,
          top_p: config.topP,
          frequency_penalty: config.frequencyPenalty,
          presence_penalty: config.presencePenalty,
        });
        
        response = openaiResponse.choices[0]?.message?.content || '';
        tokens = openaiResponse.usage?.total_tokens || 0;
      } else if (config.provider === 'huggingface') {
        const hfResponse = await this.hf.textGeneration({
          model: config.model,
          inputs: prompt,
          parameters: {
            max_new_tokens: config.maxTokens,
            temperature: config.temperature,
            top_p: config.topP,
            return_full_text: false,
          },
        });
        
        response = hfResponse.generated_text;
        tokens = this.estimateTokens(prompt + response);
        
        // Extract reasoning if model supports chain-of-thought
        if (modelKey.includes('deepseek-r1') && response.includes('<thinking>')) {
          const thinkingMatch = response.match(/<thinking>([\s\S]*?)<\/thinking>/);
          if (thinkingMatch) {
            reasoning = thinkingMatch[1].trim();
            response = response.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim();
          }
        }
      } else {
        throw new Error(`Unsupported provider: ${config.provider}`);
      }

      const latency = Date.now() - startTime;
      
      // Update performance metrics
      this.updatePerformanceMetrics(modelKey, latency, true);
      
      // Log usage for analytics
      await this.logUsage({
        model: modelKey,
        tokens,
        latency,
        success: true,
        taskType: 'completion'
      });

      return {
        text: response,
        confidence: this.calculateConfidence(response, modelKey),
        model: modelKey,
        tokens,
        latency,
        reasoning
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      this.updatePerformanceMetrics(modelKey, latency, false);
      
      await this.logUsage({
        model: modelKey,
        tokens: 0,
        latency,
        success: false,
        taskType: 'completion',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }

  /**
   * Get model configuration
   */
  private getModelConfig(modelKey: string): LLMConfig {
    // Find model in registry
    for (const category of Object.values(MODEL_REGISTRY)) {
      if (category[modelKey]) {
        const modelInfo = category[modelKey];
        return {
          provider: modelInfo.provider,
          model: modelInfo.model,
          maxTokens: 1000,
          temperature: 0.1,
          topP: 0.9
        };
      }
    }
    
    // Default fallback
    return {
      provider: 'openai',
      model: 'gpt-4o-mini',
      maxTokens: 1000,
      temperature: 0.1
    };
  }

  /**
   * Generate embeddings with model selection
   */
  async generateEmbeddings(
    texts: string[],
    model: 'text-embedding-3-small' | 'text-embedding-3-large' | 'sentence-transformers' = 'text-embedding-3-small'
  ): Promise<EmbeddingResponse[]> {
    const startTime = Date.now();
    
    try {
      if (model.startsWith('text-embedding')) {
        const response = await this.openai.embeddings.create({
          model,
          input: texts,
        });
        
        return response.data.map((item, index) => ({
          embedding: item.embedding,
          model,
          tokens: this.estimateTokens(texts[index])
        }));
      } else {
        // Use Hugging Face sentence transformers
        const embeddings = await Promise.all(
          texts.map(async (text) => {
            const response = await this.hf.featureExtraction({
              model: 'sentence-transformers/all-MiniLM-L6-v2',
              inputs: text
            });
            
            return {
              embedding: Array.isArray(response) ? response : [],
              model: 'sentence-transformers/all-MiniLM-L6-v2',
              tokens: this.estimateTokens(text)
            };
          })
        );
        
        return embeddings;
      }
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw error;
    }
  }

  /**
   * Classify text using specialized models
   */
  async classifyText(
    text: string,
    categories: string[],
    model?: string
  ): Promise<{ category: string; confidence: number; subcategories: string[] }> {
    const classificationPrompt = `
Classify the following text into one of these categories: ${categories.join(', ')}.

Text: "${text}"

Provide your response in JSON format:
{
  "category": "selected_category",
  "confidence": 0.95,
  "reasoning": "explanation",
  "subcategories": ["relevant_subcategories"]
}`;

    const response = await this.generateCompletion(classificationPrompt, {
      taskType: 'reasoning',
      complexity: 'low',
      config: { temperature: 0.1 }
    });

    try {
      const result = JSON.parse(response.text);
      return {
        category: result.category,
        confidence: result.confidence,
        subcategories: result.subcategories || []
      };
    } catch (error) {
      // Fallback parsing
      const category = categories.find(cat => 
        response.text.toLowerCase().includes(cat.toLowerCase())
      ) || categories[0];
      
      return {
        category,
        confidence: 0.5,
        subcategories: []
      };
    }
  }

  /**
   * Get model performance metrics
   */
  getModelPerformance(): Record<string, { avgLatency: number; successRate: number; totalCalls: number }> {
    const performance: Record<string, { avgLatency: number; successRate: number; totalCalls: number }> = {};
    
    for (const [model, metrics] of this.performanceMetrics.entries()) {
      performance[model] = {
        avgLatency: metrics.latency / metrics.total,
        successRate: metrics.success / metrics.total,
        totalCalls: metrics.total
      };
    }
    
    return performance;
  }

  /**
   * Helper methods
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private calculateConfidence(response: string, model: string): number {
    // Simple confidence calculation based on response length and model capabilities
    const baseConfidence = Math.min(response.length / 100, 1) * 0.8;
    const modelBonus = model.includes('gpt-4') ? 0.2 : model.includes('qwen3') ? 0.15 : 0.1;
    return Math.min(baseConfidence + modelBonus, 1);
  }

  private updatePerformanceMetrics(model: string, latency: number, success: boolean): void {
    if (!this.performanceMetrics.has(model)) {
      this.performanceMetrics.set(model, { latency: 0, success: 0, total: 0 });
    }
    
    const metrics = this.performanceMetrics.get(model)!;
    metrics.latency += latency;
    metrics.total += 1;
    if (success) metrics.success += 1;
  }

  private async logUsage(data: {
    model: string;
    tokens: number;
    latency: number;
    success: boolean;
    taskType: string;
    error?: string;
  }): Promise<void> {
    try {
      await supabase.from('llm_usage_logs').insert({
        ...data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to log LLM usage:', error);
    }
  }
}

// Export singleton instance
export const enhancedLLMService = new EnhancedLLMService();