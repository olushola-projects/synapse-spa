/**
 * Critical Error Alert Component
 * Displays prominent alerts for system-critical issues that require immediate attention
 */

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Settings, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export interface CriticalError {
  id: string;
  type: 'authentication' | 'api_connectivity' | 'llm_failure' | 'system_error';
  title: string;
  message: string;
  details?: string;
  severity: 'high' | 'critical';
  timestamp: string;
  actionable: boolean;
  recommendedActions?: string[];
}

interface CriticalErrorAlertProps {
  errors: CriticalError[];
  onRetry?: () => void;
  onDismiss?: (errorId: string) => void;
  onConfigureApi?: () => void;
  className?: string;
}

export function CriticalErrorAlert({
  errors,
  onRetry,
  onDismiss,
  onConfigureApi,
  className = ''
}: CriticalErrorAlertProps) {
  if (errors.length === 0) {
    return null;
  }

  const criticalErrors = errors.filter(e => e.severity === 'critical');
  const highErrors = errors.filter(e => e.severity === 'high');

  const getErrorIcon = (type: CriticalError['type']) => {
    switch (type) {
      case 'authentication':
        return '🔐';
      case 'api_connectivity':
        return '🔌';
      case 'llm_failure':
        return '🤖';
      default:
        return '⚠️';
    }
  };

  const getErrorColor = (severity: string) => {
    return severity === 'critical' ? 'destructive' : 'default';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Critical Errors - Always shown prominently */}
      {criticalErrors.map(error => (
        <motion.div
          key={error.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='relative'
        >
          <Alert variant={getErrorColor(error.severity)} className='border-l-4 border-l-red-500'>
            <AlertTriangle className='h-4 w-4' />
            <AlertTitle className='flex items-center gap-2'>
              <span>{getErrorIcon(error.type)}</span>
              CRITICAL: {error.title}
            </AlertTitle>
            <AlertDescription className='mt-2 space-y-3'>
              <p>{error.message}</p>

              {error.details && (
                <details className='text-sm opacity-75'>
                  <summary className='cursor-pointer hover:opacity-100'>Technical Details</summary>
                  <p className='mt-2 font-mono text-xs bg-muted p-2 rounded'>{error.details}</p>
                </details>
              )}

              {error.recommendedActions && error.recommendedActions.length > 0 && (
                <div className='space-y-2'>
                  <p className='font-medium text-sm'>Recommended Actions:</p>
                  <ul className='text-sm space-y-1'>
                    {error.recommendedActions.map((action, index) => (
                      <li key={index} className='flex items-start gap-2'>
                        <span className='text-xs mt-1'>•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className='flex gap-2 pt-2'>
                {error.type === 'authentication' && onConfigureApi && (
                  <Button variant='outline' size='sm' onClick={onConfigureApi} className='gap-2'>
                    <Settings className='h-3 w-3' />
                    Configure API Key
                  </Button>
                )}

                {onRetry && (
                  <Button variant='outline' size='sm' onClick={onRetry} className='gap-2'>
                    <RefreshCw className='h-3 w-3' />
                    Retry
                  </Button>
                )}

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    window.open('https://docs.lovable.dev/tips-tricks/troubleshooting', '_blank')
                  }
                  className='gap-2'
                >
                  <ExternalLink className='h-3 w-3' />
                  Help
                </Button>

                {onDismiss && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onDismiss(error.id)}
                    className='ml-auto'
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      ))}

      {/* High Priority Errors - Collapsible */}
      {highErrors.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-2'>
          <details className='group'>
            <summary className='cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground'>
              {highErrors.length} Additional Warning{highErrors.length > 1 ? 's' : ''} ▼
            </summary>
            <div className='mt-2 space-y-2'>
              {highErrors.map(error => (
                <Alert key={error.id} variant='default' className='border-l-4 border-l-yellow-500'>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertTitle className='flex items-center gap-2'>
                    <span>{getErrorIcon(error.type)}</span>
                    {error.title}
                  </AlertTitle>
                  <AlertDescription>
                    <p>{error.message}</p>
                    {onDismiss && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onDismiss(error.id)}
                        className='mt-2'
                      >
                        Dismiss
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </details>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Hook to manage critical errors
 */
export function useCriticalErrors() {
  const [errors, setErrors] = React.useState<CriticalError[]>([]);

  const addError = React.useCallback((error: Omit<CriticalError, 'id' | 'timestamp'>) => {
    const newError: CriticalError = {
      ...error,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    setErrors(prev => [...prev, newError]);
  }, []);

  const removeError = React.useCallback((errorId: string) => {
    setErrors(prev => prev.filter(e => e.id !== errorId));
  }, []);

  const clearErrors = React.useCallback(() => {
    setErrors([]);
  }, []);

  const hasErrors = errors.length > 0;
  const hasCriticalErrors = errors.some(e => e.severity === 'critical');

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    hasErrors,
    hasCriticalErrors
  };
}
