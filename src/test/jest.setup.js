import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { server } from './mocks/server';
// Configure Testing Library
configure({
    testIdAttribute: 'data-testid',
    asyncUtilTimeout: 5000,
});
// Mock Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
};
// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
};
// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn(),
});
// Mock window.URL.createObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
    writable: true,
    value: jest.fn(() => 'mocked-url'),
});
// Mock window.URL.revokeObjectURL
Object.defineProperty(window.URL, 'revokeObjectURL', {
    writable: true,
    value: jest.fn(),
});
// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;
// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;
// Mock fetch
global.fetch = jest.fn();
// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;
beforeAll(() => {
    // Start MSW server
    server.listen({ onUnhandledRequest: 'error' });
    // Suppress console errors and warnings in tests
    console.error = (...args) => {
        if (typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is deprecated')) {
            return;
        }
        originalError.call(console, ...args);
    };
    console.warn = (...args) => {
        if (typeof args[0] === 'string' &&
            (args[0].includes('Warning: componentWillReceiveProps') ||
                args[0].includes('Warning: componentWillUpdate'))) {
            return;
        }
        originalWarn.call(console, ...args);
    };
});
afterEach(() => {
    // Reset all mocks after each test
    jest.clearAllMocks();
    // Reset MSW handlers
    server.resetHandlers();
    // Clear localStorage and sessionStorage
    localStorageMock.clear();
    sessionStorageMock.clear();
});
afterAll(() => {
    // Stop MSW server
    server.close();
    // Restore console methods
    console.error = originalError;
    console.warn = originalWarn;
});
// Custom matchers for testing
expect.extend({
    toBeInTheDocument(received) {
        const pass = received !== null;
        if (pass) {
            return {
                message: () => `expected ${received} not to be in the document`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be in the document`,
                pass: false,
            };
        }
    },
    toHaveClass(received, className) {
        const pass = received.classList.contains(className);
        if (pass) {
            return {
                message: () => `expected ${received} not to have class ${className}`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to have class ${className}`,
                pass: false,
            };
        }
    },
    toHaveAttribute(received, attribute, value) {
        const hasAttribute = received.hasAttribute(attribute);
        const attributeValue = received.getAttribute(attribute);
        const pass = hasAttribute && (value === undefined || attributeValue === value);
        if (pass) {
            return {
                message: () => `expected ${received} not to have attribute ${attribute}${value ? ` with value ${value}` : ''}`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to have attribute ${attribute}${value ? ` with value ${value}` : ''}`,
                pass: false,
            };
        }
    },
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
                }
                else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                }
                else {
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
            text: async () => JSON.stringify(response),
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
        ...overrides,
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
                ...overrides,
            },
            compliance: {
                id: 'test-compliance-id',
                status: 'compliant',
                score: 95,
                lastCheck: new Date().toISOString(),
                ...overrides,
            },
        };
        return baseData[type] || overrides;
    },
};
