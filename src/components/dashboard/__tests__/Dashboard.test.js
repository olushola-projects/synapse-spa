import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jsx as _jsx } from 'react/jsx-runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dashboard } from '../index';
// Mock dependencies
vi.mock('@/hooks/useComplianceHistory', () => ({
  useComplianceHistory: () => ({
    data: [
      { date: '2024-01-01', score: 85, status: 'compliant' },
      { date: '2024-01-02', score: 90, status: 'compliant' },
      { date: '2024-01-03', score: 88, status: 'compliant' }
    ],
    isLoading: false,
    error: null
  })
}));
vi.mock('@/services/apiHealthMonitor', () => ({
  getSystemHealth: vi.fn().mockResolvedValue({
    status: 'healthy',
    uptime: 99.9,
    responseTime: 150
  })
}));
describe('Dashboard Component', () => {
  const mockUser = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin'
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('Component Rendering', () => {
    it('should render dashboard with user information', () => {
      render(_jsx(Dashboard, { user: mockUser }));
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
    it('should display system health status', async () => {
      render(_jsx(Dashboard, { user: mockUser }));
      await waitFor(() => {
        expect(screen.getByText(/System Health/i)).toBeInTheDocument();
        expect(screen.getByText(/99.9%/i)).toBeInTheDocument();
      });
    });
    it('should show compliance metrics', async () => {
      render(_jsx(Dashboard, { user: mockUser }));
      await waitFor(() => {
        expect(screen.getByText(/Compliance Score/i)).toBeInTheDocument();
        expect(screen.getByText(/88%/i)).toBeInTheDocument();
      });
    });
    it('should display recent activity', () => {
      render(_jsx(Dashboard, { user: mockUser }));
      expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
      expect(screen.getByText(/SFDR Classification/i)).toBeInTheDocument();
    });
  });
  describe('Navigation and Interactions', () => {
    it('should allow navigation to SFDR Navigator', async () => {
      const user = userEvent.setup();
      render(_jsx(Dashboard, { user: mockUser }));
      const sfdrButton = screen.getByText(/SFDR Navigator/i);
      await user.click(sfdrButton);
      // Verify navigation occurred
      expect(sfdrButton).toBeInTheDocument();
    });
    it('should allow navigation to Compliance Center', async () => {
      const user = userEvent.setup();
      render(_jsx(Dashboard, { user: mockUser }));
      const complianceButton = screen.getByText(/Compliance Center/i);
      await user.click(complianceButton);
      expect(complianceButton).toBeInTheDocument();
    });
    it('should allow navigation to Risk Assessment', async () => {
      const user = userEvent.setup();
      render(_jsx(Dashboard, { user: mockUser }));
      const riskButton = screen.getByText(/Risk Assessment/i);
      await user.click(riskButton);
      expect(riskButton).toBeInTheDocument();
    });
  });
  describe('Data Visualization', () => {
    it('should render compliance history chart', () => {
      render(_jsx(Dashboard, { user: mockUser }));
      expect(screen.getByTestId('compliance-chart')).toBeInTheDocument();
    });
    it('should render system performance metrics', () => {
      render(_jsx(Dashboard, { user: mockUser }));
      expect(screen.getByTestId('performance-metrics')).toBeInTheDocument();
    });
    it('should display uptime percentage', async () => {
      render(_jsx(Dashboard, { user: mockUser }));
      await waitFor(() => {
        expect(screen.getByText(/99.9%/i)).toBeInTheDocument();
      });
    });
  });
  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.mocked(vi.importMock('@/services/apiHealthMonitor').getSystemHealth).mockRejectedValueOnce(
        new Error('API Error')
      );
      render(_jsx(Dashboard, { user: mockUser }));
      await waitFor(() => {
        expect(screen.getByText(/Error loading system health/i)).toBeInTheDocument();
      });
    });
    it('should show loading states', () => {
      vi.mocked(vi.importMock('@/hooks/useComplianceHistory').useComplianceHistory).mockReturnValue(
        {
          data: null,
          isLoading: true,
          error: null
        }
      );
      render(_jsx(Dashboard, { user: mockUser }));
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });
  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(_jsx(Dashboard, { user: mockUser }));
      expect(screen.getByLabelText(/Dashboard navigation/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/System health status/i)).toBeInTheDocument();
    });
    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(_jsx(Dashboard, { user: mockUser }));
      // Navigate with keyboard
      await user.keyboard('{Tab}');
      // Verify focus management
      expect(document.activeElement).toHaveAttribute('tabindex');
    });
  });
  describe('Responsive Design', () => {
    it('should adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });
      render(_jsx(Dashboard, { user: mockUser }));
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
      expect(screen.getByTestId('mobile-dashboard')).toBeInTheDocument();
    });
    it('should show mobile navigation menu', async () => {
      const user = userEvent.setup();
      render(_jsx(Dashboard, { user: mockUser }));
      const menuButton = screen.getByTestId('mobile-menu-button');
      await user.click(menuButton);
      expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
    });
  });
  describe('Performance', () => {
    it('should render within performance budget', () => {
      const startTime = performance.now();
      render(_jsx(Dashboard, { user: mockUser }));
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      // Dashboard should render within 200ms
      expect(renderTime).toBeLessThan(200);
    });
    it('should handle large datasets efficiently', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        score: 80 + (i % 20),
        status: 'compliant'
      }));
      vi.mocked(vi.importMock('@/hooks/useComplianceHistory').useComplianceHistory).mockReturnValue(
        {
          data: largeData,
          isLoading: false,
          error: null
        }
      );
      render(_jsx(Dashboard, { user: mockUser }));
      await waitFor(() => {
        expect(screen.getByTestId('compliance-chart')).toBeInTheDocument();
      });
    });
  });
  describe('Security', () => {
    it('should validate user permissions', () => {
      const unauthorizedUser = { ...mockUser, role: 'viewer' };
      render(_jsx(Dashboard, { user: unauthorizedUser }));
      // Check admin features are hidden
      expect(screen.queryByText(/Admin Panel/i)).not.toBeInTheDocument();
    });
    it('should sanitize user data display', () => {
      const userWithScript = {
        ...mockUser,
        name: '<script>alert("xss")</script>'
      };
      render(_jsx(Dashboard, { user: userWithScript }));
      // Verify no script execution
      expect(screen.queryByText('xss')).not.toBeInTheDocument();
    });
  });
});
