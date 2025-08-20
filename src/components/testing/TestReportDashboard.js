import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react';
/**
 * Comprehensive test reporting dashboard
 * Aggregates UAT results, user feedback, and testing metrics
 * Provides visual analytics and exportable reports
 */
const TestReportDashboard = () => {
  const [testResults, setTestResults] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    blockedTests: 0,
    pendingTests: 0,
    testCoverage: 0,
    avgFeedbackRating: 0,
    totalFeedback: 0,
    criticalIssues: 0
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  // Load test results and feedback data
  useEffect(() => {
    // Load UAT test results
    const savedUATResults = localStorage.getItem('uat_test_results');
    if (savedUATResults) {
      const uatData = JSON.parse(savedUATResults);
      const testResultsArray = Object.values(uatData);
      setTestResults(testResultsArray);
    }
    // Load feedback data
    const savedFeedback = localStorage.getItem('user_feedback_data');
    if (savedFeedback) {
      const feedbackArray = JSON.parse(savedFeedback);
      setFeedbackData(feedbackArray);
    }
  }, []);
  // Calculate metrics
  useEffect(() => {
    const totalTests = testResults.length;
    const passedTests = testResults.filter(t => t.status === 'passed').length;
    const failedTests = testResults.filter(t => t.status === 'failed').length;
    const blockedTests = testResults.filter(t => t.status === 'blocked').length;
    const pendingTests = testResults.filter(t => t.status === 'pending').length;
    const testCoverage = totalTests > 0 ? ((totalTests - pendingTests) / totalTests) * 100 : 0;
    const totalFeedback = feedbackData.length;
    const avgFeedbackRating =
      totalFeedback > 0 ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback : 0;
    const criticalIssues =
      testResults.filter(t => t.status === 'failed' && t.priority === 'high').length +
      feedbackData.filter(f => f.rating <= 2).length;
    setMetrics({
      totalTests,
      passedTests,
      failedTests,
      blockedTests,
      pendingTests,
      testCoverage,
      avgFeedbackRating,
      totalFeedback,
      criticalIssues
    });
  }, [testResults, feedbackData]);
  // Prepare chart data
  const getTestStatusData = () => [
    { name: 'Passed', value: metrics.passedTests, color: '#10B981' },
    { name: 'Failed', value: metrics.failedTests, color: '#EF4444' },
    { name: 'Blocked', value: metrics.blockedTests, color: '#F59E0B' },
    { name: 'Pending', value: metrics.pendingTests, color: '#6B7280' }
  ];
  const getCategoryData = () => {
    const categories = testResults.reduce((acc, test) => {
      const category = test.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = { passed: 0, failed: 0, total: 0 };
      }
      acc[category].total++;
      if (test.status === 'passed') {
        acc[category].passed++;
      }
      if (test.status === 'failed') {
        acc[category].failed++;
      }
      return acc;
    }, {});
    return Object.entries(categories).map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      passed: data.passed,
      failed: data.failed,
      total: data.total,
      passRate: data.total > 0 ? (data.passed / data.total) * 100 : 0
    }));
  };
  const getFeedbackTrendData = () => {
    const now = new Date();
    const timeRangeMs = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }[selectedTimeRange];
    const filteredFeedback = feedbackData.filter(
      f => new Date(f.timestamp).getTime() > now.getTime() - timeRangeMs
    );
    // Group by day
    const groupedByDay = filteredFeedback.reduce((acc, feedback) => {
      const timestamp = feedback.timestamp || new Date().toISOString();
      const day = new Date(timestamp).toISOString().split('T')[0] || 'unknown';
      if (!acc[day]) {
        acc[day] = { date: day, ratings: [], count: 0 };
      }
      acc[day].ratings.push(feedback.rating || 0);
      acc[day].count++;
      return acc;
    }, {});
    return Object.values(groupedByDay)
      .map(day => ({
        date: day.date,
        avgRating: day.ratings.reduce((sum, r) => sum + r, 0) / day.ratings.length,
        count: day.count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };
  const getTopIssues = () => {
    const failedTests = testResults.filter(t => t.status === 'failed');
    const lowRatingFeedback = feedbackData.filter(f => f.rating <= 2);
    const issues = [
      ...failedTests.map(test => ({
        type: 'Test Failure',
        title: test.title,
        category: test.category,
        priority: test.priority,
        description: test.notes || 'No details provided',
        timestamp: test.timestamp || ''
      })),
      ...lowRatingFeedback.map(feedback => ({
        type: 'User Feedback',
        title: `Low rating (${feedback.rating}/5)`,
        category: feedback.category,
        priority: feedback.rating === 1 ? 'high' : 'medium',
        description: feedback.comment || 'No comment provided',
        timestamp: feedback.timestamp
      }))
    ].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    return issues.slice(0, 10); // Top 10 issues
  };
  // Export comprehensive report
  const exportReport = () => {
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        timeRange: selectedTimeRange,
        reportType: 'Comprehensive UAT & Feedback Report'
      },
      summary: metrics,
      testResults,
      feedbackData,
      analytics: {
        categoryData: getCategoryData(),
        feedbackTrend: getFeedbackTrendData(),
        topIssues: getTopIssues()
      }
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uat-feedback-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const statusData = getTestStatusData();
  const categoryData = getCategoryData();
  const feedbackTrendData = getFeedbackTrendData();
  const topIssues = getTopIssues();
  return _jsxs('div', {
    className: 'max-w-7xl mx-auto p-6 space-y-6',
    children: [
      _jsxs('div', {
        className: 'flex justify-between items-center',
        children: [
          _jsxs('div', {
            children: [
              _jsx('h1', {
                className: 'text-3xl font-bold text-gray-900',
                children: 'Test Report Dashboard'
              }),
              _jsx('p', {
                className: 'text-gray-600 mt-1',
                children: 'Comprehensive overview of UAT results and user feedback'
              })
            ]
          }),
          _jsxs('div', {
            className: 'flex gap-3',
            children: [
              _jsxs('select', {
                value: selectedTimeRange,
                onChange: e => setSelectedTimeRange(e.target.value),
                className:
                  'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                children: [
                  _jsx('option', { value: '24h', children: 'Last 24 Hours' }),
                  _jsx('option', { value: '7d', children: 'Last 7 Days' }),
                  _jsx('option', { value: '30d', children: 'Last 30 Days' })
                ]
              }),
              _jsxs(Button, {
                onClick: exportReport,
                children: [_jsx(Download, { className: 'h-4 w-4 mr-2' }), 'Export Report']
              })
            ]
          })
        ]
      }),
      _jsxs('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
        children: [
          _jsx(Card, {
            children: _jsx(CardContent, {
              className: 'p-6',
              children: _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  _jsxs('div', {
                    children: [
                      _jsx('p', {
                        className: 'text-sm font-medium text-gray-600',
                        children: 'Test Coverage'
                      }),
                      _jsxs('p', {
                        className: 'text-2xl font-bold text-blue-600',
                        children: [metrics.testCoverage.toFixed(1), '%']
                      })
                    ]
                  }),
                  _jsx(CheckCircle, { className: 'h-8 w-8 text-blue-600' })
                ]
              })
            })
          }),
          _jsx(Card, {
            children: _jsx(CardContent, {
              className: 'p-6',
              children: _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  _jsxs('div', {
                    children: [
                      _jsx('p', {
                        className: 'text-sm font-medium text-gray-600',
                        children: 'Avg. User Rating'
                      }),
                      _jsxs('p', {
                        className: 'text-2xl font-bold text-green-600',
                        children: [metrics.avgFeedbackRating.toFixed(1), '/5']
                      })
                    ]
                  }),
                  _jsx(TrendingUp, { className: 'h-8 w-8 text-green-600' })
                ]
              })
            })
          }),
          _jsx(Card, {
            children: _jsx(CardContent, {
              className: 'p-6',
              children: _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  _jsxs('div', {
                    children: [
                      _jsx('p', {
                        className: 'text-sm font-medium text-gray-600',
                        children: 'Critical Issues'
                      }),
                      _jsx('p', {
                        className: 'text-2xl font-bold text-red-600',
                        children: metrics.criticalIssues
                      })
                    ]
                  }),
                  _jsx(AlertTriangle, { className: 'h-8 w-8 text-red-600' })
                ]
              })
            })
          }),
          _jsx(Card, {
            children: _jsx(CardContent, {
              className: 'p-6',
              children: _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  _jsxs('div', {
                    children: [
                      _jsx('p', {
                        className: 'text-sm font-medium text-gray-600',
                        children: 'Total Feedback'
                      }),
                      _jsx('p', {
                        className: 'text-2xl font-bold text-purple-600',
                        children: metrics.totalFeedback
                      })
                    ]
                  }),
                  _jsx(Users, { className: 'h-8 w-8 text-purple-600' })
                ]
              })
            })
          })
        ]
      }),
      _jsxs(Tabs, {
        defaultValue: 'overview',
        className: 'space-y-6',
        children: [
          _jsxs(TabsList, {
            children: [
              _jsx(TabsTrigger, { value: 'overview', children: 'Overview' }),
              _jsx(TabsTrigger, { value: 'testing', children: 'Testing Results' }),
              _jsx(TabsTrigger, { value: 'feedback', children: 'User Feedback' }),
              _jsx(TabsTrigger, { value: 'issues', children: 'Issues & Actions' })
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
                      children: _jsx(CardTitle, { children: 'Test Status Distribution' })
                    }),
                    _jsx(CardContent, {
                      children: _jsx(ResponsiveContainer, {
                        width: '100%',
                        height: 300,
                        children: _jsxs(PieChart, {
                          children: [
                            _jsx(Pie, {
                              data: statusData,
                              cx: '50%',
                              cy: '50%',
                              outerRadius: 80,
                              dataKey: 'value',
                              label: ({ name, value }) => `${name}: ${value}`,
                              children: statusData.map((entry, index) =>
                                _jsx(Cell, { fill: entry.color }, `cell-${index}`)
                              )
                            }),
                            _jsx(Tooltip, {})
                          ]
                        })
                      })
                    })
                  ]
                }),
                _jsxs(Card, {
                  children: [
                    _jsx(CardHeader, {
                      children: _jsx(CardTitle, { children: 'Category Performance' })
                    }),
                    _jsx(CardContent, {
                      children: _jsx(ResponsiveContainer, {
                        width: '100%',
                        height: 300,
                        children: _jsxs(BarChart, {
                          data: categoryData,
                          children: [
                            _jsx(CartesianGrid, { strokeDasharray: '3 3' }),
                            _jsx(XAxis, { dataKey: 'category' }),
                            _jsx(YAxis, {}),
                            _jsx(Tooltip, {}),
                            _jsx(Bar, { dataKey: 'passed', fill: '#10B981', name: 'Passed' }),
                            _jsx(Bar, { dataKey: 'failed', fill: '#EF4444', name: 'Failed' })
                          ]
                        })
                      })
                    })
                  ]
                })
              ]
            })
          }),
          _jsx(TabsContent, {
            value: 'testing',
            className: 'space-y-6',
            children: _jsxs('div', {
              className: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
              children: [
                _jsxs(Card, {
                  children: [
                    _jsx(CardHeader, {
                      children: _jsx(CardTitle, { children: 'Test Results Summary' })
                    }),
                    _jsx(CardContent, {
                      children: _jsxs('div', {
                        className: 'space-y-4',
                        children: [
                          _jsxs('div', {
                            className: 'flex justify-between items-center',
                            children: [
                              _jsx('span', {
                                className: 'text-sm font-medium',
                                children: 'Total Tests'
                              }),
                              _jsx(Badge, { variant: 'outline', children: metrics.totalTests })
                            ]
                          }),
                          _jsxs('div', {
                            className: 'flex justify-between items-center',
                            children: [
                              _jsx('span', {
                                className: 'text-sm font-medium text-green-600',
                                children: 'Passed'
                              }),
                              _jsx(Badge, {
                                className: 'bg-green-100 text-green-800',
                                children: metrics.passedTests
                              })
                            ]
                          }),
                          _jsxs('div', {
                            className: 'flex justify-between items-center',
                            children: [
                              _jsx('span', {
                                className: 'text-sm font-medium text-red-600',
                                children: 'Failed'
                              }),
                              _jsx(Badge, {
                                className: 'bg-red-100 text-red-800',
                                children: metrics.failedTests
                              })
                            ]
                          }),
                          _jsxs('div', {
                            className: 'flex justify-between items-center',
                            children: [
                              _jsx('span', {
                                className: 'text-sm font-medium text-yellow-600',
                                children: 'Blocked'
                              }),
                              _jsx(Badge, {
                                className: 'bg-yellow-100 text-yellow-800',
                                children: metrics.blockedTests
                              })
                            ]
                          }),
                          _jsxs('div', {
                            className: 'flex justify-between items-center',
                            children: [
                              _jsx('span', {
                                className: 'text-sm font-medium text-gray-600',
                                children: 'Pending'
                              }),
                              _jsx(Badge, {
                                className: 'bg-gray-100 text-gray-800',
                                children: metrics.pendingTests
                              })
                            ]
                          })
                        ]
                      })
                    })
                  ]
                }),
                _jsxs(Card, {
                  children: [
                    _jsx(CardHeader, {
                      children: _jsx(CardTitle, { children: 'Category Pass Rates' })
                    }),
                    _jsx(CardContent, {
                      children: _jsx('div', {
                        className: 'space-y-3',
                        children: categoryData.map(category =>
                          _jsxs(
                            'div',
                            {
                              className: 'space-y-2',
                              children: [
                                _jsxs('div', {
                                  className: 'flex justify-between text-sm',
                                  children: [
                                    _jsx('span', { children: category.category }),
                                    _jsxs('span', { children: [category.passRate.toFixed(1), '%'] })
                                  ]
                                }),
                                _jsx('div', {
                                  className: 'w-full bg-gray-200 rounded-full h-2',
                                  children: _jsx('div', {
                                    className: 'bg-blue-600 h-2 rounded-full',
                                    style: { width: `${category.passRate}%` }
                                  })
                                })
                              ]
                            },
                            category.category
                          )
                        )
                      })
                    })
                  ]
                })
              ]
            })
          }),
          _jsx(TabsContent, {
            value: 'feedback',
            className: 'space-y-6',
            children: _jsxs(Card, {
              children: [
                _jsx(CardHeader, { children: _jsx(CardTitle, { children: 'Feedback Trend' }) }),
                _jsx(CardContent, {
                  children: _jsx(ResponsiveContainer, {
                    width: '100%',
                    height: 300,
                    children: _jsxs(LineChart, {
                      data: feedbackTrendData,
                      children: [
                        _jsx(CartesianGrid, { strokeDasharray: '3 3' }),
                        _jsx(XAxis, { dataKey: 'date' }),
                        _jsx(YAxis, { domain: [0, 5] }),
                        _jsx(Tooltip, {}),
                        _jsx(Line, {
                          type: 'monotone',
                          dataKey: 'avgRating',
                          stroke: '#8884d8',
                          strokeWidth: 2
                        })
                      ]
                    })
                  })
                })
              ]
            })
          }),
          _jsx(TabsContent, {
            value: 'issues',
            className: 'space-y-6',
            children: _jsxs(Card, {
              children: [
                _jsx(CardHeader, {
                  children: _jsx(CardTitle, { children: 'Top Issues Requiring Attention' })
                }),
                _jsx(CardContent, {
                  children: _jsx('div', {
                    className: 'space-y-4',
                    children:
                      topIssues.length === 0
                        ? _jsxs(Alert, {
                            children: [
                              _jsx(CheckCircle, { className: 'h-4 w-4' }),
                              _jsx(AlertDescription, {
                                children: 'No critical issues found. Great job!'
                              })
                            ]
                          })
                        : topIssues.map((issue, index) =>
                            _jsxs(
                              'div',
                              {
                                className: 'border rounded-lg p-4 space-y-2',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex items-center justify-between',
                                    children: [
                                      _jsxs('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          _jsx(Badge, {
                                            variant:
                                              issue.type === 'Test Failure'
                                                ? 'destructive'
                                                : 'secondary',
                                            children: issue.type
                                          }),
                                          _jsx(Badge, {
                                            variant:
                                              issue.priority === 'high'
                                                ? 'destructive'
                                                : issue.priority === 'medium'
                                                  ? 'default'
                                                  : 'secondary',
                                            children: issue.priority
                                          })
                                        ]
                                      }),
                                      _jsx('span', {
                                        className: 'text-xs text-gray-500',
                                        children: issue.timestamp
                                          ? new Date(issue.timestamp).toLocaleDateString()
                                          : 'No date'
                                      })
                                    ]
                                  }),
                                  _jsx('h4', { className: 'font-medium', children: issue.title }),
                                  _jsx('p', {
                                    className: 'text-sm text-gray-600',
                                    children: issue.description
                                  }),
                                  _jsxs('p', {
                                    className: 'text-xs text-gray-500',
                                    children: ['Category: ', issue.category]
                                  })
                                ]
                              },
                              index
                            )
                          )
                  })
                })
              ]
            })
          })
        ]
      })
    ]
  });
};
export default TestReportDashboard;
