import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Link } from 'react-router-dom';
import { Bell, User as UserIcon, LogOut, Search, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
const HeaderBar = ({ user, onLogout }) => {
  return _jsx('div', {
    className:
      'hidden md:flex sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200',
    children: _jsxs('div', {
      className: 'flex-1 px-4 flex justify-between',
      children: [
        _jsx('div', {
          className: 'flex-1 flex',
          children: _jsx('div', {
            className: 'flex w-full md:ml-0',
            children: _jsxs('div', {
              className: 'w-full relative',
              children: [
                _jsx('div', {
                  className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
                  children: _jsx(Search, { className: 'h-5 w-5 text-gray-400' })
                }),
                _jsx('input', {
                  className:
                    'block w-full pl-10 pr-3 py-2 border border-input rounded-md text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors',
                  placeholder: 'Search...',
                  type: 'search',
                  'aria-label': 'Search dashboard'
                })
              ]
            })
          })
        }),
        _jsxs('div', {
          className: 'ml-4 flex items-center md:ml-6 space-x-3',
          children: [
            _jsxs(Button, {
              variant: 'ghost',
              size: 'icon',
              className: 'relative text-muted-foreground hover:text-foreground',
              'aria-label': 'View notifications',
              'aria-describedby': 'notification-count',
              children: [
                _jsx(Bell, { className: 'h-5 w-5' }),
                _jsx('span', {
                  className:
                    'absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-destructive ring-2 ring-background',
                  'aria-hidden': 'true'
                }),
                _jsx('span', {
                  id: 'notification-count',
                  className: 'sr-only',
                  children: 'You have unread notifications'
                })
              ]
            }),
            _jsxs(DropdownMenu, {
              children: [
                _jsx(DropdownMenuTrigger, {
                  asChild: true,
                  children: _jsx(Button, {
                    variant: 'ghost',
                    className: 'relative h-8 w-8 rounded-full',
                    children: _jsxs(Avatar, {
                      className: 'h-8 w-8',
                      children: [
                        _jsx(AvatarImage, {
                          src: user.avatar_url || '/placeholder.svg',
                          alt: user.name
                        }),
                        _jsx(AvatarFallback, { children: user.name.charAt(0) })
                      ]
                    })
                  })
                }),
                _jsxs(DropdownMenuContent, {
                  className: 'w-56',
                  align: 'end',
                  forceMount: true,
                  children: [
                    _jsx(DropdownMenuLabel, {
                      className: 'font-normal',
                      children: _jsxs('div', {
                        className: 'flex flex-col space-y-1',
                        children: [
                          _jsx('p', {
                            className: 'text-sm font-medium leading-none',
                            children: user.name
                          }),
                          _jsx('p', {
                            className: 'text-xs leading-none text-muted-foreground',
                            children: user.email
                          })
                        ]
                      })
                    }),
                    _jsx(DropdownMenuSeparator, {}),
                    _jsxs(DropdownMenuGroup, {
                      children: [
                        _jsx(DropdownMenuItem, {
                          asChild: true,
                          children: _jsxs(Link, {
                            to: '/profile',
                            children: [
                              _jsx(UserIcon, { className: 'mr-2 h-4 w-4' }),
                              _jsx('span', { children: 'Profile' })
                            ]
                          })
                        }),
                        _jsx(DropdownMenuItem, {
                          asChild: true,
                          children: _jsxs(Link, {
                            to: '/dashboard',
                            children: [
                              _jsx(LayoutDashboard, { className: 'mr-2 h-4 w-4' }),
                              _jsx('span', { children: 'Dashboard' })
                            ]
                          })
                        }),
                        _jsx(DropdownMenuItem, {
                          asChild: true,
                          children: _jsxs(Link, {
                            to: '/settings',
                            children: [
                              _jsx(Settings, { className: 'mr-2 h-4 w-4' }),
                              _jsx('span', { children: 'Settings' })
                            ]
                          })
                        })
                      ]
                    }),
                    _jsx(DropdownMenuSeparator, {}),
                    _jsxs(DropdownMenuItem, {
                      onClick: onLogout,
                      children: [
                        _jsx(LogOut, { className: 'mr-2 h-4 w-4' }),
                        _jsx('span', { children: 'Log out' })
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
  });
};
export default HeaderBar;
