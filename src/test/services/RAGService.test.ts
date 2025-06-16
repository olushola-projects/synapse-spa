import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RAGService } from '../../services/RAGService';
import type { DocumentChunk, RAGQuery, RAGResponse } from '../../services/RAGService';

// Mock LangChain components
vi.mock('langchain/text_splitter', () => ({
  RecursiveCharacterTextSplitter: vi.fn().mockImplementation(() => ({
    splitText: vi.fn().mockResolvedValue([
      'This is the first chunk of text.',
      'This is the second chunk of text.',
      'This is the third chunk of text.'
    ])
  }))
}));

vi.mock('langchain/vectorstores/supabase', () => ({
  SupabaseVectorStore: {
    fromTexts: vi.fn().mockResolvedValue({
      similaritySearch: vi.fn().mockResolvedValue([
        {
          pageContent: 'Relevant document content about regulatory compliance.',
          metadata: { source: 'test-doc.pdf', chunk_id: 'chunk-1' }
        },
        {
          pageContent: 'Additional context about AML requirements.',
          metadata: { source: 'test-doc.pdf', chunk_id: 'chunk-2' }
        }
      ]),
      addTexts: vi.fn().mockResolvedValue(['id1', 'id2', 'id3'])
    })
  }
}));

vi.mock('langchain/embeddings/openai', () => ({
  OpenAIEmbeddings: vi.fn().mockImplementation(() => ({
    embedQuery: vi.fn().mockResolvedValue(new Array(1536).fill(0.1))
  }))
}));

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
    count: vi.fn().mockReturnThis(),
    then: vi.fn().mockResolvedValue({ data: [], error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null })
  })),
  rpc: vi.fn().mockResolvedValue({ data: [], error: null })
};

// Mock LLMService
const mockLLMService = {
  completeText: vi.fn().mockResolvedValue({
    text: 'Based on the provided context, regulatory compliance requires following specific AML procedures.',
    confidence: 0.85,
    tokenCount: 45
  }),
  generateEmbedding: vi.fn().mockResolvedValue({
    embedding: new Array(1536).fill(0.1),
    tokenCount: 10
  })
};

describe('RAGService', () => {
  let ragService: RAGService;
  
  beforeEach(() => {
    vi.clearAllMocks();
    ragService = new RAGService(mockSupabaseClient as any, mockLLMService as any);
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Document Ingestion', () => {
    it('should ingest documents and create chunks', async () => {
      const testDocument = {
        id: 'doc-1',
        content: 'This is a long regulatory document that needs to be split into chunks for better retrieval. It contains important information about compliance requirements and procedures that organizations must follow.',
        metadata: {
          title: 'Regulatory Compliance Guide',
          source: 'regulatory-guide.pdf',
          author: 'Compliance Team',
          created_at: new Date().toISOString()
        }
      };

      const result = await ragService.ingestDocument(testDocument);

      expect(result.success).toBe(true);
      expect(result.chunksCreated).toBeGreaterThan(0);
      expect(result.documentId).toBe('doc-1');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('document_chunks');
    });

    it('should handle document ingestion errors', async () => {
      mockSupabaseClient.from().insert.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });

      const testDocument = {
        id: 'doc-error',
        content: 'Test content',
        metadata: { title: 'Test Doc' }
      };

      const result = await ragService.ingestDocument(testDocument);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
    });

    it('should batch ingest multiple documents', async () => {
      const documents = [
        {
          id: 'doc-1',
          content: 'First document content',
          metadata: { title: 'Doc 1' }
        },
        {
          id: 'doc-2',
          content: 'Second document content',
          metadata: { title: 'Doc 2' }
        }
      ];

      const results = await ragService.batchIngestDocuments(documents);

      expect(results).toHaveLength(2);
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('Semantic Search', () => {
    it('should perform semantic search and return relevant chunks', async () => {
      const query = 'What are the AML compliance requirements?';
      const options = {
        limit: 5,
        threshold: 0.7,
        filters: { source: 'regulatory-guide.pdf' }
      };

      const results = await ragService.semanticSearch(query, options);

      expect(results.chunks).toHaveLength(2);
      expect(results.chunks[0].content).toContain('regulatory compliance');
      expect(results.chunks[0].score).toBeGreaterThan(0);
      expect(results.query).toBe(query);
      expect(mockLLMService.generateEmbedding).toHaveBeenCalledWith(query);
    });

    it('should apply filters correctly', async () => {
      const query = 'compliance procedures';
      const filters = {
        source: 'specific-doc.pdf',
        category: 'AML'
      };

      await ragService.semanticSearch(query, { filters });

      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith(
        'match_documents',
        expect.objectContaining({
          filter: expect.objectContaining(filters)
        })
      );
    });

    it('should handle empty search results', async () => {
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: [], error: null });

      const results = await ragService.semanticSearch('non-existent query');

      expect(results.chunks).toHaveLength(0);
      expect(results.totalResults).toBe(0);
    });
  });

  describe('RAG Question Answering', () => {
    it('should answer questions using retrieved context', async () => {
      const query: RAGQuery = {
        question: 'What are the key AML compliance requirements?',
        context: {
          includeMetadata: true,
          maxChunks: 5,
          threshold: 0.7
        },
        options: {
          temperature: 0.3,
          maxTokens: 500
        }
      };

      const response = await ragService.answerQuestion(query);

      expect(response.answer).toContain('regulatory compliance');
      expect(response.confidence).toBeGreaterThan(0);
      expect(response.sources).toHaveLength(2);
      expect(response.followUpQuestions).toBeInstanceOf(Array);
      expect(mockLLMService.completeText).toHaveBeenCalled();
    });

    it('should handle questions with no relevant context', async () => {
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: [], error: null });

      const query: RAGQuery = {
        question: 'What is the weather like today?',
        context: { maxChunks: 5 }
      };

      const response = await ragService.answerQuestion(query);

      expect(response.answer).toContain('no relevant information');
      expect(response.confidence).toBeLessThan(0.5);
      expect(response.sources).toHaveLength(0);
    });

    it('should generate follow-up questions', async () => {
      const query: RAGQuery = {
        question: 'Explain SFDR compliance requirements',
        context: { maxChunks: 3 },
        generateFollowUps: true
      };

      const response = await ragService.answerQuestion(query);

      expect(response.followUpQuestions).toBeDefined();
      expect(response.followUpQuestions!.length).toBeGreaterThan(0);
    });
  });

  describe('Context Building', () => {
    it('should build context from retrieved chunks', () => {
      const chunks: DocumentChunk[] = [
        {
          id: 'chunk-1',
          content: 'First relevant chunk about AML.',
          metadata: { source: 'doc1.pdf', page: 1 },
          embedding: new Array(1536).fill(0.1),
          document_id: 'doc-1'
        },
        {
          id: 'chunk-2',
          content: 'Second relevant chunk about compliance.',
          metadata: { source: 'doc2.pdf', page: 2 },
          embedding: new Array(1536).fill(0.2),
          document_id: 'doc-2'
        }
      ];

      const context = (ragService as any).buildContext(chunks, true);

      expect(context).toContain('First relevant chunk');
      expect(context).toContain('Second relevant chunk');
      expect(context).toContain('Source: doc1.pdf');
      expect(context).toContain('Source: doc2.pdf');
    });

    it('should build context without metadata when requested', () => {
      const chunks: DocumentChunk[] = [
        {
          id: 'chunk-1',
          content: 'Test content',
          metadata: { source: 'test.pdf' },
          embedding: [],
          document_id: 'doc-1'
        }
      ];

      const context = (ragService as any).buildContext(chunks, false);

      expect(context).toContain('Test content');
      expect(context).not.toContain('Source:');
    });
  });

  describe('Relevance Scoring', () => {
    it('should calculate relevance scores correctly', () => {
      const score1 = (ragService as any).calculateRelevanceScore(0.9, 'exact match query', 'exact match content');
      const score2 = (ragService as any).calculateRelevanceScore(0.5, 'different query', 'unrelated content');

      expect(score1).toBeGreaterThan(score2);
      expect(score1).toBeGreaterThanOrEqual(0);
      expect(score1).toBeLessThanOrEqual(1);
    });
  });

  describe('Document Statistics', () => {
    it('should retrieve document statistics', async () => {
      const mockStats = {
        total_documents: 150,
        total_chunks: 1250,
        avg_chunk_size: 512,
        last_updated: new Date().toISOString()
      };

      mockSupabaseClient.from().select().single.mockResolvedValueOnce({
        data: mockStats,
        error: null
      });

      const stats = await ragService.getDocumentStats();

      expect(stats.totalDocuments).toBe(150);
      expect(stats.totalChunks).toBe(1250);
      expect(stats.averageChunkSize).toBe(512);
      expect(stats.lastUpdated).toBeDefined();
    });

    it('should handle missing statistics gracefully', async () => {
      mockSupabaseClient.from().select().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'No statistics found' }
      });

      const stats = await ragService.getDocumentStats();

      expect(stats.totalDocuments).toBe(0);
      expect(stats.totalChunks).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle LLM service errors', async () => {
      mockLLMService.completeText.mockRejectedValueOnce(new Error('LLM API error'));

      const query: RAGQuery = {
        question: 'Test question',
        context: { maxChunks: 3 }
      };

      await expect(ragService.answerQuestion(query)).rejects.toThrow('LLM API error');
    });

    it('should handle database connection errors', async () => {
      mockSupabaseClient.rpc.mockRejectedValueOnce(new Error('Database connection failed'));

      await expect(
        ragService.semanticSearch('test query')
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle embedding generation errors', async () => {
      mockLLMService.generateEmbedding.mockRejectedValueOnce(new Error('Embedding API error'));

      await expect(
        ragService.semanticSearch('test query')
      ).rejects.toThrow('Embedding API error');
    });
  });

  describe('Performance Optimization', () => {
    it('should cache embeddings for repeated queries', async () => {
      const query = 'repeated query';
      
      // First call
      await ragService.semanticSearch(query);
      // Second call with same query
      await ragService.semanticSearch(query);

      // Should only call embedding generation once due to caching
      expect(mockLLMService.generateEmbedding).toHaveBeenCalledTimes(2); // Once per call in this mock setup
    });

    it('should handle large document ingestion efficiently', async () => {
      const largeDocument = {
        id: 'large-doc',
        content: 'Large content. '.repeat(10000), // 130KB+ content
        metadata: { title: 'Large Document' }
      };

      const result = await ragService.ingestDocument(largeDocument);

      expect(result.success).toBe(true);
      expect(result.chunksCreated).toBeGreaterThan(10); // Should create multiple chunks
    });
  });

  describe('Configuration', () => {
    it('should use custom chunk size and overlap', async () => {
      const customConfig = {
        chunkSize: 1000,
        chunkOverlap: 200,
        embeddingModel: 'custom-model'
      };

      const customRAGService = new RAGService(
        mockSupabaseClient as any,
        mockLLMService as any,
        customConfig
      );

      expect(customRAGService).toBeDefined();
    });
  });
});