import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TestTube,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Play,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Download
} from 'lucide-react';
// Import testing components
import UATChecklist from './UATChecklist';
import UserTestingSession from './UserTestingSession';
import TestReportDashboard from './TestReportDashboard';
import FeedbackWidget from '../feedback/FeedbackWidget';
/**
 * Comprehensive testing hub that integrates all testing and feedback components
 * Provides a centralized interface for managing UAT, user testing, and feedback collection
 */
const TestingHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    totalTests: 0,
    completedTests: 0,
    passedTests: 0,
    failedTests: 0,
    activeSessions: 0,
    totalFeedback: 0,
    avgRating: 0,
    criticalIssues: 0
  });
  const [showFeedbackWidget, setShowFeedbackWidget] = useState(false);
  // Load and calculate metrics
  useEffect(() => {
    const loadMetrics = () => {
      // Load UAT test results
      const uatResults = localStorage.getItem('uat_test_results');
      const testMetrics = { total: 0, completed: 0, passed: 0, failed: 0 };
      if (uatResults) {
        const results = Object.values(JSON.parse(uatResults));
        testMetrics.total = results.length;
        testMetrics.completed = results.filter(r => r.status !== 'pending').length;
        testMetrics.passed = results.filter(r => r.status === 'passed').length;
        testMetrics.failed = results.filter(r => r.status === 'failed').length;
      }
      // Load feedback data
      const feedbackData = localStorage.getItem('user_feedback_data');
      const feedbackMetrics = { total: 0, avgRating: 0 };
      if (feedbackData) {
        const feedback = JSON.parse(feedbackData);
        feedbackMetrics.total = feedback.length;
        feedbackMetrics.avgRating =
          feedback.length > 0
            ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
            : 0;
      }
      // Calculate critical issues
      const criticalIssues =
        testMetrics.failed +
        (feedbackData ? JSON.parse(feedbackData).filter(f => f.rating <= 2).length : 0);
      setMetrics({
        totalTests: testMetrics.total,
        completedTests: testMetrics.completed,
        passedTests: testMetrics.passed,
        failedTests: testMetrics.failed,
        activeSessions: 0, // Would be managed by session state
        totalFeedback: feedbackMetrics.total,
        avgRating: feedbackMetrics.avgRating,
        criticalIssues
      });
    };
    loadMetrics();
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);
  // Quick actions configuration
  const quickActions = [
    {
      id: 'start-uat',
      title: 'Start UAT Testing',
      description: 'Begin systematic user acceptance testing',
      icon: _jsx(TestTube, { className: 'h-5 w-5' }),
      action: () => setActiveTab('uat'),
      variant: 'default'
    },
    {
      id: 'new-session',
      title: 'New Testing Session',
      description: 'Start a live user testing session',
      icon: _jsx(Play, { className: 'h-5 w-5' }),
      action: () => setActiveTab('sessions'),
      variant: 'default'
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Access testing analytics and reports',
      icon: _jsx(BarChart3, { className: 'h-5 w-5' }),
      action: () => setActiveTab('reports'),
      variant: 'outline'
    },
    {
      id: 'collect-feedback',
      title: 'Collect Feedback',
      description: 'Enable feedback widget for users',
      icon: _jsx(MessageSquare, { className: 'h-5 w-5' }),
      action: () => setShowFeedbackWidget(true),
      variant: 'outline'
    },
    {
      id: 'export-data',
      title: 'Export All Data',
      description: 'Download comprehensive testing data',
      icon: _jsx(Download, { className: 'h-5 w-5' }),
      action: exportAllData,
      variant: 'secondary'
    }
  ];
  // Export all testing data
  function exportAllData() {
    const uatResults = localStorage.getItem('uat_test_results');
    const feedbackData = localStorage.getItem('user_feedback_data');
    const testerName = localStorage.getItem('uat_tester_name');
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportType: 'Complete Testing Data Export',
        version: '1.0'
      },
      metrics,
      uatResults: uatResults ? JSON.parse(uatResults) : {},
      feedbackData: feedbackData ? JSON.parse(feedbackData) : [],
      testerInfo: {
        name: testerName || 'Unknown'
      }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complete-testing-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  // Get status color based on metrics
  const getStatusColor = () => {
    if (metrics.criticalIssues > 5) {
      return 'text-red-600';
    }
    if (metrics.criticalIssues > 2) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };
  // Get completion percentage
  const getCompletionPercentage = () => {
    return metrics.totalTests > 0 ? (metrics.completedTests / metrics.totalTests) * 100 : 0;
  };
  return _jsxs('div', {
    className: 'max-w-7xl mx-auto p-6 space-y-6',
    children: [
      _jsxs('div', {
        className: 'text-center space-y-4',
        children: [
          _jsx('h1', { className: 'text-4xl font-bold text-gray-900', children: 'Testing Hub' }),
          _jsx('p', {
            className: 'text-xl text-gray-600 max-w-3xl mx-auto',
            children:
              'Comprehensive testing and feedback management for the Synapses Landing Page. Coordinate UAT, user testing sessions, and feedback collection from a single interface.'
          })
        ]
      }),
      _jsxs(Card, {
        className: 'border-2',
        children: [
          _jsx(CardHeader, {
            children: _jsxs(CardTitle, {
              className: 'flex items-center gap-2',
              children: [_jsx(TrendingUp, { className: 'h-6 w-6' }), 'Testing Status Overview']
            })
          }),
          _jsx(CardContent, {
            children: _jsxs('div', {
              className: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4',
              children: [
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsx('div', {
                      className: 'text-2xl font-bold text-blue-600',
                      children: metrics.totalTests
                    }),
                    _jsx('div', { className: 'text-sm text-gray-600', children: 'Total Tests' })
                  ]
                }),
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsx('div', {
                      className: 'text-2xl font-bold text-green-600',
                      children: metrics.passedTests
                    }),
                    _jsx('div', { className: 'text-sm text-gray-600', children: 'Passed' })
                  ]
                }),
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsx('div', {
                      className: 'text-2xl font-bold text-red-600',
                      children: metrics.failedTests
                    }),
                    _jsx('div', { className: 'text-sm text-gray-600', children: 'Failed' })
                  ]
                }),
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsxs('div', {
                      className: 'text-2xl font-bold text-gray-600',
                      children: [getCompletionPercentage().toFixed(0), '%']
                    }),
                    _jsx('div', { className: 'text-sm text-gray-600', children: 'Complete' })
                  ]
                }),
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsx('div', {
                      className: 'text-2xl font-bold text-purple-600',
                      children: metrics.totalFeedback
                    }),
                    _jsx('div', { className: 'text-sm text-gray-600', children: 'Feedback' })
                  ]
                }),
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsxs('div', {
                      className: 'text-2xl font-bold text-yellow-600',
                      children: [metrics.avgRating.toFixed(1), '/5']
                    }),
                    _jsx('div', { className: 'text-sm text-gray-600', children: 'Avg Rating' })
                  ]
                }),
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsx('div', {
                      className: 'text-2xl font-bold text-orange-600',
                      children: metrics.activeSessions
                    }),
                    _jsx('div', { className: 'text-sm text-gray-600', children: 'Active Sessions' })
                  ]
                }),
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsx('div', {
                      className: `text-2xl font-bold ${getStatusColor()}`,
                      children: metrics.criticalIssues
                    }),
                    _jsx('div', { className: 'text-sm text-gray-600', children: 'Critical Issues' })
                  ]
                })
              ]
            })
          })
        ]
      }),
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, { children: _jsx(CardTitle, { children: 'Quick Actions' }) }),
          _jsx(CardContent, {
            children: _jsx('div', {
              className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4',
              children: quickActions.map(action =>
                _jsxs(
                  Button,
                  {
                    variant: action.variant,
                    onClick: action.action,
                    className: 'h-auto p-4 flex flex-col items-center gap-2',
                    children: [
                      action.icon,
                      _jsxs('div', {
                        className: 'text-center',
                        children: [
                          _jsx('div', { className: 'font-medium', children: action.title }),
                          _jsx('div', {
                            className: 'text-xs opacity-70',
                            children: action.description
                          })
                        ]
                      })
                    ]
                  },
                  action.id
                )
              )
            })
          })
        ]
      }),
      metrics.criticalIssues > 0 &&
        _jsxs(Alert, {
          className: 'border-red-200 bg-red-50',
          children: [
            _jsx(AlertTriangle, { className: 'h-4 w-4 text-red-600' }),
            _jsxs(AlertDescription, {
              className: 'text-red-800',
              children: [
                _jsx('strong', { children: 'Attention Required:' }),
                ' ',
                metrics.criticalIssues,
                ' critical issues detected. Review failed tests and low-rating feedback in the Reports section.'
              ]
            })
          ]
        }),
      metrics.totalTests > 0 &&
        getCompletionPercentage() === 100 &&
        metrics.criticalIssues === 0 &&
        _jsxs(Alert, {
          className: 'border-green-200 bg-green-50',
          children: [
            _jsx(CheckCircle, { className: 'h-4 w-4 text-green-600' }),
            _jsxs(AlertDescription, {
              className: 'text-green-800',
              children: [
                _jsx('strong', { children: 'Excellent!' }),
                ' All tests completed successfully with no critical issues. The application is ready for deployment.'
              ]
            })
          ]
        }),
      _jsxs(Tabs, {
        value: activeTab,
        onValueChange: setActiveTab,
        className: 'space-y-6',
        children: [
          _jsxs(TabsList, {
            className: 'grid w-full grid-cols-4',
            children: [
              _jsxs(TabsTrigger, {
                value: 'overview',
                className: 'flex items-center gap-2',
                children: [_jsx(Settings, { className: 'h-4 w-4' }), 'Overview']
              }),
              _jsxs(TabsTrigger, {
                value: 'uat',
                className: 'flex items-center gap-2',
                children: [_jsx(TestTube, { className: 'h-4 w-4' }), 'UAT Testing']
              }),
              _jsxs(TabsTrigger, {
                value: 'sessions',
                className: 'flex items-center gap-2',
                children: [_jsx(Users, { className: 'h-4 w-4' }), 'User Sessions']
              }),
              _jsxs(TabsTrigger, {
                value: 'reports',
                className: 'flex items-center gap-2',
                children: [_jsx(BarChart3, { className: 'h-4 w-4' }), 'Reports']
              })
            ]
          }),
          _jsx(TabsContent, {
            value: 'overview',
            className: 'space-y-6',
            children: _jsxs('div', {
              className: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
              children: [
                _jsxs(Card, {
                  children: [
                    _jsx(CardHeader, {
                      children: _jsxs(CardTitle, {
                        className: 'flex items-center gap-2',
                        children: [_jsx(FileText, { className: 'h-5 w-5' }), 'Testing Guidelines']
                      })
                    }),
                    _jsxs(CardContent, {
                      className: 'space-y-4',
                      children: [
                        _jsxs('div', {
                          children: [
                            _jsx('h4', {
                              className: 'font-medium mb-2',
                              children: 'UAT Testing Process:'
                            }),
                            _jsxs('ol', {
                              className: 'list-decimal list-inside space-y-1 text-sm text-gray-600',
                              children: [
                                _jsx('li', {
                                  children: 'Review test cases and understand requirements'
                                }),
                                _jsx('li', {
                                  children: 'Execute tests systematically by category'
                                }),
                                _jsx('li', { children: 'Document findings and issues thoroughly' }),
                                _jsx('li', {
                                  children: 'Mark tests as passed, failed, or blocked'
                                }),
                                _jsx('li', { children: 'Export results for stakeholder review' })
                              ]
                            })
                          ]
                        }),
                        _jsxs('div', {
                          children: [
                            _jsx('h4', {
                              className: 'font-medium mb-2',
                              children: 'User Testing Sessions:'
                            }),
                            _jsxs('ol', {
                              className: 'list-decimal list-inside space-y-1 text-sm text-gray-600',
                              children: [
                                _jsx('li', { children: 'Prepare testing scenarios and tasks' }),
                                _jsx('li', { children: 'Set up recording and observation tools' }),
                                _jsx('li', { children: 'Guide users through realistic scenarios' }),
                                _jsx('li', {
                                  children: 'Collect real-time feedback and observations'
                                }),
                                _jsx('li', { children: 'Analyze session data and user behavior' })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),
                _jsxs(Card, {
                  children: [
                    _jsx(CardHeader, {
                      children: _jsx(CardTitle, { children: 'Testing Best Practices' })
                    }),
                    _jsxs(CardContent, {
                      className: 'space-y-4',
                      children: [
                        _jsxs('div', {
                          children: [
                            _jsx('h4', {
                              className: 'font-medium mb-2',
                              children: 'Quality Assurance:'
                            }),
                            _jsxs('ul', {
                              className: 'list-disc list-inside space-y-1 text-sm text-gray-600',
                              children: [
                                _jsx('li', {
                                  children: 'Test across multiple browsers and devices'
                                }),
                                _jsx('li', { children: 'Verify accessibility compliance (WCAG)' }),
                                _jsx('li', { children: 'Check performance on slow connections' }),
                                _jsx('li', {
                                  children: 'Validate SFDR regulatory content accuracy'
                                }),
                                _jsx('li', { children: 'Test with real user data when possible' })
                              ]
                            })
                          ]
                        }),
                        _jsxs('div', {
                          children: [
                            _jsx('h4', {
                              className: 'font-medium mb-2',
                              children: 'Documentation:'
                            }),
                            _jsxs('ul', {
                              className: 'list-disc list-inside space-y-1 text-sm text-gray-600',
                              children: [
                                _jsx('li', {
                                  children: 'Record detailed steps to reproduce issues'
                                }),
                                _jsx('li', { children: 'Include screenshots for visual problems' }),
                                _jsx('li', {
                                  children: 'Note browser/device information for bugs'
                                }),
                                _jsx('li', {
                                  children: 'Prioritize issues by severity and impact'
                                }),
                                _jsx('li', { children: 'Provide clear acceptance criteria' })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          }),
          _jsx(TabsContent, { value: 'uat', children: _jsx(UATChecklist, {}) }),
          _jsx(TabsContent, { value: 'sessions', children: _jsx(UserTestingSession, {}) }),
          _jsx(TabsContent, { value: 'reports', children: _jsx(TestReportDashboard, {}) })
        ]
      }),
      showFeedbackWidget &&
        _jsx('div', {
          className: 'fixed bottom-4 right-4 z-50',
          children: _jsx(FeedbackWidget, {})
        })
    ]
  });
};
export default TestingHub;
