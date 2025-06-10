
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Users, ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { InviteTeamDialog } from './InviteTeamDialog';

interface WebAppTopNavProps {
  userName: string;
}

export const WebAppTopNav: React.FC<WebAppTopNavProps> = ({ userName }) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const handleEnterpriseDemo = () => {
    window.open('https://joinsynapses.com/demo', '_blank');
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Sidebar trigger and search */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome back, {userName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="destructive" className="text-xs font-medium">
                  High Priority
                </Badge>
                <span className="text-sm text-gray-600">
                  2 compliance cases require your attention
                </span>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search regulations, agents, or tasks..."
                className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Right side - Actions and notifications */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInviteDialog(true)}
              className="hidden sm:flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Users size={16} />
              Invite Team
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleEnterpriseDemo}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <span className="hidden sm:inline">Enterprise Demo</span>
              <span className="sm:hidden">Demo</span>
              <ExternalLink size={14} />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} className="text-gray-600" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-red-500 text-white">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </nav>

      <InviteTeamDialog 
        open={showInviteDialog} 
        onOpenChange={setShowInviteDialog} 
      />
    </>
  );
};
