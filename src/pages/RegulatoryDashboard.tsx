import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Filter, RefreshCw, Download, FileText } from 'lucide-react';
import EnhancedRegulatoryCalendar from '@/components/widgets/EnhancedRegulatoryCalendar';
import RegulatoryAnalyticsWidget from '@/components/widgets/RegulatoryAnalyticsWidget';
import RegulatorySourcesWidget from '@/components/widgets/RegulatorySourcesWidget';
import RegulatoryEventDetails from '@/components/widgets/RegulatoryEventDetails';
import { RegulatoryEvent, RegulatoryEventFilter, RegulatoryJurisdiction } from '@/types/regulatory';
import { useRegulatoryEvents } from '@/hooks/useRegulatoryEvents';

const RegulatoryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // State for selected event and filter dialog
  const [selectedEvent, setSelectedEvent] = useState<RegulatoryEvent | null>(null);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  // Get regulatory events using the hook
  const {
    events,
    isLoading: isLoadingEvents,
    error,
    fetchEvents,
    updateFilter,
    filter
  } = useRegulatoryEvents({
    filter: {
      jurisdictions: user?.jurisdiction ? [user.jurisdiction as RegulatoryJurisdiction] : undefined
    },
    autoFetch: true
  });
  
  // Handle event click
  const handleEventClick = (event: RegulatoryEvent) => {
    setSelectedEvent(event);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilter: RegulatoryEventFilter) => {
    updateFilter(newFilter);
    setIsFilterDialogOpen(false);
  };
  
  // Handle export
  const handleExport = () => {
    // In a real implementation, this would generate a CSV or PDF export
    alert('Export functionality would be implemented here');
  };
  
  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft size={16} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Regulatory Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor and analyze regulatory events across jurisdictions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFilterDialogOpen(true)}
              className="h-9"
            >
              <Filter size={14} className="mr-2" />
              Filters
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="h-9"
            >
              <Download size={14} className="mr-2" />
              Export
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={fetchEvents}
              className="h-9"
            >
              <RefreshCw size={14} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {selectedEvent ? (
          <div className="grid grid-cols-1 gap-6">
            <RegulatoryEventDetails 
              event={selectedEvent} 
              onBack={() => setSelectedEvent(null)} 
            />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedRegulatoryCalendar 
                  title="Upcoming Regulatory Events" 
                  description="Monitor deadlines and implementations" 
                  initialFilter={filter}
                  onEventClick={handleEventClick}
                  maxEvents={10}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <FileText size={20} className="text-primary" />
                      Recent Updates
                    </CardTitle>
                    <CardDescription>
                      Latest regulatory changes and publications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EnhancedRegulatoryCalendar 
                      showFilters={false}
                      initialFilter={{ 
                        ...filter,
                        types: ['PUBLICATION']
                      }}
                      onEventClick={handleEventClick}
                      maxEvents={5}
                      className="border-0 shadow-none"
                    />
                  </CardContent>
                </Card>
                
                <div className="md:col-span-2">
                  <RegulatoryAnalyticsWidget />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="m-0">
              <div className="grid grid-cols-1 gap-6">
                <RegulatoryAnalyticsWidget 
                  title="Comprehensive Regulatory Analytics" 
                  description="Detailed analysis of regulatory landscape across jurisdictions"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="sources" className="m-0">
              <div className="grid grid-cols-1 gap-6">
                <RegulatorySourcesWidget />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Regulatory Events</DialogTitle>
            <DialogDescription>
              Customize which regulatory events are displayed
            </DialogDescription>
          </DialogHeader>
          <FilterForm 
            initialFilter={filter} 
            onSubmit={handleFilterChange} 
            onCancel={() => setIsFilterDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

interface FilterFormProps {
  initialFilter: RegulatoryEventFilter;
  onSubmit: (filter: RegulatoryEventFilter) => void;
  onCancel: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ initialFilter, onSubmit, onCancel }) => {
  const [formFilter, setFormFilter] = useState<RegulatoryEventFilter>(initialFilter);
  
  // Get options for filter dropdowns
  const { typeOptions, priorityOptions, jurisdictionOptions, statusOptions } = useRegulatoryEvents();
  
  const handleChange = (field: keyof RegulatoryEventFilter, value: any) => {
    setFormFilter(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formFilter);
  };
  
  const handleReset = () => {
    setFormFilter({});
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Types</label>
          <div className="space-y-1">
            {typeOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id={`type-${option.value}`}
                  checked={formFilter.types?.includes(option.value as any) || false}
                  onChange={(e) => {
                    const types = formFilter.types || [];
                    if (e.target.checked) {
                      handleChange('types', [...types, option.value]);
                    } else {
                      handleChange('types', types.filter(t => t !== option.value));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <label htmlFor={`type-${option.value}`} className="text-sm">{option.label}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Priorities</label>
          <div className="space-y-1">
            {priorityOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id={`priority-${option.value}`}
                  checked={formFilter.priorities?.includes(option.value as any) || false}
                  onChange={(e) => {
                    const priorities = formFilter.priorities || [];
                    if (e.target.checked) {
                      handleChange('priorities', [...priorities, option.value]);
                    } else {
                      handleChange('priorities', priorities.filter(p => p !== option.value));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <label htmlFor={`priority-${option.value}`} className="text-sm">{option.label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Jurisdictions</label>
          <div className="space-y-1">
            {jurisdictionOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id={`jurisdiction-${option.value}`}
                  checked={formFilter.jurisdictions?.includes(option.value as any) || false}
                  onChange={(e) => {
                    const jurisdictions = formFilter.jurisdictions || [];
                    if (e.target.checked) {
                      handleChange('jurisdictions', [...jurisdictions, option.value]);
                    } else {
                      handleChange('jurisdictions', jurisdictions.filter(j => j !== option.value));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <label htmlFor={`jurisdiction-${option.value}`} className="text-sm">{option.label}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <div className="space-y-1">
            {statusOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id={`status-${option.value}`}
                  checked={formFilter.statuses?.includes(option.value as any) || false}
                  onChange={(e) => {
                    const statuses = formFilter.statuses || [];
                    if (e.target.checked) {
                      handleChange('statuses', [...statuses, option.value]);
                    } else {
                      handleChange('statuses', statuses.filter(s => s !== option.value));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <label htmlFor={`status-${option.value}`} className="text-sm">{option.label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="search-term" className="text-sm font-medium">Search Term</label>
        <input 
          type="text" 
          id="search-term" 
          value={formFilter.searchTerm || ''}
          onChange={(e) => handleChange('searchTerm', e.target.value || undefined)}
          placeholder="Search by keyword..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
      
      <div className="flex justify-between pt-4">
        <div className="space-x-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  );
};

export default RegulatoryDashboard;