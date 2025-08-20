import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Circle } from 'lucide-react';
import { solutions } from '@/data/solutionsData';
import SolutionNavigation from './solutions/SolutionNavigation';
import SolutionDetail from './solutions/SolutionDetail';
const ModularSolutionsSection = () => {
    const [activeSolution, setActiveSolution] = useState(solutions[0]?.id || '');
    const activeSolutionData = solutions.find(solution => solution.id === activeSolution) ||
        solutions[0] || {
        id: 'default',
        title: 'Default Solution',
        description: 'Default solution description',
        icon: Circle,
        color: 'from-blue-500 to-indigo-600'
    };
    return (_jsxs("section", { className: 'py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden', children: [_jsxs("div", { className: 'absolute inset-0 overflow-hidden', children: [_jsx("div", { className: 'absolute -top-[40%] -right-[10%] w-[60%] h-[80%] rounded-full bg-blue-50 blur-3xl opacity-70' }), _jsx("div", { className: 'absolute -bottom-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-indigo-50 blur-3xl opacity-70' })] }), _jsxs("div", { className: 'container relative z-10', children: [_jsxs("div", { className: 'text-center mb-16', children: [_jsx("h2", { className: 'text-3xl md:text-4xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700', children: "Modular Solutions" }), _jsx("p", { className: 'text-lg text-slate-700 max-w-2xl mx-auto', children: "A comprehensive ecosystem of tools designed to elevate your GRC professional journey" })] }), _jsxs("div", { className: 'grid grid-cols-1 lg:grid-cols-12 gap-12', children: [_jsx(SolutionNavigation, { solutions: solutions, activeSolution: activeSolution, onSolutionChange: setActiveSolution }), _jsx("div", { className: 'lg:col-span-9', children: _jsx(SolutionDetail, { solution: activeSolutionData }) })] })] })] }));
};
export default ModularSolutionsSection;
