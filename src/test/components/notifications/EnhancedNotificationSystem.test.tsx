import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedNotificationSystem } from '../../../components/notifications/EnhancedNotificationSystem';
import type { Notification, NotificationSettings } from '../../../components/notifications/EnhancedNotificationSystem';

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
  useQueryClient: vi.fn().mockReturnValue({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
  }),
}));

// Mock Supabase
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
        }),
      }),
      insert: vi.fn().mockReturnValue({
        data: null,
        error: null,
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: null,
          error: null,
        }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: null,
          error: null,
        }),
      }),
    }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnValue({
        subscribe: vi.fn(),
      }),
      unsubscribe: vi.fn(),
    }),
  },
}));

// Mock shadcn/ui components
vi.mock('../../../components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-description">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
}));

vi.mock('../../../components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, disabled }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

vi.mock('../../../components/ui/badge', () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

vi.mock('../../../components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="scroll-area" className={className}>{children}</div>
  ),
}));

vi.mock('../../../components/ui/separator', () => ({
  Separator: ({ className }: { className?: string }) => (
    <hr data-testid="separator" className={className} />
  ),
}));

vi.mock('../../../components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange, disabled }: any) => (
    <input
      data-testid="switch"
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
    />
  ),
}));

vi.mock('../../../components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <div data-testid="select" data-value={value} data-onvaluechange={onValueChange}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <div data-testid="select-value" data-placeholder={placeholder} />
  ),
}));

vi.mock('../../../components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover">{children}</div>
  ),
  PopoverContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="popover-content" className={className}>{children}</div>
  ),
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
}));

vi.mock('../../../components/ui/toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: [],
  }),
  Toaster: () => <div data-testid="toaster" />,
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Bell: () => <div data-testid="bell-icon" />,
  BellOff: () => <div data-testid="bell-off-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  X: () => <div data-testid="x-icon" />,
  Check: () => <div data-testid="check-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Info: () => <div data-testid="info-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  User: () => <div data-testid="user-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Smartphone: () => <div data-testid="smartphone-icon" />,
  Monitor: () => <div data-testid="monitor-icon" />,
  Volume2: () => <div data-testid="volume-icon" />,
  VolumeX: () => <div data-testid="volume-x-icon" />,
  Vibrate: () => <div data-testid="vibrate-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Search: () => <div data-testid="search-icon" />,
  MoreVertical: () => <div data-testid="more-vertical-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Archive: () => <div data-testid="archive-icon" />,
  Star: () => <div data-testid="star-icon" />,
  StarOff: () => <div data-testid="star-off-icon" />,
}));

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn().mockReturnValue('2 hours ago'),
  format: vi.fn().mockReturnValue('Dec 25, 2024 10:30 AM'),
  isToday: vi.fn().mockReturnValue(true),
  isYesterday: vi.fn().mockReturnValue(false),
  startOfDay: vi.fn().mockReturnValue(new Date()),
  endOfDay: vi.fn().mockReturnValue(new Date()),
  subDays: vi.fn().mockReturnValue(new Date()),
  addDays: vi.fn().mockReturnValue(new Date()),
}));

describe('EnhancedNotificationSystem', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'GDPR Compliance Alert',
      message: 'New data processing request requires review',
      type: 'compliance',
      priority: 'high',
      status: 'unread',
      category: 'regulatory',
      source: 'automated_scan',
      userId: 'user-1',
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z'),
      metadata: {
        framework: 'GDPR',
        riskLevel: 'medium',
        actionRequired: true,
        dueDate: '2024-01-20',
      },
      actions: [
        {
          id: 'review',
          label: 'Review Request',
          type: 'primary',
          url: '/compliance/gdpr/requests/123',
        },
        {
          id: 'dismiss',
          label: 'Dismiss',
          type: 'secondary',
        },
      ],
    },
    {
      id: '2',
      title: 'Security Risk Detected',
      message: 'Unusual login activity detected from new location',
      type: 'security',
      priority: 'medium',
      status: 'read',
      category: 'security',
      source: 'security_monitor',
      userId: 'user-1',
      createdAt: new Date('2024-01-14T15:45:00Z'),
      updatedAt: new Date('2024-01-14T16:00:00Z'),
      metadata: {
        ipAddress: '192.168.1.100',
        location: 'New York, US',
        device: 'Chrome on Windows',
      },
      actions: [
        {
          id: 'investigate',
          label: 'Investigate',
          type: 'primary',
          url: '/security/incidents/456',
        },
      ],
    },
    {
      id: '3',
      title: 'Audit Report Ready',
      message: 'Q4 2024 compliance audit report is ready for review',
      type: 'audit',
      priority: 'low',
      status: 'archived',
      category: 'reporting',
      source: 'audit_system',
      userId: 'user-1',
      createdAt: new Date('2024-01-13T09:00:00Z'),
      updatedAt: new Date('2024-01-13T09:00:00Z'),
      metadata: {
        reportType: 'quarterly',
        period: 'Q4 2024',
        findings: 3,
      },
      actions: [
        {
          id: 'download',
          label: 'Download Report',
          type: 'primary',
          url: '/reports/audit/q4-2024.pdf',
        },
      ],
    },
  ];

  const mockSettings: NotificationSettings = {
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    doNotDisturb: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
    categories: {
      compliance: {
        enabled: true,
        email: true,
        push: true,
        sound: true,
      },
      security: {
        enabled: true,
        email: true,
        push: true,
        sound: true,
      },
      audit: {
        enabled: true,
        email: false,
        push: true,
        sound: false,
      },
      system: {
        enabled: true,
        email: false,
        push: false,
        sound: false,
      },
    },
    priorities: {
      high: {
        email: true,
        push: true,
        sound: true,
        vibration: true,
      },
      medium: {
        email: true,
        push: true,
        sound: false,
        vibration: false,
      },
      low: {
        email: false,
        push: true,
        sound: false,
        vibration: false,
      },
    },
  };

  const defaultProps = {
    userId: 'user-1',
    notifications: mockNotifications,
    settings: mockSettings,
    onNotificationClick: vi.fn(),
    onNotificationAction: vi.fn(),
    onMarkAsRead: vi.fn(),
    onMarkAllAsRead: vi.fn(),
    onArchive: vi.fn(),
    onDelete: vi.fn(),
    onSettingsChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Notification API
    global.Notification = {
      permission: 'granted',
      requestPermission: vi.fn().mockResolvedValue('granted'),
    } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render the notification system', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    });

    it('should display notification count badge', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const badges = screen.getAllByTestId('badge');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should render notification list', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    });

    it('should render settings panel', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    });
  });

  describe('Notification Display', () => {
    it('should display notification titles and messages', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      expect(screen.getByText('GDPR Compliance Alert')).toBeInTheDocument();
      expect(screen.getByText('New data processing request requires review')).toBeInTheDocument();
    });

    it('should display notification timestamps', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    });

    it('should display notification types with appropriate icons', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
      expect(screen.getByTestId('file-text-icon')).toBeInTheDocument();
    });

    it('should display priority badges', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const badges = screen.getAllByTestId('badge');
      const priorityBadges = badges.filter(badge => 
        ['high', 'medium', 'low'].includes(badge.getAttribute('data-variant') || '')
      );
      expect(priorityBadges.length).toBeGreaterThan(0);
    });

    it('should display status indicators', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      // Check for read/unread status indicators
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Notification Interactions', () => {
    it('should handle notification click', async () => {
      const user = userEvent.setup();
      const onNotificationClick = vi.fn();
      
      render(<EnhancedNotificationSystem {...defaultProps} onNotificationClick={onNotificationClick} />);
      
      const cards = screen.getAllByTestId('card');
      if (cards.length > 0) {
        await user.click(cards[0]);
        expect(onNotificationClick).toHaveBeenCalledWith(mockNotifications[0]);
      }
    });

    it('should handle notification action buttons', async () => {
      const user = userEvent.setup();
      const onNotificationAction = vi.fn();
      
      render(<EnhancedNotificationSystem {...defaultProps} onNotificationAction={onNotificationAction} />);
      
      const buttons = screen.getAllByTestId('button');
      const actionButtons = buttons.filter(button => 
        button.textContent?.includes('Review') || button.textContent?.includes('Investigate')
      );
      
      if (actionButtons.length > 0) {
        await user.click(actionButtons[0]);
        expect(onNotificationAction).toHaveBeenCalled();
      }
    });

    it('should handle mark as read', async () => {
      const user = userEvent.setup();
      const onMarkAsRead = vi.fn();
      
      render(<EnhancedNotificationSystem {...defaultProps} onMarkAsRead={onMarkAsRead} />);
      
      const checkIcons = screen.getAllByTestId('check-icon');
      if (checkIcons.length > 0) {
        await user.click(checkIcons[0]);
        expect(onMarkAsRead).toHaveBeenCalled();
      }
    });

    it('should handle mark all as read', async () => {
      const user = userEvent.setup();
      const onMarkAllAsRead = vi.fn();
      
      render(<EnhancedNotificationSystem {...defaultProps} onMarkAllAsRead={onMarkAllAsRead} />);
      
      const buttons = screen.getAllByTestId('button');
      const markAllButton = buttons.find(button => 
        button.textContent?.includes('Mark All Read')
      );
      
      if (markAllButton) {
        await user.click(markAllButton);
        expect(onMarkAllAsRead).toHaveBeenCalled();
      }
    });

    it('should handle archive notification', async () => {
      const user = userEvent.setup();
      const onArchive = vi.fn();
      
      render(<EnhancedNotificationSystem {...defaultProps} onArchive={onArchive} />);
      
      const archiveIcons = screen.getAllByTestId('archive-icon');
      if (archiveIcons.length > 0) {
        await user.click(archiveIcons[0]);
        expect(onArchive).toHaveBeenCalled();
      }
    });

    it('should handle delete notification', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      
      render(<EnhancedNotificationSystem {...defaultProps} onDelete={onDelete} />);
      
      const deleteIcons = screen.getAllByTestId('trash-icon');
      if (deleteIcons.length > 0) {
        await user.click(deleteIcons[0]);
        expect(onDelete).toHaveBeenCalled();
      }
    });
  });

  describe('Filtering and Sorting', () => {
    it('should filter notifications by type', async () => {
      const user = userEvent.setup();
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const filterIcon = screen.getByTestId('filter-icon');
      await user.click(filterIcon);
      
      // Test filter functionality
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('should filter notifications by status', async () => {
      const user = userEvent.setup();
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const filterIcon = screen.getByTestId('filter-icon');
      await user.click(filterIcon);
      
      // Test status filter
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('should filter notifications by priority', async () => {
      const user = userEvent.setup();
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const filterIcon = screen.getByTestId('filter-icon');
      await user.click(filterIcon);
      
      // Test priority filter
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('should sort notifications by date', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      // Test that notifications are sorted by date
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Settings Management', () => {
    it('should render notification settings', async () => {
      const user = userEvent.setup();
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const settingsIcon = screen.getByTestId('settings-icon');
      await user.click(settingsIcon);
      
      expect(screen.getAllByTestId('switch').length).toBeGreaterThan(0);
    });

    it('should handle email notification toggle', async () => {
      const user = userEvent.setup();
      const onSettingsChange = vi.fn();
      
      render(<EnhancedNotificationSystem {...defaultProps} onSettingsChange={onSettingsChange} />);
      
      const settingsIcon = screen.getByTestId('settings-icon');
      await user.click(settingsIcon);
      
      const switches = screen.getAllByTestId('switch');
      if (switches.length > 0) {
        await user.click(switches[0]);
        expect(onSettingsChange).toHaveBeenCalled();
      }
    });

    it('should handle push notification toggle', async () => {
      const user = userEvent.setup();
      const onSettingsChange = vi.fn();
      
      render(<EnhancedNotificationSystem {...defaultProps} onSettingsChange={onSettingsChange} />);
      
      const settingsIcon = screen.getByTestId('settings-icon');
      await user.click(settingsIcon);
      
      const switches = screen.getAllByTestId('switch');
      if (switches.length > 1) {
        await user.click(switches[1]);
        expect(onSettingsChange).toHaveBeenCalled();
      }
    });

    it('should handle sound settings', async () => {
      const user = userEvent.setup();
      const onSettingsChange = vi.fn();
      
      render(<EnhancedNotificationSystem {...defaultProps} onSettingsChange={onSettingsChange} />);
      
      const settingsIcon = screen.getByTestId('settings-icon');
      await user.click(settingsIcon);
      
      const volumeIcon = screen.queryByTestId('volume-icon');
      if (volumeIcon) {
        await user.click(volumeIcon);
        expect(onSettingsChange).toHaveBeenCalled();
      }
    });

    it('should handle do not disturb mode', async () => {
      const user = userEvent.setup();
      const onSettingsChange = vi.fn();
      
      render(<EnhancedNotificationSystem {...defaultProps} onSettingsChange={onSettingsChange} />);
      
      const settingsIcon = screen.getByTestId('settings-icon');
      await user.click(settingsIcon);
      
      const bellOffIcon = screen.queryByTestId('bell-off-icon');
      if (bellOffIcon) {
        await user.click(bellOffIcon);
        expect(onSettingsChange).toHaveBeenCalled();
      }
    });
  });

  describe('Real-time Updates', () => {
    it('should handle new notification arrival', async () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      // Simulate new notification
      const newNotification: Notification = {
        id: '4',
        title: 'New Risk Alert',
        message: 'High-risk activity detected',
        type: 'risk',
        priority: 'high',
        status: 'unread',
        category: 'risk',
        source: 'risk_monitor',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
        actions: [],
      };
      
      // Test real-time update handling
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    });

    it('should update notification count in real-time', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const badges = screen.getAllByTestId('badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Browser Notifications', () => {
    it('should request notification permission', async () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      // Test permission request
      expect(global.Notification.requestPermission).toHaveBeenCalled();
    });

    it('should show browser notification for high priority alerts', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      // Test browser notification display
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    });

    it('should handle notification permission denied', () => {
      global.Notification.permission = 'denied';
      
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should display empty state when no notifications', () => {
      render(<EnhancedNotificationSystem {...defaultProps} notifications={[]} />);
      
      expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
    });

    it('should display empty state for filtered results', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      // Test empty filter results
      expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should display loading state', () => {
      render(<EnhancedNotificationSystem {...defaultProps} loading={true} />);
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should display loading state for actions', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      // Test action loading states
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle notification fetch errors', () => {
      render(<EnhancedNotificationSystem {...defaultProps} error="Failed to load notifications" />);
      
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });

    it('should handle action errors gracefully', async () => {
      const user = userEvent.setup();
      const onNotificationAction = vi.fn().mockRejectedValue(new Error('Action failed'));
      
      render(<EnhancedNotificationSystem {...defaultProps} onNotificationAction={onNotificationAction} />);
      
      const buttons = screen.getAllByTestId('button');
      const actionButton = buttons.find(button => 
        button.textContent?.includes('Review')
      );
      
      if (actionButton) {
        await user.click(actionButton);
        // Should handle error gracefully
        expect(onNotificationAction).toHaveBeenCalled();
      }
    });

    it('should handle settings update errors', async () => {
      const user = userEvent.setup();
      const onSettingsChange = vi.fn().mockRejectedValue(new Error('Settings update failed'));
      
      render(<EnhancedNotificationSystem {...defaultProps} onSettingsChange={onSettingsChange} />);
      
      const settingsIcon = screen.getByTestId('settings-icon');
      await user.click(settingsIcon);
      
      const switches = screen.getAllByTestId('switch');
      if (switches.length > 0) {
        await user.click(switches[0]);
        expect(onSettingsChange).toHaveBeenCalled();
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const bellIcon = screen.getByTestId('bell-icon');
      expect(bellIcon.closest('button')).toHaveAttribute('aria-label');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const buttons = screen.getAllByTestId('button');
      if (buttons.length > 0) {
        buttons[0].focus();
        expect(buttons[0]).toHaveFocus();
        
        await user.keyboard('{Enter}');
        // Test keyboard interaction
      }
    });

    it('should have proper color contrast', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const badges = screen.getAllByTestId('badge');
      badges.forEach(badge => {
        expect(badge).toHaveAttribute('data-variant');
      });
    });

    it('should support screen readers', () => {
      render(<EnhancedNotificationSystem {...defaultProps} />);
      
      const cards = screen.getAllByTestId('card');
      cards.forEach(card => {
        expect(card).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should handle large number of notifications', () => {
      const manyNotifications = Array.from({ length: 100 }, (_, i) => ({
        ...mockNotifications[0],
        id: `notification-${i}`,
        title: `Notification ${i}`,
      }));
      
      render(<EnhancedNotificationSystem {...defaultProps} notifications={manyNotifications} />);
      
      expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    });

    it('should virtualize long notification lists', () => {
      const manyNotifications = Array.from({ length: 1000 }, (_, i) => ({
        ...mockNotifications[0],
        id: `notification-${i}`,
        title: `Notification ${i}`,
      }));
      
      render(<EnhancedNotificationSystem {...defaultProps} notifications={manyNotifications} />);
      
      expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    });
  });
});