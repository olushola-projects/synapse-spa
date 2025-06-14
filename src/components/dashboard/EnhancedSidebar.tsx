import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Shield,
  Target,
  Users,
  Zap,
  Bell,
  User,
  LogOut,
  Crown
} from 'lucide-react';

// Define interfaces for sidebar navigation items
interface SidebarNavItem {
  id: string;
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isNew?: boolean;
  subItems?: SidebarNavSubItem[];
}

interface SidebarNavSubItem {
  id: string;
  title: string;
  url: string;
  badge?: string;
  isNew?: boolean;
}

interface EnhancedSidebarProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  className?: string;
  showUserProfile?: boolean;
  showProgress?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  completionProgress?: number;
  items?: SidebarNavItem[];
  onItemClick?: (item: SidebarNavItem) => void;
  onSubItemClick?: (subItem: SidebarNavSubItem) => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const defaultNavItems: SidebarNavItem[] = [
  {
    id: 'home',
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    id: 'companies',
    title: 'Companies',
    url: '/companies',
    icon: Building2,
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    id: 'regulatory',
    title: 'Regulatory',
    url: '/regulatory',
    icon: Shield,
    subItems: [
      { id: 'calendar', title: 'Calendar', url: '/regulatory/calendar' },
      { id: 'reports', title: 'Reports', url: '/regulatory/reports' },
      { id: 'analytics', title: 'Analytics', url: '/regulatory/analytics' }
    ]
  },
  {
    id: 'compliance',
    title: 'Compliance',
    url: '/compliance',
    icon: Target,
    badge: '3',
    subItems: [
      { id: 'tasks', title: 'Tasks', url: '/compliance/tasks', badge: '5' },
      { id: 'audit', title: 'Audit Trail', url: '/compliance/audit' },
      { id: 'frameworks', title: 'Frameworks', url: '/compliance/frameworks' }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
  },
  {
    id: 'agents',
    title: 'AI Agents',
    url: '/agents',
    icon: Zap,
    isNew: true,
  },
  {
    id: 'community',
    title: 'Community',
    url: '/community',
    icon: Users,
  },
  {
    id: 'documents',
    title: 'Documents',
    url: '/documents',
    icon: FileText,
  },
  {
    id: 'calendar',
    title: 'Calendar',
    url: '/calendar',
    icon: Calendar,
  },
  {
    id: 'messages',
    title: 'Messages',
    url: '/messages',
    icon: MessageSquare,
    badge: '2',
  },
];

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  userName = "Alex Morgan",
  userRole = "GRC Analyst",
  userAvatar,
  className = "",
  showUserProfile = true,
  showProgress = true,
  showNotifications = true,
  notificationCount = 0,
  completionProgress = 68,
  items = defaultNavItems,
  onItemClick,
  onSubItemClick,
  onProfileClick,
  onSettingsClick,
  onLogoutClick
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['regulatory', 'compliance']);
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActiveItem = (item: SidebarNavItem) => {
    if (location.pathname === item.url) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.url);
    }
    return false;
  };

  const isActiveSubItem = (subItem: SidebarNavSubItem) => {
    return location.pathname === subItem.url;
  };

  const handleItemClick = (item: SidebarNavItem) => {
    if (item.subItems) {
      toggleExpanded(item.id);
    }
    onItemClick?.(item);
  };

  const handleSubItemClick = (subItem: SidebarNavSubItem) => {
    onSubItemClick?.(subItem);
  };

  return (
    <Sidebar className={className} collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        {/* User Profile Section */}
        {showUserProfile && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userName}
                    </p>
                    <Crown className="h-3 w-3 text-amber-500" />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{userRole}</p>
                </div>
              )}
              {showNotifications && notificationCount > 0 && (
                <div className="relative">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {notificationCount}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Section */}
            {showProgress && !isCollapsed && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium text-gray-900">{completionProgress}%</span>
                </div>
                <Progress value={completionProgress} className="h-1.5" />
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-auto">
          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <div>
                        {item.subItems ? (
                          <Button
                            variant="ghost"
                            className={`w-full justify-start gap-2 ${
                              isActiveItem(item) 
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => handleItemClick(item)}
                          >
                            <item.icon className="h-4 w-4" />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 text-left">{item.title}</span>
                                <div className="flex items-center gap-1">
                                  {item.badge && (
                                    <span className="text-xs font-medium">
                                      {item.badge}
                                    </span>
                                  )}
                                  {item.isNew && (
                                    <span className="text-xs font-medium text-green-600">
                                      NEW
                                    </span>
                                  )}
                                  {expandedItems.includes(item.id) ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                </div>
                              </>
                            )}
                          </Button>
                        ) : (
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              `flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                                isActive 
                                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`
                            }
                            onClick={() => handleItemClick(item)}
                          >
                            <item.icon className="h-4 w-4" />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1">{item.title}</span>
                                <div className="flex items-center gap-1">
                                  {item.badge && (
                                    <span className="text-xs font-medium">
                                      {item.badge}
                                    </span>
                                  )}
                                  {item.isNew && (
                                    <span className="text-xs font-medium text-green-600">
                                      NEW
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </NavLink>
                        )}

                        {/* Sub Items */}
                        {item.subItems && expandedItems.includes(item.id) && !isCollapsed && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.subItems.map((subItem) => (
                              <NavLink
                                key={subItem.id}
                                to={subItem.url}
                                className={({ isActive }) =>
                                  `flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                                    isActive 
                                      ? 'bg-blue-50 text-blue-700' 
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`
                                }
                                onClick={() => handleSubItemClick(subItem)}
                              >
                                <span>{subItem.title}</span>
                                <div className="flex items-center gap-1">
                                  {subItem.badge && (
                                    <span className="text-[10px] font-medium">
                                      {subItem.badge}
                                    </span>
                                  )}
                                  {subItem.isNew && (
                                    <span className="text-[10px] font-medium text-green-600">
                                      NEW
                                    </span>
                                  )}
                                </div>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-gray-700"
            onClick={onSettingsClick}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span>Settings</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-gray-700"
            onClick={onLogoutClick}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default EnhancedSidebar;
export type { SidebarNavItem, SidebarNavSubItem, EnhancedSidebarProps };
