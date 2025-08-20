import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * LLM Strategy Test Component
 * Comprehensive testing interface for Qwen3_235B_A22B and OpenAI gpt-oss-20b models
 * Verifies all LLM strategies work correctly
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, CheckCircle, XCircle, AlertTriangle, Clock, Zap, Brain, Cpu, Network, Settings, RefreshCw, Play, StopCircle } from 'lucide-react';
import { llmConfigurationService } from '@/services/llmConfigurationService';
import { llmIntegrationService } from '@/services/llmIntegrationService';
import { llmValidationService } from '@/services/llmValidationService';
export const LLMStrategyTest = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [overallProgress, setOverallProgress] = useState(0);
    const [strategyStatuses, setStrategyStatuses] = useState([]);
    const [testResults, setTestResults] = useState([]);
    const [configurationSummary, setConfigurationSummary] = useState(null);
    const [healthStatus, setHealthStatus] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        loadConfiguration();
        loadHealthStatus();
    }, []);
    const loadConfiguration = () => {
        try {
            const summary = llmConfigurationService.getConfigurationSummary();
            setConfigurationSummary(summary);
        }
        catch (err) {
            setError('Failed to load configuration');
        }
    };
    const loadHealthStatus = () => {
        try {
            const status = llmIntegrationService.getHealthStatus();
            setHealthStatus(status);
        }
        catch (err) {
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
            const initialStatuses = strategies.map(strategy => ({
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
                setStrategyStatuses(prev => prev.map((s, idx) => (idx === i ? { ...s, status: 'running', progress: 0 } : s)));
                const strategyResults = await testStrategy(strategy);
                // Update status to completed
                setStrategyStatuses(prev => prev.map((s, idx) => idx === i
                    ? {
                        ...s,
                        status: strategyResults.every(r => r.success) ? 'completed' : 'failed',
                        progress: 100,
                        results: strategyResults
                    }
                    : s));
                // Add results to overall results
                setTestResults(prev => [...prev, ...strategyResults]);
                // Update overall progress
                const progress = ((i + 1) / strategies.length) * 100;
                setOverallProgress(progress);
            }
            // Update health status after tests
            loadHealthStatus();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Test execution failed');
        }
        finally {
            setIsRunning(false);
        }
    };
    const testStrategy = async (strategy) => {
        const results = [];
        const models = strategy.models.filter((m) => m.enabled);
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
                const result = {
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
            }
            catch (err) {
                const result = {
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
    const getTestDocument = () => {
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
            const results = connectivityResults.results.map(result => ({
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Connectivity test failed');
        }
        finally {
            setIsRunning(false);
        }
    };
    const runValidationTest = async () => {
        setIsRunning(true);
        setError(null);
        try {
            const validationSummary = await llmValidationService.validateAllStrategies();
            // Convert to TestResult format
            const results = validationSummary.testResults.map(result => ({
                id: `validation-${result.strategy.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Validation test failed');
        }
        finally {
            setIsRunning(false);
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return _jsx(CheckCircle, { className: 'h-4 w-4 text-green-500' });
            case 'failed':
                return _jsx(XCircle, { className: 'h-4 w-4 text-red-500' });
            case 'running':
                return _jsx(RefreshCw, { className: 'h-4 w-4 text-blue-500 animate-spin' });
            default:
                return _jsx(Clock, { className: 'h-4 w-4 text-gray-500' });
        }
    };
    const getStatusColor = (status) => {
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
    const getHealthStatusColor = (status) => {
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
    return (_jsxs("div", { className: 'space-y-6 p-6', children: [_jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { children: [_jsxs("h1", { className: 'text-3xl font-bold flex items-center gap-2', children: [_jsx(Brain, { className: 'h-8 w-8' }), "LLM Strategy Test Suite"] }), _jsx("p", { className: 'text-muted-foreground mt-2', children: "Comprehensive testing for Qwen3_235B_A22B and OpenAI gpt-oss-20b models" })] }), _jsxs("div", { className: 'flex gap-2', children: [_jsxs(Button, { onClick: runConnectivityTest, disabled: isRunning, variant: 'outline', size: 'sm', children: [_jsx(Network, { className: 'h-4 w-4 mr-2' }), "Test Connectivity"] }), _jsxs(Button, { onClick: runValidationTest, disabled: isRunning, variant: 'outline', size: 'sm', children: [_jsx(Settings, { className: 'h-4 w-4 mr-2' }), "Run Validation"] }), _jsx(Button, { onClick: runAllTests, disabled: isRunning, size: 'sm', children: isRunning ? (_jsxs(_Fragment, { children: [_jsx(StopCircle, { className: 'h-4 w-4 mr-2' }), "Stop Tests"] })) : (_jsxs(_Fragment, { children: [_jsx(Play, { className: 'h-4 w-4 mr-2' }), "Run All Tests"] })) })] })] }), error && (_jsxs(Alert, { variant: 'destructive', children: [_jsx(AlertTriangle, { className: 'h-4 w-4' }), _jsx(AlertDescription, { children: error })] })), configurationSummary && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(Settings, { className: 'h-5 w-5' }), "Configuration Summary"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'grid grid-cols-2 md:grid-cols-4 gap-4', children: [_jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'text-2xl font-bold', children: configurationSummary.enabledStrategies }), _jsx("div", { className: 'text-sm text-muted-foreground', children: "Active Strategies" })] }), _jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'text-2xl font-bold', children: configurationSummary.enabledModels }), _jsx("div", { className: 'text-sm text-muted-foreground', children: "Active Models" })] }), _jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'text-2xl font-bold', children: configurationSummary.defaultStrategy }), _jsx("div", { className: 'text-sm text-muted-foreground', children: "Default Strategy" })] }), _jsxs("div", { className: 'text-center', children: [_jsx(Badge, { className: configurationSummary.validationStatus.valid
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800', children: configurationSummary.validationStatus.valid ? 'Valid' : 'Invalid' }), _jsx("div", { className: 'text-sm text-muted-foreground mt-1', children: "Configuration" })] })] }) })] })), healthStatus && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(Zap, { className: 'h-5 w-5' }), "Health Status"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'grid grid-cols-1 md:grid-cols-3 gap-4', children: [_jsxs("div", { className: 'flex items-center justify-between p-3 border rounded-lg', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(Bot, { className: 'h-4 w-4' }), _jsx("span", { children: "Qwen3" })] }), _jsx(Badge, { className: getHealthStatusColor(healthStatus.qwen.status), children: healthStatus.qwen.status })] }), _jsxs("div", { className: 'flex items-center justify-between p-3 border rounded-lg', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(Cpu, { className: 'h-4 w-4' }), _jsx("span", { children: "OpenAI" })] }), _jsx(Badge, { className: getHealthStatusColor(healthStatus.openai.status), children: healthStatus.openai.status })] }), _jsxs("div", { className: 'flex items-center justify-between p-3 border rounded-lg', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(Brain, { className: 'h-4 w-4' }), _jsx("span", { children: "Overall" })] }), _jsx(Badge, { className: getHealthStatusColor(healthStatus.overall), children: healthStatus.overall })] })] }) })] })), isRunning && (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Test Progress" }), _jsxs(CardDescription, { children: ["Overall progress: ", overallProgress.toFixed(1), "%"] })] }), _jsxs(CardContent, { children: [_jsx(Progress, { value: overallProgress, className: 'mb-4' }), _jsx("div", { className: 'space-y-2', children: strategyStatuses.map((status, index) => (_jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [getStatusIcon(status.status), _jsx("span", { className: 'text-sm', children: status.strategy })] }), _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(Progress, { value: status.progress, className: 'w-20' }), _jsx(Badge, { className: getStatusColor(status.status), children: status.status })] })] }, index))) })] })] })), testResults.length > 0 && (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Test Results" }), _jsxs(CardDescription, { children: [testResults.filter(r => r.success).length, " of ", testResults.length, " tests passed"] })] }), _jsx(CardContent, { children: _jsx("div", { className: 'space-y-4', children: testResults.map(result => (_jsxs("div", { className: 'border rounded-lg p-4', children: [_jsxs("div", { className: 'flex items-center justify-between mb-2', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [result.success ? (_jsx(CheckCircle, { className: 'h-4 w-4 text-green-500' })) : (_jsx(XCircle, { className: 'h-4 w-4 text-red-500' })), _jsx("span", { className: 'font-medium', children: result.strategy }), _jsx(Badge, { variant: 'outline', children: result.model }), _jsx(Badge, { variant: 'outline', children: result.provider })] }), _jsxs("div", { className: 'text-sm text-muted-foreground', children: [result.responseTime, "ms"] })] }), result.success && (_jsxs("div", { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 text-sm', children: [_jsxs("div", { children: [_jsx("span", { className: 'text-muted-foreground', children: "Classification:" }), _jsx("div", { className: 'font-medium', children: result.classification })] }), _jsxs("div", { children: [_jsx("span", { className: 'text-muted-foreground', children: "Confidence:" }), _jsxs("div", { className: 'font-medium', children: [(result.confidence || 0) * 100, "%"] })] }), _jsxs("div", { children: [_jsx("span", { className: 'text-muted-foreground', children: "Response Time:" }), _jsxs("div", { className: 'font-medium', children: [result.responseTime, "ms"] })] }), _jsxs("div", { children: [_jsx("span", { className: 'text-muted-foreground', children: "Timestamp:" }), _jsx("div", { className: 'font-medium text-xs', children: new Date(result.timestamp).toLocaleTimeString() })] })] })), result.error && (_jsx("div", { className: 'mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700', children: result.error })), result.metadata && Object.keys(result.metadata).length > 0 && (_jsxs("div", { className: 'mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm', children: [_jsx("div", { className: 'font-medium text-blue-700 mb-1', children: "Metadata:" }), _jsx("pre", { className: 'text-xs text-blue-600', children: JSON.stringify(result.metadata, null, 2) })] }))] }, result.id))) }) })] }))] }));
};
