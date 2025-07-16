import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CheckCircle, Clock, AlertCircle, Building2, FileText, ShieldAlert, Brain, Coins, Scale, LineChart, GraduationCap, Filter, Mail, BarChart, Eye, Gauge, ShoppingBag, DollarSign, Send, Sparkles, Zap, Award, FileCheck, BookOpen, Link2, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// For analytics implementation
import { supabase } from "@/integrations/supabase/client";

// Import types and data
import { UseCase, FilterView, SortOption } from '@/types/useCases';
import { mockUseCases } from '@/data/useCasesData';

// Interface is now imported from types/useCases.ts

// This function is implemented in the component

// Function to get industry-specific icon
const getIndustryIcon = (industry: string) => {
  switch (industry.toLowerCase()) {
    case 'technology':
      return <Brain className="h-6 w-6 text-purple-500" />;
    case 'financial services':
      return <Coins className="h-6 w-6 text-green-500" />;
    case 'manufacturing':
      return <Building2 className="h-6 w-6 text-blue-500" />;
    case 'healthcare':
      return <ShieldAlert className="h-6 w-6 text-red-500" />;
    case 'legal':
      return <Scale className="h-6 w-6 text-amber-500" />;
    case 'education':
      return <GraduationCap className="h-6 w-6 text-cyan-500" />;
    case 'consulting':
      return <LineChart className="h-6 w-6 text-indigo-500" />;
    case 'retail':
      return <ShoppingBag className="h-6 w-6 text-orange-500" />;
    case 'finance':
      return <DollarSign className="h-6 w-6 text-emerald-500" />;
    default:
      return <FileText className="h-6 w-6 text-gray-500" />;
  }
};

// Get complexity icon and color
const getComplexityInfo = (complexity: UseCase['complexity']) => {
  switch (complexity) {
    case 'Low':
      return { icon: <Gauge className="h-5 w-5 text-green-500" />, color: 'text-green-500' };
    case 'Medium':
      return { icon: <Gauge className="h-5 w-5 text-yellow-500" />, color: 'text-yellow-500' };
    case 'High':
      return { icon: <Gauge className="h-5 w-5 text-red-500" />, color: 'text-red-500' };
    default:
      return { icon: <Gauge className="h-5 w-5 text-gray-500" />, color: 'text-gray-500' };
  }
};

// Mock data is now imported from data/useCasesData.ts

const UseCases = () => {
  const navigate = useNavigate();
  const [useCases, setUseCases] = useState<UseCase[]>(mockUseCases);
  const [filteredUseCases, setFilteredUseCases] = useState<UseCase[]>(mockUseCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [filterView, setFilterView] = useState<FilterView>('simple');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [complexityRange, setComplexityRange] = useState<[number, number]>([0, 2]); // 0=Low, 1=Medium, 2=High
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Extract all unique tags from use cases
  const allTags = [...new Set(useCases.flatMap(uc => uc.tags))];

  // Helper function to map complexity string to number
  const complexityToNumber = (complexity: UseCase['complexity']): number => {
    switch (complexity) {
      case 'Low': return 0;
      case 'Medium': return 1;
      case 'High': return 2;
      default: return 1;
    }
  };

  // Helper function to map number to complexity string
  const numberToComplexity = (num: number): UseCase['complexity'] => {
    switch (num) {
      case 0: return 'Low';
      case 1: return 'Medium';
      case 2: return 'High';
      default: return 'Medium';
    }
  };

  // Filter use cases based on search and filters
  useEffect(() => {
    let filtered = useCases;

    // Basic text search
    if (searchTerm) {
      filtered = filtered.filter(useCase => 
        useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        useCase.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        useCase.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Simple filters
    if (filterStatus !== 'all') {
      filtered = filtered.filter(useCase => useCase.status === filterStatus);
    }

    if (filterIndustry !== 'all') {
      filtered = filtered.filter(useCase => useCase.industry === filterIndustry);
    }

    // Advanced filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(useCase => 
        selectedTags.some(tag => useCase.tags.includes(tag))
      );
    }

    // Complexity range filter
    filtered = filtered.filter(useCase => {
      const complexityNum = complexityToNumber(useCase.complexity);
      return complexityNum >= complexityRange[0] && complexityNum <= complexityRange[1];
    });

    // Sorting
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredUseCases(filtered);
  }, [useCases, searchTerm, filterStatus, filterIndustry, selectedTags, complexityRange, sortBy]);

  const getStatusIcon = (status: UseCase['status']) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'On Hold':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: UseCase['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Track use case interactions for analytics
  const trackUseCaseInteraction = async (useCase: UseCase, action: 'view' | 'contact') => {
    // Update local state first for immediate UI feedback
    const updatedUseCases = useCases.map(uc => {
      if (uc.id === useCase.id) {
        return { ...uc, viewCount: (uc.viewCount || 0) + 1 };
      }
      return uc;
    });
    setUseCases(updatedUseCases);
    
    // Log to console for development
    console.log(`Analytics: ${action} interaction with use case ${useCase.id} - ${useCase.title}`);
    
    // In a real implementation, you would send this data to your analytics service
    // This is a placeholder for actual analytics implementation
    try {
      // Example: If using Supabase or similar service
      // await supabase
      //   .from('use_case_analytics')
      //   .insert([
      //     { 
      //       use_case_id: useCase.id, 
      //       action, 
      //       timestamp: new Date().toISOString() 
      //     }
      //   ]);
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  };

  const handleViewUseCase = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
    setIsViewDialogOpen(true);
    trackUseCaseInteraction(useCase, 'view');
  };
  
  const handleContactRequest = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
    setIsContactDialogOpen(true);
    trackUseCaseInteraction(useCase, 'contact');
  };
  
  const handleSubmitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUseCase) return;
    
    // In a real implementation, you would send this data to your backend
    // This is a placeholder for actual form submission
    try {
      // Example API call
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     useCaseId: selectedUseCase.id,
      //     email: contactEmail,
      //     message: contactMessage
      //   })
      // });
      
      // Show success message
      toast({
        title: "Contact request sent",
        description: "We've received your inquiry and will get back to you soon.",
      });
      
      // Reset form and close dialog
      setContactEmail('');
      setContactMessage('');
      setIsContactDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      toast({
        title: "Failed to send request",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    }
  };

  const industries = [...new Set(useCases.map(uc => uc.industry))];
  const statuses = [...new Set(useCases.map(uc => uc.status))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Use Cases</h1>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Explore real-world examples of how the Synapse platform is used to solve complex compliance challenges.
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={sortBy === 'newest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('newest')}
                className="flex items-center gap-1"
              >
                <Clock className="h-4 w-4" />
                Newest
              </Button>
              <Button
                variant={sortBy === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('popular')}
                className="flex items-center gap-1"
              >
                <BarChart className="h-4 w-4" />
                Most Popular
              </Button>
            </div>
          </div>

          {/* Tabs for Simple/Advanced Filters */}
          <Tabs defaultValue="simple" className="mb-6">
            <TabsList className="grid w-full md:w-80 grid-cols-2">
              <TabsTrigger 
                value="simple" 
                onClick={() => setFilterView('simple')}
              >
                Simple Filters
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                onClick={() => setFilterView('advanced')}
              >
                Advanced Filters
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="simple" className="mt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search use cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Search & Industry</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search use cases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Status & Complexity</h3>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Complexity Range</span>
                      <span className="text-sm text-muted-foreground">
                        {numberToComplexity(complexityRange[0])} - {numberToComplexity(complexityRange[1])}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 2]}
                      min={0}
                      max={2}
                      step={1}
                      value={complexityRange}
                      onValueChange={setComplexityRange}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Tags</h3>
                    <Filter className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {allTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tag-${tag}`} 
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTags([...selectedTags, tag]);
                            } else {
                              setSelectedTags(selectedTags.filter(t => t !== tag));
                            }
                          }}
                        />
                        <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Use Cases Grid */}
          <div className="grid gap-6">
            {filteredUseCases.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <p className="text-gray-500 mb-4">No use cases found</p>
                </CardContent>
              </Card>
            ) : (
              filteredUseCases.map((useCase) => (
                <Card key={useCase.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(useCase.status)}
                            <Badge className={getStatusColor(useCase.status)}>
                              {useCase.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span>{useCase.viewCount || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            {getIndustryIcon(useCase.industry)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{useCase.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Building2 className="h-4 w-4" />
                              <span>{useCase.industry}</span>
                              <span className="mx-1">•</span>
                              {getComplexityInfo(useCase.complexity).icon}
                              <span className={getComplexityInfo(useCase.complexity).color}>
                                {useCase.complexity} Complexity
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{useCase.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {useCase.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-6 flex flex-col justify-center items-center md:w-64">
                        <Button 
                          variant="outline" 
                          className="w-full mb-3"
                          onClick={() => handleViewUseCase(useCase)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => handleContactRequest(useCase)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Contact Us
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* View Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      {getIndustryIcon(selectedUseCase?.industry || '')}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">{selectedUseCase?.title}</DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(selectedUseCase?.status as UseCase['status'])}>
                          {selectedUseCase?.status}
                        </Badge>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{selectedUseCase?.industry}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className={`text-sm ${getComplexityInfo(selectedUseCase?.complexity as UseCase['complexity']).color}`}>
                          {selectedUseCase?.complexity} Complexity
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span>{selectedUseCase?.viewCount || 0} views</span>
                  </div>
                </div>
                <DialogDescription className="mt-2">
                  Created by {selectedUseCase?.createdBy} on {selectedUseCase?.createdAt}
                  {selectedUseCase?.updatedAt && selectedUseCase?.updatedAt !== selectedUseCase?.createdAt && (
                    <span> • Updated on {selectedUseCase?.updatedAt}</span>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 my-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <h4 className="text-lg font-medium">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedUseCase?.description}</p>
                </div>
                
                {selectedUseCase?.aiSolution && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <h4 className="text-lg font-medium text-blue-900 flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Solution
                    </h4>
                    <p className="text-blue-800 leading-relaxed">{selectedUseCase?.aiSolution}</p>
                  </div>
                )}

                {selectedUseCase?.supervisoryFunction && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-indigo-500" />
                      Supervisory Function
                    </h4>
                    <p className="text-gray-700">{selectedUseCase.supervisoryFunction}</p>
                  </div>
                )}

                {selectedUseCase?.regulatoryDomain && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <Scale className="h-5 w-5 text-amber-500" />
                      Regulatory Domain
                    </h4>
                    <p className="text-gray-700">{selectedUseCase.regulatoryDomain}</p>
                  </div>
                )}

                {selectedUseCase?.technologyStack && selectedUseCase.technologyStack.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-500" />
                      Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUseCase.technologyStack.map((tech) => (
                        <Badge key={tech} variant="outline" className="px-3 py-1 text-sm">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUseCase?.implementationCost && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Implementation Cost
                    </h4>
                    <p className="text-gray-700">{selectedUseCase.implementationCost}</p>
                  </div>
                )}

                {selectedUseCase?.timeToImplement && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Time to Implement
                    </h4>
                    <p className="text-gray-700">{selectedUseCase.timeToImplement}</p>
                  </div>
                )}

                {selectedUseCase?.regulatoryReferences && selectedUseCase.regulatoryReferences.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-red-500" />
                      Regulatory References
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      {selectedUseCase.regulatoryReferences.map((ref, index) => (
                        <li key={index}>{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedUseCase?.benefits && selectedUseCase.benefits.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <Award className="h-5 w-5 text-emerald-500" />
                      Key Benefits
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      {selectedUseCase.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedUseCase?.challenges && selectedUseCase.challenges.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      Implementation Challenges
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      {selectedUseCase.challenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedUseCase?.roi && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-cyan-500" />
                      Return on Investment
                    </h4>
                    <p className="text-gray-700">{selectedUseCase.roi}</p>
                  </div>
                )}

                {selectedUseCase?.caseStudies && selectedUseCase.caseStudies.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-violet-500" />
                      Case Studies
                    </h4>
                    <div className="grid gap-4">
                      {selectedUseCase.caseStudies.map((caseStudy) => (
                        <div key={caseStudy.id} className="border rounded-lg p-4 bg-gray-50">
                          <h5 className="font-medium text-lg mb-1">{caseStudy.title}</h5>
                          <p className="text-sm text-gray-500 mb-2">{caseStudy.organization}</p>
                          <p className="text-gray-700 mb-3">{caseStudy.summary}</p>
                          <div className="space-y-1">
                            <h6 className="font-medium text-sm">Key Outcomes:</h6>
                            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                              {caseStudy.outcomes.map((outcome, index) => (
                                <li key={index}>{outcome}</li>
                              ))}
                            </ul>
                          </div>
                          {caseStudy.link && (
                            <div className="mt-3">
                              <Button variant="link" className="p-0 h-auto text-sm flex items-center gap-1">
                                <Link2 className="h-3 w-3" />
                                View Full Case Study
                                <ArrowUpRight className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUseCase?.resources && selectedUseCase.resources.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <FileText className="h-5 w-5 text-teal-500" />
                      Resources
                    </h4>
                    <div className="grid gap-2">
                      {selectedUseCase.resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between border rounded-lg p-3">
                          <div>
                            <h5 className="font-medium">{resource.title}</h5>
                            {resource.description && (
                              <p className="text-sm text-gray-500">{resource.description}</p>
                            )}
                          </div>
                          <Badge variant="outline">{resource.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="text-lg font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUseCase?.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: {selectedUseCase?.updatedAt || selectedUseCase?.createdAt}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setIsViewDialogOpen(false);
                    handleContactRequest(selectedUseCase!);
                  }}>
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Us
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Contact Dialog */}
          <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Contact Us About This Use Case</DialogTitle>
                <DialogDescription>
                  Interested in implementing "{selectedUseCase?.title}" for your organization? 
                  Fill out the form below and our team will get back to you.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmitContactForm} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@company.com" 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea 
                    id="message" 
                    placeholder="Tell us about your specific needs and how this use case might apply to your organization..." 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
                
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Request
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UseCases;