import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
export const SecurityTab = () => {
  return _jsxs(Card, {
    children: [
      _jsx(CardHeader, {
        children: _jsxs(CardTitle, {
          className: 'flex items-center space-x-2',
          children: [
            _jsx(Shield, { className: 'h-5 w-5' }),
            _jsx('span', { children: 'Security Monitoring' })
          ]
        })
      }),
      _jsx(CardContent, {
        children: _jsxs('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
          children: [
            _jsxs('div', {
              children: [
                _jsx('h4', { className: 'font-semibold mb-3', children: 'Authentication' }),
                _jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        _jsx('span', { children: 'API Key Status' }),
                        _jsx(Badge, {
                          className: 'bg-red-100 text-red-800',
                          children: 'Needs Configuration'
                        })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        _jsx('span', { children: 'RLS Policies' }),
                        _jsx(Badge, {
                          className: 'bg-green-100 text-green-800',
                          children: 'Active'
                        })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        _jsx('span', { children: 'Data Encryption' }),
                        _jsx(Badge, {
                          className: 'bg-green-100 text-green-800',
                          children: 'Enabled'
                        })
                      ]
                    })
                  ]
                })
              ]
            }),
            _jsxs('div', {
              children: [
                _jsx('h4', { className: 'font-semibold mb-3', children: 'Data Protection' }),
                _jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        _jsx('span', { children: 'Audit Logging' }),
                        _jsx(Badge, {
                          className: 'bg-green-100 text-green-800',
                          children: 'Active'
                        })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        _jsx('span', { children: 'GDPR Compliance' }),
                        _jsx(Badge, {
                          className: 'bg-green-100 text-green-800',
                          children: 'Compliant'
                        })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'flex items-center justify-between',
                      children: [
                        _jsx('span', { children: 'Data Retention' }),
                        _jsx(Badge, {
                          className: 'bg-green-100 text-green-800',
                          children: '7 Years'
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      })
    ]
  });
};
