import React from 'react';
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
import type { User } from '@/contexts/AuthContext';

interface HeaderBarProps {
  user: User;
  onLogout: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ user, onLogout }) => {
  return (
    <div className='hidden md:flex sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200'>
      <div className='flex-1 px-4 flex justify-between'>
        <div className='flex-1 flex'>
          <div className='flex w-full md:ml-0'>
            <div className='w-full relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search className='h-5 w-5 text-gray-400' />
              </div>
              <input
                className='block w-full pl-10 pr-3 py-2 border border-input rounded-md text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors'
                placeholder='Search...'
                type='search'
                aria-label='Search dashboard'
              />
            </div>
          </div>
        </div>
        <div className='ml-4 flex items-center md:ml-6 space-x-3'>
          <Button
            variant='ghost'
            size='icon'
            className='relative text-muted-foreground hover:text-foreground'
            aria-label='View notifications'
            aria-describedby='notification-count'
          >
            <Bell className='h-5 w-5' />
            <span
              className='absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-destructive ring-2 ring-background'
              aria-hidden='true'
            />
            <span id='notification-count' className='sr-only'>
              You have unread notifications
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={user.avatar_url || '/placeholder.svg'} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>{user.name}</p>
                  <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to='/profile'>
                    <UserIcon className='mr-2 h-4 w-4' />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/dashboard'>
                    <LayoutDashboard className='mr-2 h-4 w-4' />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/settings'>
                    <Settings className='mr-2 h-4 w-4' />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
