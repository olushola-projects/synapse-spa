import { test, expect, Page } from '@playwright/test';
import { chromium, Browser, BrowserContext } from '@playwright/test';

// Test data and utilities
const TEST_USER = {
  email: 'test.user@synapses.ai',
  password: 'TestPassword123!',
  name: 'Test User',
  organization: 'Test Organization'
};

const MOCK_REGULATORY_DATA = [
  {
    id: 'sfdr-2024-001',
    title: 'SFDR Annual Sustainability Reporting Requirements',
    regulation: 'SFDR',
    status: 'effective',
    effectiveDate: '2024-01-01',
    jurisdiction: 'EU',
    impact: 'high'
  },
  {
    id: 'mifid-2024-002',
    title: 'MiFID II Best Execution Reporting Updates',
    regulation: 'MiFID II',
    status: 'pending',
    effectiveDate: '2024-03-01',
    jurisdiction: 'EU',
    impact: 'medium'
  }
];

// Helper functions
class SynapsesPageHelper {
  constructor(private page: Page) {}

  async login(email: string = TEST_USER.email, password: string = TEST_USER.password) {
    await this.page.goto('/login');
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
    await this.page.waitForURL('/dashboard');
  }

  async logout() {
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
    await this.page.waitForURL('/login');
  }

  async navigateToCompliance() {
    await this.page.click('[data-testid="nav-compliance"]');
    await this.page.waitForURL('/compliance');
  }

  async navigateToRegulatory() {
    await this.page.click('[data-testid="nav-regulatory"]');
    await this.page.waitForURL('/regulatory');
  }

  async navigateToAgents() {
    await this.page.click('[data-testid="nav-agents"]');
    await this.page.waitForURL('/agents');
  }

  async waitForDashboardLoad() {
    await this.page.waitForSelector('[data-testid="dashboard-container"]');
    await this.page.waitForSelector('[data-testid="metrics-cards"]');
  }

  async waitForDataGridLoad() {
    await this.page.waitForSelector('[data-testid="data-table"]');
    await this.page.waitForSelector('[data-testid="table-body"]');
  }

  async searchInDataGrid(query: string) {
    await this.page.fill('[data-testid="search-input"]', query);
    await this.page.waitForTimeout(500); // Debounce
  }

  async filterByStatus(status: string) {
    await this.page.click('[data-testid="status-filter"]');
    await this.page.click(`[data-value="${status}"]`);
  }

  async selectTableRow(index: number) {
    await this.page.click(`[data-testid="row-checkbox-${index}"]`);
  }

  async expandTableRow(index: number) {
    await this.page.click(`[data-testid="expand-button-${index}"]`);
  }

  async exportData() {
    await this.page.click('[data-testid="export-button"]');
  }

  async refreshData() {
    await this.page.click('[data-testid="refresh-button"]');
  }
}

// Test suite setup
test.describe('Synapses Platform E2E Tests', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let helper: SynapsesPageHelper;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.beforeEach(async () => {
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      permissions: ['clipboard-read', 'clipboard-write']
    });
    page = await context.newPage();
    helper = new SynapsesPageHelper(page);

    // Mock API responses
    await page.route('**/api/auth/**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: TEST_USER,
            session: { access_token: 'mock-token', expires_at: Date.now() + 3600000 }
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.route('**/api/regulatory/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: MOCK_REGULATORY_DATA,
          total: MOCK_REGULATORY_DATA.length,
          page: 1,
          pageSize: 10
        })
      });
    });

    await page.route('**/api/compliance/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metrics: {
            overallScore: 85,
            riskAlerts: 3,
            pendingTasks: 12,
            completedAssessments: 45
          },
          trends: {
            complianceScore: [80, 82, 85, 87, 85],
            riskScore: [25, 23, 20, 18, 15]
          }
        })
      });
    });

    await page.route('**/api/agents/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          agents: [
            {
              id: 'sfdr-agent',
              name: 'SFDR Compliance Agent',
              status: 'active',
              lastRun: new Date().toISOString(),
              successRate: 95
            },
            {
              id: 'aml-agent',
              name: 'AML Investigation Agent',
              status: 'active',
              lastRun: new Date().toISOString(),
              successRate: 92
            }
          ]
        })
      });
    });
  });

  test.afterEach(async () => {
    await context.close();
  });

  test.describe('Authentication Flow', () => {
    test('should allow user to login successfully', async () => {
      await page.goto('/login');
      
      // Check login form is visible
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
      
      // Fill login credentials
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      
      // Submit login
      await page.click('[data-testid="login-button"]');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard');
      await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible();
    });

    test('should show error for invalid credentials', async () => {
      await page.goto('/login');
      
      // Mock failed login
      await page.route('**/api/auth/**', async (route) => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Invalid credentials' })
        });
      });
      
      await page.fill('[data-testid="email-input"]', 'invalid@email.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="login-button"]');
      
      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
    });

    test('should allow user to logout', async () => {
      await helper.login();
      await helper.logout();
      
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Dashboard Functionality', () => {
    test.beforeEach(async () => {
      await helper.login();
    });

    test('should display key compliance metrics', async () => {
      await helper.waitForDashboardLoad();
      
      // Check metrics cards are visible
      await expect(page.locator('[data-testid="metrics-cards"]')).toBeVisible();
      await expect(page.locator('[data-testid="compliance-score"]')).toBeVisible();
      await expect(page.locator('[data-testid="risk-alerts"]')).toBeVisible();
      await expect(page.locator('[data-testid="pending-tasks"]')).toBeVisible();
      
      // Check metric values
      await expect(page.locator('[data-testid="compliance-score"]')).toContainText('85');
      await expect(page.locator('[data-testid="risk-alerts"]')).toContainText('3');
    });

    test('should display compliance trends chart', async () => {
      await helper.waitForDashboardLoad();
      
      await expect(page.locator('[data-testid="trends-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="chart-container"]')).toBeVisible();
    });

    test('should allow date range selection', async () => {
      await helper.waitForDashboardLoad();
      
      await page.click('[data-testid="date-range-picker"]');
      await page.click('[data-testid="last-30-days"]');
      
      // Should update charts with new data
      await expect(page.locator('[data-testid="trends-chart"]')).toBeVisible();
    });

    test('should refresh dashboard data', async () => {
      await helper.waitForDashboardLoad();
      
      await page.click('[data-testid="refresh-dashboard"]');
      
      // Should show loading state and then updated data
      await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();
      await expect(page.locator('[data-testid="loading-indicator"]')).not.toBeVisible();
    });
  });

  test.describe('Regulatory Data Management', () => {
    test.beforeEach(async () => {
      await helper.login();
      await helper.navigateToRegulatory();
    });

    test('should display regulatory events in data grid', async () => {
      await helper.waitForDataGridLoad();
      
      // Check table structure
      await expect(page.locator('[data-testid="data-table"]')).toBeVisible();
      await expect(page.locator('[data-testid="table-header"]')).toBeVisible();
      await expect(page.locator('[data-testid="table-body"]')).toBeVisible();
      
      // Check data is displayed
      await expect(page.locator('text=SFDR Annual Sustainability')).toBeVisible();
      await expect(page.locator('text=MiFID II Best Execution')).toBeVisible();
    });

    test('should filter data by search query', async () => {
      await helper.waitForDataGridLoad();
      
      await helper.searchInDataGrid('SFDR');
      
      // Should show only SFDR-related items
      await expect(page.locator('text=SFDR Annual Sustainability')).toBeVisible();
      await expect(page.locator('text=MiFID II Best Execution')).not.toBeVisible();
    });

    test('should filter data by status', async () => {
      await helper.waitForDataGridLoad();
      
      await helper.filterByStatus('effective');
      
      // Should show only effective regulations
      await expect(page.locator('text=SFDR Annual Sustainability')).toBeVisible();
    });

    test('should sort data by columns', async () => {
      await helper.waitForDataGridLoad();
      
      // Click on title column header to sort
      await page.click('[data-testid="sort-title"]');
      
      // Should reorder the data
      await expect(page.locator('[data-testid="table-body"]')).toBeVisible();
    });

    test('should select and export data', async () => {
      await helper.waitForDataGridLoad();
      
      // Select first row
      await helper.selectTableRow(0);
      
      // Export selected data
      const downloadPromise = page.waitForEvent('download');
      await helper.exportData();
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toContain('regulatory-data');
    });

    test('should expand row to show details', async () => {
      await helper.waitForDataGridLoad();
      
      await helper.expandTableRow(0);
      
      // Should show expanded content
      await expect(page.locator('[data-testid="expanded-content-0"]')).toBeVisible();
      await expect(page.locator('text=Description:')).toBeVisible();
    });

    test('should paginate through data', async () => {
      await helper.waitForDataGridLoad();
      
      // Check pagination controls
      await expect(page.locator('[data-testid="pagination-controls"]')).toBeVisible();
      
      // Navigate to next page (if available)
      const nextButton = page.locator('[data-testid="next-page"]');
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await expect(page.locator('[data-testid="page-indicator"]')).toContainText('2');
      }
    });
  });

  test.describe('Agent Orchestration', () => {
    test.beforeEach(async () => {
      await helper.login();
      await helper.navigateToAgents();
    });

    test('should display available agents', async () => {
      await page.waitForSelector('[data-testid="agents-container"]');
      
      // Check agents are listed
      await expect(page.locator('text=SFDR Compliance Agent')).toBeVisible();
      await expect(page.locator('text=AML Investigation Agent')).toBeVisible();
      
      // Check agent status indicators
      await expect(page.locator('[data-testid="agent-status-active"]')).toBeVisible();
    });

    test('should execute SFDR compliance workflow', async () => {
      await page.waitForSelector('[data-testid="agents-container"]');
      
      // Click on SFDR agent
      await page.click('[data-testid="sfdr-agent-card"]');
      
      // Start compliance assessment
      await page.click('[data-testid="start-assessment"]');
      
      // Should show workflow execution
      await expect(page.locator('[data-testid="workflow-progress"]')).toBeVisible();
      await expect(page.locator('text=Running compliance assessment')).toBeVisible();
    });

    test('should display agent execution history', async () => {
      await page.waitForSelector('[data-testid="agents-container"]');
      
      await page.click('[data-testid="sfdr-agent-card"]');
      await page.click('[data-testid="view-history"]');
      
      // Should show execution history
      await expect(page.locator('[data-testid="execution-history"]')).toBeVisible();
      await expect(page.locator('[data-testid="history-table"]')).toBeVisible();
    });

    test('should configure agent parameters', async () => {
      await page.waitForSelector('[data-testid="agents-container"]');
      
      await page.click('[data-testid="sfdr-agent-card"]');
      await page.click('[data-testid="configure-agent"]');
      
      // Should show configuration form
      await expect(page.locator('[data-testid="agent-config-form"]')).toBeVisible();
      
      // Update configuration
      await page.fill('[data-testid="risk-threshold"]', '75');
      await page.click('[data-testid="save-config"]');
      
      // Should show success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });
  });

  test.describe('Compliance Monitoring', () => {
    test.beforeEach(async () => {
      await helper.login();
      await helper.navigateToCompliance();
    });

    test('should display compliance overview', async () => {
      await page.waitForSelector('[data-testid="compliance-overview"]');
      
      // Check overview sections
      await expect(page.locator('[data-testid="compliance-score-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="risk-alerts-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="pending-tasks-section"]')).toBeVisible();
    });

    test('should drill down into risk alerts', async () => {
      await page.waitForSelector('[data-testid="compliance-overview"]');
      
      await page.click('[data-testid="risk-alerts-section"]');
      
      // Should show detailed risk alerts
      await expect(page.locator('[data-testid="risk-alerts-detail"]')).toBeVisible();
      await expect(page.locator('[data-testid="alerts-table"]')).toBeVisible();
    });

    test('should generate compliance report', async () => {
      await page.waitForSelector('[data-testid="compliance-overview"]');
      
      await page.click('[data-testid="generate-report"]');
      
      // Should show report generation dialog
      await expect(page.locator('[data-testid="report-dialog"]')).toBeVisible();
      
      // Configure report parameters
      await page.selectOption('[data-testid="report-type"]', 'monthly');
      await page.click('[data-testid="generate-report-confirm"]');
      
      // Should show generation progress
      await expect(page.locator('[data-testid="report-progress"]')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test.beforeEach(async () => {
      await helper.login();
    });

    test('should work on mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await helper.waitForDashboardLoad();
      
      // Check mobile navigation
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
      
      // Open mobile menu
      await page.click('[data-testid="mobile-menu-button"]');
      await expect(page.locator('[data-testid="mobile-nav-menu"]')).toBeVisible();
      
      // Navigate to regulatory page
      await page.click('[data-testid="mobile-nav-regulatory"]');
      await expect(page).toHaveURL('/regulatory');
    });

    test('should work on tablet viewport', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await helper.waitForDashboardLoad();
      
      // Check tablet layout
      await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible();
      await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async () => {
      await helper.login();
    });

    test('should support keyboard navigation', async () => {
      await helper.waitForDashboardLoad();
      
      // Tab through navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Should navigate to the focused element
      await expect(page.locator(':focus')).toBeVisible();
    });

    test('should have proper ARIA labels', async () => {
      await helper.waitForDashboardLoad();
      
      // Check for ARIA labels on interactive elements
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        
        expect(ariaLabel || textContent).toBeTruthy();
      }
    });

    test('should support screen reader navigation', async () => {
      await helper.waitForDashboardLoad();
      
      // Check for proper heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      expect(headingCount).toBeGreaterThan(0);
      
      // Check for landmark regions
      await expect(page.locator('[role="main"]')).toBeVisible();
      await expect(page.locator('[role="navigation"]')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test.beforeEach(async () => {
      await helper.login();
    });

    test('should load dashboard within performance budget', async () => {
      const startTime = Date.now();
      
      await helper.waitForDashboardLoad();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 second budget
    });

    test('should handle large datasets efficiently', async () => {
      // Mock large dataset
      await page.route('**/api/regulatory/**', async (route) => {
        const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
          ...MOCK_REGULATORY_DATA[0],
          id: `event-${i}`,
          title: `Event ${i}`
        }));
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: largeDataset,
            total: largeDataset.length,
            page: 1,
            pageSize: 50
          })
        });
      });
      
      await helper.navigateToRegulatory();
      
      const startTime = Date.now();
      await helper.waitForDataGridLoad();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 second budget for large datasets
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async () => {
      await helper.login();
    });

    test('should handle API errors gracefully', async () => {
      // Mock API error
      await page.route('**/api/regulatory/**', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' })
        });
      });
      
      await helper.navigateToRegulatory();
      
      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('text=Failed to load data')).toBeVisible();
      
      // Should show retry button
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    });

    test('should handle network timeouts', async () => {
      // Mock slow API response
      await page.route('**/api/regulatory/**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 second delay
        await route.continue();
      });
      
      await helper.navigateToRegulatory();
      
      // Should show loading state
      await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();
      
      // Should eventually show timeout error
      await expect(page.locator('[data-testid="timeout-error"]')).toBeVisible({ timeout: 15000 });
    });

    test('should recover from errors', async () => {
      // First request fails
      let requestCount = 0;
      await page.route('**/api/regulatory/**', async (route) => {
        requestCount++;
        if (requestCount === 1) {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Server error' })
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: MOCK_REGULATORY_DATA,
              total: MOCK_REGULATORY_DATA.length
            })
          });
        }
      });
      
      await helper.navigateToRegulatory();
      
      // Should show error first
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      
      // Retry should succeed
      await page.click('[data-testid="retry-button"]');
      await helper.waitForDataGridLoad();
      
      // Should show data
      await expect(page.locator('text=SFDR Annual Sustainability')).toBeVisible();
    });
  });
});