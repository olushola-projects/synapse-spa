import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  BarChart3,
  Play,
  Pause,
  Eye,
  Share2,
  Bookmark,
  ExternalLink
} from 'lucide-react';
/**
 * Interactive demo component for agent capabilities
 */
const AgentDemo = ({}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const demoSteps = [
    {
      title: 'Data Input',
      description: 'Agent receives and processes input data'
    },
    {
      title: 'Analysis',
      description: 'AI algorithms analyze and interpret information'
    },
    {
      title: 'Processing',
      description: 'Advanced processing using machine learning models'
    },
    {
      title: 'Output',
      description: 'Generates accurate results and recommendations'
    }
  ];
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % demoSteps.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);
  return _jsxs('div', {
    className: 'space-y-4',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsxs('h4', {
            className: 'font-semibold flex items-center gap-2',
            children: [_jsx(Play, { className: 'w-4 h-4' }), 'Live Demo']
          }),
          _jsxs(Button, {
            variant: 'outline',
            size: 'sm',
            onClick: () => setIsPlaying(!isPlaying),
            children: [
              isPlaying
                ? _jsx(Pause, { className: 'w-4 h-4' })
                : _jsx(Play, { className: 'w-4 h-4' }),
              isPlaying ? 'Pause' : 'Play'
            ]
          })
        ]
      }),
      _jsxs('div', {
        className: 'relative',
        children: [
          _jsx('div', {
            className: 'grid grid-cols-2 gap-2',
            children: demoSteps.map((step, index) =>
              _jsxs(
                motion.div,
                {
                  className: `p-3 rounded-lg border transition-all duration-300 ${currentStep === index ? 'bg-primary/10 border-primary' : 'bg-muted/50 border-border'}`,
                  animate: {
                    scale: currentStep === index ? 1.02 : 1,
                    opacity: currentStep === index ? 1 : 0.7
                  },
                  children: [
                    _jsx('div', { className: 'text-sm font-medium', children: step.title }),
                    _jsx('div', {
                      className: 'text-xs text-muted-foreground',
                      children: step.description
                    })
                  ]
                },
                index
              )
            )
          }),
          _jsx(motion.div, {
            className: 'absolute inset-0 pointer-events-none',
            animate: {
              background: `conic-gradient(from ${currentStep * 90}deg, transparent, rgba(var(--primary), 0.1), transparent)`
            },
            transition: {
              duration: 0.5
            }
          })
        ]
      })
    ]
  });
};
/**
 * Advanced metrics visualization component
 */
const MetricsVisualization = ({ metrics }) => {
  const [hoveredMetric, setHoveredMetric] = useState(null);
  return _jsxs('div', {
    className: 'space-y-4',
    children: [
      _jsxs('h4', {
        className: 'font-semibold flex items-center gap-2',
        children: [_jsx(BarChart3, { className: 'w-4 h-4' }), 'Performance Metrics']
      }),
      _jsx('div', {
        className: 'grid grid-cols-2 gap-4',
        children: Object.entries(metrics).map(([key, value]) =>
          _jsxs(
            motion.div,
            {
              className: 'space-y-2 cursor-pointer',
              onHoverStart: () => setHoveredMetric(key),
              onHoverEnd: () => setHoveredMetric(null),
              whileHover: {
                scale: 1.05
              },
              children: [
                _jsxs('div', {
                  className: 'flex justify-between items-center',
                  children: [
                    _jsx('span', { className: 'text-sm font-medium capitalize', children: key }),
                    _jsxs('span', {
                      className: 'text-sm font-bold text-primary',
                      children: [value, '%']
                    })
                  ]
                }),
                _jsx(Progress, {
                  value: value,
                  className: `h-2 transition-all duration-300 ${hoveredMetric === key ? 'h-3' : 'h-2'}`
                }),
                _jsx(AnimatePresence, {
                  children:
                    hoveredMetric === key &&
                    _jsxs(motion.div, {
                      initial: {
                        opacity: 0,
                        y: -10
                      },
                      animate: {
                        opacity: 1,
                        y: 0
                      },
                      exit: {
                        opacity: 0,
                        y: -10
                      },
                      className: 'text-xs text-muted-foreground',
                      children: [
                        key === 'accuracy' && 'Precision in task completion',
                        key === 'speed' && 'Processing time efficiency',
                        key === 'reliability' && 'Consistent performance',
                        key === 'satisfaction' && 'User satisfaction rating'
                      ]
                    })
                })
              ]
            },
            key
          )
        )
      })
    ]
  });
};
/**
 * Testimonials carousel component
 */
const TestimonialsCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  if (!testimonials.length) {
    return null;
  }
  return _jsxs('div', {
    className: 'space-y-4',
    children: [
      _jsxs('h4', {
        className: 'font-semibold flex items-center gap-2',
        children: [_jsx(Star, { className: 'w-4 h-4' }), 'Customer Testimonials']
      }),
      _jsxs('div', {
        className: 'relative overflow-hidden rounded-lg bg-muted/30 p-4',
        children: [
          _jsx(AnimatePresence, {
            mode: 'wait',
            children: _jsxs(
              motion.div,
              {
                initial: {
                  opacity: 0,
                  x: 20
                },
                animate: {
                  opacity: 1,
                  x: 0
                },
                exit: {
                  opacity: 0,
                  x: -20
                },
                transition: {
                  duration: 0.3
                },
                className: 'space-y-3',
                children: [
                  _jsx('div', {
                    className: 'flex items-center gap-1',
                    children: [...Array(5)].map((_, i) =>
                      _jsx(
                        Star,
                        {
                          className: `w-4 h-4 ${i < (testimonials[currentIndex]?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`
                        },
                        i
                      )
                    )
                  }),
                  _jsxs('p', {
                    className: 'text-sm italic',
                    children: ['"', testimonials[currentIndex]?.quote || '', '"']
                  }),
                  _jsxs('div', {
                    className: 'text-xs text-muted-foreground',
                    children: [
                      _jsx('div', {
                        className: 'font-medium',
                        children: testimonials[currentIndex]?.name || ''
                      }),
                      _jsx('div', { children: testimonials[currentIndex]?.company || '' })
                    ]
                  })
                ]
              },
              currentIndex
            )
          }),
          _jsx('div', {
            className: 'flex justify-center gap-2 mt-4',
            children: testimonials.map((_, index) =>
              _jsx(
                'button',
                {
                  className: `w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'}`,
                  onClick: () => setCurrentIndex(index)
                },
                index
              )
            )
          })
        ]
      })
    ]
  });
};
/**
 * Enhanced agent card with advanced interactions
 */
const EnhancedAgentCard = ({ agent, index }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  const handleMouseMove = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  return _jsx(motion.div, {
    className: 'h-full perspective-1000',
    initial: {
      opacity: 0,
      y: 50
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.6,
      delay: index * 0.1
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: {
      rotateX,
      rotateY,
      transformStyle: 'preserve-3d'
    },
    children: _jsxs(Card, {
      className:
        'h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm',
      children: [
        _jsxs(CardHeader, {
          className: 'pb-4 relative',
          children: [
            _jsxs('div', {
              className:
                'absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity',
              children: [
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: () => setIsBookmarked(!isBookmarked),
                  className: 'h-8 w-8 p-0',
                  children: _jsx(Bookmark, {
                    className: `w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`
                  })
                }),
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  className: 'h-8 w-8 p-0',
                  children: _jsx(Share2, { className: 'w-4 h-4' })
                })
              ]
            }),
            _jsxs('div', {
              className: 'flex items-start justify-between pr-16',
              children: [
                _jsx('div', {
                  className: `p-4 rounded-2xl bg-gradient-to-r ${agent.gradient} text-white shadow-lg transform transition-transform hover:scale-110`,
                  children: agent.icon
                }),
                _jsx('div', {
                  className: 'flex flex-col items-end gap-2',
                  children: _jsx(Badge, {
                    variant:
                      agent.status === 'launching'
                        ? 'default'
                        : agent.status === 'live'
                          ? 'secondary'
                          : 'secondary',
                    className: 'capitalize font-medium animate-pulse',
                    children:
                      agent.status === 'launching'
                        ? _jsxs(_Fragment, {
                            children: [
                              _jsx(Sparkles, { className: 'w-3 h-3 mr-1' }),
                              'Launching Soon'
                            ]
                          })
                        : agent.status === 'live'
                          ? _jsxs(_Fragment, {
                              children: [_jsx(Sparkles, { className: 'w-3 h-3 mr-1' }), 'Live']
                            })
                          : agent.status.replace('-', ' ')
                  })
                })
              ]
            }),
            _jsxs('div', {
              className: 'space-y-3 mt-4',
              children: [
                _jsx(CardTitle, {
                  className:
                    'text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent',
                  children: agent.name
                }),
                _jsx(CardDescription, {
                  className: 'text-sm leading-relaxed',
                  children: agent.description
                })
              ]
            })
          ]
        }),
        _jsxs(CardContent, {
          className: 'space-y-6',
          children: [
            _jsx('div', {
              className: 'flex gap-1 p-1 bg-muted rounded-lg',
              children: ['overview', 'demo', 'metrics', 'testimonials'].map(tab =>
                _jsx(
                  'button',
                  {
                    onClick: () => setActiveTab(tab),
                    className: `flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all capitalize ${activeTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`,
                    children: tab
                  },
                  tab
                )
              )
            }),
            _jsx(AnimatePresence, {
              mode: 'wait',
              children: _jsxs(
                motion.div,
                {
                  initial: {
                    opacity: 0,
                    y: 10
                  },
                  animate: {
                    opacity: 1,
                    y: 0
                  },
                  exit: {
                    opacity: 0,
                    y: -10
                  },
                  transition: {
                    duration: 0.2
                  },
                  className: 'min-h-[200px]',
                  children: [
                    activeTab === 'overview' &&
                      _jsxs('div', {
                        className: 'space-y-4',
                        children: [
                          _jsxs('div', {
                            className: 'space-y-3',
                            children: [
                              _jsxs('h4', {
                                className: 'font-semibold text-sm flex items-center gap-2',
                                children: [
                                  _jsx(Brain, { className: 'w-4 h-4' }),
                                  'Core Capabilities'
                                ]
                              }),
                              _jsx('div', {
                                className: 'flex flex-wrap gap-2',
                                children: agent.capabilities.map((capability, idx) =>
                                  _jsx(
                                    Badge,
                                    {
                                      variant: 'secondary',
                                      className: 'text-xs',
                                      children: capability
                                    },
                                    idx
                                  )
                                )
                              })
                            ]
                          }),
                          _jsxs('div', {
                            className: 'space-y-3',
                            children: [
                              _jsxs('h4', {
                                className: 'font-semibold text-sm flex items-center gap-2',
                                children: [
                                  _jsx(CheckCircle, { className: 'w-4 h-4' }),
                                  'Key Features'
                                ]
                              }),
                              _jsx('ul', {
                                className: 'space-y-2',
                                children: agent.features.slice(0, 3).map((feature, idx) =>
                                  _jsxs(
                                    'li',
                                    {
                                      className:
                                        'text-sm text-muted-foreground flex items-start gap-2',
                                      children: [
                                        _jsx('div', {
                                          className:
                                            'w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0'
                                        }),
                                        feature
                                      ]
                                    },
                                    idx
                                  )
                                )
                              })
                            ]
                          })
                        ]
                      }),
                    activeTab === 'demo' && _jsx(AgentDemo, { agent: agent }),
                    activeTab === 'metrics' &&
                      _jsx(MetricsVisualization, { metrics: agent.metrics }),
                    activeTab === 'testimonials' &&
                      _jsx(TestimonialsCarousel, { testimonials: agent.testimonials })
                  ]
                },
                activeTab
              )
            }),
            _jsx('div', {
              className: 'flex gap-2 pt-4 border-t',
              children:
                agent.id === 'cdd-agent'
                  ? _jsxs(_Fragment, {
                      children: [
                        _jsxs(Button, {
                          variant: 'outline',
                          size: 'sm',
                          className: 'flex-1',
                          onClick: () => navigate('/agents/cdd-agent'),
                          children: [
                            _jsx(ExternalLink, { className: 'w-4 h-4 mr-2' }),
                            'Learn More'
                          ]
                        }),
                        _jsxs(Button, {
                          size: 'sm',
                          className: 'flex-1',
                          children: ['Get Access', _jsx(ArrowRight, { className: 'w-4 h-4 ml-2' })]
                        })
                      ]
                    })
                  : _jsxs(_Fragment, {
                      children: [
                        _jsxs(Button, {
                          variant: 'outline',
                          size: 'sm',
                          className: 'flex-1',
                          children: [_jsx(Eye, { className: 'w-4 h-4 mr-2' }), 'Preview']
                        }),
                        _jsxs(Button, {
                          size: 'sm',
                          className: 'flex-1',
                          children: ['Get Access', _jsx(ArrowRight, { className: 'w-4 h-4 ml-2' })]
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
export { EnhancedAgentCard, AgentDemo, MetricsVisualization, TestimonialsCarousel };
