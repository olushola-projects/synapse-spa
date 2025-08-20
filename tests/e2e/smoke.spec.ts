import { expect, test } from '@playwright/test';

/**
 * Smoke Tests - Fast, reliable tests for core functionality
 * Based on GitHub best practices for Playwright testing
 */

test.describe('Smoke Tests', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/SFDR|Navigator|Synapse/i);
  });

  test('should display main navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Check for navigation elements
    const nav = page.locator('nav, [role="navigation"]');
    const hasNav = (await nav.count()) > 0;
    expect(hasNav).toBeTruthy();
  });

  test('should load SFDR Navigator page', async ({ page }) => {
    await page.goto('/sfdr-navigator', { waitUntil: 'domcontentloaded' });

    // Basic page load verification
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('body')).toBeVisible();
  });
});
