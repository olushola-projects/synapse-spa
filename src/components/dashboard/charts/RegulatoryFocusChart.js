import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// React import removed - using modern JSX transform
import { PieChart } from 'lucide-react';
import { PieChart as ReChartPie, Cell, ResponsiveContainer } from 'recharts';
// Pie import removed - not used in this component
const pieChartData = [
    { name: 'GDPR', value: 35, fill: '#4F46E5' },
    { name: 'AMLD6', value: 25, fill: '#EC4899' },
    { name: 'DORA', value: 20, fill: '#10B981' },
    { name: 'PSD2', value: 15, fill: '#F59E0B' },
    { name: 'SFDR', value: 5, fill: '#8B5CF6' }
];
const RegulatoryFocusChart = () => {
    return (_jsxs("div", { className: 'h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer', children: [_jsxs("div", { className: 'flex items-center justify-between mb-0.5', children: [_jsxs("div", { className: 'flex items-center gap-1', children: [_jsx(PieChart, { size: 8, className: 'text-violet-500' }), _jsx("div", { className: 'text-gray-800 text-[6px] sm:text-[7px] font-medium', children: "Regulatory Focus Areas" })] }), _jsx("div", { className: 'text-gray-500 text-[4px] sm:text-[5px]', children: "Distribution" })] }), _jsxs("div", { className: 'h-[80%] flex', children: [_jsx("div", { className: 'w-2/3 h-full', children: _jsx(ResponsiveContainer, { width: '100%', height: '100%', children: _jsx(ReChartPie, { data: pieChartData, cx: '50%', cy: '50%', innerRadius: 15, outerRadius: 25, children: pieChartData.map((entry, index) => (_jsx(Cell, { fill: entry.fill }, `cell-${index}`))) }) }) }), _jsx("div", { className: 'w-1/3 flex flex-col justify-center space-y-0.5', children: pieChartData.map((entry, index) => (_jsxs("div", { className: 'flex items-center text-[4px]', children: [_jsx("div", { className: 'w-1 h-1 rounded-full mr-0.5', style: { backgroundColor: entry.fill } }), _jsx("span", { className: 'text-gray-700', children: entry.name }), _jsxs("span", { className: 'ml-auto text-gray-500', children: [entry.value, "%"] })] }, index))) })] })] }));
};
export default RegulatoryFocusChart;
