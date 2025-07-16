import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface UseCase {
  id: string;
  title: string;
  description: string;
  industry: string;
  complexity: 'Low' | 'Medium' | 'High';
  status: 'Draft' | 'In Progress' | 'Completed' | 'On Hold';
  aiSolution?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const mockUseCases: UseCase[] = [
  {
    id: '1',
    title: 'GDPR Compliance Automation',
    description: 'Automate GDPR compliance checks and data subject request handling across multiple systems.',
    industry: 'Technology',
    complexity: 'High',
    status: 'Completed',
    aiSolution: 'AI-powered data mapping and automated consent management system with real-time compliance monitoring.',
    tags: ['GDPR', 'Data Privacy', 'Automation'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    createdBy: 'John Doe'
  },
  {
    id: '2',
    title: 'AML Transaction Monitoring',
    description: 'Implement intelligent transaction monitoring for anti-money laundering compliance.',
    industry: 'Financial Services',
    complexity: 'High',
    status: 'In Progress',
    aiSolution: 'Machine learning model for pattern recognition and anomaly detection in financial transactions.',
    tags: ['AML', 'Financial Crime', 'ML'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    createdBy: 'Jane Smith'
  },
  {
    id: '3',
    title: 'ESG Reporting Dashboard',
    description: 'Create automated ESG reporting dashboard for sustainability compliance.',
    industry: 'Manufacturing',
    complexity: 'Medium',
    status: 'Draft',
    tags: ['ESG', 'Sustainability', 'Reporting'],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
    createdBy: 'Mike Johnson'
  }
];

const UseCases = () => {
  const navigate = useNavigate();
  const [useCases, setUseCases] = useState<UseCase[]>(mockUseCases);
  const [filteredUseCases, setFilteredUseCases] = useState<UseCase[]>(mockUseCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form state for new/edit use case
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    industry: '',
    complexity: 'Medium' as const,
    status: 'Draft' as const,
    aiSolution: '',
    tags: ''
  });

  // Filter use cases based on search and filters
  useEffect(() => {
    let filtered = useCases;

    if (searchTerm) {
      filtered = filtered.filter(useCase => 
        useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        useCase.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        useCase.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(useCase => useCase.status === filterStatus);
    }

    if (filterIndustry !== 'all') {
      filtered = filtered.filter(useCase => useCase.industry === filterIndustry);
    }

    setFilteredUseCases(filtered);
  }, [useCases, searchTerm, filterStatus, filterIndustry]);

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

  const handleAddUseCase = () => {
    const newUseCase: UseCase = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      industry: formData.industry,
      complexity: formData.complexity,
      status: formData.status,
      aiSolution: formData.aiSolution,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: 'System'
    };

    setUseCases([...useCases, newUseCase]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: 'Use case added',
      description: 'Your use case has been successfully logged.'
    });
  };

  const handleEditUseCase = () => {
    if (!selectedUseCase) return;

    const updatedUseCase: UseCase = {
      ...selectedUseCase,
      title: formData.title,
      description: formData.description,
      industry: formData.industry,
      complexity: formData.complexity,
      status: formData.status,
      aiSolution: formData.aiSolution,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setUseCases(useCases.map(uc => uc.id === selectedUseCase.id ? updatedUseCase : uc));
    setIsEditDialogOpen(false);
    setSelectedUseCase(null);
    resetForm();
    toast({
      title: 'Use case updated',
      description: 'Your use case has been successfully updated.'
    });
  };

  const handleDeleteUseCase = (id: string) => {
    setUseCases(useCases.filter(uc => uc.id !== id));
    toast({
      title: 'Use case deleted',
      description: 'The use case has been removed.'
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      industry: '',
      complexity: 'Medium',
      status: 'Draft',
      aiSolution: '',
      tags: ''
    });
  };

  const openEditDialog = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
    setFormData({
      title: useCase.title,
      description: useCase.description,
      industry: useCase.industry,
      complexity: useCase.complexity,
      status: useCase.status,
      aiSolution: useCase.aiSolution || '',
      tags: useCase.tags.join(', ')
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
    setIsViewDialogOpen(true);
  };

  const industries = [...new Set(useCases.map(uc => uc.industry))];
  const statuses = [...new Set(useCases.map(uc => uc.status))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <DashboardLayout>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Use Cases</h1>
              <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                Explore real-world examples of how the Synapse platform is used to solve complex compliance challenges.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
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

            {/* Use Cases Grid */}
            <div className="grid gap-6">
              {filteredUseCases.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <p className="text-gray-500 mb-4">No use cases found</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>Add Your First Use Case</Button>
                  </CardContent>
                </Card>
              ) : (
                filteredUseCases.map((useCase) => (
                  <Card key={useCase.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openViewDialog(useCase)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(useCase.status)}
                            <CardTitle className="text-lg">{useCase.title}</CardTitle>
                            <Badge className={getStatusColor(useCase.status)}>
                              {useCase.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm">
                            {useCase.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); openViewDialog(useCase); }}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">{useCase.industry}</Badge>
                        <Badge variant="outline">{useCase.complexity} Complexity</Badge>
                        {useCase.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      {useCase.aiSolution && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-1">AI Solution:</p>
                          <p className="text-sm text-blue-800">{useCase.aiSolution}</p>
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-gray-500 mt-4">
                        <span>Created: {useCase.createdAt}</span>
                        <span>Updated: {useCase.updatedAt}</span>
                        <span>By: {useCase.createdBy}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{selectedUseCase?.title}</DialogTitle>
                  <DialogDescription>
                    {selectedUseCase?.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Industry:</span>
                    <span>{selectedUseCase?.industry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    <Badge className={getStatusColor(selectedUseCase?.status as UseCase['status'])}>
                      {selectedUseCase?.status}
                    </Badge>
                  </div>
                  <div className="prose max-w-none">
                    <h3>Details</h3>
                    <p>{selectedUseCase?.details}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Use Case</DialogTitle>
                  <DialogDescription>
                    Update the use case details and AI solution
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-industry">Industry</Label>
                      <Input
                        id="edit-industry"
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-complexity">Complexity</Label>
                      <Select value={formData.complexity} onValueChange={(value: any) => setFormData({...formData, complexity: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-status">Status</Label>
                      <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-aiSolution">AI Solution</Label>
                    <Textarea
                      id="edit-aiSolution"
                      value={formData.aiSolution}
                      onChange={(e) => setFormData({...formData, aiSolution: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-tags">Tags</Label>
                    <Input
                      id="edit-tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditUseCase}>
                    Update Use Case
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </DashboardLayout>
      </div>
      <Footer />
    </div>
  );
};

export default UseCases;