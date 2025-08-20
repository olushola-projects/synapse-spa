# 🚀 **PLAYWRIGHT EXECUTION COMMANDS - SFDR Navigator**

## **Quick Start Commands**

### **1. Start Development Server**

```bash
npm run dev
```

### **2. Run Basic Tests**

```bash
# Run basic validation tests
npx playwright test tests/e2e/basic.spec.ts --project=chromium

# Run setup validation tests
npx playwright test tests/e2e/setup-validation.spec.ts --project=chromium
```

### **3. Run SFDR Navigator Tests**

```bash
# Run comprehensive SFDR Navigator tests
npx playwright test tests/e2e/sfdr-navigator.spec.ts --project=chromium

# Run with headed browser (to see the tests)
npx playwright test tests/e2e/sfdr-navigator.spec.ts --project=chromium --headed
```

### **4. Run All Tests**

```bash
# Run all tests in all browsers
npx playwright test

# Run specific browser tests
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### **5. Run Mobile Tests**

```bash
# Run mobile device tests
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### **6. Run Performance Tests**

```bash
# Run performance-specific tests
npx playwright test --project=performance
```

### **7. Generate Reports**

```bash
# Show HTML report
npx playwright show-report

# Generate JUnit XML report
npx playwright test --reporter=junit
```

## **Advanced Commands**

### **Debug Mode**

```bash
# Run tests in debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test tests/e2e/sfdr-navigator.spec.ts --debug
```

### **Update Snapshots**

```bash
# Update visual snapshots
npx playwright test --update-snapshots
```

### **Parallel Execution**

```bash
# Run tests in parallel
npx playwright test --workers=4
```

### **Specific Test Files**

```bash
# Run only SFDR Navigator tests
npx playwright test tests/e2e/sfdr-navigator.spec.ts

# Run tests matching pattern
npx playwright test --grep "SFDR"
```

## **CI/CD Commands**

### **GitHub Actions**

```bash
# The workflow will automatically run on push/PR
# Check .github/workflows/playwright.yml for details
```

### **Local CI Simulation**

```bash
# Run tests as if in CI environment
CI=true npx playwright test
```

## **Troubleshooting Commands**

### **Install/Update Browsers**

```bash
# Install all browsers
npx playwright install --with-deps

# Install specific browser
npx playwright install chromium
```

### **Check Configuration**

```bash
# Validate configuration
npx playwright test --help
```

### **Clear Cache**

```bash
# Clear test cache
npx playwright test --clear-cache
```

## **Monitoring Commands**

### **Watch Mode**

```bash
# Run tests in watch mode
npx playwright test --watch
```

### **Trace Analysis**

```bash
# Generate traces for failed tests
npx playwright test --trace=on
```

## **Performance Testing**

### **Core Web Vitals**

```bash
# Run performance tests
npx playwright test tests/e2e/sfdr-navigator.spec.ts --project=performance
```

### **Load Testing**

```bash
# Run concurrent user tests
npx playwright test --workers=10
```

## **Accessibility Testing**

### **WCAG Compliance**

```bash
# Run accessibility tests
npx playwright test tests/e2e/sfdr-navigator.spec.ts --project=accessibility
```

## **Quick Validation**

### **Test Setup**

```bash
# Quick validation that everything is working
npx playwright test tests/e2e/setup-validation.spec.ts --project=chromium
```

### **Basic Functionality**

```bash
# Test basic application functionality
npx playwright test tests/e2e/basic.spec.ts --project=chromium
```

---

## **🎯 RECOMMENDED EXECUTION SEQUENCE**

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Validate Setup**

   ```bash
   npx playwright test tests/e2e/setup-validation.spec.ts --project=chromium
   ```

3. **Run Basic Tests**

   ```bash
   npx playwright test tests/e2e/basic.spec.ts --project=chromium
   ```

4. **Run SFDR Navigator Tests**

   ```bash
   npx playwright test tests/e2e/sfdr-navigator.spec.ts --project=chromium --headed
   ```

5. **Generate Report**

   ```bash
   npx playwright show-report
   ```

6. **Run All Browsers**
   ```bash
   npx playwright test
   ```

**Status: READY FOR EXECUTION** 🚀
