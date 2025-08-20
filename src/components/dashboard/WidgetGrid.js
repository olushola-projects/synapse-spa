import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';
const DashboardContext = createContext(undefined);
export const DashboardContextProvider = ({ children }) => {
    const [isDragging, setIsDragging] = useState(false);
    return (_jsx(DashboardContext.Provider, { value: { isDragging, setIsDragging }, children: children }));
};
export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboardContext must be used within a DashboardContextProvider');
    }
    return context;
};
export const WidgetGrid = ({ children, className }) => {
    return (_jsx("div", { className: cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4', className), children: children }));
};
export const Widget = ({ title, children, onRemove, className }) => {
    return (_jsxs("div", { className: cn('bg-white rounded-lg border shadow-sm h-full flex flex-col', className), children: [_jsxs("div", { className: 'flex items-center justify-between border-b p-4', children: [_jsx("h3", { className: 'font-medium', children: title }), onRemove && (_jsx("button", { onClick: onRemove, className: 'text-gray-400 hover:text-gray-600 focus:outline-none', "aria-label": 'Remove widget', children: _jsxs("svg", { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', children: [_jsx("line", { x1: '18', y1: '6', x2: '6', y2: '18' }), _jsx("line", { x1: '6', y1: '6', x2: '18', y2: '18' })] }) }))] }), _jsx("div", { className: 'flex-1 p-4 overflow-auto', children: children })] }));
};
