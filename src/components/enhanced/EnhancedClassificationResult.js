import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
/**
 * Enhanced SFDR Classification Result Display Component
 * Shows all the new backend features including audit trails, benchmarks, and citations
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  Eye
} from 'lucide-react';
export const EnhancedClassificationResult = ({
  result,
  showAdvancedFeatures = true,
  onExportAuditTrail
}) => {
  const [expandedSections, setExpandedSections] = React.useState({
    reasoning: true,
    indicators: true,
    regulatory: true,
    benchmark: false,
    audit: false,
    risk: false
  });
  const toggleSection = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const getClassificationColor = classification => {
    switch (classification.toLowerCase()) {
      case 'article 9':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'article 8':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'article 6':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getConfidenceColor = confidence => {
    if (confidence >= 0.8) {
      return 'text-green-600';
    }
    if (confidence >= 0.6) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };
  const formatProcessingTime = time => {
    if (!time) {
      return 'N/A';
    }
    return time < 1 ? `${(time * 1000).toFixed(0)}ms` : `${time.toFixed(2)}s`;
  };
  return _jsxs('div', {
    className: 'space-y-6',
    children: [
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, {
            children: _jsxs('div', {
              className: 'flex items-center justify-between',
              children: [
                _jsxs(CardTitle, {
                  className: 'flex items-center gap-3',
                  children: [
                    _jsx(Shield, { className: 'h-6 w-6 text-blue-600' }),
                    'SFDR Classification Result'
                  ]
                }),
                result.audit_trail &&
                  onExportAuditTrail &&
                  _jsxs(Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: onExportAuditTrail,
                    className: 'flex items-center gap-2',
                    children: [_jsx(FileText, { className: 'h-4 w-4' }), 'Export Audit Trail']
                  })
              ]
            })
          }),
          _jsxs(CardContent, {
            className: 'space-y-4',
            children: [
              _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  _jsxs('div', {
                    className: 'flex items-center gap-4',
                    children: [
                      _jsx(Badge, {
                        className: `px-4 py-2 text-lg font-semibold ${getClassificationColor(result.classification)}`,
                        children: result.classification
                      }),
                      _jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          _jsx('span', {
                            className: 'text-sm text-gray-600',
                            children: 'Confidence:'
                          }),
                          _jsxs('span', {
                            className: `font-semibold ${getConfidenceColor(result.confidence)}`,
                            children: [(result.confidence * 100).toFixed(1), '%']
                          })
                        ]
                      })
                    ]
                  }),
                  result.processing_time &&
                    _jsxs('div', {
                      className: 'flex items-center gap-2 text-sm text-gray-600',
                      children: [
                        _jsx(Clock, { className: 'h-4 w-4' }),
                        formatProcessingTime(result.processing_time)
                      ]
                    })
                ]
              }),
              _jsxs('div', {
                className: 'space-y-2',
                children: [
                  _jsxs('div', {
                    className: 'flex justify-between text-sm',
                    children: [
                      _jsx('span', { children: 'Classification Confidence' }),
                      _jsxs('span', { children: [(result.confidence * 100).toFixed(1), '%'] })
                    ]
                  }),
                  _jsx(Progress, { value: result.confidence * 100, className: 'h-2' })
                ]
              }),
              result.sustainability_score !== undefined &&
                _jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    _jsxs('div', {
                      className: 'flex justify-between text-sm',
                      children: [
                        _jsx('span', { children: 'Sustainability Score' }),
                        _jsxs('span', {
                          children: [(result.sustainability_score * 100).toFixed(1), '%']
                        })
                      ]
                    }),
                    _jsx(Progress, { value: result.sustainability_score * 100, className: 'h-2' })
                  ]
                }),
              result.explainability_score !== undefined &&
                _jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    _jsxs('div', {
                      className: 'flex justify-between text-sm',
                      children: [
                        _jsxs('span', {
                          className: 'flex items-center gap-2',
                          children: [_jsx(Eye, { className: 'h-4 w-4' }), 'Explainability Score']
                        }),
                        _jsxs('span', {
                          children: [(result.explainability_score * 100).toFixed(1), '%']
                        })
                      ]
                    }),
                    _jsx(Progress, { value: result.explainability_score * 100, className: 'h-2' })
                  ]
                })
            ]
          })
        ]
      }),
      _jsx(Collapsible, {
        open: expandedSections.reasoning,
        onOpenChange: () => toggleSection('reasoning'),
        children: _jsxs(Card, {
          children: [
            _jsx(CollapsibleTrigger, {
              asChild: true,
              children: _jsx(CardHeader, {
                className: 'cursor-pointer hover:bg-gray-50',
                children: _jsxs(CardTitle, {
                  className: 'flex items-center justify-between',
                  children: [
                    _jsxs('span', {
                      className: 'flex items-center gap-2',
                      children: [_jsx(Info, { className: 'h-5 w-5' }), 'Classification Reasoning']
                    }),
                    _jsx(ChevronDown, {
                      className: `h-5 w-5 transition-transform ${expandedSections.reasoning ? 'rotate-180' : ''}`
                    })
                  ]
                })
              })
            }),
            _jsx(CollapsibleContent, {
              children: _jsx(CardContent, {
                children: _jsx('p', {
                  className: 'text-gray-700 leading-relaxed',
                  children: result.reasoning
                })
              })
            })
          ]
        })
      }),
      showAdvancedFeatures &&
        _jsxs(_Fragment, {
          children: [
            result.key_indicators &&
              result.key_indicators.length > 0 &&
              _jsx(Collapsible, {
                open: expandedSections.indicators,
                onOpenChange: () => toggleSection('indicators'),
                children: _jsxs(Card, {
                  children: [
                    _jsx(CollapsibleTrigger, {
                      asChild: true,
                      children: _jsx(CardHeader, {
                        className: 'cursor-pointer hover:bg-gray-50',
                        children: _jsxs(CardTitle, {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsxs('span', {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx(CheckCircle, { className: 'h-5 w-5' }),
                                'Key Indicators Found'
                              ]
                            }),
                            _jsx(ChevronDown, {
                              className: `h-5 w-5 transition-transform ${expandedSections.indicators ? 'rotate-180' : ''}`
                            })
                          ]
                        })
                      })
                    }),
                    _jsx(CollapsibleContent, {
                      children: _jsx(CardContent, {
                        children: _jsx('div', {
                          className: 'flex flex-wrap gap-2',
                          children: result.key_indicators.map((indicator, index) =>
                            _jsx(
                              Badge,
                              { variant: 'secondary', className: 'px-3 py-1', children: indicator },
                              index
                            )
                          )
                        })
                      })
                    })
                  ]
                })
              }),
            result.regulatory_basis &&
              result.regulatory_basis.length > 0 &&
              _jsx(Collapsible, {
                open: expandedSections.regulatory,
                onOpenChange: () => toggleSection('regulatory'),
                children: _jsxs(Card, {
                  children: [
                    _jsx(CollapsibleTrigger, {
                      asChild: true,
                      children: _jsx(CardHeader, {
                        className: 'cursor-pointer hover:bg-gray-50',
                        children: _jsxs(CardTitle, {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsxs('span', {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx(FileText, { className: 'h-5 w-5' }),
                                'Regulatory Basis & Citations'
                              ]
                            }),
                            _jsx(ChevronDown, {
                              className: `h-5 w-5 transition-transform ${expandedSections.regulatory ? 'rotate-180' : ''}`
                            })
                          ]
                        })
                      })
                    }),
                    _jsx(CollapsibleContent, {
                      children: _jsx(CardContent, {
                        children: _jsx('ul', {
                          className: 'space-y-2',
                          children: result.regulatory_basis.map((basis, index) =>
                            _jsxs(
                              'li',
                              {
                                className: 'flex items-start gap-3',
                                children: [
                                  _jsx('div', {
                                    className: 'w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'
                                  }),
                                  _jsx('span', { className: 'text-gray-700', children: basis })
                                ]
                              },
                              index
                            )
                          )
                        })
                      })
                    })
                  ]
                })
              }),
            result.benchmark_comparison &&
              _jsx(Collapsible, {
                open: expandedSections.benchmark,
                onOpenChange: () => toggleSection('benchmark'),
                children: _jsxs(Card, {
                  children: [
                    _jsx(CollapsibleTrigger, {
                      asChild: true,
                      children: _jsx(CardHeader, {
                        className: 'cursor-pointer hover:bg-gray-50',
                        children: _jsxs(CardTitle, {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsxs('span', {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx(TrendingUp, { className: 'h-5 w-5' }),
                                'Benchmark Comparison'
                              ]
                            }),
                            _jsx(ChevronDown, {
                              className: `h-5 w-5 transition-transform ${expandedSections.benchmark ? 'rotate-180' : ''}`
                            })
                          ]
                        })
                      })
                    }),
                    _jsx(CollapsibleContent, {
                      children: _jsx(CardContent, {
                        className: 'space-y-4',
                        children: _jsxs('div', {
                          className: 'grid grid-cols-2 md:grid-cols-4 gap-4',
                          children: [
                            _jsxs('div', {
                              className: 'text-center p-3 bg-gray-50 rounded-lg',
                              children: [
                                _jsx('div', {
                                  className: 'text-sm text-gray-600',
                                  children: 'Industry Baseline'
                                }),
                                _jsxs('div', {
                                  className: 'text-lg font-semibold',
                                  children: [
                                    (result.benchmark_comparison.industry_baseline * 100).toFixed(
                                      1
                                    ),
                                    '%'
                                  ]
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'text-center p-3 bg-blue-50 rounded-lg',
                              children: [
                                _jsx('div', {
                                  className: 'text-sm text-gray-600',
                                  children: 'Current Score'
                                }),
                                _jsxs('div', {
                                  className: 'text-lg font-semibold text-blue-600',
                                  children: [
                                    (result.benchmark_comparison.current_confidence * 100).toFixed(
                                      1
                                    ),
                                    '%'
                                  ]
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'text-center p-3 bg-green-50 rounded-lg',
                              children: [
                                _jsx('div', {
                                  className: 'text-sm text-gray-600',
                                  children: 'vs Baseline'
                                }),
                                _jsxs('div', {
                                  className: `text-lg font-semibold ${result.benchmark_comparison.performance_vs_baseline >= 0 ? 'text-green-600' : 'text-red-600'}`,
                                  children: [
                                    result.benchmark_comparison.performance_vs_baseline >= 0
                                      ? '+'
                                      : '',
                                    (
                                      result.benchmark_comparison.performance_vs_baseline * 100
                                    ).toFixed(1),
                                    '%'
                                  ]
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'text-center p-3 bg-purple-50 rounded-lg',
                              children: [
                                _jsx('div', {
                                  className: 'text-sm text-gray-600',
                                  children: 'Percentile Rank'
                                }),
                                _jsxs('div', {
                                  className: 'text-lg font-semibold text-purple-600',
                                  children: [
                                    result.benchmark_comparison.percentile_rank.toFixed(0),
                                    'th'
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      })
                    })
                  ]
                })
              }),
            result.risk_factors &&
              result.risk_factors.length > 0 &&
              _jsx(Collapsible, {
                open: expandedSections.risk,
                onOpenChange: () => toggleSection('risk'),
                children: _jsxs(Card, {
                  children: [
                    _jsx(CollapsibleTrigger, {
                      asChild: true,
                      children: _jsx(CardHeader, {
                        className: 'cursor-pointer hover:bg-gray-50',
                        children: _jsxs(CardTitle, {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsxs('span', {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx(AlertTriangle, { className: 'h-5 w-5' }),
                                'Risk Assessment'
                              ]
                            }),
                            _jsx(ChevronDown, {
                              className: `h-5 w-5 transition-transform ${expandedSections.risk ? 'rotate-180' : ''}`
                            })
                          ]
                        })
                      })
                    }),
                    _jsx(CollapsibleContent, {
                      children: _jsx(CardContent, {
                        children: _jsx('ul', {
                          className: 'space-y-2',
                          children: result.risk_factors.map((risk, index) =>
                            _jsxs(
                              'li',
                              {
                                className: 'flex items-start gap-3',
                                children: [
                                  _jsx(AlertTriangle, {
                                    className: 'h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0'
                                  }),
                                  _jsx('span', { className: 'text-gray-700', children: risk })
                                ]
                              },
                              index
                            )
                          )
                        })
                      })
                    })
                  ]
                })
              }),
            result.audit_trail &&
              _jsx(Collapsible, {
                open: expandedSections.audit,
                onOpenChange: () => toggleSection('audit'),
                children: _jsxs(Card, {
                  children: [
                    _jsx(CollapsibleTrigger, {
                      asChild: true,
                      children: _jsx(CardHeader, {
                        className: 'cursor-pointer hover:bg-gray-50',
                        children: _jsxs(CardTitle, {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsxs('span', {
                              className: 'flex items-center gap-2',
                              children: [_jsx(FileText, { className: 'h-5 w-5' }), 'Audit Trail']
                            }),
                            _jsx(ChevronDown, {
                              className: `h-5 w-5 transition-transform ${expandedSections.audit ? 'rotate-180' : ''}`
                            })
                          ]
                        })
                      })
                    }),
                    _jsx(CollapsibleContent, {
                      children: _jsxs(CardContent, {
                        className: 'space-y-3',
                        children: [
                          _jsxs('div', {
                            className: 'grid grid-cols-1 md:grid-cols-2 gap-4 text-sm',
                            children: [
                              _jsxs('div', {
                                children: [
                                  _jsx('span', {
                                    className: 'font-medium',
                                    children: 'Classification ID:'
                                  }),
                                  _jsx('br', {}),
                                  _jsx('code', {
                                    className: 'text-xs bg-gray-100 px-2 py-1 rounded',
                                    children: result.audit_trail.classification_id
                                  })
                                ]
                              }),
                              _jsxs('div', {
                                children: [
                                  _jsx('span', {
                                    className: 'font-medium',
                                    children: 'Engine Version:'
                                  }),
                                  _jsx('br', {}),
                                  _jsx('span', {
                                    className: 'text-gray-600',
                                    children: result.audit_trail.engine_version
                                  })
                                ]
                              }),
                              _jsxs('div', {
                                children: [
                                  _jsx('span', {
                                    className: 'font-medium',
                                    children: 'Processing Method:'
                                  }),
                                  _jsx('br', {}),
                                  _jsx('span', {
                                    className: 'text-gray-600',
                                    children: result.audit_trail.method
                                  })
                                ]
                              }),
                              _jsxs('div', {
                                children: [
                                  _jsx('span', {
                                    className: 'font-medium',
                                    children: 'Timestamp:'
                                  }),
                                  _jsx('br', {}),
                                  _jsx('span', {
                                    className: 'text-gray-600',
                                    children: new Date(
                                      result.audit_trail.timestamp
                                    ).toLocaleString()
                                  })
                                ]
                              })
                            ]
                          }),
                          result.audit_trail.article_scores &&
                            _jsxs(_Fragment, {
                              children: [
                                _jsx(Separator, {}),
                                _jsxs('div', {
                                  children: [
                                    _jsx('h4', {
                                      className: 'font-medium mb-2',
                                      children: 'Article Scoring Breakdown:'
                                    }),
                                    _jsx('div', {
                                      className: 'space-y-2',
                                      children: Object.entries(
                                        result.audit_trail.article_scores
                                      ).map(([article, score]) =>
                                        _jsxs(
                                          'div',
                                          {
                                            className: 'flex items-center justify-between',
                                            children: [
                                              _jsx('span', {
                                                className: 'capitalize',
                                                children: article.replace('_', ' ')
                                              }),
                                              _jsxs('div', {
                                                className: 'flex items-center gap-2 w-32',
                                                children: [
                                                  _jsx(Progress, {
                                                    value: score * 100,
                                                    className: 'h-2'
                                                  }),
                                                  _jsxs('span', {
                                                    className:
                                                      'text-sm text-gray-600 w-12 text-right',
                                                    children: [(score * 100).toFixed(0), '%']
                                                  })
                                                ]
                                              })
                                            ]
                                          },
                                          article
                                        )
                                      )
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
              })
          ]
        }),
      result.recommendations &&
        result.recommendations.length > 0 &&
        _jsxs(Card, {
          children: [
            _jsx(CardHeader, {
              children: _jsxs(CardTitle, {
                className: 'flex items-center gap-2',
                children: [_jsx(CheckCircle, { className: 'h-5 w-5' }), 'Recommendations']
              })
            }),
            _jsx(CardContent, {
              children: _jsx('ul', {
                className: 'space-y-2',
                children: result.recommendations.map((recommendation, index) =>
                  _jsxs(
                    'li',
                    {
                      className: 'flex items-start gap-3',
                      children: [
                        _jsx('div', {
                          className: 'w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'
                        }),
                        _jsx('span', { className: 'text-gray-700', children: recommendation })
                      ]
                    },
                    index
                  )
                )
              })
            })
          ]
        })
    ]
  });
};
