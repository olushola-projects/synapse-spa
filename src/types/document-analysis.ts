/**
 * Frontend types for document analysis data
 */

export interface DocumentAnalysisMetadata {
  wordCount: number;
  pageCount?: number;
  language?: string;
  confidence?: number;
  extractedAt: string;
  processingTime?: number;
  fileSize?: number;
}

export interface StoredDocumentAnalysis {
  id: string;
  userId: string;
  threadId: string;
  messageId: string;
  documentId: string;
  documentName: string;
  documentType: string;
  content: string;
  aiResponse: string;
  summary: string;
  keyPoints: string[];
  expertType?: string;
  metadata: DocumentAnalysisMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentAnalysisSearchQuery {
  threadId?: string;
  documentType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface DocumentAnalysisSearchResult {
  analyses: StoredDocumentAnalysis[];
  total: number;
  hasMore: boolean;
}

export interface DocumentAnalysisSummary {
  totalDocuments: number;
  recentDocuments: StoredDocumentAnalysis[];
  documentTypes: { [type: string]: number };
}
