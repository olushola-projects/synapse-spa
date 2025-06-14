# Testing Guide for Synapses Platform

This document provides comprehensive guidance on testing the Synapses GRC platform, covering unit tests, integration tests, component tests, and end-to-end tests.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

Our testing strategy follows the testing pyramid approach:

```
    /\     E2E Tests (Few)
   /  \    
  /____\   Integration Tests (Some)
 /______\  Unit Tests (Many)
```

### Test Types

1. **Unit Tests**: Test individual functions, classes, and components in isolation
2. **Integration Tests**: Test interactions between multiple components/services
3. **Component Tests**: Test React components with user interactions
4. **End-to-End Tests**: Test complete user workflows across the application

## Testing Stack

### Core Testing Framework
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **MSW (Mock Service Worker)**: API mocking

### Additional Tools
- **@testing-library/jest-dom**: Custom Jest matchers
- **@testing-library/user-event**: User interaction simulation
- **jest-environment-jsdom**: DOM environment for tests
- **ts-jest**: TypeScript support for Jest

## Test Structure

```
src/test/
├── __mocks__/           # Mock files
├── components/          # Component tests
├── e2e/                # End-to-end tests
├── integration/        # Integration tests
├── lib/                # Library/utility tests
├── services/           # Service layer tests
├── utils/              # Test utilities
├── globalSetup.ts      # Global test setup
├── globalTeardown.ts   # Global test cleanup
└── setup.ts            # Test environment setup
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test types
npm run test:unit
npm run test:components
npm run test:integration
npm run test:e2e
```

### Advanced Commands

```bash
# Run tests for specific files
npm test -- --testPathPattern=EnhancedLLMService

# Run tests matching a pattern
npm test -- --testNamePattern="should handle errors"

# Run tests in CI mode
npm run test:ci

# Update snapshots
npm run test:update-snapshots

# Run tests with verbose output
npm run test:verbose

# Run only changed tests
npm run test:changed
```

### Docker Testing

```bash
# Run tests in Docker environment
npm run test:docker

# Clean up Docker test environment
npm run test:docker:down
```

## Writing Tests

### Unit Tests

```typescript
// src/test/services/ExampleService.test.ts
import { ExampleService } from '@/services/ExampleService';
import { mockSupabaseClient } from '@/test/utils/testUtils';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient(),
}));

describe('ExampleService', () => {
  let service: ExampleService;

  beforeEach(() => {
    service = new ExampleService();
    jest.clearAllMocks();
  });

  describe('getData', () => {
    it('should fetch data successfully', async () => {
      // Arrange
      const mockData = { id: '1', name: 'Test' };
      mockSupabaseClient().from().select().mockResolvedValue({
        data: [mockData],
        error: null,
      });

      // Act
      const result = await service.getData();

      // Assert
      expect(result).toEqual([mockData]);
      expect(mockSupabaseClient().from).toHaveBeenCalledWith('table_name');
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const mockError = new Error('Database error');
      mockSupabaseClient().from().select().mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getData()).rejects.toThrow('Database error');
    });
  });
});
```

### Component Tests

```typescript
// src/test/components/ExampleComponent.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test/utils/testUtils';
import { ExampleComponent } from '@/components/ExampleComponent';

describe('ExampleComponent', () => {
  it('should render correctly', () => {
    render(<ExampleComponent title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const mockOnClick = jest.fn();
    render(<ExampleComponent onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  it('should be accessible', () => {
    const { container } = render(<ExampleComponent />);
    
    const accessibilityInfo = checkAriaLabels(container);
    expect(accessibilityInfo.hasAriaLabels).toBe(true);
  });
});
```

### Integration Tests

```typescript
// src/test/integration/dashboard.integration.test.tsx
import { render, screen, waitFor } from '@/test/utils/testUtils';
import { Dashboard } from '@/pages/Dashboard';
import { server } from '@/test/mocks/server';

describe('Dashboard Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should load and display dashboard data', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Total Users: 1,250')).toBeInTheDocument();
    });
  });
});
```

### End-to-End Tests

```typescript
// src/test/e2e/dashboard.e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should display dashboard metrics', async ({ page }) => {
    await expect(page.locator('[data-testid="total-users"]')).toBeVisible();
    await expect(page.locator('[data-testid="active-agents"]')).toBeVisible();
  });

  test('should navigate between tabs', async ({ page }) => {
    await page.click('[data-testid="analytics-tab"]');
    await expect(page.locator('[data-testid="analytics-content"]')).toBeVisible();
    
    await page.click('[data-testid="agents-tab"]');
    await expect(page.locator('[data-testid="agents-content"]')).toBeVisible();
  });
});
```

## Best Practices

### General Guidelines

1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **Test Behavior, Not Implementation**: Focus on what the code does, not how
3. **Use Descriptive Test Names**: Clearly describe what is being tested
4. **Keep Tests Independent**: Each test should be able to run in isolation
5. **Mock External Dependencies**: Use mocks for APIs, databases, and third-party services

### Naming Conventions

```typescript
// Good
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {});
    it('should throw error when email is invalid', () => {});
    it('should hash password before saving', () => {});
  });
});

// Bad
describe('UserService', () => {
  it('test1', () => {});
  it('user creation', () => {});
});
```

### Test Data Management

```typescript
// Use factories for test data
const createMockUser = (overrides = {}) => ({
  id: 'test-id',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
});

// Use the factory in tests
it('should update user profile', () => {
  const user = createMockUser({ name: 'Updated Name' });
  // ... test logic
});
```

### Async Testing

```typescript
// Good - using async/await
it('should fetch user data', async () => {
  const userData = await userService.getUser('123');
  expect(userData).toBeDefined();
});

// Good - using waitFor for UI updates
it('should display loading state', async () => {
  render(<UserProfile userId="123" />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Error Testing

```typescript
it('should handle network errors', async () => {
  // Mock network failure
  mockApiCall.mockRejectedValue(new Error('Network error'));
  
  await expect(service.fetchData()).rejects.toThrow('Network error');
});

it('should display error message to user', async () => {
  // Mock API error
  server.use(
    rest.get('/api/users', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: 'Server error' }));
    })
  );
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('Failed to load users')).toBeInTheDocument();
  });
});
```

## CI/CD Integration

### GitHub Actions

Our CI/CD pipeline runs tests automatically on:
- Push to main/develop branches
- Pull requests
- Daily scheduled runs

### Test Coverage Requirements

- **Minimum Coverage**: 80% for all metrics (lines, functions, branches, statements)
- **Critical Paths**: 95% coverage required
- **New Code**: 90% coverage required

### Quality Gates

1. All unit tests must pass
2. All integration tests must pass
3. All component tests must pass
4. E2E tests must pass (critical paths)
5. Coverage thresholds must be met
6. No security vulnerabilities
7. Performance benchmarks must be met

## Troubleshooting

### Common Issues

#### Tests Timing Out

```typescript
// Increase timeout for slow tests
jest.setTimeout(30000);

// Or for specific test
it('should handle slow operation', async () => {
  // test logic
}, 30000);
```

#### Mock Issues

```typescript
// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Reset modules if needed
beforeEach(() => {
  jest.resetModules();
});
```

#### Memory Leaks

```typescript
// Clean up subscriptions
afterEach(() => {
  // Clean up any subscriptions, timers, etc.
  cleanup();
});
```

### Debugging Tests

```bash
# Run tests with debugging
npm test -- --detectOpenHandles --forceExit

# Run specific test with debugging
npm test -- --testNamePattern="specific test" --verbose

# Debug in VS Code
# Add breakpoints and use "Debug Jest Tests" configuration
```

### Performance Issues

```bash
# Run tests in parallel
npm run test:parallel

# Run tests sequentially if needed
npm run test:sequential

# Clear Jest cache
npm run test:clear-cache
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add appropriate test coverage
4. Update this documentation if needed
5. Follow the established patterns and conventions

For questions or issues with testing, please reach out to the development team or create an issue in the repository.