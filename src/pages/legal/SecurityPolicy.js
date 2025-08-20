import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldCheck, LockKeyhole, Server, Database } from 'lucide-react';
const SecurityPolicy = () => {
  return _jsxs('div', {
    className: 'min-h-screen flex flex-col',
    children: [
      _jsx(Navbar, {}),
      _jsx('div', {
        className: 'flex-grow',
        children: _jsxs('div', {
          className: 'container mx-auto px-4 py-12 max-w-4xl',
          children: [
            _jsx('h1', { className: 'text-3xl font-bold mb-8', children: 'Security Policy' }),
            _jsxs('div', {
              className: 'prose prose-lg max-w-none',
              children: [
                _jsx('p', {
                  className: 'text-gray-600 mb-6',
                  children: 'Last Updated: April 14, 2025'
                }),
                _jsxs('div', {
                  className: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-10',
                  children: [
                    _jsxs('div', {
                      className: 'bg-white p-6 rounded-lg shadow-sm border border-gray-100',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center mb-4',
                          children: [
                            _jsx(ShieldCheck, { className: 'h-6 w-6 text-synapse-primary mr-2' }),
                            _jsx('h3', {
                              className: 'font-medium text-lg',
                              children: 'Data Protection'
                            })
                          ]
                        }),
                        _jsx('p', {
                          className: 'text-gray-600',
                          children:
                            'Your data is encrypted both in transit and at rest using industry-standard protocols and algorithms.'
                        })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'bg-white p-6 rounded-lg shadow-sm border border-gray-100',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center mb-4',
                          children: [
                            _jsx(LockKeyhole, { className: 'h-6 w-6 text-synapse-primary mr-2' }),
                            _jsx('h3', {
                              className: 'font-medium text-lg',
                              children: 'Access Control'
                            })
                          ]
                        }),
                        _jsx('p', {
                          className: 'text-gray-600',
                          children:
                            'We implement strict role-based access controls with multi-factor authentication for all internal systems.'
                        })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'bg-white p-6 rounded-lg shadow-sm border border-gray-100',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center mb-4',
                          children: [
                            _jsx(Server, { className: 'h-6 w-6 text-synapse-primary mr-2' }),
                            _jsx('h3', {
                              className: 'font-medium text-lg',
                              children: 'Infrastructure Security'
                            })
                          ]
                        }),
                        _jsx('p', {
                          className: 'text-gray-600',
                          children:
                            'Our infrastructure is monitored 24/7 with automated threat detection and response capabilities.'
                        })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'bg-white p-6 rounded-lg shadow-sm border border-gray-100',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center mb-4',
                          children: [
                            _jsx(Database, { className: 'h-6 w-6 text-synapse-primary mr-2' }),
                            _jsx('h3', {
                              className: 'font-medium text-lg',
                              children: 'Backups & Recovery'
                            })
                          ]
                        }),
                        _jsx('p', {
                          className: 'text-gray-600',
                          children:
                            'We perform regular backups with tested recovery procedures to ensure business continuity.'
                        })
                      ]
                    })
                  ]
                }),
                _jsx('h2', {
                  className: 'text-2xl font-semibold mt-8 mb-4',
                  children: '1. Security Overview'
                }),
                _jsx('p', {
                  children:
                    'At Synapse, security is our top priority. We implement comprehensive security measures to protect your data and ensure the integrity of our platform. Our security program is designed with multiple layers of protection and follows industry best practices.'
                }),
                _jsx('h2', {
                  className: 'text-2xl font-semibold mt-8 mb-4',
                  children: '2. Data Security'
                }),
                _jsx('p', { children: 'We protect your data through:' }),
                _jsxs('ul', {
                  className: 'list-disc pl-6 my-4 space-y-2',
                  children: [
                    _jsx('li', { children: 'Encryption of data in transit using TLS 1.3' }),
                    _jsx('li', { children: 'Encryption of data at rest using AES-256' }),
                    _jsx('li', {
                      children: 'Regular security assessments and penetration testing'
                    }),
                    _jsx('li', { children: 'Secure coding practices and regular code reviews' }),
                    _jsx('li', { children: 'Comprehensive logging and monitoring' })
                  ]
                }),
                _jsx('h2', {
                  className: 'text-2xl font-semibold mt-8 mb-4',
                  children: '3. Physical Security'
                }),
                _jsx('p', {
                  children: 'Our infrastructure is hosted in SOC 2 compliant data centers with:'
                }),
                _jsxs('ul', {
                  className: 'list-disc pl-6 my-4 space-y-2',
                  children: [
                    _jsx('li', { children: '24/7 physical security' }),
                    _jsx('li', { children: 'Biometric access controls' }),
                    _jsx('li', { children: 'Video surveillance' }),
                    _jsx('li', { children: 'Environmental controls' }),
                    _jsx('li', { children: 'Redundant power and network connections' })
                  ]
                }),
                _jsx('h2', {
                  className: 'text-2xl font-semibold mt-8 mb-4',
                  children: '4. Compliance Status'
                }),
                _jsxs('div', {
                  className: 'bg-blue-50 border-l-4 border-blue-500 p-4 mb-6',
                  children: [
                    _jsx('p', {
                      className: 'font-medium',
                      children: 'Current security framework status: In Progress'
                    }),
                    _jsx('p', {
                      className: 'text-sm mt-2',
                      children:
                        'We are actively working towards compliance with ISO 27001, SOC 2 Type II, and relevant industry standards.'
                    })
                  ]
                }),
                _jsx('h2', {
                  className: 'text-2xl font-semibold mt-8 mb-4',
                  children: '5. Security Incident Response'
                }),
                _jsx('p', { children: 'We have a formal incident response process to address:' }),
                _jsxs('ul', {
                  className: 'list-disc pl-6 my-4 space-y-2',
                  children: [
                    _jsx('li', {
                      children: 'Identification and classification of security incidents'
                    }),
                    _jsx('li', { children: 'Containment and eradication procedures' }),
                    _jsx('li', { children: 'Recovery and post-incident analysis' }),
                    _jsx('li', { children: 'Customer notification when applicable' })
                  ]
                }),
                _jsx('h2', {
                  className: 'text-2xl font-semibold mt-8 mb-4',
                  children: '6. Employee Security'
                }),
                _jsx('p', { children: 'Our security practices for employees include:' }),
                _jsxs('ul', {
                  className: 'list-disc pl-6 my-4 space-y-2',
                  children: [
                    _jsx('li', { children: 'Background checks for all employees' }),
                    _jsx('li', { children: 'Regular security awareness training' }),
                    _jsx('li', { children: 'Principle of least privilege access' }),
                    _jsx('li', { children: 'Multi-factor authentication' })
                  ]
                }),
                _jsx('h2', {
                  className: 'text-2xl font-semibold mt-8 mb-4',
                  children: '7. Contact Us'
                }),
                _jsx('p', {
                  children:
                    'To report security concerns or for more information about our security practices, please contact us at:'
                }),
                _jsx('p', { className: 'mt-2', children: 'Email: security@synapse-platform.com' }),
                _jsx('p', {
                  className: 'mt-1',
                  children: 'For urgent security issues: +1-800-555-0123'
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
export default SecurityPolicy;
