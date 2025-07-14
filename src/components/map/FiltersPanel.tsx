import { useState } from 'react';
import { X, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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

interface FiltersPanelProps {
  className?: string;
  filters: {
    use_cases: string[];
    regulations: string[];
    technologies: string[];
    industries: string[];
    geographies: string[];
    investors: string[];
    funding_stages: string[];
    company_stages: string[];
    implementation_complexity: string[];
    solution_integrity: string[];
  };
  onFiltersChange: (filters: Record<string, string[]>) => void;
  startups: Startup[];
}

export function FiltersPanel({ className, filters, onFiltersChange, startups }: FiltersPanelProps) {
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
    funding_stages: false,
  });

  // Extract unique values from startup data for filter options
  const filterOptions = {
    use_cases: [...new Set(startups.flatMap(s => s.use_cases.map(uc => uc.split(' → ')[0])))].sort(),
    regulations: [...new Set(startups.flatMap(s => s.regulations))].sort(),
    technologies: [...new Set(startups.flatMap(s => s.technologies))].sort(),
    industries: [...new Set(startups.flatMap(s => s.industry))].sort(),
    geographies: [...new Set(startups.map(s => s.geography))].sort(),
    investors: [...new Set(startups.flatMap(s => s.investors))].sort(),
    funding_stages: [...new Set(startups.map(s => s.funding_stage))].sort(),
    company_stages: [...new Set(startups.map(s => s.company_stage))].sort(),
    implementation_complexity: [...new Set(startups.map(s => s.implementation_complexity))].sort(),
    solution_integrity: [...new Set(startups.map(s => s.solution_integrity))].sort(),
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    const currentFilters = { ...filters };
    const categoryKey = category as keyof typeof filters;
    
    if (checked) {
      currentFilters[categoryKey] = [...currentFilters[categoryKey], value];
    } else {
      currentFilters[categoryKey] = currentFilters[categoryKey].filter(item => item !== value);
    }
    
    onFiltersChange(currentFilters);
  };

  const removeFilter = (category: string, value: string) => {
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
      solution_integrity: [],
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
    { key: 'funding_stages', label: 'Funding Stage', icon: '📈' },
  ];

  return (
    <div className={cn("bg-card border border-border rounded-lg p-6 h-fit", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Filters</h3>
          {totalActiveFilters > 0 && (
            <Badge variant="secondary" className="ml-1">
              {totalActiveFilters}
            </Badge>
          )}
        </div>
        {totalActiveFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {totalActiveFilters > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([category, values]) =>
              values.map(value => (
                <Badge
                  key={`${category}-${value}`}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  <span className="text-xs truncate max-w-24">{value}</span>
                  <button
                    onClick={() => removeFilter(category, value)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-4">
        {filterSections.map(({ key, label, icon }) => {
          const options = filterOptions[key as keyof typeof filterOptions];
          const activeFilters = filters[key as keyof typeof filters];
          
          return (
            <Collapsible
              key={key}
              open={openSections[key as keyof typeof openSections]}
              onOpenChange={() => toggleSection(key as keyof typeof openSections)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{icon}</span>
                    <span className="font-medium text-foreground">{label}</span>
                    {activeFilters.length > 0 && (
                      <Badge variant="default" className="ml-1">
                        {activeFilters.length}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openSections[key as keyof typeof openSections] ? "rotate-180" : ""
                    )} 
                  />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pt-2 pb-4">
                <div className="space-y-3 max-h-48 overflow-y-auto pl-4">
                  {options.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${key}-${option}`}
                        checked={activeFilters.includes(option)}
                        onCheckedChange={(checked) =>
                          handleFilterChange(key, option, checked as boolean)
                        }
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={`${key}-${option}`}
                        className="text-sm font-medium text-foreground cursor-pointer flex-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}