import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// React import removed - using modern JSX transform
import { PieChart as PieChartIcon, Cpu } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
// Chart data
const pieChartData = [
    { name: 'GDPR', value: 35, fill: '#4F46E5' },
    { name: 'AMLD6', value: 25, fill: '#EC4899' },
    { name: 'DORA', value: 20, fill: '#10B981' },
    { name: 'PSD2', value: 15, fill: '#F59E0B' },
    { name: 'SFDR', value: 5, fill: '#8B5CF6' }
];
const donutPieData = [
    { name: 'High Risk', value: 22, fill: '#ef4444' },
    { name: 'Medium Risk', value: 38, fill: '#f97316' },
    { name: 'Low Risk', value: 40, fill: '#22c55e' }
];
const barChartData = [
    { name: 'Engagement', value: 27, fill: '#cbd5e1' },
    { name: 'Cancelled', value: 5, fill: '#e2e8f0' },
    { name: 'Projects', value: 7, fill: '#fdba74' },
    { name: 'Contributions', value: 19, fill: '#ef4444' },
    { name: 'CV Matches', value: 32, fill: '#4F46E5' },
    { name: 'Badges', value: 65, fill: '#10B981' }
];
export const RegulatoryFocusChart = () => {
    return (_jsxs("div", { className: 'h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow', children: [_jsxs("div", { className: 'flex items-center justify-between mb-0.5', children: [_jsxs("div", { className: 'flex items-center gap-1', children: [_jsx(PieChartIcon, { size: 8, className: 'text-violet-500' }), _jsx("div", { className: 'text-gray-800 text-[6px] sm:text-[7px] font-medium', children: "Regulatory Focus Areas" })] }), _jsx("div", { className: 'text-gray-500 text-[4px] sm:text-[5px]', children: "Distribution" })] }), _jsxs("div", { className: 'h-[80%] flex', children: [_jsx("div", { className: 'w-2/3 h-full', children: _jsx(ResponsiveContainer, { width: '100%', height: '100%', children: _jsx(PieChart, { children: _jsx(Pie, { data: pieChartData, cx: '50%', cy: '50%', innerRadius: 15, outerRadius: 25, dataKey: 'value', children: pieChartData.map((entry, index) => (_jsx(Cell, { fill: entry.fill }, `cell-${index}`))) }) }) }) }), _jsx("div", { className: 'w-1/3 flex flex-col justify-center space-y-0.5', children: pieChartData.map((entry, index) => (_jsxs("div", { className: 'flex items-center text-[4px]', children: [_jsx("div", { className: 'w-1 h-1 rounded-full mr-0.5', style: { backgroundColor: entry.fill } }), _jsx("span", { className: 'text-gray-700', children: entry.name }), _jsxs("span", { className: 'ml-auto text-gray-500', children: [entry.value, "%"] })] }, index))) })] })] }));
};
export const ComplianceRiskChart = () => {
    return (_jsxs("div", { className: 'h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow', children: [_jsxs("div", { className: 'flex items-center justify-between mb-0.5', children: [_jsxs("div", { className: 'flex items-center gap-1', children: [_jsx(PieChartIcon, { size: 8, className: 'text-indigo-500' }), _jsx("div", { className: 'text-gray-800 text-[6px] sm:text-[7px] font-medium', children: "Compliance Risk Profile" })] }), _jsx("div", { className: 'text-gray-500 text-[4px] sm:text-[5px]', children: "Q2 2025" })] }), _jsxs("div", { className: 'h-[80%] w-full relative', children: [_jsx(ResponsiveContainer, { width: '100%', height: '100%', children: _jsx(PieChart, { children: _jsx(Pie, { data: donutPieData, cx: '50%', cy: '50%', innerRadius: 20, outerRadius: 30, startAngle: 90, endAngle: -270, dataKey: 'value', children: donutPieData.map((entry, index) => (_jsx(Cell, { fill: entry.fill }, `donut-cell-${index}`))) }) }) }), _jsx("div", { className: 'absolute inset-0 flex items-center justify-center', children: _jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'text-gray-800 text-[6px] font-bold', children: "72" }), _jsx("div", { className: 'text-gray-500 text-[4px]', children: "Score" })] }) })] }), _jsx("div", { className: 'flex justify-between mt-1 px-0.5', children: donutPieData.map((entry, index) => (_jsxs("div", { className: 'flex items-center text-[3px] sm:text-[4px]', children: [_jsx("div", { className: 'w-1 h-1 rounded-full mr-0.5', style: { backgroundColor: entry.fill } }), _jsx("span", { className: 'text-gray-700', children: entry.name }), _jsxs("span", { className: 'ml-1 text-gray-500', children: [entry.value, "%"] })] }, index))) })] }));
};
export const ControlStatusChart = () => {
    return (_jsxs("div", { className: 'h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow', children: [_jsxs("div", { className: 'flex items-center justify-between mb-0.5', children: [_jsxs("div", { className: 'flex items-center gap-1', children: [_jsx(Cpu, { size: 8, className: 'text-emerald-500' }), _jsx("div", { className: 'text-gray-800 text-[6px] sm:text-[7px] font-medium', children: "GRC Agent Gallery" })] }), _jsx("div", { className: 'text-gray-500 text-[4px] sm:text-[5px]', children: "5 Available" })] }), _jsx("div", { className: 'h-[80%] flex items-center', children: _jsx("div", { className: 'w-full flex flex-wrap gap-1 justify-center', children: barChartData.slice(0, 5).map((_, index) => (_jsxs("div", { className: 'flex items-center gap-1 px-1 py-0.5 bg-white rounded border border-gray-100 hover:bg-gray-50 transition-colors', children: [_jsx("div", { className: 'w-1 h-1 rounded-full', style: {
                                    backgroundColor: ['#ef4444', '#f97316', '#10B981', '#4F46E5', '#8B5CF6'][index]
                                } }), _jsx("div", { className: 'text-[3px] sm:text-[4px] text-gray-700', children: ['AML', 'ESG', 'MiFID II', 'DORA', 'Privacy'][index] })] }, index))) }) })] }));
};
const DashboardCharts = { RegulatoryFocusChart, ComplianceRiskChart, ControlStatusChart };
export default DashboardCharts;
