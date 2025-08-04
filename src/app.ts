/**
 * Main Application Entry Point
 * Synapses GRC Platform - Backend API Server
 * Integrates all routes, middleware, and security components
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { SecurityMonitoring, SecurityEventType } from './lib/monitoring';
import { SecurityMiddleware } from './middleware/security';
import apiRoutes from './routes/api';
import { createClient } from '@supabase/supabase-js';
import {
  CSP_CONFIG,
  SECURITY_HEADERS,
  RATE_LIMIT_CONFIG,
  validateEnvironment
} from './config/security';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnvironment();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: CSP_CONFIG,
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
);

// Additional security headers
app.use((req, res, next) => {
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
  next();
});

// CORS Configuration
app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'https://synapses-grc.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean);

      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
const globalLimiter = rateLimit({
  ...RATE_LIMIT_CONFIG,
  max: 1000, // Higher limit for global limiter
  handler: async (req, res) => {
    // Log rate limit exceeded
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.RATE_LIMIT_EXCEEDED,
      'global_rate_limit',
      {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method
      },
      undefined,
      req.ip,
      req.get('User-Agent')
    );

    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

app.use(globalLimiter);

// Request logging middleware
app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const startTime = Date.now();

  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);

  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any) {
    const duration = Date.now() - startTime;

    // Log response
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );

    // Log security events for certain status codes
    if (res.statusCode >= 400) {
      SecurityMonitoring.logSecurityEvent(
        res.statusCode >= 500 ? SecurityEventType.SYSTEM_ERROR : SecurityEventType.ACCESS_DENIED,
        'http_error',
        {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
          userAgent: req.get('User-Agent')
        },
        (req as any).user?.id,
        req.ip,
        req.get('User-Agent')
      ).catch(console.error);
    }

    originalEnd.call(this, chunk, encoding);
  };

  next();
});

// Health check endpoint (before security middleware)
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes with security middleware
app.use(
  '/api',
  SecurityMiddleware.createSecurityMiddleware({
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500 // More restrictive for API routes
    },
    threatDetection: {
      enabled: true,
      blockSuspicious: true
    },
    inputValidation: {
      enabled: true,
      sanitize: true
    }
  }),
  apiRoutes
);

// Static file serving (if needed)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

// 404 handler
app.use('*', async (req: express.Request, res: express.Response) => {
  // Log 404 attempts
  await SecurityMonitoring.logSecurityEvent(
    SecurityEventType.ACCESS_DENIED,
    'route_not_found',
    {
      method: req.method,
      path: req.originalUrl,
      userAgent: req.get('User-Agent')
    },
    (req as any).user?.id,
    req.ip,
    req.get('User-Agent')
  );

  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use(
  async (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', err);

    // Log error
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.SYSTEM_ERROR,
      'application_error',
      {
        error: err.message,
        stack: err.stack,
        method: req.method,
        path: req.path,
        userAgent: req.get('User-Agent')
      },
      (req as any).user?.id,
      req.ip,
      req.get('User-Agent')
    );

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(err.status || 500).json({
      error: isDevelopment ? err.message : 'Internal server error',
      ...(isDevelopment && { stack: err.stack })
    });
  }
);

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');

  // Log shutdown
  await SecurityMonitoring.logSecurityEvent(
    SecurityEventType.SYSTEM_OPERATION,
    'server_shutdown',
    { reason: 'SIGTERM' },
    undefined,
    'system',
    'system'
  );

  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');

  // Log shutdown
  await SecurityMonitoring.logSecurityEvent(
    SecurityEventType.SYSTEM_OPERATION,
    'server_shutdown',
    { reason: 'SIGINT' },
    undefined,
    'system',
    'system'
  );

  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);

  // Log unhandled rejection
  await SecurityMonitoring.logSecurityEvent(
    SecurityEventType.SYSTEM_ERROR,
    'unhandled_rejection',
    {
      reason: reason?.toString(),
      promise: promise?.toString()
    },
    undefined,
    'system',
    'system'
  );
});

// Uncaught exception handler
process.on('uncaughtException', async error => {
  console.error('Uncaught Exception:', error);

  // Log uncaught exception
  await SecurityMonitoring.logSecurityEvent(
    SecurityEventType.SYSTEM_ERROR,
    'uncaught_exception',
    {
      error: error.message,
      stack: error.stack
    },
    undefined,
    'system',
    'system'
  );

  // Exit process after logging
  process.exit(1);
});

// Initialize security monitoring on startup
SecurityMonitoring.initialize()
  .then(() => {
    console.log('Security monitoring initialized');
  })
  .catch(error => {
    console.error('Failed to initialize security monitoring:', error);
  });

// Start server
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, async () => {
    console.log(`🚀 Synapses GRC Platform API Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security monitoring: enabled`);
    console.log(`📋 API Documentation: http://localhost:${PORT}/api/health`);

    // Log server startup
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.SYSTEM_OPERATION,
      'server_startup',
      {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
      },
      undefined,
      'system',
      'system'
    );
  });
}

export default app;
