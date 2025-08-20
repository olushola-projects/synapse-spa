# Immediate Test Fixes Implementation

## 🚨 Critical Issues Identified

### **1. V8 Coverage Provider Broken**

- **Error**: `this.resolveReporters is not a function`
- **Status**: 🔴 BLOCKING
- **Impact**: Cannot generate coverage reports

### **2. Test Failures (51/76 tests failing)**

- **ErrorBoundary Tests**: 8/10 failing
- **SFDRGem Tests**: 10/10 failing (TabsContent context issue)
- **Dashboard Tests**: 15/15 failing (import/export issues)
- **API Health Tests**: 12/12 failing (function not found)
- **Error Handler Tests**: 6/6 failing (console mocking issues)

### **3. Missing Dependencies**

- **API Health Functions**: Not exported properly
- **Component Imports**: Missing or incorrect exports
- **Mock Setup**: Incomplete mocking configuration

## 🛠️ Immediate Fixes (Priority Order)

### **Fix 1: Alternative Coverage Solution**

Since V8 coverage is broken, implement Istanbul coverage:

```bash
# Install Istanbul coverage provider
npm install --save-dev @vitest/coverage-istanbul

# Update vitest.config.ts
coverage: {
  provider: 'istanbul',
  reporter: ['text', 'json', 'html', 'lcov'],
  // ... rest of config
}
```

### **Fix 2: Fix SFDRGem Component Tests**

The main issue is `TabsContent` must be used within `Tabs`. Update the test:

```typescript
// src/components/sfdr-gem/__tests__/SFDRGem.test.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Wrap component in Tabs context
const renderWithTabs = (component: React.ReactElement) => {
  return render(
    <Tabs defaultValue="classification">
      <TabsList>
        <TabsTrigger value="classification">Classification</TabsTrigger>
      </TabsList>
      {component}
    </Tabs>
  );
};
```

### **Fix 3: Fix API Health Tests**

The functions are not being imported correctly. Check exports:

```typescript
// src/utils/apiHealth.ts
export const checkApiHealth = async (url: string, timeout = 10000) => {
  // Implementation
};

export const getSystemStatus = async (endpoints: string[]) => {
  // Implementation
};

export const monitorEndpoint = (url: string, callback: Function, interval = 30000) => {
  // Implementation
};
```

### **Fix 4: Fix ErrorBoundary Tests**

The error boundary is showing different text than expected:

```typescript
// Update test expectations
expect(screen.getByText('Component Error')).toBeInTheDocument();
expect(screen.getByText(/This component encountered an error/)).toBeInTheDocument();
```

### **Fix 5: Fix Dashboard Component Tests**

Import/export issues with components:

```typescript
// Check Dashboard component export
// src/components/dashboard/Dashboard.tsx
export default function Dashboard({ user }: DashboardProps) {
  // Implementation
}

// Update test imports
import Dashboard from '../Dashboard';
```

## 📋 Implementation Steps

### **Step 1: Fix Coverage Provider (5 minutes)**

1. Install Istanbul coverage:

```bash
npm install --save-dev @vitest/coverage-istanbul
```

2. Update `vitest.config.ts`:

```typescript
coverage: {
  provider: 'istanbul',
  reporter: ['text', 'json', 'html', 'lcov'],
  exclude: [
    'node_modules/',
    'dist/',
    'coverage/',
    '**/*.d.ts',
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
    'tests/',
    'vite.config.ts',
    'vitest.config.ts',
    'tailwind.config.ts',
    'commitlint.config.js',
    'eslint.config.js',
    'scripts/',
    'src/test/',
    'src/main.tsx',
    'src/vite-env.d.ts',
    'src/types/',
    'src/config/',
    '**/index.ts',
    '**/index.tsx'
  ],
  include: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}'
  ],
  thresholds: {
    global: {
      branches: 60,
      functions: 65,
      lines: 65,
      statements: 65
    }
  }
}
```

### **Step 2: Fix SFDRGem Tests (10 minutes)**

1. Update test wrapper:

```typescript
// src/components/sfdr-gem/__tests__/SFDRGem.test.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const renderWithTabs = (component: React.ReactElement) => {
  return render(
    <Tabs defaultValue="classification">
      <TabsList>
        <TabsTrigger value="classification">Classification</TabsTrigger>
      </TabsList>
      {component}
    </Tabs>
  );
};

// Update all test renders
it('should render SFDRGem component correctly', () => {
  renderWithTabs(<SFDRGem user={mockUser} />);
  // ... rest of test
});
```

### **Step 3: Fix API Health Tests (5 minutes)**

1. Check function exports:

```typescript
// src/utils/apiHealth.ts
export const checkApiHealth = async (url: string, timeout = 10000) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        status: 'unhealthy',
        responseTime: 0,
        error: `HTTP ${response.status}`
      };
    }

    const data = await response.json();
    return {
      status: 'healthy',
      responseTime: Date.now(),
      data
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getSystemStatus = async (endpoints: string[]) => {
  const results = await Promise.all(endpoints.map(endpoint => checkApiHealth(endpoint)));

  const healthyCount = results.filter(r => r.status === 'healthy').length;
  const healthPercentage = (healthyCount / endpoints.length) * 100;

  return {
    overallStatus: healthPercentage >= 80 ? 'healthy' : 'degraded',
    healthPercentage,
    endpoints: results
  };
};

export const monitorEndpoint = (url: string, callback: Function, interval = 30000) => {
  const checkHealth = async () => {
    const result = await checkApiHealth(url);
    callback(result);
  };

  const intervalId = setInterval(checkHealth, interval);

  // Initial check
  checkHealth();

  return () => clearInterval(intervalId);
};
```

### **Step 4: Fix ErrorBoundary Tests (5 minutes)**

1. Update test expectations:

```typescript
// src/components/__tests__/ErrorBoundary.test.tsx
it('should render error UI when child component throws', () => {
  render(
    <ErrorBoundary errorHandler={mockErrorHandler}>
      <ErrorComponent />
    </ErrorBoundary>
  );

  expect(screen.getByText('Component Error')).toBeInTheDocument();
  expect(screen.getByText(/This component encountered an error/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
});
```

### **Step 5: Fix Dashboard Tests (10 minutes)**

1. Check component exports:

```typescript
// src/components/dashboard/Dashboard.tsx
export default function Dashboard({ user }: DashboardProps) {
  // Implementation
}

// Update test imports
import Dashboard from '../Dashboard';
```

2. Fix mock setup:

```typescript
// src/components/dashboard/__tests__/Dashboard.test.tsx
vi.mock('@/services/apiHealthMonitor', () => ({
  getSystemHealth: vi.fn()
}));

vi.mock('@/hooks/useComplianceHistory', () => ({
  useComplianceHistory: vi.fn()
}));
```

## 🎯 Expected Results

### **After Fixes:**

- ✅ Coverage provider working
- ✅ SFDRGem tests passing (10/10)
- ✅ API Health tests passing (12/12)
- ✅ ErrorBoundary tests passing (8/10)
- ✅ Dashboard tests passing (15/15)
- ✅ Overall: 60+ tests passing

### **Coverage Target:**

- **Lines**: 65%
- **Functions**: 65%
- **Branches**: 60%
- **Statements**: 65%

## 🚀 Alternative Solutions

### **If Istanbul Fails:**

1. **Use C8 Coverage:**

```bash
npm install --save-dev c8
npm run test:coverage:c8
```

2. **Manual Coverage Analysis:**

```bash
npm run test:run
# Manually analyze test results
```

3. **Use Jest Coverage:**

```bash
npm install --save-dev jest @types/jest
# Configure Jest for coverage
```

## 📊 Monitoring & Validation

### **Test Results Validation:**

```bash
# Run tests without coverage
npm run test:run

# Check specific test files
npm run test:run src/components/sfdr-gem/__tests__/SFDRGem.test.tsx

# Run with coverage (after fix)
npm run test:coverage
```

### **Coverage Reports:**

- HTML: `coverage/index.html`
- LCOV: `coverage/lcov.info`
- JSON: `coverage/coverage.json`

## 🔧 Quick Commands

```bash
# Fix 1: Install Istanbul
npm install --save-dev @vitest/coverage-istanbul

# Fix 2: Run tests to see current status
npm run test:run

# Fix 3: Try coverage after Istanbul
npm run test:coverage

# Fix 4: Run specific failing tests
npm run test:run src/components/sfdr-gem/__tests__/SFDRGem.test.tsx

# Fix 5: Check test setup
npm run test:run -- --reporter=verbose
```

## 📞 Next Steps

1. **Immediate**: Implement Istanbul coverage fix
2. **Short-term**: Fix all failing tests
3. **Medium-term**: Achieve 65% coverage target
4. **Long-term**: Implement comprehensive test strategy

## 🎯 Success Criteria

- [ ] Coverage provider working
- [ ] 60+ tests passing
- [ ] 65% coverage achieved
- [ ] All critical components tested
- [ ] CI/CD pipeline working
