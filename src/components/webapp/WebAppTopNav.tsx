
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Users, ExternalLink, SidebarTrigger } from 'lucide-react';
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
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Sidebar trigger and welcome */}
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome back, {userName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="destructive" className="text-xs">
                  High Priority
                </Badge>
                <span className="text-sm text-gray-600">
                  2 cases require your attention
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Actions and profile */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInviteDialog(true)}
              className="flex items-center gap-2"
            >
              <Users size={16} />
              Invite Team
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleEnterpriseDemo}
              className="flex items-center gap-2"
            >
              Enterprise Demo
              <ExternalLink size={14} />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
              <AvatarFallback className="text-sm">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
