
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, FileX } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type WidgetState = 'idle' | 'loading' | 'empty' | 'error';

interface WidgetStateProps {
  state: WidgetState;
  widgetName: string;
  onRetry?: () => void;
  children?: React.ReactNode;
  emptyMessage?: string;
  emptyIllustration?: React.ReactNode;
}

export const WidgetStateWrapper: React.FC<WidgetStateProps> = ({
  state,
  widgetName,
  onRetry,
  children,
  emptyMessage,
  emptyIllustration
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (state === 'loading') {
    return <LoadingState widgetName={widgetName} prefersReducedMotion={prefersReducedMotion} />;
  }

  if (state === 'empty') {
    return (
      <EmptyState 
        widgetName={widgetName} 
        message={emptyMessage}
        illustration={emptyIllustration}
        onRetry={onRetry}
      />
    );
  }

  if (state === 'error') {
    return <ErrorState widgetName={widgetName} onRetry={onRetry} />;
  }

  return <>{children}</>;
};

const LoadingState: React.FC<{ widgetName: string; prefersReducedMotion: boolean }> = ({ 
  widgetName, 
  prefersReducedMotion 
}) => (
  <div className="space-y-3" role="status" aria-live="polite">
    <div className="sr-only">Loading {widgetName}...</div>
    <div className="space-y-2">
      <Skeleton 
        className={`h-4 w-3/4 ${!prefersReducedMotion ? 'animate-pulse' : ''}`} 
        style={{ animationDuration: prefersReducedMotion ? '0s' : '1.2s' }}
      />
      <Skeleton 
        className={`h-4 w-1/2 ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
        style={{ animationDuration: prefersReducedMotion ? '0s' : '1.2s', animationDelay: '0.2s' }}
      />
      <Skeleton 
        className={`h-8 w-full ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
        style={{ animationDuration: prefersReducedMotion ? '0s' : '1.2s', animationDelay: '0.4s' }}
      />
    </div>
  </div>
);

const EmptyState: React.FC<{
  widgetName: string;
  message?: string;
  illustration?: React.ReactNode;
  onRetry?: () => void;
}> = ({ widgetName, message, illustration, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
    {illustration || <FileX className="w-12 h-12 text-gray-300" />}
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-900">No items found</h3>
      <p className="text-xs text-gray-500">
        {message || `Your ${widgetName.toLowerCase()} will appear here when available`}
      </p>
    </div>
    {onRetry && (
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        aria-label={`Refresh ${widgetName}`}
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        Refresh
      </Button>
    )}
  </div>
);

const ErrorState: React.FC<{
  widgetName: string;
  onRetry?: () => void;
}> = ({ widgetName, onRetry }) => (
  <div 
    className="flex flex-col items-center justify-center py-8 text-center space-y-4"
    role="alert"
    aria-live="polite"
  >
    <AlertCircle className="w-12 h-12" style={{ color: '#B00020' }} />
    <div className="space-y-2">
      <h3 className="text-sm font-medium" style={{ color: '#B00020' }}>
        Unable to load {widgetName}
      </h3>
      <p className="text-xs text-gray-500">
        Something went wrong while loading your data
      </p>
    </div>
    {onRetry && (
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="border-red-200 text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        aria-label={`Retry loading ${widgetName}`}
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        Retry
      </Button>
    )}
  </div>
);

export { LoadingState, EmptyState, ErrorState };
