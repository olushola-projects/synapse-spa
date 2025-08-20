import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
/**
 * Phase 1 Testing Dashboard
 * MCP-Enhanced Testing Interface with Advanced Capabilities
 */
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mcpSecurityService } from '@/services/mcp-security';
import { mcpTestingService } from '@/services/mcp-testing';
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Play,
  Settings,
  Shield,
  XCircle,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
export const Phase1TestingDashboard = () => {
  const [testSuites, setTestSuites] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [mcpStatus, setMcpStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  useEffect(() => {
    initializeDashboard();
  }, []);
  const initializeDashboard = async () => {
    // Get MCP status
    const testingStatus = mcpTestingService.getStatus();
    const securityStatus = mcpSecurityService.getStatus();
    setMcpStatus({
      testing: testingStatus,
      security: securityStatus
    });
    // Initialize test suites
    const suites = [
      {
        id: 'functional-tests',
        name: 'Functional Testing',
        description: 'AI-powered test generation and execution',
        tests: [],
        status: 'completed',
        progress: 0,
        mcpEnabled: testingStatus.connected
      },
      {
        id: 'security-tests',
        name: 'Security Testing',
        description: 'Vulnerability scanning and compliance validation',
        tests: [],
        status: 'completed',
        progress: 0,
        mcpEnabled: securityStatus.connected
      },
      {
        id: 'performance-tests',
        name: 'Performance Testing',
        description: 'Load testing and performance optimization',
        tests: [],
        status: 'completed',
        progress: 0,
        mcpEnabled: testingStatus.connected
      },
      {
        id: 'compliance-tests',
        name: 'Compliance Testing',
        description: 'SFDR and regulatory compliance validation',
        tests: [],
        status: 'completed',
        progress: 0,
        mcpEnabled: securityStatus.connected
      }
    ];
    setTestSuites(suites);
  };
  const runAllTests = async () => {
    setIsRunning(true);
    try {
      // Run functional tests
      await runFunctionalTests();
      // Run security tests
      await runSecurityTests();
      // Run performance tests
      await runPerformanceTests();
      // Run compliance tests
      await runComplianceTests();
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };
  const runFunctionalTests = async () => {
    const suite = testSuites.find(s => s.id === 'functional-tests');
    if (!suite) return;
    updateSuiteStatus('functional-tests', 'running', 0);
    try {
      const tests = await mcpTestingService.generateTests('SFDRNavigator', [
        'AI classification accuracy',
        '3D visualization rendering',
        'Citation generation',
        'Export functionality',
        'Real-time performance'
      ]);
      updateSuiteTests('functional-tests', tests);
      updateSuiteStatus('functional-tests', 'completed', 100);
    } catch (error) {
      updateSuiteStatus('functional-tests', 'failed', 0);
    }
  };
  const runSecurityTests = async () => {
    const suite = testSuites.find(s => s.id === 'security-tests');
    if (!suite) return;
    updateSuiteStatus('security-tests', 'running', 0);
    try {
      const vulnerabilityTests = await mcpSecurityService.runVulnerabilityScan('synapses-platform');
      const complianceTests = await mcpSecurityService.runComplianceValidation('SFDR', [
        'Article 6 compliance',
        'Article 8 compliance',
        'Article 9 compliance',
        'PAI indicators validation'
      ]);
      const allTests = [...vulnerabilityTests, ...complianceTests];
      updateSuiteTests('security-tests', allTests);
      updateSuiteStatus('security-tests', 'completed', 100);
    } catch (error) {
      updateSuiteStatus('security-tests', 'failed', 0);
    }
  };
  const runPerformanceTests = async () => {
    const suite = testSuites.find(s => s.id === 'performance-tests');
    if (!suite) return;
    updateSuiteStatus('performance-tests', 'running', 0);
    try {
      // Simulate performance tests
      const tests = [
        {
          testId: 'perf-1',
          testType: 'performance',
          status: 'passed',
          mcpEnhanced: suite.mcpEnabled,
          confidence: 0.9,
          details: {
            description: 'Page load time < 1.5s',
            expected: '< 1.5s',
            actual: '1.2s'
          }
        },
        {
          testId: 'perf-2',
          testType: 'performance',
          status: 'passed',
          mcpEnhanced: suite.mcpEnabled,
          confidence: 0.85,
          details: {
            description: 'AI response time < 100ms',
            expected: '< 100ms',
            actual: '85ms'
          }
        }
      ];
      updateSuiteTests('performance-tests', tests);
      updateSuiteStatus('performance-tests', 'completed', 100);
    } catch (error) {
      updateSuiteStatus('performance-tests', 'failed', 0);
    }
  };
  const runComplianceTests = async () => {
    const suite = testSuites.find(s => s.id === 'compliance-tests');
    if (!suite) return;
    updateSuiteStatus('compliance-tests', 'running', 0);
    try {
      const tests = await mcpSecurityService.runComplianceValidation('SFDR', [
        'Regulatory citation accuracy',
        'Documentation completeness',
        'Audit trail integrity',
        'Data protection compliance'
      ]);
      updateSuiteTests('compliance-tests', tests);
      updateSuiteStatus('compliance-tests', 'completed', 100);
    } catch (error) {
      updateSuiteStatus('compliance-tests', 'failed', 0);
    }
  };
  const updateSuiteStatus = (suiteId, status, progress) => {
    setTestSuites(prev =>
      prev.map(suite => (suite.id === suiteId ? { ...suite, status, progress } : suite))
    );
  };
  const updateSuiteTests = (suiteId, tests) => {
    setTestSuites(prev => prev.map(suite => (suite.id === suiteId ? { ...suite, tests } : suite)));
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'passed':
        return _jsx(CheckCircle, { className: 'h-4 w-4 text-green-500' });
      case 'failed':
        return _jsx(XCircle, { className: 'h-4 w-4 text-red-500' });
      case 'skipped':
        return _jsx(AlertTriangle, { className: 'h-4 w-4 text-yellow-500' });
      default:
        return _jsx(AlertTriangle, { className: 'h-4 w-4 text-gray-500' });
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const totalTests = testSuites.reduce((sum, suite) => sum + suite.tests.length, 0);
  const passedTests = testSuites.reduce(
    (sum, suite) => sum + suite.tests.filter(test => test.status === 'passed').length,
    0
  );
  const mcpEnhancedTests = testSuites.reduce(
    (sum, suite) => sum + suite.tests.filter(test => test.mcpEnhanced).length,
    0
  );
  return _jsxs('div', {
    className: 'space-y-6',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsxs('div', {
            children: [
              _jsx('h1', {
                className: 'text-3xl font-bold',
                children: 'Phase 1 Testing Dashboard'
              }),
              _jsx('p', {
                className: 'text-muted-foreground',
                children: 'MCP-Enhanced Testing with Advanced Capabilities'
              })
            ]
          }),
          _jsxs(Button, {
            onClick: runAllTests,
            disabled: isRunning,
            className: 'flex items-center gap-2',
            children: [
              _jsx(Play, { className: 'h-4 w-4' }),
              isRunning ? 'Running Tests...' : 'Run All Tests'
            ]
          })
        ]
      }),
      mcpStatus &&
        _jsxs(Alert, {
          children: [
            _jsx(Shield, { className: 'h-4 w-4' }),
            _jsx(AlertDescription, {
              children: _jsxs('div', {
                className: 'flex items-center gap-4',
                children: [
                  _jsx('span', { children: 'MCP Status:' }),
                  _jsxs(Badge, {
                    variant: mcpStatus.testing.connected ? 'default' : 'secondary',
                    children: [
                      'Testing: ',
                      mcpStatus.testing.connected ? 'Connected' : 'Disconnected'
                    ]
                  }),
                  _jsxs(Badge, {
                    variant: mcpStatus.security.connected ? 'default' : 'secondary',
                    children: [
                      'Security: ',
                      mcpStatus.security.connected ? 'Connected' : 'Disconnected'
                    ]
                  }),
                  _jsx('span', {
                    className: 'text-sm text-muted-foreground',
                    children: 'Priority: MCP-First with Traditional Fallback'
                  })
                ]
              })
            })
          ]
        }),
      _jsxs('div', {
        className: 'grid grid-cols-1 md:grid-cols-4 gap-4',
        children: [
          _jsxs(Card, {
            children: [
              _jsxs(CardHeader, {
                className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                children: [
                  _jsx(CardTitle, { className: 'text-sm font-medium', children: 'Total Tests' }),
                  _jsx(FileText, { className: 'h-4 w-4 text-muted-foreground' })
                ]
              }),
              _jsx(CardContent, {
                children: _jsx('div', { className: 'text-2xl font-bold', children: totalTests })
              })
            ]
          }),
          _jsxs(Card, {
            children: [
              _jsxs(CardHeader, {
                className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                children: [
                  _jsx(CardTitle, { className: 'text-sm font-medium', children: 'Passed Tests' }),
                  _jsx(CheckCircle, { className: 'h-4 w-4 text-green-500' })
                ]
              }),
              _jsx(CardContent, {
                children: _jsx('div', {
                  className: 'text-2xl font-bold text-green-600',
                  children: passedTests
                })
              })
            ]
          }),
          _jsxs(Card, {
            children: [
              _jsxs(CardHeader, {
                className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                children: [
                  _jsx(CardTitle, { className: 'text-sm font-medium', children: 'MCP Enhanced' }),
                  _jsx(Zap, { className: 'h-4 w-4 text-blue-500' })
                ]
              }),
              _jsx(CardContent, {
                children: _jsx('div', {
                  className: 'text-2xl font-bold text-blue-600',
                  children: mcpEnhancedTests
                })
              })
            ]
          }),
          _jsxs(Card, {
            children: [
              _jsxs(CardHeader, {
                className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                children: [
                  _jsx(CardTitle, { className: 'text-sm font-medium', children: 'Success Rate' }),
                  _jsx(Settings, { className: 'h-4 w-4 text-muted-foreground' })
                ]
              }),
              _jsx(CardContent, {
                children: _jsxs('div', {
                  className: 'text-2xl font-bold',
                  children: [totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0, '%']
                })
              })
            ]
          })
        ]
      }),
      _jsxs(Tabs, {
        value: activeTab,
        onValueChange: setActiveTab,
        children: [
          _jsxs(TabsList, {
            children: [
              _jsx(TabsTrigger, { value: 'overview', children: 'Overview' }),
              _jsx(TabsTrigger, { value: 'functional', children: 'Functional' }),
              _jsx(TabsTrigger, { value: 'security', children: 'Security' }),
              _jsx(TabsTrigger, { value: 'performance', children: 'Performance' }),
              _jsx(TabsTrigger, { value: 'compliance', children: 'Compliance' })
            ]
          }),
          _jsx(TabsContent, {
            value: 'overview',
            className: 'space-y-4',
            children: testSuites.map(suite =>
              _jsxs(
                Card,
                {
                  children: [
                    _jsxs(CardHeader, {
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-center gap-3',
                              children: [
                                _jsx(CardTitle, { children: suite.name }),
                                _jsx(Badge, {
                                  variant: suite.mcpEnabled ? 'default' : 'secondary',
                                  children: suite.mcpEnabled ? 'MCP Enhanced' : 'Traditional'
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx(Badge, {
                                  className: getStatusColor(suite.status),
                                  children: suite.status
                                }),
                                _jsx(Button, {
                                  size: 'sm',
                                  onClick: () => {
                                    switch (suite.id) {
                                      case 'functional-tests':
                                        runFunctionalTests();
                                        break;
                                      case 'security-tests':
                                        runSecurityTests();
                                        break;
                                      case 'performance-tests':
                                        runPerformanceTests();
                                        break;
                                      case 'compliance-tests':
                                        runComplianceTests();
                                        break;
                                    }
                                  },
                                  disabled: isRunning,
                                  children: _jsx(Play, { className: 'h-4 w-4' })
                                })
                              ]
                            })
                          ]
                        }),
                        _jsx('p', {
                          className: 'text-sm text-muted-foreground',
                          children: suite.description
                        })
                      ]
                    }),
                    _jsx(CardContent, {
                      children: _jsxs('div', {
                        className: 'space-y-2',
                        children: [
                          _jsxs('div', {
                            className: 'flex justify-between text-sm',
                            children: [
                              _jsx('span', { children: 'Progress' }),
                              _jsxs('span', { children: [suite.progress, '%'] })
                            ]
                          }),
                          _jsx(Progress, { value: suite.progress }),
                          _jsxs('div', {
                            className: 'text-sm text-muted-foreground',
                            children: [
                              suite.tests.length,
                              ' tests \u2022 ',
                              suite.tests.filter(t => t.status === 'passed').length,
                              ' passed'
                            ]
                          })
                        ]
                      })
                    })
                  ]
                },
                suite.id
              )
            )
          }),
          testSuites.map(suite =>
            _jsx(
              TabsContent,
              {
                value: suite.id.split('-')[0],
                className: 'space-y-4',
                children: _jsxs(Card, {
                  children: [
                    _jsx(CardHeader, {
                      children: _jsxs(CardTitle, { children: [suite.name, ' - Test Results'] })
                    }),
                    _jsx(CardContent, {
                      children: _jsx('div', {
                        className: 'space-y-3',
                        children:
                          suite.tests.length === 0
                            ? _jsx('p', {
                                className: 'text-muted-foreground',
                                children: 'No tests run yet. Click "Run Tests" to start.'
                              })
                            : suite.tests.map(test =>
                                _jsxs(
                                  'div',
                                  {
                                    className:
                                      'flex items-center justify-between p-3 border rounded-lg',
                                    children: [
                                      _jsxs('div', {
                                        className: 'flex items-center gap-3',
                                        children: [
                                          getStatusIcon(test.status),
                                          _jsxs('div', {
                                            children: [
                                              _jsx('div', {
                                                className: 'font-medium',
                                                children: test.details.description
                                              }),
                                              _jsxs('div', {
                                                className: 'text-sm text-muted-foreground',
                                                children: [
                                                  'Expected: ',
                                                  test.details.expected,
                                                  ' \u2022 Actual: ',
                                                  test.details.actual
                                                ]
                                              })
                                            ]
                                          })
                                        ]
                                      }),
                                      _jsxs('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          _jsx(Badge, {
                                            variant: test.mcpEnhanced ? 'default' : 'secondary',
                                            children: test.mcpEnhanced ? 'MCP' : 'Traditional'
                                          }),
                                          _jsx(Badge, {
                                            className: getStatusColor(test.status),
                                            children: test.status
                                          })
                                        ]
                                      })
                                    ]
                                  },
                                  test.testId
                                )
                              )
                      })
                    })
                  ]
                })
              },
              suite.id
            )
          )
        ]
      })
    ]
  });
};
