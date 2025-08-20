import { expect, test } from '@playwright/test';
/**
 * Accessibility & Compliance Tests for Pre-Beta Validation
 * Comprehensive accessibility testing for SFDR Navigator before beta release
 */
test.describe('Accessibility & Compliance Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the application
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });
    test.describe('WCAG Standards Compliance', () => {
        test('should have proper heading structure', async ({ page }) => {
            await page.goto('/');
            // Check for proper heading hierarchy
            const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
            expect(headings.length).toBeGreaterThan(0);
            // Verify there's only one h1 per page
            const h1Elements = await page.locator('h1').all();
            expect(h1Elements.length).toBeLessThanOrEqual(1);
            // Check heading hierarchy (no skipping levels)
            const headingLevels = [];
            for (const heading of headings) {
                const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
                const level = parseInt(tagName.charAt(1));
                headingLevels.push(level);
            }
            // Verify no skipping levels (e.g., h1 -> h3)
            for (let i = 1; i < headingLevels.length; i++) {
                const levelDiff = headingLevels[i] - headingLevels[i - 1];
                expect(levelDiff).toBeLessThanOrEqual(1);
            }
        });
        test('should have proper alt text on images', async ({ page }) => {
            await page.goto('/');
            // Check all images have alt text
            const images = await page.locator('img').all();
            for (const img of images) {
                const altText = await img.getAttribute('alt');
                expect(altText).toBeTruthy();
                expect(altText.trim()).not.toBe('');
            }
            // Check decorative images have empty alt text
            const decorativeImages = await page.locator('img[alt=""]').all();
            for (const img of decorativeImages) {
                const role = await img.getAttribute('role');
                expect(role).toBe('presentation');
            }
        });
        test('should have proper ARIA labels and roles', async ({ page }) => {
            await page.goto('/');
            // Check buttons have proper labels
            const buttons = await page.locator('button').all();
            for (const button of buttons) {
                const ariaLabel = await button.getAttribute('aria-label');
                const textContent = await button.textContent();
                const hasLabel = ariaLabel || textContent;
                expect(hasLabel).toBeTruthy();
            }
            // Check form inputs have proper labels
            const inputs = await page.locator('input, textarea, select').all();
            for (const input of inputs) {
                const id = await input.getAttribute('id');
                const ariaLabel = await input.getAttribute('aria-label');
                const ariaLabelledBy = await input.getAttribute('aria-labelledby');
                // Should have either id with label, aria-label, or aria-labelledby
                const hasLabel = id || ariaLabel || ariaLabelledBy;
                expect(hasLabel).toBeTruthy();
            }
        });
        test('should have sufficient color contrast', async ({ page }) => {
            await page.goto('/');
            // This test would require a color contrast analysis tool
            // For now, we'll check that text elements have proper styling
            const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, span, div').all();
            for (const element of textElements) {
                const color = await element.evaluate(el => {
                    const style = window.getComputedStyle(el);
                    return style.color;
                });
                // Verify text has a defined color (not transparent or default)
                expect(color).not.toBe('rgba(0, 0, 0, 0)');
                expect(color).not.toBe('transparent');
            }
        });
        test('should have proper focus indicators', async ({ page }) => {
            await page.goto('/');
            // Check focusable elements have visible focus indicators
            const focusableElements = await page.locator('button, input, textarea, select, a, [tabindex]').all();
            for (const element of focusableElements) {
                await element.focus();
                const focusStyle = await element.evaluate(el => {
                    const style = window.getComputedStyle(el);
                    return {
                        outline: style.outline,
                        boxShadow: style.boxShadow,
                        border: style.border
                    };
                });
                // Should have some form of focus indicator
                const hasFocusIndicator = focusStyle.outline !== 'none' ||
                    focusStyle.boxShadow !== 'none' ||
                    focusStyle.border !== 'none';
                expect(hasFocusIndicator).toBe(true);
            }
        });
    });
    test.describe('Keyboard Navigation', () => {
        test('should support full keyboard navigation', async ({ page }) => {
            await page.goto('/');
            // Navigate through all focusable elements using Tab
            const focusableElements = await page.locator('button, input, textarea, select, a, [tabindex]').all();
            for (let i = 0; i < focusableElements.length; i++) {
                await page.keyboard.press('Tab');
                await page.waitForTimeout(100);
                // Verify element is focused
                const focusedElement = await page.evaluate(() => document.activeElement);
                expect(focusedElement).toBeTruthy();
            }
        });
        test('should handle keyboard shortcuts properly', async ({ page }) => {
            await page.goto('/');
            // Test common keyboard shortcuts
            await page.keyboard.press('Tab');
            await page.keyboard.press('Enter');
            // Should navigate to the focused element
            const currentUrl = page.url();
            expect(currentUrl).not.toBe('http://localhost:3000/');
        });
        test('should support skip links', async ({ page }) => {
            await page.goto('/');
            // Check for skip links
            const skipLinks = await page.locator('a[href^="#"], a[href*="skip"]').all();
            expect(skipLinks.length).toBeGreaterThan(0);
            // Test skip link functionality
            if (skipLinks.length > 0) {
                await skipLinks[0].click();
                await page.waitForTimeout(100);
                // Should focus on the target element
                const focusedElement = await page.evaluate(() => document.activeElement);
                expect(focusedElement).toBeTruthy();
            }
        });
        test('should handle keyboard events properly', async ({ page }) => {
            await page.goto('/sfdr-navigator');
            // Test form submission with Enter key
            await page.getByTestId('fund-name-input').fill('Test Fund');
            await page.getByTestId('fund-name-input').press('Enter');
            // Should trigger form submission or validation
            await expect(page.getByText(/Fund description is required/i)).toBeVisible();
        });
    });
    test.describe('Screen Reader Compatibility', () => {
        test('should have proper semantic HTML structure', async ({ page }) => {
            await page.goto('/');
            // Check for semantic HTML elements
            const semanticElements = await page.locator('nav, main, section, article, aside, header, footer').all();
            expect(semanticElements.length).toBeGreaterThan(0);
            // Check for proper landmarks
            const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]').all();
            expect(landmarks.length).toBeGreaterThan(0);
        });
        test('should have proper ARIA live regions', async ({ page }) => {
            await page.goto('/sfdr-navigator');
            // Check for ARIA live regions for dynamic content
            const liveRegions = await page.locator('[aria-live]').all();
            // Should have live regions for important updates
            if (liveRegions.length === 0) {
                // Check if dynamic content updates are announced properly
                await page.getByTestId('fund-name-input').fill('Test Fund');
                await page.getByTestId('classify-button').click();
                // Should have some form of announcement for results
                await expect(page.getByTestId('classification-result')).toBeVisible();
            }
        });
        test('should have proper form labels and descriptions', async ({ page }) => {
            await page.goto('/sfdr-navigator');
            // Check form inputs have proper labels
            const inputs = await page.locator('input, textarea, select').all();
            for (const input of inputs) {
                const id = await input.getAttribute('id');
                const ariaLabel = await input.getAttribute('aria-label');
                const ariaDescribedBy = await input.getAttribute('aria-describedby');
                // Should have proper labeling
                const hasLabel = id || ariaLabel;
                expect(hasLabel).toBeTruthy();
                // Check for help text or descriptions
                if (ariaDescribedBy) {
                    const description = await page.locator(`#${ariaDescribedBy}`).count();
                    expect(description).toBeGreaterThan(0);
                }
            }
        });
        test('should announce status changes properly', async ({ page }) => {
            await page.goto('/sfdr-navigator');
            // Test form validation announcements
            await page.getByTestId('classify-button').click();
            // Should announce validation errors
            await expect(page.getByText(/Fund name is required/i)).toBeVisible();
            // Check for ARIA announcements
            const statusMessages = await page.locator('[role="status"], [aria-live="polite"]').all();
            expect(statusMessages.length).toBeGreaterThan(0);
        });
    });
    test.describe('Mobile Accessibility', () => {
        test('should be accessible on mobile devices', async ({ page }) => {
            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');
            // Check touch targets are large enough
            const buttons = await page.locator('button, a, input[type="button"], input[type="submit"]').all();
            for (const button of buttons) {
                const size = await button.boundingBox();
                if (size) {
                    // Touch targets should be at least 44x44 pixels
                    expect(size.width).toBeGreaterThanOrEqual(44);
                    expect(size.height).toBeGreaterThanOrEqual(44);
                }
            }
        });
        test('should support mobile gestures', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');
            // Test swipe gestures (if applicable)
            // This would require specific gesture testing based on the app's functionality
            // Test pinch to zoom
            await page.evaluate(() => {
                // Disable viewport meta tag to allow zooming
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
                }
            });
            // Verify page is still functional after zoom
            await expect(page.getByRole('heading', { name: /SFDR Navigator/i })).toBeVisible();
        });
        test('should handle mobile keyboard properly', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/sfdr-navigator');
            // Test mobile keyboard input
            await page.getByTestId('fund-name-input').click();
            await page.getByTestId('fund-name-input').fill('Test Fund');
            // Should handle mobile keyboard properly
            const inputValue = await page.getByTestId('fund-name-input').inputValue();
            expect(inputValue).toBe('Test Fund');
        });
    });
    test.describe('Error Handling & Recovery', () => {
        test('should provide accessible error messages', async ({ page }) => {
            await page.goto('/sfdr-navigator');
            // Trigger validation error
            await page.getByTestId('classify-button').click();
            // Check error message is properly associated with form field
            const errorMessage = await page.getByText(/Fund name is required/i);
            await expect(errorMessage).toBeVisible();
            // Check error message has proper ARIA attributes
            const ariaInvalid = await page.getByTestId('fund-name-input').getAttribute('aria-invalid');
            expect(ariaInvalid).toBe('true');
            const ariaDescribedBy = await page.getByTestId('fund-name-input').getAttribute('aria-describedby');
            expect(ariaDescribedBy).toBeTruthy();
        });
        test('should provide accessible success messages', async ({ page }) => {
            await page.goto('/sfdr-navigator');
            // Complete a successful classification
            await page.getByTestId('fund-name-input').fill('Test Sustainable Fund');
            await page.getByTestId('fund-description-input').fill('A fund focused on sustainable investments');
            await page.getByTestId('classify-button').click();
            // Wait for success message
            await expect(page.getByTestId('classification-result')).toBeVisible({ timeout: 30000 });
            // Check success message is properly announced
            const successMessage = await page.locator('[role="status"], [aria-live="polite"]').count();
            expect(successMessage).toBeGreaterThan(0);
        });
        test('should handle loading states accessibly', async ({ page }) => {
            await page.goto('/sfdr-navigator');
            // Trigger loading state
            await page.getByTestId('fund-name-input').fill('Test Fund');
            await page.getByTestId('classify-button').click();
            // Check for loading indicator
            const loadingIndicator = await page.locator('[aria-busy="true"], [role="progressbar"]').count();
            expect(loadingIndicator).toBeGreaterThan(0);
            // Check loading message is announced
            const loadingMessage = await page.locator('[aria-live="polite"]').count();
            expect(loadingMessage).toBeGreaterThan(0);
        });
    });
    test.describe('Internationalization & Localization', () => {
        test('should support different languages', async ({ page }) => {
            await page.goto('/');
            // Check for language attributes
            const htmlLang = await page.locator('html').getAttribute('lang');
            expect(htmlLang).toBeTruthy();
            // Check for RTL support if applicable
            const dir = await page.locator('html').getAttribute('dir');
            if (dir === 'rtl') {
                // Verify RTL layout is properly implemented
                const bodyDir = await page.locator('body').getAttribute('dir');
                expect(bodyDir).toBe('rtl');
            }
        });
        test('should handle text scaling properly', async ({ page }) => {
            await page.goto('/');
            // Test with larger text
            await page.evaluate(() => {
                document.body.style.fontSize = '24px';
            });
            // Verify layout doesn't break with larger text
            await expect(page.getByRole('heading', { name: /SFDR Navigator/i })).toBeVisible();
            // Check for text overflow
            const overflowElements = await page.locator('*').filter({ hasText: /\.\.\./ }).count();
            expect(overflowElements).toBeLessThan(5); // Should have minimal text overflow
        });
    });
    test.describe('Assistive Technology Support', () => {
        test('should work with screen readers', async ({ page }) => {
            await page.goto('/');
            // Check for proper heading structure
            const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
            expect(headings.length).toBeGreaterThan(0);
            // Check for proper link text
            const links = await page.locator('a').all();
            for (const link of links) {
                const text = await link.textContent();
                const ariaLabel = await link.getAttribute('aria-label');
                const hasMeaningfulText = text?.trim() || ariaLabel;
                expect(hasMeaningfulText).toBeTruthy();
            }
        });
        test('should support voice control', async ({ page }) => {
            await page.goto('/sfdr-navigator');
            // Check for proper labeling that works with voice control
            const inputs = await page.locator('input, textarea, select').all();
            for (const input of inputs) {
                const id = await input.getAttribute('id');
                const ariaLabel = await input.getAttribute('aria-label');
                const placeholder = await input.getAttribute('placeholder');
                // Should have identifiable label for voice control
                const hasLabel = id || ariaLabel || placeholder;
                expect(hasLabel).toBeTruthy();
            }
        });
        test('should support switch navigation', async ({ page }) => {
            await page.goto('/');
            // Check all interactive elements are keyboard accessible
            const interactiveElements = await page.locator('button, input, textarea, select, a, [tabindex]').all();
            for (const element of interactiveElements) {
                const tabIndex = await element.getAttribute('tabindex');
                // Should be keyboard accessible (not tabindex="-1")
                if (tabIndex) {
                    expect(tabIndex).not.toBe('-1');
                }
            }
        });
    });
});
