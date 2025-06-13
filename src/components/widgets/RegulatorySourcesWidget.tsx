import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Settings, Plus, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WidgetStateWrapper } from '@/components/widgets/WidgetStates';
import { RegulatorySourceConfig, RegulatoryJurisdiction } from '@/types/regulatory';
import { useRegulatoryEvents } from '@/hooks/useRegulatoryEvents';

interface RegulatorySourcesWidgetProps {
  title?: string;
  description?: string;
  className?: string;
}

export const RegulatorySourcesWidget: React.FC<RegulatorySourcesWidgetProps> = ({
  title = "Regulatory Sources",
  description = "Monitor and configure regulatory data sources",
  className = "",
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('active');
  const [isAddSourceDialogOpen, setIsAddSourceDialogOpen] = useState(false);
  const [isEditSourceDialogOpen, setIsEditSourceDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<RegulatorySourceConfig | null>(null);
  
  // Get regulatory sources using the hook
  const {
    sources,
    isLoadingSources,
    sourcesError,
    fetchSources,
    updateSourceConfig,
    addSourceConfig,
    deleteSourceConfig
  } = useRegulatoryEvents({
    includeSources: true,
    autoFetch: true
  });
  
  // Filter sources based on active tab
  const filteredSources = sources.filter((source) => {
    if (activeTab === 'active') return source.isActive;
    if (activeTab === 'inactive') return !source.isActive;
    return true;
  });
  
  // Handle toggling source active state
  const handleToggleSource = async (source: RegulatorySourceConfig) => {
    await updateSourceConfig({
      ...source,
      isActive: !source.isActive
    });
    fetchSources();
  };
  
  // Handle editing a source
  const handleEditSource = (source: RegulatorySourceConfig) => {
    setSelectedSource(source);
    setIsEditSourceDialogOpen(true);
  };
  
  // Handle saving edited source
  const handleSaveEditedSource = async (formData: RegulatorySourceConfig) => {
    if (selectedSource) {
      await updateSourceConfig({
        ...selectedSource,
        ...formData
      });
      setIsEditSourceDialogOpen(false);
      setSelectedSource(null);
      fetchSources();
    }
  };
  
  // Handle adding a new source
  const handleAddSource = async (formData: Omit<RegulatorySourceConfig, 'id'>) => {
    await addSourceConfig(formData as RegulatorySourceConfig);
    setIsAddSourceDialogOpen(false);
    fetchSources();
  };
  
  // Handle deleting a source
  const handleDeleteSource = async (sourceId: string) => {
    await deleteSourceConfig(sourceId);
    fetchSources();
  };
  
  // Determine widget state
  const widgetState = isLoadingSources ? 'loading' : sourcesError ? 'error' : 
                     sources.length === 0 ? 'empty' : 'idle';
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddSourceDialogOpen(true)}
              className="h-8"
            >
              <Plus size={14} className="mr-1" />
              Add Source
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchSources}
              className="h-8 w-8 p-0"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <WidgetStateWrapper 
        state={widgetState} 
        widgetName="Regulatory Sources"
        onRetry={fetchSources}
        emptyMessage="No regulatory sources configured"
      >
        <CardContent className="pt-3">
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="all">All Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="m-0">
              {renderSourcesList(filteredSources)}
            </TabsContent>
            
            <TabsContent value="inactive" className="m-0">
              {renderSourcesList(filteredSources)}
            </TabsContent>
            
            <TabsContent value="all" className="m-0">
              {renderSourcesList(filteredSources)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </WidgetStateWrapper>
      
      {/* Add Source Dialog */}
      <Dialog open={isAddSourceDialogOpen} onOpenChange={setIsAddSourceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Regulatory Source</DialogTitle>
            <DialogDescription>
              Configure a new regulatory data source to monitor
            </DialogDescription>
          </DialogHeader>
          <SourceForm onSubmit={handleAddSource} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Source Dialog */}
      <Dialog open={isEditSourceDialogOpen} onOpenChange={setIsEditSourceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Regulatory Source</DialogTitle>
            <DialogDescription>
              Update configuration for this regulatory data source
            </DialogDescription>
          </DialogHeader>
          {selectedSource && (
            <SourceForm 
              initialData={selectedSource} 
              onSubmit={handleSaveEditedSource} 
              onDelete={() => {
                handleDeleteSource(selectedSource.id);
                setIsEditSourceDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
  
  // Helper function to render sources list
  function renderSourcesList(sources: RegulatorySourceConfig[]) {
    if (sources.length === 0) {
      return (
        <div className="text-center py-8">
          <Globe className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No {activeTab === 'all' ? '' : activeTab} sources found
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {sources.map((source) => (
          <div 
            key={source.id} 
            className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-900">{source.name}</h4>
                  <Badge variant="outline" className="text-xs uppercase">
                    {source.jurisdiction}
                  </Badge>
                  {source.lastSyncStatus && (
                    <Badge 
                      variant="outline" 
                      className={source.lastSyncStatus === 'SUCCESS' ? 
                        'bg-green-100 text-green-700 border-green-200' : 
                        'bg-red-100 text-red-700 border-red-200'}
                    >
                      {source.lastSyncStatus === 'SUCCESS' ? (
                        <CheckCircle2 size={12} className="mr-1" />
                      ) : (
                        <AlertCircle size={12} className="mr-1" />
                      )}
                      {source.lastSyncStatus}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{source.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={source.isActive} 
                  onCheckedChange={() => handleToggleSource(source)}
                  aria-label={`Toggle ${source.name}`}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEditSource(source)}
                  className="h-8 w-8 p-0"
                >
                  <Settings size={14} />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Type: {source.type}</span>
              {source.lastSyncTime && (
                <span>Last synced: {new Date(source.lastSyncTime).toLocaleString()}</span>
              )}
              {source.frequency && (
                <span>Sync frequency: {source.frequency}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
};

interface SourceFormProps {
  initialData?: RegulatorySourceConfig;
  onSubmit: (data: any) => void;
  onDelete?: () => void;
}

const SourceForm: React.FC<SourceFormProps> = ({ initialData, onSubmit, onDelete }) => {
  const [formData, setFormData] = useState<Partial<RegulatorySourceConfig>>(initialData || {
    name: '',
    description: '',
    type: 'API',
    url: '',
    jurisdiction: 'EU',
    isActive: true,
    frequency: 'DAILY',
    apiKey: '',
    headers: {}
  });
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger id="type" className="col-span-3">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="API">API</SelectItem>
              <SelectItem value="RSS">RSS Feed</SelectItem>
              <SelectItem value="WEBSCRAPER">Web Scraper</SelectItem>
              <SelectItem value="MANUAL">Manual Input</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="jurisdiction" className="text-right">
            Jurisdiction
          </Label>
          <Select 
            value={formData.jurisdiction as string} 
            onValueChange={(value) => handleChange('jurisdiction', value)}
          >
            <SelectTrigger id="jurisdiction" className="col-span-3">
              <SelectValue placeholder="Select jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EU">European Union</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="SINGAPORE">Singapore</SelectItem>
              <SelectItem value="AUSTRALIA">Australia</SelectItem>
              <SelectItem value="UAE">UAE</SelectItem>
              <SelectItem value="SAUDI_ARABIA">Saudi Arabia</SelectItem>
              <SelectItem value="CHINA">China</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="url" className="text-right">
            URL
          </Label>
          <Input
            id="url"
            value={formData.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
            className="col-span-3"
            placeholder="https://"
            required={formData.type !== 'MANUAL'}
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="frequency" className="text-right">
            Sync Frequency
          </Label>
          <Select 
            value={formData.frequency as string} 
            onValueChange={(value) => handleChange('frequency', value)}
          >
            <SelectTrigger id="frequency" className="col-span-3">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOURLY">Hourly</SelectItem>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="apiKey" className="text-right">
            API Key
          </Label>
          <Input
            id="apiKey"
            type="password"
            value={formData.apiKey || ''}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            className="col-span-3"
            placeholder="Leave blank to keep existing"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">
            Active
          </Label>
          <div className="col-span-3 flex items-center space-x-2">
            <Switch 
              id="isActive"
              checked={formData.isActive} 
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
            <Label htmlFor="isActive">
              {formData.isActive ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        {initialData && onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onDelete}
            className="mr-auto"
          >
            Delete
          </Button>
        )}
        <Button type="submit">
          {initialData ? 'Update' : 'Add'} Source
        </Button>
      </DialogFooter>
    </form>
  );
};

export default RegulatorySourcesWidget;