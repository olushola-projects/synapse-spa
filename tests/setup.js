/**
 * Jest Test Setup
 *
 * This file runs before each test file and sets up the testing environment.
 */
import dotenv from 'dotenv';
import path from 'path';
// Load test environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.test') });
// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key';
process.env.SESSION_SECRET = 'test-session-secret-key';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.REDIS_URL = 'redis://localhost:6379/1';
process.env.LOG_LEVEL = 'error';
process.env.SECURITY_MONITORING_ENABLED = 'false';
process.env.RATE_LIMIT_ENABLED = 'false';
// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
beforeAll(() => {
    // Suppress console output during tests unless explicitly needed
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    // Keep console.error for debugging
});
afterAll(() => {
    // Restore console methods
    Object.assign(console, originalConsole);
});
// Global test utilities
global.testUtils = {
    // Mock user data
    mockUser: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        organizationId: 'test-org-id'
    },
    // Mock admin user data
    mockAdmin: {
        id: 'test-admin-id',
        email: 'admin@example.com',
        name: 'Test Admin',
        role: 'admin',
        organizationId: 'test-org-id'
    },
    // Mock JWT token
    mockToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxNjMwMDg2NDAwfQ.test-signature',
    // Mock request object
    mockRequest: (overrides = {}) => ({
        body: {},
        params: {},
        query: {},
        headers: {},
        user: null,
        ip: '127.0.0.1',
        method: 'GET',
        url: '/test',
        ...overrides
    }),
    // Mock response object
    mockResponse: () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        res.cookie = jest.fn().mockReturnValue(res);
        res.clearCookie = jest.fn().mockReturnValue(res);
        res.redirect = jest.fn().mockReturnValue(res);
        res.header = jest.fn().mockReturnValue(res);
        res.set = jest.fn().mockReturnValue(res);
        return res;
    },
    // Mock next function
    mockNext: () => jest.fn(),
    // Wait utility for async tests
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    // Generate random test data
    randomString: (length = 10) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    randomEmail: () => `test-${Math.random().toString(36).substring(7)}@example.com`,
    randomId: () => `test-${Math.random().toString(36).substring(7)}`
};
// Custom Jest matchers
expect.extend({
    toBeValidUUID(received) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const pass = uuidRegex.test(received);
        return {
            message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid UUID`,
            pass
        };
    },
    toBeValidEmail(received) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const pass = emailRegex.test(received);
        return {
            message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid email`,
            pass
        };
    },
    toBeValidDate(received) {
        const date = new Date(received);
        const pass = !isNaN(date.getTime());
        return {
            message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid date`,
            pass
        };
    }
});
