import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
/**
 * API Connectivity Test Component
 * Tests connection to external API and verifies LLM integration
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { backendApiClient } from '@/services/backendApiClient';
export function ApiConnectivityTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const updateResult = (name, status, message, data, duration) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name);
      const newResult = { name, status, message, data, duration };
      if (existing) {
        return prev.map(r => (r.name === name ? newResult : r));
      }
      return [...prev, newResult];
    });
  };
  const runTest = async (name, testFn) => {
    const startTime = Date.now();
    updateResult(name, 'pending', 'Running...');
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      updateResult(name, 'success', 'Success', result, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      updateResult(
        name,
        'error',
        error instanceof Error ? error.message : 'Unknown error',
        null,
        duration
      );
      throw error;
    }
  };
  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    try {
      // Test 1: Health Check
      await runTest('Health Check', async () => {
        const response = await backendApiClient.healthCheck();
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      });
      // Test 2: Metrics Check
      await runTest('Metrics Check', async () => {
        const response = await backendApiClient.getMetrics();
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      });
      // Test 3: Primary LLM Classification
      await runTest('Primary LLM Test', async () => {
        const response = await backendApiClient.classifyDocument({
          text: 'This fund promotes environmental sustainability and invests in renewable energy companies.',
          document_type: 'SFDR_Fund_Profile',
          strategy: 'primary'
        });
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      });
      // Test 4: Secondary LLM Classification
      await runTest('Secondary LLM Test', async () => {
        const response = await backendApiClient.classifyDocument({
          text: 'This fund promotes environmental sustainability and invests in renewable energy companies.',
          document_type: 'SFDR_Fund_Profile',
          strategy: 'secondary'
        });
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      });
      // Test 5: Hybrid LLM Classification
      await runTest('Hybrid LLM Test', async () => {
        const response = await backendApiClient.classifyDocument({
          text: 'This fund promotes environmental sustainability and invests in renewable energy companies.',
          document_type: 'SFDR_Fund_Profile',
          strategy: 'hybrid'
        });
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      });
      // Test 6: SFDR Product Classification
      await runTest('SFDR Product Classification', async () => {
        const response = await backendApiClient.classifyProduct({
          fundProfile: {
            fundName: 'Test Sustainable Fund',
            investmentObjective:
              'To promote environmental sustainability through renewable energy investments',
            targetArticleClassification: 'Article8',
            sustainabilityCharacteristics: ['Environmental', 'Carbon reduction']
          },
          aiStrategy: 'hybrid'
        });
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      });
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunning(false);
    }
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'pending':
        return _jsx(Loader2, { className: 'h-4 w-4 animate-spin' });
      case 'success':
        return _jsx(CheckCircle, { className: 'h-4 w-4 text-green-500' });
      case 'error':
        return _jsx(XCircle, { className: 'h-4 w-4 text-red-500' });
      case 'warning':
        return _jsx(AlertTriangle, { className: 'h-4 w-4 text-yellow-500' });
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalTests = 6;
  return _jsxs(Card, {
    className: 'w-full max-w-4xl mx-auto',
    children: [
      _jsxs(CardHeader, {
        children: [
          _jsxs(CardTitle, {
            className: 'flex items-center gap-2',
            children: [
              'Backend API Connectivity Test',
              results.length > 0 &&
                _jsxs(Badge, {
                  variant: errorCount === 0 ? 'default' : 'destructive',
                  children: [successCount, '/', totalTests, ' Passed']
                })
            ]
          }),
          _jsx(CardDescription, {
            children: 'Test connection to api.joinsynapses.com and verify LLM integration'
          })
        ]
      }),
      _jsxs(CardContent, {
        className: 'space-y-4',
        children: [
          _jsx('div', {
            className: 'flex gap-2',
            children: _jsxs(Button, {
              onClick: runAllTests,
              disabled: isRunning,
              className: 'flex items-center gap-2',
              children: [
                isRunning && _jsx(Loader2, { className: 'h-4 w-4 animate-spin' }),
                isRunning ? 'Running Tests...' : 'Run All Tests'
              ]
            })
          }),
          results.length > 0 &&
            _jsx('div', {
              className: 'space-y-3',
              children: results.map((result, index) =>
                _jsxs(
                  'div',
                  {
                    className: `p-3 rounded-lg border ${getStatusColor(result.status)}`,
                    children: [
                      _jsx('div', {
                        className: 'flex items-center justify-between',
                        children: _jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            getStatusIcon(result.status),
                            _jsx('span', { className: 'font-medium', children: result.name }),
                            result.duration &&
                              _jsxs('span', {
                                className: 'text-xs opacity-70',
                                children: ['(', result.duration, 'ms)']
                              })
                          ]
                        })
                      }),
                      _jsx('div', {
                        className: 'mt-1 text-sm opacity-80',
                        children: result.message
                      }),
                      result.data &&
                        _jsxs('details', {
                          className: 'mt-2',
                          children: [
                            _jsx('summary', {
                              className: 'text-xs cursor-pointer opacity-70 hover:opacity-100',
                              children: 'View response data'
                            }),
                            _jsx('pre', {
                              className:
                                'mt-1 text-xs bg-black/10 p-2 rounded overflow-auto max-h-32',
                              children: JSON.stringify(result.data, null, 2)
                            })
                          ]
                        })
                    ]
                  },
                  index
                )
              )
            }),
          errorCount > 0 &&
            _jsxs(Alert, {
              children: [
                _jsx(AlertTriangle, { className: 'h-4 w-4' }),
                _jsxs(AlertDescription, {
                  children: [
                    _jsx('strong', { children: 'Backend Connectivity Issues Detected:' }),
                    _jsx('br', {}),
                    errorCount,
                    ' out of ',
                    totalTests,
                    ' tests failed. This indicates:',
                    _jsxs('ul', {
                      className: 'mt-2 ml-4 list-disc text-sm',
                      children: [
                        _jsx('li', {
                          children: 'External API (api.joinsynapses.com) may be unreachable'
                        }),
                        _jsx('li', { children: 'Authentication or configuration issues' }),
                        _jsx('li', { children: 'LLM integration problems' }),
                        _jsx('li', { children: 'Network connectivity issues' })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'mt-2',
                      children: [
                        _jsx('strong', { children: 'Recommended Actions:' }),
                        _jsx('br', {}),
                        '1. Verify api.joinsynapses.com is accessible',
                        _jsx('br', {}),
                        '2. Check API authentication configuration',
                        _jsx('br', {}),
                        '3. Test with different LLM strategies',
                        _jsx('br', {}),
                        '4. Review network and CORS settings'
                      ]
                    })
                  ]
                })
              ]
            }),
          results.length > 0 &&
            errorCount === 0 &&
            _jsxs(Alert, {
              children: [
                _jsx(CheckCircle, { className: 'h-4 w-4' }),
                _jsxs(AlertDescription, {
                  children: [
                    _jsx('strong', { children: 'All Tests Passed!' }),
                    _jsx('br', {}),
                    'Backend API connectivity is working properly. Both LLMs are responding correctly.'
                  ]
                })
              ]
            })
        ]
      })
    ]
  });
}
