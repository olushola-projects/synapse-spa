import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  FileText,
  ShieldAlert,
  Brain,
  Coins,
  Scale,
  LineChart,
  GraduationCap,
  Filter,
  Mail,
  BarChart,
  Eye,
  Gauge,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { mockUseCases } from '@/data/useCasesData';
// Interface is now imported from types/useCases.ts
// This function is implemented in the component
// Function to get industry-specific icon
const getIndustryIcon = industry => {
  switch (industry.toLowerCase()) {
    case 'technology':
      return _jsx(Brain, { className: 'h-6 w-6 text-purple-500' });
    case 'financial services':
      return _jsx(Coins, { className: 'h-6 w-6 text-green-500' });
    case 'manufacturing':
      return _jsx(Building2, { className: 'h-6 w-6 text-blue-500' });
    case 'healthcare':
      return _jsx(ShieldAlert, { className: 'h-6 w-6 text-red-500' });
    case 'legal':
      return _jsx(Scale, { className: 'h-6 w-6 text-amber-500' });
    case 'education':
      return _jsx(GraduationCap, { className: 'h-6 w-6 text-cyan-500' });
    case 'consulting':
      return _jsx(LineChart, { className: 'h-6 w-6 text-indigo-500' });
    case 'retail':
      return _jsx(ShoppingBag, { className: 'h-6 w-6 text-orange-500' });
    case 'finance':
      return _jsx(DollarSign, { className: 'h-6 w-6 text-emerald-500' });
    default:
      return _jsx(FileText, { className: 'h-6 w-6 text-gray-500' });
  }
};
// Get complexity icon and color
const getComplexityInfo = complexity => {
  switch (complexity) {
    case 'Low':
      return {
        icon: _jsx(Gauge, { className: 'h-5 w-5 text-green-500' }),
        color: 'text-green-500'
      };
    case 'Medium':
      return {
        icon: _jsx(Gauge, { className: 'h-5 w-5 text-yellow-500' }),
        color: 'text-yellow-500'
      };
    case 'High':
      return { icon: _jsx(Gauge, { className: 'h-5 w-5 text-red-500' }), color: 'text-red-500' };
    default:
      return { icon: _jsx(Gauge, { className: 'h-5 w-5 text-gray-500' }), color: 'text-gray-500' };
  }
};
// Mock data is now imported from data/useCasesData.ts
const UseCases = () => {
  // const navigate = useNavigate();
  const [useCases, setUseCases] = useState(mockUseCases);
  const [filteredUseCases, setFilteredUseCases] = useState(mockUseCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  // const [filterView, setFilterView] = useState<FilterView>('simple');
  const [selectedTags, setSelectedTags] = useState([]);
  const [complexityRange, setComplexityRange] = useState([0, 2]); // 0=Low, 1=Medium, 2=High
  const [sortBy, setSortBy] = useState('newest');
  // Extract all unique tags from use cases
  const allTags = [...new Set(useCases.flatMap(uc => uc.tags))];
  // Helper function to map complexity string to number
  const complexityToNumber = complexity => {
    switch (complexity) {
      case 'Low':
        return 0;
      case 'Medium':
        return 1;
      case 'High':
        return 2;
      default:
        return 1;
    }
  };
  // Helper function to map number to complexity string
  const numberToComplexity = num => {
    switch (num) {
      case 0:
        return 'Low';
      case 1:
        return 'Medium';
      case 2:
        return 'High';
      default:
        return 'Medium';
    }
  };
  // Filter use cases based on search and filters
  useEffect(() => {
    let filtered = useCases;
    // Basic text search
    if (searchTerm) {
      filtered = filtered.filter(
        useCase =>
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
      filtered = filtered.filter(useCase => selectedTags.some(tag => useCase.tags.includes(tag)));
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
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    setFilteredUseCases(filtered);
  }, [useCases, searchTerm, filterStatus, filterIndustry, selectedTags, complexityRange, sortBy]);
  const getStatusIcon = status => {
    switch (status) {
      case 'Completed':
        return _jsx(CheckCircle, { className: 'h-4 w-4 text-green-500' });
      case 'In Progress':
        return _jsx(Clock, { className: 'h-4 w-4 text-blue-500' });
      case 'On Hold':
        return _jsx(AlertCircle, { className: 'h-4 w-4 text-yellow-500' });
      default:
        return _jsx(Clock, { className: 'h-4 w-4 text-gray-500' });
    }
  };
  const getStatusColor = status => {
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
  const trackUseCaseInteraction = async (useCase, action) => {
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
  const handleViewUseCase = useCase => {
    setSelectedUseCase(useCase);
    setIsViewDialogOpen(true);
    trackUseCaseInteraction(useCase, 'view');
  };
  const handleContactRequest = useCase => {
    setSelectedUseCase(useCase);
    setIsContactDialogOpen(true);
    trackUseCaseInteraction(useCase, 'contact');
  };
  const handleSubmitContactForm = async e => {
    e.preventDefault();
    if (!selectedUseCase) {
      return;
    }
    // In a real implementation, you would send this data to your backend
    // This is a placeholder for actual form submission
    try {
      // Example API call using Supabase Edge Function
      // await supabase.functions.invoke('contact', {
      //   body: {
      //     useCaseId: selectedUseCase.id,
      //     email: contactEmail,
      //     message: contactMessage
      //   })
      // });
      // Show success message
      toast({
        title: 'Contact request sent',
        description: "We've received your inquiry and will get back to you soon."
      });
      // Reset form and close dialog
      setContactEmail('');
      setContactMessage('');
      setIsContactDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      toast({
        title: 'Failed to send request',
        description: 'Please try again later or contact us directly.',
        variant: 'destructive'
      });
    }
  };
  const industries = [...new Set(useCases.map(uc => uc.industry))];
  const statuses = [...new Set(useCases.map(uc => uc.status))];
  return _jsxs('div', {
    className: 'min-h-screen flex flex-col',
    children: [
      _jsx(Navbar, {}),
      _jsx('div', {
        className: 'flex-grow',
        children: _jsxs('div', {
          className: 'container mx-auto px-4 py-12',
          children: [
            _jsxs('div', {
              className: 'text-center mb-8',
              children: [
                _jsx('h1', { className: 'text-3xl font-bold', children: 'Use Cases' }),
                _jsx('p', {
                  className: 'text-gray-500 mt-2 max-w-2xl mx-auto',
                  children:
                    'Explore real-world examples of how the Synapse platform is used to solve complex compliance challenges.'
                })
              ]
            }),
            _jsx('div', {
              className: 'flex justify-end mb-4',
              children: _jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  _jsxs(Button, {
                    variant: sortBy === 'newest' ? 'default' : 'outline',
                    size: 'sm',
                    onClick: () => setSortBy('newest'),
                    className: 'flex items-center gap-1',
                    children: [_jsx(Clock, { className: 'h-4 w-4' }), 'Newest']
                  }),
                  _jsxs(Button, {
                    variant: sortBy === 'popular' ? 'default' : 'outline',
                    size: 'sm',
                    onClick: () => setSortBy('popular'),
                    className: 'flex items-center gap-1',
                    children: [_jsx(BarChart, { className: 'h-4 w-4' }), 'Most Popular']
                  })
                ]
              })
            }),
            _jsx(MotionConfig, {
              transition: { duration: 0.3 },
              children: _jsxs(Tabs, {
                defaultValue: 'simple',
                className: 'mb-6',
                children: [
                  _jsxs(TabsList, {
                    className: 'grid w-full md:w-80 grid-cols-2',
                    children: [
                      _jsx(TabsTrigger, {
                        value: 'simple',
                        children: _jsxs(motion.div, {
                          className: 'flex items-center gap-1',
                          whileHover: { scale: 1.05 },
                          children: [_jsx(Filter, { className: 'h-4 w-4' }), 'Simple Filters']
                        })
                      }),
                      _jsx(TabsTrigger, {
                        value: 'advanced',
                        children: _jsxs(motion.div, {
                          className: 'flex items-center gap-1',
                          whileHover: { scale: 1.05 },
                          children: [_jsx(Filter, { className: 'h-4 w-4' }), 'Advanced Filters']
                        })
                      })
                    ]
                  }),
                  _jsxs(AnimatePresence, {
                    mode: 'wait',
                    children: [
                      _jsx(TabsContent, {
                        value: 'simple',
                        className: 'mt-4',
                        children: _jsxs(motion.div, {
                          className: 'flex flex-col md:flex-row gap-4',
                          initial: { opacity: 0, y: 10 },
                          animate: { opacity: 1, y: 0 },
                          exit: { opacity: 0, y: -10 },
                          children: [
                            _jsxs(motion.div, {
                              className: 'relative flex-1',
                              whileHover: { scale: 1.01 },
                              children: [
                                _jsx(Search, {
                                  className:
                                    'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4'
                                }),
                                _jsx(Input, {
                                  placeholder: 'Search use cases...',
                                  value: searchTerm,
                                  onChange: e => setSearchTerm(e.target.value),
                                  className: 'pl-10'
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex gap-2',
                              children: [
                                _jsx(motion.div, {
                                  whileHover: { scale: 1.03 },
                                  transition: { type: 'spring', stiffness: 400 },
                                  children: _jsxs(Select, {
                                    value: filterStatus,
                                    onValueChange: setFilterStatus,
                                    children: [
                                      _jsx(SelectTrigger, {
                                        className: 'w-[140px]',
                                        children: _jsx(SelectValue, { placeholder: 'Status' })
                                      }),
                                      _jsxs(SelectContent, {
                                        children: [
                                          _jsx(SelectItem, {
                                            value: 'all',
                                            children: 'All Status'
                                          }),
                                          statuses.map(status =>
                                            _jsx(
                                              SelectItem,
                                              { value: status, children: status },
                                              status
                                            )
                                          )
                                        ]
                                      })
                                    ]
                                  })
                                }),
                                _jsx(motion.div, {
                                  whileHover: { scale: 1.03 },
                                  transition: { type: 'spring', stiffness: 400 },
                                  children: _jsxs(Select, {
                                    value: filterIndustry,
                                    onValueChange: setFilterIndustry,
                                    children: [
                                      _jsx(SelectTrigger, {
                                        className: 'w-[140px]',
                                        children: _jsx(SelectValue, { placeholder: 'Industry' })
                                      }),
                                      _jsxs(SelectContent, {
                                        children: [
                                          _jsx(SelectItem, {
                                            value: 'all',
                                            children: 'All Industries'
                                          }),
                                          industries.map(industry =>
                                            _jsx(
                                              SelectItem,
                                              { value: industry, children: industry },
                                              industry
                                            )
                                          )
                                        ]
                                      })
                                    ]
                                  })
                                })
                              ]
                            })
                          ]
                        })
                      }),
                      _jsx(TabsContent, {
                        value: 'advanced',
                        className: 'mt-4',
                        children: _jsxs(motion.div, {
                          className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
                          initial: { opacity: 0, y: 10 },
                          animate: { opacity: 1, y: 0 },
                          exit: { opacity: 0, y: -10 },
                          children: [
                            _jsxs(motion.div, {
                              className: 'space-y-4',
                              initial: { opacity: 0, x: -20 },
                              animate: { opacity: 1, x: 0 },
                              transition: { delay: 0.1 },
                              children: [
                                _jsx('h3', {
                                  className: 'text-lg font-medium',
                                  children: 'Search & Industry'
                                }),
                                _jsxs(motion.div, {
                                  className: 'relative',
                                  whileHover: { scale: 1.02 },
                                  children: [
                                    _jsx(Search, {
                                      className:
                                        'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4'
                                    }),
                                    _jsx(Input, {
                                      placeholder: 'Search use cases...',
                                      value: searchTerm,
                                      onChange: e => setSearchTerm(e.target.value),
                                      className: 'pl-10 w-full'
                                    })
                                  ]
                                }),
                                _jsx(motion.div, {
                                  whileHover: { scale: 1.02 },
                                  children: _jsxs(Select, {
                                    value: filterIndustry,
                                    onValueChange: setFilterIndustry,
                                    children: [
                                      _jsx(SelectTrigger, {
                                        className: 'w-full',
                                        children: _jsx(SelectValue, { placeholder: 'Industry' })
                                      }),
                                      _jsxs(SelectContent, {
                                        children: [
                                          _jsx(SelectItem, {
                                            value: 'all',
                                            children: 'All Industries'
                                          }),
                                          industries.map(industry =>
                                            _jsx(
                                              SelectItem,
                                              { value: industry, children: industry },
                                              industry
                                            )
                                          )
                                        ]
                                      })
                                    ]
                                  })
                                })
                              ]
                            }),
                            _jsxs(motion.div, {
                              className: 'space-y-4',
                              initial: { opacity: 0, x: 20 },
                              animate: { opacity: 1, x: 0 },
                              transition: { delay: 0.2 },
                              children: [
                                _jsx('h3', {
                                  className: 'text-lg font-medium',
                                  children: 'Status & Complexity'
                                }),
                                _jsx(motion.div, {
                                  whileHover: { scale: 1.02 },
                                  children: _jsxs(Select, {
                                    value: filterStatus,
                                    onValueChange: setFilterStatus,
                                    children: [
                                      _jsx(SelectTrigger, {
                                        className: 'w-full',
                                        children: _jsx(SelectValue, { placeholder: 'Status' })
                                      }),
                                      _jsxs(SelectContent, {
                                        children: [
                                          _jsx(SelectItem, {
                                            value: 'all',
                                            children: 'All Status'
                                          }),
                                          statuses.map(status =>
                                            _jsx(
                                              SelectItem,
                                              { value: status, children: status },
                                              status
                                            )
                                          )
                                        ]
                                      })
                                    ]
                                  })
                                }),
                                _jsxs(motion.div, {
                                  className: 'space-y-2',
                                  whileHover: { scale: 1.02 },
                                  children: [
                                    _jsxs('div', {
                                      className: 'flex justify-between',
                                      children: [
                                        _jsx('span', { children: 'Complexity Range' }),
                                        _jsxs('span', {
                                          className: 'text-sm text-muted-foreground',
                                          children: [
                                            numberToComplexity(complexityRange[0]),
                                            ' -',
                                            ' ',
                                            numberToComplexity(complexityRange[1])
                                          ]
                                        })
                                      ]
                                    }),
                                    _jsx(Slider, {
                                      defaultValue: [0, 2],
                                      min: 0,
                                      max: 2,
                                      step: 1,
                                      value: complexityRange,
                                      onValueChange: value => setComplexityRange(value),
                                      className: 'w-full'
                                    })
                                  ]
                                })
                              ]
                            }),
                            _jsxs(motion.div, {
                              className: 'md:col-span-2 space-y-4',
                              initial: { opacity: 0, y: 20 },
                              animate: { opacity: 1, y: 0 },
                              transition: { delay: 0.3 },
                              children: [
                                _jsxs('div', {
                                  className: 'flex items-center gap-2',
                                  children: [
                                    _jsx('h3', {
                                      className: 'text-lg font-medium',
                                      children: 'Tags'
                                    }),
                                    _jsx(Filter, { className: 'h-4 w-4 text-gray-500' })
                                  ]
                                }),
                                _jsx('div', {
                                  className: 'grid grid-cols-2 md:grid-cols-4 gap-2',
                                  children: allTags.map((tag, index) =>
                                    _jsxs(
                                      motion.div,
                                      {
                                        className: 'flex items-center space-x-2',
                                        initial: { opacity: 0, scale: 0.8 },
                                        animate: { opacity: 1, scale: 1 },
                                        transition: { delay: 0.1 + index * 0.02 },
                                        whileHover: { scale: 1.05 },
                                        children: [
                                          _jsx(Checkbox, {
                                            id: `tag-${tag}`,
                                            checked: selectedTags.includes(tag),
                                            onCheckedChange: checked => {
                                              if (checked) {
                                                setSelectedTags([...selectedTags, tag]);
                                              } else {
                                                setSelectedTags(
                                                  selectedTags.filter(t => t !== tag)
                                                );
                                              }
                                            }
                                          }),
                                          _jsx(Label, { htmlFor: `tag-${tag}`, children: tag })
                                        ]
                                      },
                                      tag
                                    )
                                  )
                                })
                              ]
                            })
                          ]
                        })
                      })
                    ]
                  })
                ]
              })
            }),
            _jsx(MotionConfig, {
              transition: { duration: 0.3 },
              children: _jsx('div', {
                className: 'grid gap-6',
                children:
                  filteredUseCases.length === 0
                    ? _jsx(motion.div, {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 },
                        children: _jsx(Card, {
                          children: _jsx(CardContent, {
                            className: 'flex flex-col items-center justify-center p-8',
                            children: _jsx('p', {
                              className: 'text-gray-500 mb-4',
                              children: 'No use cases found'
                            })
                          })
                        })
                      })
                    : _jsx(AnimatePresence, {
                        mode: 'wait',
                        children: _jsx('div', {
                          className: 'grid gap-6',
                          children: filteredUseCases.map((useCase, index) =>
                            _jsx(
                              motion.div,
                              {
                                initial: { opacity: 0, y: 20 },
                                animate: { opacity: 1, y: 0 },
                                exit: { opacity: 0, y: -20 },
                                transition: { delay: index * 0.05 },
                                whileHover: { scale: 1.01 },
                                children: _jsx(Card, {
                                  className:
                                    'overflow-hidden hover:shadow-lg transition-shadow duration-300',
                                  children: _jsx(CardContent, {
                                    className: 'p-0',
                                    children: _jsxs('div', {
                                      className: 'flex flex-col md:flex-row',
                                      children: [
                                        _jsxs('div', {
                                          className: 'p-6 flex-1',
                                          children: [
                                            _jsxs('div', {
                                              className: 'flex items-center justify-between mb-4',
                                              children: [
                                                _jsxs(motion.div, {
                                                  className: 'flex items-center gap-2',
                                                  whileHover: { scale: 1.05 },
                                                  children: [
                                                    getStatusIcon(useCase.status),
                                                    _jsx(Badge, {
                                                      className: getStatusColor(useCase.status),
                                                      children: useCase.status
                                                    })
                                                  ]
                                                }),
                                                _jsxs(motion.div, {
                                                  className:
                                                    'flex items-center gap-1 text-sm text-gray-500',
                                                  whileHover: { scale: 1.05 },
                                                  children: [
                                                    _jsx(Eye, { className: 'h-4 w-4' }),
                                                    _jsx('span', {
                                                      children: useCase.viewCount || 0
                                                    })
                                                  ]
                                                })
                                              ]
                                            }),
                                            _jsxs('div', {
                                              className: 'flex items-start gap-3 mb-3',
                                              children: [
                                                _jsx(motion.div, {
                                                  className: 'bg-primary/10 p-2 rounded-lg',
                                                  whileHover: { rotate: 5, scale: 1.1 },
                                                  transition: { type: 'spring', stiffness: 300 },
                                                  children: getIndustryIcon(useCase.industry)
                                                }),
                                                _jsxs('div', {
                                                  children: [
                                                    _jsx('h3', {
                                                      className: 'text-xl font-semibold',
                                                      children: useCase.title
                                                    }),
                                                    _jsxs('div', {
                                                      className:
                                                        'flex items-center gap-2 text-sm text-gray-500 mt-1',
                                                      children: [
                                                        _jsx(Building2, { className: 'h-4 w-4' }),
                                                        _jsx('span', {
                                                          children: useCase.industry
                                                        }),
                                                        _jsx('span', {
                                                          className: 'mx-1',
                                                          children: '\u2022'
                                                        }),
                                                        getComplexityInfo(useCase.complexity).icon,
                                                        _jsxs('span', {
                                                          className: getComplexityInfo(
                                                            useCase.complexity
                                                          ).color,
                                                          children: [
                                                            useCase.complexity,
                                                            ' Complexity'
                                                          ]
                                                        })
                                                      ]
                                                    })
                                                  ]
                                                })
                                              ]
                                            }),
                                            _jsx('p', {
                                              className: 'text-gray-600 mb-4',
                                              children: useCase.description
                                            }),
                                            _jsx('div', {
                                              className: 'flex flex-wrap gap-2 mb-4',
                                              children: useCase.tags.map((tag, tagIndex) =>
                                                _jsx(
                                                  motion.div,
                                                  {
                                                    initial: { opacity: 0, scale: 0.8 },
                                                    animate: { opacity: 1, scale: 1 },
                                                    transition: { delay: tagIndex * 0.05 },
                                                    whileHover: { scale: 1.1 },
                                                    children: _jsx(Badge, {
                                                      variant: 'secondary',
                                                      children: tag
                                                    })
                                                  },
                                                  tag
                                                )
                                              )
                                            })
                                          ]
                                        }),
                                        _jsxs('div', {
                                          className:
                                            'bg-gray-50 p-6 flex flex-col justify-center items-center md:w-64',
                                          children: [
                                            _jsx(motion.div, {
                                              className: 'w-full mb-3',
                                              whileHover: { scale: 1.03 },
                                              whileTap: { scale: 0.97 },
                                              children: _jsxs(Button, {
                                                variant: 'outline',
                                                className: 'w-full',
                                                onClick: () => handleViewUseCase(useCase),
                                                children: [
                                                  _jsx(Eye, { className: 'mr-2 h-4 w-4' }),
                                                  'View Details'
                                                ]
                                              })
                                            }),
                                            _jsx(motion.div, {
                                              className: 'w-full',
                                              whileHover: { scale: 1.03 },
                                              whileTap: { scale: 0.97 },
                                              children: _jsxs(Button, {
                                                variant: 'default',
                                                className: 'w-full',
                                                onClick: () => handleContactRequest(useCase),
                                                children: [
                                                  _jsx(Mail, { className: 'mr-2 h-4 w-4' }),
                                                  'Contact Us'
                                                ]
                                              })
                                            })
                                          ]
                                        })
                                      ]
                                    })
                                  })
                                })
                              },
                              useCase.id
                            )
                          )
                        })
                      })
              })
            }),
            _jsx(AnimatePresence, {
              children:
                isViewDialogOpen &&
                selectedUseCase &&
                _jsx(Dialog, {
                  open: isViewDialogOpen,
                  onOpenChange: setIsViewDialogOpen,
                  children: _jsx(DialogContent, {
                    className: 'max-w-4xl max-h-[90vh] overflow-y-auto',
                    children: _jsxs(motion.div, {
                      initial: { opacity: 0, y: -20 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: 20 },
                      transition: { duration: 0.3 },
                      children: [
                        _jsx(DialogHeader, {
                          children: _jsxs('div', {
                            className: 'flex items-start gap-4',
                            children: [
                              _jsx(motion.div, {
                                className:
                                  'bg-primary/10 p-3 rounded-lg flex items-center justify-center',
                                initial: { scale: 0.8, rotate: -5 },
                                animate: { scale: 1, rotate: 0 },
                                transition: { type: 'spring', stiffness: 300 },
                                whileHover: { rotate: 5, scale: 1.1 },
                                children: getIndustryIcon(selectedUseCase.industry)
                              }),
                              _jsxs('div', {
                                children: [
                                  _jsx(DialogTitle, {
                                    className: 'text-2xl font-bold',
                                    children: selectedUseCase.title
                                  }),
                                  _jsxs('div', {
                                    className: 'flex flex-wrap items-center gap-x-4 gap-y-2 mt-2',
                                    children: [
                                      _jsxs(motion.div, {
                                        className: 'flex items-center gap-2 text-sm text-gray-600',
                                        initial: { opacity: 0, x: -10 },
                                        animate: { opacity: 1, x: 0 },
                                        transition: { delay: 0.1 },
                                        children: [
                                          getStatusIcon(selectedUseCase.status),
                                          _jsx(Badge, {
                                            variant: 'outline',
                                            className: getStatusColor(selectedUseCase.status),
                                            children: selectedUseCase.status
                                          })
                                        ]
                                      }),
                                      _jsxs(motion.div, {
                                        className: 'flex items-center gap-2 text-sm text-gray-600',
                                        initial: { opacity: 0, x: -10 },
                                        animate: { opacity: 1, x: 0 },
                                        transition: { delay: 0.2 },
                                        children: [
                                          _jsx(Building2, { className: 'h-4 w-4' }),
                                          _jsx('span', { children: selectedUseCase.industry })
                                        ]
                                      }),
                                      _jsxs(motion.div, {
                                        className: 'flex items-center gap-2 text-sm text-gray-600',
                                        initial: { opacity: 0, x: -10 },
                                        animate: { opacity: 1, x: 0 },
                                        transition: { delay: 0.3 },
                                        children: [
                                          getComplexityInfo(selectedUseCase.complexity).icon,
                                          _jsxs('span', {
                                            className: getComplexityInfo(selectedUseCase.complexity)
                                              .color,
                                            children: [selectedUseCase.complexity, ' Complexity']
                                          })
                                        ]
                                      })
                                    ]
                                  })
                                ]
                              })
                            ]
                          })
                        }),
                        _jsxs(motion.div, {
                          className: 'py-6 grid grid-cols-1 md:grid-cols-3 gap-8',
                          initial: 'hidden',
                          animate: 'visible',
                          variants: {
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: { staggerChildren: 0.1 }
                            }
                          },
                          children: [
                            _jsxs('div', {
                              className: 'md:col-span-2 space-y-6',
                              children: [
                                _jsxs(motion.div, {
                                  variants: {
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                  },
                                  children: [
                                    _jsx('h4', {
                                      className: 'text-lg font-medium',
                                      children: 'Description'
                                    }),
                                    _jsx('p', {
                                      className: 'text-gray-700 leading-relaxed',
                                      children: selectedUseCase.description
                                    })
                                  ]
                                }),
                                selectedUseCase.aiSolution &&
                                  _jsxs(motion.div, {
                                    variants: {
                                      hidden: { opacity: 0, y: 20 },
                                      visible: { opacity: 1, y: 0 }
                                    },
                                    className: 'bg-blue-50 p-4 rounded-lg space-y-2',
                                    children: [
                                      _jsxs('h4', {
                                        className:
                                          'text-lg font-medium text-blue-900 flex items-center gap-2',
                                        children: [
                                          _jsx(Brain, { className: 'h-5 w-5' }),
                                          'AI Solution'
                                        ]
                                      }),
                                      _jsx('p', {
                                        className: 'text-blue-800 leading-relaxed',
                                        children: selectedUseCase.aiSolution
                                      })
                                    ]
                                  }),
                                selectedUseCase.supervisoryFunction &&
                                  _jsxs(motion.div, {
                                    variants: {
                                      hidden: { opacity: 0, y: 20 },
                                      visible: { opacity: 1, y: 0 }
                                    },
                                    children: [
                                      _jsxs('h4', {
                                        className: 'text-lg font-medium flex items-center gap-2',
                                        children: [
                                          _jsx(ShieldAlert, {
                                            className: 'h-5 w-5 text-indigo-500'
                                          }),
                                          'Supervisory Function'
                                        ]
                                      }),
                                      _jsx('p', {
                                        className: 'text-gray-700',
                                        children: selectedUseCase.supervisoryFunction
                                      })
                                    ]
                                  }),
                                selectedUseCase.regulatoryDomain &&
                                  _jsxs(motion.div, {
                                    variants: {
                                      hidden: { opacity: 0, y: 20 },
                                      visible: { opacity: 1, y: 0 }
                                    },
                                    children: [
                                      _jsxs('h4', {
                                        className: 'text-lg font-medium flex items-center gap-2',
                                        children: [
                                          _jsx(Scale, { className: 'h-5 w-5 text-amber-500' }),
                                          'Regulatory Domain'
                                        ]
                                      }),
                                      _jsx('p', {
                                        className: 'text-gray-700',
                                        children: selectedUseCase.regulatoryDomain
                                      })
                                    ]
                                  })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'space-y-6',
                              children: [
                                selectedUseCase.technologyStack &&
                                  selectedUseCase.technologyStack.length > 0 &&
                                  _jsxs(motion.div, {
                                    variants: {
                                      hidden: { opacity: 0, y: 20 },
                                      visible: { opacity: 1, y: 0 }
                                    },
                                    children: [
                                      _jsxs('h4', {
                                        className: 'text-lg font-medium flex items-center gap-2',
                                        children: [
                                          _jsx(Brain, { className: 'h-5 w-5 text-purple-500' }),
                                          'Technology Stack'
                                        ]
                                      }),
                                      _jsx('div', {
                                        className: 'flex flex-wrap gap-2 mt-2',
                                        children: selectedUseCase.technologyStack.map(tech =>
                                          _jsx(
                                            Badge,
                                            {
                                              variant: 'outline',
                                              className: 'px-3 py-1 text-sm',
                                              children: tech
                                            },
                                            tech
                                          )
                                        )
                                      })
                                    ]
                                  }),
                                selectedUseCase.implementationCost &&
                                  _jsxs(motion.div, {
                                    variants: {
                                      hidden: { opacity: 0, y: 20 },
                                      visible: { opacity: 1, y: 0 }
                                    },
                                    children: [
                                      _jsxs('h4', {
                                        className: 'text-lg font-medium flex items-center gap-2',
                                        children: [
                                          _jsx(DollarSign, { className: 'h-5 w-5 text-green-500' }),
                                          'Implementation Cost'
                                        ]
                                      }),
                                      _jsx('p', {
                                        className: 'text-gray-700',
                                        children: selectedUseCase.implementationCost
                                      })
                                    ]
                                  }),
                                selectedUseCase.timeToImplement &&
                                  _jsxs(motion.div, {
                                    variants: {
                                      hidden: { opacity: 0, y: 20 },
                                      visible: { opacity: 1, y: 0 }
                                    },
                                    children: [
                                      _jsxs('h4', {
                                        className: 'text-lg font-medium flex items-center gap-2',
                                        children: [
                                          _jsx(Clock, { className: 'h-5 w-5 text-blue-500' }),
                                          'Time to Implement'
                                        ]
                                      }),
                                      _jsx('p', {
                                        className: 'text-gray-700',
                                        children: selectedUseCase.timeToImplement
                                      })
                                    ]
                                  })
                              ]
                            })
                          ]
                        }),
                        _jsxs(DialogFooter, {
                          className: 'flex justify-between items-center mt-6',
                          children: [
                            _jsxs('div', {
                              className: 'text-sm text-gray-500 flex items-center gap-1',
                              children: [
                                _jsx(Clock, { className: 'h-4 w-4' }),
                                _jsxs('span', {
                                  children: [
                                    'Last updated:',
                                    ' ',
                                    new Date(
                                      selectedUseCase.updatedAt || selectedUseCase.createdAt
                                    ).toLocaleDateString()
                                  ]
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex gap-2',
                              children: [
                                _jsx(motion.div, {
                                  whileHover: { scale: 1.05 },
                                  whileTap: { scale: 0.95 },
                                  children: _jsx(Button, {
                                    variant: 'outline',
                                    onClick: () => setIsViewDialogOpen(false),
                                    children: 'Close'
                                  })
                                }),
                                _jsx(motion.div, {
                                  whileHover: { scale: 1.05 },
                                  whileTap: { scale: 0.95 },
                                  children: _jsxs(Button, {
                                    onClick: () => {
                                      setIsViewDialogOpen(false);
                                      handleContactRequest(selectedUseCase);
                                    },
                                    children: [
                                      _jsx(Mail, { className: 'mr-2 h-4 w-4' }),
                                      'Contact Us'
                                    ]
                                  })
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  })
                })
            }),
            _jsx(AnimatePresence, {
              children:
                isContactDialogOpen &&
                selectedUseCase &&
                _jsx(Dialog, {
                  open: isContactDialogOpen,
                  onOpenChange: setIsContactDialogOpen,
                  children: _jsx(DialogContent, {
                    className: 'max-w-md',
                    children: _jsxs(motion.div, {
                      initial: { opacity: 0, y: -20 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: 20 },
                      transition: { duration: 0.3 },
                      children: [
                        _jsxs(DialogHeader, {
                          children: [
                            _jsx(DialogTitle, { children: 'Contact Us About This Use Case' }),
                            _jsxs(DialogDescription, {
                              children: [
                                'Interested in implementing "',
                                selectedUseCase.title,
                                '" for your organization? Fill out the form below and our team will get back to you.'
                              ]
                            })
                          ]
                        }),
                        _jsxs('form', {
                          onSubmit: handleSubmitContactForm,
                          className: 'space-y-4 pt-4',
                          children: [
                            _jsxs(motion.div, {
                              className: 'space-y-2',
                              initial: { opacity: 0, x: -20 },
                              animate: { opacity: 1, x: 0 },
                              transition: { delay: 0.1 },
                              children: [
                                _jsx(Label, { htmlFor: 'email', children: 'Your Email' }),
                                _jsx(Input, {
                                  id: 'email',
                                  type: 'email',
                                  placeholder: 'your.email@company.com',
                                  value: contactEmail,
                                  onChange: e => setContactEmail(e.target.value),
                                  required: true
                                })
                              ]
                            }),
                            _jsxs(motion.div, {
                              className: 'space-y-2',
                              initial: { opacity: 0, x: -20 },
                              animate: { opacity: 1, x: 0 },
                              transition: { delay: 0.2 },
                              children: [
                                _jsx(Label, { htmlFor: 'message', children: 'Message' }),
                                _jsx('textarea', {
                                  id: 'message',
                                  placeholder:
                                    'Tell us about your specific needs and a little about your organization...',
                                  value: contactMessage,
                                  onChange: e => setContactMessage(e.target.value),
                                  className:
                                    'min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                  required: true
                                })
                              ]
                            }),
                            _jsxs(DialogFooter, {
                              className: 'pt-4',
                              children: [
                                _jsx(motion.div, {
                                  whileHover: { scale: 1.05 },
                                  whileTap: { scale: 0.95 },
                                  children: _jsx(Button, {
                                    type: 'button',
                                    variant: 'outline',
                                    onClick: () => setIsContactDialogOpen(false),
                                    children: 'Cancel'
                                  })
                                }),
                                _jsx(motion.div, {
                                  whileHover: { scale: 1.05 },
                                  whileTap: { scale: 0.95 },
                                  children: _jsxs(Button, {
                                    type: 'submit',
                                    children: [
                                      _jsx(Mail, { className: 'mr-2 h-4 w-4' }),
                                      'Send Request'
                                    ]
                                  })
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  })
                })
            })
          ]
        })
      }),
      _jsx(Footer, {})
    ]
  });
};
export default UseCases;
