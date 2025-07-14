import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);

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

  // Filter startups based on current filters and search
  const filteredStartups = useMemo(() => {
    return startups.filter(startup => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchFields = [
          startup.name,
          startup.description,
          ...startup.use_cases,
          ...startup.technologies,
          ...startup.regulations
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(query)) return false;
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
  }, [startups, filters, searchQuery]);

  const displayedStartups = filteredStartups.slice(0, displayCount);
  const hasMore = filteredStartups.length > displayCount;

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI RegTech Solutions Mapping
          </h1>
          <p className="text-lg text-muted-foreground max-w-4xl">
            Explore RegTech solutions for GRC professionals at regulated firms. Filter by implementation complexity, 
            solution maturity, and business outcomes. Compare emerging startups with established leaders.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">Process → Technology → Outcome</span>
            <span className="text-sm bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">VC-Backed & Leaders</span>
            <span className="text-sm bg-accent/10 text-accent-foreground px-2 py-1 rounded">Expert Validated</span>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Describe your compliance need... (e.g., AML monitoring, GDPR automation)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
              
              <div className="hidden sm:flex border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active filters summary */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{filteredStartups.length} results with {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}</span>
              <Button variant="link" onClick={clearAllFilters} className="h-auto p-0 text-sm">
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
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

          {/* Results */}
          <div className="flex-1 min-w-0">
            {filteredStartups.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No startups found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms. Here are some popular searches:
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  {['AML', 'KYC', 'GDPR', 'Risk Management', 'Fraud Detection'].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
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
                    />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setDisplayCount(prev => prev + 12)}
                      className="min-w-32"
                    >
                      Load More
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Results summary */}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Showing {displayedStartups.length} of {filteredStartups.length} startups
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}