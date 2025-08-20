import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// React import removed - using modern JSX transform
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { Bot } from 'lucide-react';
// Sample data for mobile charts
const regulationData = [
    { name: 'Anti-Money Laundering', value: 35 },
    { name: 'GDPR', value: 25 },
    { name: 'DORA', value: 20 },
    { name: 'PSD2', value: 15 },
    { name: 'SFDR', value: 5 }
];
// Line data removed - not used in this component
// Agent types - matching desktop version
const agentTypes = ['AML', 'ESG', 'MiFID II', 'DORA', 'Privacy'];
const MobileCharts = () => {
    return (_jsxs("div", { className: 'w-full h-full p-1', children: [_jsx("div", { className: 'text-[8px] font-medium mb-1 text-gray-600', children: "Regulatory Focus Areas" }), _jsx(ResponsiveContainer, { width: '100%', height: 100, children: _jsxs(BarChart, { data: regulationData, layout: 'vertical', barCategoryGap: 4, margin: { top: 5, right: 5, bottom: 5, left: 5 }, children: [_jsx(XAxis, { type: 'number', hide: true }), _jsx(Bar, { dataKey: 'value', radius: [0, 4, 4, 0], children: regulationData.map((_, index) => (_jsx(Cell, { fill: index === 0
                                    ? '#4F46E5'
                                    : index === 1
                                        ? '#EC4899'
                                        : index === 2
                                            ? '#10B981'
                                            : index === 3
                                                ? '#F59E0B'
                                                : '#8B5CF6' }, `cell-${index}`))) })] }) }), _jsx("div", { className: 'flex flex-col gap-1 mt-2', children: regulationData.map((item, index) => (_jsxs("div", { className: 'flex items-center justify-between text-[6px]', children: [_jsx("span", { className: 'truncate max-w-[100px] text-gray-700', children: item.name }), _jsxs("span", { className: 'text-gray-500', children: [item.value, "%"] })] }, index))) }), _jsxs("div", { className: 'mt-3', children: [_jsx("div", { className: 'text-[8px] font-medium mb-1 text-gray-600', children: "Compliance Risk Profile" }), _jsx("div", { className: 'flex justify-center', children: _jsxs("div", { className: 'w-16 h-16 relative', children: [_jsx("div", { className: 'w-full h-full rounded-full border-4 border-green-400' }), _jsx("div", { className: 'absolute inset-0 flex items-center justify-center', children: _jsxs("div", { className: 'text-center', children: [_jsx("div", { className: 'text-[10px] font-bold text-gray-800', children: "72" }), _jsx("div", { className: 'text-[6px] text-gray-500', children: "Score" })] }) })] }) }), _jsxs("div", { className: 'flex justify-between mt-1 text-[5px]', children: [_jsxs("div", { className: 'flex items-center gap-0.5', children: [_jsx("div", { className: 'w-1 h-1 rounded-full bg-red-400' }), _jsx("span", { children: "High Risk" })] }), _jsxs("div", { className: 'flex items-center gap-0.5', children: [_jsx("div", { className: 'w-1 h-1 rounded-full bg-orange-400' }), _jsx("span", { children: "Medium Risk" })] }), _jsxs("div", { className: 'flex items-center gap-0.5', children: [_jsx("div", { className: 'w-1 h-1 rounded-full bg-green-400' }), _jsx("span", { children: "Low Risk" })] })] })] }), _jsxs("div", { className: 'mt-3', children: [_jsxs("div", { className: 'text-[8px] font-medium mb-1 flex items-center gap-1 text-gray-600', children: [_jsx(Bot, { size: 8, className: 'text-blue-500' }), _jsx("span", { children: "GRC Agent Gallery" })] }), _jsx("div", { className: 'flex flex-wrap gap-1 mt-1', children: agentTypes.map((agent, index) => (_jsxs("div", { className: 'bg-white px-2 py-0.5 rounded-full border border-gray-200 text-[6px] font-medium text-gray-700 flex items-center gap-1', children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full ${['bg-red-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-amber-400'][index]}` }), agent] }, index))) })] })] }));
};
export default MobileCharts;
