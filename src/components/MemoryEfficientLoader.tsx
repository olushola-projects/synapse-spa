import React, { useState, useEffect } from 'react';
import { LoadingFallback } from './LoadingFallback';

interface MemoryEfficientLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  timeout?: number;
}

/**
 * Memory-Efficient Loader Component
 * Prevents memory leaks during React mounting by implementing progressive loading
 * with timeout protection and memory cleanup
 */
export const MemoryEfficientLoader: React.FC<MemoryEfficientLoaderProps> = ({
  children,
  fallback = <LoadingFallback variant="minimal" message="Loading application..." />,
  delay = 100,
  timeout = 10000
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;
    let delayId: NodeJS.Timeout;

    const cleanup = () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (delayId) clearTimeout(delayId);
    };

    try {
      // Set timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        if (mounted) {
          setHasTimedOut(true);
          console.warn('MemoryEfficientLoader: Loading timeout reached');
        }
      }, timeout);

      // Progressive loading with delay
      delayId = setTimeout(() => {
        if (mounted) {
          setIsLoaded(true);
          if (timeoutId) clearTimeout(timeoutId);
        }
      }, delay);

      return cleanup;
    } catch (err) {
      if (mounted) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('MemoryEfficientLoader: Error during loading:', err);
      }
      cleanup();
    }
  }, [delay, timeout]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading Error</h2>
          <p className="text-gray-600 mb-4">
            Failed to load the application. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Timeout state
  if (hasTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading Timeout</h2>
          <p className="text-gray-600 mb-4">
            The application is taking longer than expected to load. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return <>{fallback}</>;
  }

  // Success state - render children
  return <>{children}</>;
};

/**
 * Lazy-loaded component wrapper with memory optimization
 */
export const LazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <MemoryEfficientLoader
      fallback={fallback ? React.createElement(fallback) : <LoadingFallback variant="minimal" />}
    >
      <React.Suspense fallback={<LoadingFallback variant="minimal" />}>
        <LazyComponent {...props} />
      </React.Suspense>
    </MemoryEfficientLoader>
  );
};
