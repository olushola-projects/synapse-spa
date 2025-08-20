import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mail, MapPin, Phone, Users, BookOpen, HelpCircle, Briefcase } from 'lucide-react';
const Contact = () => {
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
                _jsx('h1', { className: 'text-4xl font-bold mb-4', children: 'Contact Us' }),
                _jsx('p', {
                  className: 'text-xl text-gray-600 max-w-3xl mx-auto',
                  children: 'Have questions about Synapse? Our team is here to help you.'
                })
              ]
            }),
            _jsxs('div', {
              className: 'max-w-6xl mx-auto grid md:grid-cols-3 gap-8',
              children: [
                _jsx('div', {
                  className: 'md:col-span-2',
                  children: _jsxs(Card, {
                    className: 'p-8 shadow-sm',
                    children: [
                      _jsx('h2', {
                        className: 'text-2xl font-semibold mb-6',
                        children: 'Send a Message'
                      }),
                      _jsxs('form', {
                        className: 'space-y-6',
                        children: [
                          _jsxs('div', {
                            className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
                            children: [
                              _jsxs('div', {
                                children: [
                                  _jsx('label', {
                                    htmlFor: 'name',
                                    className: 'block text-sm font-medium text-gray-700 mb-1',
                                    children: 'Name'
                                  }),
                                  _jsx(Input, {
                                    id: 'name',
                                    placeholder: 'Your name',
                                    className: 'w-full'
                                  })
                                ]
                              }),
                              _jsxs('div', {
                                children: [
                                  _jsx('label', {
                                    htmlFor: 'email',
                                    className: 'block text-sm font-medium text-gray-700 mb-1',
                                    children: 'Email'
                                  }),
                                  _jsx(Input, {
                                    id: 'email',
                                    type: 'email',
                                    placeholder: 'your.email@example.com',
                                    className: 'w-full'
                                  })
                                ]
                              })
                            ]
                          }),
                          _jsxs('div', {
                            children: [
                              _jsx('label', {
                                htmlFor: 'company',
                                className: 'block text-sm font-medium text-gray-700 mb-1',
                                children: 'Company'
                              }),
                              _jsx(Input, {
                                id: 'company',
                                placeholder: 'Your company name',
                                className: 'w-full'
                              })
                            ]
                          }),
                          _jsxs('div', {
                            children: [
                              _jsx('label', {
                                htmlFor: 'subject',
                                className: 'block text-sm font-medium text-gray-700 mb-1',
                                children: 'Subject'
                              }),
                              _jsxs('select', {
                                id: 'subject',
                                className:
                                  'w-full h-10 px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-synapse-primary',
                                children: [
                                  _jsx('option', { value: '', children: 'Select a topic' }),
                                  _jsx('option', {
                                    value: 'General Inquiry',
                                    children: 'General Inquiry'
                                  }),
                                  _jsx('option', {
                                    value: 'Platform Demo',
                                    children: 'Platform Demo'
                                  }),
                                  _jsx('option', {
                                    value: 'Partnership Opportunity',
                                    children: 'Partnership Opportunity'
                                  }),
                                  _jsx('option', {
                                    value: 'Technical Support',
                                    children: 'Technical Support'
                                  }),
                                  _jsx('option', {
                                    value: 'Pricing & Plans',
                                    children: 'Pricing & Plans'
                                  })
                                ]
                              })
                            ]
                          }),
                          _jsxs('div', {
                            children: [
                              _jsx('label', {
                                htmlFor: 'message',
                                className: 'block text-sm font-medium text-gray-700 mb-1',
                                children: 'Message'
                              }),
                              _jsx(Textarea, {
                                id: 'message',
                                placeholder: 'How can we help you?',
                                rows: 6,
                                className: 'w-full'
                              })
                            ]
                          }),
                          _jsx('div', {
                            children: _jsx(Button, {
                              type: 'submit',
                              size: 'lg',
                              className: 'w-full md:w-auto',
                              children: 'Send Message'
                            })
                          })
                        ]
                      })
                    ]
                  })
                }),
                _jsxs('div', {
                  children: [
                    _jsxs(Card, {
                      className: 'p-6 mb-6 shadow-sm',
                      children: [
                        _jsx('h3', {
                          className: 'text-lg font-semibold mb-4',
                          children: 'Contact Information'
                        }),
                        _jsxs('div', {
                          className: 'space-y-4',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-start',
                              children: [
                                _jsx(Mail, { className: 'h-5 w-5 text-synapse-primary mt-1 mr-3' }),
                                _jsxs('div', {
                                  children: [
                                    _jsx('p', { className: 'font-medium', children: 'Email' }),
                                    _jsx('a', {
                                      href: 'mailto:contact@synapse-platform.com',
                                      className: 'text-sm text-gray-600 hover:text-synapse-primary',
                                      children: 'contact@synapse-platform.com'
                                    })
                                  ]
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex items-start',
                              children: [
                                _jsx(Phone, {
                                  className: 'h-5 w-5 text-synapse-primary mt-1 mr-3'
                                }),
                                _jsxs('div', {
                                  children: [
                                    _jsx('p', { className: 'font-medium', children: 'Phone' }),
                                    _jsx('a', {
                                      href: 'tel:+18005551234',
                                      className: 'text-sm text-gray-600 hover:text-synapse-primary',
                                      children: '+1 (800) 555-1234'
                                    })
                                  ]
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex items-start',
                              children: [
                                _jsx(MapPin, {
                                  className: 'h-5 w-5 text-synapse-primary mt-1 mr-3'
                                }),
                                _jsxs('div', {
                                  children: [
                                    _jsx('p', { className: 'font-medium', children: 'Location' }),
                                    _jsxs('p', {
                                      className: 'text-sm text-gray-600',
                                      children: [
                                        '123 Compliance Way',
                                        _jsx('br', {}),
                                        'Regulatory District, RC 12345',
                                        _jsx('br', {}),
                                        'United States'
                                      ]
                                    })
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),
                    _jsxs(Card, {
                      className: 'p-6 shadow-sm',
                      children: [
                        _jsx('h3', {
                          className: 'text-lg font-semibold mb-4',
                          children: 'Connect with the right team'
                        }),
                        _jsxs('div', {
                          className: 'space-y-4',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-start',
                              children: [
                                _jsx(Users, {
                                  className: 'h-5 w-5 text-synapse-primary mt-1 mr-3'
                                }),
                                _jsxs('div', {
                                  children: [
                                    _jsx('p', { className: 'font-medium', children: 'Sales' }),
                                    _jsx('a', {
                                      href: 'mailto:sales@synapse-platform.com',
                                      className: 'text-sm text-gray-600 hover:text-synapse-primary',
                                      children: 'sales@synapse-platform.com'
                                    })
                                  ]
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex items-start',
                              children: [
                                _jsx(HelpCircle, {
                                  className: 'h-5 w-5 text-synapse-primary mt-1 mr-3'
                                }),
                                _jsxs('div', {
                                  children: [
                                    _jsx('p', { className: 'font-medium', children: 'Support' }),
                                    _jsx('a', {
                                      href: 'mailto:support@synapse-platform.com',
                                      className: 'text-sm text-gray-600 hover:text-synapse-primary',
                                      children: 'support@synapse-platform.com'
                                    })
                                  ]
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex items-start',
                              children: [
                                _jsx(Briefcase, {
                                  className: 'h-5 w-5 text-synapse-primary mt-1 mr-3'
                                }),
                                _jsxs('div', {
                                  children: [
                                    _jsx('p', {
                                      className: 'font-medium',
                                      children: 'Partnerships'
                                    }),
                                    _jsx('a', {
                                      href: 'mailto:partners@synapse-platform.com',
                                      className: 'text-sm text-gray-600 hover:text-synapse-primary',
                                      children: 'partners@synapse-platform.com'
                                    })
                                  ]
                                })
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex items-start',
                              children: [
                                _jsx(BookOpen, {
                                  className: 'h-5 w-5 text-synapse-primary mt-1 mr-3'
                                }),
                                _jsxs('div', {
                                  children: [
                                    _jsx('p', { className: 'font-medium', children: 'Press' }),
                                    _jsx('a', {
                                      href: 'mailto:press@synapse-platform.com',
                                      className: 'text-sm text-gray-600 hover:text-synapse-primary',
                                      children: 'press@synapse-platform.com'
                                    })
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
              ]
            }),
            _jsxs('div', {
              className: 'max-w-3xl mx-auto mt-20',
              children: [
                _jsx('h2', {
                  className: 'text-2xl font-bold text-center mb-8',
                  children: 'Frequently Asked Questions'
                }),
                _jsx('div', {
                  className: 'space-y-4',
                  children: [
                    {
                      question: 'How can I request a demo of Synapse?',
                      answer:
                        'You can request a personalized demo by filling out the contact form above or emailing sales@synapse-platform.com directly. One of our account executives will get in touch to schedule a time that works for you.'
                    },
                    {
                      question: 'Is Synapse available internationally?',
                      answer:
                        'Yes, Synapse is available to customers worldwide. Our platform supports multiple languages and regulatory frameworks across different jurisdictions.'
                    },
                    {
                      question: 'How do I get technical support?',
                      answer:
                        "If you're a current customer, you can access support through your account dashboard or by emailing support@synapse-platform.com. For urgent issues, we also offer phone support during business hours."
                    }
                  ].map((faq, index) =>
                    _jsxs(
                      'div',
                      {
                        className: 'bg-white rounded-lg shadow-sm p-6 border border-gray-100',
                        children: [
                          _jsx('h3', { className: 'font-semibold mb-2', children: faq.question }),
                          _jsx('p', { className: 'text-gray-600', children: faq.answer })
                        ]
                      },
                      index
                    )
                  )
                }),
                _jsx('div', {
                  className: 'text-center mt-8',
                  children: _jsx(Button, { variant: 'outline', children: 'View All FAQs' })
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
export default Contact;
