import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
export function FiltersPanel({ className, filters, onFiltersChange, startups }) {
    const [openSections, setOpenSections] = useState({
        use_cases: true,
        company_stages: true,
        implementation_complexity: true,
        solution_integrity: false,
        regulations: false,
        technologies: false,
        industries: false,
        geographies: false,
        investors: false,
        funding_stages: false
    });
    // Extract unique values from startup data for filter options
    const filterOptions = {
        use_cases: [
            ...new Set(startups.flatMap(s => s.use_cases.map(uc => uc.split(' → ')[0])))
        ].sort(),
        regulations: [...new Set(startups.flatMap(s => s.regulations))].sort(),
        technologies: [...new Set(startups.flatMap(s => s.technologies))].sort(),
        industries: [...new Set(startups.flatMap(s => s.industry))].sort(),
        geographies: [...new Set(startups.map(s => s.geography))].sort(),
        investors: [...new Set(startups.flatMap(s => s.investors))].sort(),
        funding_stages: [...new Set(startups.map(s => s.funding_stage))].sort(),
        company_stages: [...new Set(startups.map(s => s.company_stage))].sort(),
        implementation_complexity: [...new Set(startups.map(s => s.implementation_complexity))].sort(),
        solution_integrity: [...new Set(startups.map(s => s.solution_integrity))].sort()
    };
    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };
    const handleFilterChange = (category, value, checked) => {
        const currentFilters = { ...filters };
        const categoryKey = category;
        if (checked) {
            currentFilters[categoryKey] = [...currentFilters[categoryKey], value];
        }
        else {
            currentFilters[categoryKey] = currentFilters[categoryKey].filter(item => item !== value);
        }
        onFiltersChange(currentFilters);
    };
    const removeFilter = (category, value) => {
        handleFilterChange(category, value, false);
    };
    const clearAllFilters = () => {
        onFiltersChange({
            use_cases: [],
            regulations: [],
            technologies: [],
            industries: [],
            geographies: [],
            investors: [],
            funding_stages: [],
            company_stages: [],
            implementation_complexity: [],
            solution_integrity: []
        });
    };
    const totalActiveFilters = Object.values(filters).flat().length;
    const filterSections = [
        { key: 'use_cases', label: 'Use Cases', icon: '🎯' },
        { key: 'company_stages', label: 'Company Stage', icon: '🚀' },
        { key: 'implementation_complexity', label: 'Implementation', icon: '⚙️' },
        { key: 'solution_integrity', label: 'Solution Maturity', icon: '✅' },
        { key: 'regulations', label: 'Regulations', icon: '📋' },
        { key: 'technologies', label: 'AI Technologies', icon: '🤖' },
        { key: 'industries', label: 'Industries', icon: '🏢' },
        { key: 'geographies', label: 'Geography', icon: '🌍' },
        { key: 'investors', label: 'Investors', icon: '💰' },
        { key: 'funding_stages', label: 'Funding Stage', icon: '📈' }
    ];
    return (_jsxs("div", { className: cn('bg-white border border-gray-200 rounded-xl p-6 h-fit shadow-sm', className), children: [_jsxs("div", { className: 'flex items-center justify-between mb-6', children: [_jsxs("div", { className: 'flex items-center gap-3', children: [_jsx("div", { className: 'p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg', children: _jsx(Filter, { className: 'h-5 w-5 text-blue-600' }) }), _jsxs("div", { children: [_jsx("h3", { className: 'font-semibold text-lg text-gray-900', children: "Filters" }), _jsx("p", { className: 'text-sm text-gray-500', children: "Refine your search" })] }), totalActiveFilters > 0 && (_jsx(Badge, { className: 'bg-blue-100 text-blue-700 border-blue-200', children: totalActiveFilters }))] }), totalActiveFilters > 0 && (_jsx(Button, { variant: 'ghost', size: 'sm', onClick: clearAllFilters, className: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors', children: "Clear all" }))] }), totalActiveFilters > 0 && (_jsxs("div", { className: 'mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100', children: [_jsxs("h4", { className: 'text-sm font-medium text-gray-700 mb-3 flex items-center gap-2', children: [_jsx("span", { className: 'w-2 h-2 bg-blue-500 rounded-full' }), "Active Filters"] }), _jsx("div", { className: 'flex flex-wrap gap-2', children: Object.entries(filters).map(([category, values]) => values.map(value => (_jsxs(Badge, { className: 'flex items-center gap-1 pr-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors', children: [_jsx("span", { className: 'text-xs truncate max-w-24', children: value }), _jsx("button", { onClick: () => removeFilter(category, value), className: 'ml-1 hover:bg-red-100 hover:text-red-600 rounded-full p-0.5 transition-colors', children: _jsx(X, { className: 'h-3 w-3' }) })] }, `${category}-${value}`)))) })] })), _jsx("div", { className: 'space-y-4', children: filterSections.map(({ key, label, icon }) => {
                    const options = filterOptions[key];
                    const activeFilters = filters[key];
                    return (_jsxs(Collapsible, { open: openSections[key], onOpenChange: () => toggleSection(key), children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsxs(Button, { variant: 'ghost', className: 'w-full justify-between p-4 h-auto hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg transition-all duration-200', children: [_jsxs("div", { className: 'flex items-center gap-3', children: [_jsx("span", { className: 'text-lg', children: icon }), _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx("span", { className: 'font-medium text-gray-900', children: label }), activeFilters.length > 0 && (_jsx(Badge, { className: 'bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5', children: activeFilters.length }))] })] }), _jsx(ChevronDown, { className: cn('h-4 w-4 transition-transform duration-200 text-gray-500', openSections[key] ? 'rotate-180' : '') })] }) }), _jsx(CollapsibleContent, { className: 'pt-3 pb-4', children: _jsx("div", { className: 'space-y-3 max-h-48 overflow-y-auto pl-4 pr-2', children: options.map(option => (_jsxs("div", { className: 'flex items-center space-x-3 group hover:bg-gray-50 p-2 rounded-md transition-colors', children: [_jsx(Checkbox, { id: `${key}-${option || 'unknown'}`, checked: activeFilters.includes(option || ''), onCheckedChange: checked => handleFilterChange(key, option || '', Boolean(checked)), className: 'data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300' }), _jsx("label", { htmlFor: `${key}-${option || 'unknown'}`, className: 'text-sm font-medium text-gray-700 cursor-pointer flex-1 leading-relaxed group-hover:text-gray-900 transition-colors', children: option })] }, option))) }) })] }, key));
                }) })] }));
}
