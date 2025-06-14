import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EnhancedRAGService } from '../../services/rag/EnhancedRAGService';
import type { RAGConfig, SearchResult, Document } from '../../services/rag/EnhancedRAGService';

// Mock external dependencies
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
    rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
}));

vi.mock('qdrant-js', () => ({
  QdrantClient: vi.fn().mockImplementation(() => ({
    search: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    getCollections: vi.fn(),
    createCollection: vi.fn(),
  })),
}));

vi.mock('../../services/nlp/EnhancedLLMService', () => ({
  EnhancedLLMService: vi.fn().mockImplementation(() => ({
    generateEmbeddings: vi.fn(),
    generateCompletion: vi.fn(),
  })),
}));

describe('EnhancedRAGService', () => {
  let ragService: EnhancedRAGService;
  let mockConfig: RAGConfig;
  let mockLLMService: any;

  beforeEach(async () => {
    mockConfig = {
      supabaseUrl: 'https://test.supabase.co',
      supabaseKey: 'test-supabase-key',
      qdrantUrl: 'http://localhost:6333',
      qdrantApiKey: 'test-qdrant-key',
      embeddingModel: 'text-embedding-ada-002',
      chunkSize: 1000,
      chunkOverlap: 200,
      maxResults: 10,
      similarityThreshold: 0.7,
      enableHybridSearch: true,
      enableReranking: true,
    };

    const { EnhancedLLMService } = await import('../../services/nlp/EnhancedLLMService');
    mockLLMService = new EnhancedLLMService({} as any);
    
    ragService = new EnhancedRAGService(mockConfig, mockLLMService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Document Processing', () => {
    it('should chunk document content properly', () => {
      const content = 'A'.repeat(2500); // 2500 characters
      const chunks = ragService.chunkDocument(content, 1000, 200);
      
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks[0].length).toBeLessThanOrEqual(1000);
      
      // Check overlap
      const overlap = chunks[0].slice(-200);
      expect(chunks[1].startsWith(overlap)).toBe(true);
    });

    it('should handle short documents without chunking', () => {
      const content = 'Short document content';
      const chunks = ragService.chunkDocument(content, 1000, 200);
      
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(content);
    });

    it('should add document successfully', async () => {
      const mockDocument: Document = {
        id: 'test-doc-1',
        content: 'Test document content for indexing',
        metadata: {
          title: 'Test Document',
          source: 'test',
          type: 'regulation',
          tags: ['test', 'document'],
        },
        embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
      };

      mockLLMService.generateEmbeddings.mockResolvedValue({
        embeddings: [[0.1, 0.2, 0.3, 0.4, 0.5]],
        model: 'text-embedding-ada-002',
        usage: { promptTokens: 10, totalTokens: 10 },
      });

      const result = await ragService.addDocument(mockDocument);
      
      expect(result.success).toBe(true);
      expect(result.documentId).toBe('test-doc-1');
      expect(mockLLMService.generateEmbeddings).toHaveBeenCalledWith({
        texts: [mockDocument.content],
        model: mockConfig.embeddingModel,
      });
    });

    it('should handle document addition errors', async () => {
      const mockDocument: Document = {
        id: 'test-doc-error',
        content: 'Test document content',
        metadata: { title: 'Error Document' },
      };

      mockLLMService.generateEmbeddings.mockRejectedValue(new Error('Embedding failed'));

      const result = await ragService.addDocument(mockDocument);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Embedding failed');
    });
  });

  describe('Search Functionality', () => {
    it('should perform semantic search successfully', async () => {
      const mockSearchResults = [
        {
          id: 'doc-1',
          content: 'Relevant document content',
          metadata: { title: 'Document 1' },
          score: 0.95,
        },
        {
          id: 'doc-2',
          content: 'Another relevant document',
          metadata: { title: 'Document 2' },
          score: 0.85,
        },
      ];

      mockLLMService.generateEmbeddings.mockResolvedValue({
        embeddings: [[0.1, 0.2, 0.3, 0.4, 0.5]],
        model: 'text-embedding-ada-002',
        usage: { promptTokens: 5, totalTokens: 5 },
      });

      // Mock Qdrant search
      const mockQdrant = await import('qdrant-js');
      const mockSearch = vi.fn().mockResolvedValue({
        points: mockSearchResults.map(result => ({
          id: result.id,
          payload: {
            content: result.content,
            metadata: result.metadata,
          },
          score: result.score,
        })),
      });
      
      (mockQdrant.QdrantClient as any).mockImplementation(() => ({
        search: mockSearch,
      }));

      const results = await ragService.search({
        query: 'test query',
        strategy: 'semantic',
        maxResults: 5,
        threshold: 0.7,
      });

      expect(results.results).toHaveLength(2);
      expect(results.results[0].score).toBe(0.95);
      expect(results.strategy).toBe('semantic');
      expect(mockLLMService.generateEmbeddings).toHaveBeenCalledWith({
        texts: ['test query'],
        model: mockConfig.embeddingModel,
      });
    });

    it('should perform keyword search successfully', async () => {
      const mockSupabase = await import('@supabase/supabase-js');
      const mockSelect = vi.fn().mockReturnValue({
        textSearch: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'doc-1',
                content: 'Document with keywords',
                metadata: { title: 'Keyword Document' },
              },
            ],
            error: null,
          }),
        }),
      });
      
      (mockSupabase.createClient as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: mockSelect,
        }),
      });

      const results = await ragService.search({
        query: 'keywords',
        strategy: 'keyword',
        maxResults: 5,
      });

      expect(results.results).toHaveLength(1);
      expect(results.strategy).toBe('keyword');
    });

    it('should perform hybrid search successfully', async () => {
      const semanticResults = [
        { id: 'doc-1', content: 'Semantic result', metadata: {}, score: 0.9 },
      ];
      
      const keywordResults = [
        { id: 'doc-2', content: 'Keyword result', metadata: {}, score: 0.8 },
      ];

      // Mock both semantic and keyword searches
      vi.spyOn(ragService, 'search')
        .mockResolvedValueOnce({
          results: semanticResults,
          strategy: 'semantic',
          totalResults: 1,
          processingTime: 100,
        })
        .mockResolvedValueOnce({
          results: keywordResults,
          strategy: 'keyword',
          totalResults: 1,
          processingTime: 50,
        });

      const results = await ragService.search({
        query: 'test query',
        strategy: 'hybrid',
        maxResults: 10,
      });

      expect(results.strategy).toBe('hybrid');
      expect(results.results.length).toBeGreaterThan(0);
    });

    it('should filter results by metadata', async () => {
      const mockResults = [
        {
          id: 'doc-1',
          content: 'Document 1',
          metadata: { type: 'regulation', jurisdiction: 'US' },
          score: 0.9,
        },
        {
          id: 'doc-2',
          content: 'Document 2',
          metadata: { type: 'guidance', jurisdiction: 'EU' },
          score: 0.8,
        },
      ];

      mockLLMService.generateEmbeddings.mockResolvedValue({
        embeddings: [[0.1, 0.2, 0.3, 0.4, 0.5]],
        model: 'text-embedding-ada-002',
        usage: { promptTokens: 5, totalTokens: 5 },
      });

      const mockQdrant = await import('qdrant-js');
      const mockSearch = vi.fn().mockResolvedValue({
        points: mockResults.map(result => ({
          id: result.id,
          payload: {
            content: result.content,
            metadata: result.metadata,
          },
          score: result.score,
        })),
      });
      
      (mockQdrant.QdrantClient as any).mockImplementation(() => ({
        search: mockSearch,
      }));

      const results = await ragService.search({
        query: 'test query',
        strategy: 'semantic',
        filters: {
          type: 'regulation',
          jurisdiction: 'US',
        },
      });

      expect(mockSearch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          filter: expect.objectContaining({
            must: expect.arrayContaining([
              { key: 'metadata.type', match: { value: 'regulation' } },
              { key: 'metadata.jurisdiction', match: { value: 'US' } },
            ]),
          }),
        })
      );
    });
  });

  describe('Document Management', () => {
    it('should update document successfully', async () => {
      const updatedDocument: Partial<Document> = {
        id: 'doc-1',
        content: 'Updated content',
        metadata: { title: 'Updated Document' },
      };

      mockLLMService.generateEmbeddings.mockResolvedValue({
        embeddings: [[0.2, 0.3, 0.4, 0.5, 0.6]],
        model: 'text-embedding-ada-002',
        usage: { promptTokens: 10, totalTokens: 10 },
      });

      const result = await ragService.updateDocument('doc-1', updatedDocument);
      
      expect(result.success).toBe(true);
      expect(mockLLMService.generateEmbeddings).toHaveBeenCalled();
    });

    it('should delete document successfully', async () => {
      const result = await ragService.deleteDocument('doc-1');
      
      expect(result.success).toBe(true);
    });

    it('should get document by ID', async () => {
      const mockDocument = {
        id: 'doc-1',
        content: 'Document content',
        metadata: { title: 'Test Document' },
        embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
      };

      const mockSupabase = await import('@supabase/supabase-js');
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockDocument,
            error: null,
          }),
        }),
      });
      
      (mockSupabase.createClient as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: mockSelect,
        }),
      });

      const result = await ragService.getDocument('doc-1');
      
      expect(result).toEqual(mockDocument);
    });
  });

  describe('Analytics and Monitoring', () => {
    it('should track search analytics', async () => {
      mockLLMService.generateEmbeddings.mockResolvedValue({
        embeddings: [[0.1, 0.2, 0.3, 0.4, 0.5]],
        model: 'text-embedding-ada-002',
        usage: { promptTokens: 5, totalTokens: 5 },
      });

      await ragService.search({
        query: 'test query',
        strategy: 'semantic',
      });

      const analytics = ragService.getAnalytics();
      
      expect(analytics.totalSearches).toBeGreaterThan(0);
      expect(analytics.averageResponseTime).toBeGreaterThan(0);
      expect(analytics.strategyUsage.semantic).toBeGreaterThan(0);
    });

    it('should reset analytics', () => {
      ragService.resetAnalytics();
      const analytics = ragService.getAnalytics();
      
      expect(analytics.totalSearches).toBe(0);
      expect(analytics.averageResponseTime).toBe(0);
      expect(analytics.strategyUsage.semantic).toBe(0);
    });
  });

  describe('Health Check', () => {
    it('should perform health check successfully', async () => {
      const mockQdrant = await import('qdrant-js');
      const mockGetCollections = vi.fn().mockResolvedValue({ collections: [] });
      
      (mockQdrant.QdrantClient as any).mockImplementation(() => ({
        getCollections: mockGetCollections,
      }));

      const isHealthy = await ragService.healthCheck();
      expect(isHealthy).toBe(true);
    });

    it('should return false on health check failure', async () => {
      const mockQdrant = await import('qdrant-js');
      const mockGetCollections = vi.fn().mockRejectedValue(new Error('Connection failed'));
      
      (mockQdrant.QdrantClient as any).mockImplementation(() => ({
        getCollections: mockGetCollections,
      }));

      const isHealthy = await ragService.healthCheck();
      expect(isHealthy).toBe(false);
    });
  });

  describe('Reranking', () => {
    it('should rerank results when enabled', async () => {
      const mockResults: SearchResult[] = [
        {
          id: 'doc-1',
          content: 'Less relevant content',
          metadata: {},
          score: 0.9,
        },
        {
          id: 'doc-2',
          content: 'More relevant content for the query',
          metadata: {},
          score: 0.8,
        },
      ];

      mockLLMService.generateCompletion.mockResolvedValue({
        content: 'doc-2 is more relevant',
        model: 'gpt-3.5-turbo',
        usage: { promptTokens: 50, completionTokens: 10, totalTokens: 60 },
        finishReason: 'stop',
      });

      const rerankedResults = await ragService.rerankResults(mockResults, 'test query');
      
      expect(rerankedResults).toHaveLength(2);
      expect(mockLLMService.generateCompletion).toHaveBeenCalled();
    });
  });
});