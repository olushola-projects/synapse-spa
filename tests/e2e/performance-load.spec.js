import { expect, test } from '@playwright/test';
/**
 * Performance & Load Testing for Pre-Beta Validation
 * Comprehensive performance testing for SFDR Navigator before beta release
 */
test.describe('Performance & Load Tests', () => {
  test.describe('Page Load Performance', () => {
    test('should load landing page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
      // Verify all critical elements are visible
      await expect(page.getByRole('heading', { name: /SFDR Navigator/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Get Started/i })).toBeVisible();
    });
    test('should load SFDR Navigator page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/sfdr-navigator');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(4000); // Should load within 4 seconds
      // Verify critical elements are visible
      await expect(page.getByTestId('fund-name-input')).toBeVisible();
      await expect(page.getByTestId('fund-description-input')).toBeVisible();
      await expect(page.getByTestId('classify-button')).toBeVisible();
    });
    test('should load dashboard within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });
    test('should maintain consistent performance across multiple loads', async ({ page }) => {
      const loadTimes = [];
      // Load page multiple times to test consistency
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        loadTimes.push(loadTime);
      }
      // Calculate average and verify consistency
      const averageLoadTime = loadTimes.reduce((a, b) => a + b) / loadTimes.length;
      const maxLoadTime = Math.max(...loadTimes);
      const minLoadTime = Math.min(...loadTimes);
      expect(averageLoadTime).toBeLessThan(3000); // Average should be under 3 seconds
      expect(maxLoadTime - minLoadTime).toBeLessThan(2000); // Variation should be less than 2 seconds
    });
  });
  test.describe('API Performance', () => {
    test('should complete SFDR classification within acceptable time', async ({ page }) => {
      await page.goto('/sfdr-navigator');
      // Input test data
      await page.getByTestId('fund-name-input').fill('Test Sustainable Fund');
      await page
        .getByTestId('fund-description-input')
        .fill('A fund focused on sustainable investments with ESG integration');
      const startTime = Date.now();
      await page.getByTestId('classify-button').click();
      // Wait for classification result
      await expect(page.getByTestId('classification-result')).toBeVisible({ timeout: 30000 });
      const classificationTime = Date.now() - startTime;
      expect(classificationTime).toBeLessThan(15000); // Should complete within 15 seconds
    });
    test('should handle API errors gracefully without performance impact', async ({ page }) => {
      await page.goto('/sfdr-navigator');
      // Mock API error
      await page.route('/api/sfdr/classify', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Service unavailable' })
        });
      });
      const startTime = Date.now();
      await page.getByTestId('fund-name-input').fill('Test Fund');
      await page.getByTestId('classify-button').click();
      // Wait for error response
      await expect(page.getByText(/Error/i)).toBeVisible({ timeout: 10000 });
      const errorResponseTime = Date.now() - startTime;
      expect(errorResponseTime).toBeLessThan(5000); // Should handle errors within 5 seconds
    });
  });
  test.describe('Concurrent User Load Testing', () => {
    test('should handle 10 concurrent users', async ({ browser }) => {
      const userCount = 10;
      const contexts = [];
      const pages = [];
      // Create browser contexts for concurrent users
      for (let i = 0; i < userCount; i++) {
        const context = await browser.newContext();
        const page = await context.newPage();
        contexts.push(context);
        pages.push(page);
      }
      // Navigate all pages simultaneously
      const startTime = Date.now();
      await Promise.all(pages.map(page => page.goto('/')));
      const loadTime = Date.now() - startTime;
      // Verify all pages loaded successfully
      for (const page of pages) {
        await expect(page.getByRole('heading', { name: /SFDR Navigator/i })).toBeVisible();
      }
      // Performance assertions
      expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
      // Clean up
      await Promise.all(contexts.map(context => context.close()));
    });
    test('should handle 25 concurrent users', async ({ browser }) => {
      const userCount = 25;
      const contexts = [];
      const pages = [];
      // Create browser contexts for concurrent users
      for (let i = 0; i < userCount; i++) {
        const context = await browser.newContext();
        const page = await context.newPage();
        contexts.push(context);
        pages.push(page);
      }
      // Navigate all pages simultaneously
      const startTime = Date.now();
      await Promise.all(pages.map(page => page.goto('/')));
      const loadTime = Date.now() - startTime;
      // Verify all pages loaded successfully
      for (const page of pages) {
        await expect(page.getByRole('heading', { name: /SFDR Navigator/i })).toBeVisible();
      }
      // Performance assertions
      expect(loadTime).toBeLessThan(15000); // Should load within 15 seconds
      // Clean up
      await Promise.all(contexts.map(context => context.close()));
    });
    test('should handle concurrent SFDR classifications', async ({ browser }) => {
      const userCount = 5;
      const contexts = [];
      const pages = [];
      // Create browser contexts for concurrent users
      for (let i = 0; i < userCount; i++) {
        const context = await browser.newContext();
        const page = await context.newPage();
        contexts.push(context);
        pages.push(page);
      }
      // Navigate all pages to SFDR Navigator
      await Promise.all(pages.map(page => page.goto('/sfdr-navigator')));
      // Input data and submit classifications simultaneously
      const startTime = Date.now();
      await Promise.all(
        pages.map(async (page, index) => {
          await page.getByTestId('fund-name-input').fill(`Test Fund ${index + 1}`);
          await page.getByTestId('fund-description-input').fill('Sustainable investment fund');
          await page.getByTestId('classify-button').click();
        })
      );
      // Wait for all classifications to complete
      await Promise.all(
        pages.map(page =>
          expect(page.getByTestId('classification-result')).toBeVisible({ timeout: 30000 })
        )
      );
      const classificationTime = Date.now() - startTime;
      expect(classificationTime).toBeLessThan(30000); // Should complete within 30 seconds
      // Clean up
      await Promise.all(contexts.map(context => context.close()));
    });
  });
  test.describe('Memory & Resource Usage', () => {
    test('should maintain reasonable memory usage', async ({ page }) => {
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return performance.memory.usedJSHeapSize;
        }
        return 0;
      });
      // Perform multiple operations
      for (let i = 0; i < 10; i++) {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.goto('/sfdr-navigator');
        await page.waitForLoadState('networkidle');
      }
      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return performance.memory.usedJSHeapSize;
        }
        return 0;
      });
      // Calculate memory increase
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
      // Memory increase should be reasonable (less than 100MB)
      expect(memoryIncreaseMB).toBeLessThan(100);
    });
    test('should handle large data inputs efficiently', async ({ page }) => {
      await page.goto('/sfdr-navigator');
      // Create large test data
      const largeDescription = 'A'.repeat(10000); // 10KB of data
      const startTime = Date.now();
      await page.getByTestId('fund-description-input').fill(largeDescription);
      const inputTime = Date.now() - startTime;
      // Input should be handled efficiently
      expect(inputTime).toBeLessThan(1000); // Should handle within 1 second
      // Verify input was accepted
      const inputValue = await page.getByTestId('fund-description-input').inputValue();
      expect(inputValue.length).toBe(10000);
    });
  });
  test.describe('Network Performance', () => {
    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        await route.continue();
      });
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000); // Should still load within 10 seconds even with delays
    });
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network errors
      await page.route('**/*', async route => {
        if (route.request().url().includes('/api/')) {
          await route.abort();
        } else {
          await route.continue();
        }
      });
      await page.goto('/sfdr-navigator');
      // Should show appropriate error message
      await expect(page.getByText(/Network error|Connection failed/i)).toBeVisible();
    });
    test('should optimize resource loading', async ({ page }) => {
      const requests = [];
      page.on('request', request => {
        requests.push({
          url: request.url(),
          resourceType: request.resourceType()
        });
      });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Analyze resource loading
      const imageRequests = requests.filter(req => req.resourceType === 'image');
      const scriptRequests = requests.filter(req => req.resourceType === 'script');
      const stylesheetRequests = requests.filter(req => req.resourceType === 'stylesheet');
      // Should have reasonable number of resources
      expect(imageRequests.length).toBeLessThan(50);
      expect(scriptRequests.length).toBeLessThan(20);
      expect(stylesheetRequests.length).toBeLessThan(10);
    });
  });
  test.describe('Browser Performance', () => {
    test('should work efficiently across different browsers', async ({ browserName, page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      // Performance should be consistent across browsers
      if (browserName === 'chromium') {
        expect(loadTime).toBeLessThan(3000);
      } else if (browserName === 'firefox') {
        expect(loadTime).toBeLessThan(4000);
      } else if (browserName === 'webkit') {
        expect(loadTime).toBeLessThan(4000);
      }
    });
    test('should handle browser back/forward navigation efficiently', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.goto('/sfdr-navigator');
      await page.waitForLoadState('networkidle');
      const startTime = Date.now();
      await page.goBack();
      await page.waitForLoadState('networkidle');
      const backNavigationTime = Date.now() - startTime;
      expect(backNavigationTime).toBeLessThan(2000); // Should navigate back within 2 seconds
      const startTime2 = Date.now();
      await page.goForward();
      await page.waitForLoadState('networkidle');
      const forwardNavigationTime = Date.now() - startTime2;
      expect(forwardNavigationTime).toBeLessThan(2000); // Should navigate forward within 2 seconds
    });
  });
  test.describe('Performance Monitoring', () => {
    test('should track performance metrics', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded:
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint:
            performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')
              ?.startTime || 0,
          firstContentfulPaint:
            performance
              .getEntriesByType('paint')
              .find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        };
      });
      // Verify performance metrics are reasonable
      expect(metrics.domContentLoaded).toBeLessThan(2000);
      expect(metrics.loadComplete).toBeLessThan(3000);
      expect(metrics.firstPaint).toBeLessThan(2000);
      expect(metrics.firstContentfulPaint).toBeLessThan(2500);
    });
  });
});
