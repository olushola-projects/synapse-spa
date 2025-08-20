import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { apiHealthMonitor } from '@/services/apiHealthMonitor';
export const BackendHealthDashboard = ({ onAuthIssue }) => {
  const [systemHealth, setSystemHealth] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    // Listen for health updates
    const handleHealthUpdate = health => {
      setSystemHealth(health);
      // Notify parent of auth issues
      if (onAuthIssue) {
        const hasAuthIssues = health.services.some(
          service => service.error?.includes('Authentication') || service.error?.includes('401')
        );
        if (hasAuthIssues) {
          onAuthIssue();
        }
      }
    };
    apiHealthMonitor.addListener(handleHealthUpdate);
    // Get initial health status
    const initialHealth = apiHealthMonitor.getSystemHealth();
    setSystemHealth(initialHealth);
    return () => {
      // Note: In a real implementation, you'd want to remove the listener
      // apiHealthMonitor.removeListener(handleHealthUpdate);
    };
  }, [onAuthIssue]);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Trigger a manual health check by restarting monitoring
      apiHealthMonitor.startMonitoring();
    } finally {
      setIsRefreshing(false);
    }
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'healthy':
        return _jsx(CheckCircle, { className: 'w-4 h-4 text-green-600' });
      case 'degraded':
        return _jsx(AlertTriangle, { className: 'w-4 h-4 text-yellow-600' });
      case 'down':
        return _jsx(XCircle, { className: 'w-4 h-4 text-red-600' });
      default:
        return _jsx(Clock, { className: 'w-4 h-4 text-gray-400' });
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  if (!systemHealth) {
    return _jsxs(Card, {
      children: [
        _jsx(CardHeader, {
          children: _jsxs(CardTitle, {
            className: 'flex items-center gap-2',
            children: [_jsx(Activity, { className: 'w-5 h-5' }), 'Backend Health']
          })
        }),
        _jsx(CardContent, {
          children: _jsxs('div', {
            className: 'flex items-center justify-center py-8',
            children: [
              _jsx(RefreshCw, { className: 'w-6 h-6 animate-spin text-muted-foreground' }),
              _jsx('span', {
                className: 'ml-2 text-muted-foreground',
                children: 'Checking system health...'
              })
            ]
          })
        })
      ]
    });
  }
  const overallHealthScore = Math.round(
    (systemHealth.services.filter(s => s.status === 'healthy').length /
      systemHealth.services.length) *
      100
  );
  return _jsxs(Card, {
    children: [
      _jsx(CardHeader, {
        children: _jsxs('div', {
          className: 'flex items-center justify-between',
          children: [
            _jsxs(CardTitle, {
              className: 'flex items-center gap-2',
              children: [_jsx(Activity, { className: 'w-5 h-5' }), 'Backend Health Monitor']
            }),
            _jsxs('div', {
              className: 'flex items-center gap-2',
              children: [
                _jsxs(Button, {
                  variant: 'outline',
                  size: 'sm',
                  onClick: () => setShowDetails(!showDetails),
                  children: [
                    showDetails
                      ? _jsx(EyeOff, { className: 'w-4 h-4' })
                      : _jsx(Eye, { className: 'w-4 h-4' }),
                    showDetails ? 'Hide' : 'Show',
                    ' Details'
                  ]
                }),
                _jsxs(Button, {
                  variant: 'outline',
                  size: 'sm',
                  onClick: handleRefresh,
                  disabled: isRefreshing,
                  children: [
                    _jsx(RefreshCw, { className: `w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}` }),
                    'Refresh'
                  ]
                })
              ]
            })
          ]
        })
      }),
      _jsxs(CardContent, {
        className: 'space-y-4',
        children: [
          _jsxs('div', {
            className: 'space-y-2',
            children: [
              _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  _jsx('span', {
                    className: 'text-sm font-medium',
                    children: 'Overall Health Score'
                  }),
                  _jsxs('span', {
                    className: 'text-sm text-muted-foreground',
                    children: [overallHealthScore, '%']
                  })
                ]
              }),
              _jsx(Progress, { value: overallHealthScore, className: 'h-2' })
            ]
          }),
          _jsxs('div', {
            className: 'flex items-center gap-2',
            children: [
              systemHealth.overall === 'healthy'
                ? _jsx(Wifi, { className: 'w-4 h-4 text-green-600' })
                : _jsx(WifiOff, { className: 'w-4 h-4 text-red-600' }),
              _jsx(Badge, {
                variant: 'outline',
                className: getStatusColor(systemHealth.overall),
                children: systemHealth.overall.toUpperCase()
              })
            ]
          }),
          _jsx('div', {
            className: 'grid gap-3',
            children: systemHealth.services.map(service =>
              _jsxs(
                'div',
                {
                  className: 'border rounded-lg p-3 space-y-2',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            getStatusIcon(service.status),
                            _jsx('span', { className: 'font-medium', children: service.service })
                          ]
                        }),
                        _jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            service.responseTime &&
                              _jsxs('span', {
                                className: 'text-xs text-muted-foreground',
                                children: [service.responseTime, 'ms']
                              }),
                            _jsx(Badge, {
                              variant: 'outline',
                              className: `text-xs ${getStatusColor(service.status)}`,
                              children: service.status
                            })
                          ]
                        })
                      ]
                    }),
                    showDetails &&
                      _jsxs('div', {
                        className: 'space-y-2 pt-2 border-t',
                        children: [
                          service.error &&
                            _jsxs('div', {
                              className: 'space-y-1',
                              children: [
                                _jsx('span', {
                                  className: 'text-xs font-medium text-red-600',
                                  children: 'Error:'
                                }),
                                _jsxs(Alert, {
                                  variant: 'destructive',
                                  className: 'py-2',
                                  children: [
                                    _jsx(AlertTriangle, { className: 'w-4 h-4' }),
                                    _jsx(AlertDescription, {
                                      className: 'text-xs',
                                      children: service.error
                                    })
                                  ]
                                })
                              ]
                            }),
                          service.lastChecked &&
                            _jsxs('div', {
                              className: 'text-xs text-muted-foreground',
                              children: ['Last checked: ', service.lastChecked.toLocaleTimeString()]
                            })
                        ]
                      })
                  ]
                },
                service.service
              )
            )
          }),
          systemHealth.recommendations.length > 0 &&
            _jsxs('div', {
              className: 'space-y-2',
              children: [
                _jsx('span', { className: 'text-sm font-medium', children: 'Recommendations:' }),
                _jsx('div', {
                  className: 'space-y-1',
                  children: systemHealth.recommendations.map((recommendation, index) =>
                    _jsxs(
                      Alert,
                      {
                        className: 'py-2',
                        children: [
                          _jsx(AlertTriangle, { className: 'w-4 h-4' }),
                          _jsx(AlertDescription, { className: 'text-xs', children: recommendation })
                        ]
                      },
                      index
                    )
                  )
                })
              ]
            }),
          systemHealth.services.some(
            service => service.error?.includes('Authentication') || service.error?.includes('401')
          ) &&
            _jsxs(Alert, {
              variant: 'destructive',
              children: [
                _jsx(AlertTriangle, { className: 'w-4 h-4' }),
                _jsxs(AlertDescription, {
                  children: [
                    _jsx('strong', { children: 'Authentication Issue Detected:' }),
                    ' API key may be missing or invalid. Please configure proper authentication credentials.'
                  ]
                })
              ]
            })
        ]
      })
    ]
  });
};
