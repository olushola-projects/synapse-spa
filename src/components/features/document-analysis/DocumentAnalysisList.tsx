import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';
import {
  FileText,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import type { StoredDocumentAnalysis } from '@/types/document-analysis';
import { formatDistanceToNow } from 'date-fns';

// Constants
const MAX_POINT_LENGTH = 40;
const BYTES_TO_KB = 1024;
const PREVIEW_KEY_POINTS_COUNT = 2;

interface DocumentAnalysisItemProps {
  analysis: StoredDocumentAnalysis;
}

const DocumentAnalysisItem: React.FC<DocumentAnalysisItemProps> = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  const getDocumentTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      pdf: 'bg-red-100 text-red-800',
      doc: 'bg-blue-100 text-blue-800',
      docx: 'bg-blue-100 text-blue-800',
      txt: 'bg-gray-100 text-gray-800',
      default: 'bg-purple-100 text-purple-800'
    };
    return colorMap[type.toLowerCase()] || colorMap.default;
  };

  return (
    <Card className='mb-4 hover:shadow-md transition-shadow duration-200'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start space-x-3'>
            <FileText className='w-5 h-5 text-blue-600 mt-0.5' />
            <div className='flex-1'>
              <CardTitle className='text-sm font-medium text-gray-900 mb-1'>
                {analysis.documentName || 'Unknown Document'}
              </CardTitle>
              <div className='flex items-center space-x-2 text-xs text-gray-500'>
                <Badge
                  variant='secondary'
                  className={getDocumentTypeColor(analysis.documentType || 'unknown')}
                >
                  {(analysis.documentType || 'unknown').toUpperCase()}
                </Badge>
                {analysis.expertType && (
                  <Badge variant='outline' className='text-xs'>
                    {analysis.expertType}
                  </Badge>
                )}
                <span className='flex items-center'>
                  <Calendar className='w-3 h-3 mr-1' />
                  {formatDate(analysis.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsExpanded(!isExpanded)}
            className='ml-2'
          >
            {isExpanded ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        {/* Summary */}
        <div className='mb-3'>
          <p className='text-sm text-gray-700 line-clamp-2'>
            {analysis.summary || 'No summary available'}
          </p>
        </div>

        {/* Key Points Preview */}
        {analysis.keyPoints &&
          Array.isArray(analysis.keyPoints) &&
          analysis.keyPoints.length > 0 && (
            <div className='mb-3'>
              <div className='flex items-center space-x-1 mb-2'>
                <MessageSquare className='w-4 h-4 text-orange-600' />
                <span className='text-xs font-medium text-gray-600'>Key Points</span>
              </div>
              <div className='flex flex-wrap gap-1'>
                {analysis.keyPoints
                  .slice(0, isExpanded ? undefined : PREVIEW_KEY_POINTS_COUNT)
                  .map((point, index) => (
                    <Badge
                      key={`${analysis.id}-${index}-${point?.substring(0, 10) || 'point'}`}
                      variant='outline'
                      className='text-xs bg-orange-50 text-orange-700 border-orange-200'
                    >
                      {point && point.length > MAX_POINT_LENGTH
                        ? `${point.substring(0, MAX_POINT_LENGTH)}...`
                        : point || 'Key point'}
                    </Badge>
                  ))}
                {!isExpanded && analysis.keyPoints.length > PREVIEW_KEY_POINTS_COUNT && (
                  <Badge variant='outline' className='text-xs'>
                    +{analysis.keyPoints.length - PREVIEW_KEY_POINTS_COUNT} more
                  </Badge>
                )}
              </div>
            </div>
          )}

        {/* Document Metadata */}
        <div className='flex items-center space-x-4 text-xs text-gray-500 mb-3'>
          <span>{analysis.metadata?.wordCount || 0} words</span>
          {analysis.metadata?.pageCount && <span>{analysis.metadata.pageCount} pages</span>}
          {analysis.metadata?.fileSize && (
            <span>{Math.round(analysis.metadata.fileSize / BYTES_TO_KB)} KB</span>
          )}
        </div>

        {/* Expanded AI Response */}
        {isExpanded && (
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <div className='flex items-center space-x-1 mb-2'>
              <MessageSquare className='w-4 h-4 text-green-600' />
              <span className='text-xs font-medium text-gray-600'>AI Analysis</span>
            </div>
            <ScrollArea className='h-32 w-full'>
              <div className='text-sm text-gray-700 whitespace-pre-wrap'>
                {analysis.aiResponse || 'No AI response available'}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DocumentAnalysisListProps {
  className?: string;
}

export const DocumentAnalysisList: React.FC<DocumentAnalysisListProps> = ({ className = '' }) => {
  const { analyses, summary, loading, error, refresh } = useDocumentAnalysis();

  // Ensure analyses is always an array to prevent undefined errors
  const safeAnalyses = analyses || [];

  if (loading && !safeAnalyses.length) {
    return (
      <div className={`space-y-4 ${className}`}>
        <EnhancedSkeleton className='h-8 w-48' />
        <EnhancedSkeleton className='h-32 w-full' />
        <EnhancedSkeleton className='h-32 w-full' />
        <EnhancedSkeleton className='h-32 w-full' />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card className='border-red-200 bg-red-50'>
          <CardContent className='pt-6'>
            <div className='flex items-center space-x-2 text-red-700'>
              <AlertCircle className='w-5 h-5' />
              <span className='font-medium'>Error loading document analyses</span>
            </div>
            <p className='text-sm text-red-600 mt-1'>{error}</p>
            <Button
              variant='outline'
              size='sm'
              onClick={refresh}
              className='mt-3 text-red-700 border-red-300 hover:bg-red-100'
            >
              <RefreshCw className='w-4 h-4 mr-1' />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!safeAnalyses.length) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card className='border-gray-200'>
          <CardContent className='pt-6 text-center'>
            <FileText className='w-12 h-12 text-gray-400 mx-auto mb-3' />
            <h3 className='font-medium text-gray-900 mb-1'>No Document Analyses Yet</h3>
            <p className='text-sm text-gray-500'>
              Upload and analyze documents in chat to see your analysis history here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary Stats */}
      {summary && (
        <Card className='bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg font-semibold text-gray-900'>
              Document Analysis Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>{summary.totalDocuments}</div>
                <div className='text-sm text-gray-600'>Total Documents</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {Object.keys(summary.documentTypes).length}
                </div>
                <div className='text-sm text-gray-600'>Document Types</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {summary.recentDocuments.length}
                </div>
                <div className='text-sm text-gray-600'>Recent Analyses</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Analyses List */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900'>Recent Document Analyses</h3>
          <Button
            variant='outline'
            size='sm'
            onClick={refresh}
            disabled={loading}
            className='flex items-center space-x-1'
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>

        <ScrollArea className='h-96'>
          <div className='space-y-4 pr-4'>
            {safeAnalyses.map(analysis => (
              <DocumentAnalysisItem key={analysis.id} analysis={analysis} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
