import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
/**
 * Authentication Test Component
 * Tests the secure authentication flow and edge function proxy
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { apiClient } from '@/services/supabaseApiClient';
import { backendApiClient } from '@/services/backendApiClient';
export function AuthenticationTest() {
  const [tests, setTests] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const updateTest = (name, status, message, details, duration) => {
    setTests(prev => {
      const index = prev.findIndex(t => t.name === name);
      const newTest = { name, status, message, details, duration };
      if (index >= 0) {
        return [...prev.slice(0, index), newTest, ...prev.slice(index + 1)];
      }
      return [...prev, newTest];
    });
  };
  const runTests = async () => {
    setIsRunning(true);
    setTests([]);
    // Test 1: Edge Function Health Check
    const startHealthCheck = Date.now();
    updateTest('Edge Function Health', 'pending', 'Testing nexus-proxy health...');
    try {
      const healthResult = await apiClient.healthCheck();
      const duration = Date.now() - startHealthCheck;
      if (healthResult.error) {
        updateTest(
          'Edge Function Health',
          'error',
          `Health check failed: ${healthResult.error}`,
          healthResult,
          duration
        );
      } else {
        updateTest(
          'Edge Function Health',
          'success',
          'Edge function proxy is healthy',
          healthResult.data,
          duration
        );
      }
    } catch (error) {
      const duration = Date.now() - startHealthCheck;
      updateTest(
        'Edge Function Health',
        'error',
        `Health check exception: ${error}`,
        error,
        duration
      );
    }
    // Test 2: API Connectivity through Proxy
    const startApiTest = Date.now();
    updateTest('API Connectivity', 'pending', 'Testing API connectivity through proxy...');
    try {
      const apiResult = await backendApiClient.healthCheck();
      const duration = Date.now() - startApiTest;
      if (apiResult.error) {
        updateTest(
          'API Connectivity',
          'error',
          `API test failed: ${apiResult.error}`,
          apiResult,
          duration
        );
      } else {
        updateTest(
          'API Connectivity',
          'success',
          'API connectivity successful',
          apiResult.data,
          duration
        );
      }
    } catch (error) {
      const duration = Date.now() - startApiTest;
      updateTest('API Connectivity', 'error', `API test exception: ${error}`, error, duration);
    }
    // Test 3: Classification Endpoint
    const startClassification = Date.now();
    updateTest('Classification Test', 'pending', 'Testing classification endpoint...');
    try {
      const classificationResult = await backendApiClient.classifyDocument({
        text: 'This fund promotes environmental characteristics by investing in renewable energy companies.',
        document_type: 'SFDR_Fund_Profile',
        strategy: 'primary'
      });
      const duration = Date.now() - startClassification;
      if (classificationResult.error) {
        updateTest(
          'Classification Test',
          'error',
          `Classification failed: ${classificationResult.error}`,
          classificationResult,
          duration
        );
      } else {
        updateTest(
          'Classification Test',
          'success',
          `Classification successful: ${classificationResult.data?.classification}`,
          classificationResult.data,
          duration
        );
      }
    } catch (error) {
      const duration = Date.now() - startClassification;
      updateTest(
        'Classification Test',
        'error',
        `Classification exception: ${error}`,
        error,
        duration
      );
    }
    // Test 4: Authentication Token Test
    const startAuthTest = Date.now();
    updateTest('Authentication Flow', 'pending', 'Testing authentication token handling...');
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const session = await supabase.auth.getSession();
      const duration = Date.now() - startAuthTest;
      if (session.data.session) {
        updateTest(
          'Authentication Flow',
          'success',
          'User authenticated with valid session',
          {
            userId: session.data.session.user.id,
            tokenExpiry: new Date(session.data.session.expires_at * 1000).toISOString()
          },
          duration
        );
      } else {
        updateTest('Authentication Flow', 'error', 'No active session found', session, duration);
      }
    } catch (error) {
      const duration = Date.now() - startAuthTest;
      updateTest('Authentication Flow', 'error', `Auth test exception: ${error}`, error, duration);
    }
    setIsRunning(false);
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return _jsx(CheckCircle, { className: 'h-4 w-4 text-green-500' });
      case 'error':
        return _jsx(XCircle, { className: 'h-4 w-4 text-red-500' });
      case 'pending':
        return _jsx(Clock, { className: 'h-4 w-4 text-yellow-500 animate-spin' });
    }
  };
  const getStatusBadge = status => {
    switch (status) {
      case 'success':
        return _jsx(Badge, {
          variant: 'default',
          className: 'bg-green-100 text-green-800',
          children: 'Passed'
        });
      case 'error':
        return _jsx(Badge, { variant: 'destructive', children: 'Failed' });
      case 'pending':
        return _jsx(Badge, { variant: 'secondary', children: 'Running' });
    }
  };
  return _jsxs(Card, {
    className: 'w-full max-w-4xl mx-auto',
    children: [
      _jsxs(CardHeader, {
        children: [
          _jsxs(CardTitle, {
            className: 'flex items-center gap-2',
            children: [
              _jsx(Shield, { className: 'h-5 w-5' }),
              'Authentication & Security Test Suite'
            ]
          }),
          _jsx(CardDescription, {
            children:
              'Comprehensive testing of authentication flow, edge function proxy, and API connectivity'
          })
        ]
      }),
      _jsxs(CardContent, {
        className: 'space-y-4',
        children: [
          _jsx(Alert, {
            children: _jsx(AlertDescription, {
              children:
                '\uD83D\uDD10 This test suite verifies that the security remediation plan is working correctly. All API calls go through the secure edge function proxy with proper authentication.'
            })
          }),
          _jsx(Button, {
            onClick: runTests,
            disabled: isRunning,
            className: 'w-full',
            children: isRunning ? 'Running Tests...' : 'Run Authentication Tests'
          }),
          tests.length > 0 &&
            _jsxs('div', {
              className: 'space-y-3',
              children: [
                _jsx('h3', { className: 'text-lg font-semibold', children: 'Test Results' }),
                tests.map((test, index) =>
                  _jsxs(
                    Card,
                    {
                      className: 'p-4',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center justify-between mb-2',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-center gap-2',
                              children: [
                                getStatusIcon(test.status),
                                _jsx('span', { className: 'font-medium', children: test.name })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex items-center gap-2',
                              children: [
                                test.duration &&
                                  _jsxs('span', {
                                    className: 'text-sm text-muted-foreground',
                                    children: [test.duration, 'ms']
                                  }),
                                getStatusBadge(test.status)
                              ]
                            })
                          ]
                        }),
                        _jsx('p', {
                          className: 'text-sm text-muted-foreground mb-2',
                          children: test.message
                        }),
                        test.details &&
                          _jsxs('details', {
                            className: 'text-xs',
                            children: [
                              _jsx('summary', {
                                className:
                                  'cursor-pointer text-muted-foreground hover:text-foreground',
                                children: 'View Details'
                              }),
                              _jsx('pre', {
                                className: 'mt-2 p-2 bg-muted rounded overflow-auto',
                                children: JSON.stringify(test.details, null, 2)
                              })
                            ]
                          })
                      ]
                    },
                    index
                  )
                )
              ]
            }),
          tests.length > 0 &&
            !isRunning &&
            _jsx(Alert, {
              children: _jsx(AlertDescription, {
                children: tests.every(t => t.status === 'success')
                  ? '✅ All tests passed! The authentication and security system is working correctly.'
                  : `⚠️ ${tests.filter(t => t.status === 'error').length} test(s) failed. Check the details above for troubleshooting.`
              })
            })
        ]
      })
    ]
  });
}
