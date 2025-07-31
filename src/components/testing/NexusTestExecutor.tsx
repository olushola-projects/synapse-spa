/**
 * Nexus Agent Test Executor
 * Real-time testing component for UAT validation
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  RefreshCw,
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react';
import { testSuite, automatedTests, type TestResults } from '@/utils/nexus-test-suite';

export const NexusTestExecutor = () => {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [automatedResults, setAutomatedResults] = useState<Record<string, boolean>>({});

  // Run automated tests on component mount
  useEffect(() => {
    runAutomatedTests();
  }, []);

  const runAutomatedTests = async () => {
    const results = {
      chatInit: await automatedTests.checkChatInitialization(),
      quickActions: await automatedTests.checkQuickActions(),
      responsive: await automatedTests.checkResponsiveness()
    };
    setAutomatedResults(results);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    try {
      const results = await testSuite.runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runCriticalTests = async () => {
    setIsRunning(true);
    try {
      const criticalTests = await testSuite.runCriticalTests();
      setTestResults({
        totalTests: criticalTests.length,
        passed: criticalTests.filter(t => t.status === 'pass').length,
        failed: criticalTests.filter(t => t.status === 'fail').length,
        pending: criticalTests.filter(t => t.status === 'pending').length,
        coverage: 0,
        timestamp: new Date().toISOString(),
        environment: 'development'
      });
    } catch (error) {
      console.error('Critical test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const testChatFunctionality = () => {
    const chatInput = document.querySelector('textarea[placeholder*="Ask about SFDR"]') as HTMLTextAreaElement;
    if (chatInput) {
      chatInput.value = 'What is SFDR Article 8?';
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Trigger send action
      const sendButton = chatInput.closest('div')?.querySelector('button');
      if (sendButton) {
        sendButton.click();
        return true;
      }
    }
    return false;
  };

  const testQuickActions = () => {
    const quickActionButtons = document.querySelectorAll('[data-testid="quick-action-button"]');
    if (quickActionButtons.length >= 4) {
      // Test first button
      (quickActionButtons[0] as HTMLButtonElement).click();
      return true;
    }
    return false;
  };

  const testFormMode = () => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const formModeButton = buttons.find(btn => btn.textContent?.includes('Form Mode'));
    if (formModeButton) {
      formModeButton.click();
      return true;
    }
    return false;
  };

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === undefined) return <Clock className="w-4 h-4 text-gray-500" />;
    return status ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusBadge = (status: boolean | undefined) => {
    if (status === undefined) return <Badge variant="outline">Pending</Badge>;
    return status ? 
      <Badge className="bg-green-100 text-green-800">Pass</Badge> : 
      <Badge variant="destructive">Fail</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Test Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Nexus Agent UAT Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(automatedResults).length}
              </div>
              <div className="text-sm text-gray-600">Automated Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {testSuite.getTestsByCategory('functional').length}
              </div>
              <div className="text-sm text-gray-600">Functional Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {testSuite.getTestsByCategory('security').length}
              </div>
              <div className="text-sm text-gray-600">Security Tests</div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Button onClick={runAllTests} disabled={isRunning}>
              {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Run All Tests
            </Button>
            <Button variant="outline" onClick={runCriticalTests} disabled={isRunning}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Critical Tests Only
            </Button>
            <Button variant="outline" onClick={runAutomatedTests}>
              <Zap className="w-4 h-4 mr-2" />
              Refresh Automated
            </Button>
          </div>

          {testResults && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">{testResults.totalTests}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{testResults.passed}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{testResults.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">{testResults.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automated Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(automatedResults.chatInit)}
                <span>Chat Interface Initialization</span>
              </div>
              {getStatusBadge(automatedResults.chatInit)}
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(automatedResults.quickActions)}
                <span>Quick Action Buttons</span>
              </div>
              {getStatusBadge(automatedResults.quickActions)}
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(automatedResults.responsive)}
                <span>Responsive Design</span>
              </div>
              {getStatusBadge(automatedResults.responsive)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Test Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={testChatFunctionality} className="h-auto py-4">
              <div className="text-center">
                <div className="font-medium">Test Chat</div>
                <div className="text-sm text-gray-600">Send SFDR question</div>
              </div>
            </Button>
            
            <Button variant="outline" onClick={testQuickActions} className="h-auto py-4">
              <div className="text-center">
                <div className="font-medium">Test Quick Actions</div>
                <div className="text-sm text-gray-600">Click upload document</div>
              </div>
            </Button>
            
            <Button variant="outline" onClick={testFormMode} className="h-auto py-4">
              <div className="text-center">
                <div className="font-medium">Test Form Mode</div>
                <div className="text-sm text-gray-600">Switch to form interface</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Instructions */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Testing Instructions:</strong>
          <br />1. Run automated tests first to verify basic functionality
          <br />2. Use manual test actions to verify user interactions
          <br />3. Check the network tab for API calls and responses
          <br />4. Verify chat responses are contextually appropriate
          <br />5. Test form validation and submission flows
        </AlertDescription>
      </Alert>
    </div>
  );
};