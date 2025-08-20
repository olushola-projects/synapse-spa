import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bot,
  Send,
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  Target,
  BarChart3,
  FileCheck,
  Globe,
  Sparkles
} from 'lucide-react';
const SFDRGem = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content:
        "Welcome to SFDR Gem! I'm your AI-powered SFDR compliance assistant. I can help you classify funds, analyze documents, and ensure regulatory compliance. How can I assist you today?",
      timestamp: new Date(),
      metadata: {
        sources: ['SFDR Regulation (EU) 2019/2088', 'ESMA Guidelines']
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [contextualMemory, setContextualMemory] = useState({
    userPreferences: {},
    recentClassifications: [],
    documentHistory: [],
    conversationContext: []
  });
  // Form state for classification
  const [classificationForm, setClassificationForm] = useState({
    fundName: '',
    description: '',
    investmentStrategy: '',
    esgIntegration: '',
    sustainabilityObjectives: '',
    principalAdverseImpacts: '',
    taxonomyAlignment: ''
  });
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  // Handlers
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) {
      return;
    }
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    // Simulate AI response with SFDR knowledge
    setTimeout(() => {
      const responses = [
        {
          content:
            'Based on SFDR Article 8 requirements, your fund would need to promote environmental or social characteristics. I can help you assess the specific disclosure requirements.',
          metadata: {
            classification: 'Article 8',
            confidence: 85,
            sources: ['SFDR Article 8', 'RTS on SFDR disclosures']
          }
        },
        {
          content:
            'For Article 9 classification, your fund must have sustainable investment as its objective. Let me analyze your investment strategy against the technical criteria.',
          metadata: {
            classification: 'Article 9',
            confidence: 92,
            sources: ['SFDR Article 9', 'Taxonomy Regulation']
          }
        },
        {
          content:
            "I've identified potential PAI (Principal Adverse Impact) considerations for your fund. Would you like me to generate a detailed compliance checklist?",
          metadata: {
            sources: ['PAI Technical Standards', 'ESMA Q&A']
          }
        }
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      if (randomResponse) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: randomResponse.content,
          timestamp: new Date(),
          metadata: randomResponse.metadata
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
      setIsLoading(false);
      // Update contextual memory
      setContextualMemory(prev => ({
        ...prev,
        conversationContext: [...prev.conversationContext.slice(-4), userMessage.content]
      }));
    }, 1500);
  }, [inputValue, isLoading]);
  const handleDocumentUpload = useCallback(async files => {
    const newDocuments = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const document = {
          id: Date.now().toString() + i,
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date(),
          status: 'processing',
          sfdrRelevance: 0,
          summary: '',
          extractedEntities: [],
          sentiment: 'neutral',
          topics: [],
          complianceIssues: []
        };
        newDocuments.push(document);
      }
    }
    setUploadedDocuments(prev => [...prev, ...newDocuments]);
    // Simulate document processing
    setTimeout(() => {
      setUploadedDocuments(prev =>
        prev.map(doc => {
          if (newDocuments.find(newDoc => newDoc.id === doc.id)) {
            return {
              ...doc,
              status: 'completed',
              sfdrRelevance: Math.floor(Math.random() * 40) + 60, // 60-100%
              summary:
                'Document contains relevant SFDR disclosure information including ESG integration methodology and PAI considerations.',
              extractedEntities: [
                'ESG Integration',
                'Sustainable Investment',
                'PAI Indicators',
                'Taxonomy Alignment'
              ],
              sentiment: 'positive',
              topics: ['Environmental Factors', 'Social Characteristics', 'Governance Practices'],
              complianceIssues: Math.random() > 0.7 ? ['Missing PAI disclosure details'] : []
            };
          }
          return doc;
        })
      );
    }, 3000);
  }, []);
  const handleClassification = useCallback(async () => {
    if (!classificationForm.fundName || !classificationForm.description) {
      alert('Please fill in at least the fund name and description.');
      return;
    }
    setIsLoading(true);
    // Simulate API call for classification
    setTimeout(() => {
      const classifications = [
        {
          classification: 'Article 8',
          confidence: 87,
          reasoning:
            'Fund promotes environmental characteristics through ESG integration but does not have sustainable investment as primary objective.',
          recommendations: [
            'Enhance disclosure on environmental characteristics promoted',
            'Provide clear methodology for ESG integration',
            'Consider adding specific sustainability indicators'
          ],
          issues: ['PAI disclosure could be more detailed'],
          complianceScore: 85
        },
        {
          classification: 'Article 9',
          confidence: 93,
          reasoning:
            'Fund has sustainable investment as its objective with clear taxonomy alignment and measurable sustainability outcomes.',
          recommendations: [
            'Maintain robust sustainability measurement framework',
            'Regular review of taxonomy alignment',
            'Enhanced reporting on sustainability outcomes'
          ],
          issues: [],
          complianceScore: 94
        },
        {
          classification: 'Article 6',
          confidence: 78,
          reasoning:
            'Fund does not promote environmental or social characteristics as primary focus, standard financial disclosures apply.',
          recommendations: [
            'Consider if any ESG factors are integrated',
            'Review investment process for sustainability considerations',
            'Evaluate potential for Article 8 classification'
          ],
          issues: ['Limited sustainability integration documented'],
          complianceScore: 72
        }
      ];
      const result = classifications[Math.floor(Math.random() * classifications.length)];
      if (result) {
        setClassificationResult(result);
        setIsLoading(false);
        // Update contextual memory
        setContextualMemory(prev => ({
          ...prev,
          recentClassifications: [...prev.recentClassifications.slice(-2), result]
        }));
      }
    }, 2000);
  }, [classificationForm]);
  const handleExport = useCallback(
    format => {
      const exportData = {
        classification: classificationResult,
        documents: uploadedDocuments,
        chatHistory: messages,
        timestamp: new Date().toISOString(),
        summary: {
          totalDocuments: uploadedDocuments.length,
          averageRelevance:
            uploadedDocuments.reduce((acc, doc) => acc + doc.sfdrRelevance, 0) /
              uploadedDocuments.length || 0,
          complianceIssues: uploadedDocuments.reduce(
            (acc, doc) => acc + doc.complianceIssues.length,
            0
          )
        }
      };
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sfdr-analysis-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Placeholder for PDF/Excel export
        alert(
          `${format.toUpperCase()} export functionality will be implemented with backend integration.`
        );
      }
    },
    [classificationResult, uploadedDocuments, messages]
  );
  return _jsx('div', {
    className: 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4',
    children: _jsxs('div', {
      className: 'max-w-7xl mx-auto',
      children: [
        _jsxs(motion.div, {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          className: 'text-center mb-8',
          children: [
            _jsxs('div', {
              className: 'flex items-center justify-center gap-3 mb-4',
              children: [
                _jsxs('div', {
                  className: 'relative',
                  children: [
                    _jsx(Sparkles, { className: 'w-10 h-10 text-purple-600' }),
                    _jsx(motion.div, {
                      className: 'absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full',
                      animate: { scale: [1, 1.2, 1] },
                      transition: { repeat: Infinity, duration: 2 }
                    })
                  ]
                }),
                _jsx('h1', {
                  className:
                    'text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
                  children: 'SFDR Gem'
                }),
                _jsx(Badge, {
                  variant: 'secondary',
                  className: 'bg-green-100 text-green-800',
                  children: 'MVP'
                })
              ]
            }),
            _jsx('p', {
              className: 'text-xl text-gray-600 max-w-3xl mx-auto',
              children:
                'AI-powered SFDR compliance navigator with document intelligence and real-time classification'
            })
          ]
        }),
        _jsxs(Tabs, {
          value: activeTab,
          onValueChange: value => setActiveTab(value),
          className: 'w-full',
          children: [
            _jsxs(TabsList, {
              className: 'grid w-full grid-cols-4 mb-6',
              children: [
                _jsxs(TabsTrigger, {
                  value: 'chat',
                  className:
                    'flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                  children: [_jsx(Bot, { className: 'w-4 h-4' }), 'AI Chat']
                }),
                _jsxs(TabsTrigger, {
                  value: 'classify',
                  className:
                    'flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                  children: [_jsx(Target, { className: 'w-4 h-4' }), 'Classify']
                }),
                _jsxs(TabsTrigger, {
                  value: 'documents',
                  className:
                    'flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                  children: [_jsx(FileText, { className: 'w-4 h-4' }), 'Documents']
                }),
                _jsxs(TabsTrigger, {
                  value: 'export',
                  className:
                    'flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                  children: [_jsx(Download, { className: 'w-4 h-4' }), 'Export']
                })
              ]
            }),
            _jsx(TabsContent, {
              value: 'chat',
              children: _jsxs('div', {
                className: 'grid grid-cols-1 lg:grid-cols-4 gap-6',
                children: [
                  _jsx('div', {
                    className: 'lg:col-span-3',
                    children: _jsxs(Card, {
                      className: 'h-[600px] flex flex-col',
                      children: [
                        _jsxs(CardHeader, {
                          children: [
                            _jsxs(CardTitle, {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx(Brain, { className: 'w-5 h-5 text-blue-600' }),
                                'SFDR AI Navigator'
                              ]
                            }),
                            _jsx(CardDescription, {
                              children:
                                'Ask questions about SFDR compliance, fund classification, and regulatory requirements'
                            })
                          ]
                        }),
                        _jsxs(CardContent, {
                          className: 'flex-1 flex flex-col',
                          children: [
                            _jsxs(ScrollArea, {
                              className: 'flex-1 pr-4 mb-4',
                              children: [
                                _jsxs('div', {
                                  className: 'space-y-4',
                                  children: [
                                    messages.map(message =>
                                      _jsx(
                                        motion.div,
                                        {
                                          initial: { opacity: 0, y: 10 },
                                          animate: { opacity: 1, y: 0 },
                                          className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`,
                                          children: _jsxs('div', {
                                            className: `max-w-[80%] p-3 rounded-lg ${
                                              message.role === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                            }`,
                                            children: [
                                              _jsx('p', {
                                                className: 'text-sm',
                                                children: message.content
                                              }),
                                              message.metadata &&
                                                _jsxs('div', {
                                                  className:
                                                    'mt-2 pt-2 border-t border-gray-200 text-xs',
                                                  children: [
                                                    message.metadata.classification &&
                                                      _jsx(Badge, {
                                                        variant: 'outline',
                                                        className: 'mr-2',
                                                        children: message.metadata.classification
                                                      }),
                                                    message.metadata.confidence &&
                                                      _jsxs('span', {
                                                        className: 'text-gray-500',
                                                        children: [
                                                          'Confidence: ',
                                                          message.metadata.confidence,
                                                          '%'
                                                        ]
                                                      }),
                                                    message.metadata.sources &&
                                                      _jsxs('div', {
                                                        className: 'mt-1',
                                                        children: [
                                                          _jsx('span', {
                                                            className: 'text-gray-500',
                                                            children: 'Sources: '
                                                          }),
                                                          message.metadata.sources.join(', ')
                                                        ]
                                                      })
                                                  ]
                                                })
                                            ]
                                          })
                                        },
                                        message.id
                                      )
                                    ),
                                    isLoading &&
                                      _jsx(motion.div, {
                                        initial: { opacity: 0 },
                                        animate: { opacity: 1 },
                                        className: 'flex justify-start',
                                        children: _jsx('div', {
                                          className: 'bg-gray-100 p-3 rounded-lg',
                                          children: _jsxs('div', {
                                            className: 'flex items-center gap-2',
                                            children: [
                                              _jsx('div', {
                                                className:
                                                  'w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                                              }),
                                              _jsx('div', {
                                                className:
                                                  'w-2 h-2 bg-blue-600 rounded-full animate-bounce',
                                                style: { animationDelay: '0.1s' }
                                              }),
                                              _jsx('div', {
                                                className:
                                                  'w-2 h-2 bg-blue-600 rounded-full animate-bounce',
                                                style: { animationDelay: '0.2s' }
                                              })
                                            ]
                                          })
                                        })
                                      })
                                  ]
                                }),
                                _jsx('div', { ref: messagesEndRef })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex gap-2',
                              children: [
                                _jsx(Input, {
                                  value: inputValue,
                                  onChange: e => setInputValue(e.target.value),
                                  placeholder:
                                    'Ask about SFDR compliance, fund classification, or regulatory requirements...',
                                  onKeyPress: e => e.key === 'Enter' && handleSendMessage(),
                                  disabled: isLoading
                                }),
                                _jsx(Button, {
                                  onClick: handleSendMessage,
                                  disabled: isLoading || !inputValue.trim(),
                                  children: _jsx(Send, { className: 'w-4 h-4' })
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  }),
                  _jsxs('div', {
                    className: 'space-y-4',
                    children: [
                      _jsxs(Card, {
                        children: [
                          _jsx(CardHeader, {
                            children: _jsxs(CardTitle, {
                              className: 'text-lg flex items-center gap-2',
                              children: [
                                _jsx(Zap, { className: 'w-5 h-5 text-yellow-600' }),
                                'Contextual Memory'
                              ]
                            })
                          }),
                          _jsx(CardContent, {
                            children: _jsxs('div', {
                              className: 'space-y-3',
                              children: [
                                _jsxs('div', {
                                  children: [
                                    _jsx('h4', {
                                      className: 'font-medium text-sm mb-2',
                                      children: 'Recent Context'
                                    }),
                                    _jsx('div', {
                                      className: 'space-y-1',
                                      children: contextualMemory.conversationContext
                                        .slice(-3)
                                        .map((context, index) =>
                                          _jsx(
                                            'p',
                                            {
                                              className: 'text-xs text-gray-600 truncate',
                                              children: context
                                            },
                                            index
                                          )
                                        )
                                    })
                                  ]
                                }),
                                _jsxs('div', {
                                  children: [
                                    _jsx('h4', {
                                      className: 'font-medium text-sm mb-2',
                                      children: 'Classifications'
                                    }),
                                    _jsxs('p', {
                                      className: 'text-xs text-gray-600',
                                      children: [
                                        contextualMemory.recentClassifications.length,
                                        ' recent'
                                      ]
                                    })
                                  ]
                                }),
                                _jsxs('div', {
                                  children: [
                                    _jsx('h4', {
                                      className: 'font-medium text-sm mb-2',
                                      children: 'Documents'
                                    }),
                                    _jsxs('p', {
                                      className: 'text-xs text-gray-600',
                                      children: [uploadedDocuments.length, ' analyzed']
                                    })
                                  ]
                                })
                              ]
                            })
                          })
                        ]
                      }),
                      _jsxs(Card, {
                        children: [
                          _jsx(CardHeader, {
                            children: _jsxs(CardTitle, {
                              className: 'text-lg flex items-center gap-2',
                              children: [
                                _jsx(BarChart3, { className: 'w-5 h-5 text-green-600' }),
                                'Quick Stats'
                              ]
                            })
                          }),
                          _jsx(CardContent, {
                            children: _jsxs('div', {
                              className: 'space-y-3',
                              children: [
                                _jsxs('div', {
                                  className: 'flex justify-between items-center',
                                  children: [
                                    _jsx('span', { className: 'text-sm', children: 'Messages' }),
                                    _jsx(Badge, { variant: 'outline', children: messages.length })
                                  ]
                                }),
                                _jsxs('div', {
                                  className: 'flex justify-between items-center',
                                  children: [
                                    _jsx('span', { className: 'text-sm', children: 'Documents' }),
                                    _jsx(Badge, {
                                      variant: 'outline',
                                      children: uploadedDocuments.length
                                    })
                                  ]
                                }),
                                _jsxs('div', {
                                  className: 'flex justify-between items-center',
                                  children: [
                                    _jsx('span', {
                                      className: 'text-sm',
                                      children: 'Classifications'
                                    }),
                                    _jsx(Badge, {
                                      variant: 'outline',
                                      children: contextualMemory.recentClassifications.length
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
                ]
              })
            }),
            _jsx(TabsContent, {
              value: 'classify',
              children: _jsxs('div', {
                className: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
                children: [
                  _jsxs(Card, {
                    children: [
                      _jsxs(CardHeader, {
                        children: [
                          _jsxs(CardTitle, {
                            className: 'flex items-center gap-2',
                            children: [
                              _jsx(Target, { className: 'w-5 h-5 text-purple-600' }),
                              'Fund Classification'
                            ]
                          }),
                          _jsx(CardDescription, {
                            children: 'Provide fund details for SFDR article classification'
                          })
                        ]
                      }),
                      _jsxs(CardContent, {
                        className: 'space-y-4',
                        children: [
                          _jsxs('div', {
                            children: [
                              _jsx('label', {
                                className: 'text-sm font-medium mb-2 block',
                                children: 'Fund Name *'
                              }),
                              _jsx(Input, {
                                value: classificationForm.fundName,
                                onChange: e =>
                                  setClassificationForm(prev => ({
                                    ...prev,
                                    fundName: e.target.value
                                  })),
                                placeholder: 'Enter fund name'
                              })
                            ]
                          }),
                          _jsxs('div', {
                            children: [
                              _jsx('label', {
                                className: 'text-sm font-medium mb-2 block',
                                children: 'Description *'
                              }),
                              _jsx(Textarea, {
                                value: classificationForm.description,
                                onChange: e =>
                                  setClassificationForm(prev => ({
                                    ...prev,
                                    description: e.target.value
                                  })),
                                placeholder:
                                  "Describe the fund's investment approach and objectives",
                                rows: 3
                              })
                            ]
                          }),
                          _jsxs('div', {
                            children: [
                              _jsx('label', {
                                className: 'text-sm font-medium mb-2 block',
                                children: 'Investment Strategy'
                              }),
                              _jsx(Textarea, {
                                value: classificationForm.investmentStrategy,
                                onChange: e =>
                                  setClassificationForm(prev => ({
                                    ...prev,
                                    investmentStrategy: e.target.value
                                  })),
                                placeholder: 'Detail the investment strategy and methodology',
                                rows: 3
                              })
                            ]
                          }),
                          _jsxs('div', {
                            children: [
                              _jsx('label', {
                                className: 'text-sm font-medium mb-2 block',
                                children: 'ESG Integration'
                              }),
                              _jsx(Textarea, {
                                value: classificationForm.esgIntegration,
                                onChange: e =>
                                  setClassificationForm(prev => ({
                                    ...prev,
                                    esgIntegration: e.target.value
                                  })),
                                placeholder: 'Describe how ESG factors are integrated',
                                rows: 2
                              })
                            ]
                          }),
                          _jsxs('div', {
                            children: [
                              _jsx('label', {
                                className: 'text-sm font-medium mb-2 block',
                                children: 'Sustainability Objectives'
                              }),
                              _jsx(Textarea, {
                                value: classificationForm.sustainabilityObjectives,
                                onChange: e =>
                                  setClassificationForm(prev => ({
                                    ...prev,
                                    sustainabilityObjectives: e.target.value
                                  })),
                                placeholder: 'List specific sustainability objectives',
                                rows: 2
                              })
                            ]
                          }),
                          _jsxs('div', {
                            children: [
                              _jsx('label', {
                                className: 'text-sm font-medium mb-2 block',
                                children: 'Principal Adverse Impacts'
                              }),
                              _jsx(Textarea, {
                                value: classificationForm.principalAdverseImpacts,
                                onChange: e =>
                                  setClassificationForm(prev => ({
                                    ...prev,
                                    principalAdverseImpacts: e.target.value
                                  })),
                                placeholder: 'Describe consideration of principal adverse impacts',
                                rows: 2
                              })
                            ]
                          }),
                          _jsxs('div', {
                            children: [
                              _jsx('label', {
                                className: 'text-sm font-medium mb-2 block',
                                children: 'Taxonomy Alignment'
                              }),
                              _jsx(Textarea, {
                                value: classificationForm.taxonomyAlignment,
                                onChange: e =>
                                  setClassificationForm(prev => ({
                                    ...prev,
                                    taxonomyAlignment: e.target.value
                                  })),
                                placeholder: 'Detail EU Taxonomy alignment approach',
                                rows: 2
                              })
                            ]
                          }),
                          _jsx(Button, {
                            onClick: handleClassification,
                            disabled:
                              isLoading ||
                              !classificationForm.fundName ||
                              !classificationForm.description,
                            className: 'w-full',
                            children: isLoading ? 'Classifying...' : 'Classify Fund'
                          })
                        ]
                      })
                    ]
                  }),
                  _jsxs('div', {
                    className: 'space-y-6',
                    children: [
                      classificationResult &&
                        _jsx(motion.div, {
                          initial: { opacity: 0, x: 20 },
                          animate: { opacity: 1, x: 0 },
                          children: _jsxs(Card, {
                            children: [
                              _jsx(CardHeader, {
                                children: _jsxs(CardTitle, {
                                  className: 'flex items-center gap-2',
                                  children: [
                                    _jsx(CheckCircle, { className: 'w-5 h-5 text-green-600' }),
                                    'Classification Result'
                                  ]
                                })
                              }),
                              _jsxs(CardContent, {
                                className: 'space-y-6',
                                children: [
                                  _jsxs('div', {
                                    className: 'grid grid-cols-2 gap-4',
                                    children: [
                                      _jsxs('div', {
                                        className: 'space-y-2',
                                        children: [
                                          _jsx('span', {
                                            className: 'font-medium text-sm text-gray-600',
                                            children: 'SFDR Classification'
                                          }),
                                          _jsx(Badge, {
                                            variant:
                                              classificationResult.classification === 'Article 9'
                                                ? 'default'
                                                : 'secondary',
                                            className: `text-sm ${
                                              classificationResult.classification === 'Article 9'
                                                ? 'bg-green-600 text-white'
                                                : classificationResult.classification ===
                                                    'Article 8'
                                                  ? 'bg-blue-600 text-white'
                                                  : 'bg-gray-600 text-white'
                                            }`,
                                            children: classificationResult.classification
                                          })
                                        ]
                                      }),
                                      _jsxs('div', {
                                        className: 'space-y-2',
                                        children: [
                                          _jsx('span', {
                                            className: 'font-medium text-sm text-gray-600',
                                            children: 'Confidence Score'
                                          }),
                                          _jsxs('div', {
                                            className: 'flex items-center gap-2',
                                            children: [
                                              _jsx(Progress, {
                                                value: classificationResult.confidence,
                                                className: 'flex-1 h-2'
                                              }),
                                              _jsxs('span', {
                                                className: 'text-sm font-medium',
                                                children: [classificationResult.confidence, '%']
                                              })
                                            ]
                                          })
                                        ]
                                      })
                                    ]
                                  }),
                                  (classificationResult.sustainability_score ||
                                    classificationResult.explainability_score) &&
                                    _jsxs('div', {
                                      className:
                                        'grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg',
                                      children: [
                                        classificationResult.sustainability_score &&
                                          _jsxs('div', {
                                            className: 'space-y-2',
                                            children: [
                                              _jsx('span', {
                                                className: 'font-medium text-sm text-blue-700',
                                                children: 'Sustainability Score'
                                              }),
                                              _jsxs('div', {
                                                className: 'flex items-center gap-2',
                                                children: [
                                                  _jsx(Progress, {
                                                    value:
                                                      classificationResult.sustainability_score *
                                                      100,
                                                    className: 'flex-1 h-2'
                                                  }),
                                                  _jsxs('span', {
                                                    className: 'text-sm font-medium text-blue-700',
                                                    children: [
                                                      (
                                                        classificationResult.sustainability_score *
                                                        100
                                                      ).toFixed(1),
                                                      '%'
                                                    ]
                                                  })
                                                ]
                                              })
                                            ]
                                          }),
                                        classificationResult.explainability_score &&
                                          _jsxs('div', {
                                            className: 'space-y-2',
                                            children: [
                                              _jsx('span', {
                                                className: 'font-medium text-sm text-green-700',
                                                children: 'Explainability Score'
                                              }),
                                              _jsxs('div', {
                                                className: 'flex items-center gap-2',
                                                children: [
                                                  _jsx(Progress, {
                                                    value:
                                                      classificationResult.explainability_score *
                                                      100,
                                                    className: 'flex-1 h-2'
                                                  }),
                                                  _jsxs('span', {
                                                    className: 'text-sm font-medium text-green-700',
                                                    children: [
                                                      (
                                                        classificationResult.explainability_score *
                                                        100
                                                      ).toFixed(1),
                                                      '%'
                                                    ]
                                                  })
                                                ]
                                              })
                                            ]
                                          })
                                      ]
                                    }),
                                  classificationResult.regulatory_basis &&
                                    classificationResult.regulatory_basis.length > 0 &&
                                    _jsxs('div', {
                                      className:
                                        'p-4 bg-amber-50 border border-amber-200 rounded-lg',
                                      children: [
                                        _jsxs('div', {
                                          className: 'flex items-center gap-2 mb-3',
                                          children: [
                                            _jsx(FileCheck, {
                                              className: 'w-4 h-4 text-amber-600'
                                            }),
                                            _jsx('span', {
                                              className: 'font-medium text-amber-800',
                                              children: 'Regulatory Basis'
                                            }),
                                            _jsx(Badge, {
                                              variant: 'outline',
                                              className: 'text-xs text-amber-700 border-amber-300',
                                              children: 'SFDR Compliance'
                                            })
                                          ]
                                        }),
                                        _jsx('ul', {
                                          className: 'space-y-2',
                                          children: classificationResult.regulatory_basis.map(
                                            (citation, index) =>
                                              _jsxs(
                                                'li',
                                                {
                                                  className:
                                                    'text-sm text-amber-800 flex items-start gap-2',
                                                  children: [
                                                    _jsx(CheckCircle, {
                                                      className:
                                                        'w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0'
                                                    }),
                                                    citation
                                                  ]
                                                },
                                                index
                                              )
                                          )
                                        })
                                      ]
                                    }),
                                  classificationResult.benchmark_comparison &&
                                    _jsxs('div', {
                                      className:
                                        'p-4 bg-purple-50 border border-purple-200 rounded-lg',
                                      children: [
                                        _jsxs('div', {
                                          className: 'flex items-center gap-2 mb-3',
                                          children: [
                                            _jsx(BarChart3, {
                                              className: 'w-4 h-4 text-purple-600'
                                            }),
                                            _jsx('span', {
                                              className: 'font-medium text-purple-800',
                                              children: 'Industry Benchmark'
                                            })
                                          ]
                                        }),
                                        _jsxs('div', {
                                          className: 'grid grid-cols-2 gap-4 text-sm',
                                          children: [
                                            _jsxs('div', {
                                              children: [
                                                _jsx('span', {
                                                  className: 'text-gray-600',
                                                  children: 'Industry Baseline:'
                                                }),
                                                _jsxs('div', {
                                                  className: 'font-medium text-purple-700',
                                                  children: [
                                                    (
                                                      classificationResult.benchmark_comparison
                                                        .industry_baseline * 100
                                                    ).toFixed(1),
                                                    '%'
                                                  ]
                                                })
                                              ]
                                            }),
                                            _jsxs('div', {
                                              children: [
                                                _jsx('span', {
                                                  className: 'text-gray-600',
                                                  children: 'Performance vs Baseline:'
                                                }),
                                                _jsxs('div', {
                                                  className: `font-medium ${
                                                    classificationResult.benchmark_comparison
                                                      .performance_vs_baseline > 0
                                                      ? 'text-green-600'
                                                      : 'text-red-600'
                                                  }`,
                                                  children: [
                                                    classificationResult.benchmark_comparison
                                                      .performance_vs_baseline > 0
                                                      ? '+'
                                                      : '',
                                                    (
                                                      classificationResult.benchmark_comparison
                                                        .performance_vs_baseline * 100
                                                    ).toFixed(1),
                                                    '%'
                                                  ]
                                                })
                                              ]
                                            }),
                                            _jsxs('div', {
                                              children: [
                                                _jsx('span', {
                                                  className: 'text-gray-600',
                                                  children: 'Percentile Rank:'
                                                }),
                                                _jsxs('div', {
                                                  className: 'font-medium text-purple-700',
                                                  children: [
                                                    classificationResult.benchmark_comparison
                                                      .percentile_rank,
                                                    'th percentile'
                                                  ]
                                                })
                                              ]
                                            })
                                          ]
                                        })
                                      ]
                                    }),
                                  classificationResult.key_indicators &&
                                    classificationResult.key_indicators.length > 0 &&
                                    _jsxs('div', {
                                      children: [
                                        _jsx('span', {
                                          className: 'font-medium block mb-2',
                                          children: 'Key ESG Indicators'
                                        }),
                                        _jsx('div', {
                                          className: 'flex flex-wrap gap-2',
                                          children: classificationResult.key_indicators.map(
                                            (indicator, index) =>
                                              _jsx(
                                                Badge,
                                                {
                                                  variant: 'secondary',
                                                  className: 'text-xs',
                                                  children: indicator
                                                },
                                                index
                                              )
                                          )
                                        })
                                      ]
                                    }),
                                  classificationResult.risk_factors &&
                                    classificationResult.risk_factors.length > 0 &&
                                    _jsxs('div', {
                                      children: [
                                        _jsx('span', {
                                          className: 'font-medium block mb-2',
                                          children: 'Risk Assessment'
                                        }),
                                        _jsx('ul', {
                                          className: 'space-y-1',
                                          children: classificationResult.risk_factors.map(
                                            (risk, index) =>
                                              _jsxs(
                                                'li',
                                                {
                                                  className:
                                                    'text-sm text-gray-700 flex items-start gap-2',
                                                  children: [
                                                    _jsx(AlertTriangle, {
                                                      className:
                                                        'w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0'
                                                    }),
                                                    risk
                                                  ]
                                                },
                                                index
                                              )
                                          )
                                        })
                                      ]
                                    }),
                                  _jsxs('div', {
                                    children: [
                                      _jsx('span', {
                                        className: 'font-medium block mb-2',
                                        children: 'Classification Reasoning'
                                      }),
                                      _jsx('p', {
                                        className:
                                          'text-sm text-gray-700 bg-gray-50 p-3 rounded-lg',
                                        children: classificationResult.reasoning
                                      })
                                    ]
                                  }),
                                  _jsxs('div', {
                                    children: [
                                      _jsx('span', {
                                        className: 'font-medium block mb-2',
                                        children: 'Compliance Score'
                                      }),
                                      _jsx(Progress, {
                                        value: classificationResult.complianceScore,
                                        className: 'h-2'
                                      }),
                                      _jsxs('span', {
                                        className: 'text-sm text-gray-600 mt-1 block',
                                        children: [classificationResult.complianceScore, '%']
                                      })
                                    ]
                                  }),
                                  _jsxs('div', {
                                    children: [
                                      _jsx('span', {
                                        className: 'font-medium block mb-2',
                                        children: 'Recommendations'
                                      }),
                                      _jsx('ul', {
                                        className: 'space-y-1',
                                        children: classificationResult.recommendations.map(
                                          (rec, index) =>
                                            _jsxs(
                                              'li',
                                              {
                                                className:
                                                  'text-sm text-gray-700 flex items-start gap-2',
                                                children: [
                                                  _jsx(CheckCircle, {
                                                    className:
                                                      'w-3 h-3 text-green-600 mt-0.5 flex-shrink-0'
                                                  }),
                                                  rec
                                                ]
                                              },
                                              index
                                            )
                                        )
                                      })
                                    ]
                                  }),
                                  classificationResult.issues.length > 0 &&
                                    _jsxs('div', {
                                      children: [
                                        _jsx('span', {
                                          className: 'font-medium block mb-2',
                                          children: 'Issues to Address'
                                        }),
                                        _jsx('ul', {
                                          className: 'space-y-1',
                                          children: classificationResult.issues.map(
                                            (issue, index) =>
                                              _jsxs(
                                                'li',
                                                {
                                                  className:
                                                    'text-sm text-red-700 flex items-start gap-2',
                                                  children: [
                                                    _jsx(AlertTriangle, {
                                                      className:
                                                        'w-3 h-3 text-red-600 mt-0.5 flex-shrink-0'
                                                    }),
                                                    issue
                                                  ]
                                                },
                                                index
                                              )
                                          )
                                        })
                                      ]
                                    }),
                                  classificationResult.audit_trail &&
                                    _jsxs('div', {
                                      className: 'pt-4 border-t border-gray-200',
                                      children: [
                                        _jsx('span', {
                                          className: 'font-medium block mb-2 text-xs text-gray-500',
                                          children: 'Audit Information'
                                        }),
                                        _jsxs('div', {
                                          className: 'grid grid-cols-2 gap-2 text-xs text-gray-500',
                                          children: [
                                            _jsxs('div', {
                                              children: [
                                                'ID: ',
                                                classificationResult.audit_trail.classification_id?.slice(
                                                  -8
                                                )
                                              ]
                                            }),
                                            _jsxs('div', {
                                              children: [
                                                'Engine: v',
                                                classificationResult.audit_trail.engine_version
                                              ]
                                            }),
                                            classificationResult.processing_time &&
                                              _jsxs('div', {
                                                children: [
                                                  'Processing: ',
                                                  classificationResult.processing_time.toFixed(3),
                                                  's'
                                                ]
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
                      !classificationResult &&
                        _jsx(Card, {
                          children: _jsx(CardContent, {
                            className: 'pt-6',
                            children: _jsxs('div', {
                              className: 'text-center text-gray-500',
                              children: [
                                _jsx(Target, { className: 'w-12 h-12 mx-auto mb-4 text-gray-300' }),
                                _jsx('p', {
                                  children:
                                    'Fill out the form and click "Classify Fund" to get your SFDR classification'
                                })
                              ]
                            })
                          })
                        })
                    ]
                  })
                ]
              })
            }),
            _jsx(TabsContent, {
              value: 'documents',
              children: _jsxs('div', {
                className: 'space-y-6',
                children: [
                  _jsxs(Card, {
                    children: [
                      _jsxs(CardHeader, {
                        children: [
                          _jsxs(CardTitle, {
                            className: 'flex items-center gap-2',
                            children: [
                              _jsx(Upload, { className: 'w-5 h-5 text-blue-600' }),
                              'Document Upload & Analysis'
                            ]
                          }),
                          _jsx(CardDescription, {
                            children:
                              'Upload documents for SFDR compliance analysis and entity extraction'
                          })
                        ]
                      }),
                      _jsx(CardContent, {
                        children: _jsxs('div', {
                          className:
                            'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer',
                          onClick: () => fileInputRef.current?.click(),
                          onDrop: e => {
                            e.preventDefault();
                            const files = e.dataTransfer.files;
                            if (files.length > 0) {
                              handleDocumentUpload(files);
                            }
                          },
                          onDragOver: e => e.preventDefault(),
                          children: [
                            _jsx(Upload, { className: 'w-12 h-12 mx-auto mb-4 text-gray-400' }),
                            _jsx('p', {
                              className: 'text-lg font-medium mb-2',
                              children: 'Drop files here or click to upload'
                            }),
                            _jsx('p', {
                              className: 'text-sm text-gray-600',
                              children: 'Supports PDF, DOC, DOCX, TXT files'
                            }),
                            _jsx('input', {
                              ref: fileInputRef,
                              type: 'file',
                              multiple: true,
                              accept: '.pdf,.doc,.docx,.txt',
                              className: 'hidden',
                              onChange: e => {
                                if (e.target.files && e.target.files.length > 0) {
                                  handleDocumentUpload(e.target.files);
                                }
                              }
                            })
                          ]
                        })
                      })
                    ]
                  }),
                  uploadedDocuments.length > 0 &&
                    _jsxs(Card, {
                      children: [
                        _jsx(CardHeader, {
                          children: _jsxs(CardTitle, {
                            className: 'flex items-center gap-2',
                            children: [
                              _jsx(FileText, { className: 'w-5 h-5 text-green-600' }),
                              'Analyzed Documents (',
                              uploadedDocuments.length,
                              ')'
                            ]
                          })
                        }),
                        _jsx(CardContent, {
                          children: _jsx('div', {
                            className: 'space-y-4',
                            children: uploadedDocuments.map(doc =>
                              _jsxs(
                                motion.div,
                                {
                                  initial: { opacity: 0, y: 10 },
                                  animate: { opacity: 1, y: 0 },
                                  className: 'border rounded-lg p-4',
                                  children: [
                                    _jsxs('div', {
                                      className: 'flex items-start justify-between mb-3',
                                      children: [
                                        _jsxs('div', {
                                          children: [
                                            _jsx('h4', {
                                              className: 'font-medium',
                                              children: doc.fileName
                                            }),
                                            _jsxs('p', {
                                              className: 'text-sm text-gray-600',
                                              children: [
                                                (doc.fileSize / 1024).toFixed(1),
                                                ' KB \u2022',
                                                ' ',
                                                doc.uploadDate.toLocaleDateString()
                                              ]
                                            })
                                          ]
                                        }),
                                        _jsx(Badge, {
                                          variant:
                                            doc.status === 'completed'
                                              ? 'default'
                                              : doc.status === 'processing'
                                                ? 'secondary'
                                                : 'destructive',
                                          children: doc.status
                                        })
                                      ]
                                    }),
                                    doc.status === 'completed' &&
                                      _jsxs('div', {
                                        className: 'space-y-3',
                                        children: [
                                          _jsxs('div', {
                                            children: [
                                              _jsx('span', {
                                                className: 'text-sm font-medium',
                                                children: 'SFDR Relevance:'
                                              }),
                                              _jsxs('div', {
                                                className: 'flex items-center gap-2 mt-1',
                                                children: [
                                                  _jsx(Progress, {
                                                    value: doc.sfdrRelevance,
                                                    className: 'flex-1 h-2'
                                                  }),
                                                  _jsxs('span', {
                                                    className: 'text-sm',
                                                    children: [doc.sfdrRelevance, '%']
                                                  })
                                                ]
                                              })
                                            ]
                                          }),
                                          _jsxs('div', {
                                            children: [
                                              _jsx('span', {
                                                className: 'text-sm font-medium block mb-1',
                                                children: 'Summary:'
                                              }),
                                              _jsx('p', {
                                                className: 'text-sm text-gray-700',
                                                children: doc.summary
                                              })
                                            ]
                                          }),
                                          _jsxs('div', {
                                            children: [
                                              _jsx('span', {
                                                className: 'text-sm font-medium block mb-1',
                                                children: 'Extracted Entities:'
                                              }),
                                              _jsx('div', {
                                                className: 'flex flex-wrap gap-1',
                                                children: doc.extractedEntities.map(
                                                  (entity, index) =>
                                                    _jsx(
                                                      Badge,
                                                      {
                                                        variant: 'outline',
                                                        className: 'text-xs',
                                                        children: entity
                                                      },
                                                      index
                                                    )
                                                )
                                              })
                                            ]
                                          }),
                                          _jsxs('div', {
                                            className: 'grid grid-cols-2 gap-4',
                                            children: [
                                              _jsxs('div', {
                                                children: [
                                                  _jsx('span', {
                                                    className: 'text-sm font-medium block mb-1',
                                                    children: 'Sentiment:'
                                                  }),
                                                  _jsx(Badge, {
                                                    variant:
                                                      doc.sentiment === 'positive'
                                                        ? 'default'
                                                        : doc.sentiment === 'negative'
                                                          ? 'destructive'
                                                          : 'secondary',
                                                    className: 'text-xs',
                                                    children: doc.sentiment
                                                  })
                                                ]
                                              }),
                                              _jsxs('div', {
                                                children: [
                                                  _jsx('span', {
                                                    className: 'text-sm font-medium block mb-1',
                                                    children: 'Topics:'
                                                  }),
                                                  _jsx('div', {
                                                    className: 'flex flex-wrap gap-1',
                                                    children: doc.topics
                                                      .slice(0, 2)
                                                      .map((topic, index) =>
                                                        _jsx(
                                                          Badge,
                                                          {
                                                            variant: 'outline',
                                                            className: 'text-xs',
                                                            children: topic
                                                          },
                                                          index
                                                        )
                                                      )
                                                  })
                                                ]
                                              })
                                            ]
                                          }),
                                          doc.complianceIssues.length > 0 &&
                                            _jsxs(Alert, {
                                              children: [
                                                _jsx(AlertTriangle, { className: 'h-4 w-4' }),
                                                _jsxs(AlertDescription, {
                                                  children: [
                                                    _jsx('strong', {
                                                      children: 'Compliance Issues:'
                                                    }),
                                                    ' ',
                                                    doc.complianceIssues.join(', ')
                                                  ]
                                                })
                                              ]
                                            })
                                        ]
                                      }),
                                    doc.status === 'processing' &&
                                      _jsxs('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          _jsx('div', {
                                            className:
                                              'w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'
                                          }),
                                          _jsx('span', {
                                            className: 'text-sm text-gray-600',
                                            children: 'Analyzing document...'
                                          })
                                        ]
                                      })
                                  ]
                                },
                                doc.id
                              )
                            )
                          })
                        })
                      ]
                    }),
                  uploadedDocuments.length === 0 &&
                    _jsx(Card, {
                      children: _jsx(CardContent, {
                        className: 'pt-6',
                        children: _jsxs('div', {
                          className: 'text-center text-gray-500',
                          children: [
                            _jsx(FileText, { className: 'w-12 h-12 mx-auto mb-4 text-gray-300' }),
                            _jsx('p', { children: 'No documents uploaded yet' }),
                            _jsx('p', {
                              className: 'text-sm',
                              children: 'Upload documents to start analysis'
                            })
                          ]
                        })
                      })
                    })
                ]
              })
            }),
            _jsxs(TabsContent, {
              value: 'export',
              children: [
                _jsxs('div', {
                  className: 'grid grid-cols-1 md:grid-cols-3 gap-6',
                  children: [
                    _jsxs(Card, {
                      className: 'cursor-pointer hover:shadow-lg transition-shadow',
                      onClick: () => handleExport('pdf'),
                      children: [
                        _jsxs(CardHeader, {
                          children: [
                            _jsxs(CardTitle, {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx(FileText, { className: 'w-5 h-5 text-red-600' }),
                                'PDF Report'
                              ]
                            }),
                            _jsx(CardDescription, {
                              children:
                                'Comprehensive SFDR compliance report with analysis and recommendations'
                            })
                          ]
                        }),
                        _jsx(CardContent, {
                          children: _jsxs(Button, {
                            variant: 'outline',
                            className: 'w-full',
                            children: [_jsx(Download, { className: 'w-4 h-4 mr-2' }), 'Export PDF']
                          })
                        })
                      ]
                    }),
                    _jsxs(Card, {
                      className: 'cursor-pointer hover:shadow-lg transition-shadow',
                      onClick: () => handleExport('excel'),
                      children: [
                        _jsxs(CardHeader, {
                          children: [
                            _jsxs(CardTitle, {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx(BarChart3, { className: 'w-5 h-5 text-green-600' }),
                                'Excel Workbook'
                              ]
                            }),
                            _jsx(CardDescription, {
                              children:
                                'Detailed data analysis with charts, metrics, and compliance tracking'
                            })
                          ]
                        }),
                        _jsx(CardContent, {
                          children: _jsxs(Button, {
                            variant: 'outline',
                            className: 'w-full',
                            children: [
                              _jsx(Download, { className: 'w-4 h-4 mr-2' }),
                              'Export Excel'
                            ]
                          })
                        })
                      ]
                    }),
                    _jsxs(Card, {
                      className: 'cursor-pointer hover:shadow-lg transition-shadow',
                      onClick: () => handleExport('json'),
                      children: [
                        _jsxs(CardHeader, {
                          children: [
                            _jsxs(CardTitle, {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx(Globe, { className: 'w-5 h-5 text-blue-600' }),
                                'JSON Data'
                              ]
                            }),
                            _jsx(CardDescription, {
                              children:
                                'Raw data export for integration with other systems and APIs'
                            })
                          ]
                        }),
                        _jsx(CardContent, {
                          children: _jsxs(Button, {
                            variant: 'outline',
                            className: 'w-full',
                            children: [_jsx(Download, { className: 'w-4 h-4 mr-2' }), 'Export JSON']
                          })
                        })
                      ]
                    })
                  ]
                }),
                _jsxs(Card, {
                  className: 'mt-6',
                  children: [
                    _jsx(CardHeader, {
                      children: _jsxs(CardTitle, {
                        className: 'flex items-center gap-2',
                        children: [
                          _jsx(FileCheck, { className: 'w-5 h-5 text-purple-600' }),
                          'Export Summary'
                        ]
                      })
                    }),
                    _jsx(CardContent, {
                      children: _jsxs(Alert, {
                        children: [
                          _jsx(AlertTriangle, { className: 'h-4 w-4' }),
                          _jsxs(AlertDescription, {
                            children: [
                              _jsx('strong', { children: 'Ready for Export:' }),
                              _jsxs('ul', {
                                className: 'mt-2 space-y-1',
                                children: [
                                  _jsxs('li', {
                                    children: [
                                      '\u2022 ',
                                      classificationResult ? '1' : '0',
                                      ' fund classification'
                                    ]
                                  }),
                                  _jsxs('li', {
                                    children: [
                                      '\u2022 ',
                                      uploadedDocuments.length,
                                      ' analyzed documents'
                                    ]
                                  }),
                                  _jsxs('li', {
                                    children: ['\u2022 ', messages.length, ' chat messages']
                                  }),
                                  _jsxs('li', {
                                    children: [
                                      '\u2022 ',
                                      contextualMemory.recentClassifications.length,
                                      ' historical classifications'
                                    ]
                                  })
                                ]
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
          ]
        })
      ]
    })
  });
};
export default SFDRGem;
