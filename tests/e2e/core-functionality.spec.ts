import { expect, test } from '../fixtures/sfdr-fixtures';
import { SFDRTestHelpers } from '../utils/test-helpers';

test.describe('SFDR Navigator Core Functionality', () => {
  test('should load SFDR Navigator successfully', async ({ sfdrNavigatorPage }) => {
    await expect(sfdrNavigatorPage.locator('h1:has-text("SFDR Navigator")')).toBeVisible();
    await expect(sfdrNavigatorPage.locator('[data-testid="chat-interface"]')).toBeVisible();
    await expect(sfdrNavigatorPage.locator('[data-testid="quick-actions"]')).toBeVisible();
  });

  test('should handle quick actions correctly', async ({ sfdrNavigatorPage }) => {
    const quickActions = ['upload-document', 'check-compliance', 'article-classification'];
    
    for (const action of quickActions) {
      await SFDRTestHelpers.testQuickAction(sfdrNavigatorPage, action);
      await expect(sfdrNavigatorPage.locator('[data-testid="chat-message"]')).toContainText(
        action.replace('-', ' ')
      );
    }
  });

  test('should validate SFDR compliance elements', async ({ sfdrNavigatorPage }) => {
    await SFDRTestHelpers.validateSFDRCompliance(sfdrNavigatorPage);
  });

  test('should handle error boundaries gracefully', async ({ sfdrNavigatorPage }) => {
    await SFDRTestHelpers.validateErrorBoundary(sfdrNavigatorPage);
  });

  test('should test SFDR classification functionality', async ({ sfdrNavigatorPage, testData }) => {
    // Test Article 6 classification
    await SFDRTestHelpers.testSFDRClassification(sfdrNavigatorPage, testData.article6Fund);
    
    // Test Article 8 classification
    await SFDRTestHelpers.testSFDRClassification(sfdrNavigatorPage, testData.article8Fund);
    
    // Test Article 9 classification
    await SFDRTestHelpers.testSFDRClassification(sfdrNavigatorPage, testData.article9Fund);
  });

  test('should test chat interface functionality', async ({ sfdrNavigatorPage }) => {
    const testMessages = [
      'What is SFDR?',
      'How do I classify my fund?',
      'What are the requirements for Article 8?'
    ];
    
    for (const message of testMessages) {
      await SFDRTestHelpers.testChatInterface(sfdrNavigatorPage, message);
    }
  });

  test('should test loading states and progressive loading', async ({ sfdrNavigatorPage }) => {
    await SFDRTestHelpers.testLoadingStates(sfdrNavigatorPage);
    await SFDRTestHelpers.testProgressiveLoading(sfdrNavigatorPage);
  });

  test('should test responsive design across different viewports', async ({ sfdrNavigatorPage, responsiveTest }) => {
    for (const viewport of responsiveTest) {
      await sfdrNavigatorPage.setViewportSize({ width: viewport.width, height: viewport.height });
      await SFDRTestHelpers.waitForPageLoad(sfdrNavigatorPage);
      
      // Verify layout adapts correctly
      await expect(sfdrNavigatorPage.locator('[data-testid="main-content"]')).toBeVisible();
      
      // Test navigation menu on mobile
      if (viewport.width <= 768) {
        await expect(sfdrNavigatorPage.locator('[data-testid="mobile-menu"]')).toBeVisible();
      }
    }
  });

  test('should test keyboard navigation and accessibility', async ({ sfdrNavigatorPage }) => {
    await SFDRTestHelpers.testKeyboardNavigation(sfdrNavigatorPage);
    await SFDRTestHelpers.testScreenReaderCompatibility(sfdrNavigatorPage);
    await SFDRTestHelpers.testColorContrast(sfdrNavigatorPage);
  });

  test('should test performance metrics and Core Web Vitals', async ({ sfdrNavigatorPage }) => {
    await SFDRTestHelpers.testPerformanceMetrics(sfdrNavigatorPage);
  });

  test('should test error recovery mechanisms', async ({ sfdrNavigatorPage }) => {
    await SFDRTestHelpers.testErrorRecovery(sfdrNavigatorPage);
  });

  test('should test data validation and input handling', async ({ sfdrNavigatorPage }) => {
    await SFDRTestHelpers.testDataValidation(sfdrNavigatorPage);
  });

  test('should test security features and XSS protection', async ({ sfdrNavigatorPage }) => {
    await SFDRTestHelpers.testSecurityFeatures(sfdrNavigatorPage);
  });

  test('should test tab navigation and content switching', async ({ sfdrNavigatorPage }) => {
    const tabs = ['Overview', 'Chat', 'Quick Actions', 'Settings'];
    
    for (const tab of tabs) {
      await sfdrNavigatorPage.click(`[data-testid="tab-${tab.toLowerCase().replace(' ', '-')}"]`);
      await SFDRTestHelpers.waitForPageLoad(sfdrNavigatorPage);
      
      // Verify tab content is visible
      await expect(sfdrNavigatorPage.locator(`[data-testid="tab-content-${tab.toLowerCase().replace(' ', '-')}"]`)).toBeVisible();
    }
  });

  test('should test form submission and validation', async ({ sfdrNavigatorPage }) => {
    // Test valid form submission
    await sfdrNavigatorPage.fill('[data-testid="fund-name-input"]', 'Valid Fund Name');
    await sfdrNavigatorPage.fill('[data-testid="fund-description-input"]', 'Valid fund description with sufficient detail');
    await sfdrNavigatorPage.click('[data-testid="submit-button"]');
    
    // Verify success message
    await expect(sfdrNavigatorPage.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Test invalid form submission
    await sfdrNavigatorPage.fill('[data-testid="fund-name-input"]', '');
    await sfdrNavigatorPage.click('[data-testid="submit-button"]');
    
    // Verify validation error
    await expect(sfdrNavigatorPage.locator('[data-testid="validation-error"]')).toBeVisible();
  });

  test('should test API integration and error handling', async ({ sfdrNavigatorPage, mockAPIResponses }) => {
    // Test successful API call
    await sfdrNavigatorPage.fill('[data-testid="fund-name-input"]', 'Test Fund');
    await sfdrNavigatorPage.fill('[data-testid="fund-description-input"]', 'Test description');
    await sfdrNavigatorPage.click('[data-testid="classify-button"]');
    
    await expect(sfdrNavigatorPage.locator('[data-testid="classification-result"]')).toBeVisible();
    
    // Test API error handling
    await sfdrNavigatorPage.route('/api/sfdr/classify', async route => {
      await route.fulfill(mockAPIResponses.error);
    });
    
    await sfdrNavigatorPage.click('[data-testid="classify-button"]');
    await expect(sfdrNavigatorPage.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should test accessibility compliance with axe-core', async ({ sfdrNavigatorPage, accessibilityAudit }) => {
    await SFDRTestHelpers.testAccessibility(sfdrNavigatorPage);
    
    // Run comprehensive accessibility audit
    const results = await sfdrNavigatorPage.evaluate(() => {
      return (window as any).axe.run();
    });
    
    expect(results.violations).toHaveLength(0);
    expect(results.passes.length).toBeGreaterThan(0);
  });

  test('should test session management and authentication', async ({ authenticatedPage }) => {
    // Verify authenticated state
    await expect(authenticatedPage.locator('[data-testid="user-profile"]')).toBeVisible();
    await expect(authenticatedPage.locator('[data-testid="logout-button"]')).toBeVisible();
    
    // Test logout functionality
    await authenticatedPage.click('[data-testid="logout-button"]');
    await authenticatedPage.waitForURL('/login');
  });

  test('should test real-time updates and notifications', async ({ sfdrNavigatorPage }) => {
    // Test notification system
    await sfdrNavigatorPage.evaluate(() => {
      // Simulate notification
      const event = new CustomEvent('notification', { 
        detail: { type: 'info', message: 'Test notification' } 
      });
      window.dispatchEvent(event);
    });
    
    await expect(sfdrNavigatorPage.locator('[data-testid="notification"]')).toBeVisible();
  });

  test('should test data persistence and state management', async ({ sfdrNavigatorPage }) => {
    // Test form data persistence
    await sfdrNavigatorPage.fill('[data-testid="fund-name-input"]', 'Persistent Fund');
    await sfdrNavigatorPage.fill('[data-testid="fund-description-input"]', 'This should persist');
    
    // Navigate away and back
    await sfdrNavigatorPage.goto('/');
    await sfdrNavigatorPage.goto('/nexus-agent');
    
    // Verify data is still there
    await expect(sfdrNavigatorPage.locator('[data-testid="fund-name-input"]')).toHaveValue('Persistent Fund');
  });
});
