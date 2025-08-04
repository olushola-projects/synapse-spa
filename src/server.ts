#!/usr/bin/env node

/**
 * Synapses GRC Platform - Backend Server Entry Point
 *
 * This file serves as the main entry point for the Express.js backend server.
 * It initializes the application, sets up error handling, and starts the server.
 *
 * Features:
 * - Environment configuration loading
 * - Graceful shutdown handling
 * - Process error handling
 * - Server startup logging
 * - Health check initialization
 */

import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import app from './app';
import { SecurityMonitoring } from './lib/monitoring';

// Load environment variables
dotenv.config();

// Configuration
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_VERSION = process.env.APP_VERSION || '1.0.0';

// Create HTTP server
const server = createServer(app);

/**
 * Start the server
 */
function startServer(): void {
  server.listen(PORT, () => {
    console.log(`\n🚀 Synapses GRC Platform Backend Server`);
    console.log(`📍 Environment: ${NODE_ENV}`);
    console.log(`🔢 Version: ${APP_VERSION}`);
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/api`);

    if (NODE_ENV === 'development') {
      console.log(`🔧 Development mode - Hot reload enabled`);
    }

    console.log(`\n✅ Server started successfully at ${new Date().toISOString()}\n`);

    // Log server startup event
    SecurityMonitoring.logSecurityEvent({
      type: 'server_startup',
      severity: 'info',
      message: 'Backend server started successfully',
      metadata: {
        port: PORT,
        environment: NODE_ENV,
        version: APP_VERSION,
        timestamp: new Date().toISOString()
      }
    });
  });
}

/**
 * Graceful shutdown handler
 */
function gracefulShutdown(signal: string): void {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  // Log shutdown event
  SecurityMonitoring.logSecurityEvent({
    type: 'server_shutdown',
    severity: 'info',
    message: `Server shutdown initiated by ${signal}`,
    metadata: {
      signal,
      timestamp: new Date().toISOString()
    }
  });

  server.close(err => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }

    console.log('✅ Server closed successfully');
    console.log('🔄 Cleaning up resources...');

    // Perform cleanup tasks here
    // - Close database connections
    // - Clear intervals/timeouts
    // - Save any pending data

    console.log('✅ Cleanup completed');
    console.log('👋 Goodbye!\n');

    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown after 30 seconds');
    process.exit(1);
  }, 30000);
}

/**
 * Error handlers
 */
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);

  SecurityMonitoring.logSecurityEvent({
    type: 'uncaught_exception',
    severity: 'critical',
    message: 'Uncaught exception occurred',
    metadata: {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }
  });

  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);

  SecurityMonitoring.logSecurityEvent({
    type: 'unhandled_rejection',
    severity: 'critical',
    message: 'Unhandled promise rejection occurred',
    metadata: {
      reason: reason?.toString() || 'Unknown reason',
      timestamp: new Date().toISOString()
    }
  });

  gracefulShutdown('UNHANDLED_REJECTION');
});

// Graceful shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle Windows specific signals
if (process.platform === 'win32') {
  process.on('SIGBREAK', () => gracefulShutdown('SIGBREAK'));
}

/**
 * Server error handler
 */
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`❌ ${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`❌ ${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

/**
 * Server listening handler
 */
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.log(`🎧 Server listening on ${bind}`);
});

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default server;
export { app };
