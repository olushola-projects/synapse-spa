import { setupServer } from 'msw/node';
import { rest } from 'msw';
// API base URLs
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
// Mock handlers for API endpoints
export const handlers = [
    // Authentication endpoints
    rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            user: {
                id: 'test-user-id',
                email: 'test@example.com',
                name: 'Test User',
                role: 'user',
                permissions: ['read', 'write']
            },
            token: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token'
        }));
    }),
    rest.post(`${API_BASE_URL}/auth/refresh`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            token: 'new-mock-jwt-token',
            refreshToken: 'new-mock-refresh-token'
        }));
    }),
    rest.post(`${API_BASE_URL}/auth/logout`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: 'Logged out successfully' }));
    }),
    // SFDR Classification endpoints
    rest.post(`${API_BASE_URL}/api/sfdr/classify`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            id: 'test-classification-id',
            classification: 'Article 8',
            confidence: 0.95,
            citations: ['EU/2020/852', 'EU/2019/2088'],
            reasoning: 'This fund promotes environmental and social characteristics',
            timestamp: new Date().toISOString()
        }));
    }),
    rest.get(`${API_BASE_URL}/api/sfdr/classifications`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            classifications: [
                {
                    id: 'test-1',
                    fundName: 'Test Fund 1',
                    classification: 'Article 8',
                    confidence: 0.95,
                    timestamp: new Date().toISOString()
                },
                {
                    id: 'test-2',
                    fundName: 'Test Fund 2',
                    classification: 'Article 9',
                    confidence: 0.98,
                    timestamp: new Date().toISOString()
                }
            ],
            total: 2,
            page: 1,
            limit: 10
        }));
    }),
    // Compliance endpoints
    rest.get(`${API_BASE_URL}/api/compliance/status`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            status: 'compliant',
            score: 95,
            lastCheck: new Date().toISOString(),
            violations: [],
            recommendations: [
                {
                    id: 'rec-1',
                    title: 'Update privacy policy',
                    priority: 'medium',
                    description: 'Ensure privacy policy reflects latest GDPR requirements'
                }
            ]
        }));
    }),
    rest.post(`${API_BASE_URL}/api/compliance/check`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            checkId: 'test-check-id',
            status: 'completed',
            results: {
                gdpr: { compliant: true, score: 98 },
                sfdr: { compliant: true, score: 95 },
                soc2: { compliant: true, score: 92 }
            },
            timestamp: new Date().toISOString()
        }));
    }),
    // Dashboard endpoints
    rest.get(`${API_BASE_URL}/api/dashboard/metrics`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            totalFunds: 150,
            compliantFunds: 142,
            nonCompliantFunds: 8,
            averageScore: 94.5,
            recentActivity: [
                {
                    id: 'activity-1',
                    type: 'classification',
                    fundName: 'Test Fund',
                    timestamp: new Date().toISOString()
                }
            ]
        }));
    }),
    // User management endpoints
    rest.get(`${API_BASE_URL}/api/users/profile`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            id: 'test-user-id',
            email: 'test@example.com',
            name: 'Test User',
            role: 'user',
            permissions: ['read', 'write'],
            preferences: {
                theme: 'light',
                language: 'en',
                notifications: true
            }
        }));
    }),
    rest.put(`${API_BASE_URL}/api/users/profile`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            message: 'Profile updated successfully',
            user: {
                id: 'test-user-id',
                email: 'test@example.com',
                name: 'Updated Test User',
                role: 'user',
                permissions: ['read', 'write']
            }
        }));
    }),
    // Document processing endpoints
    rest.post(`${API_BASE_URL}/api/documents/upload`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            documentId: 'test-doc-id',
            filename: 'test-document.pdf',
            status: 'processing',
            uploadTime: new Date().toISOString()
        }));
    }),
    rest.get(`${API_BASE_URL}/api/documents/:id/status`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            documentId: req.params.id,
            status: 'completed',
            extractedText: 'Sample extracted text from document',
            entities: [
                { type: 'fund_name', value: 'Test Fund', confidence: 0.95 },
                { type: 'classification', value: 'Article 8', confidence: 0.92 }
            ],
            processingTime: 2.5
        }));
    }),
    // Analytics endpoints
    rest.get(`${API_BASE_URL}/api/analytics/performance`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            responseTime: {
                average: 150,
                p95: 250,
                p99: 350
            },
            throughput: {
                requestsPerSecond: 100,
                totalRequests: 10000
            },
            errors: {
                rate: 0.02,
                total: 200
            }
        }));
    }),
    // Health check endpoint
    rest.get(`${API_BASE_URL}/api/health`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            services: {
                database: 'healthy',
                cache: 'healthy',
                external: 'healthy'
            }
        }));
    }),
    // Supabase endpoints
    rest.get(`${SUPABASE_URL}/rest/v1/profiles`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([
            {
                id: 'test-profile-id',
                email: 'test@example.com',
                name: 'Test User',
                role: 'user',
                created_at: new Date().toISOString()
            }
        ]));
    }),
    // Error handlers
    rest.all('*', (req, res, ctx) => {
        console.warn(`Unhandled request: ${req.method} ${req.url}`);
        return res(ctx.status(404), ctx.json({
            error: 'Not found',
            message: `No handler found for ${req.method} ${req.url}`
        }));
    })
];
// Create MSW server
export const server = setupServer(...handlers);
// Export individual handlers for testing
export const authHandlers = handlers.filter(handler => handler.info.header.includes('/auth/'));
export const sfdrHandlers = handlers.filter(handler => handler.info.header.includes('/sfdr/'));
export const complianceHandlers = handlers.filter(handler => handler.info.header.includes('/compliance/'));
export const dashboardHandlers = handlers.filter(handler => handler.info.header.includes('/dashboard/'));
// Utility functions for testing
export const mockApiResponses = {
    // Mock successful responses
    success: (endpoint, data) => {
        server.use(rest.all(endpoint, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(data));
        }));
    },
    // Mock error responses
    error: (endpoint, status = 500, message = 'Internal server error') => {
        server.use(rest.all(endpoint, (req, res, ctx) => {
            return res(ctx.status(status), ctx.json({
                error: message,
                status
            }));
        }));
    },
    // Mock network errors
    networkError: (endpoint) => {
        server.use(rest.all(endpoint, (req, res, ctx) => {
            return res.networkError('Failed to connect');
        }));
    },
    // Mock delayed responses
    delayed: (endpoint, data, delay = 1000) => {
        server.use(rest.all(endpoint, (req, res, ctx) => {
            return res(ctx.delay(delay), ctx.status(200), ctx.json(data));
        }));
    }
};
// Test data factories
export const createMockUser = (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    permissions: ['read', 'write'],
    ...overrides
});
export const createMockSFDRClassification = (overrides = {}) => ({
    id: 'test-classification-id',
    fundName: 'Test Fund',
    classification: 'Article 8',
    confidence: 0.95,
    citations: ['EU/2020/852', 'EU/2019/2088'],
    reasoning: 'This fund promotes environmental and social characteristics',
    timestamp: new Date().toISOString(),
    ...overrides
});
export const createMockComplianceStatus = (overrides = {}) => ({
    status: 'compliant',
    score: 95,
    lastCheck: new Date().toISOString(),
    violations: [],
    recommendations: [],
    ...overrides
});
