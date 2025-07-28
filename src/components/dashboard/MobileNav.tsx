import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { User } from '@/contexts/AuthContext';
import { navItems } from './navItems';

interface MobileNavProps {
  user: User;
  onLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ user: _user, onLogout }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className='md:hidden'>
      {/* Mobile Header */}
      <div className='fixed top-0 w-full bg-white border-b border-gray-200 z-10'>
        <div className='flex items-center justify-between h-16 px-4'>
          {/* Mobile Logo */}
          <Link to='/' className='flex items-center'>
            <h1 className='text-xl font-bold text-blue-700 tracking-tight'>Synapses</h1>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label='Toggle menu'
          >
            {isMobileNavOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileNavOpen && (
          <div className='bg-white border-b border-gray-200 px-2 py-3 max-h-[85vh] overflow-y-auto'>
            <nav className='grid gap-1'>
              {navItems.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-base font-medium rounded-md',
                    window.location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700'
                  )}
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <item.icon className='mr-3 h-5 w-5' />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  onLogout();
                }}
                className='flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-blue-700'
              >
                <LogOut className='mr-3 h-5 w-5' />
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
