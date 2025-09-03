import { apiClient } from '@/lib/api-client';
import {
  StoredDocumentAnalysis,
  DocumentAnalysisSearchQuery,
  DocumentAnalysisSearchResult,
  DocumentAnalysisSummary
} from '@/types/document-analysis';

export class DocumentAnalysisAPI {
  /**
   * Get document analysis by ID
   */
  static async getDocumentAnalysis(id: string): Promise<StoredDocumentAnalysis> {
    try {
      const response = await apiClient.get(`/api/document-analysis/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document analysis:', error);
      throw new Error('Failed to fetch document analysis');
    }
  }

  /**
   * Search user's document analyses
   */
  static async searchDocumentAnalyses(
    query: DocumentAnalysisSearchQuery = {}
  ): Promise<DocumentAnalysisSearchResult> {
    try {
      const params = new URLSearchParams();

      if (query.threadId) params.append('threadId', query.threadId);
      if (query.documentType) params.append('documentType', query.documentType);
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.offset) params.append('offset', query.offset.toString());

      const response = await apiClient.get(`/api/document-analysis?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching document analyses:', error);
      throw new Error('Failed to search document analyses');
    }
  }

  /**
   * Get recent document analyses for user
   */
  static async getRecentDocumentAnalyses(limit = 10): Promise<StoredDocumentAnalysis[]> {
    try {
      console.log('Making API call to:', `/api/document-analysis/recent/list?limit=${limit}`);
      const response = await apiClient.get(`/api/document-analysis/recent/list?limit=${limit}`);
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent document analyses:', error);
      
      // Check if it's an authentication error
      if ((error as any)?.status === 401) {
        throw new Error('Authentication required. Please log in to view document analyses.');
      }
      
      throw new Error(`Failed to fetch recent document analyses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get document analyses summary for user
   */
  static async getUserDocumentAnalysesSummary(): Promise<DocumentAnalysisSummary> {
    try {
      const response = await apiClient.get('/api/document-analysis/summary/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching document analyses summary:', error);
      throw new Error('Failed to fetch document analyses summary');
    }
  }

  /**
   * Get document analyses by thread
   */
  static async getThreadDocumentAnalyses(
    threadId: string,
    limit = 20
  ): Promise<StoredDocumentAnalysis[]> {
    try {
      const response = await apiClient.get(
        `/api/document-analysis/thread/${threadId}?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching thread document analyses:', error);
      throw new Error('Failed to fetch thread document analyses');
    }
  }
}
