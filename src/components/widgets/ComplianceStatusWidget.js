import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Widget } from '../dashboard/WidgetGrid';
import { Shield, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
// Sample compliance data
const complianceData = [
    { name: 'GDPR', status: 'compliant', score: 92 },
    { name: 'AMLD6', status: 'at-risk', score: 67 },
    { name: 'MiFID II', status: 'non-compliant', score: 43 },
    { name: 'PSD2', status: 'compliant', score: 88 }
];
// Control status data for donut chart
const controlStatusData = [
    { name: 'In-Progress', value: 97, fill: '#cbd5e1' },
    { name: 'Cancelled', value: 1, fill: '#e2e8f0' },
    { name: 'On Approval', value: 7, fill: '#fdba74' },
    { name: 'Overdue', value: 19, fill: '#ef4444' }
];
// Key controls data for donut chart
const keyControlsData = [
    { name: 'Tested', value: 7, fill: '#22c55e' },
    { name: 'Planned', value: 0, fill: '#f97316' },
    { name: 'Not Planned', value: 260, fill: '#94a3b8' }
];
// Risk profile data for donut chart
const riskProfileData = [
    { name: 'High Risk', value: 22, fill: '#ef4444' },
    { name: 'Medium Risk', value: 38, fill: '#f97316' },
    { name: 'Low Risk', value: 40, fill: '#22c55e' }
];
const ComplianceStatusWidget = ({ onRemove }) => {
    const isMobile = useIsMobile();
    const getStatusIcon = (status) => {
        switch (status) {
            case 'compliant':
                return _jsx(CheckCircle2, { className: 'w-5 h-5 text-green-500' });
            case 'at-risk':
                return _jsx(AlertCircle, { className: 'w-5 h-5 text-amber-500' });
            case 'non-compliant':
                return _jsx(XCircle, { className: 'w-5 h-5 text-red-500' });
            default:
                return _jsx(Shield, { className: 'w-5 h-5 text-gray-400' });
        }
    };
    const getProgressColor = (score) => {
        if (score >= 80) {
            return 'bg-green-500';
        }
        if (score >= 60) {
            return 'bg-amber-500';
        }
        return 'bg-red-500';
    };
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (_jsx("div", { className: 'bg-white p-2 border rounded shadow-sm text-xs', children: _jsx("p", { className: 'font-medium', children: `${payload[0].name}: ${payload[0].value}` }) }));
        }
        return null;
    };
    return (_jsx(Widget, { title: 'Compliance Status', onRemove: onRemove, children: _jsxs("div", { className: 'space-y-6', children: [_jsxs("div", { className: `grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`, children: [_jsxs("div", { className: 'flex flex-col items-center justify-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm', children: [_jsx("h3", { className: 'text-sm font-medium text-gray-700', children: "Overall Status" }), _jsxs("div", { className: 'w-full h-32 mt-2 relative', children: [_jsx(ResponsiveContainer, { width: '100%', height: '100%', children: _jsxs(PieChart, { children: [_jsx(Pie, { data: riskProfileData, cx: '50%', cy: '50%', innerRadius: 35, outerRadius: 50, dataKey: 'value', startAngle: 180, endAngle: 0, children: riskProfileData.map((entry, index) => (_jsx(Cell, { fill: entry.fill }, `cell-${index}`))) }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) })] }) }), _jsxs("div", { className: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center', children: [_jsx("div", { className: 'text-2xl font-bold text-blue-700', children: "72" }), _jsx("div", { className: 'text-xs text-gray-500', children: "Score" })] })] }), _jsxs("div", { className: 'w-full mt-2', children: [_jsxs("div", { className: 'flex justify-between items-center text-xs text-gray-500', children: [_jsx("span", { children: "0" }), _jsx("span", { children: "50" }), _jsx("span", { children: "100" })] }), _jsx("div", { className: 'w-full h-2 bg-gray-200 rounded-full mt-1', children: _jsx("div", { className: 'h-full bg-amber-500 rounded-full', style: { width: '72%' } }) })] })] }), _jsxs("div", { className: 'flex flex-col items-center justify-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm', children: [_jsx("h3", { className: 'text-sm font-medium text-gray-700', children: "Control Status" }), _jsx("div", { className: 'w-full h-32 mt-2', children: _jsx(ResponsiveContainer, { width: '100%', height: '100%', children: _jsxs(PieChart, { children: [_jsx(Pie, { data: controlStatusData, cx: '50%', cy: '50%', innerRadius: 35, outerRadius: 50, dataKey: 'value', children: controlStatusData.map((entry, index) => (_jsx(Cell, { fill: entry.fill }, `cell-${index}`))) }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) })] }) }) }), _jsx("div", { className: 'grid grid-cols-2 gap-2 w-full mt-2', children: controlStatusData.map((item, index) => (_jsxs("div", { className: 'flex items-center text-xs', children: [_jsx("div", { className: 'w-3 h-3 rounded-full mr-1', style: { backgroundColor: item.fill } }), _jsxs("span", { className: 'text-gray-700', children: [item.name, ": "] }), _jsx("span", { className: 'font-medium ml-1', children: item.value })] }, index))) })] })] }), _jsxs("div", { className: 'space-y-4', children: [_jsx("h3", { className: 'text-sm font-medium text-gray-700', children: "Regulatory Compliance" }), complianceData.map(item => (_jsxs("div", { className: 'space-y-2', children: [_jsxs("div", { className: 'flex justify-between items-center', children: [_jsxs("div", { className: 'flex items-center', children: [getStatusIcon(item.status), _jsx("span", { className: 'ml-2 text-sm font-medium', children: item.name })] }), _jsxs("span", { className: 'text-sm font-medium', children: [item.score, "%"] })] }), _jsx(Progress, { value: item.score, className: `h-2 ${getProgressColor(item.score)}` })] }, item.name)))] }), _jsxs("div", { className: 'bg-white p-3 rounded-lg border border-gray-100 shadow-sm', children: [_jsx("h3", { className: 'text-sm font-medium text-gray-700 mb-2', children: "Key Controls" }), _jsxs("div", { className: 'flex flex-col sm:flex-row items-center justify-center gap-2', children: [_jsx("div", { className: 'w-28 h-28', children: _jsx(ResponsiveContainer, { width: '100%', height: '100%', children: _jsxs(PieChart, { children: [_jsx(Pie, { data: keyControlsData, cx: '50%', cy: '50%', innerRadius: 25, outerRadius: 40, dataKey: 'value', children: keyControlsData.map((entry, index) => (_jsx(Cell, { fill: entry.fill }, `cell-${index}`))) }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) })] }) }) }), _jsxs("div", { className: 'text-center sm:text-left', children: [_jsx("div", { className: 'text-2xl font-bold text-blue-700', children: "267" }), _jsx("div", { className: 'text-xs text-gray-500', children: "Key Controls" }), _jsx("div", { className: 'space-y-1 mt-2', children: keyControlsData.map((item, index) => (_jsxs("div", { className: 'flex items-center text-xs', children: [_jsx("div", { className: 'w-3 h-3 rounded-full mr-1', style: { backgroundColor: item.fill } }), _jsxs("span", { className: 'text-gray-700', children: [item.name, ": "] }), _jsx("span", { className: 'font-medium ml-1', children: item.value })] }, index))) })] })] })] }), _jsxs("div", { className: 'pt-2 text-sm', children: [_jsxs("div", { className: 'flex justify-between items-center', children: [_jsx("div", { className: 'text-gray-500', children: "Last assessment:" }), _jsx("div", { className: 'font-medium', children: "April 12, 2023" })] }), _jsxs("div", { className: 'flex justify-between items-center mt-1', children: [_jsx("div", { className: 'text-gray-500', children: "Next assessment due:" }), _jsx("div", { className: 'font-medium', children: "June 15, 2023" })] })] })] }) }));
};
export default ComplianceStatusWidget;
