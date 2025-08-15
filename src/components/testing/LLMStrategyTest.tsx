/**
 * LLM Strategy Test Component
 * Comprehensive testing interface for Qwen3_235B_A22B and OpenAI gpt-oss-20b models
 * Verifies all LLM strategies work correctly
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Bot,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Brain,
  Cpu,
  Network,
  Settings,
  RefreshCw,
  Play,
  StopCircle
} from 'lucide-react';

import { llmConfigurationService } from '@/services/llmConfigurationService';
import { llmIntegrationService } from '@/services/llmIntegrationService';
import { llmValidationService } from '@/services/llmValidationService';

interface TestResult {
  id: string;
  strategy: string;
  model: string;
  provider: string;
  success: boolean;
  responseTime: number;
  confidence?: number;
  classification?: string;
  error?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface StrategyStatus {
  strategy: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  results: TestResult[];
}

export const LLMStrategyTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [strategyStatuses, setStrategyStatuses] = useState<StrategyStatus[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [configurationSummary, setConfigurationSummary] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfiguration();
    loadHealthStatus();
  }, []);

  const loadConfiguration = () => {
    try {
      const summary = llmConfigurationService.getConfigurationSummary();
      setConfigurationSummary(summary);
    } catch (err) {
      setError('Failed to load configuration');
    }
  };

  const loadHealthStatus = () => {
    try {
      const status = llmIntegrationService.getHealthStatus();
      setHealthStatus(status);
    } catch (err) {
      setError('Failed to load health status');
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setError(null);
    setTestResults([]);
    setOverallProgress(0);

    try {
      // Initialize strategy statuses
      const strategies = llmConfigurationService.getStrategies();
      const initialStatuses: StrategyStatus[] = strategies.map(strategy => ({
        strategy: strategy.name,
        status: 'pending',
        progress: 0,
        results: []
      }));
      setStrategyStatuses(initialStatuses);

      // Test each strategy
      for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];

        // Update status to running
        setStrategyStatuses(prev =>
          prev.map((s, idx) => (idx === i ? { ...s, status: 'running', progress: 0 } : s))
        );

        const strategyResults = await testStrategy(strategy);

        // Update status to completed
        setStrategyStatuses(prev =>
          prev.map((s, idx) =>
            idx === i
              ? {
                  ...s,
                  status: strategyResults.every(r => r.success) ? 'completed' : 'failed',
                  progress: 100,
                  results: strategyResults
                }
              : s
          )
        );

        // Add results to overall results
        setTestResults(prev => [...prev, ...strategyResults]);

        // Update overall progress
        const progress = ((i + 1) / strategies.length) * 100;
        setOverallProgress(progress);
      }

      // Update health status after tests
      loadHealthStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const testStrategy = async (strategy: any): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    const models = strategy.models.filter((m: any) => m.enabled);

    for (const model of models) {
      try {
        const startTime = Date.now();

        const response = await llmIntegrationService.classifyDocument({
          text: getTestDocument(),
          document_type: 'strategy_test',
          strategy: strategy.id,
          model: model.model,
          provider: model.provider,
          useConsensus: strategy.type === 'hybrid'
        });

        const responseTime = Date.now() - startTime;

        const result: TestResult = {
          id: `${strategy.id}-${model.id}-${Date.now()}`,
          strategy: strategy.name,
          model: model.name,
          provider: model.provider,
          success: response.success,
          responseTime,
          confidence: response.confidence,
          classification: response.classification,
          error: response.error,
          timestamp: new Date().toISOString(),
          metadata: response.metadata
        };

        results.push(result);
      } catch (err) {
        const result: TestResult = {
          id: `${strategy.id}-${model.id}-${Date.now()}`,
          strategy: strategy.name,
          model: model.name,
          provider: model.provider,
          success: false,
          responseTime: 0,
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString()
        };
        results.push(result);
      }
    }

    return results;
  };

  const getTestDocument = (): string => {
    return `Fund Name: Sustainable Growth Equity Fund
Investment Objective: To achieve long-term capital growth by investing in companies that demonstrate strong environmental, social, and governance (ESG) practices while contributing to sustainable development goals.
Target Article Classification: Article 8
Sustainability Characteristics: 
- Environmental: Climate change mitigation, sustainable resource use
- Social: Labor rights, community development, human rights
- Governance: Board diversity, anti-corruption, ethical business practices
PAI Consideration: The fund systematically considers principal adverse impacts on sustainability factors through exclusion policies, engagement activities, and integration of ESG criteria in investment decisions.
EU Taxonomy Alignment: 45% of investments are taxonomy-aligned based on environmental objectives.
Investment Strategy: The fund invests at least 80% of its assets in equity securities of companies that meet predefined ESG criteria and demonstrate positive sustainability characteristics.`;
  };

  const runConnectivityTest = async () => {
    setIsRunning(true);
    setError(null);

    try {
      const connectivityResults = await llmIntegrationService.testConnectivity();

      // Convert to TestResult format
      const results: TestResult[] = connectivityResults.results.map(result => ({
        id: `connectivity-${result.provider}-${Date.now()}`,
        strategy: 'Connectivity Test',
        model: result.provider === 'qwen' ? 'Qwen3 235B A22B' : 'OpenAI GPT-OSS-20B',
        provider: result.provider,
        success: result.status === 'healthy',
        responseTime: result.responseTime,
        error: result.error,
        timestamp: new Date().toISOString()
      }));

      setTestResults(results);
      loadHealthStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connectivity test failed');
    } finally {
      setIsRunning(false);
    }
  };

  const runValidationTest = async () => {
    setIsRunning(true);
    setError(null);

    try {
      const validationSummary = await llmValidationService.validateAllStrategies();

      // Convert to TestResult format
      const results: TestResult[] = validationSummary.testResults.map(result => ({
        id: `validation-${result.strategy.id}-${Date.now()}`,
        strategy: result.strategy.name,
        model: result.strategy.expectedModel,
        provider: 'validation',
        success: result.success,
        responseTime: result.responseTime,
        confidence: result.confidence,
        classification: result.classification,
        error: result.error,
        timestamp: result.timestamp
      }));

      setTestResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation test failed');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'failed':
        return <XCircle className='h-4 w-4 text-red-500' />;
      case 'running':
        return <RefreshCw className='h-4 w-4 text-blue-500 animate-spin' />;
      default:
        return <Clock className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold flex items-center gap-2'>
            <Brain className='h-8 w-8' />
            LLM Strategy Test Suite
          </h1>
          <p className='text-muted-foreground mt-2'>
            Comprehensive testing for Qwen3_235B_A22B and OpenAI gpt-oss-20b models
          </p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={runConnectivityTest} disabled={isRunning} variant='outline' size='sm'>
            <Network className='h-4 w-4 mr-2' />
            Test Connectivity
          </Button>
          <Button onClick={runValidationTest} disabled={isRunning} variant='outline' size='sm'>
            <Settings className='h-4 w-4 mr-2' />
            Run Validation
          </Button>
          <Button onClick={runAllTests} disabled={isRunning} size='sm'>
            {isRunning ? (
              <>
                <StopCircle className='h-4 w-4 mr-2' />
                Stop Tests
              </>
            ) : (
              <>
                <Play className='h-4 w-4 mr-2' />
                Run All Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Configuration Summary */}
      {configurationSummary && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              Configuration Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold'>{configurationSummary.enabledStrategies}</div>
                <div className='text-sm text-muted-foreground'>Active Strategies</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold'>{configurationSummary.enabledModels}</div>
                <div className='text-sm text-muted-foreground'>Active Models</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold'>{configurationSummary.defaultStrategy}</div>
                <div className='text-sm text-muted-foreground'>Default Strategy</div>
              </div>
              <div className='text-center'>
                <Badge
                  className={
                    configurationSummary.validationStatus.valid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {configurationSummary.validationStatus.valid ? 'Valid' : 'Invalid'}
                </Badge>
                <div className='text-sm text-muted-foreground mt-1'>Configuration</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Status */}
      {healthStatus && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Zap className='h-5 w-5' />
              Health Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div className='flex items-center gap-2'>
                  <Bot className='h-4 w-4' />
                  <span>Qwen3</span>
                </div>
                <Badge className={getHealthStatusColor(healthStatus.qwen.status)}>
                  {healthStatus.qwen.status}
                </Badge>
              </div>
              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div className='flex items-center gap-2'>
                  <Cpu className='h-4 w-4' />
                  <span>OpenAI</span>
                </div>
                <Badge className={getHealthStatusColor(healthStatus.openai.status)}>
                  {healthStatus.openai.status}
                </Badge>
              </div>
              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div className='flex items-center gap-2'>
                  <Brain className='h-4 w-4' />
                  <span>Overall</span>
                </div>
                <Badge className={getHealthStatusColor(healthStatus.overall)}>
                  {healthStatus.overall}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Progress */}
      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle>Test Progress</CardTitle>
            <CardDescription>Overall progress: {overallProgress.toFixed(1)}%</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className='mb-4' />
            <div className='space-y-2'>
              {strategyStatuses.map((status, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    {getStatusIcon(status.status)}
                    <span className='text-sm'>{status.strategy}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Progress value={status.progress} className='w-20' />
                    <Badge className={getStatusColor(status.status)}>{status.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {testResults.filter(r => r.success).length} of {testResults.length} tests passed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {testResults.map(result => (
                <div key={result.id} className='border rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      {result.success ? (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      ) : (
                        <XCircle className='h-4 w-4 text-red-500' />
                      )}
                      <span className='font-medium'>{result.strategy}</span>
                      <Badge variant='outline'>{result.model}</Badge>
                      <Badge variant='outline'>{result.provider}</Badge>
                    </div>
                    <div className='text-sm text-muted-foreground'>{result.responseTime}ms</div>
                  </div>

                  {result.success && (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                      <div>
                        <span className='text-muted-foreground'>Classification:</span>
                        <div className='font-medium'>{result.classification}</div>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Confidence:</span>
                        <div className='font-medium'>{(result.confidence || 0) * 100}%</div>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Response Time:</span>
                        <div className='font-medium'>{result.responseTime}ms</div>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Timestamp:</span>
                        <div className='font-medium text-xs'>
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {result.error && (
                    <div className='mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700'>
                      {result.error}
                    </div>
                  )}

                  {result.metadata && Object.keys(result.metadata).length > 0 && (
                    <div className='mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm'>
                      <div className='font-medium text-blue-700 mb-1'>Metadata:</div>
                      <pre className='text-xs text-blue-600'>
                        {JSON.stringify(result.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
