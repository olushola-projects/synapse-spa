import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, AlertTriangle, Zap, Brain, Settings } from 'lucide-react';
import { backendApiClient } from '@/services/backendApiClient';
import { motion } from 'framer-motion';
export const EnhancedApiConnectivityTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const updateResult = (name, update) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name);
      if (existing) {
        return prev.map(r => (r.name === name ? { ...r, ...update } : r));
      }
      return [...prev, { name, status: 'pending', message: '', ...update }];
    });
  };
  const runTest = async (name, testFn, strategy) => {
    const startTime = Date.now();
    updateResult(name, { status: 'pending', message: 'Running...', strategy });
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      if (result.error) {
        updateResult(name, {
          status: 'error',
          message: `Failed: ${result.error}`,
          data: result,
          duration,
          apiKey: result.status === 401 || result.status === 403
        });
      } else {
        updateResult(name, {
          status: 'success',
          message: `Success (${duration}ms)`,
          data: result.data,
          duration
        });
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      updateResult(name, {
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration
      });
    }
  };
  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    // 1. Basic Connectivity Test
    await runTest('Backend Health Check', async () => {
      return await backendApiClient.healthCheck();
    });
    // 2. API Metrics Test
    await runTest('API Metrics', async () => {
      return await backendApiClient.getMetrics();
    });
    // 3. LLM Strategy Tests
    const testDocument = {
      text: `
        Fund Name: ESG Global Equity Fund
        Investment Objective: To achieve long-term capital growth by investing in companies with strong ESG practices
        Target Article Classification: Article 8
        Sustainability Characteristics: Environmental focus, Social responsibility, Governance standards
        PAI Consideration: The fund considers principal adverse impacts on sustainability factors
        EU Taxonomy Alignment: 35%
      `,
      document_type: 'SFDR_Fund_Profile'
    };
    // Test Primary LLM Strategy
    await runTest(
      'Primary LLM Strategy',
      async () => {
        return await backendApiClient.classifyDocument({
          ...testDocument,
          strategy: 'primary',
          model: 'gpt-4'
        });
      },
      'primary'
    );
    // Test Secondary LLM Strategy
    await runTest(
      'Secondary LLM Strategy',
      async () => {
        return await backendApiClient.classifyDocument({
          ...testDocument,
          strategy: 'secondary',
          model: 'claude-3'
        });
      },
      'secondary'
    );
    // Test Hybrid LLM Strategy
    await runTest(
      'Hybrid LLM Strategy',
      async () => {
        return await backendApiClient.classifyDocument({
          ...testDocument,
          strategy: 'hybrid'
        });
      },
      'hybrid'
    );
    // 4. Document Upload Test
    await runTest('Document Upload', async () => {
      const mockFile = new File(['Test SFDR document content'], 'test-sfdr.txt', {
        type: 'text/plain'
      });
      return await backendApiClient.uploadDocument(mockFile);
    });
    // 5. Legacy Compatibility Test
    await runTest('Legacy SFDR Classification', async () => {
      const legacyData = {
        fundProfile: {
          fundName: 'Test ESG Fund',
          investmentObjective: 'ESG-focused investment strategy',
          targetArticleClassification: 'Article 8',
          sustainabilityCharacteristics: ['Environmental', 'Social']
        },
        paiIndicators: {
          considerationStatement: 'PAI factors are considered in investment decisions',
          mandatoryIndicators: ['GHG Emissions', 'Water Usage']
        },
        taxonomyAlignment: {
          alignmentPercentage: '25'
        },
        aiStrategy: 'primary'
      };
      return await backendApiClient.classifyProduct(legacyData);
    });
    setIsRunning(false);
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return _jsx(CheckCircle, { className: 'h-4 w-4 text-success' });
      case 'error':
        return _jsx(XCircle, { className: 'h-4 w-4 text-destructive' });
      case 'warning':
        return _jsx(AlertTriangle, { className: 'h-4 w-4 text-warning' });
      case 'pending':
        return _jsx(Clock, { className: 'h-4 w-4 text-muted-foreground animate-spin' });
      default:
        return null;
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'success':
        return 'border-success';
      case 'error':
        return 'border-destructive';
      case 'warning':
        return 'border-warning';
      case 'pending':
        return 'border-primary';
      default:
        return 'border-muted';
    }
  };
  const getStrategyIcon = strategy => {
    switch (strategy) {
      case 'primary':
        return _jsx(Zap, { className: 'h-3 w-3' });
      case 'secondary':
        return _jsx(Brain, { className: 'h-3 w-3' });
      case 'hybrid':
        return _jsx(Settings, { className: 'h-3 w-3' });
      default:
        return null;
    }
  };
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const authErrors = results.filter(r => r.apiKey).length;
  return _jsxs(Card, {
    className: 'w-full',
    children: [
      _jsxs(CardHeader, {
        children: [
          _jsxs(CardTitle, {
            className: 'flex items-center gap-2',
            children: [
              _jsx(Settings, { className: 'h-5 w-5' }),
              'Enhanced Backend Connectivity & LLM Integration Test'
            ]
          }),
          _jsx(CardDescription, {
            children:
              'Comprehensive testing of external API connectivity, authentication, and LLM strategy validation'
          })
        ]
      }),
      _jsxs(CardContent, {
        className: 'space-y-6',
        children: [
          _jsxs('div', {
            className: 'flex flex-wrap gap-2',
            children: [
              _jsx(Button, {
                onClick: runAllTests,
                disabled: isRunning,
                className: 'bg-primary hover:bg-primary/90',
                children: isRunning ? 'Running Tests...' : 'Run Full Test Suite'
              }),
              results.length > 0 &&
                _jsxs('div', {
                  className: 'flex gap-2',
                  children: [
                    _jsxs(Badge, {
                      variant: 'outline',
                      className: 'text-success border-success',
                      children: ['\u2713 ', successCount, ' Passed']
                    }),
                    errorCount > 0 &&
                      _jsxs(Badge, {
                        variant: 'outline',
                        className: 'text-destructive border-destructive',
                        children: ['\u2717 ', errorCount, ' Failed']
                      }),
                    warningCount > 0 &&
                      _jsxs(Badge, {
                        variant: 'outline',
                        className: 'text-warning border-warning',
                        children: ['\u26A0 ', warningCount, ' Warnings']
                      })
                  ]
                })
            ]
          }),
          authErrors > 0 &&
            _jsxs(Alert, {
              className: 'border-destructive',
              children: [
                _jsx(AlertTriangle, { className: 'h-4 w-4' }),
                _jsxs(AlertDescription, {
                  children: [
                    _jsx('strong', { children: 'Authentication Issue Detected:' }),
                    ' ',
                    authErrors,
                    ' test(s) failed due to missing or invalid API credentials. Please configure the NEXUS_API_KEY in Supabase secrets.'
                  ]
                })
              ]
            }),
          _jsx('div', {
            className: 'space-y-3',
            children: results.map((result, index) =>
              _jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: index * 0.1 },
                  className: `border rounded-lg p-4 ${getStatusColor(result.status)}`,
                  children: [
                    _jsx('div', {
                      className: 'flex items-center justify-between mb-2',
                      children: _jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          getStatusIcon(result.status),
                          _jsx('span', { className: 'font-medium', children: result.name }),
                          result.strategy &&
                            _jsxs(Badge, {
                              variant: 'secondary',
                              className: 'flex items-center gap-1',
                              children: [getStrategyIcon(result.strategy), result.strategy]
                            }),
                          result.duration &&
                            _jsxs(Badge, {
                              variant: 'outline',
                              className: 'text-xs',
                              children: [result.duration, 'ms']
                            })
                        ]
                      })
                    }),
                    _jsx('p', {
                      className: 'text-sm text-muted-foreground mb-2',
                      children: result.message
                    }),
                    result.apiKey &&
                      _jsxs(Alert, {
                        className: 'mt-2',
                        children: [
                          _jsx(AlertTriangle, { className: 'h-4 w-4' }),
                          _jsx(AlertDescription, {
                            className: 'text-xs',
                            children:
                              'This failure appears to be authentication-related. Configure NEXUS_API_KEY in Supabase secrets.'
                          })
                        ]
                      }),
                    result.data &&
                      result.status === 'success' &&
                      _jsxs('details', {
                        className: 'mt-2',
                        children: [
                          _jsx('summary', {
                            className: 'text-xs cursor-pointer text-primary hover:underline',
                            children: 'View Response Data'
                          }),
                          _jsx('pre', {
                            className: 'text-xs bg-muted p-2 rounded mt-1 overflow-auto',
                            children: JSON.stringify(result.data, null, 2)
                          })
                        ]
                      })
                  ]
                },
                result.name
              )
            )
          }),
          results.length > 0 &&
            !isRunning &&
            _jsx(Alert, {
              className: errorCount > 0 ? 'border-destructive' : 'border-success',
              children: _jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  errorCount > 0
                    ? _jsx(XCircle, { className: 'h-4 w-4 text-destructive' })
                    : _jsx(CheckCircle, { className: 'h-4 w-4 text-success' }),
                  _jsx(AlertDescription, {
                    children:
                      errorCount > 0
                        ? _jsxs('div', {
                            children: [
                              _jsx('strong', { children: 'Backend Issues Detected:' }),
                              ' ',
                              errorCount,
                              ' out of ',
                              results.length,
                              ' ',
                              'tests failed.',
                              _jsx('br', {}),
                              _jsx('strong', { children: 'Next Steps:' }),
                              _jsxs('ul', {
                                className: 'mt-1 ml-4 list-disc text-xs',
                                children: [
                                  _jsx('li', {
                                    children:
                                      'Verify external API status at https://api.joinsynapses.com'
                                  }),
                                  _jsx('li', {
                                    children: 'Configure NEXUS_API_KEY in Supabase secrets'
                                  }),
                                  _jsx('li', {
                                    children: 'Check network connectivity and firewall settings'
                                  }),
                                  _jsx('li', { children: 'Review API rate limits and quotas' })
                                ]
                              })
                            ]
                          })
                        : _jsxs('span', {
                            children: [
                              _jsx('strong', { children: 'All Systems Operational:' }),
                              ' Backend connectivity and LLM integration are working correctly.'
                            ]
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
