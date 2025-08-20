import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getMetricStatus } from '../utils/metricUtils';
import { MonitoringCardSkeleton } from './MonitoringCardSkeleton';
const STATUS_COLORS = {
    healthy: 'text-green-500',
    warning: 'text-yellow-500',
    critical: 'text-red-500'
};
function SuccessRateDisplay({ rate, color }) {
    return (_jsxs("div", { className: 'relative w-32 h-32', children: [_jsx("div", { className: 'absolute inset-0 flex items-center justify-center', children: _jsxs("span", { className: `text-3xl font-bold ${color}`, children: [rate.toFixed(1), "%"] }) }), _jsx(Progress, { value: rate, className: 'w-full h-2 bg-gray-200 rounded-full' })] }));
}
export function ApiSuccessCard({ successRate, isLoading = false }) {
    if (isLoading) {
        return _jsx(MonitoringCardSkeleton, {});
    }
    const status = getMetricStatus(successRate, 'api_success');
    const statusColor = STATUS_COLORS[status];
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "API Success Rate" }) }), _jsx(CardContent, { className: 'flex flex-col items-center justify-center space-y-4', children: _jsx(SuccessRateDisplay, { rate: successRate, color: statusColor }) })] }));
}
