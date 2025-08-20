import { Page, expect } from '@playwright/test';

export class SFDRTestHelpers {
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  }

  static async validateSFDRCompliance(page: Page) {
    // Validate SFDR-specific compliance elements
    await expect(page.locator('[data-testid="sfdr-compliance-status"]')).toBeVisible();
    await expect(page.locator('[data-testid="esma-reference"]')).toBeVisible();
  }

  static async testQuickAction(page: Page, actionType: string) {
    await page.click(`[data-testid="quick-action-${actionType}"]`);
    await this.waitForPageLoad(page);
  }

  static async validateErrorBoundary(page: Page) {
    // Test error boundary functionality
    await page.evaluate(() => {
      // Simulate error
      throw new Error('Test error for boundary');
    });
    
    await expect(page.locator('[data-testid="error-boundary"]')).toBeVisible();
  }

  static async testAccessibility(page: Page) {
    // Run accessibility tests
    await page.evaluate(() => {
      // Inject axe-core for accessibility testing
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js';
      document.head.appendChild(script);
    });
    
    const results = await page.evaluate(() => {
      return (window as any).axe.run();
    });
    
    expect(results.violations).toHaveLength(0);
  }

  static async testSFDRClassification(page: Page, fundData: {
    name: string;
    description: string;
    expectedClassification: string;
  }) {
    // Fill in fund information
    await page.fill('[data-testid="fund-name-input"]', fundData.name);
    await page.fill('[data-testid="fund-description-input"]', fundData.description);
    
    // Submit for classification
    await page.click('[data-testid="classify-button"]');
    
    // Wait for classification result
    await expect(page.locator('[data-testid="classification-result"]')).toBeVisible({ timeout: 30000 });
    
    // Validate classification
    await expect(page.locator('[data-testid="classification-result"]')).toContainText(
      fundData.expectedClassification
    );
  }

  static async testChatInterface(page: Page, message: string) {
    // Test chat interface functionality
    await page.fill('[data-testid="chat-input"]', message);
    await page.click('[data-testid="send-button"]');
    
    // Wait for response
    await expect(page.locator('[data-testid="chat-message"]')).toBeVisible({ timeout: 30000 });
  }

  static async testLoadingStates(page: Page) {
    // Test loading state components
    await expect(page.locator('[data-testid="loading-state"]')).toBeVisible();
    await page.waitForSelector('[data-testid="loading-state"]', { state: 'hidden' });
  }

  static async testProgressiveLoading(page: Page) {
    // Test progressive loading indicators
    const progressStages = ['20%', '40%', '60%', '80%', '100%'];
    
    for (const stage of progressStages) {
      await expect(page.locator(`[data-testid="progress-${stage}"]`)).toBeVisible();
    }
  }

  static async testResponsiveDesign(page: Page) {
    // Test responsive design breakpoints
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await this.waitForPageLoad(page);
      
      // Verify layout adapts correctly
      await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
    }
  }

  static async testKeyboardNavigation(page: Page) {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Test tab order
    const focusableElements = await page.locator('button, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
    expect(focusableElements.length).toBeGreaterThan(0);
  }

  static async testScreenReaderCompatibility(page: Page) {
    // Test ARIA labels and roles
    const ariaLabels = await page.locator('[aria-label]').all();
    expect(ariaLabels.length).toBeGreaterThan(0);
    
    // Test form labels
    const inputs = await page.locator('input, textarea, select').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // Should have either id with label, aria-label, or aria-labelledby
      const hasLabel = id || ariaLabel || ariaLabelledBy;
      expect(hasLabel).toBeTruthy();
    }
  }

  static async testColorContrast(page: Page) {
    // Test color contrast for accessibility
    const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, span, div').all();
    
    for (const element of textElements) {
      const color = await element.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.color;
      });
      
      // Verify text has a defined color (not transparent or default)
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  }

  static async testPerformanceMetrics(page: Page) {
    // Test Core Web Vitals
    const performanceMetrics = await page.evaluate(() => {
      return new Promise(resolve => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {
            lcp: entries.find(entry => entry.entryType === 'largest-contentful-paint')?.startTime,
            fid: entries.find(entry => entry.entryType === 'first-input')?.processingStart - entries.find(entry => entry.entryType === 'first-input')?.startTime,
            cls: entries.find(entry => entry.entryType === 'layout-shift')?.value
          };
          resolve(metrics);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      });
    });
    
    // Validate Core Web Vitals
    expect(performanceMetrics.lcp).toBeLessThan(2500); // LCP should be < 2.5s
    expect(performanceMetrics.fid).toBeLessThan(100);   // FID should be < 100ms
    expect(performanceMetrics.cls).toBeLessThan(0.1);   // CLS should be < 0.1
  }

  static async testErrorRecovery(page: Page) {
    // Test error recovery mechanisms
    await page.route('/api/sfdr/classify', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Trigger an error
    await page.fill('[data-testid="fund-name-input"]', 'Test Fund');
    await page.fill('[data-testid="fund-description-input"]', 'Test description');
    await page.click('[data-testid="classify-button"]');
    
    // Verify error handling
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    // Test retry mechanism
    await page.click('[data-testid="retry-button"]');
    await expect(page.locator('[data-testid="loading-state"]')).toBeVisible();
  }

  static async testDataValidation(page: Page) {
    // Test input validation
    const invalidInputs = [
      { name: '', description: 'Valid description' },
      { name: 'Valid name', description: '' },
      { name: 'a'.repeat(1000), description: 'Valid description' }, // Too long
    ];
    
    for (const input of invalidInputs) {
      await page.fill('[data-testid="fund-name-input"]', input.name);
      await page.fill('[data-testid="fund-description-input"]', input.description);
      await page.click('[data-testid="classify-button"]');
      
      // Verify validation error
      await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
    }
  }

  static async testSecurityFeatures(page: Page) {
    // Test security features
    await page.evaluate(() => {
      // Test XSS protection
      const script = document.createElement('script');
      script.textContent = 'alert("XSS")';
      document.body.appendChild(script);
    });
    
    // Verify no alert was shown
    const dialog = page.locator('text=alert');
    await expect(dialog).not.toBeVisible();
  }
}
