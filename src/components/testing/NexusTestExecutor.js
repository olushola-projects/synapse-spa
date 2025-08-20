import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Nexus Agent Test Executor
 * Real-time testing component for UAT validation
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Play, RefreshCw, AlertTriangle, Target, Zap } from 'lucide-react';
import { testSuite, automatedTests } from '@/utils/nexus-test-suite';
export const NexusTestExecutor = () => {
    const [testResults, setTestResults] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [automatedResults, setAutomatedResults] = useState({});
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
        }
        catch (error) {
            console.error('Test execution failed:', error);
        }
        finally {
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
        }
        catch (error) {
            console.error('Critical test execution failed:', error);
        }
        finally {
            setIsRunning(false);
        }
    };
    const testChatFunctionality = () => {
        const chatInput = document.querySelector('textarea[placeholder*="Ask about SFDR"]');
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
            quickActionButtons[0].click();
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
    const getStatusIcon = (status) => {
        if (status === undefined) {
            return _jsx(Clock, { className: 'w-4 h-4 text-gray-500' });
        }
        return status ? (_jsx(CheckCircle, { className: 'w-4 h-4 text-green-600' })) : (_jsx(XCircle, { className: 'w-4 h-4 text-red-600' }));
    };
    const getStatusBadge = (status) => {
        if (status === undefined) {
            return _jsx(Badge, { variant: 'outline', children: "Pending" });
        }
        return status ? (_jsx(Badge, { className: 'bg-green-100 text-green-800', children: "Pass" })) : (_jsx(Badge, { variant: 'destructive', children: "Fail" }));
    };
    return (_jsxs("div", { className: 'space-y-6', children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(Target, { className: 'w-5 h-5' }), "Nexus Agent UAT Test Suite"] }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6', children: [_jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'text-2xl font-bold text-blue-600', children: Object.keys(automatedResults).length }), _jsx("div", { className: 'text-sm text-gray-600', children: "Automated Tests" })] }), _jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'text-2xl font-bold text-purple-600', children: testSuite.getTestsByCategory('functional').length }), _jsx("div", { className: 'text-sm text-gray-600', children: "Functional Tests" })] }), _jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'text-2xl font-bold text-orange-600', children: testSuite.getTestsByCategory('security').length }), _jsx("div", { className: 'text-sm text-gray-600', children: "Security Tests" })] })] }), _jsxs("div", { className: 'flex gap-2 mb-4', children: [_jsxs(Button, { onClick: runAllTests, disabled: isRunning, children: [isRunning ? (_jsx(RefreshCw, { className: 'w-4 h-4 mr-2 animate-spin' })) : (_jsx(Play, { className: 'w-4 h-4 mr-2' })), "Run All Tests"] }), _jsxs(Button, { variant: 'outline', onClick: runCriticalTests, disabled: isRunning, children: [_jsx(AlertTriangle, { className: 'w-4 h-4 mr-2' }), "Critical Tests Only"] }), _jsxs(Button, { variant: 'outline', onClick: runAutomatedTests, children: [_jsx(Zap, { className: 'w-4 h-4 mr-2' }), "Refresh Automated"] })] }), testResults && (_jsx("div", { className: 'border rounded-lg p-4 bg-gray-50', children: _jsxs("div", { className: 'grid grid-cols-4 gap-4 text-center', children: [_jsxs("div", { children: [_jsx("div", { className: 'text-lg font-bold', children: testResults.totalTests }), _jsx("div", { className: 'text-sm text-gray-600', children: "Total" })] }), _jsxs("div", { children: [_jsx("div", { className: 'text-lg font-bold text-green-600', children: testResults.passed }), _jsx("div", { className: 'text-sm text-gray-600', children: "Passed" })] }), _jsxs("div", { children: [_jsx("div", { className: 'text-lg font-bold text-red-600', children: testResults.failed }), _jsx("div", { className: 'text-sm text-gray-600', children: "Failed" })] }), _jsxs("div", { children: [_jsx("div", { className: 'text-lg font-bold text-yellow-600', children: testResults.pending }), _jsx("div", { className: 'text-sm text-gray-600', children: "Pending" })] })] }) }))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Automated Test Results" }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'space-y-3', children: [_jsxs("div", { className: 'flex items-center justify-between p-3 border rounded', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [getStatusIcon(automatedResults.chatInit), _jsx("span", { children: "Chat Interface Initialization" })] }), getStatusBadge(automatedResults.chatInit)] }), _jsxs("div", { className: 'flex items-center justify-between p-3 border rounded', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [getStatusIcon(automatedResults.quickActions), _jsx("span", { children: "Quick Action Buttons" })] }), getStatusBadge(automatedResults.quickActions)] }), _jsxs("div", { className: 'flex items-center justify-between p-3 border rounded', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [getStatusIcon(automatedResults.responsive), _jsx("span", { children: "Responsive Design" })] }), getStatusBadge(automatedResults.responsive)] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Manual Test Actions" }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'grid grid-cols-1 md:grid-cols-3 gap-4', children: [_jsx(Button, { variant: 'outline', onClick: testChatFunctionality, className: 'h-auto py-4', children: _jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'font-medium', children: "Test Chat" }), _jsx("div", { className: 'text-sm text-gray-600', children: "Send SFDR question" })] }) }), _jsx(Button, { variant: 'outline', onClick: testQuickActions, className: 'h-auto py-4', children: _jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'font-medium', children: "Test Quick Actions" }), _jsx("div", { className: 'text-sm text-gray-600', children: "Click upload document" })] }) }), _jsx(Button, { variant: 'outline', onClick: testFormMode, className: 'h-auto py-4', children: _jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'font-medium', children: "Test Form Mode" }), _jsx("div", { className: 'text-sm text-gray-600', children: "Switch to form interface" })] }) })] }) })] }), _jsxs(Alert, { children: [_jsx(AlertTriangle, { className: 'h-4 w-4' }), _jsxs(AlertDescription, { children: [_jsx("strong", { children: "Testing Instructions:" }), _jsx("br", {}), "1. Run automated tests first to verify basic functionality", _jsx("br", {}), "2. Use manual test actions to verify user interactions", _jsx("br", {}), "3. Check the network tab for API calls and responses", _jsx("br", {}), "4. Verify chat responses are contextually appropriate", _jsx("br", {}), "5. Test form validation and submission flows"] })] })] }));
};
