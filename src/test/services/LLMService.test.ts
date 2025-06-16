import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LLMService } from '../../services/LLMService';
import type { LLMProvider, LLMResponse } from '../../services/LLMService';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(() => ({
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    then: vi.fn().mockResolvedValue({ data: [], error: null }),
  })),
};

describe('LLMService', () => {
  let llmService: LLMService;
  
  beforeEach(() => {
    vi.clearAllMocks();
    llmService = new LLMService(mockSupabaseClient as any);
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('OpenAI Provider', () => {
    beforeEach(() => {
      process.env.OPENAI_API_KEY = 'test-openai-key';
    });

    it('should complete text using OpenAI', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'This is a test response from OpenAI'
          }
        }],
        usage: {
          total_tokens: 50
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await llmService.completeText(
        'Test prompt',
        { provider: 'openai', model: 'gpt-3.5-turbo' }
      );

      expect(result.text).toBe('This is a test response from OpenAI');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.tokenCount).toBe(50);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-openai-key',
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should generate embeddings using OpenAI', async () => {
      const mockEmbedding = new Array(1536).fill(0).map(() => Math.random());
      const mockResponse = {
        data: [{
          embedding: mockEmbedding
        }],
        usage: {
          total_tokens: 25
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await llmService.generateEmbedding(
        'Test text for embedding',
        { provider: 'openai' }
      );

      expect(result.embedding).toHaveLength(1536);
      expect(result.tokenCount).toBe(25);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/embeddings',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  describe('Hugging Face Provider', () => {
    beforeEach(() => {
      process.env.HUGGINGFACE_API_KEY = 'test-hf-key';
    });

    it('should complete text using Hugging Face', async () => {
      const mockResponse = [{
        generated_text: 'Test prompt This is a Hugging Face response'
      }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await llmService.completeText(
        'Test prompt',
        { provider: 'huggingface', model: 'microsoft/DialoGPT-medium' }
      );

      expect(result.text).toBe('This is a Hugging Face response');
      expect(result.confidence).toBeGreaterThan(0);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-hf-key'
          })
        })
      );
    });

    it('should generate embeddings using Hugging Face', async () => {
      const mockEmbedding = new Array(768).fill(0).map(() => Math.random());
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEmbedding)
      });

      const result = await llmService.generateEmbedding(
        'Test text',
        { provider: 'huggingface', model: 'sentence-transformers/all-MiniLM-L6-v2' }
      );

      expect(result.embedding).toHaveLength(768);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  describe('Regulatory Text Classification', () => {
    it('should classify regulatory text correctly', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              category: 'AML',
              subcategory: 'Customer Due Diligence',
              confidence: 0.92,
              reasoning: 'Text contains references to KYC procedures'
            })
          }
        }],
        usage: { total_tokens: 75 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await llmService.classifyRegulatoryText(
        'This regulation requires enhanced customer due diligence procedures for high-risk clients.',
        { provider: 'openai' }
      );

      expect(result.category).toBe('AML');
      expect(result.subcategory).toBe('Customer Due Diligence');
      expect(result.confidence).toBe(0.92);
      expect(result.reasoning).toContain('KYC procedures');
    });

    it('should handle classification errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Rate Limited'
      });

      await expect(
        llmService.classifyRegulatoryText(
          'Test text',
          { provider: 'openai' }
        )
      ).rejects.toThrow('Rate Limited');
    });
  });

  describe('Document Summarization', () => {
    it('should summarize documents effectively', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'This document outlines new AML requirements for financial institutions, focusing on enhanced customer verification and transaction monitoring.'
          }
        }],
        usage: { total_tokens: 120 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const longDocument = 'This is a very long regulatory document that needs to be summarized. '.repeat(100);
      
      const result = await llmService.summarizeDocument(
        longDocument,
        { provider: 'openai', maxLength: 200 }
      );

      expect(result.summary).toContain('AML requirements');
      expect(result.keyPoints).toBeInstanceOf(Array);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.tokenCount).toBe(120);
    });
  });

  describe('Entity Extraction', () => {
    it('should extract entities from regulatory text', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              entities: [
                { type: 'REGULATION', value: 'MiFID II', confidence: 0.95 },
                { type: 'DATE', value: '2024-01-01', confidence: 0.88 },
                { type: 'ORGANIZATION', value: 'European Securities and Markets Authority', confidence: 0.92 }
              ]
            })
          }
        }],
        usage: { total_tokens: 85 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await llmService.extractEntities(
        'MiFID II regulations will be updated on 2024-01-01 by the European Securities and Markets Authority.',
        { provider: 'openai' }
      );

      expect(result.entities).toHaveLength(3);
      expect(result.entities[0].type).toBe('REGULATION');
      expect(result.entities[0].value).toBe('MiFID II');
      expect(result.confidence).toBeGreaterThan(0);
    });
  });

  describe('Usage Statistics', () => {
    it('should track and retrieve usage statistics', async () => {
      const mockUsageData = [
        {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          operation: 'completion',
          token_count: 150,
          cost: 0.003,
          created_at: new Date().toISOString()
        }
      ];

      mockSupabaseClient.from().then.mockResolvedValueOnce({
        data: mockUsageData,
        error: null
      });

      const stats = await llmService.getUsageStats('2024-01-01', '2024-01-31');

      expect(stats.totalTokens).toBeGreaterThan(0);
      expect(stats.totalCost).toBeGreaterThan(0);
      expect(stats.operationCounts).toBeDefined();
      expect(stats.providerBreakdown).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        llmService.completeText('Test', { provider: 'openai' })
      ).rejects.toThrow('Network error');
    });

    it('should handle API rate limiting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      });

      await expect(
        llmService.completeText('Test', { provider: 'openai' })
      ).rejects.toThrow('Too Many Requests');
    });

    it('should handle invalid API responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ invalid: 'response' })
      });

      await expect(
        llmService.completeText('Test', { provider: 'openai' })
      ).rejects.toThrow();
    });
  });

  describe('Configuration Validation', () => {
    it('should validate provider configuration', () => {
      expect(() => {
        new LLMService(mockSupabaseClient as any, {
          openai: { apiKey: '' }, // Empty API key
          huggingface: { apiKey: 'valid-key' }
        });
      }).toThrow('OpenAI API key is required');
    });

    it('should use environment variables when config not provided', () => {
      process.env.OPENAI_API_KEY = 'env-openai-key';
      process.env.HUGGINGFACE_API_KEY = 'env-hf-key';
      
      const service = new LLMService(mockSupabaseClient as any);
      expect(service).toBeDefined();
    });
  });

  describe('Token Estimation', () => {
    it('should estimate tokens accurately', () => {
      const text = 'This is a test sentence with multiple words.';
      const estimatedTokens = (llmService as any).estimateTokens(text);
      
      expect(estimatedTokens).toBeGreaterThan(0);
      expect(estimatedTokens).toBeLessThan(text.length); // Should be less than character count
    });
  });

  describe('Confidence Calculation', () => {
    it('should calculate confidence scores correctly', () => {
      const confidence1 = (llmService as any).calculateConfidence('openai', 'gpt-4', 100);
      const confidence2 = (llmService as any).calculateConfidence('huggingface', 'small-model', 100);
      
      expect(confidence1).toBeGreaterThan(confidence2); // GPT-4 should have higher base confidence
      expect(confidence1).toBeGreaterThanOrEqual(0);
      expect(confidence1).toBeLessThanOrEqual(1);
    });
  });
});