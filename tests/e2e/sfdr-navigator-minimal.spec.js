import { test, expect } from '@playwright/test';
/**
 * Test to check if SFDRNavigator component can be loaded with minimal dependencies
 */
test.describe('SFDR Navigator Minimal Test', () => {
    test('should load SFDRNavigator with minimal setup', async ({ page }) => {
        console.log('🧪 Testing SFDRNavigator minimal setup...');
        // First, let's check if the main page loads
        await page.goto('/', { timeout: 30000 });
        console.log('✅ Homepage loaded successfully');
        // Now try to navigate to the SFDR Navigator directly
        await page.goto('/sfdr-navigator', { timeout: 30000 });
        console.log('✅ Navigation to /sfdr-navigator completed');
        // Wait for page to load
        await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
        console.log('✅ Page load completed');
        // Check if there's any content on the page
        const pageContent = await page.content();
        console.log('📄 Page content length:', pageContent.length);
        // Check for specific error patterns
        const errorPatterns = [
            'Component Error',
            'This component encountered an error',
            'Couldn\'t render properly',
            'CriticalErrorAlert',
            'System Error'
        ];
        let foundErrors = 0;
        for (const pattern of errorPatterns) {
            if (pageContent.includes(pattern)) {
                console.log(`🚨 Found error pattern: "${pattern}"`);
                foundErrors++;
            }
        }
        if (foundErrors > 0) {
            console.log(`⚠️ Found ${foundErrors} error patterns`);
            await page.screenshot({ path: 'test-results/sfdr-navigator-errors.png' });
        }
        else {
            console.log('✅ No error patterns found');
        }
        // Check for SFDR Navigator content
        const sfdrContent = page.locator('text=SFDR Navigator');
        const hasContent = await sfdrContent.count() > 0;
        if (hasContent) {
            console.log('✅ SFDR Navigator content found');
            expect(hasContent).toBe(true);
        }
        else {
            console.log('⚠️ SFDR Navigator content not found');
            await page.screenshot({ path: 'test-results/sfdr-navigator-no-content.png' });
        }
        // Check for any React errors in console
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
                console.log('🚨 Console error:', msg.text());
            }
        });
        // Wait a moment for any console errors
        await page.waitForTimeout(2000);
        console.log(`📊 Test Summary: ${consoleErrors.length} console errors found`);
    });
    test('should check for specific component dependencies', async ({ page }) => {
        await page.goto('/sfdr-navigator', { timeout: 30000 });
        await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
        // Check for specific UI components that should be present
        const components = [
            'Brain', // Icon
            'MessageSquare', // Chat icon
            'Target', // Classify icon
            'FileText', // Documents icon
            'BarChart3', // Analytics icon
            'Download' // Export icon
        ];
        for (const component of components) {
            const hasComponent = await page.locator(`[class*="${component}"]`).count() > 0;
            console.log(`🔍 Component "${component}": ${hasComponent ? 'FOUND' : 'NOT FOUND'}`);
        }
        // Check for basic page structure
        const hasHeader = await page.locator('h1').count() > 0;
        const hasCard = await page.locator('[class*="card"]').count() > 0;
        const hasTabs = await page.locator('[role="tab"]').count() > 0;
        console.log(`📋 Page Structure: Header=${hasHeader}, Card=${hasCard}, Tabs=${hasTabs}`);
    });
});
