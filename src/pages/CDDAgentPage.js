import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CDDMetricsDashboard,
  CDDFeatureShowcase,
  ComplianceStandards,
  CDDArchitecture,
  PerformanceBenchmarks,
  CustomerSuccessStories
} from '@/components/CDDComponents';
import { NexusAgentChat } from '@/components/NexusAgentChat';
import {
  Shield,
  Brain,
  Zap,
  CheckCircle,
  TrendingUp,
  Globe,
  Eye,
  BarChart3,
  Target,
  Sparkles,
  ArrowRight,
  Play,
  ArrowLeft,
  Download,
  Calendar,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
const CDDAgentPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const heroRef = React.useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return _jsx('div', {
      className:
        'min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center',
      children: _jsxs(motion.div, {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        className: 'text-center space-y-4',
        children: [
          _jsx('div', {
            className:
              'w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto'
          }),
          _jsx('p', {
            className: 'text-lg text-muted-foreground',
            children: 'Loading CDD Agent...'
          })
        ]
      })
    });
  }
  return _jsxs('div', {
    className: 'min-h-screen bg-gradient-to-br from-background via-background to-muted/20',
    children: [
      _jsx(motion.div, {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        className: 'sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border',
        children: _jsx('div', {
          className: 'container mx-auto max-w-7xl px-4 py-4',
          children: _jsxs('div', {
            className: 'flex items-center justify-between',
            children: [
              _jsxs(Button, {
                variant: 'ghost',
                onClick: () => navigate('/agents'),
                className: 'flex items-center gap-2',
                children: [_jsx(ArrowLeft, { className: 'w-4 h-4' }), 'Back to Agents']
              }),
              _jsxs('div', {
                className: 'flex items-center gap-4',
                children: [
                  _jsxs(Button, {
                    variant: 'outline',
                    size: 'sm',
                    children: [_jsx(Download, { className: 'w-4 h-4 mr-2' }), 'Download Whitepaper']
                  }),
                  _jsxs(Button, {
                    size: 'sm',
                    children: [_jsx(MessageCircle, { className: 'w-4 h-4 mr-2' }), 'Contact Sales']
                  })
                ]
              })
            ]
          })
        })
      }),
      _jsxs('section', {
        ref: heroRef,
        className: 'relative overflow-hidden py-20 px-4',
        children: [
          _jsx('div', {
            className:
              'absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-600/10'
          }),
          _jsx('div', {
            className: 'absolute inset-0 overflow-hidden',
            children: [...Array(20)].map((_, i) =>
              _jsx(
                motion.div,
                {
                  className: 'absolute w-2 h-2 bg-primary/20 rounded-full',
                  initial: {
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    scale: 0
                  },
                  animate: {
                    y: [null, -100],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  },
                  transition: {
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }
                },
                i
              )
            )
          }),
          _jsx('div', {
            className: 'container mx-auto max-w-7xl relative z-10',
            children: _jsxs(motion.div, {
              initial: { opacity: 0, y: 30 },
              animate: isHeroInView ? { opacity: 1, y: 0 } : {},
              transition: { duration: 0.8 },
              className: 'text-center space-y-8',
              children: [
                _jsx('div', {
                  className: 'flex justify-center',
                  children: _jsxs(Badge, {
                    variant: 'secondary',
                    className:
                      'px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20',
                    children: [
                      _jsx(Sparkles, { className: 'w-4 h-4 mr-2' }),
                      'Next-Generation CDD Technology \u2022 Launching Q2 2024'
                    ]
                  })
                }),
                _jsxs('div', {
                  className: 'space-y-4',
                  children: [
                    _jsx(motion.h1, {
                      initial: { opacity: 0, scale: 0.9 },
                      animate: isHeroInView ? { opacity: 1, scale: 1 } : {},
                      transition: { delay: 0.2, duration: 0.8 },
                      className:
                        'text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent',
                      children: 'CDD Agent'
                    }),
                    _jsx(motion.div, {
                      initial: { opacity: 0 },
                      animate: isHeroInView ? { opacity: 1 } : {},
                      transition: { delay: 0.4, duration: 0.8 },
                      className: 'text-lg md:text-xl text-primary font-semibold',
                      children: 'Redefining Customer Due Diligence with Artificial Intelligence'
                    })
                  ]
                }),
                _jsxs(motion.p, {
                  initial: { opacity: 0, y: 20 },
                  animate: isHeroInView ? { opacity: 1, y: 0 } : {},
                  transition: { delay: 0.6, duration: 0.8 },
                  className:
                    'text-xl md:text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed',
                  children: [
                    'Revolutionary AI-powered platform that transforms compliance operations with',
                    _jsxs('span', {
                      className: 'text-primary font-semibold bg-primary/10 px-2 py-1 rounded',
                      children: [' ', '99.7% accuracy']
                    }),
                    ',',
                    _jsxs('span', {
                      className: 'text-primary font-semibold bg-primary/10 px-2 py-1 rounded',
                      children: [' ', '95% faster processing']
                    }),
                    ', and',
                    _jsxs('span', {
                      className: 'text-primary font-semibold bg-primary/10 px-2 py-1 rounded',
                      children: [' ', '60% cost reduction']
                    })
                  ]
                }),
                _jsxs(motion.div, {
                  initial: { opacity: 0, y: 20 },
                  animate: isHeroInView ? { opacity: 1, y: 0 } : {},
                  transition: { delay: 0.8, duration: 0.8 },
                  className: 'flex flex-col sm:flex-row gap-4 justify-center items-center',
                  children: [
                    _jsxs(Button, {
                      size: 'lg',
                      className:
                        'px-10 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl',
                      onClick: () => console.log('Play demo video'),
                      children: [_jsx(Play, { className: 'w-5 h-5 mr-2' }), 'Watch Live Demo']
                    }),
                    _jsxs(Button, {
                      variant: 'outline',
                      size: 'lg',
                      className: 'px-10 py-6 text-lg border-2',
                      children: [
                        _jsx(Calendar, { className: 'w-5 h-5 mr-2' }),
                        'Schedule Consultation'
                      ]
                    }),
                    _jsxs(Button, {
                      variant: 'ghost',
                      size: 'lg',
                      className: 'px-6 py-6 text-lg',
                      children: [
                        _jsx(ExternalLink, { className: 'w-5 h-5 mr-2' }),
                        'View Documentation'
                      ]
                    })
                  ]
                }),
                _jsx(motion.div, {
                  initial: { opacity: 0, y: 30 },
                  animate: isHeroInView ? { opacity: 1, y: 0 } : {},
                  transition: { delay: 1, duration: 0.8 },
                  className: 'grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto pt-16',
                  children: [
                    {
                      label: 'Accuracy Rate',
                      value: '99.7%',
                      icon: _jsx(Target, { className: 'w-8 h-8' }),
                      color: 'from-green-500 to-emerald-600'
                    },
                    {
                      label: 'Processing Speed',
                      value: '2.3s',
                      icon: _jsx(Zap, { className: 'w-8 h-8' }),
                      color: 'from-blue-500 to-cyan-600'
                    },
                    {
                      label: 'Cost Reduction',
                      value: '60%',
                      icon: _jsx(TrendingUp, { className: 'w-8 h-8' }),
                      color: 'from-purple-500 to-indigo-600'
                    },
                    {
                      label: 'Global Coverage',
                      value: '50+',
                      icon: _jsx(Globe, { className: 'w-8 h-8' }),
                      color: 'from-orange-500 to-red-600'
                    }
                  ].map((stat, index) =>
                    _jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, y: 20, scale: 0.9 },
                        animate: isHeroInView ? { opacity: 1, y: 0, scale: 1 } : {},
                        transition: { delay: 1.2 + index * 0.1 },
                        whileHover: { scale: 1.05, y: -5 },
                        className: `relative p-6 rounded-2xl bg-gradient-to-br ${stat.color} text-white text-center space-y-3 shadow-xl cursor-pointer group`,
                        children: [
                          _jsx('div', {
                            className:
                              'flex justify-center text-white/90 group-hover:text-white transition-colors',
                            children: stat.icon
                          }),
                          _jsx('div', {
                            className: 'text-3xl md:text-4xl font-bold',
                            children: stat.value
                          }),
                          _jsx('div', {
                            className: 'text-sm text-white/80 font-medium',
                            children: stat.label
                          }),
                          _jsx(motion.div, {
                            className: 'absolute inset-0 bg-white/10 rounded-2xl',
                            initial: { opacity: 0 },
                            whileHover: { opacity: 1 },
                            transition: { duration: 0.3 }
                          })
                        ]
                      },
                      index
                    )
                  )
                })
              ]
            })
          })
        ]
      }),
      _jsx('section', {
        className: 'py-20 px-4 bg-gradient-to-br from-muted/30 to-background',
        children: _jsxs('div', {
          className: 'container mx-auto max-w-7xl',
          children: [
            _jsxs(motion.div, {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: 'text-center space-y-4 mb-16',
              children: [
                _jsx('h2', {
                  className: 'text-4xl md:text-5xl font-bold',
                  children: 'Performance Excellence'
                }),
                _jsx('p', {
                  className: 'text-xl text-muted-foreground max-w-3xl mx-auto',
                  children: 'Industry-leading metrics that set new standards for CDD technology'
                })
              ]
            }),
            _jsx(CDDMetricsDashboard, {})
          ]
        })
      }),
      _jsx('section', {
        className: 'py-20 px-4',
        children: _jsx('div', {
          className: 'container mx-auto max-w-7xl',
          children: _jsxs(Tabs, {
            value: activeTab,
            onValueChange: setActiveTab,
            className: 'space-y-12',
            children: [
              _jsx('div', {
                className: 'flex justify-center',
                children: _jsxs(TabsList, {
                  className: 'grid grid-cols-2 md:grid-cols-6 h-auto p-2 bg-muted/50 rounded-2xl',
                  children: [
                    _jsxs(TabsTrigger, {
                      value: 'overview',
                      className:
                        'py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl',
                      children: [_jsx(Eye, { className: 'w-4 h-4 mr-2' }), 'Overview']
                    }),
                    _jsxs(TabsTrigger, {
                      value: 'features',
                      className:
                        'py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl',
                      children: [_jsx(Sparkles, { className: 'w-4 h-4 mr-2' }), 'Features']
                    }),
                    _jsxs(TabsTrigger, {
                      value: 'demo',
                      className:
                        'py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl',
                      children: [_jsx(Play, { className: 'w-4 h-4 mr-2' }), 'Live Demo']
                    }),
                    _jsxs(TabsTrigger, {
                      value: 'architecture',
                      className:
                        'py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl',
                      children: [_jsx(Brain, { className: 'w-4 h-4 mr-2' }), 'Architecture']
                    }),
                    _jsxs(TabsTrigger, {
                      value: 'compliance',
                      className:
                        'py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl',
                      children: [_jsx(Shield, { className: 'w-4 h-4 mr-2' }), 'Compliance']
                    }),
                    _jsxs(TabsTrigger, {
                      value: 'benchmarks',
                      className:
                        'py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl',
                      children: [_jsx(BarChart3, { className: 'w-4 h-4 mr-2' }), 'Benchmarks']
                    })
                  ]
                })
              }),
              _jsxs(TabsContent, {
                value: 'overview',
                className: 'space-y-16',
                children: [
                  _jsxs('div', {
                    className: 'space-y-8',
                    children: [
                      _jsxs(motion.div, {
                        initial: { opacity: 0, y: 30 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true },
                        className: 'text-center space-y-4',
                        children: [
                          _jsx('h2', {
                            className: 'text-4xl md:text-5xl font-bold',
                            children: 'Revolutionary Features'
                          }),
                          _jsx('p', {
                            className: 'text-xl text-muted-foreground max-w-3xl mx-auto',
                            children:
                              'Experience the future of Customer Due Diligence with our cutting-edge AI capabilities'
                          })
                        ]
                      }),
                      _jsx(CDDFeatureShowcase, {})
                    ]
                  }),
                  _jsxs('div', {
                    className: 'space-y-8',
                    children: [
                      _jsxs(motion.div, {
                        initial: { opacity: 0, y: 30 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true },
                        className: 'text-center space-y-4',
                        children: [
                          _jsx('h2', {
                            className: 'text-4xl md:text-5xl font-bold',
                            children: 'Customer Success Stories'
                          }),
                          _jsx('p', {
                            className: 'text-xl text-muted-foreground max-w-3xl mx-auto',
                            children:
                              'See how leading organizations are transforming their compliance operations'
                          })
                        ]
                      }),
                      _jsx(CustomerSuccessStories, {})
                    ]
                  })
                ]
              }),
              _jsx(TabsContent, {
                value: 'features',
                className: 'space-y-12',
                children: _jsx(CDDFeatureShowcase, {})
              }),
              _jsx(TabsContent, {
                value: 'demo',
                className: 'space-y-12',
                children: _jsxs('div', {
                  className: 'text-center space-y-8',
                  children: [
                    _jsx('h2', { className: 'text-4xl font-bold', children: 'Interactive Demo' }),
                    _jsx('p', {
                      className: 'text-xl text-muted-foreground max-w-3xl mx-auto',
                      children: 'Experience CDD Agent in action with our interactive demonstration'
                    }),
                    _jsx('div', {
                      className: 'relative max-w-4xl mx-auto',
                      children: _jsx('div', {
                        className: 'bg-background rounded-2xl border shadow-lg',
                        children: _jsx(NexusAgentChat, {
                          apiEndpoint: 'nexus-classify',
                          className: 'h-[600px]'
                        })
                      })
                    })
                  ]
                })
              }),
              _jsxs(TabsContent, {
                value: 'architecture',
                className: 'space-y-12',
                children: [
                  _jsxs('div', {
                    className: 'text-center space-y-4 mb-12',
                    children: [
                      _jsx('h2', {
                        className: 'text-4xl font-bold',
                        children: 'System Architecture'
                      }),
                      _jsx('p', {
                        className: 'text-xl text-muted-foreground max-w-3xl mx-auto',
                        children:
                          'Scalable, secure, and intelligent infrastructure designed for enterprise needs'
                      })
                    ]
                  }),
                  _jsx(CDDArchitecture, {})
                ]
              }),
              _jsxs(TabsContent, {
                value: 'compliance',
                className: 'space-y-12',
                children: [
                  _jsxs('div', {
                    className: 'text-center space-y-4 mb-12',
                    children: [
                      _jsx('h2', {
                        className: 'text-4xl font-bold',
                        children: 'Regulatory Compliance'
                      }),
                      _jsx('p', {
                        className: 'text-xl text-muted-foreground max-w-3xl mx-auto',
                        children:
                          'Comprehensive coverage of global compliance standards and regulations'
                      })
                    ]
                  }),
                  _jsx(ComplianceStandards, {}),
                  _jsxs('div', {
                    className: 'grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12',
                    children: [
                      _jsxs(Card, {
                        className:
                          'border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
                        children: [
                          _jsx(CardHeader, {
                            children: _jsxs(CardTitle, {
                              className:
                                'flex items-center gap-3 text-green-700 dark:text-green-400',
                              children: [
                                _jsx(Shield, { className: 'w-6 h-6' }),
                                'Security & Privacy'
                              ]
                            })
                          }),
                          _jsx(CardContent, {
                            className: 'space-y-4',
                            children: [
                              'End-to-end encryption for all data in transit and at rest',
                              'SOC 2 Type II certified infrastructure with annual audits',
                              'GDPR compliant data processing with privacy by design',
                              'Regular security audits and penetration testing',
                              'Zero-trust security architecture with multi-factor authentication',
                              'Data anonymization and pseudonymization capabilities'
                            ].map((item, idx) =>
                              _jsxs(
                                motion.div,
                                {
                                  initial: { opacity: 0, x: -20 },
                                  whileInView: { opacity: 1, x: 0 },
                                  viewport: { once: true },
                                  transition: { delay: idx * 0.1 },
                                  className: 'flex items-start gap-3',
                                  children: [
                                    _jsx(CheckCircle, {
                                      className: 'w-5 h-5 text-green-500 mt-0.5 flex-shrink-0'
                                    }),
                                    _jsx('span', {
                                      className: 'text-sm leading-relaxed',
                                      children: item
                                    })
                                  ]
                                },
                                idx
                              )
                            )
                          })
                        ]
                      }),
                      _jsxs(Card, {
                        className:
                          'border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
                        children: [
                          _jsx(CardHeader, {
                            children: _jsxs(CardTitle, {
                              className: 'flex items-center gap-3 text-blue-700 dark:text-blue-400',
                              children: [_jsx(Globe, { className: 'w-6 h-6' }), 'Global Coverage']
                            })
                          }),
                          _jsx(CardContent, {
                            className: 'space-y-4',
                            children: [
                              '50+ countries regulatory compliance with local expertise',
                              'Real-time sanctions list updates from OFAC, UN, EU, and more',
                              'Multi-language document processing in 25+ languages',
                              'Local data residency options in major jurisdictions',
                              '24/7 compliance monitoring with intelligent alerting',
                              'Regulatory change management with automatic updates'
                            ].map((item, idx) =>
                              _jsxs(
                                motion.div,
                                {
                                  initial: { opacity: 0, x: -20 },
                                  whileInView: { opacity: 1, x: 0 },
                                  viewport: { once: true },
                                  transition: { delay: idx * 0.1 },
                                  className: 'flex items-start gap-3',
                                  children: [
                                    _jsx(CheckCircle, {
                                      className: 'w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0'
                                    }),
                                    _jsx('span', {
                                      className: 'text-sm leading-relaxed',
                                      children: item
                                    })
                                  ]
                                },
                                idx
                              )
                            )
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              _jsxs(TabsContent, {
                value: 'benchmarks',
                className: 'space-y-12',
                children: [
                  _jsxs('div', {
                    className: 'text-center space-y-4 mb-12',
                    children: [
                      _jsx('h2', {
                        className: 'text-4xl font-bold',
                        children: 'Performance Benchmarks'
                      }),
                      _jsx('p', {
                        className: 'text-xl text-muted-foreground max-w-3xl mx-auto',
                        children:
                          'See how CDD Agent outperforms industry standards across key metrics'
                      })
                    ]
                  }),
                  _jsx(PerformanceBenchmarks, {})
                ]
              })
            ]
          })
        })
      }),
      _jsxs('section', {
        className:
          'py-20 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden',
        children: [
          _jsx('div', { className: 'absolute inset-0 bg-black/10' }),
          _jsx('div', {
            className: 'container mx-auto max-w-7xl relative z-10',
            children: _jsxs(motion.div, {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: 'text-center space-y-8',
              children: [
                _jsx('h2', {
                  className: 'text-4xl md:text-5xl font-bold',
                  children: 'Ready to Transform Your CDD Process?'
                }),
                _jsx('p', {
                  className: 'text-xl text-white/90 max-w-3xl mx-auto',
                  children:
                    'Join leading financial institutions using CDD Agent to streamline compliance, reduce costs, and enhance customer experience.'
                }),
                _jsxs('div', {
                  className: 'flex flex-col sm:flex-row gap-4 justify-center items-center',
                  children: [
                    _jsxs(Button, {
                      size: 'lg',
                      variant: 'secondary',
                      className: 'bg-white text-blue-600 hover:bg-blue-50 px-10 py-6 text-lg',
                      children: [
                        'Start Free Trial',
                        _jsx(ArrowRight, { className: 'w-5 h-5 ml-2' })
                      ]
                    }),
                    _jsxs(Button, {
                      size: 'lg',
                      variant: 'outline',
                      className: 'border-white text-white hover:bg-white/10 px-10 py-6 text-lg',
                      children: [_jsx(Calendar, { className: 'w-5 h-5 mr-2' }), 'Schedule Demo']
                    })
                  ]
                }),
                _jsxs('div', {
                  className: 'flex items-center justify-center gap-8 pt-8 text-sm text-white/80',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center gap-2',
                      children: [_jsx(CheckCircle, { className: 'w-4 h-4' }), 'No setup fees']
                    }),
                    _jsxs('div', {
                      className: 'flex items-center gap-2',
                      children: [_jsx(CheckCircle, { className: 'w-4 h-4' }), '30-day free trial']
                    }),
                    _jsxs('div', {
                      className: 'flex items-center gap-2',
                      children: [_jsx(CheckCircle, { className: 'w-4 h-4' }), 'Cancel anytime']
                    })
                  ]
                })
              ]
            })
          })
        ]
      })
    ]
  });
};
export default CDDAgentPage;
