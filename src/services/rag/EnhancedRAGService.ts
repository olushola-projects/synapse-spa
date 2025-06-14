import { supabase } from '../supabase';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { QdrantVectorStore } from '@langchain/qdrant';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { HuggingFaceTransformersEmbeddings } from 'langchain/embeddings/hf_transformers';
import { enhancedLLMService } from '../nlp/EnhancedLLMService';
import { QdrantClient } from '@qdrant/js-client-rest';

// Enhanced types for advanced RAG operations
export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    title: string;
    type: 'regulation' | 'guidance' | 'policy' | 'case_study' | 'precedent' | 'interpretation';
    jurisdiction: string;
    framework: string;
    effectiveDate?: string;
    lastUpdated?: string;
    tags: string[];
    importance: 'low' | 'medium' | 'high' | 'critical';
    reliability: number; // 0-1 score
    version?: string;
  };
  embedding?: number[];
  chunkIndex?: number;
  parentDocumentId?: string;
}

export interface RAGQuery {
  question: string;
  context?: string;
  filters?: {
    jurisdiction?: string[];
    framework?: string[];
    type?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
    tags?: string[];
    importance?: string[];
    minReliability?: number;
  };
  retrievalStrategy?: 'semantic' | 'hybrid' | 'keyword' | 'hierarchical';
  maxResults?: number;
  rerankResults?: boolean;
  includeMetadata?: boolean;
}

export interface RAGResponse {
  answer: string;
  sources: DocumentChunk[];
  confidence: number;
  reasoning: string;
  followUpQuestions: string[];
  citations: Citation[];
  retrievalMetrics: {
    totalDocuments: number;
    relevantDocuments: number;
    avgRelevanceScore: number;
    retrievalTime: number;
  };
}

export interface Citation {
  id: string;
  title: string;
  source: string;
  url?: string;
  relevanceScore: number;
  excerpt: string;
  metadata: DocumentChunk['metadata'];
}

export interface SearchResult {
  chunk: DocumentChunk;
  similarity: number;
  relevanceScore: number;
  rerankScore?: number;
}

export interface VectorStoreConfig {
  provider: 'supabase' | 'qdrant' | 'hybrid';
  embeddingModel: 'openai-small' | 'openai-large' | 'sentence-transformers';
  chunkSize: number;
  chunkOverlap: number;
  enableReranking: boolean;
}

export class EnhancedRAGService {
  private supabaseVectorStore: SupabaseVectorStore;
  private qdrantVectorStore?: QdrantVectorStore;
  private qdrantClient?: QdrantClient;
  private openaiEmbeddings: OpenAIEmbeddings;
  private huggingfaceEmbeddings: HuggingFaceTransformersEmbeddings;
  private textSplitter: RecursiveCharacterTextSplitter;
  private config: VectorStoreConfig;
  private documentCache: Map<string, DocumentChunk[]> = new Map();

  constructor(config: Partial<VectorStoreConfig> = {}) {
    this.config = {
      provider: 'supabase',
      embeddingModel: 'openai-small',
      chunkSize: 1000,
      chunkOverlap: 200,
      enableReranking: true,
      ...config
    };

    // Initialize embeddings
    this.openaiEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
      modelName: this.config.embeddingModel === 'openai-large' ? 'text-embedding-3-large' : 'text-embedding-3-small',
    });

    this.huggingfaceEmbeddings = new HuggingFaceTransformersEmbeddings({
      modelName: 'sentence-transformers/all-MiniLM-L6-v2',
    });

    // Initialize vector stores
    this.supabaseVectorStore = new SupabaseVectorStore(this.openaiEmbeddings, {
      client: supabase,
      tableName: 'document_chunks',
      queryName: 'match_documents',
    });

    // Initialize Qdrant if configured
    if (this.config.provider === 'qdrant' || this.config.provider === 'hybrid') {
      this.initializeQdrant();
    }

    // Initialize text splitter with advanced configuration
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.config.chunkSize,
      chunkOverlap: this.config.chunkOverlap,
      separators: ['\n\n', '\n', '. ', '! ', '? ', '; ', ': ', ' ', ''],
      keepSeparator: true,
    });
  }

  private async initializeQdrant(): Promise<void> {
    try {
      this.qdrantClient = new QdrantClient({
        url: import.meta.env.VITE_QDRANT_URL || 'http://localhost:6333',
        apiKey: import.meta.env.VITE_QDRANT_API_KEY,
      });

      this.qdrantVectorStore = new QdrantVectorStore(this.openaiEmbeddings, {
        client: this.qdrantClient,
        collectionName: 'grc_documents',
      });

      // Ensure collection exists
      await this.ensureQdrantCollection();
    } catch (error) {
      console.warn('Qdrant initialization failed, falling back to Supabase:', error);
      this.config.provider = 'supabase';
    }
  }

  private async ensureQdrantCollection(): Promise<void> {
    if (!this.qdrantClient) return;

    try {
      const collections = await this.qdrantClient.getCollections();
      const collectionExists = collections.collections.some(
        col => col.name === 'grc_documents'
      );

      if (!collectionExists) {
        await this.qdrantClient.createCollection('grc_documents', {
          vectors: {
            size: this.config.embeddingModel === 'openai-large' ? 3072 : 1536,
            distance: 'Cosine',
          },
          optimizers_config: {
            default_segment_number: 2,
          },
          replication_factor: 1,
        });
      }
    } catch (error) {
      console.error('Failed to ensure Qdrant collection:', error);
    }
  }

  /**
   * Advanced document ingestion with hierarchical chunking
   */
  async ingestDocument(
    content: string,
    metadata: DocumentChunk['metadata'],
    options: {
      enableHierarchicalChunking?: boolean;
      customChunkSize?: number;
      extractEntities?: boolean;
    } = {}
  ): Promise<string[]> {
    const startTime = Date.now();
    
    try {
      const {
        enableHierarchicalChunking = true,
        customChunkSize,
        extractEntities = true
      } = options;

      // Use custom chunk size if provided
      if (customChunkSize) {
        this.textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: customChunkSize,
          chunkOverlap: Math.floor(customChunkSize * 0.2),
          separators: ['\n\n', '\n', '. ', ' ', ''],
        });
      }

      // Extract entities and key information
      let enhancedMetadata = { ...metadata };
      if (extractEntities) {
        enhancedMetadata = await this.extractDocumentEntities(content, metadata);
      }

      // Create document chunks
      const docs = await this.textSplitter.createDocuments(
        [content],
        [enhancedMetadata]
      );

      const chunkIds: string[] = [];
      const parentDocumentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Process chunks with hierarchical structure
      for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        const chunkId = `${parentDocumentId}_chunk_${i}`;
        
        const chunk: DocumentChunk = {
          id: chunkId,
          content: doc.pageContent,
          metadata: {
            ...enhancedMetadata,
            chunkIndex: i,
            parentDocumentId,
          } as DocumentChunk['metadata'],
          chunkIndex: i,
          parentDocumentId,
        };

        // Store in vector database(s)
        await this.storeChunk(chunk);
        
        // Store metadata in relational database
        await this.storeChunkMetadata(chunk);
        
        chunkIds.push(chunkId);
      }

      // Create document summary for better retrieval
      if (enableHierarchicalChunking) {
        await this.createDocumentSummary(content, enhancedMetadata, parentDocumentId);
      }

      const processingTime = Date.now() - startTime;
      await this.logIngestionMetrics({
        documentId: parentDocumentId,
        chunkCount: chunkIds.length,
        processingTime,
        success: true
      });

      return chunkIds;
    } catch (error) {
      console.error('Document ingestion failed:', error);
      await this.logIngestionMetrics({
        documentId: 'unknown',
        chunkCount: 0,
        processingTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Advanced RAG query with multiple retrieval strategies
   */
  async query(ragQuery: RAGQuery): Promise<RAGResponse> {
    const startTime = Date.now();
    
    try {
      // Step 1: Retrieve relevant documents
      const retrievalResults = await this.retrieveDocuments(ragQuery);
      
      // Step 2: Rerank results if enabled
      const rankedResults = this.config.enableReranking && ragQuery.rerankResults !== false
        ? await this.rerankResults(ragQuery.question, retrievalResults)
        : retrievalResults;
      
      // Step 3: Generate answer using retrieved context
      const answer = await this.generateAnswer(ragQuery, rankedResults);
      
      // Step 4: Create citations
      const citations = this.createCitations(rankedResults);
      
      // Step 5: Generate follow-up questions
      const followUpQuestions = await this.generateFollowUpQuestions(ragQuery.question, answer);
      
      const retrievalTime = Date.now() - startTime;
      
      const response: RAGResponse = {
        answer,
        sources: rankedResults.map(r => r.chunk),
        confidence: this.calculateConfidence(rankedResults, answer),
        reasoning: await this.generateReasoning(ragQuery, rankedResults, answer),
        followUpQuestions,
        citations,
        retrievalMetrics: {
          totalDocuments: retrievalResults.length,
          relevantDocuments: rankedResults.length,
          avgRelevanceScore: rankedResults.reduce((sum, r) => sum + r.relevanceScore, 0) / rankedResults.length,
          retrievalTime
        }
      };
      
      // Log query metrics
      await this.logQueryMetrics({
        query: ragQuery.question,
        retrievalTime,
        documentCount: rankedResults.length,
        confidence: response.confidence,
        success: true
      });
      
      return response;
    } catch (error) {
      console.error('RAG query failed:', error);
      await this.logQueryMetrics({
        query: ragQuery.question,
        retrievalTime: Date.now() - startTime,
        documentCount: 0,
        confidence: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Retrieve documents using multiple strategies
   */
  private async retrieveDocuments(ragQuery: RAGQuery): Promise<SearchResult[]> {
    const strategy = ragQuery.retrievalStrategy || 'hybrid';
    const maxResults = ragQuery.maxResults || 10;
    
    switch (strategy) {
      case 'semantic':
        return await this.semanticRetrieval(ragQuery, maxResults);
      case 'keyword':
        return await this.keywordRetrieval(ragQuery, maxResults);
      case 'hierarchical':
        return await this.hierarchicalRetrieval(ragQuery, maxResults);
      case 'hybrid':
      default:
        return await this.hybridRetrieval(ragQuery, maxResults);
    }
  }

  /**
   * Semantic retrieval using vector similarity
   */
  private async semanticRetrieval(ragQuery: RAGQuery, maxResults: number): Promise<SearchResult[]> {
    const vectorStore = this.getVectorStore();
    
    const results = await vectorStore.similaritySearchWithScore(
      ragQuery.question,
      maxResults,
      this.buildVectorStoreFilter(ragQuery.filters)
    );
    
    return results.map(([doc, score]) => ({
      chunk: this.documentToChunk(doc),
      similarity: score,
      relevanceScore: score
    }));
  }

  /**
   * Hybrid retrieval combining semantic and keyword search
   */
  private async hybridRetrieval(ragQuery: RAGQuery, maxResults: number): Promise<SearchResult[]> {
    // Get semantic results
    const semanticResults = await this.semanticRetrieval(ragQuery, Math.ceil(maxResults * 0.7));
    
    // Get keyword results
    const keywordResults = await this.keywordRetrieval(ragQuery, Math.ceil(maxResults * 0.5));
    
    // Combine and deduplicate
    const combinedResults = new Map<string, SearchResult>();
    
    // Add semantic results with higher weight
    semanticResults.forEach(result => {
      combinedResults.set(result.chunk.id, {
        ...result,
        relevanceScore: result.similarity * 0.7
      });
    });
    
    // Add keyword results with lower weight, boost if already exists
    keywordResults.forEach(result => {
      const existing = combinedResults.get(result.chunk.id);
      if (existing) {
        existing.relevanceScore += result.relevanceScore * 0.3;
      } else {
        combinedResults.set(result.chunk.id, {
          ...result,
          relevanceScore: result.relevanceScore * 0.3
        });
      }
    });
    
    // Sort by relevance score and return top results
    return Array.from(combinedResults.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  /**
   * Keyword-based retrieval using full-text search
   */
  private async keywordRetrieval(ragQuery: RAGQuery, maxResults: number): Promise<SearchResult[]> {
    // Extract keywords from query
    const keywords = await this.extractKeywords(ragQuery.question);
    
    // Build full-text search query
    const searchQuery = keywords.join(' | ');
    
    // Execute search in Supabase
    let query = supabase
      .from('document_chunks')
      .select('*')
      .textSearch('content', searchQuery)
      .limit(maxResults);
    
    // Apply filters
    if (ragQuery.filters) {
      query = this.applyFilters(query, ragQuery.filters);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(row => ({
      chunk: this.rowToChunk(row),
      similarity: 0.8, // Default similarity for keyword search
      relevanceScore: 0.8
    }));
  }

  /**
   * Hierarchical retrieval using document structure
   */
  private async hierarchicalRetrieval(ragQuery: RAGQuery, maxResults: number): Promise<SearchResult[]> {
    // First, find relevant document summaries
    const summaryResults = await this.semanticRetrieval(
      { ...ragQuery, question: `Summary: ${ragQuery.question}` },
      Math.ceil(maxResults / 2)
    );
    
    // Then, get detailed chunks from those documents
    const detailedResults: SearchResult[] = [];
    
    for (const summaryResult of summaryResults) {
      if (summaryResult.chunk.parentDocumentId) {
        const chunks = await this.getDocumentChunks(summaryResult.chunk.parentDocumentId);
        const relevantChunks = await this.findRelevantChunks(ragQuery.question, chunks);
        detailedResults.push(...relevantChunks);
      }
    }
    
    return detailedResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  /**
   * Generate answer using retrieved context
   */
  private async generateAnswer(ragQuery: RAGQuery, results: SearchResult[]): Promise<string> {
    const context = results
      .map(r => `Source: ${r.chunk.metadata.title}\nContent: ${r.chunk.content}`)
      .join('\n\n---\n\n');
    
    const prompt = `
You are an expert GRC (Governance, Risk, and Compliance) analyst. Answer the following question based on the provided regulatory context.

Question: ${ragQuery.question}

Context:
${context}

Instructions:
1. Provide a comprehensive and accurate answer based on the context
2. Cite specific sources when making claims
3. If the context doesn't contain enough information, clearly state this
4. Focus on practical implications for GRC professionals
5. Use clear, professional language

Answer:`;

    const response = await enhancedLLMService.generateCompletion(prompt, {
      taskType: 'reasoning',
      complexity: 'high',
      config: {
        temperature: 0.1,
        maxTokens: 1500
      }
    });
    
    return response.text;
  }

  /**
   * Helper methods
   */
  private getVectorStore() {
    if (this.config.provider === 'qdrant' && this.qdrantVectorStore) {
      return this.qdrantVectorStore;
    }
    return this.supabaseVectorStore;
  }

  private async storeChunk(chunk: DocumentChunk): Promise<void> {
    // Store in vector database
    const doc = new Document({
      pageContent: chunk.content,
      metadata: chunk.metadata
    });
    
    if (this.config.provider === 'hybrid') {
      // Store in both Supabase and Qdrant
      await Promise.all([
        this.supabaseVectorStore.addDocuments([doc], { ids: [chunk.id] }),
        this.qdrantVectorStore?.addDocuments([doc], { ids: [chunk.id] })
      ]);
    } else {
      const vectorStore = this.getVectorStore();
      await vectorStore.addDocuments([doc], { ids: [chunk.id] });
    }
  }

  private async storeChunkMetadata(chunk: DocumentChunk): Promise<void> {
    await supabase.from('document_metadata').insert({
      id: chunk.id,
      parent_document_id: chunk.parentDocumentId,
      chunk_index: chunk.chunkIndex,
      content_preview: chunk.content.substring(0, 200),
      ...chunk.metadata,
      created_at: new Date().toISOString()
    });
  }

  private async extractDocumentEntities(content: string, metadata: DocumentChunk['metadata']): Promise<DocumentChunk['metadata']> {
    // Use LLM to extract key entities and enhance metadata
    const extractionPrompt = `
Extract key regulatory entities from this document:

${content.substring(0, 2000)}

Return JSON with:
{
  "entities": ["entity1", "entity2"],
  "frameworks": ["framework1"],
  "importance": "high|medium|low",
  "reliability": 0.95,
  "additionalTags": ["tag1", "tag2"]
}`;

    try {
      const response = await enhancedLLMService.generateCompletion(extractionPrompt, {
        taskType: 'reasoning',
        complexity: 'medium',
        config: { temperature: 0.1 }
      });
      
      const extracted = JSON.parse(response.text);
      
      return {
        ...metadata,
        importance: extracted.importance || metadata.importance,
        reliability: extracted.reliability || 0.8,
        tags: [...metadata.tags, ...(extracted.additionalTags || [])]
      };
    } catch (error) {
      console.warn('Entity extraction failed:', error);
      return metadata;
    }
  }

  private async createDocumentSummary(content: string, metadata: DocumentChunk['metadata'], parentDocumentId: string): Promise<void> {
    const summaryPrompt = `
Create a concise summary of this regulatory document:

${content}

Focus on:
1. Key regulatory requirements
2. Important deadlines
3. Compliance implications
4. Main stakeholders affected

Summary:`;

    try {
      const response = await enhancedLLMService.generateCompletion(summaryPrompt, {
        taskType: 'general',
        complexity: 'medium',
        config: { temperature: 0.1, maxTokens: 500 }
      });
      
      const summaryChunk: DocumentChunk = {
        id: `${parentDocumentId}_summary`,
        content: response.text,
        metadata: {
          ...metadata,
          type: 'guidance',
          tags: [...metadata.tags, 'summary']
        },
        parentDocumentId
      };
      
      await this.storeChunk(summaryChunk);
    } catch (error) {
      console.warn('Summary creation failed:', error);
    }
  }

  private async rerankResults(query: string, results: SearchResult[]): Promise<SearchResult[]> {
    // Simple reranking based on query-document relevance
    const rerankPrompt = `
Rank these documents by relevance to the query: "${query}"

Documents:
${results.map((r, i) => `${i + 1}. ${r.chunk.metadata.title}: ${r.chunk.content.substring(0, 200)}...`).join('\n')}

Return only the numbers in order of relevance (most relevant first): `;

    try {
      const response = await enhancedLLMService.generateCompletion(rerankPrompt, {
        taskType: 'reasoning',
        complexity: 'low',
        config: { temperature: 0.1, maxTokens: 100 }
      });
      
      const rankings = response.text.match(/\d+/g)?.map(n => parseInt(n) - 1) || [];
      
      return rankings
        .filter(i => i >= 0 && i < results.length)
        .map(i => ({
          ...results[i],
          rerankScore: (rankings.length - rankings.indexOf(i)) / rankings.length
        }));
    } catch (error) {
      console.warn('Reranking failed:', error);
      return results;
    }
  }

  private createCitations(results: SearchResult[]): Citation[] {
    return results.map(result => ({
      id: result.chunk.id,
      title: result.chunk.metadata.title,
      source: result.chunk.metadata.source,
      url: result.chunk.metadata.sourceUrl,
      relevanceScore: result.relevanceScore,
      excerpt: result.chunk.content.substring(0, 200) + '...',
      metadata: result.chunk.metadata
    }));
  }

  private async generateFollowUpQuestions(query: string, answer: string): Promise<string[]> {
    const prompt = `
Based on this Q&A about GRC/regulatory matters, suggest 3 relevant follow-up questions:

Q: ${query}
A: ${answer}

Follow-up questions:
1.`;

    try {
      const response = await enhancedLLMService.generateCompletion(prompt, {
        taskType: 'general',
        complexity: 'low',
        config: { temperature: 0.3, maxTokens: 200 }
      });
      
      return response.text
        .split('\n')
        .filter(line => line.match(/^\d+\./)) 
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 3);
    } catch (error) {
      console.warn('Follow-up question generation failed:', error);
      return [];
    }
  }

  private async generateReasoning(ragQuery: RAGQuery, results: SearchResult[], answer: string): Promise<string> {
    const prompt = `
Explain the reasoning behind this GRC analysis:

Query: ${ragQuery.question}
Sources used: ${results.length} documents
Answer: ${answer.substring(0, 500)}

Provide a brief explanation of how the sources support the answer:`;

    try {
      const response = await enhancedLLMService.generateCompletion(prompt, {
        taskType: 'reasoning',
        complexity: 'medium',
        config: { temperature: 0.1, maxTokens: 300 }
      });
      
      return response.text;
    } catch (error) {
      console.warn('Reasoning generation failed:', error);
      return 'Analysis based on retrieved regulatory documents and compliance guidelines.';
    }
  }

  private calculateConfidence(results: SearchResult[], answer: string): number {
    if (results.length === 0) return 0.1;
    
    const avgRelevance = results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length;
    const sourceQuality = results.reduce((sum, r) => sum + (r.chunk.metadata.reliability || 0.8), 0) / results.length;
    const answerLength = Math.min(answer.length / 500, 1);
    
    return Math.min((avgRelevance * 0.4 + sourceQuality * 0.4 + answerLength * 0.2), 1);
  }

  // Additional helper methods...
  private buildVectorStoreFilter(filters?: RAGQuery['filters']): any {
    if (!filters) return {};
    
    const filter: any = {};
    
    if (filters.jurisdiction) filter.jurisdiction = { $in: filters.jurisdiction };
    if (filters.framework) filter.framework = { $in: filters.framework };
    if (filters.type) filter.type = { $in: filters.type };
    if (filters.tags) filter.tags = { $in: filters.tags };
    if (filters.importance) filter.importance = { $in: filters.importance };
    if (filters.minReliability) filter.reliability = { $gte: filters.minReliability };
    
    return filter;
  }

  private documentToChunk(doc: Document): DocumentChunk {
    return {
      id: doc.metadata.id || 'unknown',
      content: doc.pageContent,
      metadata: doc.metadata as DocumentChunk['metadata']
    };
  }

  private rowToChunk(row: any): DocumentChunk {
    return {
      id: row.id,
      content: row.content,
      metadata: {
        source: row.source,
        title: row.title,
        type: row.type,
        jurisdiction: row.jurisdiction,
        framework: row.framework,
        effectiveDate: row.effective_date,
        lastUpdated: row.last_updated,
        tags: row.tags || [],
        importance: row.importance || 'medium',
        reliability: row.reliability || 0.8
      }
    };
  }

  private applyFilters(query: any, filters: RAGQuery['filters']): any {
    if (filters?.jurisdiction) query = query.in('jurisdiction', filters.jurisdiction);
    if (filters?.framework) query = query.in('framework', filters.framework);
    if (filters?.type) query = query.in('type', filters.type);
    if (filters?.importance) query = query.in('importance', filters.importance);
    if (filters?.minReliability) query = query.gte('reliability', filters.minReliability);
    
    return query;
  }

  private async extractKeywords(text: string): Promise<string[]> {
    // Simple keyword extraction - could be enhanced with NLP libraries
    const words = text.toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    return [...new Set(words)];
  }

  private async getDocumentChunks(parentDocumentId: string): Promise<DocumentChunk[]> {
    if (this.documentCache.has(parentDocumentId)) {
      return this.documentCache.get(parentDocumentId)!;
    }
    
    const { data, error } = await supabase
      .from('document_metadata')
      .select('*')
      .eq('parent_document_id', parentDocumentId)
      .order('chunk_index');
    
    if (error) throw error;
    
    const chunks = (data || []).map(row => this.rowToChunk(row));
    this.documentCache.set(parentDocumentId, chunks);
    
    return chunks;
  }

  private async findRelevantChunks(query: string, chunks: DocumentChunk[]): Promise<SearchResult[]> {
    // Simple relevance scoring - could be enhanced with embeddings
    const queryWords = query.toLowerCase().split(/\s+/);
    
    return chunks.map(chunk => {
      const content = chunk.content.toLowerCase();
      const matches = queryWords.filter(word => content.includes(word)).length;
      const relevanceScore = matches / queryWords.length;
      
      return {
        chunk,
        similarity: relevanceScore,
        relevanceScore
      };
    }).filter(result => result.relevanceScore > 0.1);
  }

  private async logIngestionMetrics(data: {
    documentId: string;
    chunkCount: number;
    processingTime: number;
    success: boolean;
    error?: string;
  }): Promise<void> {
    try {
      await supabase.from('rag_ingestion_logs').insert({
        ...data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to log ingestion metrics:', error);
    }
  }

  private async logQueryMetrics(data: {
    query: string;
    retrievalTime: number;
    documentCount: number;
    confidence: number;
    success: boolean;
    error?: string;
  }): Promise<void> {
    try {
      await supabase.from('rag_query_logs').insert({
        ...data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to log query metrics:', error);
    }
  }
}

// Export singleton instance
export const enhancedRAGService = new EnhancedRAGService();