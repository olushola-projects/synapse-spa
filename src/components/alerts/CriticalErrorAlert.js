import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
/**
 * Critical Error Alert Component
 * Displays prominent alerts for system-critical issues that require immediate attention
 */
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, RefreshCw, Settings } from 'lucide-react';
import React from 'react';
export function CriticalErrorAlert({ errors, onRetry, onDismiss, onConfigureApi, className = '' }) {
  if (errors.length === 0) {
    return null;
  }
  const criticalErrors = errors.filter(e => e.severity === 'critical');
  const highErrors = errors.filter(e => e.severity === 'high');
  const getErrorIcon = type => {
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
  const getErrorColor = severity => {
    return severity === 'critical' ? 'destructive' : 'default';
  };
  return _jsxs('div', {
    className: `space-y-4 ${className}`,
    children: [
      criticalErrors.map(error =>
        _jsx(
          motion.div,
          {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            className: 'relative',
            children: _jsxs(Alert, {
              variant: getErrorColor(error.severity),
              className: 'border-l-4 border-l-red-500',
              children: [
                _jsx(AlertTriangle, { className: 'h-4 w-4' }),
                _jsxs(AlertTitle, {
                  className: 'flex items-center gap-2',
                  children: [
                    _jsx('span', { children: getErrorIcon(error.type) }),
                    'CRITICAL: ',
                    error.title
                  ]
                }),
                _jsxs(AlertDescription, {
                  className: 'mt-2 space-y-3',
                  children: [
                    _jsx('p', { children: error.message }),
                    error.details &&
                      _jsxs('details', {
                        className: 'text-sm opacity-75',
                        children: [
                          _jsx('summary', {
                            className: 'cursor-pointer hover:opacity-100',
                            children: 'Technical Details'
                          }),
                          _jsx('p', {
                            className: 'mt-2 font-mono text-xs bg-muted p-2 rounded',
                            children: error.details
                          })
                        ]
                      }),
                    error.recommendedActions &&
                      error.recommendedActions.length > 0 &&
                      _jsxs('div', {
                        className: 'space-y-2',
                        children: [
                          _jsx('p', {
                            className: 'font-medium text-sm',
                            children: 'Recommended Actions:'
                          }),
                          _jsx('ul', {
                            className: 'text-sm space-y-1',
                            children: error.recommendedActions.map((action, index) =>
                              _jsxs(
                                'li',
                                {
                                  className: 'flex items-start gap-2',
                                  children: [
                                    _jsx('span', { className: 'text-xs mt-1', children: '\u2022' }),
                                    _jsx('span', { children: action })
                                  ]
                                },
                                index
                              )
                            )
                          })
                        ]
                      }),
                    _jsxs('div', {
                      className: 'flex gap-2 pt-2',
                      children: [
                        error.type === 'authentication' &&
                          onConfigureApi &&
                          _jsxs(Button, {
                            variant: 'outline',
                            size: 'sm',
                            onClick: onConfigureApi,
                            className: 'gap-2',
                            children: [
                              _jsx(Settings, { className: 'h-3 w-3' }),
                              'Configure API Key'
                            ]
                          }),
                        onRetry &&
                          _jsxs(Button, {
                            variant: 'outline',
                            size: 'sm',
                            onClick: onRetry,
                            className: 'gap-2',
                            children: [_jsx(RefreshCw, { className: 'h-3 w-3' }), 'Retry']
                          }),
                        _jsxs(Button, {
                          variant: 'outline',
                          size: 'sm',
                          onClick: () =>
                            window.open(
                              'https://docs.lovable.dev/tips-tricks/troubleshooting',
                              '_blank'
                            ),
                          className: 'gap-2',
                          children: [_jsx(ExternalLink, { className: 'h-3 w-3' }), 'Help']
                        }),
                        onDismiss &&
                          _jsx(Button, {
                            variant: 'ghost',
                            size: 'sm',
                            onClick: () => onDismiss(error.id),
                            className: 'ml-auto',
                            children: 'Dismiss'
                          })
                      ]
                    })
                  ]
                })
              ]
            })
          },
          error.id
        )
      ),
      highErrors.length > 0 &&
        _jsx(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: 'space-y-2',
          children: _jsxs('details', {
            className: 'group',
            children: [
              _jsxs('summary', {
                className:
                  'cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground',
                children: [
                  highErrors.length,
                  ' Additional Warning',
                  highErrors.length > 1 ? 's' : '',
                  ' \u25BC'
                ]
              }),
              _jsx('div', {
                className: 'mt-2 space-y-2',
                children: highErrors.map(error =>
                  _jsxs(
                    Alert,
                    {
                      variant: 'default',
                      className: 'border-l-4 border-l-yellow-500',
                      children: [
                        _jsx(AlertTriangle, { className: 'h-4 w-4' }),
                        _jsxs(AlertTitle, {
                          className: 'flex items-center gap-2',
                          children: [
                            _jsx('span', { children: getErrorIcon(error.type) }),
                            error.title
                          ]
                        }),
                        _jsxs(AlertDescription, {
                          children: [
                            _jsx('p', { children: error.message }),
                            onDismiss &&
                              _jsx(Button, {
                                variant: 'ghost',
                                size: 'sm',
                                onClick: () => onDismiss(error.id),
                                className: 'mt-2',
                                children: 'Dismiss'
                              })
                          ]
                        })
                      ]
                    },
                    error.id
                  )
                )
              })
            ]
          })
        })
    ]
  });
}
/**
 * Hook to manage critical errors
 */
export function useCriticalErrors() {
  const [errors, setErrors] = React.useState([]);
  const addError = React.useCallback(error => {
    const newError = {
      ...error,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setErrors(prev => [...prev, newError]);
  }, []);
  const removeError = React.useCallback(errorId => {
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
