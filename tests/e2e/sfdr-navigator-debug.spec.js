import { test } from '@playwright/test';
/**
 * Debug test to see what content is actually being rendered on SFDR Navigator
 */
test.describe('SFDR Navigator Debug', () => {
  test('should debug SFDR Navigator content', async ({ page }) => {
    console.log('🔍 Debugging SFDR Navigator content...');
    await page.goto('/sfdr-navigator', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    // Get the full page content
    const pageContent = await page.content();
    console.log('📄 Page content length:', pageContent.length);
    // Check for any text content
    const bodyText = await page.locator('body').textContent();
    console.log('📝 Body text (first 500 chars):', bodyText?.substring(0, 500));
    // Check for specific elements
    const elements = ['div', 'h1', 'h2', 'h3', 'p', 'span', 'button', 'input', 'form'];
    for (const element of elements) {
      const count = await page.locator(element).count();
      console.log(`🔍 ${element} elements: ${count}`);
    }
    // Check for any React root
    const reactRoot = await page.locator('#root, [data-reactroot], [id*="root"]').count();
    console.log(`🔍 React root elements: ${reactRoot}`);
    // Check for any error messages
    const errorMessages = await page
      .locator('[class*="error"], [class*="Error"], [id*="error"], [id*="Error"]')
      .count();
    console.log(`🔍 Error elements: ${errorMessages}`);
    // Check for any alert messages
    const alerts = await page.locator('[role="alert"], .alert, [class*="alert"]').count();
    console.log(`🔍 Alert elements: ${alerts}`);
    // Take a screenshot
    await page.screenshot({ path: 'test-results/sfdr-navigator-debug.png' });
    console.log('📸 Debug screenshot saved');
    // Check if there's any content at all
    const hasAnyContent = bodyText && bodyText.trim().length > 0;
    console.log(`🔍 Has any content: ${hasAnyContent}`);
    if (!hasAnyContent) {
      console.log('⚠️ No content found - page might be empty or not rendering');
    } else {
      console.log('✅ Content found - component is rendering something');
    }
  });
});
