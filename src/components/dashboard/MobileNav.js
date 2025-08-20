import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { navItems } from './navItems';
const MobileNav = ({ user: _user, onLogout }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  return _jsx('div', {
    className: 'md:hidden',
    children: _jsxs('div', {
      className: 'fixed top-0 w-full bg-white border-b border-gray-200 z-10',
      children: [
        _jsxs('div', {
          className: 'flex items-center justify-between h-16 px-4',
          children: [
            _jsx(Link, {
              to: '/',
              className: 'flex items-center',
              children: _jsx('h1', {
                className: 'text-xl font-bold text-blue-700 tracking-tight',
                children: 'Synapses'
              })
            }),
            _jsx(Button, {
              variant: 'ghost',
              size: 'icon',
              onClick: () => setIsMobileNavOpen(!isMobileNavOpen),
              'aria-label': 'Toggle menu',
              children: isMobileNavOpen
                ? _jsx(X, { className: 'h-6 w-6' })
                : _jsx(Menu, { className: 'h-6 w-6' })
            })
          ]
        }),
        isMobileNavOpen &&
          _jsx('div', {
            className: 'bg-white border-b border-gray-200 px-2 py-3 max-h-[85vh] overflow-y-auto',
            children: _jsxs('nav', {
              className: 'grid gap-1',
              children: [
                navItems.map(item =>
                  _jsxs(
                    Link,
                    {
                      to: item.href,
                      className: cn(
                        'flex items-center px-3 py-2 text-base font-medium rounded-md',
                        window.location.pathname === item.href
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700'
                      ),
                      onClick: () => setIsMobileNavOpen(false),
                      children: [_jsx(item.icon, { className: 'mr-3 h-5 w-5' }), item.label]
                    },
                    item.href
                  )
                ),
                _jsxs('button', {
                  onClick: () => {
                    setIsMobileNavOpen(false);
                    onLogout();
                  },
                  className:
                    'flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-blue-700',
                  children: [_jsx(LogOut, { className: 'mr-3 h-5 w-5' }), 'Logout']
                })
              ]
            })
          })
      ]
    })
  });
};
export default MobileNav;
