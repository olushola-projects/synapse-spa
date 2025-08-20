import { test, expect } from '@playwright/test';

/**
 * Test to reproduce and diagnose the component error on /nexus-agent page
 */

test.describe('Nexus Agent Error Diagnosis', () => {
  test('should diagnose component error on nexus-agent page', async ({ page }) => {
    console.log('🔍 Starting nexus-agent error diagnosis...');

    // Navigate to the nexus-agent page
    await page.goto('/nexus-agent', { timeout: 30000 });
    console.log('✅ Navigation to /nexus-agent completed');

    // Wait for page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    console.log('✅ Page load completed');

    // Check if there's a component error alert
    const errorAlert = page.locator('[data-testid="critical-error-alert"], .alert, [role="alert"]');
    const hasError = (await errorAlert.count()) > 0;

    if (hasError) {
      console.log('⚠️ Component error detected!');

      // Take a screenshot of the error
      await page.screenshot({ path: 'test-results/nexus-agent-error.png' });
      console.log('📸 Error screenshot saved');

      // Get error details
      const errorText = await errorAlert.textContent();
      console.log('📋 Error details:', errorText);

      // Check for specific error patterns
      const errorContent = await page.content();

      if (errorContent.includes('Component Error')) {
        console.log('🎯 Found "Component Error" message');
      }

      if (errorContent.includes('This component encountered an error')) {
        console.log('🎯 Found component error description');
      }

      // Check console for JavaScript errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
          console.log('🚨 Console error:', msg.text());
        }
      });

      // Wait a moment for any console errors
      await page.waitForTimeout(2000);

      // Check for network errors
      const networkErrors: string[] = [];
      page.on('response', response => {
        if (!response.ok()) {
          networkErrors.push(`${response.url()} - ${response.status()}`);
          console.log('🌐 Network error:', `${response.url()} - ${response.status()}`);
        }
      });

      // Wait for network activity to settle
      await page.waitForTimeout(2000);

      // Log summary
      console.log('📊 Error Diagnosis Summary:');
      console.log(`- Component Error Alert: ${hasError ? 'YES' : 'NO'}`);
      console.log(`- Console Errors: ${consoleErrors.length}`);
      console.log(`- Network Errors: ${networkErrors.length}`);

      // For now, we expect the error to be present (this is what we're investigating)
      expect(hasError).toBe(true);
    } else {
      console.log('✅ No component error detected - page loaded successfully');

      // Check if the SFDR Navigator content is present
      const sfdrContent = page.locator('text=SFDR Navigator');
      const hasContent = (await sfdrContent.count()) > 0;

      if (hasContent) {
        console.log('✅ SFDR Navigator content is present');
        expect(hasContent).toBe(true);
      } else {
        console.log('⚠️ SFDR Navigator content not found');
        await page.screenshot({ path: 'test-results/nexus-agent-no-content.png' });
      }
    }
  });

  test('should check for specific error patterns', async ({ page }) => {
    await page.goto('/nexus-agent', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });

    // Check for various error patterns
    const errorPatterns = [
      'Component Error',
      'This component encountered an error',
      "Couldn't render properly",
      'Retry',
      'CriticalErrorAlert',
      'System Error'
    ];

    for (const pattern of errorPatterns) {
      const hasPattern = (await page.locator(`text=${pattern}`).count()) > 0;
      console.log(`🔍 Pattern "${pattern}": ${hasPattern ? 'FOUND' : 'NOT FOUND'}`);
    }

    // Check for React error boundary content
    const reactError = (await page.locator('text=React Error Boundary').count()) > 0;
    console.log(`🔍 React Error Boundary: ${reactError ? 'FOUND' : 'NOT FOUND'}`);

    // Check for any error-related elements
    const errorElements = await page
      .locator('[class*="error"], [class*="Error"], [id*="error"], [id*="Error"]')
      .count();
    console.log(`🔍 Error-related elements: ${errorElements}`);
  });
});
