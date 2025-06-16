import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EnhancedLLMService } from '../../services/nlp/EnhancedLLMService';
import type { LLMConfig, LLMResponse, ModelCapabilities } from '../../services/nlp/EnhancedLLMService';

// Mock external dependencies
vi.mock('@huggingface/inference', () => ({
  HfInference: vi.fn().mockImplementation(() => ({
    textGeneration: vi.fn(),
    featureExtraction: vi.fn(),
    textClassification: vi.fn(),
  })),
}));

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
    embeddings: {
      create: vi.fn(),
    },
  })),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  }),
}));

describe('EnhancedLLMService', () => {
  let llmService: EnhancedLLMService;
  let mockConfig: LLMConfig;

  beforeEach(() => {
    mockConfig = {
      openaiApiKey: 'test-openai-key',
      huggingfaceApiKey: 'test-hf-key',
      supabaseUrl: 'https://test.supabase.co',
      supabaseKey: 'test-supabase-key',
      defaultModel: 'gpt-3.5-turbo',
      maxRetries: 3,
      timeout: 30000,
      enableCaching: true,
      enableLogging: true,
    };

    llmService = new EnhancedLLMService(mockConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Model Selection', () => {
    it('should select appropriate model based on task requirements', () => {
      const requirements: ModelCapabilities = {
        maxTokens: 4000,
        supportsStreaming: true,
        supportsTools: false,
        languages: ['en'],
        specializations: ['general'],
      };

      const selectedModel = llmService.selectOptimalModel(requirements);
      expect(selectedModel).toBeDefined();
      expect(selectedModel.capabilities.maxTokens).toBeGreaterThanOrEqual(requirements.maxTokens);
    });

    it('should fallback to default model when no suitable model found', () => {
      const requirements: ModelCapabilities = {
        maxTokens: 1000000, // Unrealistic requirement
        supportsStreaming: true,
        supportsTools: true,
        languages: ['en'],
        specializations: ['general'],
      };

      const selectedModel = llmService.selectOptimalModel(requirements);
      expect(selectedModel.name).toBe(mockConfig.defaultModel);
    });
  });

  describe('Text Generation', () => {
    it('should generate completion successfully', async () => {
      const mockResponse: LLMResponse = {
        content: 'Generated response',
        model: 'gpt-3.5-turbo',
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
        },
        finishReason: 'stop',
        metadata: {
          requestId: 'test-request-id',
          timestamp: new Date(),
        },
      };

      // Mock OpenAI response
      const mockOpenAI = await import('openai');
      const mockCreate = vi.fn().mockResolvedValue({
        choices: [{
          message: { content: mockResponse.content },
          finish_reason: 'stop',
        }],
        usage: mockResponse.usage,
        id: 'test-request-id',
      });
      
      (mockOpenAI.default as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const result = await llmService.generateCompletion({
        prompt: 'Test prompt',
        model: 'gpt-3.5-turbo',
        maxTokens: 100,
        temperature: 0.7,
      });

      expect(result.content).toBe(mockResponse.content);
      expect(result.model).toBe('gpt-3.5-turbo');
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Test prompt' }],
        max_tokens: 100,
        temperature: 0.7,
      });
    });

    it('should handle generation errors gracefully', async () => {
      const mockOpenAI = await import('openai');
      const mockCreate = vi.fn().mockRejectedValue(new Error('API Error'));
      
      (mockOpenAI.default as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      await expect(llmService.generateCompletion({
        prompt: 'Test prompt',
        model: 'gpt-3.5-turbo',
      })).rejects.toThrow('API Error');
    });

    it('should retry on failure', async () => {
      const mockOpenAI = await import('openai');
      const mockCreate = vi.fn()
        .mockRejectedValueOnce(new Error('Temporary error'))
        .mockResolvedValueOnce({
          choices: [{
            message: { content: 'Success after retry' },
            finish_reason: 'stop',
          }],
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
          id: 'test-request-id',
        });
      
      (mockOpenAI.default as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const result = await llmService.generateCompletion({
        prompt: 'Test prompt',
        model: 'gpt-3.5-turbo',
      });

      expect(result.content).toBe('Success after retry');
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Embeddings', () => {
    it('should generate embeddings successfully', async () => {
      const mockEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];
      
      const mockOpenAI = await import('openai');
      const mockCreate = vi.fn().mockResolvedValue({
        data: [{ embedding: mockEmbedding }],
        usage: { prompt_tokens: 5, total_tokens: 5 },
      });
      
      (mockOpenAI.default as any).mockImplementation(() => ({
        embeddings: {
          create: mockCreate,
        },
      }));

      const result = await llmService.generateEmbeddings({
        texts: ['Test text'],
        model: 'text-embedding-ada-002',
      });

      expect(result.embeddings).toHaveLength(1);
      expect(result.embeddings[0]).toEqual(mockEmbedding);
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'text-embedding-ada-002',
        input: ['Test text'],
      });
    });

    it('should handle multiple texts', async () => {
      const mockEmbeddings = [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
      ];
      
      const mockOpenAI = await import('openai');
      const mockCreate = vi.fn().mockResolvedValue({
        data: mockEmbeddings.map(embedding => ({ embedding })),
        usage: { prompt_tokens: 10, total_tokens: 10 },
      });
      
      (mockOpenAI.default as any).mockImplementation(() => ({
        embeddings: {
          create: mockCreate,
        },
      }));

      const result = await llmService.generateEmbeddings({
        texts: ['Text 1', 'Text 2'],
        model: 'text-embedding-ada-002',
      });

      expect(result.embeddings).toHaveLength(2);
      expect(result.embeddings[0]).toEqual(mockEmbeddings[0]);
      expect(result.embeddings[1]).toEqual(mockEmbeddings[1]);
    });
  });

  describe('Text Classification', () => {
    it('should classify text successfully', async () => {
      const mockClassification = {
        label: 'POSITIVE',
        score: 0.95,
      };

      const mockHf = await import('@huggingface/inference');
      const mockTextClassification = vi.fn().mockResolvedValue([mockClassification]);
      
      (mockHf.HfInference as any).mockImplementation(() => ({
        textClassification: mockTextClassification,
      }));

      const result = await llmService.classifyText({
        text: 'This is a great product!',
        model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
        labels: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
      });

      expect(result.predictions).toHaveLength(1);
      expect(result.predictions[0].label).toBe('POSITIVE');
      expect(result.predictions[0].confidence).toBe(0.95);
    });

    it('should handle classification errors', async () => {
      const mockHf = await import('@huggingface/inference');
      const mockTextClassification = vi.fn().mockRejectedValue(new Error('Classification failed'));
      
      (mockHf.HfInference as any).mockImplementation(() => ({
        textClassification: mockTextClassification,
      }));

      await expect(llmService.classifyText({
        text: 'Test text',
        model: 'test-model',
      })).rejects.toThrow('Classification failed');
    });
  });

  describe('Performance Metrics', () => {
    it('should track performance metrics', async () => {
      const metrics = llmService.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty('totalRequests');
      expect(metrics).toHaveProperty('successfulRequests');
      expect(metrics).toHaveProperty('failedRequests');
      expect(metrics).toHaveProperty('averageResponseTime');
      expect(metrics).toHaveProperty('totalTokensUsed');
      expect(metrics).toHaveProperty('modelUsage');
    });

    it('should reset metrics', () => {
      llmService.resetMetrics();
      const metrics = llmService.getPerformanceMetrics();
      
      expect(metrics.totalRequests).toBe(0);
      expect(metrics.successfulRequests).toBe(0);
      expect(metrics.failedRequests).toBe(0);
      expect(metrics.totalTokensUsed).toBe(0);
    });
  });

  describe('Health Check', () => {
    it('should perform health check successfully', async () => {
      const mockOpenAI = await import('openai');
      const mockCreate = vi.fn().mockResolvedValue({
        choices: [{
          message: { content: 'Health check response' },
          finish_reason: 'stop',
        }],
        usage: { prompt_tokens: 5, completion_tokens: 3, total_tokens: 8 },
        id: 'health-check-id',
      });
      
      (mockOpenAI.default as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const isHealthy = await llmService.healthCheck();
      expect(isHealthy).toBe(true);
    });

    it('should return false on health check failure', async () => {
      const mockOpenAI = await import('openai');
      const mockCreate = vi.fn().mockRejectedValue(new Error('Service unavailable'));
      
      (mockOpenAI.default as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const isHealthy = await llmService.healthCheck();
      expect(isHealthy).toBe(false);
    });
  });

  describe('Caching', () => {
    it('should cache responses when enabled', async () => {
      const mockResponse = {
        choices: [{
          message: { content: 'Cached response' },
          finish_reason: 'stop',
        }],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
        id: 'cached-request-id',
      };

      const mockOpenAI = await import('openai');
      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      
      (mockOpenAI.default as any).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      // First call
      await llmService.generateCompletion({
        prompt: 'Test prompt for caching',
        model: 'gpt-3.5-turbo',
      });

      // Second call with same parameters should use cache
      await llmService.generateCompletion({
        prompt: 'Test prompt for caching',
        model: 'gpt-3.5-turbo',
      });

      // Should only call the API once due to caching
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });
  });
});