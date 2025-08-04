# Synapses GRC Platform - Backend Development Guide

## Overview

This document provides comprehensive guidance for developing and maintaining the backend components of the Synapses GRC Platform. The backend is built with Node.js, Express.js, and TypeScript, providing a robust API for compliance management, risk assessment, and audit functionality.

## 🏗️ Architecture

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Caching**: Redis
- **Authentication**: JWT + Session-based
- **Testing**: Jest + Supertest
- **Documentation**: OpenAPI/Swagger

### Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server entry point
├── middleware/            # Custom middleware
│   ├── security.ts        # Security middleware
│   ├── auth.ts           # Authentication middleware
│   └── validation.ts     # Input validation
├── routes/               # API routes
│   └── api/
│       ├── index.ts      # Main API router
│       ├── auth.ts       # Authentication routes
│       ├── compliance.ts # Compliance management
│       ├── audit.ts      # Audit management
│       ├── risk.ts       # Risk assessment
│       ├── reporting.ts  # Reports and analytics
│       ├── admin.ts      # Admin functions
│       └── health.ts     # Health checks
├── utils/                # Utility functions
│   ├── SecurityMonitoring.ts
│   ├── supabase.ts
│   └── validation.ts
└── types/                # TypeScript type definitions
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Redis server (for caching and sessions)
- Supabase account and project

### Installation

1. **Clone and setup**:

   ```bash
   git clone <repository-url>
   cd synapse-landing-nexus
   npm install
   ```

2. **Environment Configuration**:

   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration values
   ```

3. **Start Development**:

   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start backend only
   npm run dev:backend
   ```

### Environment Variables

Key environment variables for backend development:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
BACKEND_URL=http://localhost:3001

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
SESSION_SECRET=your_session_secret

# Redis
REDIS_URL=redis://localhost:6379

# Security
SECURITY_MONITORING_ENABLED=true
THREAT_DETECTION_ENABLED=true
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev                 # Start both frontend and backend
npm run dev:backend         # Start backend only with hot reload
npm run dev:frontend        # Start frontend only

# Building
npm run build              # Build both frontend and backend
npm run build:backend      # Build backend only
npm run build:frontend     # Build frontend only

# Testing
npm test                   # Run all tests
npm run test:backend       # Run backend tests only
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run type-check         # TypeScript type checking
npm run format             # Format code with Prettier

# Database
npm run db:migrate         # Run database migrations
npm run db:seed            # Seed database with test data
npm run db:reset           # Reset database

# Security
npm run security:scan      # Run security vulnerability scan
npm run security:audit     # Audit dependencies

# Documentation
npm run docs:generate      # Generate API documentation
npm run docs:serve         # Serve documentation locally
```

### Hot Reload Development

The backend uses `nodemon` for hot reloading during development:

- Watches TypeScript files in `src/`
- Automatically restarts on file changes
- Includes source maps for debugging
- Environment variables are reloaded

### API Development

#### Creating New Routes

1. **Create route file** in `src/routes/api/`:

   ```typescript
   import { Router } from 'express';
   import { authenticateToken } from '../../middleware/auth';

   const router = Router();

   router.get('/', authenticateToken, async (req, res) => {
     // Route implementation
   });

   export default router;
   ```

2. **Register route** in `src/routes/api/index.ts`:
   ```typescript
   import newRoutes from './new-routes';
   app.use('/new-routes', newRoutes);
   ```

#### Middleware Usage

```typescript
import { securityMiddleware } from '../middleware/security';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateInput } from '../middleware/validation';

// Apply security middleware globally
app.use(securityMiddleware);

// Protect specific routes
router.get('/protected', authenticateToken, handler);
router.post('/admin', authenticateToken, requireRole('admin'), handler);
router.post('/data', validateInput(schema), handler);
```

## 🧪 Testing

### Test Structure

```
src/
├── middleware/
│   └── __tests__/
│       └── security.test.ts
├── routes/
│   └── __tests__/
│       ├── auth.test.ts
│       └── compliance.test.ts
└── utils/
    └── __tests__/
        └── validation.test.ts

tests/
├── setup.ts              # Test setup and utilities
├── globalSetup.ts        # Global test setup
└── globalTeardown.ts     # Global test cleanup
```

### Writing Tests

```typescript
import request from 'supertest';
import app from '../app';

describe('API Endpoint', () => {
  it('should return success response', async () => {
    const response = await request(app)
      .get('/api/test')
      .set('Authorization', `Bearer ${testUtils.mockToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
  });
});
```

### Test Utilities

Global test utilities are available via `testUtils`:

```typescript
// Mock data
testUtils.mockUser;
testUtils.mockAdmin;
testUtils.mockToken;

// Mock objects
testUtils.mockRequest();
testUtils.mockResponse();
testUtils.mockNext();

// Utilities
testUtils.randomString();
testUtils.randomEmail();
testUtils.wait(1000);
```

## 🔒 Security

### Security Middleware

The security middleware provides:

- **Rate Limiting**: Prevents abuse and DoS attacks
- **Input Validation**: Sanitizes and validates all inputs
- **Threat Detection**: Identifies suspicious patterns
- **Security Headers**: Adds protective HTTP headers
- **IP Blocking**: Blocks malicious IP addresses
- **CORS Protection**: Configures cross-origin requests

### Authentication Flow

1. **Login**: User provides credentials
2. **Verification**: Credentials validated against Supabase
3. **Token Generation**: JWT tokens issued
4. **Session Creation**: Server-side session established
5. **Request Authentication**: Tokens validated on each request

### Security Monitoring

All security events are logged and monitored:

```typescript
import { SecurityMonitoring } from '../utils/SecurityMonitoring';

SecurityMonitoring.logSecurityEvent({
  type: 'suspicious_activity',
  severity: 'high',
  message: 'Multiple failed login attempts',
  metadata: { ip, userAgent, attempts }
});
```

## 📊 Monitoring & Logging

### Health Checks

Health check endpoints are available at:

- `GET /api/health` - Basic health status
- `GET /api/health/detailed` - Detailed system status
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

### Logging

Structured logging with Winston:

```typescript
import logger from '../utils/logger';

logger.info('Operation completed', { userId, operation, duration });
logger.error('Operation failed', { error: error.message, stack: error.stack });
```

### Metrics

Key metrics are tracked:

- Request/response times
- Error rates
- Authentication attempts
- Security events
- Database query performance

## 🚀 Deployment

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Configuration

Production environment variables:

```env
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
SECURITY_MONITORING_ENABLED=true
RATE_LIMIT_ENABLED=true
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**:

   ```bash
   # Find process using port 3001
   netstat -ano | findstr :3001
   # Kill the process
   taskkill /PID <process_id> /F
   ```

2. **Redis Connection Issues**:

   ```bash
   # Start Redis server
   redis-server
   # Check Redis status
   redis-cli ping
   ```

3. **Database Connection Issues**:
   - Verify Supabase URL and keys
   - Check network connectivity
   - Validate database permissions

4. **TypeScript Compilation Errors**:
   ```bash
   # Clean and rebuild
   npm run clean
   npm run build:backend
   ```

### Debug Mode

Enable debug logging:

```env
DEBUG=true
VERBOSE_LOGGING=true
LOG_LEVEL=debug
```

## 📚 API Documentation

API documentation is automatically generated and available at:

- Development: `http://localhost:3001/api/docs`
- Swagger UI: `http://localhost:3001/api/swagger`

### Generating Documentation

```bash
npm run docs:generate
npm run docs:serve
```

## 🤝 Contributing

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Document API endpoints with OpenAPI specs
- Follow security best practices

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Run full test suite
4. Update documentation
5. Submit pull request

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are comprehensive and passing
- [ ] Security considerations addressed
- [ ] Documentation updated
- [ ] Performance impact considered
- [ ] Error handling implemented

## 📞 Support

For backend development support:

- Check the troubleshooting section
- Review API documentation
- Check existing issues and discussions
- Contact the development team

---

**Last Updated**: December 2024
**Version**: 1.0.0
