import { test, expect } from '@playwright/test';

test.describe('SFDR Navigator Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the SFDR Navigator page
    await page.goto('/nexus-agent', { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  });

  test('should load SFDR Navigator page successfully', async ({ page }) => {
    // Check if the page loads without component errors
    await expect(page.locator('text=Component Error')).not.toBeVisible();
    
    // Check for main header
    await expect(page.locator('h1:has-text("SFDR Navigator")')).toBeVisible();
    
    // Check for the unified platform badge
    await expect(page.locator('text=Unified Platform')).toBeVisible();
    
    // Check for the main description
    await expect(page.locator('text=Next-generation regulatory compliance platform')).toBeVisible();
  });

  test('should display all navigation tabs', async ({ page }) => {
    // Check for all tab buttons
    await expect(page.locator('text=AI Chat')).toBeVisible();
    await expect(page.locator('text=Classify')).toBeVisible();
    await expect(page.locator('text=Documents')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
    await expect(page.locator('text=Export')).toBeVisible();
  });

  test('should show statistics dashboard', async ({ page }) => {
    // Check for statistics cards
    await expect(page.locator('text=Funds Analyzed')).toBeVisible();
    await expect(page.locator('text=Compliance Score')).toBeVisible();
    await expect(page.locator('text=Documents Processed')).toBeVisible();
    await expect(page.locator('text=AI Citations')).toBeVisible();
  });

  test('should navigate between tabs', async ({ page }) => {
    // Test AI Chat tab
    await page.click('text=Classify');
    await expect(page.locator('text=SFDR Fund Classification')).toBeVisible();
    await expect(page.locator('text=Classify your fund as Article 6, 8, or 9')).toBeVisible();
    
    // Test Documents tab
    await page.click('text=Documents');
    await expect(page.locator('text=Document Analysis')).toBeVisible();
    await expect(page.locator('text=Upload and analyze documents')).toBeVisible();
    
    // Test Analytics tab
    await page.click('text=Analytics');
    await expect(page.locator('text=Analytics Dashboard')).toBeVisible();
    await expect(page.locator('text=View comprehensive analytics')).toBeVisible();
    
    // Test Export tab
    await page.click('text=Export');
    await expect(page.locator('text=Export Analysis & Reports')).toBeVisible();
    await expect(page.locator('text=Export comprehensive SFDR analysis')).toBeVisible();
    
    // Return to Chat tab
    await page.click('text=AI Chat');
    await expect(page.locator('text=AI-Powered SFDR Chat')).toBeVisible();
  });

  test('should display loading states for each tab', async ({ page }) => {
    // Check loading states for each tab
    await expect(page.locator('text=Chat interface is being loaded')).toBeVisible();
    
    await page.click('text=Classify');
    await expect(page.locator('text=Classification form is being loaded')).toBeVisible();
    
    await page.click('text=Documents');
    await expect(page.locator('text=Document upload interface is being loaded')).toBeVisible();
    
    await page.click('text=Analytics');
    await expect(page.locator('text=Analytics dashboard is being loaded')).toBeVisible();
    
    await page.click('text=Export');
    await expect(page.locator('text=Export interface is being loaded')).toBeVisible();
  });

  test('should have responsive design elements', async ({ page }) => {
    // Check for responsive design elements
    await expect(page.locator('.grid.grid-cols-2.md\\:grid-cols-4')).toBeVisible();
    await expect(page.locator('.hidden.sm\\:inline')).toBeVisible();
  });

  test('should display proper icons and visual elements', async ({ page }) => {
    // Check for icons
    await expect(page.locator('svg')).toBeVisible();
    
    // Check for gradient backgrounds
    await expect(page.locator('.bg-gradient-to-br')).toBeVisible();
    await expect(page.locator('.bg-gradient-to-r')).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Check that no error overlay is visible
    await expect(page.locator('text=Component Error')).not.toBeVisible();
    await expect(page.locator('text=This component encountered an error')).not.toBeVisible();
    
    // Check that the main content is visible
    await expect(page.locator('h1:has-text("SFDR Navigator")')).toBeVisible();
  });

  test('should have proper accessibility elements', async ({ page }) => {
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h3')).toBeVisible();
    
    // Check for proper button elements
    await expect(page.locator('button')).toBeVisible();
    
    // Check for proper tab roles
    await expect(page.locator('[role="tab"]')).toBeVisible();
  });

  test('should display animated elements', async ({ page }) => {
    // Check for motion elements (framer-motion)
    await expect(page.locator('.motion')).toBeVisible();
    
    // Check for animation classes
    await expect(page.locator('.animate')).toBeVisible();
  });

  test('should have proper card layout', async ({ page }) => {
    // Check for main card container
    await expect(page.locator('.border-2.shadow-xl')).toBeVisible();
    
    // Check for card header and content
    await expect(page.locator('.pb-4')).toBeVisible();
  });
});
