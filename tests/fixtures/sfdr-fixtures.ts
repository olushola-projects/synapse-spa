import { test as base } from '@playwright/test';
import { SFDRTestHelpers } from '../utils/test-helpers';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup authenticated session
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');

    await use(page);
  },

  sfdrNavigatorPage: async ({ page }, use) => {
    // Setup SFDR Navigator page
    await page.goto('/nexus-agent');
    await SFDRTestHelpers.waitForPageLoad(page);

    await use(page);
  },

  testData: async ({}, use) => {
    // Provide test data for SFDR classification
    const testData = {
      article6Fund: {
        name: 'Test Article 6 Fund',
        description: 'A fund with minimal ESG integration',
        expectedClassification: 'Article 6'
      },
      article8Fund: {
        name: 'Test Article 8 Fund',
        description: 'A fund promoting environmental characteristics',
        expectedClassification: 'Article 8'
      },
      article9Fund: {
        name: 'Test Article 9 Fund',
        description: 'A fund with sustainable investment objective',
        expectedClassification: 'Article 9'
      }
    };

    await use(testData);
  },

  mockAPIResponses: async ({ page }, use) => {
    // Setup mock API responses for testing
    const mockResponses = {
      success: {
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          classification: 'Article 8',
          confidence: 0.95,
          reasoning: ['ESG integration detected', 'Environmental characteristics promoted']
        })
      },
      error: {
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      },
      timeout: {
        status: 408,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Request timeout' })
      }
    };

    // Setup route handlers
    await page.route('/api/sfdr/classify', async route => {
      await route.fulfill(mockResponses.success);
    });

    await page.route('/api/sfdr/validate', async route => {
      await route.fulfill(mockResponses.success);
    });

    await use(mockResponses);
  },

  performanceMetrics: async ({ page }, use) => {
    // Setup performance monitoring
    const metrics = {
      pageLoadTime: 0,
      apiResponseTime: 0,
      domContentLoaded: 0,
      firstContentfulPaint: 0
    };

    // Monitor performance metrics
    page.on('load', () => {
      metrics.pageLoadTime = Date.now();
    });

    page.on('domcontentloaded', () => {
      metrics.domContentLoaded = Date.now();
    });

    await use(metrics);
  },

  accessibilityAudit: async ({ page }, use) => {
    // Setup accessibility audit
    const auditResults = {
      violations: [],
      passes: [],
      incomplete: []
    };

    // Inject axe-core for accessibility testing
    await page.evaluate(() => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js';
      document.head.appendChild(script);
    });

    await use(auditResults);
  },

  errorBoundaryTest: async ({ page }, use) => {
    // Setup error boundary testing
    const errorTestData = {
      componentError: 'Component Error',
      networkError: 'Network Error',
      validationError: 'Validation Error'
    };

    await use(errorTestData);
  },

  responsiveTest: async ({ page }, use) => {
    // Setup responsive design testing
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    await use(viewports);
  },

  securityTest: async ({ page }, use) => {
    // Setup security testing
    const securityTests = {
      xssPayload: '<script>alert("XSS")</script>',
      sqlInjection: "' OR 1=1 --",
      csrfToken: 'test-csrf-token'
    };

    await use(securityTests);
  }
});

export { expect } from '@playwright/test';
