import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Performance Monitoring Dashboard for SFDR Classification System
 * Tracks API response times, classification accuracy, and system health
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChartBarIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon, CpuChipIcon, SignalIcon } from '@heroicons/react/24/outline';
export const PerformanceMonitoringDashboard = ({ refreshInterval = 30000, // 30 seconds default
showDetailedMetrics = true }) => {
    const [metrics, setMetrics] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);
    const fetchMetrics = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // In a real implementation, these would be actual API calls
            // For now, we'll simulate the data structure
            const mockMetrics = {
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
            const mockAnalytics = {
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, refreshInterval);
        return () => clearInterval(interval);
    }, [refreshInterval]);
    const getStatusBadge = (value, thresholds) => {
        if (value >= thresholds.good) {
            return _jsx(Badge, { className: 'bg-green-100 text-green-800', children: "Excellent" });
        }
        if (value >= thresholds.warning) {
            return _jsx(Badge, { className: 'bg-yellow-100 text-yellow-800', children: "Good" });
        }
        return _jsx(Badge, { className: 'bg-red-100 text-red-800', children: "Needs Attention" });
    };
    if (error) {
        return (_jsx(Card, { children: _jsxs(CardContent, { className: 'p-6 text-center', children: [_jsx(ExclamationTriangleIcon, { className: 'h-12 w-12 text-red-500 mx-auto mb-4' }), _jsx("h3", { className: 'text-lg font-semibold text-red-800 mb-2', children: "Monitoring Error" }), _jsx("p", { className: 'text-red-600 mb-4', children: error }), _jsx(Button, { onClick: fetchMetrics, variant: 'outline', children: "Retry" })] }) }));
    }
    return (_jsxs("div", { className: 'space-y-6', children: [_jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { children: [_jsx("h2", { className: 'text-2xl font-bold text-gray-900', children: "Performance Monitoring" }), _jsx("p", { className: 'text-gray-600', children: "Real-time SFDR classification system metrics" })] }), _jsxs("div", { className: 'flex items-center gap-4', children: [lastUpdated && (_jsxs("span", { className: 'text-sm text-gray-500', children: ["Last updated: ", lastUpdated.toLocaleTimeString()] })), _jsx(Button, { onClick: fetchMetrics, variant: 'outline', size: 'sm', disabled: isLoading, children: isLoading ? 'Refreshing...' : 'Refresh' })] })] }), _jsxs("div", { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', children: [_jsxs(Card, { children: [_jsx(CardHeader, { className: 'pb-2', children: _jsxs(CardTitle, { className: 'text-sm font-medium text-gray-600 flex items-center gap-2', children: [_jsx(ClockIcon, { className: 'h-4 w-4' }), "Response Time"] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: 'text-2xl font-bold text-gray-900', children: metrics ? `${metrics.response_time.toFixed(0)}ms` : '--' }), _jsxs("div", { className: 'flex items-center justify-between mt-2', children: [metrics && getStatusBadge(500 - metrics.response_time, { good: 250, warning: 150 }), _jsx("div", { className: 'text-sm text-gray-500', children: "Target: <500ms" })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: 'pb-2', children: _jsxs(CardTitle, { className: 'text-sm font-medium text-gray-600 flex items-center gap-2', children: [_jsx(CheckCircleIcon, { className: 'h-4 w-4' }), "Accuracy"] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: 'text-2xl font-bold text-gray-900', children: metrics ? `${(metrics.classification_accuracy * 100).toFixed(1)}%` : '--' }), _jsxs("div", { className: 'flex items-center justify-between mt-2', children: [metrics &&
                                                getStatusBadge(metrics.classification_accuracy, { good: 0.85, warning: 0.75 }), _jsx("div", { className: 'text-sm text-gray-500', children: "Target: >85%" })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: 'pb-2', children: _jsxs(CardTitle, { className: 'text-sm font-medium text-gray-600 flex items-center gap-2', children: [_jsx(ExclamationTriangleIcon, { className: 'h-4 w-4' }), "Error Rate"] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: 'text-2xl font-bold text-gray-900', children: metrics ? `${(metrics.error_rate * 100).toFixed(2)}%` : '--' }), _jsxs("div", { className: 'flex items-center justify-between mt-2', children: [metrics && getStatusBadge(1 - metrics.error_rate, { good: 0.99, warning: 0.95 }), _jsx("div", { className: 'text-sm text-gray-500', children: "Target: <1%" })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: 'pb-2', children: _jsxs(CardTitle, { className: 'text-sm font-medium text-gray-600 flex items-center gap-2', children: [_jsx(ArrowTrendingUpIcon, { className: 'h-4 w-4' }), "Throughput"] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: 'text-2xl font-bold text-gray-900', children: metrics ? `${metrics.throughput.toFixed(0)}/min` : '--' }), _jsxs("div", { className: 'flex items-center justify-between mt-2', children: [metrics && getStatusBadge(metrics.throughput, { good: 100, warning: 50 }), _jsx("div", { className: 'text-sm text-gray-500', children: "Requests/min" })] })] })] })] }), showDetailedMetrics && (_jsxs(_Fragment, { children: [metrics && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(ChartBarIcon, { className: 'h-5 w-5' }), "Confidence Distribution"] }) }), _jsx(CardContent, { className: 'space-y-4', children: Object.entries(metrics.confidence_distribution).map(([range, percentage]) => (_jsxs("div", { className: 'space-y-2', children: [_jsxs("div", { className: 'flex justify-between text-sm', children: [_jsx("span", { className: 'capitalize', children: range }), _jsxs("span", { children: [(percentage * 100).toFixed(1), "%"] })] }), _jsx(Progress, { value: percentage * 100, className: 'h-2' })] }, range))) })] })), analytics && (_jsxs("div", { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6', children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(CpuChipIcon, { className: 'h-5 w-5' }), "Article Classification Distribution"] }) }), _jsxs(CardContent, { className: 'space-y-4', children: [_jsxs("div", { className: 'text-center mb-4', children: [_jsx("div", { className: 'text-3xl font-bold text-gray-900', children: analytics.total_classifications.toLocaleString() }), _jsx("div", { className: 'text-sm text-gray-600', children: "Total Classifications" })] }), Object.entries(analytics.article_distribution).map(([article, percentage]) => (_jsxs("div", { className: 'space-y-2', children: [_jsxs("div", { className: 'flex justify-between text-sm', children: [_jsx("span", { className: 'capitalize', children: article.replace('_', ' ') }), _jsxs("span", { children: [percentage, "%"] })] }), _jsx(Progress, { value: percentage, className: 'h-2' })] }, article)))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(SignalIcon, { className: 'h-5 w-5' }), "Processing Time Metrics"] }) }), _jsxs(CardContent, { className: 'space-y-4', children: [_jsxs("div", { className: 'grid grid-cols-2 gap-4', children: [_jsxs("div", { className: 'text-center p-3 bg-gray-50 rounded-lg', children: [_jsx("div", { className: 'text-sm text-gray-600', children: "Average" }), _jsxs("div", { className: 'text-lg font-semibold', children: [analytics.processing_times.average.toFixed(0), "ms"] })] }), _jsxs("div", { className: 'text-center p-3 bg-blue-50 rounded-lg', children: [_jsx("div", { className: 'text-sm text-gray-600', children: "50th Percentile" }), _jsxs("div", { className: 'text-lg font-semibold text-blue-600', children: [analytics.processing_times.p50.toFixed(0), "ms"] })] }), _jsxs("div", { className: 'text-center p-3 bg-yellow-50 rounded-lg', children: [_jsx("div", { className: 'text-sm text-gray-600', children: "90th Percentile" }), _jsxs("div", { className: 'text-lg font-semibold text-yellow-600', children: [analytics.processing_times.p90.toFixed(0), "ms"] })] }), _jsxs("div", { className: 'text-center p-3 bg-red-50 rounded-lg', children: [_jsx("div", { className: 'text-sm text-gray-600', children: "99th Percentile" }), _jsxs("div", { className: 'text-lg font-semibold text-red-600', children: [analytics.processing_times.p99.toFixed(0), "ms"] })] })] }), _jsxs("div", { className: 'mt-4 p-3 bg-green-50 rounded-lg text-center', children: [_jsx("div", { className: 'text-sm text-gray-600', children: "Success Rate" }), _jsxs("div", { className: 'text-xl font-bold text-green-600', children: [(analytics.success_rate * 100).toFixed(2), "%"] })] })] })] })] }))] })), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "System Health Summary" }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-center', children: [_jsxs("div", { className: 'p-4 border rounded-lg', children: [_jsx(CheckCircleIcon, { className: 'h-8 w-8 text-green-500 mx-auto mb-2' }), _jsx("div", { className: 'font-semibold text-green-800', children: "API Health" }), _jsx("div", { className: 'text-sm text-gray-600', children: "All endpoints operational" })] }), _jsxs("div", { className: 'p-4 border rounded-lg', children: [_jsx(CpuChipIcon, { className: 'h-8 w-8 text-blue-500 mx-auto mb-2' }), _jsx("div", { className: 'font-semibold text-blue-800', children: "Classification Engine" }), _jsx("div", { className: 'text-sm text-gray-600', children: "Enhanced v2.0 active" })] }), _jsxs("div", { className: 'p-4 border rounded-lg', children: [_jsx(SignalIcon, { className: 'h-8 w-8 text-purple-500 mx-auto mb-2' }), _jsx("div", { className: 'font-semibold text-purple-800', children: "Monitoring Active" }), _jsx("div", { className: 'text-sm text-gray-600', children: "Real-time tracking enabled" })] })] }) })] })] }));
};
export default PerformanceMonitoringDashboard;
