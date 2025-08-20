import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
const SolutionDetail = ({ solution }) => {
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, className: 'bg-white rounded-2xl shadow-lg border border-slate-100 p-8', children: _jsxs("div", { className: 'flex flex-col md:flex-row md:items-start gap-8', children: [_jsx("div", { className: `hidden md:flex items-center justify-center w-24 h-24 rounded-xl bg-gradient-to-br ${solution.color} text-white shadow-lg`, children: _jsx(solution.icon, { className: 'h-10 w-10' }) }), _jsxs("div", { className: 'flex-1', children: [_jsx("h3", { className: 'text-2xl font-display font-bold mb-4', children: solution.title }), _jsx("p", { className: 'text-slate-700 mb-6 text-lg', children: solution.description }), _jsx("div", { className: 'mt-8', children: _jsxs(Button, { className: `bg-gradient-to-r ${solution.color} text-white hover:shadow-md transition-shadow`, children: ["Explore ", solution.title] }) })] })] }) }, solution.id));
};
export default SolutionDetail;
