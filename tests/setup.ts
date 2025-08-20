import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

// Extend Vitest's expect with Testing Library's matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.ResizeObserver = mockResizeObserver;

// Mock window.fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn()
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock console.error to fail tests
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  originalConsoleError(...args);
  throw new Error('Console.error was called during test execution');
};

// Mock console.warn to fail tests in CI
if (process.env.CI) {
  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    originalConsoleWarn(...args);
    throw new Error('Console.warn was called during test execution in CI');
  };
}

// Global test timeout
vi.setConfig({ testTimeout: 10000 });

// Mock date to ensure consistent timestamps in tests
vi.setSystemTime(new Date('2025-01-30'));