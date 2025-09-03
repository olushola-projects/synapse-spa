import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';
import {
  FileText,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  List,
  Eye,
  EyeOff,
  ExternalLink
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

const AIAnalysisDialog: React.FC<{ analysis: StoredDocumentAnalysis }> = ({ analysis }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='flex items-center space-x-1'>
          <MessageSquare className='w-4 h-4' />
          <span>View AI Analysis</span>
          <ExternalLink className='w-3 h-3' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[80vh] overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <MessageSquare className='w-5 h-5 text-green-600' />
            <span>AI Analysis - {analysis.documentName}</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='max-h-[60vh] pr-4'>
          <div className='prose prose-sm max-w-none'>
            {analysis.aiResponse ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Custom styling for better readability
                  h1: ({ children }) => (
                    <h1 className='text-xl font-bold text-gray-900 mb-4 mt-6 first:mt-0'>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className='text-lg font-semibold text-gray-800 mb-3 mt-5'>{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className='text-base font-medium text-gray-700 mb-2 mt-4'>{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className='text-sm text-gray-700 mb-3 leading-relaxed'>{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className='list-disc list-inside text-sm text-gray-700 mb-3 space-y-1 ml-4'>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className='list-decimal list-inside text-sm text-gray-700 mb-3 space-y-1 ml-4'>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className='text-sm text-gray-700 leading-relaxed'>{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className='font-semibold text-gray-900'>{children}</strong>
                  ),
                  em: ({ children }) => <em className='italic text-gray-700'>{children}</em>,
                  code: ({ children }) => (
                    <code className='bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-mono'>
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className='bg-gray-100 p-4 rounded-lg text-xs font-mono overflow-x-auto mb-4'>
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className='border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4 bg-blue-50 py-2'>
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className='text-blue-600 hover:text-blue-800 underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {children}
                    </a>
                  ),
                  // Handle HTML divs (like confidence boxes)
                  div: ({ children, ...props }) => {
                    // Check if this div has background styling (confidence boxes, etc.)
                    const style = props.style as React.CSSProperties | undefined;
                    const hasBackgroundColor = style?.backgroundColor || 
                      (typeof props.style === 'string' && props.style.includes('background-color'));
                    
                    if (hasBackgroundColor) {
                      return (
                        <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4'>
                          <div className='font-semibold text-orange-800'>{children}</div>
                        </div>
                      );
                    }
                    return <div {...props}>{children}</div>;
                  }
                }}
              >
                {analysis.aiResponse}
              </ReactMarkdown>
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <MessageSquare className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                <p>No AI analysis available for this document.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const DocumentAnalysisItem: React.FC<DocumentAnalysisItemProps> = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllKeyPoints, setShowAllKeyPoints] = useState(false);

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

        {/* Key Points Section */}
        {analysis.keyPoints &&
          Array.isArray(analysis.keyPoints) &&
          analysis.keyPoints.length > 0 && (
            <div className='mb-3'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center space-x-1'>
                  <List className='w-4 h-4 text-orange-600' />
                  <span className='text-xs font-medium text-gray-600'>
                    Key Points ({analysis.keyPoints.length})
                  </span>
                </div>
                {analysis.keyPoints.length > PREVIEW_KEY_POINTS_COUNT && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowAllKeyPoints(!showAllKeyPoints)}
                    className='text-xs h-6 px-2'
                  >
                    {showAllKeyPoints ? (
                      <>
                        <EyeOff className='w-3 h-3 mr-1' />
                        Show Less
                      </>
                    ) : (
                      <>
                        <Eye className='w-3 h-3 mr-1' />
                        Show All
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Key Points Display */}
              {showAllKeyPoints || analysis.keyPoints.length <= PREVIEW_KEY_POINTS_COUNT ? (
                <div className='space-y-2'>
                  {analysis.keyPoints.map((point, index) => (
                    <div
                      key={`${analysis.id}-${index}-${point?.substring(0, 10) || 'point'}`}
                      className='flex items-start space-x-2 text-sm'
                    >
                      <span className='flex-shrink-0 w-5 h-5 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-medium mt-0.5'>
                        {index + 1}
                      </span>
                      <span className='text-gray-700 leading-relaxed'>{point || 'Key point'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-wrap gap-1'>
                  {analysis.keyPoints.slice(0, PREVIEW_KEY_POINTS_COUNT).map((point, index) => (
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
                  <Badge variant='outline' className='text-xs text-orange-600'>
                    +{analysis.keyPoints.length - PREVIEW_KEY_POINTS_COUNT} more
                  </Badge>
                </div>
              )}
            </div>
          )}

        {/* Document Metadata */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-4 text-xs text-gray-500'>
            <span>{analysis.metadata?.wordCount || 0} words</span>
            {analysis.metadata?.pageCount && <span>{analysis.metadata.pageCount} pages</span>}
            {analysis.metadata?.fileSize && (
              <span>{Math.round(analysis.metadata.fileSize / BYTES_TO_KB)} KB</span>
            )}
          </div>
          <AIAnalysisDialog analysis={analysis} />
        </div>
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

  if (loading) {
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
    const isAuthError = error.includes('Authentication required');
    return (
      <div className={`space-y-4 ${className}`}>
        <Card
          className={isAuthError ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}
        >
          <CardContent className='pt-6'>
            <div
              className={`flex items-center space-x-2 ${isAuthError ? 'text-yellow-700' : 'text-red-700'}`}
            >
              <AlertCircle className='w-5 h-5' />
              <span className='font-medium'>
                {isAuthError ? 'Authentication Required' : 'Error loading document analyses'}
              </span>
            </div>
            <p className={`text-sm mt-1 ${isAuthError ? 'text-yellow-600' : 'text-red-600'}`}>
              {isAuthError ? 'Please log in to view your document analysis history.' : error}
            </p>
            {!isAuthError && (
              <Button
                variant='outline'
                size='sm'
                onClick={refresh}
                className='mt-3 text-red-700 border-red-300 hover:bg-red-100'
              >
                <RefreshCw className='w-4 h-4 mr-1' />
                Try Again
              </Button>
            )}
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

        <ScrollArea className='min-h-full'>
          <div className='space-y-4'>
            {safeAnalyses.map(analysis => (
              <DocumentAnalysisItem key={analysis.id} analysis={analysis} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
