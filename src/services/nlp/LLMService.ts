import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';
import { supabase } from '../supabase';

// Types for LLM responses
export interface LLMResponse {
  text: string;
  confidence: number;
  model: string;
  tokens: number;
  latency: number;
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  tokens: number;
}

export interface ClassificationResult {
  category: string;
  confidence: number;
  subcategories: string[];
}

// Configuration for different LLM providers
interface LLMConfig {
  provider: 'openai' | 'huggingface' | 'cohere';
  model: string;
  maxTokens: number;
  temperature: number;
}

export class LLMService {
  private openai: OpenAI;
  private hf: HfInference;
  private defaultConfig: LLMConfig;

  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });
    
    this.hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
    
    this.defaultConfig = {
      provider: 'openai',
      model: 'gpt-4o-mini',
      maxTokens: 1000,
      temperature: 0.1
    };
  }

  /**
   * Generate text completion using the specified LLM
   */
  async generateCompletion(
    prompt: string, 
    config: Partial<LLMConfig> = {}
  ): Promise<LLMResponse> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const startTime = Date.now();

    try {
      let response: string;
      let tokens: number;

      switch (finalConfig.provider) {
        case 'openai':
          const openaiResponse = await this.openai.chat.completions.create({
            model: finalConfig.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: finalConfig.maxTokens,
            temperature: finalConfig.temperature,
          });
          
          response = openaiResponse.choices[0]?.message?.content || '';
          tokens = openaiResponse.usage?.total_tokens || 0;
          break;

        case 'huggingface':
          const hfResponse = await this.hf.textGeneration({
            model: finalConfig.model,
            inputs: prompt,
            parameters: {
              max_new_tokens: finalConfig.maxTokens,
              temperature: finalConfig.temperature,
              return_full_text: false,
            },
          });
          
          response = hfResponse.generated_text;
          tokens = this.estimateTokens(prompt + response);
          break;

        default:
          throw new Error(`Unsupported provider: ${finalConfig.provider}`);
      }

      const latency = Date.now() - startTime;
      
      // Log usage for monitoring
      await this.logUsage({
        provider: finalConfig.provider,
        model: finalConfig.model,
        tokens,
        latency,
        type: 'completion'
      });

      return {
        text: response,
        confidence: this.calculateConfidence(response),
        model: finalConfig.model,
        tokens,
        latency
      };
    } catch (error) {
      console.error('LLM completion failed:', error);
      throw new Error(`LLM completion failed: ${error}`);
    }
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbedding(
    text: string,
    model: string = 'text-embedding-3-small'
  ): Promise<EmbeddingResponse> {
    try {
      const response = await this.openai.embeddings.create({
        model,
        input: text,
      });

      const embedding = response.data[0]?.embedding;
      const tokens = response.usage?.total_tokens || 0;

      if (!embedding) {
        throw new Error('No embedding returned from API');
      }

      // Log usage
      await this.logUsage({
        provider: 'openai',
        model,
        tokens,
        latency: 0,
        type: 'embedding'
      });

      return {
        embedding,
        model,
        tokens
      };
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw new Error(`Embedding generation failed: ${error}`);
    }
  }

  /**
   * Classify regulatory text into categories
   */
  async classifyRegulatoryText(text: string): Promise<ClassificationResult> {
    const prompt = `
Classify the following regulatory text into one of these categories:
- Banking & Capital Requirements
- Insurance & Solvency
- Investment Services (MiFID)
- Anti-Money Laundering (AML)
- Data Protection & Privacy
- ESG & Sustainability (SFDR)
- Market Abuse & Conduct
- Consumer Protection
- General Compliance

Text: "${text}"

Provide your response in JSON format:
{
  "category": "primary category",
  "confidence": 0.95,
  "subcategories": ["relevant subcategories"]
}
`;

    try {
      const response = await this.generateCompletion(prompt, {
        temperature: 0.1,
        maxTokens: 200
      });

      const parsed = JSON.parse(response.text);
      return {
        category: parsed.category,
        confidence: parsed.confidence,
        subcategories: parsed.subcategories || []
      };
    } catch (error) {
      console.error('Classification failed:', error);
      // Fallback classification
      return {
        category: 'General Compliance',
        confidence: 0.5,
        subcategories: []
      };
    }
  }

  /**
   * Summarize regulatory document
   */
  async summarizeDocument(
    content: string,
    maxLength: number = 500
  ): Promise<string> {
    const prompt = `
Summarize the following regulatory document in ${maxLength} characters or less.
Focus on key requirements, deadlines, and compliance implications.

Document:
${content}

Summary:
`;

    try {
      const response = await this.generateCompletion(prompt, {
        maxTokens: Math.ceil(maxLength / 4), // Rough token estimation
        temperature: 0.2
      });

      return response.text.trim();
    } catch (error) {
      console.error('Summarization failed:', error);
      throw new Error(`Document summarization failed: ${error}`);
    }
  }

  /**
   * Extract key entities from regulatory text
   */
  async extractEntities(text: string): Promise<{
    organizations: string[];
    regulations: string[];
    dates: string[];
    amounts: string[];
  }> {
    const prompt = `
Extract key entities from this regulatory text:

"${text}"

Return JSON with:
- organizations: regulatory bodies, companies
- regulations: specific laws, directives, standards
- dates: important deadlines, effective dates
- amounts: monetary values, percentages, thresholds

JSON:
`;

    try {
      const response = await this.generateCompletion(prompt, {
        temperature: 0.1,
        maxTokens: 300
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error('Entity extraction failed:', error);
      return {
        organizations: [],
        regulations: [],
        dates: [],
        amounts: []
      };
    }
  }

  /**
   * Calculate confidence score based on response characteristics
   */
  private calculateConfidence(text: string): number {
    // Simple heuristic - can be improved with more sophisticated methods
    const length = text.length;
    const hasSpecificTerms = /\b(shall|must|required|compliance|regulation)\b/i.test(text);
    const hasNumbers = /\d/.test(text);
    
    let confidence = 0.7; // Base confidence
    
    if (length > 100) confidence += 0.1;
    if (hasSpecificTerms) confidence += 0.1;
    if (hasNumbers) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  /**
   * Estimate token count for text
   */
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Log API usage for monitoring and cost tracking
   */
  private async logUsage(usage: {
    provider: string;
    model: string;
    tokens: number;
    latency: number;
    type: string;
  }): Promise<void> {
    try {
      await supabase.from('llm_usage_logs').insert({
        provider: usage.provider,
        model: usage.model,
        tokens: usage.tokens,
        latency_ms: usage.latency,
        request_type: usage.type,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to log LLM usage:', error);
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(timeframe: 'day' | 'week' | 'month' = 'day'): Promise<{
    totalTokens: number;
    totalRequests: number;
    averageLatency: number;
    costEstimate: number;
  }> {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    try {
      const { data, error } = await supabase
        .from('llm_usage_logs')
        .select('tokens, latency_ms, provider, model')
        .gte('timestamp', startDate.toISOString());

      if (error) throw error;

      const totalTokens = data.reduce((sum, log) => sum + log.tokens, 0);
      const totalRequests = data.length;
      const averageLatency = data.reduce((sum, log) => sum + log.latency_ms, 0) / totalRequests;
      
      // Rough cost estimation (OpenAI GPT-4o-mini pricing)
      const costEstimate = totalTokens * 0.00015 / 1000; // $0.15 per 1K tokens

      return {
        totalTokens,
        totalRequests,
        averageLatency: Math.round(averageLatency),
        costEstimate: Math.round(costEstimate * 100) / 100
      };
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return {
        totalTokens: 0,
        totalRequests: 0,
        averageLatency: 0,
        costEstimate: 0
      };
    }
  }
}

// Export singleton instance
export const llmService = new LLMService();