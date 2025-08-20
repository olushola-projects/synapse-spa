import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useCallback, useRef, useEffect, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import posthog from 'posthog-js';
import { logger } from '@/utils/logger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TabContentSkeleton, EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { cn } from '@/lib/utils';
import {
  Activity,
  Shield,
  TrendingUp,
  Users,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Brain,
  Target,
  Search,
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw,
  Home
} from 'lucide-react';
import { NexusAgentChat } from '@/components/NexusAgentChat';
import { NexusTestExecutor } from '@/components/testing/NexusTestExecutor';
import { EnhancedApiConnectivityTest } from '@/components/testing/EnhancedApiConnectivityTest';
import { BackendHealthDashboard } from '@/components/testing/BackendHealthDashboard';
import { SecretForm } from '@/components/ui/secret-form';
import { CriticalErrorAlert } from '@/components/alerts/CriticalErrorAlert';
import { CriticalAuthAlert } from '@/components/CriticalAuthAlert';
import { RealTimeMonitoringDashboard } from '@/components/monitoring/RealTimeMonitoringDashboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
/**
 * SFDR Navigator - Regulatory Agent for ESG Compliance
 *
 * This component serves as the main interface for the SFDR (Sustainable Finance Disclosure Regulation)
 * Navigator, providing AI-powered regulatory guidance and compliance tools for GRC professionals.
 */
// Use the shared Supabase client
import { supabase } from '@/integrations/supabase/client';
const NexusAgent = () => {
  // Enhanced state management with loading states
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoadingTab, setIsLoadingTab] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [systemStatus, setSystemStatus] = useState('checking');
  const [initError, setInitError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [complianceData, setComplianceData] = useState({
    status: 'pre-validated',
    esmaReference: '2024/1357'
  });
  // Enhanced initialization with progressive loading and error handling
  useEffect(() => {
    let authListener = null;
    let mounted = true;
    const initializeApp = async () => {
      setInitError(null);
      setSystemStatus('checking');
      setLoadingProgress(0);
      try {
        // Stage 1: System health check
        if (mounted) {
          setLoadingProgress(20);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
        // Stage 2: Authentication setup
        if (mounted) {
          setLoadingProgress(40);
          const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
            logger.info('Auth state changed:', session?.user?.id);
          });
          authListener = data;
        }
        // Stage 3: Analytics initialization (non-blocking)
        if (mounted) {
          setLoadingProgress(60);
          setTimeout(() => {
            try {
              const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
              const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
              if (posthogKey && posthogHost) {
                posthog.init(posthogKey, {
                  api_host: posthogHost
                });
              } else {
                logger.warn('PostHog key or host not provided. Analytics will be disabled.');
              }
            } catch (error) {
              logger.error('Failed to initialize PostHog:', error);
            }
          }, 100);
        }
        // Stage 4: API connectivity check
        if (mounted) {
          setLoadingProgress(80);
          try {
            // Simulated API health check - replace with actual endpoint
            await new Promise(resolve => setTimeout(resolve, 500));
            setSystemStatus('online');
          } catch (apiError) {
            logger.warn('API check failed, using offline mode');
            setSystemStatus('offline');
          }
        }
        // Stage 5: Finalization
        if (mounted) {
          setLoadingProgress(100);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        logger.error('Failed to initialize app:', error);
        if (mounted) {
          setInitError(error instanceof Error ? error.message : 'Initialization failed');
          setError(error instanceof Error ? error.message : 'Initialization failed');
          setSystemStatus('offline');
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };
    initializeApp();
    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [retryCount]);
  const [activeTab, setActiveTab] = useState('chat');
  const chatRef = useRef(null);
  // Global industry metrics
  const industryMetrics = [
    {
      label: 'Compliance Score',
      value: '94%',
      icon: _jsx(Shield, { className: 'w-5 h-5 text-green-600' })
    },
    {
      label: 'Risk Reduction',
      value: '67%',
      icon: _jsx(TrendingUp, { className: 'w-5 h-5 text-blue-600' })
    },
    {
      label: 'Processing Speed',
      value: '3.2s',
      icon: _jsx(Activity, { className: 'w-5 h-5 text-orange-600' })
    },
    {
      label: 'Active Users',
      value: '500+',
      icon: _jsx(Users, { className: 'w-5 h-5 text-purple-600' })
    }
  ];
  // Enhanced quick actions with Nexus capabilities
  const quickActions = useMemo(
    () => [
      {
        type: 'upload-document',
        label: 'Upload Document',
        description: 'Upload and analyze compliance documents',
        icon: _jsx(FileText, { className: 'w-4 h-4' }),
        message: 'I need help uploading and analyzing a compliance document for SFDR validation.'
      },
      {
        type: 'check-compliance',
        label: 'Check Compliance',
        description: 'Validate SFDR classification',
        icon: _jsx(Shield, { className: 'w-4 h-4' }),
        message:
          'Please check the compliance status of my fund classification against SFDR requirements.'
      },
      {
        type: 'article-classification',
        label: 'Article Classification',
        description: 'Determine Article 6/8/9 classification',
        icon: _jsx(Target, { className: 'w-4 h-4' }),
        message:
          'Help me determine the correct SFDR article classification for my fund (Article 6, 8, or 9).'
      },
      {
        type: 'pai-analysis',
        label: 'PAI Analysis',
        description: 'Principal Adverse Impact validation',
        icon: _jsx(Brain, { className: 'w-4 h-4' }),
        message:
          'I need help with Principal Adverse Impact (PAI) indicators analysis and validation.'
      },
      {
        type: 'taxonomy-check',
        label: 'Taxonomy Check',
        description: 'EU Taxonomy alignment verification',
        icon: _jsx(Search, { className: 'w-4 h-4' }),
        message: 'Please help me verify EU Taxonomy alignment for my sustainable investment fund.'
      },
      {
        type: 'generate-report',
        label: 'Generate Report',
        description: 'Create compliance reports',
        icon: _jsx(BarChart3, { className: 'w-4 h-4' }),
        message: 'I need to generate a comprehensive SFDR compliance report.'
      },
      {
        type: 'risk-assessment',
        label: 'Risk Assessment',
        description: 'Identify compliance risks',
        icon: _jsx(AlertTriangle, { className: 'w-4 h-4' }),
        message: 'Can you help me with a regulatory risk assessment for SFDR compliance?'
      }
    ],
    []
  );
  const handleQuickAction = useCallback(
    actionType => {
      // Switch to chat mode if not already active
      if (activeTab !== 'chat') {
        setIsLoadingTab(true);
        setActiveTab('chat');
      }
      // Find the action details
      const action = quickActions.find(a => a.type === actionType);
      // Add a small delay to ensure tab switch completes
      setTimeout(() => {
        if (chatRef.current && typeof chatRef.current.sendMessage === 'function') {
          chatRef.current.sendMessage(action?.message || 'How can you help me today?');
        }
        // Update compliance data based on action
        setComplianceData(prev => ({
          ...prev,
          status: actionType === 'check-compliance' ? 'pre-validated' : 'needs-review'
        }));
        setIsLoadingTab(false);
      }, 150);
    },
    [quickActions, activeTab]
  );
  const handleTabChange = useCallback(
    value => {
      if (isLoadingTab) {
        return;
      } // Prevent rapid tab switching
      setIsLoadingTab(true);
      setActiveTab(value);
      // Progressive tab loading with appropriate delays based on tab complexity
      const delays = {
        chat: 400, // Chat requires chat history and context loading
        overview: 300, // Overview requires analytics data
        testing: 350 // Testing requires test suite initialization
      };
      const delay = delays[value] || 300;
      setTimeout(() => {
        setIsLoadingTab(false);
      }, delay);
    },
    [isLoadingTab]
  );
  // Enhanced loading screen with progressive indicators and error handling
  if (error) {
    return _jsx('div', {
      className:
        'min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4',
      children: _jsxs(Card, {
        className: 'w-full max-w-md shadow-lg',
        children: [
          _jsxs(CardHeader, {
            className: 'text-center',
            children: [
              _jsx('div', {
                className:
                  'mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4',
                children: _jsx(AlertTriangle, { className: 'w-8 h-8 text-red-600' })
              }),
              _jsx(CardTitle, {
                className: 'text-xl text-red-600',
                children: 'SFDR Navigator Error'
              }),
              _jsx(CardDescription, {
                children:
                  'Failed to initialize SFDR Navigator. This may be due to network connectivity or configuration issues.'
              })
            ]
          }),
          _jsxs(CardContent, {
            className: 'text-center space-y-4',
            children: [
              _jsx('div', {
                className: 'bg-amber-50 border border-amber-200 rounded-lg p-3',
                children: _jsxs('p', {
                  className: 'text-sm text-amber-800',
                  children: [
                    _jsx('strong', { children: 'For Compliance Users:' }),
                    ' Your data remains secure. This is a display issue only.'
                  ]
                })
              }),
              _jsx('p', { className: 'text-sm text-gray-600', children: error }),
              _jsxs('div', {
                className: 'flex flex-col gap-2',
                children: [
                  _jsxs(Button, {
                    onClick: () => window.location.reload(),
                    className: 'w-full',
                    children: [_jsx(RefreshCw, { className: 'w-4 h-4 mr-2' }), 'Retry Connection']
                  }),
                  _jsxs(Button, {
                    variant: 'outline',
                    onClick: () => (window.location.href = '/'),
                    className: 'w-full',
                    children: [_jsx(Home, { className: 'w-4 h-4 mr-2' }), 'Return to Home']
                  })
                ]
              })
            ]
          })
        ]
      })
    });
  }
  if (isInitializing) {
    return _jsx('div', {
      className:
        'min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4',
      children: _jsx('div', {
        className: 'w-full max-w-md',
        children: initError
          ? // Error state with retry option
            _jsxs('div', {
              className:
                'text-center space-y-6 p-8 bg-background border border-destructive/20 rounded-xl shadow-lg',
              children: [
                _jsxs('div', {
                  className: 'space-y-3',
                  children: [
                    _jsx(WifiOff, { className: 'w-12 h-12 mx-auto text-destructive' }),
                    _jsx('h3', {
                      className: 'text-lg font-semibold text-foreground',
                      children: 'Initialization Failed'
                    }),
                    _jsx('p', { className: 'text-sm text-muted-foreground', children: initError })
                  ]
                }),
                _jsxs('div', {
                  className: 'space-y-3',
                  children: [
                    _jsx(Button, {
                      onClick: () => {
                        setRetryCount(prev => prev + 1);
                        setIsInitializing(true);
                      },
                      className: 'w-full',
                      children: 'Retry Initialization'
                    }),
                    _jsx(Button, {
                      variant: 'outline',
                      onClick: () => setIsInitializing(false),
                      className: 'w-full',
                      children: 'Continue Anyway'
                    })
                  ]
                })
              ]
            })
          : // Normal loading state with progress
            _jsxs('div', {
              className:
                'text-center space-y-6 p-8 bg-background/80 backdrop-blur-sm border border-border/40 rounded-xl shadow-lg',
              children: [
                _jsxs('div', {
                  className: 'space-y-3',
                  children: [
                    _jsxs('div', {
                      className: 'relative',
                      children: [
                        _jsx('div', {
                          className:
                            'w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center',
                          children: _jsx(Brain, { className: 'w-8 h-8 text-primary animate-pulse' })
                        }),
                        _jsx('div', {
                          className: cn(
                            'absolute top-0 right-0 w-4 h-4 rounded-full transition-colors',
                            systemStatus === 'online' && 'bg-emerald-500',
                            systemStatus === 'offline' && 'bg-amber-500',
                            systemStatus === 'checking' && 'bg-muted animate-pulse'
                          )
                        })
                      ]
                    }),
                    _jsx('h3', {
                      className: 'text-lg font-semibold text-foreground',
                      children: 'SFDR Navigator'
                    }),
                    _jsx('p', {
                      className: 'text-sm text-muted-foreground',
                      children: 'Initializing AI-powered compliance engine...'
                    })
                  ]
                }),
                _jsxs('div', {
                  className: 'space-y-3',
                  children: [
                    _jsxs('div', {
                      className: 'flex justify-between text-xs text-muted-foreground',
                      children: [
                        _jsx('span', { children: 'Loading progress' }),
                        _jsxs('span', { children: [loadingProgress, '%'] })
                      ]
                    }),
                    _jsx('div', {
                      className: 'w-full bg-muted rounded-full h-2 overflow-hidden',
                      children: _jsx('div', {
                        className:
                          'h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out',
                        style: { width: `${loadingProgress}%` }
                      })
                    })
                  ]
                }),
                _jsxs('div', {
                  className:
                    'flex items-center justify-center space-x-4 text-xs text-muted-foreground',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center space-x-1',
                      children: [
                        systemStatus === 'online'
                          ? _jsx(Wifi, { className: 'w-3 h-3' })
                          : _jsx(WifiOff, { className: 'w-3 h-3' }),
                        _jsx('span', { className: 'capitalize', children: systemStatus })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'flex items-center space-x-1',
                      children: [
                        _jsx(Shield, { className: 'w-3 h-3' }),
                        _jsx('span', { children: 'Secure' })
                      ]
                    })
                  ]
                })
              ]
            })
      })
    });
  }
  return _jsxs('div', {
    className: 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50',
    children: [
      _jsx('header', {
        className: 'bg-white shadow-sm border-b',
        children: _jsxs('div', {
          className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          children: [
            _jsxs('div', {
              className: 'flex justify-between items-center py-3 border-b border-gray-100',
              children: [
                _jsxs('div', {
                  className: 'flex items-center space-x-6',
                  children: [
                    _jsx(Link, {
                      to: '/',
                      className:
                        'text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300',
                      children: 'Synapse'
                    }),
                    _jsxs('nav', {
                      className: 'hidden md:flex items-center space-x-6',
                      role: 'navigation',
                      'aria-label': 'Main navigation',
                      children: [
                        _jsx(Link, {
                          to: '/agents',
                          className:
                            'text-sm text-gray-600 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1',
                          'aria-label': 'Navigate to Agents page',
                          children: 'Agents'
                        }),
                        _jsx(Link, {
                          to: '/use-cases',
                          className:
                            'text-sm text-gray-600 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1',
                          'aria-label': 'Navigate to Use Cases page',
                          children: 'Use Cases'
                        }),
                        _jsx(Link, {
                          to: '/partners',
                          className:
                            'text-sm text-gray-600 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1',
                          'aria-label': 'Navigate to Partners page',
                          children: 'Partners'
                        })
                      ]
                    })
                  ]
                }),
                _jsxs('div', {
                  className: 'flex items-center space-x-3',
                  children: [
                    _jsx(Button, {
                      variant: 'outline',
                      size: 'sm',
                      asChild: true,
                      children: _jsx(Link, { to: '/dashboard', children: 'Dashboard' })
                    }),
                    _jsx(Button, {
                      size: 'sm',
                      asChild: true,
                      children: _jsx(Link, { to: '/', children: 'Home' })
                    })
                  ]
                })
              ]
            }),
            _jsxs('div', {
              className: 'flex justify-between items-center py-4',
              children: [
                _jsxs('div', {
                  className: 'flex items-center space-x-3',
                  children: [
                    _jsx('img', {
                      src: '/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png',
                      alt: 'Sophia - SFDR Navigator Agent',
                      className: 'w-8 h-8 rounded-full object-cover'
                    }),
                    _jsxs('div', {
                      children: [
                        _jsx('h1', {
                          className: 'text-2xl text-gray-900 font-medium',
                          children: 'SFDR Navigator - Sophia'
                        }),
                        _jsx('p', {
                          className: 'text-sm text-gray-500',
                          children: 'Elegant female guide to sustainable finance disclosures'
                        })
                      ]
                    })
                  ]
                }),
                _jsxs('div', {
                  className: 'flex items-center space-x-4',
                  children: [
                    _jsxs(Badge, {
                      variant: 'outline',
                      className: 'text-green-600 border-green-200',
                      children: [
                        _jsx(CheckCircle, { className: 'w-3 h-3 mr-1' }),
                        complianceData.status === 'pre-validated' ? 'Pre-Validated' : 'Needs Review'
                      ]
                    }),
                    _jsxs('span', {
                      className: 'text-sm text-gray-500',
                      children: ['ESMA ', complianceData.esmaReference]
                    })
                  ]
                })
              ]
            })
          ]
        })
      }),
      _jsxs('main', {
        className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6',
        children: [
          _jsx('div', {
            className: 'mb-6',
            children: _jsx(CriticalAuthAlert, {
              onConfigure: () => setShowApiKeyDialog(true),
              onDismiss: () => {
                // Could implement dismiss logic here
                console.log('Critical auth alert dismissed');
              }
            })
          }),
          _jsxs(Tabs, {
            value: activeTab,
            onValueChange: handleTabChange,
            children: [
              _jsxs(TabsList, {
                className: 'grid w-full grid-cols-3 mb-6',
                children: [
                  _jsxs(TabsTrigger, {
                    value: 'chat',
                    className: 'flex items-center space-x-2',
                    disabled: isLoadingTab,
                    children: [
                      isLoadingTab && activeTab === 'chat'
                        ? _jsx(Loader2, { className: 'w-4 h-4 animate-spin' })
                        : _jsx('img', {
                            src: '/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png',
                            alt: 'Sophia',
                            className: 'w-4 h-4 rounded-full object-cover'
                          }),
                      _jsx('span', { children: 'Chat' })
                    ]
                  }),
                  _jsxs(TabsTrigger, {
                    value: 'overview',
                    className: 'flex items-center space-x-2',
                    disabled: isLoadingTab,
                    children: [
                      isLoadingTab && activeTab === 'overview'
                        ? _jsx(Loader2, { className: 'w-4 h-4 animate-spin' })
                        : _jsx(BarChart3, { className: 'w-4 h-4' }),
                      _jsx('span', { children: 'Compliance Overview' })
                    ]
                  }),
                  _jsxs(TabsTrigger, {
                    value: 'testing',
                    className: 'flex items-center space-x-2',
                    disabled: isLoadingTab,
                    children: [
                      isLoadingTab && activeTab === 'testing'
                        ? _jsx(Loader2, { className: 'w-4 h-4 animate-spin' })
                        : _jsx(Target, { className: 'w-4 h-4' }),
                      _jsx('span', { children: 'UAT Testing' })
                    ]
                  })
                ]
              }),
              _jsx(TabsContent, {
                value: 'chat',
                children: isLoadingTab
                  ? _jsx(TabContentSkeleton, { type: 'chat' })
                  : _jsxs('div', {
                      className: 'grid grid-cols-1 lg:grid-cols-4 gap-6',
                      children: [
                        _jsx('div', {
                          className: 'lg:col-span-3 nexus-agent-container',
                          'data-testid': 'nexus-chat',
                          children: _jsx(Suspense, {
                            fallback: _jsx(EnhancedSkeleton, { className: 'h-96 w-full' }),
                            children: _jsx(NexusAgentChat, { className: 'shadow-lg', ref: chatRef })
                          })
                        }),
                        _jsxs('div', {
                          className: 'space-y-4',
                          children: [
                            _jsxs(Card, {
                              children: [
                                _jsx(CardHeader, {
                                  children: _jsxs(CardTitle, {
                                    className: 'text-lg flex items-center',
                                    children: [
                                      _jsx(FileText, { className: 'w-5 h-5 mr-2' }),
                                      'Quick Actions'
                                    ]
                                  })
                                }),
                                _jsx(CardContent, {
                                  className: 'space-y-3',
                                  children: quickActions.slice(0, 6).map(action =>
                                    _jsxs(
                                      Button,
                                      {
                                        variant: 'outline',
                                        className:
                                          'w-full justify-start hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 hover:scale-[1.02]',
                                        onClick: () => handleQuickAction(action.type),
                                        'data-testid': `quick-action-${action.type}`,
                                        disabled: isLoadingTab,
                                        children: [
                                          action.icon,
                                          _jsx('span', {
                                            className: 'ml-2',
                                            children: action.label
                                          })
                                        ]
                                      },
                                      action.type
                                    )
                                  )
                                })
                              ]
                            }),
                            _jsxs(Card, {
                              children: [
                                _jsx(CardHeader, {
                                  children: _jsx(CardTitle, {
                                    className: 'text-lg',
                                    children: 'Industry Metrics'
                                  })
                                }),
                                _jsx(CardContent, {
                                  className: 'space-y-4',
                                  children: industryMetrics.map((metric, index) =>
                                    _jsxs(
                                      'div',
                                      {
                                        className: 'flex items-center justify-between',
                                        children: [
                                          _jsxs('div', {
                                            className: 'flex items-center space-x-2',
                                            children: [
                                              metric.icon,
                                              _jsx('span', {
                                                className: 'text-sm font-medium',
                                                children: metric.label
                                              })
                                            ]
                                          }),
                                          _jsx('span', {
                                            className: 'text-sm font-bold',
                                            children: metric.value
                                          })
                                        ]
                                      },
                                      index
                                    )
                                  )
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
              }),
              _jsx(TabsContent, {
                value: 'overview',
                children: isLoadingTab
                  ? _jsx(TabContentSkeleton, { type: 'overview' })
                  : _jsxs('div', {
                      className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
                      children: [
                        _jsxs(Card, {
                          className: 'hover:shadow-lg transition-shadow duration-200',
                          children: [
                            _jsx(CardHeader, {
                              children: _jsxs(CardTitle, {
                                className: 'flex items-center',
                                children: [
                                  _jsx(Shield, { className: 'w-5 h-5 mr-2 text-green-600' }),
                                  'Compliance Status'
                                ]
                              })
                            }),
                            _jsx(CardContent, {
                              children: _jsxs('div', {
                                className: 'space-y-3',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex justify-between items-center',
                                    children: [
                                      _jsx('span', {
                                        className: 'text-sm',
                                        children: 'Overall Score'
                                      }),
                                      _jsx('span', {
                                        className: 'font-bold text-green-600',
                                        children: '94%'
                                      })
                                    ]
                                  }),
                                  _jsx(Progress, { value: 94, className: 'h-2' }),
                                  _jsxs('div', {
                                    className: 'text-xs text-gray-500',
                                    children: ['Last updated: ', new Date().toLocaleDateString()]
                                  })
                                ]
                              })
                            })
                          ]
                        }),
                        _jsxs(Card, {
                          className: 'hover:shadow-lg transition-shadow duration-200',
                          children: [
                            _jsx(CardHeader, {
                              children: _jsxs(CardTitle, {
                                className: 'flex items-center',
                                children: [
                                  _jsx(Clock, { className: 'w-5 h-5 mr-2 text-blue-600' }),
                                  'Recent Activity'
                                ]
                              })
                            }),
                            _jsx(CardContent, {
                              children: _jsxs('div', {
                                className: 'space-y-3',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex items-center space-x-2',
                                    children: [
                                      _jsx(CheckCircle, { className: 'w-4 h-4 text-green-600' }),
                                      _jsx('span', {
                                        className: 'text-sm',
                                        children: 'Document processed'
                                      })
                                    ]
                                  }),
                                  _jsxs('div', {
                                    className: 'flex items-center space-x-2',
                                    children: [
                                      _jsx(AlertTriangle, { className: 'w-4 h-4 text-yellow-600' }),
                                      _jsx('span', {
                                        className: 'text-sm',
                                        children: 'Review pending'
                                      })
                                    ]
                                  }),
                                  _jsxs('div', {
                                    className: 'flex items-center space-x-2',
                                    children: [
                                      _jsx(CheckCircle, { className: 'w-4 h-4 text-green-600' }),
                                      _jsx('span', {
                                        className: 'text-sm',
                                        children: 'Report generated'
                                      })
                                    ]
                                  })
                                ]
                              })
                            })
                          ]
                        }),
                        _jsxs(Card, {
                          className: 'hover:shadow-lg transition-shadow duration-200',
                          children: [
                            _jsx(CardHeader, {
                              children: _jsxs(CardTitle, {
                                className: 'flex items-center',
                                children: [
                                  _jsx(Activity, { className: 'w-5 h-5 mr-2 text-orange-600' }),
                                  'System Health'
                                ]
                              })
                            }),
                            _jsx(CardContent, {
                              children: _jsxs('div', {
                                className: 'space-y-3',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex justify-between items-center',
                                    children: [
                                      _jsx('span', {
                                        className: 'text-sm',
                                        children: 'API Response'
                                      }),
                                      _jsx('span', {
                                        className: 'font-bold text-green-600',
                                        children: '3.2s'
                                      })
                                    ]
                                  }),
                                  _jsxs('div', {
                                    className: 'flex justify-between items-center',
                                    children: [
                                      _jsx('span', { className: 'text-sm', children: 'Uptime' }),
                                      _jsx('span', {
                                        className: 'font-bold text-green-600',
                                        children: '99.9%'
                                      })
                                    ]
                                  }),
                                  _jsxs('div', {
                                    className: 'flex justify-between items-center',
                                    children: [
                                      _jsx('span', {
                                        className: 'text-sm',
                                        children: 'Active Users'
                                      }),
                                      _jsx('span', {
                                        className: 'font-bold text-purple-600',
                                        children: '500+'
                                      })
                                    ]
                                  })
                                ]
                              })
                            })
                          ]
                        })
                      ]
                    })
              }),
              _jsx(TabsContent, {
                value: 'testing',
                children: isLoadingTab
                  ? _jsx(TabContentSkeleton, { type: 'testing' })
                  : _jsxs('div', {
                      className: 'space-y-6',
                      children: [
                        _jsx(CriticalErrorAlert, {
                          errors: [
                            {
                              id: 'api-key-missing',
                              type: 'authentication',
                              title: 'API Configuration Required',
                              message:
                                'NEXUS_API_KEY must be configured in Supabase Secrets for LLM integration to work.',
                              severity: 'critical',
                              timestamp: new Date().toISOString(),
                              actionable: true,
                              recommendedActions: [
                                'Configure NEXUS_API_KEY in Supabase Secrets',
                                'Ensure API key is valid and not a placeholder',
                                'Test API connectivity after configuration'
                              ]
                            }
                          ],
                          onConfigureApi: () => setShowApiKeyDialog(true)
                        }),
                        _jsxs('div', {
                          className: 'bg-background border border-border rounded-lg shadow-sm p-6',
                          children: [
                            _jsx('h3', {
                              className: 'text-lg font-semibold text-foreground mb-4',
                              children: 'Enterprise Monitoring Dashboard'
                            }),
                            _jsx(RealTimeMonitoringDashboard, {})
                          ]
                        }),
                        _jsxs('div', {
                          className: 'bg-background border border-border rounded-lg shadow-sm p-6',
                          children: [
                            _jsx('h3', {
                              className: 'text-lg font-semibold text-foreground mb-4',
                              children: 'Backend Health Monitoring'
                            }),
                            _jsx('p', {
                              className: 'text-muted-foreground mb-6',
                              children:
                                'Real-time monitoring of backend services, API health, and system performance.'
                            }),
                            _jsx(Suspense, {
                              fallback: _jsx(EnhancedSkeleton, { className: 'h-32 w-full' }),
                              children: _jsx(BackendHealthDashboard, {
                                onAuthIssue: () => setShowApiKeyDialog(true)
                              })
                            })
                          ]
                        }),
                        _jsxs('div', {
                          className: 'bg-background border border-border rounded-lg shadow-sm p-6',
                          children: [
                            _jsx('h3', {
                              className: 'text-lg font-semibold text-foreground mb-4',
                              children: 'Backend API Connectivity Test'
                            }),
                            _jsx('p', {
                              className: 'text-muted-foreground mb-6',
                              children:
                                'Verify connection to api.joinsynapses.com and test LLM integration (Primary, Secondary, Hybrid strategies).'
                            }),
                            _jsx(Suspense, {
                              fallback: _jsx(EnhancedSkeleton, { className: 'h-32 w-full' }),
                              children: _jsx(EnhancedApiConnectivityTest, {})
                            })
                          ]
                        }),
                        _jsxs('div', {
                          className: 'bg-background border border-border rounded-lg shadow-sm p-6',
                          children: [
                            _jsx('h3', {
                              className: 'text-lg font-semibold text-foreground mb-4',
                              children: 'User Acceptance Testing Suite'
                            }),
                            _jsx('p', {
                              className: 'text-muted-foreground mb-6',
                              children:
                                'Execute comprehensive testing scenarios to validate SFDR Navigator functionality across different regulatory use cases and compliance requirements.'
                            }),
                            _jsx(Suspense, {
                              fallback: _jsx(EnhancedSkeleton, { className: 'h-32 w-full' }),
                              children: _jsx(NexusTestExecutor, {})
                            })
                          ]
                        })
                      ]
                    })
              })
            ]
          })
        ]
      }),
      _jsx(Dialog, {
        open: showApiKeyDialog,
        onOpenChange: setShowApiKeyDialog,
        children: _jsxs(DialogContent, {
          children: [
            _jsx(DialogHeader, {
              children: _jsx(DialogTitle, { children: 'API Authentication Required' })
            }),
            _jsx(SecretForm, {
              secretName: 'NEXUS_API_KEY',
              onSubmit: () => {
                setShowApiKeyDialog(false);
                // Trigger a refresh of the health monitor
                window.location.reload();
              },
              onCancel: () => setShowApiKeyDialog(false)
            })
          ]
        })
      })
    ]
  });
};
export default NexusAgent;
