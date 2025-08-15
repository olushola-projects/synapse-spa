import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, AlertTriangle, Zap, Brain, Settings } from 'lucide-react';
import type { ClassificationRequest } from '@/services/backendApiClient';
import { backendApiClient } from '@/services/backendApiClient';
import { motion } from 'framer-motion';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  data?: any;
  duration?: number;
  apiKey?: boolean;
  strategy?: string;
}

export const EnhancedApiConnectivityTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const updateResult = (name: string, update: Partial<TestResult>) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name);
      if (existing) {
        return prev.map(r => (r.name === name ? { ...r, ...update } : r));
      }
      return [...prev, { name, status: 'pending', message: '', ...update }];
    });
  };

  const runTest = async (
    name: string,
    testFn: () => Promise<any>,
    strategy?: string
  ): Promise<void> => {
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
    const testDocument: ClassificationRequest = {
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

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className='h-4 w-4 text-success' />;
      case 'error':
        return <XCircle className='h-4 w-4 text-destructive' />;
      case 'warning':
        return <AlertTriangle className='h-4 w-4 text-warning' />;
      case 'pending':
        return <Clock className='h-4 w-4 text-muted-foreground animate-spin' />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
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

  const getStrategyIcon = (strategy?: string) => {
    switch (strategy) {
      case 'primary':
        return <Zap className='h-3 w-3' />;
      case 'secondary':
        return <Brain className='h-3 w-3' />;
      case 'hybrid':
        return <Settings className='h-3 w-3' />;
      default:
        return null;
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const authErrors = results.filter(r => r.apiKey).length;

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Settings className='h-5 w-5' />
          Enhanced Backend Connectivity & LLM Integration Test
        </CardTitle>
        <CardDescription>
          Comprehensive testing of external API connectivity, authentication, and LLM strategy
          validation
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex flex-wrap gap-2'>
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className='bg-primary hover:bg-primary/90'
          >
            {isRunning ? 'Running Tests...' : 'Run Full Test Suite'}
          </Button>
          {results.length > 0 && (
            <div className='flex gap-2'>
              <Badge variant='outline' className='text-success border-success'>
                ✓ {successCount} Passed
              </Badge>
              {errorCount > 0 && (
                <Badge variant='outline' className='text-destructive border-destructive'>
                  ✗ {errorCount} Failed
                </Badge>
              )}
              {warningCount > 0 && (
                <Badge variant='outline' className='text-warning border-warning'>
                  ⚠ {warningCount} Warnings
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Critical Issues Alert */}
        {authErrors > 0 && (
          <Alert className='border-destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              <strong>Authentication Issue Detected:</strong> {authErrors} test(s) failed due to
              missing or invalid API credentials. Please configure the NEXUS_API_KEY in Supabase
              secrets.
            </AlertDescription>
          </Alert>
        )}

        {/* Test Results */}
        <div className='space-y-3'>
          {results.map((result, index) => (
            <motion.div
              key={result.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  {getStatusIcon(result.status)}
                  <span className='font-medium'>{result.name}</span>
                  {result.strategy && (
                    <Badge variant='secondary' className='flex items-center gap-1'>
                      {getStrategyIcon(result.strategy)}
                      {result.strategy}
                    </Badge>
                  )}
                  {result.duration && (
                    <Badge variant='outline' className='text-xs'>
                      {result.duration}ms
                    </Badge>
                  )}
                </div>
              </div>

              <p className='text-sm text-muted-foreground mb-2'>{result.message}</p>

              {result.apiKey && (
                <Alert className='mt-2'>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertDescription className='text-xs'>
                    This failure appears to be authentication-related. Configure NEXUS_API_KEY in
                    Supabase secrets.
                  </AlertDescription>
                </Alert>
              )}

              {result.data && result.status === 'success' && (
                <details className='mt-2'>
                  <summary className='text-xs cursor-pointer text-primary hover:underline'>
                    View Response Data
                  </summary>
                  <pre className='text-xs bg-muted p-2 rounded mt-1 overflow-auto'>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </motion.div>
          ))}
        </div>

        {/* Overall Status */}
        {results.length > 0 && !isRunning && (
          <Alert className={errorCount > 0 ? 'border-destructive' : 'border-success'}>
            <div className='flex items-center gap-2'>
              {errorCount > 0 ? (
                <XCircle className='h-4 w-4 text-destructive' />
              ) : (
                <CheckCircle className='h-4 w-4 text-success' />
              )}
              <AlertDescription>
                {errorCount > 0 ? (
                  <div>
                    <strong>Backend Issues Detected:</strong> {errorCount} out of {results.length}{' '}
                    tests failed.
                    <br />
                    <strong>Next Steps:</strong>
                    <ul className='mt-1 ml-4 list-disc text-xs'>
                      <li>Verify external API status at https://api.joinsynapses.com</li>
                      <li>Configure NEXUS_API_KEY in Supabase secrets</li>
                      <li>Check network connectivity and firewall settings</li>
                      <li>Review API rate limits and quotas</li>
                    </ul>
                  </div>
                ) : (
                  <span>
                    <strong>All Systems Operational:</strong> Backend connectivity and LLM
                    integration are working correctly.
                  </span>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
