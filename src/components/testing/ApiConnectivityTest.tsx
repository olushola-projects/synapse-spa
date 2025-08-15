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

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  data?: any;
  duration?: number;
}

export function ApiConnectivityTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const updateResult = (
    name: string,
    status: TestResult['status'],
    message: string,
    data?: any,
    duration?: number
  ) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name);
      const newResult = { name, status, message, data, duration };

      if (existing) {
        return prev.map(r => (r.name === name ? newResult : r));
      }
      return [...prev, newResult];
    });
  };

  const runTest = async (name: string, testFn: () => Promise<any>) => {
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

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className='h-4 w-4 animate-spin' />;
      case 'success':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'error':
        return <XCircle className='h-4 w-4 text-red-500' />;
      case 'warning':
        return <AlertTriangle className='h-4 w-4 text-yellow-500' />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
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

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Backend API Connectivity Test
          {results.length > 0 && (
            <Badge variant={errorCount === 0 ? 'default' : 'destructive'}>
              {successCount}/{totalTests} Passed
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Test connection to api.joinsynapses.com and verify LLM integration
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          <Button onClick={runAllTests} disabled={isRunning} className='flex items-center gap-2'>
            {isRunning && <Loader2 className='h-4 w-4 animate-spin' />}
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className='space-y-3'>
            {results.map((result, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    {getStatusIcon(result.status)}
                    <span className='font-medium'>{result.name}</span>
                    {result.duration && (
                      <span className='text-xs opacity-70'>({result.duration}ms)</span>
                    )}
                  </div>
                </div>
                <div className='mt-1 text-sm opacity-80'>{result.message}</div>
                {result.data && (
                  <details className='mt-2'>
                    <summary className='text-xs cursor-pointer opacity-70 hover:opacity-100'>
                      View response data
                    </summary>
                    <pre className='mt-1 text-xs bg-black/10 p-2 rounded overflow-auto max-h-32'>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {errorCount > 0 && (
          <Alert>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              <strong>Backend Connectivity Issues Detected:</strong>
              <br />
              {errorCount} out of {totalTests} tests failed. This indicates:
              <ul className='mt-2 ml-4 list-disc text-sm'>
                <li>External API (api.joinsynapses.com) may be unreachable</li>
                <li>Authentication or configuration issues</li>
                <li>LLM integration problems</li>
                <li>Network connectivity issues</li>
              </ul>
              <div className='mt-2'>
                <strong>Recommended Actions:</strong>
                <br />
                1. Verify api.joinsynapses.com is accessible
                <br />
                2. Check API authentication configuration
                <br />
                3. Test with different LLM strategies
                <br />
                4. Review network and CORS settings
              </div>
            </AlertDescription>
          </Alert>
        )}

        {results.length > 0 && errorCount === 0 && (
          <Alert>
            <CheckCircle className='h-4 w-4' />
            <AlertDescription>
              <strong>All Tests Passed!</strong>
              <br />
              Backend API connectivity is working properly. Both LLMs are responding correctly.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
