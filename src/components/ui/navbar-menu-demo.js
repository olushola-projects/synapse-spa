import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// import React, { useState } from 'react';
// React import removed - using modern JSX transform
import { useState } from 'react';
import { HoveredLink, Menu, MenuItem, ProductItem } from '@/components/ui/navbar-menu';
import { cn } from '@/lib/utils';
/**
 * Demo component showcasing the navbar menu functionality
 */
export function NavbarDemo() {
  return _jsxs('div', {
    className: 'relative w-full flex items-center justify-center',
    children: [
      _jsx(Navbar, { className: 'top-2' }),
      _jsx('p', {
        className: 'text-black dark:text-white',
        children: 'The Navbar will show on top of the page'
      })
    ]
  });
}
/**
 * Main navbar component with GRC-focused menu items
 */
function Navbar({ className }) {
  const [active, setActive] = useState(null);
  return _jsx('div', {
    className: cn('fixed top-10 inset-x-0 max-w-2xl mx-auto z-50', className),
    children: _jsxs(Menu, {
      setActive: setActive,
      children: [
        _jsx(MenuItem, {
          setActive: setActive,
          active: active,
          item: 'Solutions',
          children: _jsxs('div', {
            className: 'flex flex-col space-y-4 text-sm',
            children: [
              _jsx(HoveredLink, { to: '/solutions/compliance', children: 'Compliance Management' }),
              _jsx(HoveredLink, { to: '/solutions/risk-assessment', children: 'Risk Assessment' }),
              _jsx(HoveredLink, {
                to: '/solutions/regulatory-intelligence',
                children: 'Regulatory Intelligence'
              }),
              _jsx(HoveredLink, { to: '/solutions/audit-automation', children: 'Audit Automation' })
            ]
          })
        }),
        _jsx(MenuItem, {
          setActive: setActive,
          active: active,
          item: 'AI Agents',
          children: _jsxs('div', {
            className: 'text-sm grid grid-cols-2 gap-10 p-4',
            children: [
              _jsx(ProductItem, {
                title: 'SFDR Navigator',
                to: '/agents/sfdr-navigator',
                src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
                description:
                  'Navigate SFDR compliance with AI-powered guidance and automated reporting.'
              }),
              _jsx(ProductItem, {
                title: 'AML Investigator',
                to: '/agents/aml-investigator',
                src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
                description:
                  'Advanced AI agent for anti-money laundering investigations and case management.'
              }),
              _jsx(ProductItem, {
                title: 'Risk Analyzer',
                to: '/agents/risk-analyzer',
                src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
                description:
                  'Real-time risk assessment and predictive analytics for proactive risk management.'
              }),
              _jsx(ProductItem, {
                title: 'Compliance Monitor',
                to: '/agents/compliance-monitor',
                src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
                description:
                  'Continuous compliance monitoring with automated alerts and remediation suggestions.'
              })
            ]
          })
        }),
        _jsx(MenuItem, {
          setActive: setActive,
          active: active,
          item: 'Platform',
          children: _jsxs('div', {
            className: 'flex flex-col space-y-4 text-sm',
            children: [
              _jsx(HoveredLink, { to: '/platform/dashboard', children: 'Dashboard' }),
              _jsx(HoveredLink, { to: '/platform/analytics', children: 'Analytics' }),
              _jsx(HoveredLink, { to: '/platform/integrations', children: 'Integrations' }),
              _jsx(HoveredLink, { to: '/platform/api', children: 'API Access' })
            ]
          })
        }),
        _jsx(MenuItem, {
          setActive: setActive,
          active: active,
          item: 'Resources',
          children: _jsxs('div', {
            className: 'flex flex-col space-y-4 text-sm',
            children: [
              _jsx(HoveredLink, { to: '/resources/documentation', children: 'Documentation' }),
              _jsx(HoveredLink, { to: '/resources/blog', children: 'Blog' }),
              _jsx(HoveredLink, { to: '/resources/case-studies', children: 'Case Studies' }),
              _jsx(HoveredLink, { to: '/resources/webinars', children: 'Webinars' })
            ]
          })
        })
      ]
    })
  });
}
