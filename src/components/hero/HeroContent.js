import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users } from 'lucide-react';
// Simple icon components
const ArrowRightIcon = () => _jsx(ArrowRight, { className: 'w-4 h-4' });
const ShieldIcon = () => _jsx(Shield, { className: 'w-4 h-4' });
const UsersIcon = () => _jsx(Users, { className: 'w-4 h-4' });
/**
 * HeroContent component - Main hero section content with improved alignment and visual hierarchy
 * Features precise logo alignment, enhanced typography, and professional GRC-focused messaging
 */
export const HeroContent = ({ animate, onGetAccess, onInvite }) => {
  return _jsxs('div', {
    className: `w-full text-left transition-all duration-700 ease-out pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 pb-10 md:pb-0 ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`,
    children: [
      _jsxs('h1', {
        style: {
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          textShadow: '0 1px 2px rgba(37, 99, 235, 0.1)'
        },
        className:
          'sm:text-5xl md:text-6xl tracking-tight leading-tight text-blue-600 mb-6 font-medium lg:text-7xl py-[41px] text-3xl',
        children: [
          'Transform',
          _jsx('br', {}),
          'Your Expertise',
          _jsx('br', {}),
          _jsx('span', {
            className:
              'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent',
            children: 'With GRC Agents'
          })
        ]
      }),
      _jsxs('p', {
        className:
          'mt-6 text-sm md:text-base max-w-2xl leading-relaxed text-black font-light lg:text-base text-left my-0',
        children: [
          'Join a global network of GRC professionals leveraging AI agents',
          _jsx('br', {}),
          'for compliance excellence. Access exclusive testing of future',
          _jsx('br', {}),
          'solutions, comprehensive regulatory insights, and personalized',
          _jsx('br', {}),
          'career resilience tools to',
          ' ',
          _jsx('span', {
            className: 'font-semibold text-blue-600',
            children: 'upskill, adapt, and lead'
          }),
          ' the',
          _jsx('br', {}),
          'transformation of governance, risk, and compliance.'
        ]
      }),
      _jsxs('div', {
        className: 'mt-10 flex flex-col sm:flex-row gap-4 justify-start items-start',
        children: [
          _jsx('div', {
            onClick: onGetAccess,
            className: 'cursor-pointer',
            children: _jsxs(Button, {
              className:
                'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ',
              children: ['Get Early Access ', _jsx(ArrowRightIcon, {})]
            })
          }),
          _jsx('div', {
            onClick: onInvite,
            className: 'cursor-pointer',
            children: _jsx(Button, {
              variant: 'outline',
              className:
                'border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 text-base rounded-xl font-semibold hover-lift transition-all duration-300',
              children: 'Invite Colleagues'
            })
          })
        ]
      }),
      _jsxs('div', {
        className:
          'mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-6 text-sm',
        children: [
          _jsxs('div', {
            className: 'flex items-center text-slate-500',
            children: [
              _jsx('div', { className: 'w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse' }),
              _jsx('div', { className: 'mr-2 text-green-600', children: _jsx(ShieldIcon, {}) }),
              _jsx('span', { className: 'font-medium', children: 'GRC Innovation Hub' })
            ]
          }),
          _jsxs('div', {
            className: 'flex items-center text-slate-500',
            children: [
              _jsx('div', { className: 'w-2 h-2 bg-blue-500 rounded-full mr-3' }),
              _jsx('div', { className: 'mr-2 text-blue-600', children: _jsx(UsersIcon, {}) }),
              _jsx('span', {
                className: 'font-medium',
                children: 'Join early adopters in our private pilot'
              })
            ]
          })
        ]
      })
    ]
  });
};
