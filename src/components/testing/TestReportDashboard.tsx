import React, { useState, useEffect } from 'react';
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
// XCircle import removed - not used in this component

interface TestResult {
  id: string;
  category: string;
  title: string;
  status: 'passed' | 'failed' | 'blocked' | 'pending';
  priority: 'high' | 'medium' | 'low';
  testerName?: string;
  timestamp?: string;
  notes: string;
}

interface FeedbackData {
  id: string;
  rating: number;
  category: string;
  comment: string;
  timestamp: string;
  page: string;
  userAgent: string;
}

interface DashboardMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  blockedTests: number;
  pendingTests: number;
  testCoverage: number;
  avgFeedbackRating: number;
  totalFeedback: number;
  criticalIssues: number;
}

/**
 * Comprehensive test reporting dashboard
 * Aggregates UAT results, user feedback, and testing metrics
 * Provides visual analytics and exportable reports
 */
const TestReportDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
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
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  // Load test results and feedback data
  useEffect(() => {
    // Load UAT test results
    const savedUATResults = localStorage.getItem('uat_test_results');
    if (savedUATResults) {
      const uatData = JSON.parse(savedUATResults);
      const testResultsArray = Object.values(uatData) as TestResult[];
      setTestResults(testResultsArray);
    }

    // Load feedback data
    const savedFeedback = localStorage.getItem('user_feedback_data');
    if (savedFeedback) {
      const feedbackArray = JSON.parse(savedFeedback) as FeedbackData[];
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
    const categories = testResults.reduce(
      (acc, test) => {
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
      },
      {} as Record<string, { passed: number; failed: number; total: number }>
    );

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
    const groupedByDay = filteredFeedback.reduce(
      (acc, feedback) => {
        const timestamp = feedback.timestamp || new Date().toISOString();
        const day = new Date(timestamp).toISOString().split('T')[0] || 'unknown';
        if (!acc[day]) {
          acc[day] = { date: day, ratings: [], count: 0 };
        }
        acc[day].ratings.push(feedback.rating || 0);
        acc[day].count++;
        return acc;
      },
      {} as Record<string, { date: string; ratings: number[]; count: number }>
    );

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
        priority: feedback.rating === 1 ? 'high' : ('medium' as 'high' | 'medium' | 'low'),
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

  return (
    <div className='max-w-7xl mx-auto p-6 space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Test Report Dashboard</h1>
          <p className='text-gray-600 mt-1'>
            Comprehensive overview of UAT results and user feedback
          </p>
        </div>
        <div className='flex gap-3'>
          <select
            value={selectedTimeRange}
            onChange={e => setSelectedTimeRange(e.target.value as '24h' | '7d' | '30d')}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='24h'>Last 24 Hours</option>
            <option value='7d'>Last 7 Days</option>
            <option value='30d'>Last 30 Days</option>
          </select>
          <Button onClick={exportReport}>
            <Download className='h-4 w-4 mr-2' />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Test Coverage</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {metrics.testCoverage.toFixed(1)}%
                </p>
              </div>
              <CheckCircle className='h-8 w-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Avg. User Rating</p>
                <p className='text-2xl font-bold text-green-600'>
                  {metrics.avgFeedbackRating.toFixed(1)}/5
                </p>
              </div>
              <TrendingUp className='h-8 w-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Critical Issues</p>
                <p className='text-2xl font-bold text-red-600'>{metrics.criticalIssues}</p>
              </div>
              <AlertTriangle className='h-8 w-8 text-red-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total Feedback</p>
                <p className='text-2xl font-bold text-purple-600'>{metrics.totalFeedback}</p>
              </div>
              <Users className='h-8 w-8 text-purple-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='testing'>Testing Results</TabsTrigger>
          <TabsTrigger value='feedback'>User Feedback</TabsTrigger>
          <TabsTrigger value='issues'>Issues & Actions</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Test Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Test Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      dataKey='value'
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='category' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='passed' fill='#10B981' name='Passed' />
                    <Bar dataKey='failed' fill='#EF4444' name='Failed' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='testing' className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Test Results Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Test Results Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium'>Total Tests</span>
                    <Badge variant='outline'>{metrics.totalTests}</Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-green-600'>Passed</span>
                    <Badge className='bg-green-100 text-green-800'>{metrics.passedTests}</Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-red-600'>Failed</span>
                    <Badge className='bg-red-100 text-red-800'>{metrics.failedTests}</Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-yellow-600'>Blocked</span>
                    <Badge className='bg-yellow-100 text-yellow-800'>{metrics.blockedTests}</Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-gray-600'>Pending</span>
                    <Badge className='bg-gray-100 text-gray-800'>{metrics.pendingTests}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Pass Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Category Pass Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {categoryData.map(category => (
                    <div key={category.category} className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span>{category.category}</span>
                        <span>{category.passRate.toFixed(1)}%</span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-blue-600 h-2 rounded-full'
                          style={{ width: `${category.passRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='feedback' className='space-y-6'>
          {/* Feedback Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={feedbackTrendData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type='monotone' dataKey='avgRating' stroke='#8884d8' strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='issues' className='space-y-6'>
          {/* Top Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Top Issues Requiring Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {topIssues.length === 0 ? (
                  <Alert>
                    <CheckCircle className='h-4 w-4' />
                    <AlertDescription>No critical issues found. Great job!</AlertDescription>
                  </Alert>
                ) : (
                  topIssues.map((issue, index) => (
                    <div key={index} className='border rounded-lg p-4 space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant={issue.type === 'Test Failure' ? 'destructive' : 'secondary'}
                          >
                            {issue.type}
                          </Badge>
                          <Badge
                            variant={
                              issue.priority === 'high'
                                ? 'destructive'
                                : issue.priority === 'medium'
                                  ? 'default'
                                  : 'secondary'
                            }
                          >
                            {issue.priority}
                          </Badge>
                        </div>
                        <span className='text-xs text-gray-500'>
                          {issue.timestamp
                            ? new Date(issue.timestamp).toLocaleDateString()
                            : 'No date'}
                        </span>
                      </div>
                      <h4 className='font-medium'>{issue.title}</h4>
                      <p className='text-sm text-gray-600'>{issue.description}</p>
                      <p className='text-xs text-gray-500'>Category: {issue.category}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestReportDashboard;
