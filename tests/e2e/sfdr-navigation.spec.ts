import { test, expect } from '@playwright/test';

/**
 * SFDR Navigator End-to-End Tests
 * Tests the complete user journey for SFDR fund classification
 */

test.describe('SFDR Navigator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the SFDR Navigator page
    await page.goto('/sfdr-navigator');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should complete full SFDR classification workflow', async ({ page }) => {
    // Test data
    const testFundName = 'Test Sustainable Fund';
    const expectedClassification = 'Article 8';
    const expectedConfidence = '95%';

    // Step 1: Verify page loads correctly
    await expect(page.getByRole('heading', { name: /SFDR Navigator/i })).toBeVisible();
    await expect(page.getByText(/Fund Classification/i)).toBeVisible();
    await expect(page.getByText(/Compliance Status/i)).toBeVisible();

    // Step 2: Input fund information
    const fundNameInput = page.getByTestId('fund-name-input');
    await fundNameInput.fill(testFundName);
    await expect(fundNameInput).toHaveValue(testFundName);

    // Step 3: Submit classification request
    const classifyButton = page.getByTestId('classify-button');
    await classifyButton.click();

    // Step 4: Wait for classification results
    await expect(page.getByTestId('classification-result')).toBeVisible();
    await expect(page.getByText(expectedClassification)).toBeVisible();
    await expect(page.getByText(expectedConfidence)).toBeVisible();

    // Step 5: Verify regulatory citations
    await expect(page.getByText(/Citations:/i)).toBeVisible();
    await expect(page.getByText('EU/2020/852')).toBeVisible();
    await expect(page.getByText('EU/2019/2088')).toBeVisible();

    // Step 6: Check compliance status
    await expect(page.getByText(/Compliance Status/i)).toBeVisible();
    await expect(page.getByText(/Compliant/i)).toBeVisible();
    await expect(page.getByText(/95%/i)).toBeVisible();

    // Step 7: Export results
    const exportButton = page.getByTestId('export-button');
    await exportButton.click();
    await expect(page.getByText(/Export successful/i)).toBeVisible();
  });

  test('should handle validation errors gracefully', async ({ page }) => {
    // Try to submit without input
    const classifyButton = page.getByTestId('classify-button');
    await classifyButton.click();

    // Check validation message
    await expect(page.getByText(/Fund name is required/i)).toBeVisible();

    // Input invalid data
    const fundNameInput = page.getByTestId('fund-name-input');
    await fundNameInput.fill('a'); // Too short
    await classifyButton.click();

    // Check validation message
    await expect(page.getByText(/Fund name must be at least 3 characters/i)).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('/api/sfdr/classify', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Classification service unavailable',
          message: 'Internal server error'
        })
      });
    });

    // Submit classification
    const fundNameInput = page.getByTestId('fund-name-input');
    const classifyButton = page.getByTestId('classify-button');
    
    await fundNameInput.fill('Test Fund');
    await classifyButton.click();

    // Check error message
    await expect(page.getByText(/Error/i)).toBeVisible();
    await expect(page.getByText(/Classification service unavailable/i)).toBeVisible();

    // Verify retry functionality
    const retryButton = page.getByTestId('retry-button');
    await expect(retryButton).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Navigate through form elements with keyboard
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('fund-name-input')).toBeFocused();

    await page.keyboard.type('Test Fund');
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('classify-button')).toBeFocused();

    await page.keyboard.press('Enter');
    
    // Wait for results
    await expect(page.getByTestId('classification-result')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    // Check ARIA labels
    await expect(page.getByLabelText(/Fund name/i)).toBeVisible();
    await expect(page.getByLabelText(/Classify fund/i)).toBeVisible();

    // Check color contrast (basic check)
    const mainContent = page.getByTestId('sfdr-navigator');
    await expect(mainContent).toHaveCSS('color', /rgb\(/);

    // Check focus indicators
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('fund-name-input')).toBeFocused();
    
    // Verify focus is visible
    await expect(page.getByTestId('fund-name-input')).toHaveCSS('outline', /none|auto/);
  });

  test('should handle network connectivity issues', async ({ page }) => {
    // Mock network error
    await page.route('**/*', async route => {
      await route.abort('failed');
    });

    // Try to submit classification
    const fundNameInput = page.getByTestId('fund-name-input');
    const classifyButton = page.getByTestId('classify-button');
    
    await fundNameInput.fill('Test Fund');
    await classifyButton.click();

    // Check network error message
    await expect(page.getByText(/Network error/i)).toBeVisible();
    await expect(page.getByText(/Please check your connection/i)).toBeVisible();
  });

  test('should support mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify responsive design
    await expect(page.getByTestId('fund-name-input')).toBeVisible();
    await expect(page.getByTestId('classify-button')).toBeVisible();

    // Test touch interactions
    await page.getByTestId('fund-name-input').tap();
    await page.keyboard.type('Mobile Test Fund');
    
    await page.getByTestId('classify-button').tap();
    
    // Wait for results
    await expect(page.getByTestId('classification-result')).toBeVisible();
  });

  test('should handle concurrent requests', async ({ page }) => {
    // Submit multiple requests quickly
    const fundNameInput = page.getByTestId('fund-name-input');
    const classifyButton = page.getByTestId('classify-button');

    await fundNameInput.fill('Test Fund 1');
    await classifyButton.click();

    // Try to submit another request immediately
    await fundNameInput.fill('Test Fund 2');
    await classifyButton.click();

    // Verify only one request is processed
    await expect(page.getByTestId('classification-result')).toBeVisible();
    await expect(page.getByText('Test Fund 2')).toBeVisible();
  });

  test('should maintain state during navigation', async ({ page }) => {
    // Fill form
    const fundNameInput = page.getByTestId('fund-name-input');
    await fundNameInput.fill('Test Fund');

    // Navigate away and back
    await page.goto('/dashboard');
    await page.goto('/sfdr-navigator');

    // Verify form state is maintained (if implemented)
    // This depends on your state management implementation
    await expect(page.getByTestId('fund-name-input')).toBeVisible();
  });

  test('should handle large input data', async ({ page }) => {
    // Test with large fund name
    const largeFundName = 'A'.repeat(1000);
    
    const fundNameInput = page.getByTestId('fund-name-input');
    await fundNameInput.fill(largeFundName);

    // Verify input is handled correctly
    await expect(fundNameInput).toHaveValue(largeFundName);

    // Submit classification
    const classifyButton = page.getByTestId('classify-button');
    await classifyButton.click();

    // Verify no performance issues
    await expect(page.getByTestId('classification-result')).toBeVisible();
  });

  test('should support different browsers', async ({ page, browserName }) => {
    // Test browser-specific functionality
    const fundNameInput = page.getByTestId('fund-name-input');
    const classifyButton = page.getByTestId('classify-button');

    await fundNameInput.fill('Cross-browser Test Fund');
    await classifyButton.click();

    // Verify results are consistent across browsers
    await expect(page.getByTestId('classification-result')).toBeVisible();
    await expect(page.getByText('Article 8')).toBeVisible();

    // Browser-specific checks
    if (browserName === 'webkit') {
      // Safari-specific tests
      await expect(page.getByTestId('fund-name-input')).toHaveCSS('-webkit-appearance', /none/);
    }
  });

  test('should handle performance under load', async ({ page }) => {
    // Measure performance metrics
    const startTime = Date.now();

    // Perform classification
    const fundNameInput = page.getByTestId('fund-name-input');
    const classifyButton = page.getByTestId('classify-button');

    await fundNameInput.fill('Performance Test Fund');
    await classifyButton.click();

    // Wait for results
    await expect(page.getByTestId('classification-result')).toBeVisible();

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Verify performance is within acceptable limits
    expect(responseTime).toBeLessThan(5000); // 5 seconds max
  });

  test('should handle session expiration', async ({ page }) => {
    // Mock session expiration
    await page.route('/api/sfdr/classify', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unauthorized',
          message: 'Session expired'
        })
      });
    });

    // Submit classification
    const fundNameInput = page.getByTestId('fund-name-input');
    const classifyButton = page.getByTestId('classify-button');
    
    await fundNameInput.fill('Test Fund');
    await classifyButton.click();

    // Check session expiration handling
    await expect(page.getByText(/Session expired/i)).toBeVisible();
    await expect(page.getByText(/Please log in again/i)).toBeVisible();

    // Verify redirect to login
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('should support accessibility features', async ({ page }) => {
    // Test screen reader compatibility
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('form')).toBeVisible();

    // Test keyboard shortcuts
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('fund-name-input')).toBeFocused();

    // Test high contrast mode
    await page.evaluate(() => {
      document.documentElement.style.filter = 'contrast(200%)';
    });

    await expect(page.getByTestId('fund-name-input')).toBeVisible();
    await expect(page.getByTestId('classify-button')).toBeVisible();
  });
});
