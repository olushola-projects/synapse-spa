
import React, { useState, ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EnhancedSidebar, SidebarNavItem, QuickAction, UserProfile } from './EnhancedSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Bell,
  MessageSquare,
  HelpCircle,
  Settings,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Zap,
  Clock,
  Target,
  LayoutDashboard,
  Bot,
  CheckSquare,
  Calendar,
  Trophy,
  Users,
  Shield,
  FileText
} from 'lucide-react';

interface EnhancedDashboardLayoutProps {
  children: ReactNode;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  appName?: string;
  appBadge?: string;
  logo?: ReactNode;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onMessagesClick?: () => void;
  onHelpClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  notificationCount?: number;
  messageCount?: number;
  customTopBarContent?: ReactNode;
  customSidebarItems?: SidebarNavItem[];
  customQuickActions?: QuickAction[];
  customUserProfile?: UserProfile;
  showPromoBar?: boolean;
  promoBarContent?: ReactNode;
  className?: string;
}

export const EnhancedDashboardLayout: React.FC<EnhancedDashboardLayoutProps> = ({
  children,
  userName = 'User',
  userRole = 'Analyst',
  userAvatar,
  appName = 'Synapses',
  appBadge = 'ESG Pro',
  logo,
  onSearch,
  onNotificationsClick,
  onMessagesClick,
  onHelpClick,
  onSettingsClick,
  onLogout,
  notificationCount = 0,
  messageCount = 0,
  customTopBarContent,
  customSidebarItems,
  customQuickActions,
  customUserProfile,
  showPromoBar = false,
  promoBarContent,
  className = ''
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Default navigation items if not provided
  const defaultNavigationItems: SidebarNavItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'agents',
      title: 'Agent Gallery',
      url: '/agents',
      icon: Bot,
      badge: '5 New',
      subItems: [
        { id: 'sfdr-agents', title: 'SFDR Agents', url: '/agents/sfdr' },
        { id: 'csrd-agents', title: 'CSRD Agents', url: '/agents/csrd' },
        { id: 'taxonomy', title: 'Taxonomy', url: '/agents/taxonomy' }
      ]
    },
    {
      id: 'tasks',
      title: 'Smart Tasks',
      url: '/tasks',
      icon: CheckSquare,
      badge: '7',
      subItems: [
        { id: 'high-priority', title: 'High Priority', url: '/tasks/high-priority' },
        { id: 'in-review', title: 'In Review', url: '/tasks/in-review' },
        { id: 'ai-drafted', title: 'AI-Drafted', url: '/tasks/ai-drafted' }
      ]
    },
    {
      id: 'calendar',
      title: 'Regulatory Calendar',
      url: '/calendar',
      icon: Calendar,
      badge: 'Today',
      subItems: [
        { id: 'sfdr-deadlines', title: 'SFDR Deadlines', url: '/calendar/sfdr' },
        { id: 'csrd-updates', title: 'CSRD Updates', url: '/calendar/csrd' }
      ]
    },
    {
      id: 'badges',
      title: 'Achievement Hub',
      url: '/badges',
      icon: Trophy,
      subItems: [
        { id: 'progress', title: 'Progress', url: '/badges/progress' },
        { id: 'streaks', title: 'Streaks', url: '/badges/streaks' }
      ]
    },
    {
      id: 'team',
      title: 'Collaboration',
      url: '/team',
      icon: Users,
      subItems: [
        { id: 'live-activity', title: 'Live Activity', url: '/team/activity' },
        { id: 'shared-vault', title: 'Shared Vault', url: '/team/vault' },
        { id: 'approvals', title: 'Approvals', url: '/team/approvals' }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance Center',
      url: '/compliance',
      icon: Shield,
      subItems: [
        { id: 'reports', title: 'Reports', url: '/compliance/reports' },
        { id: 'audits', title: 'Audits', url: '/compliance/audits' }
      ]
    },
    {
      id: 'documents',
      title: 'Document Library',
      url: '/documents',
      icon: FileText,
      subItems: [
        { id: 'templates', title: 'Templates', url: '/documents/templates' },
        { id: 'policies', title: 'Policies', url: '/documents/policies' }
      ]
    }
  ];

  // Default quick actions if not provided
  const defaultQuickActions: QuickAction[] = [
    { icon: Zap, label: 'Horizon Scan', shortcut: '⌘H' },
    { icon: Target, label: 'SFDR Task', shortcut: '⌘S' },
    { icon: Clock, label: 'Risk Check', shortcut: '⌘R' }
  ];

  // Default user profile if not provided
  const defaultUserProfile: UserProfile = {
    name: userName,
    role: userRole,
    focus: 'EU Focus',
    avatarUrl: userAvatar,
    initials: userName.split(' ').map(n => n[0]).join(''),
    status: 'online'
  };

  // Use custom items or defaults
  const navigationItems = customSidebarItems || defaultNavigationItems;
  const quickActions = customQuickActions || defaultQuickActions;
  const userProfile = customUserProfile || defaultUserProfile;

  // Default promo bar content if not provided
  const defaultPromoBarContent = (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">New SFDR reporting templates available</span>
          <Badge variant="outline" className="bg-white/20 text-white border-white/40 hover:bg-white/30">
            New
          </Badge>
        </div>
        <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
          View Now
        </Button>
      </div>
    </div>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`min-h-screen flex flex-col w-full bg-gray-50 ${className}`}>
        {/* Promo Bar */}
        {showPromoBar && (
          <div className="w-full">
            {promoBarContent || defaultPromoBarContent}
          </div>
        )}
        
        {/* Main Layout with Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block">
            <EnhancedSidebar
              items={navigationItems}
              userName={userName}
              userRole={userRole}
              userAvatar={userAvatar}
              onSettingsClick={onSettingsClick}
              onLogoutClick={onLogout}
              className="h-screen overflow-y-auto"
            />
          </div>
          
          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="md:hidden fixed top-4 left-4 z-50">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-white shadow-sm"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Sidebar - Only visible when menu is open */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="absolute top-0 left-0 h-full w-3/4 max-w-xs" onClick={(e) => e.stopPropagation()}>
                <EnhancedSidebar
                  items={navigationItems}
                  userName={userName}
                  userRole={userRole}
                  userAvatar={userAvatar}
                  onSettingsClick={onSettingsClick}
                  onLogoutClick={onLogout}
                  className="h-screen overflow-y-auto"
                />
              </div>
            </div>
          )}
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 flex items-center justify-between">
              {customTopBarContent ? (
                customTopBarContent
              ) : (
                <>
                  {/* Left side - Search (hidden on mobile) */}
                  <div className="hidden md:block w-72">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Right side - User menu and actions */}
                  <div className="flex items-center space-x-3">
                    <TooltipProvider>
                      {/* Notifications */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="relative" onClick={onNotificationsClick}>
                            <Bell className="h-5 w-5 text-gray-600" />
                            {notificationCount > 0 && (
                              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                                {notificationCount > 9 ? '9+' : notificationCount}
                              </span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Notifications</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Messages */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="relative" onClick={onMessagesClick}>
                            <MessageSquare className="h-5 w-5 text-gray-600" />
                            {messageCount > 0 && (
                              <span className="absolute top-0 right-0 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                                {messageCount > 9 ? '9+' : messageCount}
                              </span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Messages</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Help */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={onHelpClick}>
                            <HelpCircle className="h-5 w-5 text-gray-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Help & Resources</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Settings */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
                            <Settings className="h-5 w-5 text-gray-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Settings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Separator orientation="vertical" className="h-6" />

                    {/* User Menu */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-2"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      >
                        <Avatar className="h-8 w-8">
                          {userAvatar ? (
                            <AvatarImage src={userAvatar} alt={userName} />
                          ) : null}
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                            {userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block text-left">
                          <p className="text-sm font-medium text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-500">{userRole}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </Button>

                      {/* User Dropdown Menu */}
                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{userName}</p>
                            <p className="text-xs text-gray-500">{userRole}</p>
                          </div>
                          <div className="py-1">
                            <Button variant="ghost" className="w-full justify-start text-sm px-4 py-2">
                              <User className="h-4 w-4 mr-2" />
                              Profile
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-sm px-4 py-2">
                              <Settings className="h-4 w-4 mr-2" />
                              Settings
                            </Button>
                          </div>
                          <div className="py-1 border-t border-gray-100">
                            <Button variant="ghost" className="w-full justify-start text-sm px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onLogout}>
                              <LogOut className="h-4 w-4 mr-2" />
                              Sign out
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </header>
            
            {/* Dashboard Content */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
