import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Play } from 'lucide-react';
import { Helmet } from 'react-helmet';
const Webinars = () => {
  const upcomingWebinars = [
    {
      id: 1,
      title: 'AI-Driven Regulatory Compliance: Beyond Traditional Approaches',
      description:
        'Explore how artificial intelligence is transforming regulatory compliance workflows and risk management frameworks.',
      date: 'January 25, 2024',
      time: '2:00 PM GMT',
      duration: '60 minutes',
      speakers: ['Dr. Sarah Chen', 'Marcus Rodriguez'],
      tags: ['AI', 'Compliance', 'RegTech'],
      registrationOpen: true
    },
    {
      id: 2,
      title: 'Global AML Standards: Navigating Cross-Border Compliance',
      description:
        'Understanding the evolving landscape of anti-money laundering regulations across different jurisdictions.',
      date: 'February 8, 2024',
      time: '3:00 PM GMT',
      duration: '45 minutes',
      speakers: ['James Wilson', 'Emma Thompson'],
      tags: ['AML', 'Global', 'Standards'],
      registrationOpen: true
    },
    {
      id: 3,
      title: 'Digital Asset Regulation: Preparing for the Future',
      description:
        'How financial institutions can prepare for emerging digital asset regulations and compliance requirements.',
      date: 'February 22, 2024',
      time: '1:00 PM GMT',
      duration: '75 minutes',
      speakers: ['Alex Kumar', 'Lisa Park'],
      tags: ['Digital Assets', 'Crypto', 'Regulation'],
      registrationOpen: true
    }
  ];
  const pastWebinars = [
    {
      id: 4,
      title: 'ESG Reporting Excellence: Best Practices and Frameworks',
      description:
        'Comprehensive guide to environmental, social, and governance reporting standards and implementation strategies.',
      date: 'January 11, 2024',
      duration: '50 minutes',
      speakers: ['Rachel Green', 'Tom Anderson'],
      tags: ['ESG', 'Reporting', 'Sustainability'],
      recordingAvailable: true
    },
    {
      id: 5,
      title: 'Risk Management in the Age of Digital Transformation',
      description:
        'How digital transformation is reshaping risk management practices and compliance monitoring.',
      date: 'December 14, 2023',
      duration: '65 minutes',
      speakers: ['Michael Brown', 'Ana Rodriguez'],
      tags: ['Risk Management', 'Digital', 'Transformation'],
      recordingAvailable: true
    },
    {
      id: 6,
      title: 'Regulatory Technology Implementation: Lessons Learned',
      description:
        'Real-world case studies and best practices from successful RegTech implementations.',
      date: 'November 30, 2023',
      duration: '55 minutes',
      speakers: ['David Kim', 'Jennifer White'],
      tags: ['RegTech', 'Implementation', 'Case Studies'],
      recordingAvailable: true
    }
  ];
  return _jsxs(_Fragment, {
    children: [
      _jsxs(Helmet, {
        children: [
          _jsx('title', { children: 'Webinars - Synapses | GRC Professional Development' }),
          _jsx('meta', {
            name: 'description',
            content:
              'Join our expert-led webinars on governance, risk, and compliance topics. Learn from industry leaders and stay ahead of regulatory changes.'
          })
        ]
      }),
      _jsxs('div', {
        className: 'min-h-screen bg-background',
        children: [
          _jsx('section', {
            className: 'py-20 bg-gradient-to-br from-primary/5 to-secondary/5',
            children: _jsxs('div', {
              className: 'container mx-auto px-4 sm:px-6 lg:px-8 text-center',
              children: [
                _jsx('h1', {
                  className: 'text-4xl md:text-6xl font-bold text-foreground mb-6',
                  children: 'GRC Webinars'
                }),
                _jsx('p', {
                  className: 'text-xl text-muted-foreground max-w-3xl mx-auto',
                  children:
                    'Stay ahead of regulatory changes and industry best practices with our expert-led webinars designed for GRC professionals.'
                })
              ]
            })
          }),
          _jsx('section', {
            className: 'py-16',
            children: _jsxs('div', {
              className: 'container mx-auto px-4 sm:px-6 lg:px-8',
              children: [
                _jsx('h2', {
                  className: 'text-3xl font-bold text-foreground mb-8',
                  children: 'Upcoming Webinars'
                }),
                _jsx('div', {
                  className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6',
                  children: upcomingWebinars.map(webinar =>
                    _jsxs(
                      Card,
                      {
                        className: 'hover:shadow-lg transition-shadow',
                        children: [
                          _jsxs(CardHeader, {
                            children: [
                              _jsx('div', {
                                className: 'flex flex-wrap gap-2 mb-2',
                                children: webinar.tags.map(tag =>
                                  _jsx(Badge, { variant: 'secondary', children: tag }, tag)
                                )
                              }),
                              _jsx(CardTitle, { className: 'text-lg', children: webinar.title }),
                              _jsx(CardDescription, { children: webinar.description })
                            ]
                          }),
                          _jsx(CardContent, {
                            children: _jsxs('div', {
                              className: 'space-y-3',
                              children: [
                                _jsxs('div', {
                                  className:
                                    'flex items-center gap-2 text-sm text-muted-foreground',
                                  children: [_jsx(Calendar, { className: 'h-4 w-4' }), webinar.date]
                                }),
                                _jsxs('div', {
                                  className:
                                    'flex items-center gap-2 text-sm text-muted-foreground',
                                  children: [
                                    _jsx(Clock, { className: 'h-4 w-4' }),
                                    webinar.time,
                                    ' \u2022 ',
                                    webinar.duration
                                  ]
                                }),
                                _jsxs('div', {
                                  className:
                                    'flex items-center gap-2 text-sm text-muted-foreground',
                                  children: [
                                    _jsx(Users, { className: 'h-4 w-4' }),
                                    webinar.speakers.join(', ')
                                  ]
                                }),
                                _jsx(Button, { className: 'w-full mt-4', children: 'Register Now' })
                              ]
                            })
                          })
                        ]
                      },
                      webinar.id
                    )
                  )
                })
              ]
            })
          }),
          _jsx('section', {
            className: 'py-16 bg-muted/30',
            children: _jsxs('div', {
              className: 'container mx-auto px-4 sm:px-6 lg:px-8',
              children: [
                _jsx('h2', {
                  className: 'text-3xl font-bold text-foreground mb-8',
                  children: 'On-Demand Recordings'
                }),
                _jsx('div', {
                  className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6',
                  children: pastWebinars.map(webinar =>
                    _jsxs(
                      Card,
                      {
                        className: 'hover:shadow-lg transition-shadow',
                        children: [
                          _jsxs(CardHeader, {
                            children: [
                              _jsx('div', {
                                className: 'flex flex-wrap gap-2 mb-2',
                                children: webinar.tags.map(tag =>
                                  _jsx(Badge, { variant: 'outline', children: tag }, tag)
                                )
                              }),
                              _jsx(CardTitle, { className: 'text-lg', children: webinar.title }),
                              _jsx(CardDescription, { children: webinar.description })
                            ]
                          }),
                          _jsx(CardContent, {
                            children: _jsxs('div', {
                              className: 'space-y-3',
                              children: [
                                _jsxs('div', {
                                  className:
                                    'flex items-center gap-2 text-sm text-muted-foreground',
                                  children: [_jsx(Calendar, { className: 'h-4 w-4' }), webinar.date]
                                }),
                                _jsxs('div', {
                                  className:
                                    'flex items-center gap-2 text-sm text-muted-foreground',
                                  children: [
                                    _jsx(Clock, { className: 'h-4 w-4' }),
                                    webinar.duration
                                  ]
                                }),
                                _jsxs('div', {
                                  className:
                                    'flex items-center gap-2 text-sm text-muted-foreground',
                                  children: [
                                    _jsx(Users, { className: 'h-4 w-4' }),
                                    webinar.speakers.join(', ')
                                  ]
                                }),
                                _jsxs(Button, {
                                  variant: 'outline',
                                  className: 'w-full mt-4',
                                  children: [
                                    _jsx(Play, { className: 'h-4 w-4 mr-2' }),
                                    'Watch Recording'
                                  ]
                                })
                              ]
                            })
                          })
                        ]
                      },
                      webinar.id
                    )
                  )
                })
              ]
            })
          }),
          _jsx('section', {
            className: 'py-16 bg-primary text-primary-foreground',
            children: _jsxs('div', {
              className: 'container mx-auto px-4 sm:px-6 lg:px-8 text-center',
              children: [
                _jsx('h2', {
                  className: 'text-3xl font-bold mb-6',
                  children: 'Never Miss a Webinar'
                }),
                _jsx('p', {
                  className: 'text-xl mb-8 opacity-90',
                  children:
                    'Subscribe to our newsletter and get notified about upcoming webinars and exclusive content.'
                }),
                _jsx(Button, { size: 'lg', variant: 'secondary', children: 'Subscribe to Updates' })
              ]
            })
          })
        ]
      })
    ]
  });
};
export default Webinars;
