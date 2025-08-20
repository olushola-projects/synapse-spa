import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Briefcase } from 'lucide-react';
const Careers = () => {
  const openPositions = [
    {
      title: 'Senior GRC Analyst',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description:
        'Lead the development of our AI-powered GRC solutions and work directly with compliance professionals.',
      skills: ['GRC', 'Risk Management', 'Compliance', 'AI/ML']
    },
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'London, UK',
      type: 'Full-time',
      description:
        'Build beautiful and functional user interfaces for our GRC intelligence platform.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']
    },
    {
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Develop and optimize AI agents for regulatory compliance and risk assessment.',
      skills: ['Python', 'TensorFlow', 'NLP', 'Machine Learning']
    }
  ];
  return _jsxs('div', {
    className: 'min-h-screen bg-white',
    children: [
      _jsx(Navbar, {}),
      _jsx('main', {
        className: 'pt-24 pb-16',
        children: _jsxs('div', {
          className: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
          children: [
            _jsxs('div', {
              className: 'text-center mb-12',
              children: [
                _jsx('h1', {
                  className: 'text-4xl font-bold text-gray-900 mb-4',
                  children: 'Join Our Mission'
                }),
                _jsx('p', {
                  className: 'text-xl text-gray-600 max-w-2xl mx-auto',
                  children:
                    "Help us build the future of GRC intelligence. We're looking for passionate individuals who want to revolutionize compliance and risk management."
                })
              ]
            }),
            _jsxs('div', {
              className: 'mb-12',
              children: [
                _jsx('h2', {
                  className: 'text-2xl font-bold text-gray-900 mb-6',
                  children: 'Why Work With Us'
                }),
                _jsxs('div', {
                  className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6',
                  children: [
                    _jsxs('div', {
                      className: 'text-center',
                      children: [
                        _jsx('div', {
                          className:
                            'bg-[#7A73FF] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4',
                          children: _jsx(Users, { className: 'h-6 w-6 text-white' })
                        }),
                        _jsx('h3', {
                          className: 'font-semibold mb-2',
                          children: 'Collaborative Culture'
                        }),
                        _jsx('p', {
                          className: 'text-gray-600 text-sm',
                          children:
                            'Work with experts across GRC, AI, and technology in a supportive environment.'
                        })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'text-center',
                      children: [
                        _jsx('div', {
                          className:
                            'bg-[#7A73FF] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4',
                          children: _jsx(Briefcase, { className: 'h-6 w-6 text-white' })
                        }),
                        _jsx('h3', {
                          className: 'font-semibold mb-2',
                          children: 'Meaningful Impact'
                        }),
                        _jsx('p', {
                          className: 'text-gray-600 text-sm',
                          children:
                            'Build solutions that help professionals navigate complex regulatory landscapes.'
                        })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'text-center',
                      children: [
                        _jsx('div', {
                          className:
                            'bg-[#7A73FF] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4',
                          children: _jsx(MapPin, { className: 'h-6 w-6 text-white' })
                        }),
                        _jsx('h3', { className: 'font-semibold mb-2', children: 'Remote-First' }),
                        _jsx('p', {
                          className: 'text-gray-600 text-sm',
                          children:
                            'Flexible work arrangements with a global team of talented individuals.'
                        })
                      ]
                    })
                  ]
                })
              ]
            }),
            _jsxs('div', {
              className: 'mb-12',
              children: [
                _jsx('h2', {
                  className: 'text-2xl font-bold text-gray-900 mb-6',
                  children: 'Open Positions'
                }),
                _jsx('div', {
                  className: 'space-y-6',
                  children: openPositions.map((position, index) =>
                    _jsxs(
                      Card,
                      {
                        className:
                          'border border-gray-200 hover:border-[#7A73FF] transition-colors',
                        children: [
                          _jsx(CardHeader, {
                            children: _jsxs('div', {
                              className: 'flex justify-between items-start',
                              children: [
                                _jsxs('div', {
                                  children: [
                                    _jsx(CardTitle, {
                                      className: 'text-xl',
                                      children: position.title
                                    }),
                                    _jsx(CardDescription, {
                                      className: 'mt-1',
                                      children: position.department
                                    })
                                  ]
                                }),
                                _jsx(Button, {
                                  className: 'bg-[#7A73FF] hover:bg-[#6366F1]',
                                  children: 'Apply Now'
                                })
                              ]
                            })
                          }),
                          _jsxs(CardContent, {
                            children: [
                              _jsx('p', {
                                className: 'text-gray-600 mb-4',
                                children: position.description
                              }),
                              _jsxs('div', {
                                className: 'flex items-center gap-4 mb-4 text-sm text-gray-500',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex items-center gap-1',
                                    children: [
                                      _jsx(MapPin, { className: 'h-4 w-4' }),
                                      position.location
                                    ]
                                  }),
                                  _jsxs('div', {
                                    className: 'flex items-center gap-1',
                                    children: [_jsx(Clock, { className: 'h-4 w-4' }), position.type]
                                  })
                                ]
                              }),
                              _jsx('div', {
                                className: 'flex flex-wrap gap-2',
                                children: position.skills.map((skill, skillIndex) =>
                                  _jsx(Badge, { variant: 'secondary', children: skill }, skillIndex)
                                )
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
            }),
            _jsxs('div', {
              className: 'text-center bg-gray-50 rounded-lg p-8',
              children: [
                _jsx('h2', {
                  className: 'text-2xl font-bold text-gray-900 mb-4',
                  children: "Don't See Your Role?"
                }),
                _jsx('p', {
                  className: 'text-gray-600 mb-6',
                  children:
                    "We're always looking for talented individuals. Send us your resume and tell us how you'd like to contribute."
                }),
                _jsx(Button, {
                  size: 'lg',
                  className: 'bg-[#7A73FF] hover:bg-[#6366F1]',
                  children: 'Get In Touch'
                })
              ]
            })
          ]
        })
      }),
      _jsx(Footer, {})
    ]
  });
};
export default Careers;
