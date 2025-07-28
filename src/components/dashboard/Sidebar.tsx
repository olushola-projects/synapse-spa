import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { User } from '@/contexts/AuthContext';
import { navItems } from './navItems';

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  return (
    <div className='hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-50'>
      <div className='flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200'>
        <div className='flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200'>
          <Link to='/' className='flex items-center'>
            <h1 className='text-xl font-bold text-blue-700 tracking-tight'>Synapses</h1>
          </Link>
        </div>
        <div className='flex-1 flex flex-col overflow-y-auto pt-5 pb-4'>
          <nav className='flex-1 px-2 space-y-1'>
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-blue-700',
                  window.location.pathname === item.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    window.location.pathname === item.href
                      ? 'text-blue-700'
                      : 'text-gray-400 group-hover:text-blue-700'
                  )}
                />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className='flex-shrink-0 flex border-t border-gray-200 p-4'>
          <Link to='/profile' className='flex-shrink-0 w-full group block'>
            <div className='flex items-center'>
              <div>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-700'>{user.name}</p>
                <p className='text-xs font-medium text-gray-500 truncate'>{user.email}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
