# Playwright End-to-End Testing Framework

## Overview

This directory contains comprehensive end-to-end tests for the Synapses GRC Platform using Playwright. The testing framework is designed to ensure high-quality, reliable testing of all critical user workflows and application features.

## Test Structure

### Test Files

- **`sfdr-classification-enhanced.spec.ts`** - Comprehensive SFDR classification engine tests
- **`authentication-flow.spec.ts`** - User authentication and authorization tests
- **`dashboard-navigation.spec.ts`** - Dashboard functionality and navigation tests
- **`pre-beta-validation.spec.ts`** - Pre-beta release validation tests
- **`security-hardening.spec.ts`** - Security and hardening tests
- **`performance-load.spec.ts`** - Performance and load testing
- **`accessibility-compliance.spec.ts`** - Accessibility compliance tests

### Test Utilities

- **`utils/test-helpers.ts`** - Common test utilities and helper functions
- **`setup.spec.ts`** - Global test setup and teardown

## Running Tests

### Basic Commands

```bash
# Run all tests
npm run test

# Run tests in headed mode (with browser UI)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Generate test report
npm run test:report
```

### Specific Test Suites

```bash
# Run SFDR classification tests
npm run test:sfdr

# Run authentication tests
npm run test:auth

# Run dashboard tests
npm run test:dashboard

# Run pre-beta validation tests
npm run test:pre-beta

# Run security tests
npm run test:security

# Run performance tests
npm run test:performance

# Run accessibility tests
npm run test:accessibility
```

### Test Categories

```bash
# Run smoke tests (critical functionality)
npm run test:smoke

# Run regression tests
npm run test:regression

# Run critical path tests
npm run test:critical

# Run tests in parallel
npm run test:parallel

# Run tests for CI/CD
npm run test:ci
```

## Test Configuration

### Browser Support

The tests run on multiple browsers:
- **Chromium** - Primary browser for most tests
- **Firefox** - Cross-browser compatibility
- **WebKit** - Safari compatibility
- **Mobile Chrome** - Mobile testing
- **Mobile Safari** - iOS testing

### Test Environment

- **Base URL**: `http://localhost:5173` (development)
- **Timeout**: 60 seconds per test
- **Retries**: 2 retries on CI, 0 in development
- **Parallel Execution**: Enabled for faster test runs

## Test Data Management

### Test Data Structure

```typescript
export const TestData = {
  sfdr: {
    fundName: 'Test Sustainable Fund',
    fundDescription: 'A fund focused on sustainable investments...',
    shortDescription: 'Sustainable investment fund',
    invalidFundName: 'ab',
    longDescription: 'A'.repeat(1001)
  },
  user: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    invalidEmail: 'invalid-email',
    weakPassword: '123'
  },
  api: {
    successResponse: { success: true, data: {} },
    errorResponse: { error: 'Test error message' },
    timeoutResponse: { timeout: true }
  }
};
```

### Selectors

Common selectors for consistent element targeting:

```typescript
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
  
  // Alerts
  successAlert: '[data-testid="success-alert"]',
  errorAlert: '[data-testid="error-alert"]',
  warningAlert: '[data-testid="warning-alert"]'
};
```

## Test Helper Functions

### Common Operations

```typescript
// Navigation
await helper.navigateTo('/path');
await helper.waitForPageLoad();

// Form interactions
await helper.fillField(selector, value);
await helper.clickButton(selector);
await helper.selectOption(selector, value);

// Assertions
await helper.expectText(text);
await helper.expectVisible(selector);
await helper.expectNotVisible(selector);

// API mocking
await helper.mockApiResponse(url, response);
await helper.mockApiError(url, status);

// Screenshots
await helper.takeScreenshot(name);
```

## Test Categories

### 1. Smoke Tests (@smoke)
Critical functionality that must work for basic application operation:
- User login/logout
- Basic navigation
- SFDR classification workflow
- Dashboard loading

### 2. Regression Tests (@regression)
Comprehensive tests to ensure no regressions:
- All form validations
- API integrations
- Error handling
- Data persistence

### 3. Critical Tests (@critical)
High-priority tests for business-critical features:
- SFDR classification accuracy
- Authentication security
- Data export functionality
- Compliance reporting

## Best Practices

### Test Organization

1. **Group related tests** using `test.describe()`
2. **Use descriptive test names** that explain the expected behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests independent** - each test should be able to run in isolation

### Test Data

1. **Use consistent test data** from the TestData object
2. **Clean up after tests** to avoid data pollution
3. **Mock external dependencies** to ensure test reliability
4. **Use realistic test scenarios** that mirror real user behavior

### Assertions

1. **Test one thing at a time** - each test should have a single focus
2. **Use specific assertions** rather than generic ones
3. **Include both positive and negative test cases**
4. **Test edge cases and error conditions**

### Performance

1. **Minimize test execution time** by using efficient selectors
2. **Run tests in parallel** when possible
3. **Use appropriate timeouts** for different types of operations
4. **Optimize test data setup** to avoid unnecessary overhead

## Debugging Tests

### Debug Mode

```bash
# Run tests in debug mode
npm run test:debug

# Run specific test in debug mode
npx playwright test --debug tests/e2e/sfdr-classification-enhanced.spec.ts
```

### Trace Viewer

```bash
# Show trace for failed test
npx playwright show-trace test-results/trace.zip
```

### Screenshots and Videos

- Screenshots are automatically taken on test failure
- Videos are recorded for failed tests
- All artifacts are saved in `test-results/` directory

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run Playwright Tests
  run: npm run test:ci
  env:
    CI: true
```

### Test Reports

- **HTML Report**: Interactive test report with screenshots and traces
- **JUnit Report**: XML format for CI/CD integration
- **JSON Report**: Machine-readable test results

## Troubleshooting

### Common Issues

1. **Element not found**: Check if the element has the correct `data-testid`
2. **Timeout errors**: Increase timeout or check for slow loading
3. **Flaky tests**: Add proper waits and retry logic
4. **Browser compatibility**: Test on multiple browsers

### Debug Commands

```bash
# Install browsers
npx playwright install

# Update browsers
npx playwright install --with-deps

# Check browser status
npx playwright --version
```

## Contributing

### Adding New Tests

1. Create a new test file following the naming convention
2. Import the test helper utilities
3. Use the TestData and Selectors constants
4. Add appropriate test tags (@smoke, @regression, @critical)
5. Update this documentation

### Test Guidelines

1. **Write maintainable tests** that are easy to understand and modify
2. **Use descriptive test names** that explain the business requirement
3. **Include proper error handling** and edge case testing
4. **Follow the established patterns** for consistency

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Test Reports](https://playwright.dev/docs/test-reporters)
- [Debugging Guide](https://playwright.dev/docs/debug)
