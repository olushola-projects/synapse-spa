import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Loader2, Brain, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
/**
 * Enhanced Loading Fallback Component for SFDR Navigator
 * Provides progressive loading indicators with system status
 * Follows enterprise UX patterns for regulatory applications
 */
export function LoadingFallback({
  message = 'Loading SFDR Navigator...',
  progress = 0,
  stage = 'Initializing',
  showSystemStatus = true,
  variant = 'default',
  className
}) {
  const stages = [
    { name: 'Initializing', description: 'Setting up secure environment' },
    { name: 'Authentication', description: 'Verifying credentials' },
    { name: 'Loading Data', description: 'Fetching compliance data' },
    { name: 'Finalizing', description: 'Preparing interface' }
  ];
  const currentStageIndex = stages.findIndex(s => s.name === stage);
  const calculatedProgress =
    currentStageIndex >= 0 ? ((currentStageIndex + 1) / stages.length) * 100 : progress;
  if (variant === 'minimal') {
    return _jsx('div', {
      className: cn('flex items-center justify-center p-8', className),
      children: _jsxs('div', {
        className: 'flex items-center space-x-3',
        children: [
          _jsx(Loader2, { className: 'w-6 h-6 animate-spin text-primary' }),
          _jsx('span', { className: 'text-sm text-muted-foreground', children: message })
        ]
      })
    });
  }
  if (variant === 'detailed') {
    return _jsx('div', {
      className: cn(
        'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4',
        className
      ),
      children: _jsxs(Card, {
        className: 'w-full max-w-2xl shadow-lg',
        children: [
          _jsxs(CardHeader, {
            className: 'text-center',
            children: [
              _jsx('div', {
                className:
                  'mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4',
                children: _jsx(Brain, { className: 'w-10 h-10 text-white animate-pulse' })
              }),
              _jsx(CardTitle, { className: 'text-2xl text-gray-900', children: 'SFDR Navigator' }),
              _jsx('p', {
                className: 'text-muted-foreground',
                children: 'Initializing AI-powered regulatory compliance platform'
              })
            ]
          }),
          _jsxs(CardContent, {
            className: 'space-y-6',
            children: [
              _jsxs('div', {
                className: 'space-y-2',
                children: [
                  _jsxs('div', {
                    className: 'flex justify-between items-center',
                    children: [
                      _jsx('span', {
                        className: 'text-sm font-medium text-gray-700',
                        children: stage
                      }),
                      _jsxs('span', {
                        className: 'text-sm text-muted-foreground',
                        children: [Math.round(calculatedProgress), '%']
                      })
                    ]
                  }),
                  _jsx(Progress, { value: calculatedProgress, className: 'h-2' })
                ]
              }),
              _jsx('div', {
                className: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
                children: stages.map((stageItem, index) => {
                  const isActive = stageItem.name === stage;
                  const isCompleted = index < currentStageIndex;
                  return _jsxs(
                    'div',
                    {
                      className: cn(
                        'flex items-center space-x-3 p-3 rounded-lg border transition-all',
                        isActive && 'bg-blue-50 border-blue-200',
                        isCompleted && 'bg-green-50 border-green-200',
                        !isActive && !isCompleted && 'bg-gray-50 border-gray-200'
                      ),
                      children: [
                        _jsxs('div', {
                          className: cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            isActive && 'bg-blue-600',
                            isCompleted && 'bg-green-600',
                            !isActive && !isCompleted && 'bg-gray-300'
                          ),
                          children: [
                            isActive &&
                              _jsx(Loader2, { className: 'w-4 h-4 text-white animate-spin' }),
                            isCompleted && _jsx(Shield, { className: 'w-4 h-4 text-white' }),
                            !isActive &&
                              !isCompleted &&
                              _jsx('span', {
                                className: 'text-xs text-gray-600',
                                children: index + 1
                              })
                          ]
                        }),
                        _jsxs('div', {
                          className: 'flex-1 min-w-0',
                          children: [
                            _jsx('p', {
                              className: cn(
                                'text-sm font-medium',
                                isActive && 'text-blue-900',
                                isCompleted && 'text-green-900',
                                !isActive && !isCompleted && 'text-gray-600'
                              ),
                              children: stageItem.name
                            }),
                            _jsx('p', {
                              className: 'text-xs text-muted-foreground truncate',
                              children: stageItem.description
                            })
                          ]
                        })
                      ]
                    },
                    stageItem.name
                  );
                })
              }),
              showSystemStatus &&
                _jsxs('div', {
                  className: 'bg-gray-50 rounded-lg p-4',
                  children: [
                    _jsx('h4', {
                      className: 'text-sm font-medium text-gray-900 mb-3',
                      children: 'System Status'
                    }),
                    _jsxs('div', {
                      className: 'grid grid-cols-2 gap-4',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsx('span', {
                              className: 'text-xs text-gray-600',
                              children: 'Security'
                            }),
                            _jsx(Badge, {
                              variant: 'secondary',
                              className: 'bg-green-100 text-green-800',
                              children: 'Secure'
                            })
                          ]
                        }),
                        _jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsx('span', {
                              className: 'text-xs text-gray-600',
                              children: 'Compliance'
                            }),
                            _jsx(Badge, {
                              variant: 'secondary',
                              className: 'bg-blue-100 text-blue-800',
                              children: 'GDPR Ready'
                            })
                          ]
                        }),
                        _jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsx('span', {
                              className: 'text-xs text-gray-600',
                              children: 'Connection'
                            }),
                            _jsx(Badge, {
                              variant: 'secondary',
                              className: 'bg-green-100 text-green-800',
                              children: 'Encrypted'
                            })
                          ]
                        }),
                        _jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsx('span', {
                              className: 'text-xs text-gray-600',
                              children: 'Region'
                            }),
                            _jsx(Badge, {
                              variant: 'secondary',
                              className: 'bg-gray-100 text-gray-800',
                              children: 'EU-West'
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),
              _jsxs('div', {
                className: 'text-center',
                children: [
                  _jsx('p', { className: 'text-sm text-muted-foreground', children: message }),
                  _jsx('p', {
                    className: 'text-xs text-gray-500 mt-1',
                    children:
                      'This may take a few moments while we ensure secure access to your compliance data.'
                  })
                ]
              })
            ]
          })
        ]
      })
    });
  }
  // Default variant
  return _jsx('div', {
    className: cn('flex items-center justify-center min-h-[400px] p-8', className),
    children: _jsx(Card, {
      className: 'w-full max-w-md',
      children: _jsx(CardContent, {
        className: 'pt-6',
        children: _jsxs('div', {
          className: 'text-center space-y-4',
          children: [
            _jsx('div', {
              className:
                'mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center',
              children: _jsx(Loader2, { className: 'w-8 h-8 text-white animate-spin' })
            }),
            _jsxs('div', {
              className: 'space-y-2',
              children: [
                _jsx('h3', { className: 'text-lg font-semibold text-gray-900', children: stage }),
                _jsx('p', { className: 'text-sm text-muted-foreground', children: message })
              ]
            }),
            progress > 0 &&
              _jsxs('div', {
                className: 'space-y-2',
                children: [
                  _jsx(Progress, { value: calculatedProgress, className: 'h-2' }),
                  _jsxs('p', {
                    className: 'text-xs text-muted-foreground',
                    children: [Math.round(calculatedProgress), '% complete']
                  })
                ]
              }),
            showSystemStatus &&
              _jsxs('div', {
                className:
                  'flex items-center justify-center space-x-2 text-xs text-muted-foreground',
                children: [
                  _jsx(Shield, { className: 'w-3 h-3' }),
                  _jsx('span', { children: 'Secure Connection' })
                ]
              })
          ]
        })
      })
    })
  });
}
/**
 * Page-level loading component for full-page loading states
 */
export function PageLoadingFallback({ subtitle = 'Loading compliance interface...' }) {
  return _jsx(LoadingFallback, {
    variant: 'detailed',
    message: subtitle,
    stage: 'Loading Data',
    showSystemStatus: true,
    className: 'min-h-screen'
  });
}
/**
 * Component-level loading for smaller sections
 */
export function ComponentLoadingFallback({ message = 'Loading...', size = 'default' }) {
  const sizeClasses = {
    small: 'min-h-[200px]',
    default: 'min-h-[300px]',
    large: 'min-h-[400px]'
  };
  return _jsx(LoadingFallback, {
    variant: 'minimal',
    message: message,
    className: sizeClasses[size]
  });
}
export default LoadingFallback;
