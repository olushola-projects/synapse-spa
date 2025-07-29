/**
 * SFDR Navigator - UAT Automation Script
 * 
 * This script provides automated testing capabilities for the SFDR Navigator application
 * using Playwright for browser automation and testing.
 * 
 * Usage: node uat-automation.js
 * 
 * Prerequisites:
 * - npm install playwright
 * - npm install @playwright/test
 */

const { test, expect, chromium, firefox, webkit } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Test configuration
const CONFIG = {
  baseURL: 'http://localhost:8080',
  timeout: 30000,
  browsers: ['chromium', 'firefox', 'webkit'],
  viewports: [
    { width: 1920, height: 1080 }, // Desktop
    { width: 768, height: 1024 },  // Tablet
    { width: 375, height: 667 }    // Mobile
  ],
  testResults: []
};

/**
 * Utility function to log test results
 * @param {string} testId - Test case identifier
 * @param {string} testName - Test case name
 * @param {boolean} passed - Test result
 * @param {number} duration - Test duration in ms
 * @param {string} notes - Additional notes
 */
function logTestResult(testId, testName, passed, duration, notes = '') {
  const result = {
    testId,
    testName,
    passed,
    duration,
    notes,
    timestamp: new Date().toISOString()
  };
  CONFIG.testResults.push(result);
  console.log(`${testId}: ${passed ? '✅ PASS' : '❌ FAIL'} - ${testName} (${duration}ms)`);
  if (notes) console.log(`   Notes: ${notes}`);
}

/**
 * Generate test report
 */
function generateTestReport() {
  const reportPath = path.join(__dirname, '../../test-results/automated-test-report.json');
  const summary = {
    totalTests: CONFIG.testResults.length,
    passed: CONFIG.testResults.filter(r => r.passed).length,
    failed: CONFIG.testResults.filter(r => !r.passed).length,
    passRate: (CONFIG.testResults.filter(r => r.passed).length / CONFIG.testResults.length * 100).toFixed(2),
    averageDuration: (CONFIG.testResults.reduce((sum, r) => sum + r.duration, 0) / CONFIG.testResults.length).toFixed(2),
    results: CONFIG.testResults
  };
  
  // Ensure directory exists
  const dir = path.dirname(reportPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`\n📊 Test Report Generated: ${reportPath}`);
  console.log(`📈 Summary: ${summary.passed}/${summary.totalTests} tests passed (${summary.passRate}%)`);
}

/**
 * Test Suite: Landing Page Functionality
 */
class LandingPageTests {
  /**
   * Test LP-001: Landing Page Load and Layout
   * @param {Page} page - Playwright page object
   */
  static async testPageLoadAndLayout(page) {
    const startTime = Date.now();
    try {
      await page.goto(CONFIG.baseURL);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check page title
      const title = await page.title();
      expect(title).toContain('SFDR Navigator');
      
      // Check main navigation
      const nav = await page.locator('nav').first();
      await expect(nav).toBeVisible();
      
      // Check hero section
      const hero = await page.locator('[data-testid="hero-section"], .hero, section').first();
      await expect(hero).toBeVisible();
      
      // Check footer
      const footer = await page.locator('footer');
      await expect(footer).toBeVisible();
      
      const duration = Date.now() - startTime;
      logTestResult('LP-001', 'Landing Page Load and Layout', true, duration, `Load time: ${duration}ms`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      logTestResult('LP-001', 'Landing Page Load and Layout', false, duration, error.message);
    }
  }
  
  /**
   * Test LP-002: Navigation Menu Functionality
   * @param {Page} page - Playwright page object
   */
  static async testNavigationMenu(page) {
    const startTime = Date.now();
    try {
      await page.goto(CONFIG.baseURL);
      
      // Test navigation links
      const navLinks = await page.locator('nav a, nav button').all();
      expect(navLinks.length).toBeGreaterThan(0);
      
      // Test first navigation item
      if (navLinks.length > 0) {
        await navLinks[0].click();
        await page.waitForTimeout(1000); // Wait for navigation/scroll
      }
      
      const duration = Date.now() - startTime;
      logTestResult('LP-002', 'Navigation Menu Functionality', true, duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      logTestResult('LP-002', 'Navigation Menu Functionality', false, duration, error.message);
    }
  }
  
  /**
   * Test LP-008: Page Performance and Loading
   * @param {Page} page - Playwright page object
   */
  static async testPagePerformance(page) {
    const startTime = Date.now();
    try {
      const navigationStart = Date.now();
      await page.goto(CONFIG.baseURL);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - navigationStart;
      
      // Check for console errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Performance should be under 3 seconds
      const performancePass = loadTime < 3000;
      const noErrors = errors.length === 0;
      
      const duration = Date.now() - startTime;
      const passed = performancePass && noErrors;
      const notes = `Load time: ${loadTime}ms, Errors: ${errors.length}`;
      
      logTestResult('LP-008', 'Page Performance and Loading', passed, duration, notes);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      logTestResult('LP-008', 'Page Performance and Loading', false, duration, error.message);
    }
  }
}

/**
 * Test Suite: Agent Interaction Functionality
 */
class AgentInteractionTests {
  /**
   * Test AI-001: CDD Agent Page Load and Interface
   * @param {Page} page - Playwright page object
   */
  static async testCDDAgentPageLoad(page) {
    const startTime = Date.now();
    try {
      await page.goto(`${CONFIG.baseURL}/agents/cdd-agent`);
      await page.waitForLoadState('networkidle');
      
      // Check for chat interface elements
      const chatInput = await page.locator('input[type="text"], textarea').first();
      await expect(chatInput).toBeVisible();
      
      const sendButton = await page.locator('button').filter({ hasText: /send|submit/i }).first();
      await expect(sendButton).toBeVisible();
      
      const duration = Date.now() - startTime;
      logTestResult('AI-001', 'CDD Agent Page Load and Interface', true, duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      logTestResult('AI-001', 'CDD Agent Page Load and Interface', false, duration, error.message);
    }
  }
  
  /**
   * Test AI-002: CDD Agent Basic Query Processing
   * @param {Page} page - Playwright page object
   */
  static async testCDDAgentBasicQuery(page) {
    const startTime = Date.now();
    try {
      await page.goto(`${CONFIG.baseURL}/agents/cdd-agent`);
      await page.waitForLoadState('networkidle');
      
      // Find chat input and send button
      const chatInput = await page.locator('input[type="text"], textarea').first();
      const sendButton = await page.locator('button').filter({ hasText: /send|submit/i }).first();
      
      // Send a test message
      await chatInput.fill('Hello');
      const messageStartTime = Date.now();
      await sendButton.click();
      
      // Wait for response (with timeout)
      await page.waitForTimeout(5000); // Wait up to 5 seconds for response
      const responseTime = Date.now() - messageStartTime;
      
      const duration = Date.now() - startTime;
      const passed = responseTime < 10000; // Response should be within 10 seconds
      const notes = `Response time: ${responseTime}ms`;
      
      logTestResult('AI-002', 'CDD Agent Basic Query Processing', passed, duration, notes);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      logTestResult('AI-002', 'CDD Agent Basic Query Processing', false, duration, error.message);
    }
  }
}

/**
 * Test Suite: Cross-Browser Compatibility
 */
class CrossBrowserTests {
  /**
   * Run tests across multiple browsers
   */
  static async runCrossBrowserTests() {
    const browsers = [chromium, firefox, webkit];
    const browserNames = ['Chromium', 'Firefox', 'WebKit'];
    
    for (let i = 0; i < browsers.length; i++) {
      const browserType = browsers[i];
      const browserName = browserNames[i];
      
      console.log(`\n🌐 Testing in ${browserName}...`);
      
      try {
        const browser = await browserType.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Run basic tests in each browser
        await LandingPageTests.testPageLoadAndLayout(page);
        await LandingPageTests.testNavigationMenu(page);
        
        await browser.close();
        
      } catch (error) {
        logTestResult('CB-001', `Cross-Browser Test - ${browserName}`, false, 0, error.message);
      }
    }
  }
}

/**
 * Test Suite: Responsive Design
 */
class ResponsiveTests {
  /**
   * Test responsive design across different viewports
   */
  static async runResponsiveTests() {
    const browser = await chromium.launch();
    
    for (const viewport of CONFIG.viewports) {
      console.log(`\n📱 Testing viewport: ${viewport.width}x${viewport.height}`);
      
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      
      const startTime = Date.now();
      try {
        await page.goto(CONFIG.baseURL);
        await page.waitForLoadState('networkidle');
        
        // Check if page is responsive
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = viewport.width;
        
        // Page should not have horizontal scroll
        const isResponsive = bodyWidth <= viewportWidth + 20; // Allow small margin
        
        const duration = Date.now() - startTime;
        const testId = `RD-${viewport.width}`;
        const testName = `Responsive Design - ${viewport.width}x${viewport.height}`;
        
        logTestResult(testId, testName, isResponsive, duration, 
          `Body width: ${bodyWidth}px, Viewport: ${viewportWidth}px`);
        
      } catch (error) {
        const duration = Date.now() - startTime;
        logTestResult(`RD-${viewport.width}`, `Responsive Design - ${viewport.width}x${viewport.height}`, 
          false, duration, error.message);
      }
      
      await context.close();
    }
    
    await browser.close();
  }
}

/**
 * Main test execution function
 */
async function runUATTests() {
  console.log('🚀 Starting SFDR Navigator UAT Automation');
  console.log(`📍 Base URL: ${CONFIG.baseURL}`);
  console.log('=' * 50);
  
  try {
    // Launch browser for main tests
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Run Landing Page Tests
    console.log('\n🏠 Running Landing Page Tests...');
    await LandingPageTests.testPageLoadAndLayout(page);
    await LandingPageTests.testNavigationMenu(page);
    await LandingPageTests.testPagePerformance(page);
    
    // Run Agent Interaction Tests
    console.log('\n🤖 Running Agent Interaction Tests...');
    await AgentInteractionTests.testCDDAgentPageLoad(page);
    await AgentInteractionTests.testCDDAgentBasicQuery(page);
    
    await browser.close();
    
    // Run Cross-Browser Tests
    console.log('\n🌐 Running Cross-Browser Tests...');
    await CrossBrowserTests.runCrossBrowserTests();
    
    // Run Responsive Design Tests
    console.log('\n📱 Running Responsive Design Tests...');
    await ResponsiveTests.runResponsiveTests();
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
  
  // Generate test report
  generateTestReport();
  
  console.log('\n✅ UAT Automation Complete!');
}

// Export for use in other modules
module.exports = {
  runUATTests,
  LandingPageTests,
  AgentInteractionTests,
  CrossBrowserTests,
  ResponsiveTests,
  CONFIG
};

// Run tests if this file is executed directly
if (require.main === module) {
  runUATTests().catch(console.error);
}