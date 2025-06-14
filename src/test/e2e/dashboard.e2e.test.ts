import { test, expect, Page } from '@playwright/test';
import { chromium, Browser, BrowserContext } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const TEST_USER_EMAIL = 'test@synapses.ai';
const TEST_USER_PASSWORD = 'TestPassword123!';

// Page object models
class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(`${BASE_URL}/login`);
  }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
  }

  async loginWithMFA(email: string, password: string, mfaCode: string) {
    await this.login(email, password);
    await this.page.waitForSelector('[data-testid="mfa-input"]');
    await this.page.fill('[data-testid="mfa-input"]', mfaCode);
    await this.page.click('[data-testid="verify-mfa-button"]');
  }

  async expectLoginError() {
    await expect(this.page.locator('[data-testid="error-message"]')).toBeVisible();
  }
}

class DashboardPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(`${BASE_URL}/dashboard`);
  }

  async waitForLoad() {
    await this.page.waitForSelector('[data-testid="dashboard-container"]');
    await this.page.waitForLoadState('networkidle');
  }

  async expectDashboardVisible() {
    await expect(this.page.locator('[data-testid="dashboard-container"]')).toBeVisible();
  }

  async expectMetricsVisible() {
    await expect(this.page.locator('[data-testid="compliance-score"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="risk-score"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="task-count"]')).toBeVisible();
  }

  async expectChartsVisible() {
    await expect(this.page.locator('[data-testid="line-chart"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="bar-chart"]')).toBeVisible();
  }

  async switchTab(tabName: string) {
    await this.page.click(`[data-testid="tab-${tabName}"]`);
  }

  async searchData(query: string) {
    await this.page.fill('[data-testid="search-input"]', query);
    await this.page.press('[data-testid="search-input"]', 'Enter');
  }

  async filterData(filterType: string, value: string) {
    await this.page.click('[data-testid="filter-button"]');
    await this.page.selectOption(`[data-testid="${filterType}-filter"]`, value);
    await this.page.click('[data-testid="apply-filter"]');
  }

  async exportData() {
    await this.page.click('[data-testid="export-button"]');
  }

  async refreshData() {
    await this.page.click('[data-testid="refresh-button"]');
  }

  async openNotifications() {
    await this.page.click('[data-testid="notifications-button"]');
  }

  async openSettings() {
    await this.page.click('[data-testid="settings-button"]');
  }
}

class NotificationPanel {
  constructor(private page: Page) {}

  async expectVisible() {
    await expect(this.page.locator('[data-testid="notification-panel"]')).toBeVisible();
  }

  async expectNotificationCount(count: number) {
    const notifications = this.page.locator('[data-testid="notification-item"]');
    await expect(notifications).toHaveCount(count);
  }

  async clickNotification(index: number) {
    await this.page.click(`[data-testid="notification-item"]:nth-child(${index + 1})`);
  }

  async markAsRead(index: number) {
    await this.page.click(`[data-testid="notification-item"]:nth-child(${index + 1}) [data-testid="mark-read-button"]`);
  }

  async markAllAsRead() {
    await this.page.click('[data-testid="mark-all-read-button"]');
  }

  async deleteNotification(index: number) {
    await this.page.click(`[data-testid="notification-item"]:nth-child(${index + 1}) [data-testid="delete-button"]`);
  }
}

class DataTable {
  constructor(private page: Page) {}

  async expectVisible() {
    await expect(this.page.locator('[data-testid="data-table"]')).toBeVisible();
  }

  async expectRowCount(count: number) {
    const rows = this.page.locator('[data-testid="table-row"]');
    await expect(rows).toHaveCount(count);
  }

  async clickRow(index: number) {
    await this.page.click(`[data-testid="table-row"]:nth-child(${index + 1})`);
  }

  async sortByColumn(columnName: string) {
    await this.page.click(`[data-testid="column-header-${columnName}"]`);
  }

  async openRowActions(index: number) {
    await this.page.click(`[data-testid="table-row"]:nth-child(${index + 1}) [data-testid="row-actions"]`);
  }

  async selectRow(index: number) {
    await this.page.click(`[data-testid="table-row"]:nth-child(${index + 1}) [data-testid="row-checkbox"]`);
  }

  async selectAllRows() {
    await this.page.click('[data-testid="select-all-checkbox"]');
  }

  async changePage(page: number) {
    await this.page.click(`[data-testid="page-${page}"]`);
  }

  async changePageSize(size: number) {
    await this.page.selectOption('[data-testid="page-size-select"]', size.toString());
  }
}

class AgentPanel {
  constructor(private page: Page) {}

  async expectVisible() {
    await expect(this.page.locator('[data-testid="agent-panel"]')).toBeVisible();
  }

  async expectAgentCount(count: number) {
    const agents = this.page.locator('[data-testid="agent-card"]');
    await expect(agents).toHaveCount(count);
  }

  async clickAgent(agentName: string) {
    await this.page.click(`[data-testid="agent-${agentName}"]`);
  }

  async executeTask(agentName: string, task: string) {
    await this.clickAgent(agentName);
    await this.page.fill('[data-testid="task-input"]', task);
    await this.page.click('[data-testid="execute-task-button"]');
  }

  async expectTaskResult() {
    await expect(this.page.locator('[data-testid="task-result"]')).toBeVisible();
  }

  async expectAgentStatus(agentName: string, status: string) {
    await expect(this.page.locator(`[data-testid="agent-${agentName}-status"]`)).toHaveText(status);
  }
}

// Test suite
test.describe('Dashboard E2E Tests', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let notificationPanel: NotificationPanel;
  let dataTable: DataTable;
  let agentPanel: AgentPanel;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.beforeEach(async () => {
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      permissions: ['notifications'],
    });
    page = await context.newPage();
    
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    notificationPanel = new NotificationPanel(page);
    dataTable = new DataTable(page);
    agentPanel = new AgentPanel(page);
  });

  test.afterEach(async () => {
    await context.close();
  });

  test.describe('Authentication Flow', () => {
    test('should login successfully with valid credentials', async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      
      await dashboardPage.expectDashboardVisible();
    });

    test('should show error with invalid credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('invalid@email.com', 'wrongpassword');
      
      await loginPage.expectLoginError();
    });

    test('should handle MFA authentication', async () => {
      await loginPage.navigate();
      await loginPage.loginWithMFA(TEST_USER_EMAIL, TEST_USER_PASSWORD, '123456');
      
      await dashboardPage.expectDashboardVisible();
    });

    test('should redirect to login when not authenticated', async () => {
      await dashboardPage.navigate();
      
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Dashboard Loading and Display', () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      await dashboardPage.waitForLoad();
    });

    test('should display all dashboard components', async () => {
      await dashboardPage.expectDashboardVisible();
      await dashboardPage.expectMetricsVisible();
      await dashboardPage.expectChartsVisible();
    });

    test('should display correct metrics values', async () => {
      await expect(page.locator('[data-testid="compliance-score"]')).toContainText(/\d+/);
      await expect(page.locator('[data-testid="risk-score"]')).toContainText(/\d+/);
      await expect(page.locator('[data-testid="task-count"]')).toContainText(/\d+/);
    });

    test('should render charts with data', async () => {
      await dashboardPage.expectChartsVisible();
      
      // Check that charts have data
      const chartData = await page.getAttribute('[data-testid="line-chart"]', 'data-chart-data');
      expect(chartData).toBeTruthy();
    });

    test('should be responsive on different screen sizes', async () => {
      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await dashboardPage.expectDashboardVisible();
      
      // Test tablet view
      await page.setViewportSize({ width: 768, height: 1024 });
      await dashboardPage.expectDashboardVisible();
      
      // Test desktop view
      await page.setViewportSize({ width: 1920, height: 1080 });
      await dashboardPage.expectDashboardVisible();
    });
  });

  test.describe('Tab Navigation', () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      await dashboardPage.waitForLoad();
    });

    test('should switch between tabs', async () => {
      await dashboardPage.switchTab('analytics');
      await expect(page.locator('[data-testid="analytics-content"]')).toBeVisible();
      
      await dashboardPage.switchTab('tasks');
      await expect(page.locator('[data-testid="tasks-content"]')).toBeVisible();
      
      await dashboardPage.switchTab('agents');
      await expect(page.locator('[data-testid="agents-content"]')).toBeVisible();
    });

    test('should maintain state when switching tabs', async () => {
      // Perform search in overview tab
      await dashboardPage.searchData('GDPR');
      
      // Switch to another tab and back
      await dashboardPage.switchTab('analytics');
      await dashboardPage.switchTab('overview');
      
      // Search should be maintained
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toHaveValue('GDPR');
    });
  });

  test.describe('Data Table Functionality', () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      await dashboardPage.waitForLoad();
      await dashboardPage.switchTab('tasks');
    });

    test('should display data table with rows', async () => {
      await dataTable.expectVisible();
      await dataTable.expectRowCount(10); // Assuming 10 rows per page
    });

    test('should handle search functionality', async () => {
      await dashboardPage.searchData('GDPR');
      
      // Should filter results
      await page.waitForTimeout(1000); // Wait for search to complete
      const rows = page.locator('[data-testid="table-row"]');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should handle sorting', async () => {
      await dataTable.sortByColumn('title');
      
      // Wait for sort to complete
      await page.waitForTimeout(1000);
      
      // Check that data is sorted
      const firstRowTitle = await page.locator('[data-testid="table-row"]:first-child [data-testid="cell-title"]').textContent();
      const secondRowTitle = await page.locator('[data-testid="table-row"]:nth-child(2) [data-testid="cell-title"]').textContent();
      
      expect(firstRowTitle?.localeCompare(secondRowTitle || '')).toBeLessThanOrEqual(0);
    });

    test('should handle filtering', async () => {
      await dashboardPage.filterData('status', 'active');
      
      // Wait for filter to apply
      await page.waitForTimeout(1000);
      
      // All visible rows should have 'active' status
      const statusCells = page.locator('[data-testid="cell-status"]');
      const count = await statusCells.count();
      
      for (let i = 0; i < count; i++) {
        const status = await statusCells.nth(i).textContent();
        expect(status).toContain('active');
      }
    });

    test('should handle pagination', async () => {
      await dataTable.changePage(2);
      
      // Should navigate to page 2
      await expect(page.locator('[data-testid="current-page"]')).toContainText('2');
    });

    test('should handle row selection', async () => {
      await dataTable.selectRow(0);
      
      // Row should be selected
      await expect(page.locator('[data-testid="table-row"]:first-child')).toHaveClass(/selected/);
    });

    test('should handle row actions', async () => {
      await dataTable.openRowActions(0);
      
      // Action menu should be visible
      await expect(page.locator('[data-testid="action-menu"]')).toBeVisible();
      
      // Click view action
      await page.click('[data-testid="action-view"]');
      
      // Should navigate to detail view
      await expect(page).toHaveURL(/\/tasks\/\d+/);
    });

    test('should handle bulk operations', async () => {
      await dataTable.selectAllRows();
      
      // Bulk actions should be available
      await expect(page.locator('[data-testid="bulk-actions"]')).toBeVisible();
      
      // Export selected
      await page.click('[data-testid="bulk-export"]');
      
      // Should trigger download
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    });
  });

  test.describe('Notification System', () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      await dashboardPage.waitForLoad();
    });

    test('should display notification panel', async () => {
      await dashboardPage.openNotifications();
      await notificationPanel.expectVisible();
    });

    test('should display notifications', async () => {
      await dashboardPage.openNotifications();
      await notificationPanel.expectNotificationCount(3); // Assuming 3 notifications
    });

    test('should handle notification interactions', async () => {
      await dashboardPage.openNotifications();
      await notificationPanel.clickNotification(0);
      
      // Should navigate to notification detail or mark as read
      await expect(page.locator('[data-testid="notification-detail"]')).toBeVisible();
    });

    test('should mark notifications as read', async () => {
      await dashboardPage.openNotifications();
      await notificationPanel.markAsRead(0);
      
      // Notification should be marked as read
      await expect(page.locator('[data-testid="notification-item"]:first-child')).toHaveClass(/read/);
    });

    test('should mark all notifications as read', async () => {
      await dashboardPage.openNotifications();
      await notificationPanel.markAllAsRead();
      
      // All notifications should be marked as read
      const notifications = page.locator('[data-testid="notification-item"]');
      const count = await notifications.count();
      
      for (let i = 0; i < count; i++) {
        await expect(notifications.nth(i)).toHaveClass(/read/);
      }
    });

    test('should delete notifications', async () => {
      await dashboardPage.openNotifications();
      const initialCount = await page.locator('[data-testid="notification-item"]').count();
      
      await notificationPanel.deleteNotification(0);
      
      // Notification count should decrease
      await expect(page.locator('[data-testid="notification-item"]')).toHaveCount(initialCount - 1);
    });
  });

  test.describe('AI Agent Integration', () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      await dashboardPage.waitForLoad();
      await dashboardPage.switchTab('agents');
    });

    test('should display available agents', async () => {
      await agentPanel.expectVisible();
      await agentPanel.expectAgentCount(5); // Assuming 5 agents
    });

    test('should show agent status', async () => {
      await agentPanel.expectAgentStatus('compliance-agent', 'active');
      await agentPanel.expectAgentStatus('risk-agent', 'active');
    });

    test('should execute agent tasks', async () => {
      await agentPanel.executeTask('compliance-agent', 'Analyze GDPR compliance status');
      
      // Should show task execution
      await expect(page.locator('[data-testid="task-executing"]')).toBeVisible();
      
      // Wait for task completion
      await agentPanel.expectTaskResult();
    });

    test('should display agent performance metrics', async () => {
      await agentPanel.clickAgent('compliance-agent');
      
      // Should show performance metrics
      await expect(page.locator('[data-testid="agent-metrics"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-rate"]')).toContainText(/\d+%/);
      await expect(page.locator('[data-testid="avg-execution-time"]')).toContainText(/\d+/);
    });

    test('should handle agent collaboration', async () => {
      await agentPanel.executeTask('compliance-agent', 'Work with risk agent to assess compliance risks');
      
      // Should show collaboration workflow
      await expect(page.locator('[data-testid="collaboration-workflow"]')).toBeVisible();
      
      // Multiple agents should be involved
      await expect(page.locator('[data-testid="active-agents"]')).toContainText('2');
    });
  });

  test.describe('Search and RAG Functionality', () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      await dashboardPage.waitForLoad();
    });

    test('should perform semantic search', async () => {
      await dashboardPage.searchData('GDPR compliance requirements');
      
      // Should show search results
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
      
      // Results should be relevant
      const results = page.locator('[data-testid="search-result-item"]');
      const count = await results.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display search result details', async () => {
      await dashboardPage.searchData('risk assessment');
      
      // Click on first result
      await page.click('[data-testid="search-result-item"]:first-child');
      
      // Should show result details
      await expect(page.locator('[data-testid="search-result-detail"]')).toBeVisible();
    });

    test('should handle empty search results', async () => {
      await dashboardPage.searchData('nonexistent query xyz123');
      
      // Should show no results message
      await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
    });

    test('should provide search suggestions', async () => {
      await page.fill('[data-testid="search-input"]', 'GDP');
      
      // Should show suggestions
      await expect(page.locator('[data-testid="search-suggestions"]')).toBeVisible();
      await expect(page.locator('[data-testid="suggestion-item"]')).toContainText('GDPR');
    });
  });

  test.describe('Export and Reporting', () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      await dashboardPage.waitForLoad();
    });

    test('should export dashboard data', async () => {
      const downloadPromise = page.waitForEvent('download');
      await dashboardPage.exportData();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/dashboard.*\.(csv|xlsx|pdf)$/);
    });

    test('should export filtered data', async () => {
      await dashboardPage.filterData('status', 'active');
      
      const downloadPromise = page.waitForEvent('download');
      await dashboardPage.exportData();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/filtered.*\.(csv|xlsx|pdf)$/);
    });

    test('should generate compliance reports', async () => {
      await page.click('[data-testid="generate-report-button"]');
      
      // Should show report generation dialog
      await expect(page.locator('[data-testid="report-dialog"]')).toBeVisible();
      
      // Select report type
      await page.selectOption('[data-testid="report-type-select"]', 'compliance');
      await page.click('[data-testid="generate-button"]');
      
      // Should show generation progress
      await expect(page.locator('[data-testid="report-progress"]')).toBeVisible();
      
      // Wait for completion
      await expect(page.locator('[data-testid="report-ready"]')).toBeVisible({ timeout: 30000 });
    });
  });

  test.describe('Real-time Updates', () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      await dashboardPage.waitForLoad();
    });

    test('should receive real-time metric updates', async () => {
      const initialScore = await page.locator('[data-testid="compliance-score"]').textContent();
      
      // Wait for potential updates
      await page.waitForTimeout(5000);
      
      // Score might have updated
      const updatedScore = await page.locator('[data-testid="compliance-score"]').textContent();
      expect(updatedScore).toBeTruthy();
    });

    test('should receive real-time notifications', async () => {
      const initialCount = await page.locator('[data-testid="notification-count"]').textContent();
      
      // Simulate new notification (this would normally come from the server)
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('new-notification', {
          detail: {
            id: 'test-notification',
            title: 'Test Notification',
            message: 'This is a test notification',
            type: 'info'
          }
        }));
      });
      
      // Notification count should update
      await expect(page.locator('[data-testid="notification-count"]')).not.toHaveText(initialCount || '');
    });

    test('should handle connection loss gracefully', async () => {
      // Simulate network offline
      await page.context().setOffline(true);
      
      // Should show offline indicator
      await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
      
      // Restore connection
      await page.context().setOffline(false);
      
      // Should hide offline indicator
      await expect(page.locator('[data-testid="offline-indicator"]')).not.toBeVisible();
    });
  });

  test.describe('Performance and Accessibility', () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
    });

    test('should load dashboard within acceptable time', async () => {
      const startTime = Date.now();
      await dashboardPage.waitForLoad();
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should be keyboard navigable', async () => {
      await dashboardPage.waitForLoad();
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(['BUTTON', 'INPUT', 'A', 'SELECT']).toContain(focusedElement);
      
      // Continue tabbing
      await page.keyboard.press('Tab');
      focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(['BUTTON', 'INPUT', 'A', 'SELECT']).toContain(focusedElement);
    });

    test('should have proper ARIA labels', async () => {
      await dashboardPage.waitForLoad();
      
      // Check for ARIA labels on interactive elements
      const buttons = page.locator('button');
      const count = await buttons.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();
        
        // Button should have either aria-label or text content
        expect(ariaLabel || text).toBeTruthy();
      }
    });

    test('should handle large datasets without performance issues', async () => {
      await dashboardPage.waitForLoad();
      await dashboardPage.switchTab('tasks');
      
      // Load large dataset
      await page.selectOption('[data-testid="page-size-select"]', '100');
      
      const startTime = Date.now();
      await page.waitForLoadState('networkidle');
      const renderTime = Date.now() - startTime;
      
      // Should render within reasonable time
      expect(renderTime).toBeLessThan(3000);
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async () => {
      await loginPage.navigate();
      await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      await dashboardPage.waitForLoad();
    });

    test('should handle API errors gracefully', async () => {
      // Intercept API calls and return errors
      await page.route('**/api/**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
      
      await dashboardPage.refreshData();
      
      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });

    test('should handle network timeouts', async () => {
      // Intercept API calls and delay response
      await page.route('**/api/**', route => {
        setTimeout(() => {
          route.fulfill({
            status: 408,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Request Timeout' })
          });
        }, 10000);
      });
      
      await dashboardPage.refreshData();
      
      // Should show timeout error
      await expect(page.locator('[data-testid="timeout-error"]')).toBeVisible({ timeout: 15000 });
    });

    test('should recover from errors', async () => {
      // First, cause an error
      await page.route('**/api/**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
      
      await dashboardPage.refreshData();
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      
      // Then, restore normal behavior
      await page.unroute('**/api/**');
      
      // Retry should work
      await page.click('[data-testid="retry-button"]');
      await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
    });
  });
});