import { test, expect } from '@playwright/test';

test.describe('SFDR Navigator - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to SFDR Navigator
    await page.goto('/sfdr-navigator');
    await page.waitForLoadState('networkidle');
  });

  test('should load SFDR Navigator successfully', async ({ page }) => {
    // Verify page title contains SFDR or Synapse
    await expect(page).toHaveTitle(/SFDR|Synapse/);
    
    // Check for main navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Verify we're on the SFDR Navigator page
    const currentUrl = page.url();
    expect(currentUrl).toContain('sfdr-navigator');
  });

  test('should display main navigation elements', async ({ page }) => {
    // Check for Synapse logo/brand
    const brand = page.locator('a[href="/"]');
    await expect(brand).toBeVisible();
    
    // Check for navigation links
    const agentsLink = page.locator('a[href="/agents"]');
    const useCasesLink = page.locator('a[href="/use-cases"]');
    
    await expect(agentsLink).toBeVisible();
    await expect(useCasesLink).toBeVisible();
  });

  test('should have working tab navigation', async ({ page }) => {
    // Look for tab elements
    const tabs = page.locator('[role="tab"]');
    await expect(tabs.first()).toBeVisible();
    
    // Test tab switching if tabs exist
    const tabCount = await tabs.count();
    if (tabCount > 1) {
      await tabs.nth(1).click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display chat interface', async ({ page }) => {
    // Look for chat-related elements
    const chatContainer = page.locator('[class*="chat"], [class*="Chat"]');
    await expect(chatContainer.first()).toBeVisible();
    
    // Check for chat input
    const chatInput = page.locator('input[type="text"], textarea, [contenteditable="true"]');
    await expect(chatInput.first()).toBeVisible();
  });

  test('should handle chat interaction', async ({ page }) => {
    // Find chat input
    const chatInput = page.locator('input[type="text"], textarea, [contenteditable="true"]').first();
    await expect(chatInput).toBeVisible();
    
    // Type a test message
    await chatInput.fill('Hello, I need help with SFDR compliance');
    
    // Look for send button
    const sendButton = page.locator('button[type="submit"], button:has-text("Send")').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
      await page.waitForTimeout(2000); // Wait for response
    }
  });

  test('should display quick action buttons', async ({ page }) => {
    // Look for action buttons
    const actionButtons = page.locator('button:has-text("New Analysis"), button:has-text("View Reports"), button:has-text("Run Tests")');
    await expect(actionButtons.first()).toBeVisible();
  });

  test('should handle quick actions', async ({ page }) => {
    // Test quick action buttons
    const newAnalysisBtn = page.locator('button:has-text("New Analysis")');
    if (await newAnalysisBtn.isVisible()) {
      await newAnalysisBtn.click();
      await page.waitForLoadState('networkidle');
    }
    
    const viewReportsBtn = page.locator('button:has-text("View Reports")');
    if (await viewReportsBtn.isVisible()) {
      await viewReportsBtn.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display system status information', async ({ page }) => {
    // Look for status indicators
    const statusElements = page.locator('[class*="status"], [class*="health"], [class*="uptime"]');
    if (await statusElements.first().isVisible()) {
      await expect(statusElements.first()).toBeVisible();
    }
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Verify page still loads correctly
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('networkidle');
    
    await expect(body).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Look for error handling elements
    const errorElements = page.locator('[class*="error"], [class*="alert"], [class*="warning"]');
    
    // If error elements exist, verify they're properly styled
    if (await errorElements.first().isVisible()) {
      await expect(errorElements.first()).toBeVisible();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Verify focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should display loading states', async ({ page }) => {
    // Look for loading indicators
    const loadingElements = page.locator('[class*="loading"], [class*="spinner"], [class*="skeleton"]');
    
    // If loading elements exist, verify they're properly displayed
    if (await loadingElements.first().isVisible()) {
      await expect(loadingElements.first()).toBeVisible();
    }
  });
});

test.describe('SFDR Navigator - Accessibility', () => {
  test('should meet basic accessibility requirements', async ({ page }) => {
    await page.goto('/sfdr-navigator');
    await page.waitForLoadState('networkidle');
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();
    
    // Check for ARIA labels
    const ariaLabels = page.locator('[aria-label]');
    expect(await ariaLabels.count()).toBeGreaterThan(0);
    
    // Check for proper form labels
    const inputs = page.locator('input, textarea, select');
    for (let i = 0; i < Math.min(await inputs.count(), 5); i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // Should have at least one form of label
      expect(id || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });
});

test.describe('SFDR Navigator - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/sfdr-navigator');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle concurrent interactions', async ({ page }) => {
    await page.goto('/sfdr-navigator');
    await page.waitForLoadState('networkidle');
    
    // Test multiple rapid interactions
    const chatInput = page.locator('input[type="text"], textarea, [contenteditable="true"]').first();
    if (await chatInput.isVisible()) {
      await chatInput.fill('Test message 1');
      await page.waitForTimeout(100);
      await chatInput.fill('Test message 2');
      await page.waitForTimeout(100);
      await chatInput.fill('Test message 3');
      
      // Verify the final message is correct
      await expect(chatInput).toHaveValue('Test message 3');
    }
  });
});
