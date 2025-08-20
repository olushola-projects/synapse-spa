import { test, expect } from '@playwright/test';
import { createTestHelper, TestData, Selectors } from './utils/test-helpers';
/**
 * Enhanced SFDR Classification End-to-End Tests
 * Comprehensive testing of the SFDR classification engine
 */
test.describe('SFDR Classification Engine', () => {
    let helper;
    test.beforeEach(async ({ page }) => {
        helper = createTestHelper(page);
        await helper.navigateTo('/sfdr-navigator');
    });
    test.describe('Basic Classification Workflow', () => {
        test('should complete full SFDR classification workflow successfully', async ({ page }) => {
            // Step 1: Verify page loads correctly
            await helper.expectText('SFDR Navigator');
            await helper.expectVisible(Selectors.fundNameInput);
            await helper.expectVisible(Selectors.fundDescriptionInput);
            await helper.expectVisible(Selectors.classifyButton);
            // Step 2: Fill in fund information
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            // Step 3: Submit classification
            await helper.clickButton(Selectors.classifyButton);
            // Step 4: Wait for results
            await helper.expectVisible(Selectors.classificationResult, 30000);
            // Step 5: Verify classification results
            await helper.expectText(/Article 8|Article 9/);
            await helper.expectText(/Confidence:/);
            await helper.expectText(/Compliance Score:/);
            // Step 6: Take screenshot for documentation
            await helper.takeScreenshot('sfdr-classification-success');
        });
        test('should handle different fund types correctly', async ({ page }) => {
            const testCases = [
                {
                    name: 'Article 8 Fund',
                    description: 'A fund that promotes environmental and social characteristics',
                    expectedArticle: 'Article 8'
                },
                {
                    name: 'Article 9 Fund',
                    description: 'A fund that has sustainable investment as its objective',
                    expectedArticle: 'Article 9'
                },
                {
                    name: 'Article 6 Fund',
                    description: 'A traditional fund without specific sustainability focus',
                    expectedArticle: 'Article 6'
                }
            ];
            for (const testCase of testCases) {
                // Fill form with test case data
                await helper.fillField(Selectors.fundNameInput, testCase.name);
                await helper.fillField(Selectors.fundDescriptionInput, testCase.description);
                // Submit classification
                await helper.clickButton(Selectors.classifyButton);
                // Wait for and verify results
                await helper.expectVisible(Selectors.classificationResult, 30000);
                await helper.expectText(testCase.expectedArticle);
                // Clear form for next test
                await helper.clearElement(Selectors.fundNameInput);
                await helper.clearElement(Selectors.fundDescriptionInput);
            }
        });
    });
    test.describe('Form Validation', () => {
        test('should validate required fields', async ({ page }) => {
            // Try to submit without input
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectText(/Fund name is required/);
            await helper.expectText(/Fund description is required/);
        });
        test('should validate fund name length', async ({ page }) => {
            // Test too short name
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.invalidFundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.shortDescription);
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectText(/Fund name must be at least 3 characters/);
            // Test too long name
            await helper.fillField(Selectors.fundNameInput, 'A'.repeat(101));
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectText(/Fund name must be less than 100 characters/);
        });
        test('should validate fund description length', async ({ page }) => {
            // Test too short description
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, 'Short');
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectText(/Fund description must be at least 10 characters/);
            // Test too long description
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.longDescription);
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectText(/Fund description must be less than 1000 characters/);
        });
        test('should validate special characters and formatting', async ({ page }) => {
            // Test with special characters
            await helper.fillField(Selectors.fundNameInput, 'Fund with <script>alert("xss")</script>');
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.shortDescription);
            await helper.clickButton(Selectors.classifyButton);
            // Should handle special characters gracefully
            await helper.expectVisible(Selectors.classificationResult, 30000);
        });
    });
    test.describe('API Integration', () => {
        test('should handle API success responses', async ({ page }) => {
            // Mock successful API response
            await helper.mockApiResponse('/api/sfdr/classify', {
                success: true,
                data: {
                    article: 'Article 8',
                    confidence: 0.95,
                    complianceScore: 85,
                    reasoning: 'Fund promotes environmental characteristics'
                }
            });
            // Fill and submit form
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            // Verify results
            await helper.expectVisible(Selectors.classificationResult, 30000);
            await helper.expectText('Article 8');
            await helper.expectText('95%');
            await helper.expectText('85');
        });
        test('should handle API error responses', async ({ page }) => {
            // Mock API error
            await helper.mockApiError('/api/sfdr/classify', 500);
            // Fill and submit form
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            // Verify error handling
            await helper.expectText(/An error occurred while classifying the fund/);
            await helper.expectVisible(Selectors.errorAlert);
        });
        test('should handle API timeout', async ({ page }) => {
            // Mock slow API response
            await page.route('/api/sfdr/classify', async (route) => {
                await new Promise(resolve => setTimeout(resolve, 35000)); // Longer than timeout
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true, data: {} })
                });
            });
            // Fill and submit form
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            // Verify timeout handling
            await helper.expectText(/Request timed out/);
        });
        test('should handle network connectivity issues', async ({ page }) => {
            // Mock network failure
            await page.route('/api/sfdr/classify', async (route) => {
                await route.abort('failed');
            });
            // Fill and submit form
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            // Verify network error handling
            await helper.expectText(/Network error/);
        });
    });
    test.describe('User Experience', () => {
        test('should show loading state during classification', async ({ page }) => {
            // Mock slow API response
            await page.route('/api/sfdr/classify', async (route) => {
                await new Promise(resolve => setTimeout(resolve, 2000));
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true, data: { article: 'Article 8' } })
                });
            });
            // Fill and submit form
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            // Verify loading state
            await helper.expectVisible(Selectors.loadingSpinner);
            await helper.expectText(/Classifying fund/);
            // Wait for completion
            await helper.waitForLoadingComplete();
            await helper.expectVisible(Selectors.classificationResult);
        });
        test('should allow retry after failure', async ({ page }) => {
            // First attempt - mock failure
            await helper.mockApiError('/api/sfdr/classify', 500);
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectText(/An error occurred/);
            // Second attempt - mock success
            await helper.mockApiResponse('/api/sfdr/classify', {
                success: true,
                data: { article: 'Article 8', confidence: 0.9 }
            });
            await helper.clickButton('[data-testid="retry-button"]');
            await helper.expectVisible(Selectors.classificationResult, 30000);
        });
        test('should provide clear feedback messages', async ({ page }) => {
            // Test validation messages
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectText(/Please fill in all required fields/);
            // Test success message
            await helper.mockApiResponse('/api/sfdr/classify', {
                success: true,
                data: { article: 'Article 8' }
            });
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectVisible(Selectors.classificationResult, 30000);
            await helper.expectText(/Classification completed successfully/);
        });
    });
    test.describe('Accessibility', () => {
        test('should have proper ARIA labels and roles', async ({ page }) => {
            // Check form accessibility
            await expect(page.getByLabel(/Fund name/i)).toBeVisible();
            await expect(page.getByLabel(/Fund description/i)).toBeVisible();
            await expect(page.getByRole('button', { name: /classify/i })).toBeVisible();
        });
        test('should support keyboard navigation', async ({ page }) => {
            // Navigate with keyboard
            await page.keyboard.press('Tab');
            await expect(page.locator(Selectors.fundNameInput)).toBeFocused();
            await page.keyboard.press('Tab');
            await expect(page.locator(Selectors.fundDescriptionInput)).toBeFocused();
            await page.keyboard.press('Tab');
            await expect(page.locator(Selectors.classifyButton)).toBeFocused();
        });
        test('should announce loading states to screen readers', async ({ page }) => {
            // Mock slow response
            await page.route('/api/sfdr/classify', async (route) => {
                await new Promise(resolve => setTimeout(resolve, 2000));
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true, data: { article: 'Article 8' } })
                });
            });
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            // Check for ARIA live regions
            await expect(page.locator('[aria-live="polite"]')).toBeVisible();
        });
    });
    test.describe('Performance', () => {
        test('should complete classification within acceptable time', async ({ page }) => {
            const startTime = Date.now();
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectVisible(Selectors.classificationResult, 30000);
            const endTime = Date.now();
            const duration = endTime - startTime;
            // Should complete within 30 seconds
            expect(duration).toBeLessThan(30000);
        });
        test('should handle concurrent requests', async ({ page }) => {
            // Open multiple tabs and submit simultaneously
            const contexts = [];
            const pages = [];
            for (let i = 0; i < 3; i++) {
                const context = await page.context().browser()?.newContext();
                const newPage = await context?.newPage();
                if (context && newPage) {
                    contexts.push(context);
                    pages.push(newPage);
                }
            }
            // Submit requests from all pages
            const promises = pages.map(async (p, index) => {
                const pageHelper = createTestHelper(p);
                await pageHelper.navigateTo('/sfdr-navigator');
                await pageHelper.fillField(Selectors.fundNameInput, `Fund ${index + 1}`);
                await pageHelper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.shortDescription);
                await pageHelper.clickButton(Selectors.classifyButton);
                await pageHelper.expectVisible(Selectors.classificationResult, 30000);
            });
            await Promise.all(promises);
            // Clean up
            for (const context of contexts) {
                await context.close();
            }
        });
    });
    test.describe('Data Persistence', () => {
        test('should save classification history', async ({ page }) => {
            // Complete a classification
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectVisible(Selectors.classificationResult, 30000);
            // Navigate to history page
            await helper.navigateTo('/classification-history');
            // Verify history entry
            await helper.expectText(TestData.sfdr.fundName);
            await helper.expectText(/Article 8|Article 9/);
        });
        test('should allow export of classification results', async ({ page }) => {
            // Complete a classification
            await helper.fillField(Selectors.fundNameInput, TestData.sfdr.fundName);
            await helper.fillField(Selectors.fundDescriptionInput, TestData.sfdr.fundDescription);
            await helper.clickButton(Selectors.classifyButton);
            await helper.expectVisible(Selectors.classificationResult, 30000);
            // Click export button
            await helper.clickButton('[data-testid="export-button"]');
            // Verify download
            const downloadPromise = page.waitForEvent('download');
            await downloadPromise;
        });
    });
});
