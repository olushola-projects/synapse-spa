import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  CheckCircle2,
  Building,
  CreditCard,
  HeartPulse,
  ShieldCheck,
  Network,
  Server
} from 'lucide-react';
const Solutions = () => {
  return _jsxs('div', {
    className: 'min-h-screen flex flex-col',
    children: [
      _jsx(Navbar, {}),
      _jsxs('div', {
        className: 'flex-grow',
        children: [
          _jsx('section', {
            className:
              'bg-gradient-to-br from-synapse-primary to-synapse-secondary text-white py-20',
            children: _jsx('div', {
              className: 'container mx-auto px-4',
              children: _jsxs('div', {
                className: 'max-w-4xl mx-auto text-center',
                children: [
                  _jsx('h1', {
                    className: 'text-4xl md:text-5xl font-bold mb-6',
                    children: 'Industry Solutions'
                  }),
                  _jsx('p', {
                    className: 'text-xl md:text-2xl opacity-90 leading-relaxed',
                    children:
                      'Tailored compliance solutions to address the unique regulatory challenges in your industry.'
                  }),
                  _jsxs('div', {
                    className: 'mt-10 flex flex-col sm:flex-row justify-center gap-4',
                    children: [
                      _jsx(Button, {
                        size: 'lg',
                        className: 'bg-white text-synapse-primary hover:bg-white/90',
                        children: 'Explore Solutions'
                      }),
                      _jsx(Button, {
                        size: 'lg',
                        variant: 'outline',
                        className: 'border-white text-white hover:bg-white/10',
                        children: 'Contact Sales'
                      })
                    ]
                  })
                ]
              })
            })
          }),
          _jsx('section', {
            className: 'py-20',
            children: _jsxs('div', {
              className: 'container mx-auto px-4',
              children: [
                _jsxs('div', {
                  className: 'text-center mb-16',
                  children: [
                    _jsx(Badge, { className: 'mb-4', children: 'Industry Focus' }),
                    _jsx('h2', {
                      className: 'text-3xl font-bold mb-4',
                      children: 'Specialized for Your Industry'
                    }),
                    _jsx('p', {
                      className: 'text-lg text-gray-600 max-w-3xl mx-auto',
                      children:
                        'Our platform is customized to meet the specific compliance requirements across different regulated industries.'
                    })
                  ]
                }),
                _jsx('div', {
                  className: 'max-w-6xl mx-auto',
                  children: _jsxs(Tabs, {
                    defaultValue: 'financial',
                    className: 'w-full',
                    children: [
                      _jsxs(TabsList, {
                        className: 'grid grid-cols-2 md:grid-cols-6 mb-12',
                        children: [
                          _jsxs(TabsTrigger, {
                            value: 'financial',
                            className: 'flex items-center gap-2 py-2',
                            children: [_jsx(CreditCard, { className: 'h-4 w-4' }), ' Financial']
                          }),
                          _jsxs(TabsTrigger, {
                            value: 'healthcare',
                            className: 'flex items-center gap-2 py-2',
                            children: [_jsx(HeartPulse, { className: 'h-4 w-4' }), ' Healthcare']
                          }),
                          _jsxs(TabsTrigger, {
                            value: 'technology',
                            className: 'flex items-center gap-2 py-2',
                            children: [_jsx(Server, { className: 'h-4 w-4' }), ' Technology']
                          }),
                          _jsxs(TabsTrigger, {
                            value: 'energy',
                            className: 'flex items-center gap-2 py-2',
                            children: [_jsx(Network, { className: 'h-4 w-4' }), ' Energy']
                          }),
                          _jsxs(TabsTrigger, {
                            value: 'manufacturing',
                            className: 'flex items-center gap-2 py-2',
                            children: [_jsx(Building, { className: 'h-4 w-4' }), ' Manufacturing']
                          }),
                          _jsxs(TabsTrigger, {
                            value: 'government',
                            className: 'flex items-center gap-2 py-2',
                            children: [_jsx(ShieldCheck, { className: 'h-4 w-4' }), ' Government']
                          })
                        ]
                      }),
                      _jsx(TabsContent, {
                        value: 'financial',
                        className: 'pt-6',
                        children: _jsxs('div', {
                          className: 'grid md:grid-cols-2 gap-12 items-center',
                          children: [
                            _jsxs('div', {
                              children: [
                                _jsx('h3', {
                                  className: 'text-2xl font-bold mb-4',
                                  children: 'Financial Services Compliance'
                                }),
                                _jsx('p', {
                                  className: 'text-gray-600 mb-6',
                                  children:
                                    'Navigate the complex landscape of financial regulations with solutions tailored for banks, investment firms, insurance companies, and fintech startups.'
                                }),
                                _jsxs('div', {
                                  className: 'mb-8',
                                  children: [
                                    _jsx('h4', {
                                      className: 'font-semibold mb-3',
                                      children: 'Key Regulations Covered:'
                                    }),
                                    _jsx('div', {
                                      className: 'flex flex-wrap gap-2',
                                      children: [
                                        'GDPR',
                                        'AML',
                                        'KYC',
                                        'Basel III',
                                        'Dodd-Frank',
                                        'FATCA',
                                        'PSD2',
                                        'MiFID II'
                                      ].map((reg, i) =>
                                        _jsx(
                                          Badge,
                                          {
                                            variant: 'outline',
                                            className: 'bg-blue-50',
                                            children: reg
                                          },
                                          i
                                        )
                                      )
                                    })
                                  ]
                                }),
                                _jsx('ul', {
                                  className: 'space-y-3',
                                  children: [
                                    'Anti-money laundering (AML) compliance automation',
                                    'Know Your Customer (KYC) process streamlining',
                                    'Regulatory reporting for multiple jurisdictions',
                                    'Risk assessment and management frameworks',
                                    'Audit trail and evidence collection'
                                  ].map((item, i) =>
                                    _jsxs(
                                      'li',
                                      {
                                        className: 'flex items-start',
                                        children: [
                                          _jsx(CheckCircle2, {
                                            className:
                                              'h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0'
                                          }),
                                          _jsx('span', { children: item })
                                        ]
                                      },
                                      i
                                    )
                                  )
                                }),
                                _jsxs(Button, {
                                  className: 'mt-6 flex items-center gap-1',
                                  children: ['Learn More ', _jsx(ArrowRight, { size: 16 })]
                                })
                              ]
                            }),
                            _jsx('div', {
                              className:
                                'bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100',
                              children: _jsx('img', {
                                src: '/lovable-uploads/6ac8bd07-6906-427c-b832-be14819a3aed.png',
                                alt: 'Financial Services Compliance Dashboard',
                                className: 'w-full h-auto'
                              })
                            })
                          ]
                        })
                      }),
                      _jsx(TabsContent, {
                        value: 'healthcare',
                        className: 'pt-6',
                        children: _jsxs('div', {
                          className: 'grid md:grid-cols-2 gap-12 items-center',
                          children: [
                            _jsx('div', {
                              className:
                                'order-2 md:order-1 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100',
                              children: _jsxs('div', {
                                className:
                                  'flex flex-col items-center justify-center p-10 bg-gray-50 h-full',
                                children: [
                                  _jsx('p', {
                                    className: 'text-xl font-semibold text-center mb-4',
                                    children: 'Coming Soon to Healthcare Sector'
                                  }),
                                  _jsx('p', {
                                    className: 'text-gray-500 text-center',
                                    children:
                                      'Our specialized healthcare compliance solutions are currently in development.'
                                  })
                                ]
                              })
                            }),
                            _jsxs('div', {
                              className: 'order-1 md:order-2',
                              children: [
                                _jsx('h3', {
                                  className: 'text-2xl font-bold mb-4',
                                  children: 'Healthcare & Life Sciences Compliance'
                                }),
                                _jsx('p', {
                                  className: 'text-gray-600 mb-6',
                                  children:
                                    'Ensure patient data protection, adhere to clinical standards, and manage the complex web of healthcare regulations.'
                                }),
                                _jsxs('div', {
                                  className: 'mb-8',
                                  children: [
                                    _jsx('h4', {
                                      className: 'font-semibold mb-3',
                                      children: 'Key Regulations Covered:'
                                    }),
                                    _jsx('div', {
                                      className: 'flex flex-wrap gap-2',
                                      children: [
                                        'HIPAA',
                                        'HITECH',
                                        'FDA',
                                        'GxP',
                                        'CLIA',
                                        'PhRMA Code',
                                        'IEC'
                                      ].map((reg, i) =>
                                        _jsx(
                                          Badge,
                                          {
                                            variant: 'outline',
                                            className: 'bg-blue-50',
                                            children: reg
                                          },
                                          i
                                        )
                                      )
                                    })
                                  ]
                                }),
                                _jsx('p', {
                                  className: 'mt-6 font-medium text-blue-600',
                                  children: 'Coming soon to this sector'
                                }),
                                _jsxs(Button, {
                                  disabled: true,
                                  className: 'mt-6 flex items-center gap-1 opacity-70',
                                  children: ['Learn More ', _jsx(ArrowRight, { size: 16 })]
                                })
                              ]
                            })
                          ]
                        })
                      }),
                      _jsx(TabsContent, {
                        value: 'technology',
                        className: 'pt-6',
                        children: _jsxs('div', {
                          className: 'text-center py-10',
                          children: [
                            _jsx('p', {
                              className: 'text-2xl font-semibold mb-4',
                              children: 'Coming Soon to Technology Sector'
                            }),
                            _jsx('p', {
                              className: 'text-gray-600 max-w-lg mx-auto',
                              children:
                                'Our specialized technology compliance solutions are currently in development. Contact us for details about our upcoming solutions for tech companies.'
                            }),
                            _jsx(Button, {
                              variant: 'outline',
                              className: 'mt-8',
                              children: 'Get Notified When Available'
                            })
                          ]
                        })
                      }),
                      _jsx(TabsContent, {
                        value: 'energy',
                        className: 'pt-6',
                        children: _jsxs('div', {
                          className: 'text-center py-10',
                          children: [
                            _jsx('p', {
                              className: 'text-2xl font-semibold mb-4',
                              children: 'Coming Soon to Energy Sector'
                            }),
                            _jsx('p', {
                              className: 'text-gray-600 max-w-lg mx-auto',
                              children:
                                'Our specialized energy compliance solutions are currently in development. Contact us for details about our upcoming solutions for energy companies.'
                            }),
                            _jsx(Button, {
                              variant: 'outline',
                              className: 'mt-8',
                              children: 'Get Notified When Available'
                            })
                          ]
                        })
                      }),
                      _jsx(TabsContent, {
                        value: 'manufacturing',
                        className: 'pt-6',
                        children: _jsxs('div', {
                          className: 'text-center py-10',
                          children: [
                            _jsx('p', {
                              className: 'text-2xl font-semibold mb-4',
                              children: 'Coming Soon to Manufacturing Sector'
                            }),
                            _jsx('p', {
                              className: 'text-gray-600 max-w-lg mx-auto',
                              children:
                                'Our specialized manufacturing compliance solutions are currently in development. Contact us for details about our upcoming solutions for manufacturing companies.'
                            }),
                            _jsx(Button, {
                              variant: 'outline',
                              className: 'mt-8',
                              children: 'Get Notified When Available'
                            })
                          ]
                        })
                      }),
                      _jsx(TabsContent, {
                        value: 'government',
                        className: 'pt-6',
                        children: _jsxs('div', {
                          className: 'text-center py-10',
                          children: [
                            _jsx('p', {
                              className: 'text-2xl font-semibold mb-4',
                              children: 'Coming Soon to Government Sector'
                            }),
                            _jsx('p', {
                              className: 'text-gray-600 max-w-lg mx-auto',
                              children:
                                'Our specialized government compliance solutions are currently in development. Contact us for details about our upcoming solutions for government agencies.'
                            }),
                            _jsx(Button, {
                              variant: 'outline',
                              className: 'mt-8',
                              children: 'Get Notified When Available'
                            })
                          ]
                        })
                      })
                    ]
                  })
                })
              ]
            })
          }),
          _jsx('section', {
            className: 'py-20 bg-gray-50',
            children: _jsxs('div', {
              className: 'container mx-auto px-4',
              children: [
                _jsxs('div', {
                  className: 'text-center mb-16',
                  children: [
                    _jsx(Badge, { className: 'mb-4', children: 'Use Cases' }),
                    _jsx('h2', {
                      className: 'text-3xl font-bold mb-4',
                      children: 'Common Compliance Challenges Solved'
                    }),
                    _jsx('p', {
                      className: 'text-lg text-gray-600 max-w-3xl mx-auto',
                      children:
                        'See how Synapse helps organizations address their most pressing compliance needs.'
                    })
                  ]
                }),
                _jsx('div', {
                  className: 'max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6',
                  children: [
                    {
                      title: 'Regulatory Change Management',
                      description:
                        'Stay ahead of evolving regulations with automated alerts and impact analysis.',
                      link: '#'
                    },
                    {
                      title: 'Third-Party Risk Management',
                      description:
                        'Assess, monitor, and manage compliance risks in your vendor ecosystem.',
                      link: '#'
                    },
                    {
                      title: 'Policy Management',
                      description:
                        'Create, distribute, and track acknowledgment of policies and procedures.',
                      link: '#'
                    },
                    {
                      title: 'Compliance Training',
                      description:
                        'Deliver and track role-based compliance training across your organization.',
                      link: '#'
                    },
                    {
                      title: 'Audit Management',
                      description:
                        'Streamline internal and external audit processes with centralized evidence collection.',
                      link: '#'
                    },
                    {
                      title: 'Incident Management',
                      description:
                        'Report, investigate, and resolve compliance incidents efficiently.',
                      link: '#'
                    }
                  ].map((useCase, index) =>
                    _jsxs(
                      Card,
                      {
                        className: 'hover-lift',
                        children: [
                          _jsx(CardHeader, {
                            className: 'pb-2',
                            children: _jsx(CardTitle, { children: useCase.title })
                          }),
                          _jsxs(CardContent, {
                            children: [
                              _jsx(CardDescription, {
                                className: 'text-base mb-4',
                                children: useCase.description
                              }),
                              _jsxs('a', {
                                href: useCase.link,
                                className:
                                  'text-synapse-primary font-medium inline-flex items-center hover:underline',
                                children: [
                                  'View Case Study ',
                                  _jsx(ArrowRight, { size: 16, className: 'ml-1' })
                                ]
                              })
                            ]
                          })
                        ]
                      },
                      index
                    )
                  )
                })
              ]
            })
          }),
          _jsx('section', {
            className: 'bg-white py-16 border-t border-gray-100',
            children: _jsx('div', {
              className: 'container mx-auto px-4',
              children: _jsxs('div', {
                className: 'max-w-4xl mx-auto text-center',
                children: [
                  _jsx(Badge, { className: 'mb-4', children: 'Get Started' }),
                  _jsx('h2', {
                    className: 'text-3xl font-bold mb-4',
                    children: 'Find the Right Solution for Your Industry'
                  }),
                  _jsx('p', {
                    className: 'text-lg text-gray-600 mb-8 max-w-2xl mx-auto',
                    children:
                      'Our team of compliance experts will help you identify the specific features and configurations that best address your regulatory challenges.'
                  }),
                  _jsxs('div', {
                    className: 'flex flex-col sm:flex-row justify-center gap-4',
                    children: [
                      _jsx(Button, { size: 'lg', children: 'Schedule a Consultation' }),
                      _jsx(Button, {
                        size: 'lg',
                        variant: 'outline',
                        children: 'Download Solutions Guide'
                      })
                    ]
                  })
                ]
              })
            })
          })
        ]
      }),
      _jsx(Footer, {})
    ]
  });
};
export default Solutions;
