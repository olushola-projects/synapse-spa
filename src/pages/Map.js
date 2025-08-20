import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { logger } from '@/utils/logger';
import { Search, Filter, Grid, List, ChevronDown, BarChart3, Star, Heart, ExternalLink, MapPin, Building2, Layers, Activity, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiltersPanel } from '@/components/map/FiltersPanel';
import { StartupCard } from '@/components/map/StartupCard';
import { cn } from '@/lib/utils';
export default function Map() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [startups, setStartups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(12);
    const [sortBy, setSortBy] = useState('relevance');
    const [savedSolutions, setSavedSolutions] = useState(new Set());
    const [interestedSolutions, setInterestedSolutions] = useState(new Set());
    const [activeTab, setActiveTab] = useState('solutions');
    // Extract filters from URL params
    const filters = useMemo(() => ({
        use_cases: searchParams.getAll('use_case'),
        regulations: searchParams.getAll('regulation'),
        technologies: searchParams.getAll('technology'),
        industries: searchParams.getAll('industry'),
        geographies: searchParams.getAll('geography'),
        investors: searchParams.getAll('investor'),
        funding_stages: searchParams.getAll('funding_stage'),
        company_stages: searchParams.getAll('company_stage'),
        implementation_complexity: searchParams.getAll('implementation_complexity'),
        solution_integrity: searchParams.getAll('solution_integrity')
    }), [searchParams]);
    // Load startup data
    useEffect(() => {
        const loadStartups = async () => {
            try {
                const response = await fetch('/data/startups.json');
                const data = await response.json();
                setStartups(data);
            }
            catch (error) {
                logger.error('Failed to load startup data:', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadStartups();
    }, []);
    // Enhanced interaction handlers
    const toggleSaved = useCallback((startupId) => {
        setSavedSolutions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(startupId)) {
                newSet.delete(startupId);
            }
            else {
                newSet.add(startupId);
            }
            return newSet;
        });
    }, []);
    const toggleInterested = useCallback((startupId) => {
        setInterestedSolutions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(startupId)) {
                newSet.delete(startupId);
            }
            else {
                newSet.add(startupId);
            }
            return newSet;
        });
    }, []);
    // Advanced sorting function
    const sortStartups = useCallback((startups, sortBy) => {
        return [...startups].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'founded':
                    return parseInt(b.founded, 10) - parseInt(a.founded, 10);
                case 'funding_stage': {
                    const stageOrder = {
                        Seed: 1,
                        'Series A': 2,
                        'Series B': 3,
                        'Series C': 4,
                        IPO: 5,
                        Acquired: 6
                    };
                    return (stageOrder[a.funding_stage] || 0) - (stageOrder[b.funding_stage] || 0);
                }
                case 'popularity':
                    return b.use_cases.length - a.use_cases.length;
                default:
                    return 0;
            }
        });
    }, []);
    // Filter and sort startups based on current filters, search, and sort option
    const filteredAndSortedStartups = useMemo(() => {
        const filtered = startups.filter(startup => {
            // Search query filter with enhanced matching
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const searchFields = [
                    startup.name,
                    startup.description,
                    ...startup.use_cases,
                    ...startup.technologies,
                    ...startup.regulations,
                    startup.country,
                    startup.company_stage,
                    startup.funding_stage
                ]
                    .join(' ')
                    .toLowerCase();
                // Enhanced search with partial matching and relevance scoring
                const queryWords = query.split(' ').filter(word => word.length > 2);
                const hasMatch = queryWords.length === 0 || queryWords.some(word => searchFields.includes(word));
                if (!hasMatch) {
                    return false;
                }
            }
            // Apply category filters
            if (filters.use_cases.length > 0 &&
                !filters.use_cases.some(uc => startup.use_cases.some(suc => suc.includes(uc)))) {
                return false;
            }
            if (filters.regulations.length > 0 &&
                !filters.regulations.some(reg => startup.regulations.includes(reg))) {
                return false;
            }
            if (filters.technologies.length > 0 &&
                !filters.technologies.some(tech => startup.technologies.includes(tech))) {
                return false;
            }
            if (filters.industries.length > 0 &&
                !filters.industries.some(ind => startup.industry.includes(ind))) {
                return false;
            }
            if (filters.geographies.length > 0 && !filters.geographies.includes(startup.geography)) {
                return false;
            }
            if (filters.investors.length > 0 &&
                !filters.investors.some(inv => startup.investors.includes(inv))) {
                return false;
            }
            if (filters.funding_stages.length > 0 &&
                !filters.funding_stages.includes(startup.funding_stage)) {
                return false;
            }
            if (filters.company_stages.length > 0 &&
                !filters.company_stages.includes(startup.company_stage)) {
                return false;
            }
            if (filters.implementation_complexity.length > 0 &&
                !filters.implementation_complexity.includes(startup.implementation_complexity)) {
                return false;
            }
            if (filters.solution_integrity.length > 0 &&
                !filters.solution_integrity.includes(startup.solution_integrity)) {
                return false;
            }
            return true;
        });
        return sortStartups(filtered, sortBy);
    }, [startups, filters, searchQuery, sortBy, sortStartups]);
    // Analytics and insights
    const analytics = useMemo(() => {
        const totalSolutions = filteredAndSortedStartups.length;
        const useCaseDistribution = filteredAndSortedStartups.reduce((acc, startup) => {
            startup.use_cases.forEach(useCase => {
                acc[useCase] = (acc[useCase] || 0) + 1;
            });
            return acc;
        }, {});
        const topUseCases = Object.entries(useCaseDistribution)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
        const fundingStageDistribution = filteredAndSortedStartups.reduce((acc, startup) => {
            acc[startup.funding_stage] = (acc[startup.funding_stage] || 0) + 1;
            return acc;
        }, {});
        const geographyDistribution = filteredAndSortedStartups.reduce((acc, startup) => {
            acc[startup.geography] = (acc[startup.geography] || 0) + 1;
            return acc;
        }, {});
        return {
            totalSolutions,
            topUseCases,
            fundingStageDistribution,
            geographyDistribution,
            averageUseCasesPerSolution: totalSolutions > 0
                ? filteredAndSortedStartups.reduce((sum, s) => sum + s.use_cases.length, 0) /
                    totalSolutions
                : 0
        };
    }, [filteredAndSortedStartups]);
    const displayedStartups = filteredAndSortedStartups.slice(0, displayCount);
    const hasMore = filteredAndSortedStartups.length > displayCount;
    const updateFilters = (newFilters) => {
        const newSearchParams = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, values]) => {
            values.forEach(value => {
                newSearchParams.append(key, value);
            });
        });
        setSearchParams(newSearchParams);
    };
    const clearAllFilters = () => {
        setSearchParams(new URLSearchParams());
        setSearchQuery('');
    };
    const activeFilterCount = Object.values(filters).flat().length;
    if (loading) {
        return (_jsxs("div", { className: 'min-h-screen bg-background', children: [_jsx(Navbar, {}), _jsx("div", { className: 'flex items-center justify-center h-96', children: _jsx("div", { className: 'animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full' }) }), _jsx(Footer, {})] }));
    }
    return (_jsxs("div", { className: 'min-h-screen bg-background', children: [_jsx(Navbar, {}), _jsxs("main", { className: 'container mx-auto px-4 py-8', children: [_jsx("div", { className: 'mb-12', children: _jsxs("div", { className: 'text-center max-w-6xl mx-auto', children: [_jsxs("div", { className: 'inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full px-4 py-2 mb-6', children: [_jsx(Shield, { className: 'h-4 w-4 text-blue-600' }), _jsx("span", { className: 'text-sm font-medium text-blue-700', children: "Synapse GRC Intelligence Platform" })] }), _jsxs("h1", { className: 'text-6xl font-bold text-gray-900 mb-6 leading-tight', children: ["Discover Next-Gen", _jsxs("span", { className: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent', children: [' ', "GRC", ' '] }), "Solutions"] }), _jsx("p", { className: 'text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto', children: "Advanced intelligence platform mapping compliance use cases to cutting-edge solution providers. Powered by AI-driven matching and real-time market insights." }), _jsxs("div", { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto', children: [_jsx(Card, { className: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200', children: _jsxs(CardContent, { className: 'p-4 text-center', children: [_jsxs("div", { className: 'flex items-center justify-center gap-2 mb-2', children: [_jsx(Building2, { className: 'h-5 w-5 text-blue-600' }), _jsx("span", { className: 'text-2xl font-bold text-blue-700', children: analytics.totalSolutions })] }), _jsx("p", { className: 'text-sm text-blue-600 font-medium', children: "Active Solutions" })] }) }), _jsx(Card, { className: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200', children: _jsxs(CardContent, { className: 'p-4 text-center', children: [_jsxs("div", { className: 'flex items-center justify-center gap-2 mb-2', children: [_jsx(BarChart3, { className: 'h-5 w-5 text-green-600' }), _jsx("span", { className: 'text-2xl font-bold text-green-700', children: analytics.topUseCases.length })] }), _jsx("p", { className: 'text-sm text-green-600 font-medium', children: "Use Cases" })] }) }), _jsx(Card, { className: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200', children: _jsxs(CardContent, { className: 'p-4 text-center', children: [_jsxs("div", { className: 'flex items-center justify-center gap-2 mb-2', children: [_jsx(MapPin, { className: 'h-5 w-5 text-purple-600' }), _jsx("span", { className: 'text-2xl font-bold text-purple-700', children: Object.keys(analytics.geographyDistribution).length })] }), _jsx("p", { className: 'text-sm text-purple-600 font-medium', children: "Regions" })] }) }), _jsx(Card, { className: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200', children: _jsxs(CardContent, { className: 'p-4 text-center', children: [_jsxs("div", { className: 'flex items-center justify-center gap-2 mb-2', children: [_jsx(Activity, { className: 'h-5 w-5 text-orange-600' }), _jsx("span", { className: 'text-2xl font-bold text-orange-700', children: analytics.averageUseCasesPerSolution.toFixed(1) })] }), _jsx("p", { className: 'text-sm text-orange-600 font-medium', children: "Avg Coverage" })] }) })] })] }) }), _jsx("div", { className: 'mb-8', children: _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: 'max-w-6xl mx-auto', children: [_jsxs("div", { className: 'flex flex-col lg:flex-row gap-6 mb-6', children: [_jsx("div", { className: 'flex-1', children: _jsxs("div", { className: 'relative', children: [_jsx(Search, { className: 'absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' }), _jsx(Input, { placeholder: "Describe your GRC challenge... (e.g., 'AML transaction monitoring', 'GDPR data mapping', 'SOX controls automation')", value: searchQuery, onChange: e => setSearchQuery(e.target.value), className: 'pl-12 h-16 text-base border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm' }), searchQuery && (_jsx(Button, { variant: 'ghost', size: 'sm', onClick: () => setSearchQuery(''), className: 'absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full', children: "\u00D7" }))] }) }), _jsxs("div", { className: 'flex gap-3', children: [_jsxs(Select, { value: sortBy, onValueChange: (value) => setSortBy(value), children: [_jsx(SelectTrigger, { className: 'w-48 h-16 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm', children: _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(BarChart3, { className: 'h-4 w-4 text-gray-500' }), _jsx(SelectValue, { placeholder: 'Sort by...' })] }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: 'relevance', children: "Relevance" }), _jsx(SelectItem, { value: 'name', children: "Name A-Z" }), _jsx(SelectItem, { value: 'founded', children: "Newest First" }), _jsx(SelectItem, { value: 'funding_stage', children: "Funding Stage" }), _jsx(SelectItem, { value: 'popularity', children: "Most Popular" })] })] }), _jsxs(Button, { variant: 'outline', onClick: () => setShowFilters(!showFilters), className: 'lg:hidden h-16 px-6 border-gray-200 rounded-2xl hover:bg-gray-50 bg-white/80 backdrop-blur-sm', children: [_jsx(Filter, { className: 'h-4 w-4 mr-2' }), "Filters", ' ', activeFilterCount > 0 && (_jsx(Badge, { variant: 'secondary', className: 'ml-2 bg-blue-100 text-blue-700', children: activeFilterCount }))] }), _jsxs("div", { className: 'hidden sm:flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-1 shadow-sm', children: [_jsx(Button, { variant: viewMode === 'grid' ? 'default' : 'ghost', size: 'sm', onClick: () => setViewMode('grid'), className: cn('h-14 px-4 rounded-xl transition-all duration-200', viewMode === 'grid'
                                                                ? 'bg-blue-600 text-white shadow-md'
                                                                : 'text-gray-600 hover:bg-gray-50'), children: _jsx(Grid, { className: 'h-4 w-4' }) }), _jsx(Button, { variant: viewMode === 'list' ? 'default' : 'ghost', size: 'sm', onClick: () => setViewMode('list'), className: cn('h-14 px-4 rounded-xl transition-all duration-200', viewMode === 'list'
                                                                ? 'bg-blue-600 text-white shadow-md'
                                                                : 'text-gray-600 hover:bg-gray-50'), children: _jsx(List, { className: 'h-4 w-4' }) }), _jsx(Button, { variant: viewMode === 'table' ? 'default' : 'ghost', size: 'sm', onClick: () => setViewMode('table'), className: cn('h-14 px-4 rounded-xl transition-all duration-200', viewMode === 'table'
                                                                ? 'bg-blue-600 text-white shadow-md'
                                                                : 'text-gray-600 hover:bg-gray-50'), children: _jsx(Layers, { className: 'h-4 w-4' }) })] })] })] }), _jsxs(TabsList, { className: 'grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-gray-100 rounded-2xl p-1 mb-6', children: [_jsxs(TabsTrigger, { value: 'solutions', className: 'rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm', children: [_jsx(Building2, { className: 'h-4 w-4 mr-2' }), "Solutions"] }), _jsxs(TabsTrigger, { value: 'analytics', className: 'rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm', children: [_jsx(BarChart3, { className: 'h-4 w-4 mr-2' }), "Analytics"] }), _jsxs(TabsTrigger, { value: 'saved', className: 'rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm', children: [_jsx(Heart, { className: 'h-4 w-4 mr-2' }), "Saved (", savedSolutions.size, ")"] }), _jsxs(TabsTrigger, { value: 'interested', className: 'rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm', children: [_jsx(Star, { className: 'h-4 w-4 mr-2' }), "Interested (", interestedSolutions.size, ")"] })] }), activeFilterCount > 0 && (_jsx("div", { className: 'mb-6', children: _jsx(Card, { className: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200', children: _jsx(CardContent, { className: 'p-4', children: _jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { className: 'flex items-center gap-3', children: [_jsxs("div", { className: 'flex items-center gap-2 text-blue-700', children: [_jsx(Filter, { className: 'h-4 w-4' }), _jsxs("span", { className: 'font-semibold', children: [analytics.totalSolutions, " solutions found"] })] }), _jsx("div", { className: 'flex flex-wrap gap-2', children: Object.entries(filters).map(([key, values]) => values.map(value => (_jsxs(Badge, { variant: 'secondary', className: 'bg-blue-100 text-blue-700 hover:bg-blue-200', children: [value, _jsx("button", { onClick: () => {
                                                                                const newFilters = { ...filters };
                                                                                newFilters[key] =
                                                                                    newFilters[key]?.filter((v) => v !== value) || [];
                                                                                updateFilters(newFilters);
                                                                            }, className: 'ml-1 hover:text-blue-900', children: "\u00D7" })] }, `${key}-${value}`)))) })] }), _jsx(Button, { variant: 'ghost', onClick: clearAllFilters, className: 'text-blue-600 hover:bg-blue-100 rounded-xl', children: "Clear all" })] }) }) }) }))] }) }), _jsxs("div", { className: 'flex gap-8', children: [_jsx(FiltersPanel, { className: cn('w-80 shrink-0', 'lg:block', showFilters ? 'block' : 'hidden'), filters: filters, onFiltersChange: updateFilters, startups: startups }), _jsxs("div", { className: 'flex-1 min-w-0', children: [_jsx(TabsContent, { value: 'solutions', className: 'mt-0', children: filteredAndSortedStartups.length === 0 ? (_jsx("div", { className: 'text-center py-16', children: _jsxs("div", { className: 'max-w-md mx-auto', children: [_jsx("div", { className: 'w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6', children: _jsx(Search, { className: 'h-8 w-8 text-gray-400' }) }), _jsx("h3", { className: 'text-xl font-semibold text-gray-900 mb-3', children: "No solutions found" }), _jsx("p", { className: 'text-gray-600 mb-8 leading-relaxed', children: "Try adjusting your filters or search terms. Here are some popular compliance areas to explore:" }), _jsx("div", { className: 'flex flex-wrap gap-3 justify-center', children: [
                                                            'AML Compliance',
                                                            'KYC Automation',
                                                            'GDPR Management',
                                                            'Risk Assessment',
                                                            'Fraud Detection',
                                                            'Regulatory Reporting'
                                                        ].map(term => (_jsx(Button, { variant: 'outline', size: 'sm', onClick: () => setSearchQuery(term), className: 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg', children: term }, term))) })] }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: 'mb-6', children: _jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("h2", { className: 'text-lg font-semibold text-gray-900', children: [filteredAndSortedStartups.length, " Solution", filteredAndSortedStartups.length !== 1 ? 's' : '', " Found"] }), _jsxs("div", { className: 'text-sm text-gray-500', children: ["Showing ", displayedStartups.length, " of ", filteredAndSortedStartups.length] })] }) }), viewMode === 'table' ? (_jsx("div", { className: 'bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm', children: _jsx("div", { className: 'overflow-x-auto', children: _jsxs("table", { className: 'w-full', children: [_jsx("thead", { className: 'bg-gray-50 border-b border-gray-200', children: _jsxs("tr", { children: [_jsx("th", { className: 'px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', children: "Solution" }), _jsx("th", { className: 'px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', children: "Use Cases" }), _jsx("th", { className: 'px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', children: "Stage" }), _jsx("th", { className: 'px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', children: "Geography" }), _jsx("th", { className: 'px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', children: "Actions" })] }) }), _jsx("tbody", { className: 'divide-y divide-gray-200', children: displayedStartups.map(startup => (_jsxs("tr", { className: 'hover:bg-gray-50 transition-colors', children: [_jsx("td", { className: 'px-6 py-4', children: _jsxs("div", { className: 'flex items-center', children: [_jsx("img", { className: 'h-10 w-10 rounded-lg object-cover', src: startup.logo, alt: startup.name }), _jsxs("div", { className: 'ml-4', children: [_jsx("div", { className: 'text-sm font-medium text-gray-900', children: startup.name }), _jsx("div", { className: 'text-sm text-gray-500', children: startup.country })] })] }) }), _jsx("td", { className: 'px-6 py-4', children: _jsxs("div", { className: 'flex flex-wrap gap-1', children: [startup.use_cases.slice(0, 2).map(useCase => (_jsx(Badge, { variant: 'secondary', className: 'text-xs', children: useCase }, useCase))), startup.use_cases.length > 2 && (_jsxs(Badge, { variant: 'outline', className: 'text-xs', children: ["+", startup.use_cases.length - 2] }))] }) }), _jsx("td", { className: 'px-6 py-4', children: _jsx(Badge, { variant: 'outline', className: 'text-xs', children: startup.funding_stage }) }), _jsx("td", { className: 'px-6 py-4 text-sm text-gray-900', children: startup.geography }), _jsx("td", { className: 'px-6 py-4', children: _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(Button, { variant: 'ghost', size: 'sm', onClick: () => toggleSaved(startup.id), className: cn('h-8 w-8 p-0', savedSolutions.has(startup.id)
                                                                                                ? 'text-red-600'
                                                                                                : 'text-gray-400'), children: _jsx(Heart, { className: 'h-4 w-4', fill: savedSolutions.has(startup.id) ? 'currentColor' : 'none' }) }), _jsx(Button, { variant: 'ghost', size: 'sm', onClick: () => toggleInterested(startup.id), className: cn('h-8 w-8 p-0', interestedSolutions.has(startup.id)
                                                                                                ? 'text-yellow-600'
                                                                                                : 'text-gray-400'), children: _jsx(Star, { className: 'h-4 w-4', fill: interestedSolutions.has(startup.id)
                                                                                                    ? 'currentColor'
                                                                                                    : 'none' }) }), startup.website && (_jsx(Button, { variant: 'ghost', size: 'sm', onClick: () => window.open(startup.website, '_blank'), className: 'h-8 w-8 p-0 text-gray-400 hover:text-blue-600', children: _jsx(ExternalLink, { className: 'h-4 w-4' }) }))] }) })] }, startup.id))) })] }) }) })) : (_jsx("div", { className: cn(viewMode === 'grid'
                                                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                                        : 'space-y-4'), children: displayedStartups.map(startup => (_jsx(StartupCard, { startup: startup, viewMode: viewMode, onToggleSaved: () => toggleSaved(startup.id), onToggleInterested: () => toggleInterested(startup.id), isSaved: savedSolutions.has(startup.id), isInterested: interestedSolutions.has(startup.id) }, startup.id))) })), hasMore && (_jsx("div", { className: 'mt-12 text-center', children: _jsxs(Button, { variant: 'outline', onClick: () => setDisplayCount(prev => prev + 12), className: 'min-w-40 h-12 border-gray-200 hover:bg-gray-50 rounded-xl', children: ["Load More Solutions", _jsx(ChevronDown, { className: 'ml-2 h-4 w-4' })] }) }))] })) }), _jsx(TabsContent, { value: 'analytics', className: 'mt-0', children: _jsxs("div", { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6', children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(BarChart3, { className: 'h-5 w-5' }), "Top Use Cases"] }) }), _jsx(CardContent, { children: _jsx("div", { className: 'space-y-4', children: analytics.topUseCases.map(([useCase, count], index) => (_jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { className: 'flex items-center gap-3', children: [_jsx("div", { className: 'w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center', children: index + 1 }), _jsx("span", { className: 'text-sm font-medium', children: useCase })] }), _jsxs(Badge, { variant: 'secondary', children: [count, " solutions"] })] }, useCase))) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(MapPin, { className: 'h-5 w-5' }), "Geographic Distribution"] }) }), _jsx(CardContent, { children: _jsx("div", { className: 'space-y-4', children: Object.entries(analytics.geographyDistribution)
                                                                    .sort(([, a], [, b]) => b - a)
                                                                    .slice(0, 5)
                                                                    .map(([geography, count]) => (_jsxs("div", { className: 'flex items-center justify-between', children: [_jsx("span", { className: 'text-sm font-medium', children: geography }), _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx("div", { className: 'w-20 h-2 bg-gray-200 rounded-full overflow-hidden', children: _jsx("div", { className: 'h-full bg-blue-600 rounded-full', style: { width: `${(count / analytics.totalSolutions) * 100}%` } }) }), _jsx(Badge, { variant: 'outline', children: count })] })] }, geography))) }) })] })] }) }), _jsx(TabsContent, { value: 'saved', className: 'mt-0', children: savedSolutions.size === 0 ? (_jsxs("div", { className: 'text-center py-12', children: [_jsx(Heart, { className: 'mx-auto h-12 w-12 text-gray-400 mb-4' }), _jsx("h3", { className: 'text-lg font-medium text-gray-900 mb-2', children: "No saved solutions yet" }), _jsx("p", { className: 'text-gray-500', children: "Save solutions you're interested in to access them quickly later." })] })) : (_jsx("div", { className: cn(viewMode === 'grid'
                                                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                                : 'space-y-4'), children: startups
                                                .filter(startup => savedSolutions.has(startup.id))
                                                .map(startup => (_jsx(StartupCard, { startup: startup, viewMode: viewMode, onToggleSaved: () => toggleSaved(startup.id), onToggleInterested: () => toggleInterested(startup.id), isSaved: savedSolutions.has(startup.id), isInterested: interestedSolutions.has(startup.id) }, startup.id))) })) }), _jsx(TabsContent, { value: 'interested', className: 'mt-0', children: interestedSolutions.size === 0 ? (_jsxs("div", { className: 'text-center py-12', children: [_jsx(Star, { className: 'mx-auto h-12 w-12 text-gray-400 mb-4' }), _jsx("h3", { className: 'text-lg font-medium text-gray-900 mb-2', children: "No interested solutions yet" }), _jsx("p", { className: 'text-gray-500', children: "Mark solutions you're interested in to track them here." })] })) : (_jsx("div", { className: cn(viewMode === 'grid'
                                                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                                : 'space-y-4'), children: startups
                                                .filter(startup => interestedSolutions.has(startup.id))
                                                .map(startup => (_jsx(StartupCard, { startup: startup, viewMode: viewMode, onToggleSaved: () => toggleSaved(startup.id), onToggleInterested: () => toggleInterested(startup.id), isSaved: savedSolutions.has(startup.id), isInterested: interestedSolutions.has(startup.id) }, startup.id))) })) })] })] })] }), _jsx(Footer, {})] }));
}
