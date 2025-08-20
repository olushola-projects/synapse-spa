import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  Briefcase,
  Users,
  MessageSquareText,
  AlertTriangle,
  BarChart3,
  LineChart,
  FileSearch
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ExternalFormDialog from './ExternalFormDialog';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import useEmblaCarousel from 'embla-carousel-react';
// Agent data for the carousel
const agentData = [
  {
    name: 'Dara',
    role: 'KYC Analyst',
    icon: _jsx(Briefcase, { className: 'text-[#7A73FF]', size: 24 }),
    integratedTools: ['iDenfy', 'Onfido', 'SEON'],
    valueAdd: [
      'Automates document verification and metadata analysis.',
      'Flags risk patterns and compiles enhanced due diligence reports.',
      'Functions as a Tier-2 AML analyst within your case management tool.'
    ],
    outcomes: [
      'Accelerated onboarding processes.',
      'Reduction in false positives.',
      'Enhanced compliance accuracy.'
    ],
    metrics: [
      {
        text: '78% of organizations use AI in at least one business function.',
        source: 'McKinsey & Company'
      },
      {
        text: '68% of financial services firms prioritize AI in risk and compliance functions.',
        source: 'Confluence'
      }
    ]
  },
  {
    name: 'Exception Analyst',
    role: 'Post-Trade Exception Management',
    icon: _jsx(AlertTriangle, { className: 'text-amber-500', size: 24 }),
    integratedTools: ['DTCC Exception Manager', 'UnaVista', 'SteelEye'],
    valueAdd: [
      'Filters false positives, flags exceptions',
      'Synthesizes regulatory rules',
      'Automates routine exception handling'
    ],
    outcomes: [
      'Faster exception triage',
      'Improved audit preparedness',
      'Reduced operational risk'
    ],
    metrics: [
      {
        text: '60% of firms report reducing exception handling time with AI',
        source: 'Deloitte'
      },
      {
        text: '42% reduction in false positive exceptions',
        source: 'DTCC Research'
      }
    ]
  },
  {
    name: 'Promotions Compliance Reviewer',
    role: 'Marketing & Financial Promotions',
    icon: _jsx(FileSearch, { className: 'text-emerald-500', size: 24 }),
    integratedTools: ['Red Oak', 'Proofpoint', 'Global Relay'],
    valueAdd: [
      'Reviews content for compliance',
      'Highlights jurisdictional risks',
      'Suggests compliant alternatives'
    ],
    outcomes: [
      'Reduced regulatory risk',
      'Improved cross-border alignment',
      'Faster promotion approvals'
    ],
    metrics: [
      {
        text: '53% faster approval times for financial promotions with AI',
        source: 'Financial Promotions Council'
      },
      {
        text: '71% reduction in compliance review cycles',
        source: 'Marketing Compliance Institute'
      }
    ]
  },
  {
    name: 'ESG Compliance Analyst',
    role: 'ESG Regulatory & Disclosure',
    icon: _jsx(LineChart, { className: 'text-green-500', size: 24 }),
    integratedTools: ['Workiva', 'Novisto', 'Persefoni'],
    valueAdd: [
      'Interprets ESG regulations',
      'Flags disclosure gaps',
      'Monitors reporting requirements'
    ],
    outcomes: ['Clearer ESG disclosures', 'Aligned policies', 'Improved sustainability metrics'],
    metrics: [
      {
        text: '92% of executives say ESG compliance is a top priority',
        source: 'KPMG'
      },
      {
        text: '64% struggle with ESG data aggregation',
        source: 'EY Global Survey'
      }
    ]
  },
  {
    name: 'CMS Investigator',
    role: 'Complaint Management Systems',
    icon: _jsx(MessageSquareText, { className: 'text-blue-500', size: 24 }),
    integratedTools: ['Zendesk', 'Zoho Desk', 'Freshdesk'],
    valueAdd: [
      'Contextualizes complaints',
      'Suggests case categorization',
      'Identifies emerging patterns'
    ],
    outcomes: [
      'More accurate resolution outcomes',
      'Enhanced regulatory reporting',
      'Proactive risk identification'
    ],
    metrics: [
      {
        text: '82% improvement in complaint categorization accuracy',
        source: 'Financial Conduct Authority'
      },
      {
        text: '47% reduction in complaint resolution time',
        source: 'Consumer Financial Protection Bureau'
      }
    ]
  },
  {
    name: 'Screening Validator',
    role: 'PEP, Sanctions & Adverse Media',
    icon: _jsx(Shield, { className: 'text-purple-500', size: 24 }),
    integratedTools: ['LexisNexis', 'ComplyAdvantage', 'Dow Jones'],
    valueAdd: ['Reviews cases', 'Drafts risk reports', 'Analyzes adverse media'],
    outcomes: ['Smarter decisions', 'Stronger SAR narratives', 'Enhanced risk detection'],
    metrics: [
      {
        text: '73% reduction in false positive screening alerts',
        source: 'ACAMS'
      },
      {
        text: '58% faster PEP & sanctions reviews',
        source: 'Wolfsberg Group'
      }
    ]
  },
  {
    name: 'Board Advisor',
    role: 'Board Reporting & Governance',
    icon: _jsx(Users, { className: 'text-indigo-600', size: 24 }),
    integratedTools: ['Diligent Boards', 'Nasdaq Boardvantage', 'BoardEffect'],
    valueAdd: ['Drafts reports', 'Translates technical findings', 'Highlights governance trends'],
    outcomes: [
      'Faster report creation',
      'Improved decision-making',
      'Enhanced governance insights'
    ],
    metrics: [
      {
        text: '67% of boards cite improved decision quality with AI-enhanced reporting',
        source: 'Corporate Board Member'
      },
      {
        text: '40% reduction in board preparation time',
        source: 'Spencer Stuart'
      }
    ]
  },
  {
    name: 'TPRM Analyst',
    role: 'Third-Party Risk Management',
    icon: _jsx(BarChart3, { className: 'text-rose-500', size: 24 }),
    integratedTools: ['OneTrust', 'Prevalent', 'Archer'],
    valueAdd: ['Reviews vendor data', 'Flags documentation gaps', 'Monitors third-party risk'],
    outcomes: ['Stronger oversight', 'Better control visibility', 'Streamlined vendor assessments'],
    metrics: [
      {
        text: '76% of organizations plan to increase TPRM automation',
        source: 'Deloitte'
      },
      {
        text: '54% reduction in vendor risk assessment time',
        source: 'Shared Assessments'
      }
    ]
  }
];
const EnterpriseSection = () => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Join Synapse');
  const openFormDialog = (title = 'Join Synapse') => {
    setDialogTitle(title);
    setShowFormDialog(true);
  };
  // Animation variants with proper TypeScript types
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  const [emblaRef] = useEmblaCarousel({
    loop: true
  });
  return _jsxs('section', {
    className: 'py-16 md:py-0 bg-white',
    children: [
      _jsxs('div', {
        className: 'container mx-auto max-w-[1200px] px-4 md:px-6',
        children: [
          _jsx(motion.p, {
            initial: {
              opacity: 0,
              y: 10
            },
            whileInView: {
              opacity: 1,
              y: 0
            },
            transition: {
              duration: 0.3
            },
            viewport: {
              once: true
            },
            className: 'font-medium mb-4 text-lg text-blue-700',
            children: 'Enterprise Risk Reinvention'
          }),
          _jsxs('div', {
            className: 'grid md:grid-cols-2 gap-12 items-start',
            children: [
              _jsxs(motion.div, {
                variants: containerVariants,
                initial: 'hidden',
                whileInView: 'visible',
                viewport: {
                  once: true
                },
                className: 'space-y-7',
                children: [
                  _jsx(motion.h2, {
                    variants: itemVariants,
                    className:
                      'text-3xl md:text-[2.75rem] tracking-tight leading-[1.15] text-gray-900 -tracking-[0.5px] font-normal',
                    children: 'Empower Your Enterprise GRC with Intelligent AI Agents'
                  }),
                  _jsxs(motion.div, {
                    variants: itemVariants,
                    children: [
                      _jsx('p', {
                        className: 'text-[#4B4B4B] leading-relaxed font-normal text-base',
                        children:
                          'Seamlessly integrate AI agents to streamline compliance, enhance decisions, and reduce manual work across your existing GRC ecosystem.'
                      }),
                      _jsxs('p', {
                        className: 'mt-4 text-[#4B4B4B] leading-relaxed font-normal text-base',
                        children: [
                          _jsx('a', {
                            href: '#',
                            onClick: e => {
                              e.preventDefault();
                              openFormDialog('Learn about Professional Services');
                            },
                            className:
                              'text-[#7A73FF] hover:text-[#6366F1] underline-offset-4 hover:underline',
                            children: 'Professional services'
                          }),
                          ' ',
                          'and',
                          ' ',
                          _jsx('a', {
                            href: '#',
                            onClick: e => {
                              e.preventDefault();
                              openFormDialog('Learn about Certified Partners');
                            },
                            className:
                              'text-[#7A73FF] hover:text-[#6366F1] underline-offset-4 hover:underline',
                            children: 'certified partners'
                          }),
                          ' ',
                          'available for seamless implementation.'
                        ]
                      })
                    ]
                  }),
                  _jsx(motion.div, {
                    variants: itemVariants,
                    className: 'pt-2',
                    children: _jsxs(Button, {
                      size: 'lg',
                      onClick: () => openFormDialog('Explore Synapses for enterprises'),
                      className:
                        'text-white py-6 text-base font-medium rounded-full bg-blue-700 hover:bg-blue-600 px-[30px]',
                      children: [
                        'Explore Synapses for enterprises ',
                        _jsx(ArrowRight, { size: 18, className: 'ml-2' })
                      ]
                    })
                  }),
                  _jsx(motion.div, {
                    variants: itemVariants,
                    className: 'pt-6 mt-8 border-t border-gray-200',
                    children: _jsxs('div', {
                      className: 'grid grid-cols-3 gap-6',
                      children: [
                        _jsxs('div', {
                          children: [
                            _jsx('h4', {
                              className: 'text-gray-900 mb-1 text-base font-semibold',
                              children: 'Status'
                            }),
                            _jsx('p', {
                              className: 'text-xs text-slate-900 font-normal',
                              children: 'Early Access Program Open'
                            })
                          ]
                        }),
                        _jsxs('div', {
                          children: [
                            _jsx('h4', {
                              className: 'text-gray-900 mb-1 text-base font-semibold',
                              children: 'Regions'
                            }),
                            _jsxs('div', {
                              className: 'flex flex-col gap-1',
                              children: [
                                _jsx('p', {
                                  className: 'text-xs font-normal text-slate-900',
                                  children: 'Global Regulatory Coverage'
                                }),
                                _jsx('p', {
                                  className: 'font-normal text-xs text-slate-900',
                                  children: 'Continuously Expanding Jurisdictions'
                                })
                              ]
                            })
                          ]
                        }),
                        _jsxs('div', {
                          children: [
                            _jsx('h4', {
                              className: 'text-gray-900 mb-1 text-base font-semibold',
                              children: 'Powered by Innovation'
                            }),
                            _jsxs('div', {
                              className: 'flex items-center gap-4 mt-2',
                              children: [
                                _jsx('div', {
                                  className: 'flex items-center gap-1 text-gray-600',
                                  children: _jsx('span', {
                                    className: 'text-xs font-normal text-slate-900',
                                    children: 'AML Agent'
                                  })
                                }),
                                _jsx('div', {
                                  className: 'flex items-center gap-1 text-gray-600',
                                  children: _jsx('span', {
                                    className: 'text-xs font-normal',
                                    children: 'ESG Agent'
                                  })
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  })
                ]
              }),
              _jsx(motion.div, {
                initial: {
                  opacity: 0,
                  scale: 0.97
                },
                whileInView: {
                  opacity: 1,
                  scale: 1
                },
                transition: {
                  duration: 0.7,
                  delay: 0.2
                },
                viewport: {
                  once: true
                },
                className: 'mt-4 md:mt-0',
                children: _jsx(Carousel, {
                  opts: {
                    align: 'start',
                    loop: true
                  },
                  className: 'w-full',
                  ref: emblaRef,
                  children: _jsx(CarouselContent, {
                    children: agentData.map((agent, index) =>
                      _jsx(
                        CarouselItem,
                        {
                          className: 'md:basis-[100%] lg:basis-[100%]',
                          children: _jsx('div', {
                            className: 'p-1 h-full',
                            onClick: () =>
                              openFormDialog(`Learn about ${agent.name} - ${agent.role}`),
                            children: _jsxs(Card, {
                              className:
                                'relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full cursor-pointer group border border-gray-200',
                              children: [
                                _jsx('div', {
                                  className:
                                    'bg-gradient-to-r from-[rgba(60,90,180,0.03)] to-[rgba(60,90,180,0.1)] absolute inset-0 opacity-50'
                                }),
                                _jsxs(CardContent, {
                                  className:
                                    'p-6 relative z-10 h-full flex flex-col bg-slate-200 px-px py-[4px]',
                                  children: [
                                    _jsxs('div', {
                                      className: 'flex items-center gap-3 mb-3',
                                      children: [
                                        _jsx('div', {
                                          className: 'bg-white p-2 rounded-full shadow-sm',
                                          children: agent.icon
                                        }),
                                        _jsxs('div', {
                                          children: [
                                            _jsx('h3', {
                                              className: 'text-xl font-bold text-gray-900',
                                              children: agent.name
                                            }),
                                            _jsx('p', {
                                              className: 'text-sm text-gray-600',
                                              children: agent.role
                                            })
                                          ]
                                        })
                                      ]
                                    }),
                                    _jsxs('div', {
                                      className: 'mb-4',
                                      children: [
                                        _jsx('p', {
                                          className:
                                            'text-xs uppercase font-semibold text-gray-500 mb-2',
                                          children: 'Integrated Tools'
                                        }),
                                        _jsx('div', {
                                          className: 'flex flex-wrap gap-2',
                                          children: agent.integratedTools.map((tool, i) =>
                                            _jsx(
                                              Badge,
                                              {
                                                variant: 'outline',
                                                className: 'bg-blue-50 text-blue-700',
                                                children: tool
                                              },
                                              i
                                            )
                                          )
                                        })
                                      ]
                                    }),
                                    _jsxs('div', {
                                      className: 'mb-4',
                                      children: [
                                        _jsx('p', {
                                          className:
                                            'text-xs uppercase font-semibold text-gray-500 mb-2',
                                          children: 'Value Add'
                                        }),
                                        _jsx('ul', {
                                          className: 'space-y-2',
                                          children: agent.valueAdd.map((value, i) =>
                                            _jsxs(
                                              'li',
                                              {
                                                className: 'flex items-start gap-2 text-sm',
                                                children: [
                                                  _jsx(CheckCircle2, {
                                                    className:
                                                      'h-4 w-4 text-green-500 mt-0.5 flex-shrink-0'
                                                  }),
                                                  _jsx('span', { children: value })
                                                ]
                                              },
                                              i
                                            )
                                          )
                                        })
                                      ]
                                    }),
                                    _jsxs('div', {
                                      className:
                                        'mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100',
                                      children: [
                                        _jsx('p', {
                                          className:
                                            'text-xs uppercase font-semibold text-gray-500 mb-2',
                                          children: 'Outcomes'
                                        }),
                                        _jsx('ul', {
                                          className: 'space-y-1',
                                          children: agent.outcomes.map((outcome, i) =>
                                            _jsxs(
                                              'li',
                                              {
                                                className: 'text-sm text-gray-700',
                                                children: ['\u2022 ', outcome]
                                              },
                                              i
                                            )
                                          )
                                        })
                                      ]
                                    }),
                                    _jsxs('div', {
                                      className: 'mt-auto pt-3',
                                      children: [
                                        _jsx('p', {
                                          className:
                                            'text-xs uppercase font-semibold text-gray-500 mb-2',
                                          children: 'Supporting Metrics'
                                        }),
                                        agent.metrics.map((metric, i) =>
                                          _jsxs(
                                            'div',
                                            {
                                              className: 'mb-2 last:mb-0',
                                              children: [
                                                _jsx('p', {
                                                  className:
                                                    'text-sm text-gray-700 font-medium mb-1',
                                                  children: metric.text
                                                }),
                                                _jsxs('p', {
                                                  className: 'text-xs text-gray-500',
                                                  children: ['Source: ', metric.source]
                                                })
                                              ]
                                            },
                                            i
                                          )
                                        )
                                      ]
                                    }),
                                    _jsx('div', {
                                      className:
                                        'absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity',
                                      children: _jsxs(Button, {
                                        variant: 'ghost',
                                        size: 'sm',
                                        className: 'text-[#7A73FF] hover:bg-[#7A73FF]/10 p-0',
                                        children: [
                                          'Learn more ',
                                          _jsx(ArrowRight, { size: 16, className: 'ml-1' })
                                        ]
                                      })
                                    })
                                  ]
                                })
                              ]
                            })
                          })
                        },
                        index
                      )
                    )
                  })
                })
              })
            ]
          })
        ]
      }),
      _jsx(ExternalFormDialog, {
        open: showFormDialog,
        onOpenChange: setShowFormDialog,
        title: dialogTitle
      })
    ]
  });
};
export default EnterpriseSection;
