import { llmService, LLMResponse } from '../nlp/LLMService';
import { supabase } from '../supabase';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

// Types for RAG operations
export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    title: string;
    type: 'regulation' | 'guidance' | 'policy' | 'case_study';
    jurisdiction: string;
    effectiveDate?: string;
    tags: string[];
  };
  embedding?: number[];
}

export interface RAGQuery {
  question: string;
  context?: string;
  filters?: {
    jurisdiction?: string;
    type?: string;
    dateRange?: {
      start: string;
      end: string;
    };
    tags?: string[];
  };
  maxResults?: number;
}

export interface RAGResponse {
  answer: string;
  sources: DocumentChunk[];
  confidence: number;
  reasoning: string;
  followUpQuestions: string[];
}

export interface SearchResult {
  chunk: DocumentChunk;
  similarity: number;
  relevanceScore: number;
}

export class RAGService {
  private vectorStore: SupabaseVectorStore;
  private embeddings: OpenAIEmbeddings;
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    });

    this.vectorStore = new SupabaseVectorStore(this.embeddings, {
      client: supabase,
      tableName: 'document_chunks',
      queryName: 'match_documents',
    });

    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', '. ', ' ', ''],
    });
  }

  /**
   * Process and store a document in the vector database
   */
  async ingestDocument(
    content: string,
    metadata: DocumentChunk['metadata']
  ): Promise<string[]> {
    try {
      // Split document into chunks
      const docs = await this.textSplitter.createDocuments(
        [content],
        [metadata]
      );

      // Generate embeddings and store in vector database
      const chunkIds: string[] = [];
      
      for (const doc of docs) {
        const chunkId = `${metadata.source}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store in vector database
        await this.vectorStore.addDocuments([doc], { ids: [chunkId] });
        
        // Store metadata in regular database
        await supabase.from('document_metadata').insert({
          chunk_id: chunkId,
          source: metadata.source,
          title: metadata.title,
          type: metadata.type,
          jurisdiction: metadata.jurisdiction,
          effective_date: metadata.effectiveDate,
          tags: metadata.tags,
          content_preview: doc.pageContent.substring(0, 200),
          created_at: new Date().toISOString()
        });
        
        chunkIds.push(chunkId);
      }

      console.log(`Ingested document: ${metadata.title} (${chunkIds.length} chunks)`);
      return chunkIds;
    } catch (error) {
      console.error('Document ingestion failed:', error);
      throw new Error(`Failed to ingest document: ${error}`);
    }
  }

  /**
   * Perform semantic search across documents
   */
  async semanticSearch(
    query: string,
    filters?: RAGQuery['filters'],
    maxResults: number = 5
  ): Promise<SearchResult[]> {
    try {
      // Build filter conditions
      let filterConditions: any = {};
      
      if (filters) {
        if (filters.jurisdiction) {
          filterConditions.jurisdiction = { $eq: filters.jurisdiction };
        }
        if (filters.type) {
          filterConditions.type = { $eq: filters.type };
        }
        if (filters.tags && filters.tags.length > 0) {
          filterConditions.tags = { $contains: filters.tags };
        }
      }

      // Perform vector similarity search
      const results = await this.vectorStore.similaritySearchWithScore(
        query,
        maxResults,
        filterConditions
      );

      // Transform results
      const searchResults: SearchResult[] = [];
      
      for (const [doc, similarity] of results) {
        const chunk: DocumentChunk = {
          id: doc.metadata.id || '',
          content: doc.pageContent,
          metadata: doc.metadata as DocumentChunk['metadata']
        };
        
        // Calculate relevance score (combines similarity with other factors)
        const relevanceScore = this.calculateRelevanceScore(similarity, chunk, query);
        
        searchResults.push({
          chunk,
          similarity,
          relevanceScore
        });
      }

      // Sort by relevance score
      return searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      console.error('Semantic search failed:', error);
      throw new Error(`Semantic search failed: ${error}`);
    }
  }

  /**
   * Answer a question using RAG (Retrieval-Augmented Generation)
   */
  async answerQuestion(query: RAGQuery): Promise<RAGResponse> {
    try {
      // Step 1: Retrieve relevant documents
      const searchResults = await this.semanticSearch(
        query.question,
        query.filters,
        query.maxResults || 5
      );

      if (searchResults.length === 0) {
        return {
          answer: "I couldn't find relevant information to answer your question. Please try rephrasing or check if the topic is covered in our knowledge base.",
          sources: [],
          confidence: 0.1,
          reasoning: "No relevant documents found in the knowledge base.",
          followUpQuestions: [
            "Could you provide more specific details about your question?",
            "Are you looking for information about a specific jurisdiction?",
            "Would you like me to search for related topics?"
          ]
        };
      }

      // Step 2: Prepare context from retrieved documents
      const context = this.buildContext(searchResults, query.context);
      
      // Step 3: Generate answer using LLM
      const prompt = this.buildRAGPrompt(query.question, context, searchResults);
      
      const llmResponse = await llmService.generateCompletion(prompt, {
        temperature: 0.2,
        maxTokens: 1000
      });

      // Step 4: Extract structured response
      const structuredResponse = await this.parseRAGResponse(llmResponse.text);
      
      // Step 5: Generate follow-up questions
      const followUpQuestions = await this.generateFollowUpQuestions(
        query.question,
        structuredResponse.answer
      );

      return {
        answer: structuredResponse.answer,
        sources: searchResults.map(r => r.chunk),
        confidence: this.calculateAnswerConfidence(searchResults, llmResponse),
        reasoning: structuredResponse.reasoning,
        followUpQuestions
      };
    } catch (error) {
      console.error('RAG query failed:', error);
      throw new Error(`Failed to answer question: ${error}`);
    }
  }

  /**
   * Build context string from search results
   */
  private buildContext(searchResults: SearchResult[], additionalContext?: string): string {
    let context = '';
    
    if (additionalContext) {
      context += `Additional Context: ${additionalContext}\n\n`;
    }
    
    context += 'Relevant Documents:\n\n';
    
    searchResults.forEach((result, index) => {
      const chunk = result.chunk;
      context += `Document ${index + 1}:\n`;
      context += `Title: ${chunk.metadata.title}\n`;
      context += `Source: ${chunk.metadata.source}\n`;
      context += `Type: ${chunk.metadata.type}\n`;
      context += `Jurisdiction: ${chunk.metadata.jurisdiction}\n`;
      if (chunk.metadata.effectiveDate) {
        context += `Effective Date: ${chunk.metadata.effectiveDate}\n`;
      }
      context += `Content: ${chunk.content}\n\n`;
    });
    
    return context;
  }

  /**
   * Build RAG prompt for LLM
   */
  private buildRAGPrompt(question: string, context: string, sources: SearchResult[]): string {
    return `You are a GRC (Governance, Risk, and Compliance) expert assistant. Answer the user's question based on the provided regulatory documents and context.

IMPORTANT GUIDELINES:
1. Base your answer primarily on the provided documents
2. Be specific and cite relevant sections when possible
3. If information is incomplete, acknowledge limitations
4. Provide actionable guidance when appropriate
5. Use clear, professional language suitable for compliance professionals
6. Include relevant regulatory references and effective dates

CONTEXT:
${context}

QUESTION: ${question}

Provide your response in the following JSON format:
{
  "answer": "Your comprehensive answer here",
  "reasoning": "Explanation of how you arrived at this answer",
  "key_points": ["Important points from the analysis"],
  "regulatory_references": ["Specific regulations or sections cited"],
  "limitations": "Any limitations or caveats to note"
}

RESPONSE:`;
  }

  /**
   * Parse structured response from LLM
   */
  private async parseRAGResponse(response: string): Promise<{
    answer: string;
    reasoning: string;
    keyPoints: string[];
    regulatoryReferences: string[];
    limitations: string;
  }> {
    try {
      const parsed = JSON.parse(response);
      return {
        answer: parsed.answer || response,
        reasoning: parsed.reasoning || 'Based on analysis of provided documents',
        keyPoints: parsed.key_points || [],
        regulatoryReferences: parsed.regulatory_references || [],
        limitations: parsed.limitations || ''
      };
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        answer: response,
        reasoning: 'Based on analysis of provided documents',
        keyPoints: [],
        regulatoryReferences: [],
        limitations: ''
      };
    }
  }

  /**
   * Generate follow-up questions
   */
  private async generateFollowUpQuestions(
    originalQuestion: string,
    answer: string
  ): Promise<string[]> {
    const prompt = `Based on this Q&A about regulatory compliance, suggest 3 relevant follow-up questions:

Original Question: ${originalQuestion}
Answer: ${answer}

Generate questions that would help the user dive deeper into related compliance topics.
Return as JSON array: ["question1", "question2", "question3"]`;

    try {
      const response = await llmService.generateCompletion(prompt, {
        temperature: 0.3,
        maxTokens: 200
      });
      
      return JSON.parse(response.text);
    } catch (error) {
      // Fallback questions
      return [
        "What are the implementation requirements for this regulation?",
        "Are there any recent updates or amendments to consider?",
        "How does this apply to different types of organizations?"
      ];
    }
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevanceScore(
    similarity: number,
    chunk: DocumentChunk,
    query: string
  ): number {
    let score = similarity;
    
    // Boost score for recent documents
    if (chunk.metadata.effectiveDate) {
      const effectiveDate = new Date(chunk.metadata.effectiveDate);
      const now = new Date();
      const daysDiff = (now.getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff < 365) { // Within last year
        score += 0.1;
      }
    }
    
    // Boost score for exact keyword matches
    const queryLower = query.toLowerCase();
    const contentLower = chunk.content.toLowerCase();
    const titleLower = chunk.metadata.title.toLowerCase();
    
    if (titleLower.includes(queryLower)) {
      score += 0.15;
    }
    
    // Count keyword matches
    const keywords = queryLower.split(' ').filter(word => word.length > 3);
    const keywordMatches = keywords.filter(keyword => 
      contentLower.includes(keyword)
    ).length;
    
    score += (keywordMatches / keywords.length) * 0.1;
    
    return Math.min(score, 1.0);
  }

  /**
   * Calculate confidence score for the final answer
   */
  private calculateAnswerConfidence(
    searchResults: SearchResult[],
    llmResponse: LLMResponse
  ): number {
    if (searchResults.length === 0) return 0.1;
    
    // Base confidence on search result quality
    const avgRelevance = searchResults.reduce((sum, result) => 
      sum + result.relevanceScore, 0
    ) / searchResults.length;
    
    // Factor in LLM confidence
    const combinedConfidence = (avgRelevance + llmResponse.confidence) / 2;
    
    // Boost confidence if multiple high-quality sources agree
    const highQualitySources = searchResults.filter(r => r.relevanceScore > 0.8).length;
    const sourceBonus = Math.min(highQualitySources * 0.05, 0.15);
    
    return Math.min(combinedConfidence + sourceBonus, 0.95);
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(): Promise<{
    totalDocuments: number;
    totalChunks: number;
    byType: Record<string, number>;
    byJurisdiction: Record<string, number>;
    recentlyAdded: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('document_metadata')
        .select('type, jurisdiction, created_at');

      if (error) throw error;

      const totalChunks = data.length;
      const uniqueSources = new Set(data.map(d => d.source)).size;
      
      const byType: Record<string, number> = {};
      const byJurisdiction: Record<string, number> = {};
      
      let recentlyAdded = 0;
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      data.forEach(doc => {
        // Count by type
        byType[doc.type] = (byType[doc.type] || 0) + 1;
        
        // Count by jurisdiction
        byJurisdiction[doc.jurisdiction] = (byJurisdiction[doc.jurisdiction] || 0) + 1;
        
        // Count recently added
        if (new Date(doc.created_at) > weekAgo) {
          recentlyAdded++;
        }
      });

      return {
        totalDocuments: uniqueSources,
        totalChunks,
        byType,
        byJurisdiction,
        recentlyAdded
      };
    } catch (error) {
      console.error('Failed to get document stats:', error);
      return {
        totalDocuments: 0,
        totalChunks: 0,
        byType: {},
        byJurisdiction: {},
        recentlyAdded: 0
      };
    }
  }
}

// Export singleton instance
export const ragService = new RAGService();