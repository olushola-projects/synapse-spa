import { LayoutDashboard, MessageSquare, Settings, Users, Target, Bot } from 'lucide-react';

// Navigation items shared between sidebar and mobile navigation
export const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Bot, label: 'SFDR Agent', href: '/nexus-agent' },
  {
    icon: MessageSquare,
    label: 'SFDR Navigator',
    href: '/nexus-agent',
    badge: 'Beta',
    accessModes: ['chat', 'forms', 'uploads']
  },
  { icon: Target, label: 'Use Cases', href: '/use-cases' },
  { icon: Users, label: 'Partners', href: '/partners' },
  { icon: Settings, label: 'Settings', href: '/profile' }
];
