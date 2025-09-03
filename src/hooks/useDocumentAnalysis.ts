import { useState, useEffect, useCallback } from 'react';
import { DocumentAnalysisAPI } from '@/services/document-analysis-api';
import {
  StoredDocumentAnalysis,
  DocumentAnalysisSearchQuery,
  DocumentAnalysisSearchResult,
  DocumentAnalysisSummary
} from '@/types/document-analysis';

export interface UseDocumentAnalysisReturn {
  analyses: StoredDocumentAnalysis[];
  summary: DocumentAnalysisSummary | null;
  loading: boolean;
  error: string | null;
  searchAnalyses: (query?: DocumentAnalysisSearchQuery) => Promise<void>;
  loadSummary: () => Promise<void>;
  loadRecentAnalyses: (limit?: number) => Promise<void>;
  loadThreadAnalyses: (threadId: string, limit?: number) => Promise<void>;
  getAnalysis: (id: string) => Promise<StoredDocumentAnalysis | null>;
  refresh: () => Promise<void>;
}

export function useDocumentAnalysis(): UseDocumentAnalysisReturn {
  const [analyses, setAnalyses] = useState<StoredDocumentAnalysis[]>([]);
  const [summary, setSummary] = useState<DocumentAnalysisSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: any, defaultMessage: string) => {
    const errorMessage = err?.message || defaultMessage;
    setError(errorMessage);
    console.error(defaultMessage, err);
  }, []);

  const searchAnalyses = useCallback(
    async (query: DocumentAnalysisSearchQuery = {}) => {
      setLoading(true);
      setError(null);

      try {
        const result: DocumentAnalysisSearchResult =
          await DocumentAnalysisAPI.searchDocumentAnalyses(query);
        setAnalyses(result.analyses || []);
      } catch (err) {
        handleError(err, 'Failed to search document analyses');
        setAnalyses([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Internal functions without loading state management
  const loadSummaryInternal = useCallback(async () => {
    try {
      const summaryData = await DocumentAnalysisAPI.getUserDocumentAnalysesSummary();
      setSummary(summaryData);
    } catch (err) {
      handleError(err, 'Failed to load document analysis summary');
    }
  }, [handleError]);

  const loadRecentAnalysesInternal = useCallback(
    async (limit = 10) => {
      try {
        const recentAnalyses = await DocumentAnalysisAPI.getRecentDocumentAnalyses(limit);
        console.log('API Response - Recent Analyses:', recentAnalyses);
        console.log('Type:', typeof recentAnalyses, 'Is Array:', Array.isArray(recentAnalyses));
        setAnalyses(recentAnalyses || []);
      } catch (err) {
        console.error('API Error in loadRecentAnalyses:', err);
        handleError(err, 'Failed to load recent document analyses');
        setAnalyses([]); // Reset to empty array on error
      }
    },
    [handleError]
  );

  // Public functions with loading state management
  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await loadSummaryInternal();
    } finally {
      setLoading(false);
    }
  }, [loadSummaryInternal]);

  const loadRecentAnalyses = useCallback(
    async (limit = 10) => {
      setLoading(true);
      setError(null);
      try {
        await loadRecentAnalysesInternal(limit);
      } finally {
        setLoading(false);
      }
    },
    [loadRecentAnalysesInternal]
  );

  const loadThreadAnalyses = useCallback(
    async (threadId: string, limit = 20) => {
      setLoading(true);
      setError(null);

      try {
        const threadAnalyses = await DocumentAnalysisAPI.getThreadDocumentAnalyses(threadId, limit);
        setAnalyses(threadAnalyses || []);
      } catch (err) {
        handleError(err, 'Failed to load thread document analyses');
        setAnalyses([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getAnalysis = useCallback(
    async (id: string): Promise<StoredDocumentAnalysis | null> => {
      try {
        return await DocumentAnalysisAPI.getDocumentAnalysis(id);
      } catch (err) {
        handleError(err, 'Failed to get document analysis');
        return null;
      }
    },
    [handleError]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([loadSummaryInternal(), loadRecentAnalysesInternal()]);
    } catch (err) {
      // Errors are already handled by individual functions
      console.error('Error in refresh:', err);
    } finally {
      setLoading(false);
    }
  }, [loadSummaryInternal, loadRecentAnalysesInternal]);

  // Load initial data
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    analyses,
    summary,
    loading,
    error,
    searchAnalyses,
    loadSummary,
    loadRecentAnalyses,
    loadThreadAnalyses,
    getAnalysis,
    refresh
  };
}
