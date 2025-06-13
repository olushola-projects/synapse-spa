import React, { useState } from 'react';
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
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  LayoutDashboard, 
  Bot, 
  CheckSquare, 
  Calendar, 
  Trophy, 
  Users, 
  Settings,
  ChevronRight,
  Zap,
  Clock,
  Target,
  Search,
  Bell,
  HelpCircle,
  BookOpen,
  FileText,
  BarChart3,
  Shield,
  Briefcase,
  Globe,
  Star,
  PlusCircle,
  LogOut
} from 'lucide-react';

export interface SidebarNavItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: string | number;
  notification?: boolean;
  subItems?: Array<{ 
    id: string;
    title: string; 
    count?: number;
    isActive?: boolean;
  }>;
  onClick?: () => void;
}

export interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
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
  status?: 'online' | 'away' | 'offline';
}

interface EnhancedSidebarProps {
  logo?: React.ReactNode;
  appName?: string;
  badge?: string;
  navigationItems: SidebarNavItem[];
  quickActions?: QuickAction[];
  userProfile?: UserProfile;
  onSearch?: (query: string) => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  onHelpClick?: () => void;
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
  onLogout,
  onHelpClick,
  className = ''
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(navigationItems.find(item => item.isActive)?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleItemClick = (itemId: string, onClick?: () => void) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
    if (onClick) onClick();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <Sidebar className={`border-r border-gray-200 bg-white shadow-sm ${className}`}>
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {logo || (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">{appName.charAt(0)}</span>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{appName}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs px-2 py-0 bg-green-50 text-green-700 border-green-200">
                {badge}
              </Badge>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        {/* Search */}
        {onSearch && (
          <div className="px-3 mb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        )}

        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Quick Actions
            </SidebarGroupLabel>
            <div className="px-3 mb-4">
              <div className="grid grid-cols-3 gap-1">
                {quickActions.map((action, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-full p-1 flex flex-col items-center justify-center text-xs hover:bg-blue-50 hover:text-blue-700"
                          onClick={action.onClick}
                        >
                          <action.icon className="h-3 w-3 mb-1" />
                          <span className="truncate">{action.label.split(' ')[0]}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-xs">
                          {action.label}
                          {action.shortcut && <span className="ml-2 text-gray-400">{action.shortcut}</span>}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </SidebarGroup>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={item.isActive}
                    onClick={() => handleItemClick(item.id, item.onClick)}
                    className={`w-full justify-start px-3 py-2.5 rounded-lg transition-all duration-200 group ${item.isActive ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <item.icon className={`w-5 h-5 mr-3 ${item.isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span className="text-sm font-medium">{item.title}</span>
                        {item.notification && (
                          <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <SidebarMenuBadge variant={item.isActive ? "default" : "secondary"} className={item.isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600'}>
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                        {item.subItems && (
                          <ChevronRight className={`w-4 h-4 transition-transform ${expandedItem === item.id ? 'rotate-90' : ''} ${item.isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        )}
                      </div>
                    </div>
                  </SidebarMenuButton>

                  {/* Sub-items */}
                  {item.subItems && expandedItem === item.id && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton
                            isActive={subItem.isActive}
                            className={`w-full justify-start h-8 px-2 py-1 text-xs ${subItem.isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'} rounded-md`}
                          >
                            <span className="truncate">{subItem.title}</span>
                            {subItem.count !== undefined && (
                              <Badge variant="outline" className="ml-auto text-xs px-1.5 py-0 bg-gray-50">
                                {subItem.count}
                              </Badge>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Help & Support */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="w-full justify-start px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  onClick={onHelpClick}
                >
                  <HelpCircle className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-sm">Help & Resources</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="w-full justify-start px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  onClick={onSettingsClick}
                >
                  <Settings className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-sm">Settings & Preferences</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile */}
      {userProfile && (
        <SidebarFooter className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {userProfile.avatarUrl ? (
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
              ) : null}
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                {userProfile.initials || userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{userProfile.name}</p>
              <p className="text-xs text-gray-500 truncate">{userProfile.role}{userProfile.focus ? ` • ${userProfile.focus}` : ''}</p>
              {userProfile.status && (
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${userProfile.status === 'online' ? 'bg-green-500' : userProfile.status === 'away' ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                  <span className="text-xs text-gray-500 capitalize">{userProfile.status}</span>
                </div>
              )}
            </div>
            {onLogout && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onLogout}>
                <LogOut className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};