import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Plus,
  MessageSquare,
  LineChart,
  Award,
  /* BarChart3, Activity, */ AlertCircle
} from 'lucide-react';
import { WidgetGrid, DashboardContextProvider } from '@/components/dashboard/WidgetGrid';
import RegulationTrendWidget from '@/components/widgets/RegulationTrendWidget';
import ForumPreviewWidget from '@/components/widgets/ForumPreviewWidget';
import GamificationWidget from '@/components/widgets/GamificationWidget';
import RecentQueriesWidget from '@/components/widgets/RecentQueriesWidget';
import ComplianceStatusWidget from '@/components/widgets/ComplianceStatusWidget';
import { toast } from '@/hooks/use-toast';
// Define available widget types
const availableWidgets = [
  {
    id: 'regulation-trend',
    name: 'Regulatory Compliance Trends',
    description: 'Track regulatory trends over time',
    icon: LineChart
  },
  {
    id: 'forum-preview',
    name: 'Forum Preview',
    description: 'See the latest discussions from the community',
    icon: MessageSquare
  },
  {
    id: 'gamification',
    name: 'Gamification',
    description: 'View your badges and challenges',
    icon: Award
  },
  {
    id: 'recent-queries',
    name: 'Recent Queries',
    description: 'Your recent queries to Dara',
    icon: MessageSquare
  },
  {
    id: 'compliance-status',
    name: 'Compliance Status',
    description: 'Your compliance status overview',
    icon: AlertCircle
  }
];
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [widgets, setWidgets] = useState([]);
  // Load user widget configuration on mount
  useEffect(() => {
    // In a real app, we would load this from backend
    // For now, we'll start with default widgets or get from localStorage
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    const defaultWidgets = ['regulation-trend', 'forum-preview', 'gamification', 'recent-queries'];
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      setWidgets(defaultWidgets);
      localStorage.setItem('dashboardWidgets', JSON.stringify(defaultWidgets));
    }
  }, []);
  // Save widget configuration when it changes
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    }
  }, [widgets]);
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  const addWidget = widgetId => {
    if (!widgets.includes(widgetId)) {
      setWidgets([...widgets, widgetId]);
      toast({
        title: 'Widget added',
        description: 'Your dashboard has been updated'
      });
    }
    setIsAddWidgetOpen(false);
  };
  const removeWidget = widgetId => {
    setWidgets(widgets.filter(id => id !== widgetId));
    toast({
      title: 'Widget removed',
      description: 'Your dashboard has been updated'
    });
  };
  // Get widget component by type
  const getWidgetComponent = widgetId => {
    switch (widgetId) {
      case 'regulation-trend':
        return _jsx(RegulationTrendWidget, { onRemove: () => removeWidget(widgetId) });
      case 'forum-preview':
        return _jsx(ForumPreviewWidget, { onRemove: () => removeWidget(widgetId) });
      case 'gamification':
        return _jsx(GamificationWidget, { onRemove: () => removeWidget(widgetId) });
      case 'recent-queries':
        return _jsx(RecentQueriesWidget, { onRemove: () => removeWidget(widgetId) });
      case 'compliance-status':
        return _jsx(ComplianceStatusWidget, { onRemove: () => removeWidget(widgetId) });
      default:
        return null;
    }
  };
  if (isLoading || !user) {
    return _jsx(DashboardLayout, {
      children: _jsx('div', {
        className: 'flex items-center justify-center h-full',
        children: _jsx('div', { className: 'animate-pulse', children: 'Loading dashboard...' })
      })
    });
  }
  return _jsx(DashboardLayout, {
    children: _jsxs('div', {
      className: 'container py-8',
      children: [
        _jsxs('div', {
          className: 'flex flex-col md:flex-row md:items-center md:justify-between mb-6',
          children: [
            _jsxs('div', {
              children: [
                _jsxs('h1', {
                  className: 'text-3xl font-bold',
                  children: ['Welcome, ', user.name]
                }),
                _jsx('p', {
                  className: 'text-gray-500 mt-1',
                  children: "Here's an overview of your GRC activities"
                })
              ]
            }),
            _jsx('div', {
              className: 'flex items-center space-x-2 mt-4 md:mt-0',
              children: _jsxs(Dialog, {
                open: isAddWidgetOpen,
                onOpenChange: setIsAddWidgetOpen,
                children: [
                  _jsx(DialogTrigger, {
                    asChild: true,
                    children: _jsxs(Button, {
                      variant: 'outline',
                      className: 'flex items-center gap-2',
                      children: [_jsx(Plus, { size: 16 }), 'Add Widget']
                    })
                  }),
                  _jsxs(DialogContent, {
                    className: 'sm:max-w-[425px]',
                    children: [
                      _jsxs(DialogHeader, {
                        children: [
                          _jsx(DialogTitle, { children: 'Add Widget' }),
                          _jsx(DialogDescription, {
                            children: 'Select a widget to add to your dashboard'
                          })
                        ]
                      }),
                      _jsx('div', {
                        className: 'grid gap-4 py-4',
                        children: availableWidgets.map(widget =>
                          _jsxs(
                            'div',
                            {
                              className: `flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${widgets.includes(widget.id) ? 'opacity-50 cursor-not-allowed' : ''}`,
                              onClick: () => {
                                if (!widgets.includes(widget.id)) {
                                  addWidget(widget.id);
                                }
                              },
                              children: [
                                _jsx('div', {
                                  className: 'mr-4 bg-blue-100 p-2 rounded-full',
                                  children: _jsx(widget.icon, {
                                    className: 'h-5 w-5 text-blue-600'
                                  })
                                }),
                                _jsxs('div', {
                                  className: 'flex-1',
                                  children: [
                                    _jsx('h4', { className: 'font-medium', children: widget.name }),
                                    _jsx('p', {
                                      className: 'text-sm text-gray-500',
                                      children: widget.description
                                    })
                                  ]
                                }),
                                widgets.includes(widget.id) &&
                                  _jsx('span', {
                                    className: 'text-xs text-gray-500 ml-2',
                                    children: 'Added'
                                  })
                              ]
                            },
                            widget.id
                          )
                        )
                      }),
                      _jsx(DialogFooter, {
                        children: _jsx(Button, {
                          variant: 'outline',
                          onClick: () => setIsAddWidgetOpen(false),
                          children: 'Cancel'
                        })
                      })
                    ]
                  })
                ]
              })
            })
          ]
        }),
        _jsxs(Tabs, {
          value: activeTab,
          onValueChange: setActiveTab,
          children: [
            _jsxs(TabsList, {
              children: [
                _jsx(TabsTrigger, { value: 'overview', children: 'Overview' }),
                _jsx(TabsTrigger, { value: 'compliance', children: 'Compliance' }),
                _jsx(TabsTrigger, { value: 'analytics', children: 'Analytics' })
              ]
            }),
            _jsx(TabsContent, {
              value: 'overview',
              children: _jsx(DashboardContextProvider, {
                children: _jsxs(WidgetGrid, {
                  children: [
                    widgets.map(widgetId =>
                      _jsx(
                        'div',
                        { className: 'h-full', children: getWidgetComponent(widgetId) },
                        widgetId
                      )
                    ),
                    widgets.length === 0 &&
                      _jsxs('div', {
                        className:
                          'col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl',
                        children: [
                          _jsx('p', {
                            className: 'text-gray-500 mb-4',
                            children: 'Your dashboard is empty'
                          }),
                          _jsx(Button, {
                            onClick: () => setIsAddWidgetOpen(true),
                            children: 'Add Widgets'
                          })
                        ]
                      })
                  ]
                })
              })
            }),
            _jsx(TabsContent, {
              value: 'compliance',
              children: _jsxs(Card, {
                children: [
                  _jsxs(CardHeader, {
                    children: [
                      _jsx(CardTitle, { children: 'Compliance Dashboard' }),
                      _jsx(CardDescription, {
                        children: 'Detailed view of your compliance status across jurisdictions'
                      })
                    ]
                  }),
                  _jsx(CardContent, {
                    children: _jsx('div', {
                      className: 'flex flex-col items-center justify-center p-8',
                      children: _jsx('p', {
                        className: 'text-gray-500 mb-4',
                        children: 'Coming soon in later release'
                      })
                    })
                  })
                ]
              })
            }),
            _jsx(TabsContent, {
              value: 'analytics',
              children: _jsxs(Card, {
                children: [
                  _jsxs(CardHeader, {
                    children: [
                      _jsx(CardTitle, { children: 'Analytics Dashboard' }),
                      _jsx(CardDescription, {
                        children: 'Insights and trends for your regulatory compliance'
                      })
                    ]
                  }),
                  _jsx(CardContent, {
                    children: _jsx('div', {
                      className: 'flex flex-col items-center justify-center p-8',
                      children: _jsx('p', {
                        className: 'text-gray-500 mb-4',
                        children: 'Coming soon in later release'
                      })
                    })
                  })
                ]
              })
            })
          ]
        })
      ]
    })
  });
};
export default Dashboard;
