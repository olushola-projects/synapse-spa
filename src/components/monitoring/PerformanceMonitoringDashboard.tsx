/**
 * Performance Monitoring Dashboard for SFDR Classification System
 * Tracks API response times, classification accuracy, and system health
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CpuChipIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import type { PerformanceMetrics, ClassificationAnalytics } from '@/types/enhanced-classification';

interface PerformanceMonitoringDashboardProps {
  refreshInterval?: number; // in milliseconds
  showDetailedMetrics?: boolean;
}

export const PerformanceMonitoringDashboard: React.FC<PerformanceMonitoringDashboardProps> = ({
  refreshInterval = 30000, // 30 seconds default
  showDetailedMetrics = true
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [analytics, setAnalytics] = useState<ClassificationAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, these would be actual API calls
      // For now, we'll simulate the data structure
      const mockMetrics: PerformanceMetrics = {
        response_time: Math.random() * 500 + 100, // 100-600ms
        classification_accuracy: 0.87 + Math.random() * 0.1, // 87-97%
        confidence_distribution: {
          'high (80-100%)': 0.65,
          'medium (60-79%)': 0.25,
          'low (50-59%)': 0.1
        },
        error_rate: Math.random() * 0.02, // 0-2%
        throughput: Math.random() * 50 + 100, // 100-150 requests/min
        timestamp: new Date().toISOString()
      };

      const mockAnalytics: ClassificationAnalytics = {
        total_classifications: Math.floor(Math.random() * 1000) + 5000,
        article_distribution: {
          article_6: Math.floor(Math.random() * 30) + 20,
          article_8: Math.floor(Math.random() * 40) + 50,
          article_9: Math.floor(Math.random() * 20) + 10
        },
        average_confidence: 0.82 + Math.random() * 0.1,
        processing_times: {
          average: 245 + Math.random() * 100,
          p50: 220 + Math.random() * 50,
          p90: 400 + Math.random() * 100,
          p99: 800 + Math.random() * 200
        },
        success_rate: 0.95 + Math.random() * 0.04
      };

      setMetrics(mockMetrics);
      setAnalytics(mockAnalytics);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStatusBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) {
      return <Badge className='bg-green-100 text-green-800'>Excellent</Badge>;
    }
    if (value >= thresholds.warning) {
      return <Badge className='bg-yellow-100 text-yellow-800'>Good</Badge>;
    }
    return <Badge className='bg-red-100 text-red-800'>Needs Attention</Badge>;
  };

  if (error) {
    return (
      <Card>
        <CardContent className='p-6 text-center'>
          <ExclamationTriangleIcon className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-red-800 mb-2'>Monitoring Error</h3>
          <p className='text-red-600 mb-4'>{error}</p>
          <Button onClick={fetchMetrics} variant='outline'>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>Performance Monitoring</h2>
          <p className='text-gray-600'>Real-time SFDR classification system metrics</p>
        </div>
        <div className='flex items-center gap-4'>
          {lastUpdated && (
            <span className='text-sm text-gray-500'>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button onClick={fetchMetrics} variant='outline' size='sm' disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Response Time */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600 flex items-center gap-2'>
              <ClockIcon className='h-4 w-4' />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900'>
              {metrics ? `${metrics.response_time.toFixed(0)}ms` : '--'}
            </div>
            <div className='flex items-center justify-between mt-2'>
              {metrics && getStatusBadge(500 - metrics.response_time, { good: 250, warning: 150 })}
              <div className='text-sm text-gray-500'>Target: &lt;500ms</div>
            </div>
          </CardContent>
        </Card>

        {/* Classification Accuracy */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600 flex items-center gap-2'>
              <CheckCircleIcon className='h-4 w-4' />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900'>
              {metrics ? `${(metrics.classification_accuracy * 100).toFixed(1)}%` : '--'}
            </div>
            <div className='flex items-center justify-between mt-2'>
              {metrics &&
                getStatusBadge(metrics.classification_accuracy, { good: 0.85, warning: 0.75 })}
              <div className='text-sm text-gray-500'>Target: &gt;85%</div>
            </div>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600 flex items-center gap-2'>
              <ExclamationTriangleIcon className='h-4 w-4' />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900'>
              {metrics ? `${(metrics.error_rate * 100).toFixed(2)}%` : '--'}
            </div>
            <div className='flex items-center justify-between mt-2'>
              {metrics && getStatusBadge(1 - metrics.error_rate, { good: 0.99, warning: 0.95 })}
              <div className='text-sm text-gray-500'>Target: &lt;1%</div>
            </div>
          </CardContent>
        </Card>

        {/* Throughput */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600 flex items-center gap-2'>
              <ArrowTrendingUpIcon className='h-4 w-4' />
              Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900'>
              {metrics ? `${metrics.throughput.toFixed(0)}/min` : '--'}
            </div>
            <div className='flex items-center justify-between mt-2'>
              {metrics && getStatusBadge(metrics.throughput, { good: 100, warning: 50 })}
              <div className='text-sm text-gray-500'>Requests/min</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showDetailedMetrics && (
        <>
          {/* Confidence Distribution */}
          {metrics && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <ChartBarIcon className='h-5 w-5' />
                  Confidence Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {Object.entries(metrics.confidence_distribution).map(([range, percentage]) => (
                  <div key={range} className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='capitalize'>{range}</span>
                      <span>{(percentage * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage * 100} className='h-2' />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Classification Analytics */}
          {analytics && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Article Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <CpuChipIcon className='h-5 w-5' />
                    Article Classification Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='text-center mb-4'>
                    <div className='text-3xl font-bold text-gray-900'>
                      {analytics.total_classifications.toLocaleString()}
                    </div>
                    <div className='text-sm text-gray-600'>Total Classifications</div>
                  </div>

                  {Object.entries(analytics.article_distribution).map(([article, percentage]) => (
                    <div key={article} className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span className='capitalize'>{article.replace('_', ' ')}</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className='h-2' />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Processing Times */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <SignalIcon className='h-5 w-5' />
                    Processing Time Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='text-center p-3 bg-gray-50 rounded-lg'>
                      <div className='text-sm text-gray-600'>Average</div>
                      <div className='text-lg font-semibold'>
                        {analytics.processing_times.average.toFixed(0)}ms
                      </div>
                    </div>
                    <div className='text-center p-3 bg-blue-50 rounded-lg'>
                      <div className='text-sm text-gray-600'>50th Percentile</div>
                      <div className='text-lg font-semibold text-blue-600'>
                        {analytics.processing_times.p50.toFixed(0)}ms
                      </div>
                    </div>
                    <div className='text-center p-3 bg-yellow-50 rounded-lg'>
                      <div className='text-sm text-gray-600'>90th Percentile</div>
                      <div className='text-lg font-semibold text-yellow-600'>
                        {analytics.processing_times.p90.toFixed(0)}ms
                      </div>
                    </div>
                    <div className='text-center p-3 bg-red-50 rounded-lg'>
                      <div className='text-sm text-gray-600'>99th Percentile</div>
                      <div className='text-lg font-semibold text-red-600'>
                        {analytics.processing_times.p99.toFixed(0)}ms
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 p-3 bg-green-50 rounded-lg text-center'>
                    <div className='text-sm text-gray-600'>Success Rate</div>
                    <div className='text-xl font-bold text-green-600'>
                      {(analytics.success_rate * 100).toFixed(2)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* System Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>System Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
            <div className='p-4 border rounded-lg'>
              <CheckCircleIcon className='h-8 w-8 text-green-500 mx-auto mb-2' />
              <div className='font-semibold text-green-800'>API Health</div>
              <div className='text-sm text-gray-600'>All endpoints operational</div>
            </div>
            <div className='p-4 border rounded-lg'>
              <CpuChipIcon className='h-8 w-8 text-blue-500 mx-auto mb-2' />
              <div className='font-semibold text-blue-800'>Classification Engine</div>
              <div className='text-sm text-gray-600'>Enhanced v2.0 active</div>
            </div>
            <div className='p-4 border rounded-lg'>
              <SignalIcon className='h-8 w-8 text-purple-500 mx-auto mb-2' />
              <div className='font-semibold text-purple-800'>Monitoring Active</div>
              <div className='text-sm text-gray-600'>Real-time tracking enabled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitoringDashboard;
