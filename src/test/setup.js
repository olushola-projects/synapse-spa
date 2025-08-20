import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, expect, vi } from 'vitest';
// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);
// Cleanup after each test case
afterEach(() => {
  cleanup();
});
// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));
// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));
// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});
// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn()
});
// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});
// Mock fetch
global.fetch = vi.fn();
// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mocked-url')
});
// Mock URL.revokeObjectURL
Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn()
});
// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;
beforeEach(() => {
  // Suppress console errors and warnings in tests
  console.error = vi.fn();
  console.warn = vi.fn();
});
afterEach(() => {
  // Restore console methods
  console.error = originalError;
  console.warn = originalWarn;
});
// Global test utilities
global.testUtils = {
  // Wait for element to be present
  waitForElement: (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        } else {
          setTimeout(checkElement, 100);
        }
      };
      checkElement();
    });
  },
  // Mock API responses
  mockApiResponse: (url, response, status = 200) => {
    global.fetch.mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      json: async () => response,
      text: async () => JSON.stringify(response)
    });
  },
  // Mock API error
  mockApiError: (url, error, status = 500) => {
    global.fetch.mockRejectedValueOnce(new Error(error));
  },
  // Create test user
  createTestUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    permissions: ['read', 'write'],
    ...overrides
  }),
  // Create test data
  createTestData: (type, overrides = {}) => {
    const baseData = {
      sfdr: {
        id: 'test-sfdr-id',
        name: 'Test SFDR Fund',
        classification: 'Article 8',
        confidence: 0.95,
        citations: ['EU/2020/852', 'EU/2019/2088'],
        ...overrides
      },
      compliance: {
        id: 'test-compliance-id',
        status: 'compliant',
        score: 95,
        lastCheck: new Date().toISOString(),
        ...overrides
      }
    };
    return baseData[type] || overrides;
  }
};
