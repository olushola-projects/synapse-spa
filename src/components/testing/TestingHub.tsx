import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TestTube, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Download
} from 'lucide-react';

// Import testing components
import UATChecklist from './UATChecklist';
import UserTestingSession from './UserTestingSession';
import TestReportDashboard from './TestReportDashboard';
import FeedbackWidget from '../feedback/FeedbackWidget';

interface TestingMetrics {
  totalTests: number;
  completedTests: number;
  passedTests: number;
  failedTests: number;
  activeSessions: number;
  totalFeedback: number;
  avgRating: number;
  criticalIssues: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
}

/**
 * Comprehensive testing hub that integrates all testing and feedback components
 * Provides a centralized interface for managing UAT, user testing, and feedback collection
 */
const TestingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [metrics, setMetrics] = useState<TestingMetrics>({
    totalTests: 0,
    completedTests: 0,
    passedTests: 0,
    failedTests: 0,
    activeSessions: 0,
    totalFeedback: 0,
    avgRating: 0,
    criticalIssues: 0
  });
  const [showFeedbackWidget, setShowFeedbackWidget] = useState<boolean>(false);

  // Load and calculate metrics
  useEffect(() => {
    const loadMetrics = () => {
      // Load UAT test results
      const uatResults = localStorage.getItem('uat_test_results');
      let testMetrics = { total: 0, completed: 0, passed: 0, failed: 0 };
      
      if (uatResults) {
        const results = Object.values(JSON.parse(uatResults)) as any[];
        testMetrics.total = results.length;
        testMetrics.completed = results.filter(r => r.status !== 'pending').length;
        testMetrics.passed = results.filter(r => r.status === 'passed').length;
        testMetrics.failed = results.filter(r => r.status === 'failed').length;
      }

      // Load feedback data
      const feedbackData = localStorage.getItem('user_feedback_data');
      let feedbackMetrics = { total: 0, avgRating: 0 };
      
      if (feedbackData) {
        const feedback = JSON.parse(feedbackData) as any[];
        feedbackMetrics.total = feedback.length;
        feedbackMetrics.avgRating = feedback.length > 0 
          ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
          : 0;
      }

      // Calculate critical issues
      const criticalIssues = testMetrics.failed + 
        (feedbackData ? JSON.parse(feedbackData).filter((f: any) => f.rating <= 2).length : 0);

      setMetrics({
        totalTests: testMetrics.total,
        completedTests: testMetrics.completed,
        passedTests: testMetrics.passed,
        failedTests: testMetrics.failed,
        activeSessions: 0, // Would be managed by session state
        totalFeedback: feedbackMetrics.total,
        avgRating: feedbackMetrics.avgRating,
        criticalIssues
      });
    };

    loadMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  // Quick actions configuration
  const quickActions: QuickAction[] = [
    {
      id: 'start-uat',
      title: 'Start UAT Testing',
      description: 'Begin systematic user acceptance testing',
      icon: <TestTube className="h-5 w-5" />,
      action: () => setActiveTab('uat'),
      variant: 'default'
    },
    {
      id: 'new-session',
      title: 'New Testing Session',
      description: 'Start a live user testing session',
      icon: <Play className="h-5 w-5" />,
      action: () => setActiveTab('sessions'),
      variant: 'default'
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Access testing analytics and reports',
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => setActiveTab('reports'),
      variant: 'outline'
    },
    {
      id: 'collect-feedback',
      title: 'Collect Feedback',
      description: 'Enable feedback widget for users',
      icon: <MessageSquare className="h-5 w-5" />,
      action: () => setShowFeedbackWidget(true),
      variant: 'outline'
    },
    {
      id: 'export-data',
      title: 'Export All Data',
      description: 'Download comprehensive testing data',
      icon: <Download className="h-5 w-5" />,
      action: exportAllData,
      variant: 'secondary'
    }
  ];

  // Export all testing data
  function exportAllData() {
    const uatResults = localStorage.getItem('uat_test_results');
    const feedbackData = localStorage.getItem('user_feedback_data');
    const testerName = localStorage.getItem('uat_tester_name');
    
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportType: 'Complete Testing Data Export',
        version: '1.0'
      },
      metrics,
      uatResults: uatResults ? JSON.parse(uatResults) : {},
      feedbackData: feedbackData ? JSON.parse(feedbackData) : [],
      testerInfo: {
        name: testerName || 'Unknown'
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complete-testing-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Get status color based on metrics
  const getStatusColor = () => {
    if (metrics.criticalIssues > 5) return 'text-red-600';
    if (metrics.criticalIssues > 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Get completion percentage
  const getCompletionPercentage = () => {
    return metrics.totalTests > 0 ? (metrics.completedTests / metrics.totalTests) * 100 : 0;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Testing Hub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive testing and feedback management for the Synapses Landing Page.
          Coordinate UAT, user testing sessions, and feedback collection from a single interface.
        </p>
      </div>

      {/* Testing Status Overview */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Testing Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalTests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.passedTests}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.failedTests}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{getCompletionPercentage().toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.totalFeedback}</div>
              <div className="text-sm text-gray-600">Feedback</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{metrics.avgRating.toFixed(1)}/5</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.activeSessions}</div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>{metrics.criticalIssues}</div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                onClick={action.action}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                {action.icon}
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {metrics.criticalIssues > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Attention Required:</strong> {metrics.criticalIssues} critical issues detected. 
            Review failed tests and low-rating feedback in the Reports section.
          </AlertDescription>
        </Alert>
      )}

      {metrics.totalTests > 0 && getCompletionPercentage() === 100 && metrics.criticalIssues === 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Excellent!</strong> All tests completed successfully with no critical issues. 
            The application is ready for deployment.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Testing Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="uat" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            UAT Testing
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Sessions
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Testing Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Testing Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">UAT Testing Process:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Review test cases and understand requirements</li>
                    <li>Execute tests systematically by category</li>
                    <li>Document findings and issues thoroughly</li>
                    <li>Mark tests as passed, failed, or blocked</li>
                    <li>Export results for stakeholder review</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">User Testing Sessions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Prepare testing scenarios and tasks</li>
                    <li>Set up recording and observation tools</li>
                    <li>Guide users through realistic scenarios</li>
                    <li>Collect real-time feedback and observations</li>
                    <li>Analyze session data and user behavior</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
              <CardHeader>
                <CardTitle>Testing Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Quality Assurance:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Test across multiple browsers and devices</li>
                    <li>Verify accessibility compliance (WCAG)</li>
                    <li>Check performance on slow connections</li>
                    <li>Validate SFDR regulatory content accuracy</li>
                    <li>Test with real user data when possible</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Documentation:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Record detailed steps to reproduce issues</li>
                    <li>Include screenshots for visual problems</li>
                    <li>Note browser/device information for bugs</li>
                    <li>Prioritize issues by severity and impact</li>
                    <li>Provide clear acceptance criteria</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="uat">
          <UATChecklist />
        </TabsContent>

        <TabsContent value="sessions">
          <UserTestingSession />
        </TabsContent>

        <TabsContent value="reports">
          <TestReportDashboard />
        </TabsContent>
      </Tabs>

      {/* Feedback Widget */}
      {showFeedbackWidget && (
        <div className="fixed bottom-4 right-4 z-50">
          <FeedbackWidget />
        </div>
      )}
    </div>
  );
};

export default TestingHub;