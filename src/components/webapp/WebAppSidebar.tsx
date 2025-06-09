
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Bot, 
  CheckSquare, 
  Calendar, 
  Trophy, 
  Users, 
  Settings 
} from 'lucide-react';

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
    isActive: true
  },
  {
    title: "Agents",
    icon: Bot,
    id: "agents"
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    id: "tasks"
  },
  {
    title: "Calendar",
    icon: Calendar,
    id: "calendar"
  },
  {
    title: "Badges",
    icon: Trophy,
    id: "badges"
  },
  {
    title: "Team",
    icon: Users,
    id: "team"
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings"
  }
];

export const WebAppSidebar: React.FC = () => {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold text-blue-700">Synapses</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={item.isActive}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
