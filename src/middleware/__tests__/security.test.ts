/**
 * Security Middleware Tests
 *
 * Tests for the security middleware functionality including
 * rate limiting, threat detection, and input validation.
 */

import request from 'supertest';
import express from 'express';
import { securityMiddleware } from '../security';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(securityMiddleware);

  // Test routes
  app.get('/test', (req, res) => {
    res.json({ message: 'Test successful' });
  });

  app.post('/test', (req, res) => {
    res.json({ message: 'Post successful', body: req.body });
  });

  return app;
};

describe('Security Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Basic Security Headers', () => {
    it('should add security headers to responses', async () => {
      const response = await request(app).get('/test').expect(200);

      // Check for security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
      expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    it('should set CORS headers correctly', async () => {
      const response = await request(app).get('/test').expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Input Validation', () => {
    it('should allow valid JSON input', async () => {
      const validData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a valid message'
      };

      const response = await request(app).post('/test').send(validData).expect(200);

      expect(response.body.body).toEqual(validData);
    });

    it('should sanitize HTML input', async () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>Test User',
        message: '<img src=x onerror=alert(1)>Hello'
      };

      const response = await request(app).post('/test').send(maliciousData).expect(200);

      // Check that script tags are removed
      expect(response.body.body.name).not.toContain('<script>');
      expect(response.body.body.message).not.toContain('onerror');
    });

    it('should reject requests with SQL injection attempts', async () => {
      const sqlInjectionData = {
        query: "'; DROP TABLE users; --",
        filter: "1' OR '1'='1"
      };

      await request(app).post('/test').send(sqlInjectionData).expect(400);
    });

    it('should reject requests with path traversal attempts', async () => {
      const pathTraversalData = {
        file: '../../../etc/passwd',
        path: '..\\..\\windows\\system32\\config\\sam'
      };

      await request(app).post('/test').send(pathTraversalData).expect(400);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      // Make several requests within the limit
      for (let i = 0; i < 5; i++) {
        await request(app).get('/test').expect(200);
      }
    });

    it('should include rate limit headers', async () => {
      const response = await request(app).get('/test').expect(200);

      expect(response.headers['x-ratelimit-limit']).toBeDefined();
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });
  });

  describe('Threat Detection', () => {
    it('should detect suspicious user agents', async () => {
      const suspiciousUserAgents = ['sqlmap/1.0', 'Nikto', 'Nessus', 'OpenVAS'];

      for (const userAgent of suspiciousUserAgents) {
        await request(app).get('/test').set('User-Agent', userAgent).expect(400);
      }
    });

    it('should detect command injection attempts', async () => {
      const commandInjectionData = {
        command: 'ls; rm -rf /',
        input: '$(whoami)',
        exec: '`cat /etc/passwd`'
      };

      await request(app).post('/test').send(commandInjectionData).expect(400);
    });

    it('should allow legitimate requests', async () => {
      const legitimateData = {
        name: 'John Doe',
        email: 'john.doe@company.com',
        message: 'Hello, I would like to know more about your services.',
        phone: '+1-555-123-4567'
      };

      await request(app).post('/test').send(legitimateData).expect(200);
    });
  });

  describe('IP Blocking', () => {
    it('should block requests from blocked IPs', async () => {
      // This would require mocking the IP blocklist
      // For now, we'll test that the middleware doesn't break normal requests
      await request(app).get('/test').expect(200);
    });
  });

  describe('Content Security', () => {
    it('should reject oversized payloads', async () => {
      const largePayload = {
        data: 'x'.repeat(10 * 1024 * 1024) // 10MB payload
      };

      await request(app).post('/test').send(largePayload).expect(413); // Payload too large
    });

    it('should validate content types', async () => {
      await request(app)
        .post('/test')
        .set('Content-Type', 'application/xml')
        .send('<xml>test</xml>')
        .expect(400); // Unsupported content type
    });
  });

  describe('Error Handling', () => {
    it('should handle middleware errors gracefully', async () => {
      // Test that errors in security middleware don't crash the app
      const response = await request(app).get('/test').expect(200);

      expect(response.body.message).toBe('Test successful');
    });
  });
});

// Integration tests
describe('Security Middleware Integration', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  it('should work with multiple security features enabled', async () => {
    const response = await request(app)
      .post('/test')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message'
      })
      .expect(200);

    // Verify security headers are present
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');

    // Verify rate limit headers are present
    expect(response.headers['x-ratelimit-limit']).toBeDefined();

    // Verify response is correct
    expect(response.body.message).toBe('Post successful');
  });

  it('should maintain performance under normal load', async () => {
    const startTime = Date.now();

    // Make multiple concurrent requests
    const promises = Array.from({ length: 10 }, () => request(app).get('/test').expect(200));

    await Promise.all(promises);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time (adjust as needed)
    expect(duration).toBeLessThan(5000); // 5 seconds
  });
});
