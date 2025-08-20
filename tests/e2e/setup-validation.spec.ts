import { test, expect } from '@playwright/test';

test.describe('Playwright Setup Validation', () => {
  test('should have working Playwright setup', async ({ page }) => {
    // Navigate to a simple page to test basic functionality
    await page.goto('https://example.com');
    
    // Verify page loaded
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Test basic page interaction
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Example Domain');
  });

  test('should support basic page operations', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Test page title
    const title = await page.title();
    expect(title).toContain('Example Domain');
    
    // Test URL
    const url = page.url();
    expect(url).toContain('example.com');
  });

  test('should handle page elements correctly', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Test element selection
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Test text content
    const text = await page.textContent('body');
    expect(text).toContain('Example Domain');
  });
});
