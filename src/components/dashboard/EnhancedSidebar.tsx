
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Search,
  ChevronDown,
  Settings,
  HelpCircle,
  LogOut,
  Circle,
  LucideIcon
} from 'lucide-react';

export interface SidebarNavSubItem {
  id: string;
  title: string;
  count?: number;
  isActive?: boolean;
}

export interface SidebarNavItem {
  id: string;
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
  notification?: boolean;
  badge?: string | number;
  subItems?: SidebarNavSubItem[];
}

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  onClick?: () => void;
}

export interface UserProfile {
  name: string;
  role: string;
  focus?: string;
  avatarUrl?: string;
  initials?: string;
  status?: 'online' | 'offline' | 'away';
}

interface EnhancedSidebarProps {
  logo?: React.ReactNode;
  appName?: string;
  badge?: string;
  navigationItems?: SidebarNavItem[];
  quickActions?: QuickAction[];
  userProfile?: UserProfile;
  onSearch?: (query: string) => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  logo,
  appName = 'Synapses',
  badge = 'ESG Pro',
  navigationItems = [],
  quickActions = [],
  userProfile,
  onSearch,
  onSettingsClick,
  onHelpClick,
  onLogout,
  className
}) => {
  const { collapsed } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <Sidebar className={cn("border-r bg-white", className)} collapsible>
      {/* Header */}
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          {logo || (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
          )}
          {!collapsed && (
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{appName}</h2>
                {badge && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    {badge}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-9 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>
        )}
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2 py-4">
        {/* Quick Actions */}
        {quickActions.length > 0 && !collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs text-gray-500 uppercase tracking-wide px-2 mb-2">
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="grid grid-cols-3 gap-2 px-2 mb-4">
                {quickActions.map((action, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-12 flex flex-col items-center justify-center gap-1 p-2 text-xs"
                          onClick={action.onClick}
                        >
                          <action.icon className="h-4 w-4 text-gray-600" />
                          <span className="text-xs text-gray-600 leading-none">
                            {action.label.split(' ')[0]}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div className="flex items-center gap-2">
                          <span>{action.label}</span>
                          {action.shortcut && (
                            <kbd className="px-2 py-1 bg-gray-100 text-xs rounded">
                              {action.shortcut}
                            </kbd>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <div>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "w-full justify-start px-2 py-2 h-auto",
                        item.isActive && "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      )}
                    >
                      <Collapsible
                        open={expandedItems.includes(item.id)}
                        onOpenChange={() => toggleExpanded(item.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start px-2 py-2 h-auto font-medium"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <item.icon className="h-5 w-5 text-gray-600" />
                              {!collapsed && (
                                <>
                                  <span className="flex-1 text-left text-gray-900">
                                    {item.title}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {item.notification && (
                                      <Circle className="h-2 w-2 fill-blue-600 text-blue-600" />
                                    )}
                                    {item.badge && (
                                      <div className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded">
                                        {item.badge}
                                      </div>
                                    )}
                                    {item.subItems && item.subItems.length > 0 && (
                                      <ChevronDown
                                        className={cn(
                                          "h-4 w-4 text-gray-400 transition-transform",
                                          expandedItems.includes(item.id) && "rotate-180"
                                        )}
                                      />
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </Button>
                        </CollapsibleTrigger>

                        {/* Sub Items */}
                        {item.subItems && item.subItems.length > 0 && !collapsed && (
                          <CollapsibleContent className="mt-1">
                            <div className="ml-8 space-y-1">
                              {item.subItems.map((subItem) => (
                                <Button
                                  key={subItem.id}
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "w-full justify-start text-sm text-gray-600 hover:text-gray-900 font-normal h-8",
                                    subItem.isActive && "bg-blue-50 text-blue-700"
                                  )}
                                >
                                  <span className="flex-1 text-left">{subItem.title}</span>
                                  {subItem.count && (
                                    <span className="text-xs text-gray-400">
                                      {subItem.count}
                                    </span>
                                  )}
                                </Button>
                              ))}
                            </div>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t">
        {!collapsed && (
          <>
            <Separator className="mb-4" />
            
            {/* Bottom Actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onHelpClick}>
                        <HelpCircle className="h-4 w-4 text-gray-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Help & Resources</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSettingsClick}>
                        <Settings className="h-4 w-4 text-gray-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onLogout}>
                      <LogOut className="h-4 w-4 text-gray-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}

        {/* User Profile */}
        {userProfile && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
            <Avatar className="h-8 w-8">
              {userProfile.avatarUrl ? (
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
              ) : null}
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                {userProfile.initials || userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile.name}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-500 truncate">
                    {userProfile.role}
                  </p>
                  {userProfile.focus && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">
                        {userProfile.focus}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};
