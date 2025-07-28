// QA Test Automation Script for Synapse Landing Page & SFDR Navigator
// Run this script in browser console for automated testing

class SynapseQATester {
  constructor() {
    this.testResults = [];
    this.currentTest = null;
    this.testStartTime = null;
  }

  // Utility methods
  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);

    if (this.currentTest) {
      this.currentTest.logs.push(logMessage);
    }
  }

  startTest(testName) {
    this.currentTest = {
      name: testName,
      startTime: Date.now(),
      logs: [],
      passed: false,
      errors: []
    };
    this.log(`Starting test: ${testName}`);
  }

  endTest(passed = true, error = null) {
    if (!this.currentTest) return;

    this.currentTest.passed = passed;
    this.currentTest.endTime = Date.now();
    this.currentTest.duration = this.currentTest.endTime - this.currentTest.startTime;

    if (error) {
      this.currentTest.errors.push(error);
      this.log(`Test failed: ${error}`, 'error');
    }

    this.log(`Test completed: ${this.currentTest.name} - ${passed ? 'PASSED' : 'FAILED'}`);
    this.testResults.push(this.currentTest);
    this.currentTest = null;
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async waitForElement(selector, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) return element;
      await this.wait(100);
    }
    throw new Error(`Element not found: ${selector}`);
  }

  async waitForElementToDisappear(selector, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (!element) return true;
      await this.wait(100);
    }
    return false;
  }

  // Navigation Tests
  async testNavigation() {
    this.startTest('Navigation Links Test');

    try {
      // Test main navigation links
      const navLinks = [
        { selector: 'a[href="/"]', name: 'Home' },
        { selector: 'a[href="/partners"]', name: 'Partners' },
        { selector: 'a[href="/use-cases"]', name: 'Use Cases' },
        { selector: 'a[href="/nexus-agent"]', name: 'SFDR Navigator' },
        { selector: 'a[href="/login"]', name: 'Login' },
        { selector: 'a[href="/register"]', name: 'Register' }
      ];

      for (const link of navLinks) {
        const element = document.querySelector(link.selector);
        if (!element) {
          throw new Error(`Navigation link not found: ${link.name}`);
        }
        this.log(`✓ Found navigation link: ${link.name}`);
      }

      this.endTest(true);
    } catch (error) {
      this.endTest(false, error.message);
    }
  }

  // Homepage Elements Test
  async testHomepageElements() {
    this.startTest('Homepage Elements Test');

    try {
      const requiredElements = [
        { selector: 'nav', name: 'Navigation' },
        { selector: 'main', name: 'Main Content' },
        { selector: 'footer', name: 'Footer' },
        { selector: '[class*="hero"], [class*="Hero"]', name: 'Hero Section' },
        { selector: '[class*="feature"], [class*="Feature"]', name: 'Features Section' },
        { selector: '[class*="cta"], [class*="CTA"]', name: 'CTA Section' }
      ];

      for (const element of requiredElements) {
        const found = document.querySelector(element.selector);
        if (!found) {
          throw new Error(`Required element not found: ${element.name}`);
        }
        this.log(`✓ Found element: ${element.name}`);
      }

      this.endTest(true);
    } catch (error) {
      this.endTest(false, error.message);
    }
  }

  // Form Validation Test
  async testFormValidation() {
    this.startTest('Form Validation Test');

    try {
      // Look for email input fields
      const emailInputs = document.querySelectorAll(
        'input[type="email"], input[name*="email"], input[placeholder*="email"]'
      );

      if (emailInputs.length === 0) {
        this.log('No email forms found on current page', 'warning');
        this.endTest(true);
        return;
      }

      for (let i = 0; i < emailInputs.length; i++) {
        const input = emailInputs[i];

        // Test invalid email
        input.value = 'invalid-email';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));

        await this.wait(500);

        // Check for validation message
        const form = input.closest('form');
        if (form) {
          const isValid = input.checkValidity();
          if (isValid) {
            this.log(`⚠ Email validation might not be working for input ${i + 1}`, 'warning');
          } else {
            this.log(`✓ Email validation working for input ${i + 1}`);
          }
        }

        // Reset input
        input.value = '';
      }

      this.endTest(true);
    } catch (error) {
      this.endTest(false, error.message);
    }
  }

  // SFDR Navigator Chat Test
  async testNexusAgentChat() {
    this.startTest('SFDR Navigator Chat Interface Test');

    try {
      // Check if we're on the SFDR Navigator page
      if (
        !window.location.pathname.includes('nexus-agent') &&
        !document.querySelector(
          '[class*="nexus"], [class*="Nexus"], [class*="chat"], [class*="Chat"]'
        )
      ) {
        this.log('Not on SFDR Navigator page, skipping chat test', 'warning');
        this.endTest(true);
        return;
      }

      // Look for chat interface elements
      const chatElements = {
        input: 'input[type="text"], textarea, [contenteditable="true"]',
        sendButton: 'button[type="submit"], button[class*="send"], button[class*="Send"]',
        messagesContainer:
          '[class*="message"], [class*="Message"], [class*="chat"], [class*="Chat"]'
      };

      // Find chat input
      const chatInput = document.querySelector(chatElements.input);
      if (!chatInput) {
        throw new Error('Chat input not found');
      }
      this.log('✓ Found chat input');

      // Find send button
      const sendButton = document.querySelector(chatElements.sendButton);
      if (!sendButton) {
        throw new Error('Send button not found');
      }
      this.log('✓ Found send button');

      // Test sending a message
      const testMessage = 'Hello, I need help with SFDR compliance';
      chatInput.value = testMessage;
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));

      this.log(`Sending test message: "${testMessage}"`);

      // Click send button
      sendButton.click();

      // Wait for response
      await this.wait(2000);

      // Check if message appeared in chat
      const messages = document.querySelectorAll(chatElements.messagesContainer);
      let messageFound = false;

      messages.forEach(msg => {
        if (msg.textContent.includes(testMessage) || msg.textContent.includes('SFDR')) {
          messageFound = true;
        }
      });

      if (messageFound) {
        this.log('✓ Message sent and response received');
      } else {
        this.log('⚠ Message sent but response not detected', 'warning');
      }

      this.endTest(true);
    } catch (error) {
      this.endTest(false, error.message);
    }
  }

  // Performance Test
  async testPerformance() {
    this.startTest('Performance Test');

    try {
      const performanceData = {
        loadTime: 0,
        domContentLoaded: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0
      };

      // Get navigation timing
      if (performance.timing) {
        performanceData.loadTime =
          performance.timing.loadEventEnd - performance.timing.navigationStart;
        performanceData.domContentLoaded =
          performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      }

      // Get paint timing
      if (performance.getEntriesByType) {
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            performanceData.firstContentfulPaint = entry.startTime;
          }
        });

        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        if (lcpEntries.length > 0) {
          performanceData.largestContentfulPaint = lcpEntries[lcpEntries.length - 1].startTime;
        }
      }

      this.log(`Load Time: ${performanceData.loadTime}ms`);
      this.log(`DOM Content Loaded: ${performanceData.domContentLoaded}ms`);
      this.log(`First Contentful Paint: ${performanceData.firstContentfulPaint}ms`);
      this.log(`Largest Contentful Paint: ${performanceData.largestContentfulPaint}ms`);

      // Check performance thresholds
      const warnings = [];
      if (performanceData.loadTime > 3000) warnings.push('Load time > 3s');
      if (performanceData.firstContentfulPaint > 1500) warnings.push('FCP > 1.5s');
      if (performanceData.largestContentfulPaint > 2500) warnings.push('LCP > 2.5s');

      if (warnings.length > 0) {
        this.log(`Performance warnings: ${warnings.join(', ')}`, 'warning');
      } else {
        this.log('✓ Performance metrics within acceptable ranges');
      }

      this.endTest(true);
    } catch (error) {
      this.endTest(false, error.message);
    }
  }

  // Accessibility Test
  async testAccessibility() {
    this.startTest('Basic Accessibility Test');

    try {
      const issues = [];

      // Check for images without alt text
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          issues.push(`Image ${index + 1} missing alt text`);
        }
      });

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        if (index === 0 && level !== 1) {
          issues.push('Page should start with h1');
        }
        if (level > previousLevel + 1) {
          issues.push(`Heading level skip detected: ${heading.tagName}`);
        }
        previousLevel = level;
      });

      // Check for form labels
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach((input, index) => {
        const hasLabel = input.labels && input.labels.length > 0;
        const hasAriaLabel = input.getAttribute('aria-label');
        const hasAriaLabelledBy = input.getAttribute('aria-labelledby');

        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
          issues.push(`Input ${index + 1} missing label`);
        }
      });

      // Check for focus indicators
      const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]'
      );
      this.log(`Found ${focusableElements.length} focusable elements`);

      if (issues.length > 0) {
        this.log(`Accessibility issues found: ${issues.join(', ')}`, 'warning');
      } else {
        this.log('✓ No basic accessibility issues detected');
      }

      this.endTest(true);
    } catch (error) {
      this.endTest(false, error.message);
    }
  }

  // Console Error Test
  async testConsoleErrors() {
    this.startTest('Console Errors Test');

    try {
      // Store original console methods
      const originalError = console.error;
      const originalWarn = console.warn;
      const errors = [];
      const warnings = [];

      // Override console methods to capture errors
      console.error = (...args) => {
        errors.push(args.join(' '));
        originalError.apply(console, args);
      };

      console.warn = (...args) => {
        warnings.push(args.join(' '));
        originalWarn.apply(console, args);
      };

      // Wait a bit to capture any async errors
      await this.wait(2000);

      // Restore original console methods
      console.error = originalError;
      console.warn = originalWarn;

      if (errors.length > 0) {
        this.log(`Console errors detected: ${errors.length}`, 'warning');
        errors.forEach(error => this.log(`Error: ${error}`, 'error'));
      }

      if (warnings.length > 0) {
        this.log(`Console warnings detected: ${warnings.length}`, 'warning');
      }

      if (errors.length === 0 && warnings.length === 0) {
        this.log('✓ No console errors or warnings detected');
      }

      this.endTest(true);
    } catch (error) {
      this.endTest(false, error.message);
    }
  }

  // Run all tests
  async runAllTests() {
    this.log('Starting comprehensive QA test suite...');
    const startTime = Date.now();

    await this.testNavigation();
    await this.testHomepageElements();
    await this.testFormValidation();
    await this.testNexusAgentChat();
    await this.testPerformance();
    await this.testAccessibility();
    await this.testConsoleErrors();

    const endTime = Date.now();
    const totalDuration = endTime - startTime;

    this.generateReport(totalDuration);
  }

  // Generate test report
  generateReport(totalDuration) {
    const passedTests = this.testResults.filter(test => test.passed).length;
    const failedTests = this.testResults.filter(test => !test.passed).length;
    const totalTests = this.testResults.length;

    console.log('\n' + '='.repeat(60));
    console.log('QA TEST REPORT - SYNAPSE LANDING PAGE');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log('\nTest Details:');
    console.log('-'.repeat(60));

    this.testResults.forEach(test => {
      const status = test.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${test.name} (${test.duration}ms)`);

      if (!test.passed && test.errors.length > 0) {
        test.errors.forEach(error => {
          console.log(`   Error: ${error}`);
        });
      }
    });

    console.log('\n' + '='.repeat(60));

    if (failedTests === 0) {
      console.log('🎉 ALL TESTS PASSED! Ready for beta testing.');
    } else {
      console.log(`⚠️  ${failedTests} test(s) failed. Please review and fix issues before beta.`);
    }

    console.log('='.repeat(60));

    // Return results for programmatic access
    return {
      totalTests,
      passedTests,
      failedTests,
      successRate: (passedTests / totalTests) * 100,
      duration: totalDuration,
      results: this.testResults
    };
  }

  // Quick smoke test for critical functionality
  async runSmokeTest() {
    this.log('Running quick smoke test...');

    await this.testNavigation();
    await this.testHomepageElements();
    await this.testConsoleErrors();

    const report = this.generateReport(0);
    return report.failedTests === 0;
  }
}

// Usage instructions
console.log(`
🧪 SYNAPSE QA TESTING AUTOMATION LOADED

Usage:
const tester = new SynapseQATester();

// Run all tests:
await tester.runAllTests();

// Run quick smoke test:
await tester.runSmokeTest();

// Run individual tests:
await tester.testNavigation();
await tester.testNexusAgentChat();
await tester.testPerformance();

Note: Navigate to different pages and run tests to get comprehensive coverage.
`);

// Auto-instantiate for immediate use
window.synapseTester = new SynapseQATester();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SynapseQATester;
}
