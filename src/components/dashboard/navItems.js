import { LayoutDashboard, Settings, Users, Target, Bot } from 'lucide-react';
// Navigation items shared between sidebar and mobile navigation
export const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    {
        icon: Bot,
        label: 'SFDR Navigator',
        href: '/sfdr-navigator',
        badge: 'Unified Platform',
        accessModes: ['chat', 'classify', 'documents', 'analytics', 'export']
    },
    { icon: Target, label: 'Use Cases', href: '/use-cases' },
    { icon: Users, label: 'Partners', href: '/partners' },
    { icon: Settings, label: 'Settings', href: '/profile' }
];
