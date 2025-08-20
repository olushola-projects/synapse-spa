import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { SearchIcon, FileText, Book, Code, Video, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
const Documentation = () => {
  return _jsxs('div', {
    className: 'min-h-screen flex flex-col',
    children: [
      _jsx(Navbar, {}),
      _jsx('div', {
        className: 'flex-grow bg-gray-50',
        children: _jsxs('div', {
          className: 'container mx-auto px-4 py-12',
          children: [
            _jsxs('div', {
              className: 'text-center mb-16',
              children: [
                _jsx('h1', {
                  className: 'text-4xl font-bold mb-4',
                  children: 'Synapse Documentation'
                }),
                _jsx('p', {
                  className: 'text-xl text-gray-600 max-w-3xl mx-auto',
                  children:
                    'Learn how to use the Synapse platform effectively with our comprehensive documentation.'
                }),
                _jsxs('div', {
                  className: 'max-w-2xl mx-auto mt-8 relative',
                  children: [
                    _jsx(Input, {
                      type: 'text',
                      placeholder: 'Search documentation...',
                      className: 'pl-10 py-6 pr-4 rounded-lg shadow-sm border border-gray-200'
                    }),
                    _jsx(SearchIcon, {
                      className:
                        'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
                    })
                  ]
                })
              ]
            }),
            _jsxs('div', {
              className: 'max-w-6xl mx-auto mb-16',
              children: [
                _jsx('h2', { className: 'text-2xl font-semibold mb-6', children: 'Quick Links' }),
                _jsx('div', {
                  className: 'grid grid-cols-2 md:grid-cols-4 gap-4',
                  children: [
                    {
                      title: 'Getting Started',
                      icon: _jsx(FileText, {}),
                      color: 'bg-blue-100 text-blue-700'
                    },
                    {
                      title: 'API Reference',
                      icon: _jsx(Code, {}),
                      color: 'bg-green-100 text-green-700'
                    },
                    {
                      title: 'User Guides',
                      icon: _jsx(Book, {}),
                      color: 'bg-purple-100 text-purple-700'
                    },
                    {
                      title: 'Video Tutorials',
                      icon: _jsx(Video, {}),
                      color: 'bg-orange-100 text-orange-700'
                    }
                  ].map((item, index) =>
                    _jsxs(
                      'div',
                      {
                        className:
                          'bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex items-center hover:shadow-md transition-shadow',
                        children: [
                          _jsx('div', {
                            className: `${item.color} p-2 rounded-full mr-4 flex-shrink-0`,
                            children: item.icon
                          }),
                          _jsx('span', { className: 'font-medium', children: item.title })
                        ]
                      },
                      index
                    )
                  )
                })
              ]
            }),
            _jsxs('div', {
              className: 'max-w-6xl mx-auto',
              children: [
                _jsx('h2', {
                  className: 'text-2xl font-semibold mb-6',
                  children: 'Browse by Category'
                }),
                _jsxs('div', {
                  className: 'grid md:grid-cols-3 gap-6',
                  children: [
                    _jsxs(Card, {
                      className: 'p-6',
                      children: [
                        _jsx('h3', {
                          className: 'text-xl font-bold mb-3',
                          children: 'Platform Basics'
                        }),
                        _jsxs('ul', {
                          className: 'space-y-2',
                          children: [
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Getting Started Guide ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Navigation & Interface ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Account Management ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'User Preferences ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            })
                          ]
                        }),
                        _jsx(Button, {
                          variant: 'ghost',
                          size: 'sm',
                          className: 'mt-4 text-gray-600',
                          children: 'View All (12)'
                        })
                      ]
                    }),
                    _jsxs(Card, {
                      className: 'p-6',
                      children: [
                        _jsx('h3', {
                          className: 'text-xl font-bold mb-3',
                          children: 'Compliance Tools'
                        }),
                        _jsxs('ul', {
                          className: 'space-y-2',
                          children: [
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Regulatory Framework Library ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Assessment Builder ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Control Mapping ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Evidence Collection ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            })
                          ]
                        }),
                        _jsx(Button, {
                          variant: 'ghost',
                          size: 'sm',
                          className: 'mt-4 text-gray-600',
                          children: 'View All (15)'
                        })
                      ]
                    }),
                    _jsxs(Card, {
                      className: 'p-6',
                      children: [
                        _jsx('h3', {
                          className: 'text-xl font-bold mb-3',
                          children: 'AI Copilot (Dara)'
                        }),
                        _jsxs('ul', {
                          className: 'space-y-2',
                          children: [
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Dara Capabilities ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Asking Effective Questions ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Interpreting Responses ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Customizing Dara ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            })
                          ]
                        }),
                        _jsx(Button, {
                          variant: 'ghost',
                          size: 'sm',
                          className: 'mt-4 text-gray-600',
                          children: 'View All (8)'
                        })
                      ]
                    }),
                    _jsxs(Card, {
                      className: 'p-6',
                      children: [
                        _jsx('h3', {
                          className: 'text-xl font-bold mb-3',
                          children: 'Collaboration Features'
                        }),
                        _jsxs('ul', {
                          className: 'space-y-2',
                          children: [
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Team Workspaces ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Task Assignment ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Document Sharing ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Review Workflows ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            })
                          ]
                        }),
                        _jsx(Button, {
                          variant: 'ghost',
                          size: 'sm',
                          className: 'mt-4 text-gray-600',
                          children: 'View All (10)'
                        })
                      ]
                    }),
                    _jsxs(Card, {
                      className: 'p-6',
                      children: [
                        _jsx('h3', { className: 'text-xl font-bold mb-3', children: 'Reporting' }),
                        _jsxs('ul', {
                          className: 'space-y-2',
                          children: [
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Dashboard Analytics ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Custom Reports ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Export Options ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Scheduled Reports ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            })
                          ]
                        }),
                        _jsx(Button, {
                          variant: 'ghost',
                          size: 'sm',
                          className: 'mt-4 text-gray-600',
                          children: 'View All (7)'
                        })
                      ]
                    }),
                    _jsxs(Card, {
                      className: 'p-6',
                      children: [
                        _jsx('h3', {
                          className: 'text-xl font-bold mb-3',
                          children: 'Integration & API'
                        }),
                        _jsxs('ul', {
                          className: 'space-y-2',
                          children: [
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'API Reference ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Available Integrations ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Authentication ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            }),
                            _jsx('li', {
                              children: _jsxs('a', {
                                href: '#',
                                className: 'text-blue-600 hover:underline flex items-center',
                                children: [
                                  'Webhooks ',
                                  _jsx(ArrowRight, { className: 'ml-1 h-3 w-3' })
                                ]
                              })
                            })
                          ]
                        }),
                        _jsx(Button, {
                          variant: 'ghost',
                          size: 'sm',
                          className: 'mt-4 text-gray-600',
                          children: 'View All (14)'
                        })
                      ]
                    })
                  ]
                })
              ]
            }),
            _jsxs('div', {
              className: 'max-w-6xl mx-auto mt-16',
              children: [
                _jsx('h2', {
                  className: 'text-2xl font-semibold mb-6',
                  children: 'Additional Resources'
                }),
                _jsx('div', {
                  className: 'grid md:grid-cols-4 gap-6',
                  children: [
                    { title: 'Community Forum', description: 'Connect with other Synapse users' },
                    {
                      title: 'Video Tutorials',
                      description: 'Visual guides for platform features'
                    },
                    { title: 'Webinar Recordings', description: 'Expert-led training sessions' },
                    { title: 'GRC Templates', description: 'Ready-to-use compliance resources' }
                  ].map((resource, index) =>
                    _jsxs(
                      'div',
                      {
                        className:
                          'bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow',
                        children: [
                          _jsx('h3', { className: 'font-semibold mb-2', children: resource.title }),
                          _jsx('p', {
                            className: 'text-gray-600 text-sm mb-4',
                            children: resource.description
                          }),
                          _jsx(Button, {
                            variant: 'outline',
                            size: 'sm',
                            className: 'w-full',
                            children: 'Explore'
                          })
                        ]
                      },
                      index
                    )
                  )
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
export default Documentation;
