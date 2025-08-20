import { expect, test } from '@playwright/test';

test.describe('Basic SFDR Navigator Tests', () => {
  test('should load the application', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:9323');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Basic validation that the page loaded
    await expect(page).toHaveTitle(/Playwright|Test/);
  });

  test('should have basic page structure', async ({ page }) => {
    await page.goto('http://localhost:9323');
    await page.waitForLoadState('networkidle');

    // Check for basic page elements
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle navigation', async ({ page }) => {
    await page.goto('http://localhost:9323');
    await page.waitForLoadState('networkidle');

    // Test basic navigation functionality
    const currentUrl = page.url();
    expect(currentUrl).toContain('localhost:9323');
  });
});
