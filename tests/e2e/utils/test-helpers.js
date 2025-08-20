import { expect } from '@playwright/test';
/**
 * Enhanced Test Utilities for Synapses GRC Platform
 * Provides common testing patterns and helper functions
 */
export class TestHelpers {
    page;
    constructor(page) {
        this.page = page;
    }
    /**
     * Wait for page to be fully loaded with network idle
     */
    async waitForPageLoad(timeout = 30000) {
        await this.page.waitForLoadState('networkidle', { timeout });
    }
    /**
     * Navigate to a page and wait for it to load
     */
    async navigateTo(path) {
        await this.page.goto(path);
        await this.waitForPageLoad();
    }
    /**
     * Fill a form field with validation
     */
    async fillField(selector, value) {
        const field = this.page.locator(selector);
        await field.waitFor({ state: 'visible' });
        await field.fill(value);
    }
    /**
     * Click a button with proper waiting
     */
    async clickButton(selector) {
        const button = this.page.locator(selector);
        await button.waitFor({ state: 'visible' });
        await button.click();
    }
    /**
     * Wait for and verify text content
     */
    async expectText(text, timeout = 10000) {
        await expect(this.page.getByText(text)).toBeVisible({ timeout });
    }
    /**
     * Wait for and verify element is visible
     */
    async expectVisible(selector, timeout = 10000) {
        await expect(this.page.locator(selector)).toBeVisible({ timeout });
    }
    /**
     * Wait for and verify element is not visible
     */
    async expectNotVisible(selector, timeout = 10000) {
        await expect(this.page.locator(selector)).not.toBeVisible({ timeout });
    }
    /**
     * Take a screenshot with timestamp
     */
    async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await this.page.screenshot({
            path: `test-results/screenshots/${name}-${timestamp}.png`,
            fullPage: true
        });
    }
    /**
     * Mock API response
     */
    async mockApiResponse(url, response) {
        await this.page.route(url, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(response)
            });
        });
    }
    /**
     * Mock API error
     */
    async mockApiError(url, status = 500) {
        await this.page.route(url, async (route) => {
            await route.fulfill({
                status,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Mock API Error' })
            });
        });
    }
    /**
     * Wait for API call to complete
     */
    async waitForApiCall(url, timeout = 30000) {
        await this.page.waitForResponse(response => response.url().includes(url), { timeout });
    }
    /**
     * Get element by test ID
     */
    getByTestId(testId) {
        return this.page.getByTestId(testId);
    }
    /**
     * Get element by role
     */
    getByRole(role, options) {
        return this.page.getByRole(role, options);
    }
    /**
     * Get element by text
     */
    getByText(text) {
        return this.page.getByText(text);
    }
    /**
     * Wait for loading spinner to disappear
     */
    async waitForLoadingComplete() {
        await this.page.waitForSelector('[data-testid="loading-spinner"]', {
            state: 'hidden',
            timeout: 30000
        });
    }
    /**
     * Check if element exists
     */
    async elementExists(selector) {
        return await this.page.locator(selector).count() > 0;
    }
    /**
     * Get element count
     */
    async getElementCount(selector) {
        return await this.page.locator(selector).count();
    }
    /**
     * Wait for element count to match
     */
    async waitForElementCount(selector, count, timeout = 10000) {
        await expect(async () => {
            const actualCount = await this.getElementCount(selector);
            expect(actualCount).toBe(count);
        }).toPass({ timeout });
    }
    /**
     * Scroll to element
     */
    async scrollToElement(selector) {
        const element = this.page.locator(selector);
        await element.scrollIntoViewIfNeeded();
    }
    /**
     * Hover over element
     */
    async hoverElement(selector) {
        const element = this.page.locator(selector);
        await element.hover();
    }
    /**
     * Right click element
     */
    async rightClickElement(selector) {
        const element = this.page.locator(selector);
        await element.click({ button: 'right' });
    }
    /**
     * Double click element
     */
    async doubleClickElement(selector) {
        const element = this.page.locator(selector);
        await element.dblclick();
    }
    /**
     * Press key on element
     */
    async pressKey(selector, key) {
        const element = this.page.locator(selector);
        await element.press(key);
    }
    /**
     * Type text into element
     */
    async typeText(selector, text) {
        const element = this.page.locator(selector);
        await element.type(text);
    }
    /**
     * Clear element content
     */
    async clearElement(selector) {
        const element = this.page.locator(selector);
        await element.clear();
    }
    /**
     * Select option from dropdown
     */
    async selectOption(selector, value) {
        const select = this.page.locator(selector);
        await select.selectOption(value);
    }
    /**
     * Check checkbox
     */
    async checkCheckbox(selector) {
        const checkbox = this.page.locator(selector);
        await checkbox.check();
    }
    /**
     * Uncheck checkbox
     */
    async uncheckCheckbox(selector) {
        const checkbox = this.page.locator(selector);
        await checkbox.uncheck();
    }
    /**
     * Wait for URL to match
     */
    async waitForUrl(url, timeout = 10000) {
        await this.page.waitForURL(url, { timeout });
    }
    /**
     * Get current URL
     */
    async getCurrentUrl() {
        return this.page.url();
    }
    /**
     * Get page title
     */
    async getPageTitle() {
        return await this.page.title();
    }
    /**
     * Get element text content
     */
    async getElementText(selector) {
        const element = this.page.locator(selector);
        return await element.textContent() || '';
    }
    /**
     * Get element attribute value
     */
    async getElementAttribute(selector, attribute) {
        const element = this.page.locator(selector);
        return await element.getAttribute(attribute);
    }
    /**
     * Wait for element to have specific text
     */
    async waitForElementText(selector, text, timeout = 10000) {
        await expect(async () => {
            const elementText = await this.getElementText(selector);
            expect(elementText).toContain(text);
        }).toPass({ timeout });
    }
    /**
     * Wait for element to have specific attribute
     */
    async waitForElementAttribute(selector, attribute, value, timeout = 10000) {
        await expect(async () => {
            const attrValue = await this.getElementAttribute(selector, attribute);
            expect(attrValue).toBe(value);
        }).toPass({ timeout });
    }
}
/**
 * Create test helper instance
 */
export function createTestHelper(page) {
    return new TestHelpers(page);
}
/**
 * Common test data
 */
export const TestData = {
    // SFDR Test Data
    sfdr: {
        fundName: 'Test Sustainable Fund',
        fundDescription: 'A fund focused on sustainable investments with ESG integration and climate impact measurement',
        shortDescription: 'Sustainable investment fund',
        invalidFundName: 'ab',
        longDescription: 'A'.repeat(1001)
    },
    // User Test Data
    user: {
        email: 'test@example.com',
        password: 'TestPassword123!',
        invalidEmail: 'invalid-email',
        weakPassword: '123'
    },
    // API Test Data
    api: {
        successResponse: { success: true, data: {} },
        errorResponse: { error: 'Test error message' },
        timeoutResponse: { timeout: true }
    }
};
/**
 * Common selectors
 */
export const Selectors = {
    // Navigation
    navigation: '[data-testid="navigation"]',
    menuButton: '[data-testid="menu-button"]',
    // Forms
    fundNameInput: '[data-testid="fund-name-input"]',
    fundDescriptionInput: '[data-testid="fund-description-input"]',
    classifyButton: '[data-testid="classify-button"]',
    // Results
    classificationResult: '[data-testid="classification-result"]',
    loadingSpinner: '[data-testid="loading-spinner"]',
    // Common
    submitButton: '[data-testid="submit-button"]',
    cancelButton: '[data-testid="cancel-button"]',
    closeButton: '[data-testid="close-button"]',
    // Alerts
    successAlert: '[data-testid="success-alert"]',
    errorAlert: '[data-testid="error-alert"]',
    warningAlert: '[data-testid="warning-alert"]'
};
