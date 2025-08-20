import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Brain,
  Download,
  FileText,
  MessageSquare,
  Sparkles,
  Target
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
// Import existing components
import { CriticalErrorAlert } from '@/components/alerts/CriticalErrorAlert';
const SFDRNavigator = () => {
  // State management for unified interface
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Chat interface state
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'system',
      content:
        "Welcome to SFDR Navigator - your unified regulatory compliance platform. I'm Sophia, your AI-powered guide for SFDR Article 6, 8, and 9 classifications. I provide real-time analysis with mandatory regulatory citations, interactive workflows, and predictive compliance insights. How can I assist with your sustainable finance disclosure requirements today?",
      timestamp: new Date(),
      metadata: {
        citations: ['SFDR Article 1', 'Commission Regulation (EU) 2022/1288'],
        confidence: 100
      }
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  // Classification state
  const [classificationResult, setClassificationResult] = useState(null);
  const [formData, setFormData] = useState({
    fundName: '',
    description: '',
    investmentStrategy: '',
    esgIntegration: '',
    sustainabilityObjectives: '',
    principalAdverseImpacts: '',
    taxonomyAlignment: ''
  });
  // Document processing state
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  // Analytics state
  const [analyticsData, setAnalyticsData] = useState({
    totalFunds: 0,
    article6: 0,
    article8: 0,
    article9: 0,
    complianceScore: 0,
    lastUpdate: new Date()
  });
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  /**
   * Add message with regulatory citations
   */
  const addMessage = useCallback((type, content, metadata) => {
    const newMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        citations: metadata?.citations || ['SFDR Regulation (EU) 2019/2088'] // Mandatory citations
      }
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);
  if (error) {
    return _jsx(CriticalErrorAlert, {
      errors: [
        {
          id: '1',
          type: 'system_error',
          title: 'System Error',
          message: error,
          severity: 'critical',
          timestamp: new Date().toISOString(),
          actionable: true
        }
      ],
      onRetry: () => setError(null)
    });
  }
  return _jsx('div', {
    className: 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50',
    children: _jsxs('div', {
      className: 'w-full max-w-7xl mx-auto p-6 space-y-6',
      children: [
        _jsxs(motion.div, {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          className: 'text-center space-y-4',
          children: [
            _jsxs('div', {
              className: 'flex items-center justify-center space-x-3',
              children: [
                _jsx(motion.div, {
                  className: 'p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl',
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  children: _jsx(Brain, { className: 'h-8 w-8 text-white' })
                }),
                _jsx('h1', {
                  className:
                    'text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
                  children: 'SFDR Navigator'
                }),
                _jsxs(Badge, {
                  variant: 'secondary',
                  className: 'px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100',
                  children: [
                    _jsx(Sparkles, { className: 'h-4 w-4 mr-1 text-green-600' }),
                    'Unified Platform'
                  ]
                })
              ]
            }),
            _jsx('p', {
              className: 'text-lg text-muted-foreground max-w-3xl mx-auto',
              children:
                'Next-generation regulatory compliance platform combining AI-powered classification, interactive workflows, and advanced analytics with mandatory regulatory citations for comprehensive SFDR compliance.'
            }),
            _jsxs('div', {
              className: 'grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto',
              children: [
                _jsxs('div', {
                  className: 'text-center p-3 bg-white/50 rounded-lg border',
                  children: [
                    _jsx('div', {
                      className: 'text-2xl font-bold text-blue-600',
                      children: analyticsData.totalFunds
                    }),
                    _jsx('div', {
                      className: 'text-sm text-muted-foreground',
                      children: 'Funds Analyzed'
                    })
                  ]
                }),
                _jsxs('div', {
                  className: 'text-center p-3 bg-white/50 rounded-lg border',
                  children: [
                    _jsxs('div', {
                      className: 'text-2xl font-bold text-green-600',
                      children: [analyticsData.complianceScore.toFixed(1), '%']
                    }),
                    _jsx('div', {
                      className: 'text-sm text-muted-foreground',
                      children: 'Compliance Score'
                    })
                  ]
                }),
                _jsxs('div', {
                  className: 'text-center p-3 bg-white/50 rounded-lg border',
                  children: [
                    _jsx('div', {
                      className: 'text-2xl font-bold text-purple-600',
                      children: uploadedDocuments.length
                    }),
                    _jsx('div', {
                      className: 'text-sm text-muted-foreground',
                      children: 'Documents Processed'
                    })
                  ]
                }),
                _jsxs('div', {
                  className: 'text-center p-3 bg-white/50 rounded-lg border',
                  children: [
                    _jsx('div', {
                      className: 'text-2xl font-bold text-orange-600',
                      children: 'Real-time'
                    }),
                    _jsx('div', {
                      className: 'text-sm text-muted-foreground',
                      children: 'AI Citations'
                    })
                  ]
                })
              ]
            })
          ]
        }),
        _jsxs(Card, {
          className: 'border-2 shadow-xl bg-white/80 backdrop-blur',
          children: [
            _jsx(CardHeader, {
              className: 'pb-4',
              children: _jsx(Tabs, {
                value: activeTab,
                onValueChange: setActiveTab,
                className: 'w-full',
                children: _jsxs(TabsList, {
                  className: 'grid w-full grid-cols-5 h-12',
                  children: [
                    _jsxs(TabsTrigger, {
                      value: 'chat',
                      className: 'flex items-center space-x-2 text-sm',
                      children: [
                        _jsx(MessageSquare, { className: 'h-4 w-4' }),
                        _jsx('span', { className: 'hidden sm:inline', children: 'AI Chat' })
                      ]
                    }),
                    _jsxs(TabsTrigger, {
                      value: 'classify',
                      className: 'flex items-center space-x-2 text-sm',
                      children: [
                        _jsx(Target, { className: 'h-4 w-4' }),
                        _jsx('span', { className: 'hidden sm:inline', children: 'Classify' })
                      ]
                    }),
                    _jsxs(TabsTrigger, {
                      value: 'documents',
                      className: 'flex items-center space-x-2 text-sm',
                      children: [
                        _jsx(FileText, { className: 'h-4 w-4' }),
                        _jsx('span', { className: 'hidden sm:inline', children: 'Documents' })
                      ]
                    }),
                    _jsxs(TabsTrigger, {
                      value: 'analytics',
                      className: 'flex items-center space-x-2 text-sm',
                      children: [
                        _jsx(BarChart3, { className: 'h-4 w-4' }),
                        _jsx('span', { className: 'hidden sm:inline', children: 'Analytics' })
                      ]
                    }),
                    _jsxs(TabsTrigger, {
                      value: 'export',
                      className: 'flex items-center space-x-2 text-sm',
                      children: [
                        _jsx(Download, { className: 'h-4 w-4' }),
                        _jsx('span', { className: 'hidden sm:inline', children: 'Export' })
                      ]
                    })
                  ]
                })
              })
            }),
            _jsx(CardContent, {
              children: _jsx(AnimatePresence, {
                mode: 'wait',
                children: _jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 },
                    transition: { duration: 0.3 },
                    className: 'space-y-6',
                    children: [
                      _jsx(TabsContent, {
                        value: 'chat',
                        className: 'space-y-6 mt-0',
                        children: _jsxs('div', {
                          className: 'text-center space-y-6',
                          children: [
                            _jsxs('div', {
                              children: [
                                _jsx('h3', {
                                  className: 'text-lg font-semibold mb-2',
                                  children: 'AI-Powered SFDR Chat'
                                }),
                                _jsx('p', {
                                  className: 'text-muted-foreground',
                                  children:
                                    'Ask questions about SFDR compliance, fund classification, and regulatory requirements'
                                })
                              ]
                            }),
                            _jsxs(Alert, {
                              children: [
                                _jsx(MessageSquare, { className: 'h-4 w-4' }),
                                _jsx(AlertDescription, {
                                  children: 'Chat interface is being loaded. Please wait...'
                                })
                              ]
                            })
                          ]
                        })
                      }),
                      _jsx(TabsContent, {
                        value: 'classify',
                        className: 'space-y-6 mt-0',
                        children: _jsxs('div', {
                          className: 'text-center space-y-6',
                          children: [
                            _jsxs('div', {
                              children: [
                                _jsx('h3', {
                                  className: 'text-lg font-semibold mb-2',
                                  children: 'SFDR Fund Classification'
                                }),
                                _jsx('p', {
                                  className: 'text-muted-foreground',
                                  children:
                                    'Classify your fund as Article 6, 8, or 9 with AI-powered analysis'
                                })
                              ]
                            }),
                            _jsxs(Alert, {
                              children: [
                                _jsx(Target, { className: 'h-4 w-4' }),
                                _jsx(AlertDescription, {
                                  children: 'Classification form is being loaded. Please wait...'
                                })
                              ]
                            })
                          ]
                        })
                      }),
                      _jsx(TabsContent, {
                        value: 'documents',
                        className: 'space-y-6 mt-0',
                        children: _jsxs('div', {
                          className: 'text-center space-y-6',
                          children: [
                            _jsxs('div', {
                              children: [
                                _jsx('h3', {
                                  className: 'text-lg font-semibold mb-2',
                                  children: 'Document Analysis'
                                }),
                                _jsx('p', {
                                  className: 'text-muted-foreground',
                                  children: 'Upload and analyze documents for SFDR compliance'
                                })
                              ]
                            }),
                            _jsxs(Alert, {
                              children: [
                                _jsx(FileText, { className: 'h-4 w-4' }),
                                _jsx(AlertDescription, {
                                  children:
                                    'Document upload interface is being loaded. Please wait...'
                                })
                              ]
                            })
                          ]
                        })
                      }),
                      _jsx(TabsContent, {
                        value: 'analytics',
                        className: 'space-y-6 mt-0',
                        children: _jsxs('div', {
                          className: 'text-center space-y-6',
                          children: [
                            _jsxs('div', {
                              children: [
                                _jsx('h3', {
                                  className: 'text-lg font-semibold mb-2',
                                  children: 'Analytics Dashboard'
                                }),
                                _jsx('p', {
                                  className: 'text-muted-foreground',
                                  children: 'View comprehensive analytics and compliance insights'
                                })
                              ]
                            }),
                            _jsxs(Alert, {
                              children: [
                                _jsx(BarChart3, { className: 'h-4 w-4' }),
                                _jsx(AlertDescription, {
                                  children: 'Analytics dashboard is being loaded. Please wait...'
                                })
                              ]
                            })
                          ]
                        })
                      }),
                      _jsx(TabsContent, {
                        value: 'export',
                        className: 'space-y-6 mt-0',
                        children: _jsxs('div', {
                          className: 'text-center space-y-6',
                          children: [
                            _jsxs('div', {
                              children: [
                                _jsx('h3', {
                                  className: 'text-lg font-semibold mb-2',
                                  children: 'Export Analysis & Reports'
                                }),
                                _jsx('p', {
                                  className: 'text-muted-foreground',
                                  children:
                                    'Export comprehensive SFDR analysis with regulatory citations'
                                })
                              ]
                            }),
                            _jsxs(Alert, {
                              children: [
                                _jsx(Download, { className: 'h-4 w-4' }),
                                _jsx(AlertDescription, {
                                  children: 'Export interface is being loaded. Please wait...'
                                })
                              ]
                            })
                          ]
                        })
                      })
                    ]
                  },
                  activeTab
                )
              })
            })
          ]
        })
      ]
    })
  });
};
export default SFDRNavigator;
