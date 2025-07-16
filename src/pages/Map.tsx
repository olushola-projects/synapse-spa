import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, ChevronDown, Sparkles, TrendingUp, BarChart3, Users, Target, Zap, ArrowRight, Star, Eye, Heart, BookmarkPlus, ExternalLink, MapPin, Calendar, Building2, Layers, Activity, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiltersPanel } from '@/components/map/FiltersPanel';
import { StartupCard } from '@/components/map/StartupCard';
import { cn } from '@/lib/utils';

interface Startup {
  id: string;
  name: string;
  logo: string;
  country: string;
  founded: string;
  description: string;
  website?: string;
  company_stage: string;
  implementation_complexity: string;
  solution_integrity: string;
  use_cases: string[];
  regulations: string[];
  technologies: string[];
  industry: string[];
  investors: string[];
  funding_stage: string;
  geography: string;
}

type SortOption = 'relevance' | 'name' | 'founded' | 'funding_stage' | 'popularity';
type ViewMode = 'grid' | 'list' | 'table';

export default function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [savedSolutions, setSavedSolutions] = useState<Set<string>>(new Set());
  const [interestedSolutions, setInterestedSolutions] = useState<Set<string>>(new Set());
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
    solution_integrity: searchParams.getAll('solution_integrity'),
  }), [searchParams]);

  // Load startup data
  useEffect(() => {
    const loadStartups = async () => {
      try {
        const response = await fetch('/data/startups.json');
        const data = await response.json();
        setStartups(data);
      } catch (error) {
        console.error('Failed to load startup data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStartups();
  }, []);

  // Enhanced interaction handlers
  const toggleSaved = useCallback((startupId: string) => {
    setSavedSolutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(startupId)) {
        newSet.delete(startupId);
      } else {
        newSet.add(startupId);
      }
      return newSet;
    });
  }, []);

  const toggleInterested = useCallback((startupId: string) => {
    setInterestedSolutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(startupId)) {
        newSet.delete(startupId);
      } else {
        newSet.add(startupId);
      }
      return newSet;
    });
  }, []);

  // Advanced sorting function
  const sortStartups = useCallback((startups: Startup[], sortBy: SortOption) => {
    return [...startups].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'founded':
          return parseInt(b.founded) - parseInt(a.founded);
        case 'funding_stage':
          const stageOrder = { 'Seed': 1, 'Series A': 2, 'Series B': 3, 'Series C': 4, 'IPO': 5, 'Acquired': 6 };
          return (stageOrder[a.funding_stage as keyof typeof stageOrder] || 0) - (stageOrder[b.funding_stage as keyof typeof stageOrder] || 0);
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
        ].join(' ').toLowerCase();
        
        // Enhanced search with partial matching and relevance scoring
        const queryWords = query.split(' ').filter(word => word.length > 2);
        const hasMatch = queryWords.length === 0 || queryWords.some(word => searchFields.includes(word));
        if (!hasMatch) return false;
      }

      // Apply category filters
      if (filters.use_cases.length > 0 && !filters.use_cases.some(uc => startup.use_cases.some(suc => suc.includes(uc)))) return false;
      if (filters.regulations.length > 0 && !filters.regulations.some(reg => startup.regulations.includes(reg))) return false;
      if (filters.technologies.length > 0 && !filters.technologies.some(tech => startup.technologies.includes(tech))) return false;
      if (filters.industries.length > 0 && !filters.industries.some(ind => startup.industry.includes(ind))) return false;
      if (filters.geographies.length > 0 && !filters.geographies.includes(startup.geography)) return false;
      if (filters.investors.length > 0 && !filters.investors.some(inv => startup.investors.includes(inv))) return false;
      if (filters.funding_stages.length > 0 && !filters.funding_stages.includes(startup.funding_stage)) return false;
      if (filters.company_stages.length > 0 && !filters.company_stages.includes(startup.company_stage)) return false;
      if (filters.implementation_complexity.length > 0 && !filters.implementation_complexity.includes(startup.implementation_complexity)) return false;
      if (filters.solution_integrity.length > 0 && !filters.solution_integrity.includes(startup.solution_integrity)) return false;

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
    }, {} as Record<string, number>);
    
    const topUseCases = Object.entries(useCaseDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    const fundingStageDistribution = filteredAndSortedStartups.reduce((acc, startup) => {
      acc[startup.funding_stage] = (acc[startup.funding_stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const geographyDistribution = filteredAndSortedStartups.reduce((acc, startup) => {
      acc[startup.geography] = (acc[startup.geography] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSolutions,
      topUseCases,
      fundingStageDistribution,
      geographyDistribution,
      averageUseCasesPerSolution: totalSolutions > 0 ? filteredAndSortedStartups.reduce((sum, s) => sum + s.use_cases.length, 0) / totalSolutions : 0
    };
  }, [filteredAndSortedStartups]);

  const displayedStartups = filteredAndSortedStartups.slice(0, displayCount);
  const hasMore = filteredAndSortedStartups.length > displayCount;

  const updateFilters = (newFilters: Record<string, string[]>) => {
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
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Header with Analytics */}
        <div className="mb-12">
          <div className="text-center max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Synapse GRC Intelligence Platform</span>
            </div>
            
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Next-Gen
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> GRC </span>
              Solutions
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Advanced intelligence platform mapping compliance use cases to cutting-edge solution providers. 
              Powered by AI-driven matching and real-time market insights.
            </p>
            
            {/* Real-time Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-700">{analytics.totalSolutions}</span>
                  </div>
                  <p className="text-sm text-blue-600 font-medium">Active Solutions</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-700">{analytics.topUseCases.length}</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium">Use Cases</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold text-purple-700">{Object.keys(analytics.geographyDistribution).length}</span>
                  </div>
                  <p className="text-sm text-purple-600 font-medium">Regions</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold text-orange-700">{analytics.averageUseCasesPerSolution.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-orange-600 font-medium">Avg Coverage</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Advanced Search and Navigation */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              {/* Enhanced Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Describe your GRC challenge... (e.g., 'AML transaction monitoring', 'GDPR data mapping', 'SOX controls automation')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-16 text-base border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Advanced Controls */}
              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-48 h-16 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Sort by..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="founded">Newest First</SelectItem>
                    <SelectItem value="funding_stage">Funding Stage</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden h-16 px-6 border-gray-200 rounded-2xl hover:bg-gray-50 bg-white/80 backdrop-blur-sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
                
                {/* Enhanced View Mode Selector */}
                <div className="hidden sm:flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-1 shadow-sm">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "h-14 px-4 rounded-xl transition-all duration-200",
                      viewMode === 'grid' 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "h-14 px-4 rounded-xl transition-all duration-200",
                      viewMode === 'list' 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className={cn(
                      "h-14 px-4 rounded-xl transition-all duration-200",
                      viewMode === 'table' 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-gray-100 rounded-2xl p-1 mb-6">
              <TabsTrigger value="solutions" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Building2 className="h-4 w-4 mr-2" />
                Solutions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="saved" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Heart className="h-4 w-4 mr-2" />
                Saved ({savedSolutions.size})
              </TabsTrigger>
              <TabsTrigger value="interested" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Star className="h-4 w-4 mr-2" />
                Interested ({interestedSolutions.size})
              </TabsTrigger>
            </TabsList>
            
            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <div className="mb-6">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-blue-700">
                          <Filter className="h-4 w-4" />
                          <span className="font-semibold">{analytics.totalSolutions} solutions found</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(filters).map(([key, values]) => 
                            values.map(value => (
                              <Badge key={`${key}-${value}`} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                {value}
                                <button 
                                  onClick={() => {
                                    const newFilters = { ...filters };
                                    newFilters[key] = newFilters[key].filter(v => v !== value);
                                    updateFilters(newFilters);
                                  }}
                                  className="ml-1 hover:text-blue-900"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={clearAllFilters} 
                        className="text-blue-600 hover:bg-blue-100 rounded-xl"
                      >
                        Clear all
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </Tabs>
        </div>

        <div className="flex gap-8">
          {/* Filters Panel */}
          <FiltersPanel
            className={cn(
              "w-80 shrink-0",
              "lg:block",
              showFilters ? "block" : "hidden"
            )}
            filters={filters}
            onFiltersChange={updateFilters}
            startups={startups}
          />

          {/* Tab Content */}
          <div className="flex-1 min-w-0">
            <TabsContent value="solutions" className="mt-0">
              {filteredAndSortedStartups.length === 0 ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      No solutions found
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Try adjusting your filters or search terms. Here are some popular compliance areas to explore:
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {['AML Compliance', 'KYC Automation', 'GDPR Management', 'Risk Assessment', 'Fraud Detection', 'Regulatory Reporting'].map((term) => (
                        <Button
                          key={term}
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery(term)}
                          className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg"
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {filteredAndSortedStartups.length} Solution{filteredAndSortedStartups.length !== 1 ? 's' : ''} Found
                      </h2>
                      <div className="text-sm text-gray-500">
                        Showing {displayedStartups.length} of {filteredAndSortedStartups.length}
                      </div>
                    </div>
                  </div>

                  {viewMode === 'table' ? (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Use Cases</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geography</th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {displayedStartups.map((startup) => (
                              <tr key={startup.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <img className="h-10 w-10 rounded-lg object-cover" src={startup.logo} alt={startup.name} />
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{startup.name}</div>
                                      <div className="text-sm text-gray-500">{startup.country}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    {startup.use_cases.slice(0, 2).map((useCase) => (
                                      <Badge key={useCase} variant="secondary" className="text-xs">
                                        {useCase}
                                      </Badge>
                                    ))}
                                    {startup.use_cases.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{startup.use_cases.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge variant="outline" className="text-xs">
                                    {startup.funding_stage}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {startup.geography}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleSaved(startup.id)}
                                      className={cn(
                                        "h-8 w-8 p-0",
                                        savedSolutions.has(startup.id) ? "text-red-600" : "text-gray-400"
                                      )}
                                    >
                                      <Heart className="h-4 w-4" fill={savedSolutions.has(startup.id) ? "currentColor" : "none"} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleInterested(startup.id)}
                                      className={cn(
                                        "h-8 w-8 p-0",
                                        interestedSolutions.has(startup.id) ? "text-yellow-600" : "text-gray-400"
                                      )}
                                    >
                                      <Star className="h-4 w-4" fill={interestedSolutions.has(startup.id) ? "currentColor" : "none"} />
                                    </Button>
                                    {startup.website && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(startup.website, '_blank')}
                                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className={cn(
                      viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "space-y-4"
                    )}>
                      {displayedStartups.map((startup) => (
                        <StartupCard 
                          key={startup.id} 
                          startup={startup} 
                          viewMode={viewMode}
                          onToggleSaved={() => toggleSaved(startup.id)}
                          onToggleInterested={() => toggleInterested(startup.id)}
                          isSaved={savedSolutions.has(startup.id)}
                          isInterested={interestedSolutions.has(startup.id)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Load More */}
                  {hasMore && (
                    <div className="mt-12 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setDisplayCount(prev => prev + 12)}
                        className="min-w-40 h-12 border-gray-200 hover:bg-gray-50 rounded-xl"
                      >
                        Load More Solutions
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Top Use Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topUseCases.map(([useCase, count], index) => (
                        <div key={useCase} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium">{useCase}</span>
                          </div>
                          <Badge variant="secondary">{count} solutions</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Geographic Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analytics.geographyDistribution)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([geography, count]) => (
                          <div key={geography} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{geography}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600 rounded-full" 
                                  style={{ width: `${(count / analytics.totalSolutions) * 100}%` }}
                                />
                              </div>
                              <Badge variant="outline">{count}</Badge>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Saved Solutions Tab */}
            <TabsContent value="saved" className="mt-0">
              {savedSolutions.size === 0 ? (
                <div className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved solutions yet</h3>
                  <p className="text-gray-500">Save solutions you're interested in to access them quickly later.</p>
                </div>
              ) : (
                <div className={cn(
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                )}>
                  {startups
                    .filter(startup => savedSolutions.has(startup.id))
                    .map((startup) => (
                      <StartupCard
                        key={startup.id}
                        startup={startup}
                        viewMode={viewMode}
                        onToggleSaved={() => toggleSaved(startup.id)}
                        onToggleInterested={() => toggleInterested(startup.id)}
                        isSaved={savedSolutions.has(startup.id)}
                        isInterested={interestedSolutions.has(startup.id)}
                      />
                    ))
                  }
                </div>
              )}
            </TabsContent>

            {/* Interested Solutions Tab */}
            <TabsContent value="interested" className="mt-0">
              {interestedSolutions.size === 0 ? (
                <div className="text-center py-12">
                  <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No interested solutions yet</h3>
                  <p className="text-gray-500">Mark solutions you're interested in to track them here.</p>
                </div>
              ) : (
                <div className={cn(
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                )}>
                  {startups
                    .filter(startup => interestedSolutions.has(startup.id))
                    .map((startup) => (
                      <StartupCard
                        key={startup.id}
                        startup={startup}
                        viewMode={viewMode}
                        onToggleSaved={() => toggleSaved(startup.id)}
                        onToggleInterested={() => toggleInterested(startup.id)}
                        isSaved={savedSolutions.has(startup.id)}
                        isInterested={interestedSolutions.has(startup.id)}
                      />
                    ))
                  }
                </div>
              )}
            </TabsContent>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}