import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { navItems } from './navItems';
const Sidebar = ({ user }) => {
  return _jsx('div', {
    className: 'hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-50',
    children: _jsxs('div', {
      className: 'flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200',
      children: [
        _jsx('div', {
          className: 'flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200',
          children: _jsx(Link, {
            to: '/',
            className: 'flex items-center',
            children: _jsx('h1', {
              className: 'text-xl font-bold text-blue-700 tracking-tight',
              children: 'Synapses'
            })
          })
        }),
        _jsx('div', {
          className: 'flex-1 flex flex-col overflow-y-auto pt-5 pb-4',
          children: _jsx('nav', {
            className: 'flex-1 px-2 space-y-1',
            children: navItems.map(item =>
              _jsxs(
                Link,
                {
                  to: item.href,
                  className: cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-blue-700',
                    window.location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600'
                  ),
                  children: [
                    _jsx(item.icon, {
                      className: cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        window.location.pathname === item.href
                          ? 'text-blue-700'
                          : 'text-gray-400 group-hover:text-blue-700'
                      )
                    }),
                    item.label
                  ]
                },
                item.href
              )
            )
          })
        }),
        _jsx('div', {
          className: 'flex-shrink-0 flex border-t border-gray-200 p-4',
          children: _jsx(Link, {
            to: '/profile',
            className: 'flex-shrink-0 w-full group block',
            children: _jsxs('div', {
              className: 'flex items-center',
              children: [
                _jsx('div', {
                  children: _jsxs(Avatar, {
                    children: [
                      _jsx(AvatarImage, {
                        src: user.avatar_url || '/placeholder.svg',
                        alt: user.name
                      }),
                      _jsx(AvatarFallback, { children: user.name.charAt(0) })
                    ]
                  })
                }),
                _jsxs('div', {
                  className: 'ml-3',
                  children: [
                    _jsx('p', {
                      className: 'text-sm font-medium text-gray-700',
                      children: user.name
                    }),
                    _jsx('p', {
                      className: 'text-xs font-medium text-gray-500 truncate',
                      children: user.email
                    })
                  ]
                })
              ]
            })
          })
        })
      ]
    })
  });
};
export default Sidebar;
