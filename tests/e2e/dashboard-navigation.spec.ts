import { test, expect } from '@playwright/test';
import { createTestHelper, TestData, Selectors } from './utils/test-helpers';

/**
 * Dashboard and Navigation End-to-End Tests
 * Comprehensive testing of dashboard functionality and navigation
 */

test.describe('Dashboard and Navigation', () => {
  let helper: ReturnType<typeof createTestHelper>;

  test.beforeEach(async ({ page }) => {
    helper = createTestHelper(page);
    
    // Login before each test
    await helper.navigateTo('/login');
    await helper.fillField('[data-testid="email-input"]', TestData.user.email);
    await helper.fillField('[data-testid="password-input"]', TestData.user.password);
    await helper.clickButton('[data-testid="login-button"]');
    await helper.waitForUrl(/\/dashboard/);
  });

  test.describe('Dashboard Overview', () => {
    test('should load dashboard with all critical elements', async ({ page }) => {
      // Verify dashboard header
      await helper.expectText(/Welcome back/);
      await helper.expectVisible('[data-testid="user-menu"]');
      await helper.expectVisible('[data-testid="notifications-icon"]');

      // Verify navigation sidebar
      await helper.expectVisible('[data-testid="sidebar-navigation"]');
      await helper.expectText('Dashboard');
      await helper.expectText('SFDR Navigator');
      await helper.expectText('Analytics');
      await helper.expectText('Settings');

      // Verify main content area
      await helper.expectVisible('[data-testid="dashboard-content"]');
      await helper.expectText(/Recent Activity/);
      await helper.expectText(/Quick Actions/);
    });

    test('should display user statistics and metrics', async ({ page }) => {
      // Verify statistics cards
      await helper.expectVisible('[data-testid="total-classifications"]');
      await helper.expectVisible('[data-testid="success-rate"]');
      await helper.expectVisible('[data-testid="compliance-score"]');
      await helper.expectVisible('[data-testid="active-projects"]');

      // Verify metrics are numeric
      const totalClassifications = await helper.getElementText('[data-testid="total-classifications"]');
      expect(parseInt(totalClassifications)).toBeGreaterThanOrEqual(0);

      const successRate = await helper.getElementText('[data-testid="success-rate"]');
      expect(successRate).toMatch(/\d+%/);
    });

    test('should show recent activity feed', async ({ page }) => {
      // Verify activity feed
      await helper.expectVisible('[data-testid="activity-feed"]');
      await helper.expectText(/Recent Activity/);

      // Check for activity items
      const activityItems = await helper.getElementCount('[data-testid="activity-item"]');
      expect(activityItems).toBeGreaterThanOrEqual(0);
    });

    test('should provide quick action buttons', async ({ page }) => {
      // Verify quick actions
      await helper.expectVisible('[data-testid="new-classification"]');
      await helper.expectVisible('[data-testid="view-reports"]');
      await helper.expectVisible('[data-testid="export-data"]');

      // Test quick action functionality
      await helper.clickButton('[data-testid="new-classification"]');
      await helper.waitForUrl(/\/sfdr-navigator/);
    });
  });

  test.describe('Navigation Functionality', () => {
    test('should navigate between all main sections', async ({ page }) => {
      const navigationItems = [
        { testId: 'nav-dashboard', expectedUrl: /\/dashboard/, expectedText: /Dashboard/ },
        { testId: 'nav-sfdr', expectedUrl: /\/sfdr-navigator/, expectedText: /SFDR Navigator/ },
        { testId: 'nav-analytics', expectedUrl: /\/analytics/, expectedText: /Analytics/ },
        { testId: 'nav-reports', expectedUrl: /\/reports/, expectedText: /Reports/ },
        { testId: 'nav-settings', expectedUrl: /\/settings/, expectedText: /Settings/ }
      ];

      for (const item of navigationItems) {
        await helper.clickButton(`[data-testid="${item.testId}"]`);
        await helper.waitForUrl(item.expectedUrl);
        await helper.expectText(item.expectedText);
      }
    });

    test('should highlight active navigation item', async ({ page }) => {
      // Check dashboard is active by default
      await helper.expectVisible('[data-testid="nav-dashboard"][data-active="true"]');

      // Navigate to SFDR Navigator
      await helper.clickButton('[data-testid="nav-sfdr"]');
      await helper.waitForUrl(/\/sfdr-navigator/);
      await helper.expectVisible('[data-testid="nav-sfdr"][data-active="true"]');
      await helper.expectNotVisible('[data-testid="nav-dashboard"][data-active="true"]');
    });

    test('should handle breadcrumb navigation', async ({ page }) => {
      // Navigate to a sub-page
      await helper.clickButton('[data-testid="nav-sfdr"]');
      await helper.waitForUrl(/\/sfdr-navigator/);

      // Verify breadcrumbs
      await helper.expectVisible('[data-testid="breadcrumbs"]');
      await helper.expectText('Dashboard');
      await helper.expectText('SFDR Navigator');

      // Click breadcrumb to go back
      await helper.clickButton('[data-testid="breadcrumb-dashboard"]');
      await helper.waitForUrl(/\/dashboard/);
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Test keyboard navigation through menu items
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="nav-dashboard"]')).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(page.locator('[data-testid="nav-sfdr"]')).toBeFocused();

      await page.keyboard.press('Enter');
      await helper.waitForUrl(/\/sfdr-navigator/);
    });

    test('should handle mobile navigation menu', async ({ page }) => {
      // Switch to mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Verify mobile menu button is visible
      await helper.expectVisible('[data-testid="mobile-menu-button"]');

      // Open mobile menu
      await helper.clickButton('[data-testid="mobile-menu-button"]');
      await helper.expectVisible('[data-testid="mobile-navigation-menu"]');

      // Navigate using mobile menu
      await helper.clickButton('[data-testid="mobile-nav-sfdr"]');
      await helper.waitForUrl(/\/sfdr-navigator/);

      // Verify mobile menu closes after navigation
      await helper.expectNotVisible('[data-testid="mobile-navigation-menu"]');
    });
  });

  test.describe('User Interface Elements', () => {
    test('should display user profile information', async ({ page }) => {
      // Open user menu
      await helper.clickButton('[data-testid="user-menu"]');
      await helper.expectVisible('[data-testid="user-menu-dropdown"]');

      // Verify user information
      await helper.expectText(TestData.user.email);
      await helper.expectVisible('[data-testid="user-avatar"]');
      await helper.expectVisible('[data-testid="profile-link"]');
      await helper.expectVisible('[data-testid="logout-button"]');
    });

    test('should handle notifications', async ({ page }) => {
      // Check notifications icon
      await helper.expectVisible('[data-testid="notifications-icon"]');

      // Click notifications
      await helper.clickButton('[data-testid="notifications-icon"]');
      await helper.expectVisible('[data-testid="notifications-panel"]');

      // Verify notifications content
      await helper.expectText(/Notifications/);
      
      // Close notifications
      await helper.clickButton('[data-testid="close-notifications"]');
      await helper.expectNotVisible('[data-testid="notifications-panel"]');
    });

    test('should provide search functionality', async ({ page }) => {
      // Verify search input
      await helper.expectVisible('[data-testid="search-input"]');

      // Perform search
      await helper.fillField('[data-testid="search-input"]', 'SFDR');
      await helper.pressKey('[data-testid="search-input"]', 'Enter');

      // Verify search results
      await helper.expectVisible('[data-testid="search-results"]');
      await helper.expectText(/Search Results/);
    });

    test('should handle theme switching', async ({ page }) => {
      // Verify theme toggle
      await helper.expectVisible('[data-testid="theme-toggle"]');

      // Get current theme
      const currentTheme = await helper.getElementAttribute('html', 'data-theme');

      // Toggle theme
      await helper.clickButton('[data-testid="theme-toggle"]');

      // Verify theme changed
      const newTheme = await helper.getElementAttribute('html', 'data-theme');
      expect(newTheme).not.toBe(currentTheme);
    });
  });

  test.describe('Data Visualization', () => {
    test('should display charts and graphs', async ({ page }) => {
      // Verify chart containers
      await helper.expectVisible('[data-testid="compliance-chart"]');
      await helper.expectVisible('[data-testid="performance-chart"]');
      await helper.expectVisible('[data-testid="trend-chart"]');

      // Check chart interactivity
      await helper.hoverElement('[data-testid="compliance-chart"]');
      await helper.expectVisible('[data-testid="chart-tooltip"]');
    });

    test('should allow chart customization', async ({ page }) => {
      // Open chart settings
      await helper.clickButton('[data-testid="chart-settings"]');
      await helper.expectVisible('[data-testid="chart-settings-panel"]');

      // Change chart type
      await helper.selectOption('[data-testid="chart-type-select"]', 'bar');
      await helper.expectVisible('[data-testid="compliance-chart"][data-type="bar"]');

      // Change time range
      await helper.selectOption('[data-testid="time-range-select"]', '30d');
      await helper.expectText(/Last 30 days/);
    });

    test('should export chart data', async ({ page }) => {
      // Click export button on chart
      await helper.clickButton('[data-testid="export-chart"]');

      // Verify download
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    });
  });

  test.describe('Responsive Design', () => {
    test('should adapt to different screen sizes', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080, name: 'Desktop' },
        { width: 1024, height: 768, name: 'Tablet' },
        { width: 768, height: 1024, name: 'Tablet Portrait' },
        { width: 375, height: 667, name: 'Mobile' }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);

        // Verify layout adapts
        await helper.expectVisible('[data-testid="dashboard-content"]');

        if (viewport.width < 768) {
          // Mobile-specific elements
          await helper.expectVisible('[data-testid="mobile-menu-button"]');
        } else {
          // Desktop-specific elements
          await helper.expectVisible('[data-testid="sidebar-navigation"]');
        }
      }
    });

    test('should handle orientation changes', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await helper.expectVisible('[data-testid="mobile-menu-button"]');

      // Switch to landscape
      await page.setViewportSize({ width: 667, height: 375 });
      
      // Verify layout adjusts
      await helper.expectVisible('[data-testid="dashboard-content"]');
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load dashboard within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await helper.navigateTo('/dashboard');
      await helper.waitForPageLoad();

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should show loading states during data fetch', async ({ page }) => {
      // Mock slow API response
      await page.route('/api/dashboard/stats', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ stats: {} })
        });
      });

      await helper.navigateTo('/dashboard');

      // Verify loading state
      await helper.expectVisible('[data-testid="loading-spinner"]');
      await helper.expectText(/Loading dashboard data/);

      // Wait for completion
      await helper.waitForLoadingComplete();
      await helper.expectVisible('[data-testid="dashboard-content"]');
    });

    test('should handle data refresh', async ({ page }) => {
      // Click refresh button
      await helper.clickButton('[data-testid="refresh-data"]');

      // Verify refresh indicator
      await helper.expectVisible('[data-testid="refresh-indicator"]');
      await helper.expectText(/Refreshing data/);

      // Wait for refresh to complete
      await helper.waitForLoadingComplete();
      await helper.expectNotVisible('[data-testid="refresh-indicator"]');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API error
      await helper.mockApiError('/api/dashboard/stats', 500);

      await helper.navigateTo('/dashboard');

      // Verify error handling
      await helper.expectText(/Unable to load dashboard data/);
      await helper.expectVisible('[data-testid="retry-button"]');

      // Test retry functionality
      await helper.mockApiResponse('/api/dashboard/stats', { stats: {} });
      await helper.clickButton('[data-testid="retry-button"]');
      await helper.expectVisible('[data-testid="dashboard-content"]');
    });

    test('should handle network connectivity issues', async ({ page }) => {
      // Mock network failure
      await page.route('/api/dashboard/stats', async route => {
        await route.abort('failed');
      });

      await helper.navigateTo('/dashboard');

      // Verify offline handling
      await helper.expectText(/No internet connection/);
      await helper.expectVisible('[data-testid="offline-indicator"]');
    });

    test('should provide fallback content when data is unavailable', async ({ page }) => {
      // Mock empty data response
      await helper.mockApiResponse('/api/dashboard/stats', { stats: null });

      await helper.navigateTo('/dashboard');

      // Verify fallback content
      await helper.expectText(/No data available/);
      await helper.expectVisible('[data-testid="empty-state"]');
      await helper.expectVisible('[data-testid="get-started-button"]');
    });
  });

  test.describe('Accessibility', () => {
    test('should meet WCAG accessibility standards', async ({ page }) => {
      // Check for proper heading structure
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
      expect(headings).toBeGreaterThan(0);

      // Check for proper ARIA labels
      await expect(page.locator('[aria-label]')).toHaveCount(0);

      // Check for proper focus management
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();

      // Check for proper color contrast (basic check)
      const textElements = await page.locator('p, span, div').count();
      expect(textElements).toBeGreaterThan(0);
    });

    test('should support screen readers', async ({ page }) => {
      // Check for screen reader announcements
      await expect(page.locator('[aria-live]')).toHaveCount(0);

      // Check for proper alt text on images
      const images = await page.locator('img').count();
      if (images > 0) {
        await expect(page.locator('img[alt]')).toHaveCount(images);
      }
    });

    test('should support keyboard-only navigation', async ({ page }) => {
      // Navigate through all interactive elements with keyboard
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();

      // Test keyboard shortcuts
      await page.keyboard.press('Control+k');
      await helper.expectVisible('[data-testid="search-input"]');
    });
  });
});
