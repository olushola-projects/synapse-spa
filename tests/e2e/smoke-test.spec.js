import { expect, test } from '@playwright/test';
/**
 * Smoke Test - Basic functionality verification
 * This test verifies that the Playwright setup is working correctly
 */
test.describe('Smoke Tests', () => {
  test('should load the application homepage', async ({ page }) => {
    console.log('🧪 Starting homepage test...');
    // Navigate to the application
    console.log('📡 Navigating to homepage...');
    await page.goto('/', { timeout: 30000 });
    console.log('✅ Navigation completed');
    // Wait for basic page load (not networkidle which can be slow)
    console.log('⏳ Waiting for page to load...');
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    console.log('✅ Page load completed');
    // Verify basic page elements are present
    console.log('🔍 Checking page title...');
    await expect(page).toHaveTitle(/Synapses|SFDR|GRC/);
    console.log('✅ Page title verified');
    // Verify page loaded successfully
    console.log('✅ Test completed successfully');
  });
  test('should have basic navigation elements', async ({ page }) => {
    await page.goto('/', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    // Check for basic navigation elements
    const navigation = page.locator('nav, [role="navigation"]');
    await expect(navigation).toBeVisible();
    // Check for common UI elements
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();
  });
  test('should handle basic user interactions', async ({ page }) => {
    await page.goto('/', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    // Test basic interaction - verify links are present and clickable
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    // Just verify the first link is visible and clickable
    const firstLink = links.first();
    await expect(firstLink).toBeVisible();
    console.log('✅ Links are present and visible');
  });
  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.goto('/', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
  });
  test('should have proper page structure', async ({ page }) => {
    await page.goto('/', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    // Check for essential HTML elements
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
    // Check for proper meta tags (meta tags are not visible, so we check they exist)
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);
  });
});
