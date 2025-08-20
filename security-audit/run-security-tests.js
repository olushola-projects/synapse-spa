/**
 * Comprehensive Security Testing Script
 * Zero-Trust Security Validation for Synapses GRC Platform
 * Top 0.001% Security Professional Standards
 */

import https from 'https';
import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SecurityTester {
  constructor() {
    this.targetUrl = process.env.TARGET_URL || 'http://localhost:3000';
    this.results = {
      authentication: { passed: 0, failed: 0, tests: [] },
      authorization: { passed: 0, failed: 0, tests: [] },
      inputValidation: { passed: 0, failed: 0, tests: [] },
      apiSecurity: { passed: 0, failed: 0, tests: [] },
      dataProtection: { passed: 0, failed: 0, tests: [] },
      overall: { score: 0, grade: 'F', vulnerabilities: [] }
    };
  }

  async runComprehensiveSecurityTest() {
    console.log('🔒 Starting Comprehensive Security Testing...');
    console.log(`🎯 Target: ${this.targetUrl}`);
    console.log('📊 Expert Level: Top 0.001% Security Professional Standards\n');

    const startTime = Date.now();

    try {
      // Run all security test categories
      await this.testAuthenticationSecurity();
      await this.testAuthorizationSecurity();
      await this.testInputValidationSecurity();
      await this.testAPISecurity();
      await this.testDataProtectionSecurity();

      // Calculate overall security score
      this.calculateOverallScore();

      // Generate comprehensive report
      const report = this.generateSecurityReport();

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      console.log('\n📊 SECURITY TEST RESULTS');
      console.log('========================');
      console.log(`⏱️  Duration: ${duration}s`);
      console.log(
        `🎯 Overall Score: ${this.results.overall.score}/100 (${this.results.overall.grade})`
      );
      console.log(`🔍 Total Tests: ${this.getTotalTests()}`);
      console.log(`✅ Passed: ${this.getTotalPassed()}`);
      console.log(`❌ Failed: ${this.getTotalFailed()}`);

      // Save detailed report
      const reportPath = `./security-audit/security-test-results-${Date.now()}.json`;
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Detailed report saved to: ${reportPath}`);

      return report;
    } catch (error) {
      console.error('❌ Security testing failed:', error);
      return { error: error.message };
    }
  }

  async testAuthenticationSecurity() {
    console.log('🔐 Testing Authentication Security...');

    const tests = [
      { name: 'JWT Token Validation', test: this.testJWTValidation },
      { name: 'Session Management', test: this.testSessionManagement },
      { name: 'MFA Implementation', test: this.testMFAImplementation },
      { name: 'Password Policy', test: this.testPasswordPolicy },
      { name: 'Brute Force Protection', test: this.testBruteForceProtection }
    ];

    for (const test of tests) {
      try {
        const result = await test.test.call(this);
        this.results.authentication.tests.push({
          name: test.name,
          result,
          timestamp: new Date().toISOString()
        });

        if (result.passed) {
          this.results.authentication.passed++;
          console.log(`  ✅ ${test.name}: PASSED`);
        } else {
          this.results.authentication.failed++;
          console.log(`  ❌ ${test.name}: FAILED - ${result.reason}`);
        }
      } catch (error) {
        this.results.authentication.failed++;
        this.results.authentication.tests.push({
          name: test.name,
          result: { passed: false, reason: error.message },
          timestamp: new Date().toISOString()
        });
        console.log(`  ❌ ${test.name}: ERROR - ${error.message}`);
      }
    }
  }

  async testAuthorizationSecurity() {
    console.log('🔑 Testing Authorization Security...');

    const tests = [
      { name: 'Role-Based Access Control', test: this.testRBAC },
      { name: 'Privilege Escalation Prevention', test: this.testPrivilegeEscalation },
      { name: 'API Endpoint Protection', test: this.testAPIEndpointProtection },
      { name: 'Resource Access Control', test: this.testResourceAccessControl }
    ];

    for (const test of tests) {
      try {
        const result = await test.test.call(this);
        this.results.authorization.tests.push({
          name: test.name,
          result,
          timestamp: new Date().toISOString()
        });

        if (result.passed) {
          this.results.authorization.passed++;
          console.log(`  ✅ ${test.name}: PASSED`);
        } else {
          this.results.authorization.failed++;
          console.log(`  ❌ ${test.name}: FAILED - ${result.reason}`);
        }
      } catch (error) {
        this.results.authorization.failed++;
        this.results.authorization.tests.push({
          name: test.name,
          result: { passed: false, reason: error.message },
          timestamp: new Date().toISOString()
        });
        console.log(`  ❌ ${test.name}: ERROR - ${error.message}`);
      }
    }
  }

  async testInputValidationSecurity() {
    console.log('🛡️ Testing Input Validation Security...');

    const tests = [
      { name: 'SQL Injection Prevention', test: this.testSQLInjectionPrevention },
      { name: 'XSS Prevention', test: this.testXSSPrevention },
      { name: 'NoSQL Injection Prevention', test: this.testNoSQLInjectionPrevention },
      { name: 'Command Injection Prevention', test: this.testCommandInjectionPrevention },
      { name: 'Path Traversal Prevention', test: this.testPathTraversalPrevention }
    ];

    for (const test of tests) {
      try {
        const result = await test.test.call(this);
        this.results.inputValidation.tests.push({
          name: test.name,
          result,
          timestamp: new Date().toISOString()
        });

        if (result.passed) {
          this.results.inputValidation.passed++;
          console.log(`  ✅ ${test.name}: PASSED`);
        } else {
          this.results.inputValidation.failed++;
          console.log(`  ❌ ${test.name}: FAILED - ${result.reason}`);
        }
      } catch (error) {
        this.results.inputValidation.failed++;
        this.results.inputValidation.tests.push({
          name: test.name,
          result: { passed: false, reason: error.message },
          timestamp: new Date().toISOString()
        });
        console.log(`  ❌ ${test.name}: ERROR - ${error.message}`);
      }
    }
  }

  async testAPISecurity() {
    console.log('🔌 Testing API Security...');

    const tests = [
      { name: 'Rate Limiting', test: this.testRateLimiting },
      { name: 'API Authentication', test: this.testAPIAuthentication },
      { name: 'CORS Configuration', test: this.testCORSConfiguration },
      { name: 'Request Validation', test: this.testRequestValidation }
    ];

    for (const test of tests) {
      try {
        const result = await test.test.call(this);
        this.results.apiSecurity.tests.push({
          name: test.name,
          result,
          timestamp: new Date().toISOString()
        });

        if (result.passed) {
          this.results.apiSecurity.passed++;
          console.log(`  ✅ ${test.name}: PASSED`);
        } else {
          this.results.apiSecurity.failed++;
          console.log(`  ❌ ${test.name}: FAILED - ${result.reason}`);
        }
      } catch (error) {
        this.results.apiSecurity.failed++;
        this.results.apiSecurity.tests.push({
          name: test.name,
          result: { passed: false, reason: error.message },
          timestamp: new Date().toISOString()
        });
        console.log(`  ❌ ${test.name}: ERROR - ${error.message}`);
      }
    }
  }

  async testDataProtectionSecurity() {
    console.log('🔒 Testing Data Protection Security...');

    const tests = [
      { name: 'Data Encryption', test: this.testDataEncryption },
      { name: 'Secure Communication', test: this.testSecureCommunication },
      { name: 'Data Leakage Prevention', test: this.testDataLeakagePrevention },
      { name: 'Key Management', test: this.testKeyManagement }
    ];

    for (const test of tests) {
      try {
        const result = await test.test.call(this);
        this.results.dataProtection.tests.push({
          name: test.name,
          result,
          timestamp: new Date().toISOString()
        });

        if (result.passed) {
          this.results.dataProtection.passed++;
          console.log(`  ✅ ${test.name}: PASSED`);
        } else {
          this.results.dataProtection.failed++;
          console.log(`  ❌ ${test.name}: FAILED - ${result.reason}`);
        }
      } catch (error) {
        this.results.dataProtection.failed++;
        this.results.dataProtection.tests.push({
          name: test.name,
          result: { passed: false, reason: error.message },
          timestamp: new Date().toISOString()
        });
        console.log(`  ❌ ${test.name}: ERROR - ${error.message}`);
      }
    }
  }

  // Authentication Test Implementations
  async testJWTValidation() {
    const invalidTokens = [
      'invalid.token.here',
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
    ];

    for (const token of invalidTokens) {
      const response = await this.makeRequest('/api/protected', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        return { passed: false, reason: 'Invalid JWT token accepted' };
      }
    }

    return { passed: true };
  }

  async testSessionManagement() {
    const response = await this.makeRequest('/api/session');

    // Check for secure session attributes
    const secureAttributes = ['httpOnly', 'secure', 'sameSite'];

    const cookies = response.headers['set-cookie'] || [];
    const hasSecureCookies = cookies.some(cookie =>
      secureAttributes.some(attr => cookie.includes(attr))
    );

    return {
      passed: hasSecureCookies,
      reason: hasSecureCookies ? null : 'Session cookies not properly secured'
    };
  }

  async testMFAImplementation() {
    // Test MFA bypass attempts
    const mfaBypassAttempts = [
      {
        endpoint: '/api/auth/login',
        method: 'POST',
        data: { username: 'admin', password: 'password' }
      },
      { endpoint: '/api/auth/mfa-bypass', method: 'POST', data: { token: 'invalid' } }
    ];

    for (const attempt of mfaBypassAttempts) {
      const response = await this.makeRequest(attempt.endpoint, {
        method: attempt.method,
        data: attempt.data
      });

      if (response.status === 200) {
        return { passed: false, reason: 'MFA bypass successful' };
      }
    }

    return { passed: true };
  }

  async testPasswordPolicy() {
    const weakPasswords = ['password', '123456', 'admin', 'qwerty', 'password123'];

    for (const password of weakPasswords) {
      const response = await this.makeRequest('/api/auth/register', {
        method: 'POST',
        data: { username: 'testuser', password }
      });

      if (response.status === 200) {
        return { passed: false, reason: 'Weak password accepted' };
      }
    }

    return { passed: true };
  }

  async testBruteForceProtection() {
    const attempts = [];
    for (let i = 0; i < 10; i++) {
      attempts.push(
        this.makeRequest('/api/auth/login', {
          method: 'POST',
          data: { username: 'admin', password: `wrong${i}` }
        })
      );
    }

    const responses = await Promise.all(attempts);
    const rateLimited = responses.some(r => r.status === 429);

    return {
      passed: rateLimited,
      reason: rateLimited ? null : 'No rate limiting detected'
    };
  }

  // Authorization Test Implementations
  async testRBAC() {
    const unauthorizedAccess = [
      { endpoint: '/api/admin/users', role: 'user' },
      { endpoint: '/api/admin/settings', role: 'user' },
      { endpoint: '/api/superadmin/system', role: 'admin' }
    ];

    for (const access of unauthorizedAccess) {
      const response = await this.makeRequest(access.endpoint, {
        headers: { 'X-Role': access.role }
      });

      if (response.status === 200) {
        return { passed: false, reason: `Unauthorized access to ${access.endpoint}` };
      }
    }

    return { passed: true };
  }

  async testPrivilegeEscalation() {
    const escalationAttempts = [
      { endpoint: '/api/user/1/profile', user: 'user2' },
      { endpoint: '/api/admin/users', user: 'regular_user' }
    ];

    for (const attempt of escalationAttempts) {
      const response = await this.makeRequest(attempt.endpoint, {
        headers: { 'X-User': attempt.user }
      });

      if (response.status === 200) {
        return { passed: false, reason: 'Privilege escalation successful' };
      }
    }

    return { passed: true };
  }

  async testAPIEndpointProtection() {
    const protectedEndpoints = ['/api/admin', '/api/users', '/api/settings', '/api/system'];

    for (const endpoint of protectedEndpoints) {
      const response = await this.makeRequest(endpoint);

      if (response.status === 200) {
        return { passed: false, reason: `Protected endpoint ${endpoint} accessible without auth` };
      }
    }

    return { passed: true };
  }

  async testResourceAccessControl() {
    const resourceTests = [
      { resource: '/api/files/1', user: 'user2' },
      { resource: '/api/data/private', user: 'unauthorized' }
    ];

    for (const test of resourceTests) {
      const response = await this.makeRequest(test.resource, {
        headers: { 'X-User': test.user }
      });

      if (response.status === 200) {
        return { passed: false, reason: `Unauthorized access to ${test.resource}` };
      }
    }

    return { passed: true };
  }

  // Input Validation Test Implementations
  async testSQLInjectionPrevention() {
    const sqlPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "admin'--",
      "1' AND 1=1--"
    ];

    for (const payload of sqlPayloads) {
      const response = await this.makeRequest(`/api/search?q=${encodeURIComponent(payload)}`);

      if (this.detectSQLInjection(response.body)) {
        return { passed: false, reason: 'SQL injection vulnerability detected' };
      }
    }

    return { passed: true };
  }

  async testXSSPrevention() {
    const xssPayloads = [
      "<script>alert('XSS')</script>",
      "javascript:alert('XSS')",
      "<img src=x onerror=alert('XSS')>",
      "';alert('XSS');//"
    ];

    for (const payload of xssPayloads) {
      const response = await this.makeRequest(`/api/comment?text=${encodeURIComponent(payload)}`);

      if (this.detectXSS(response.body)) {
        return { passed: false, reason: 'XSS vulnerability detected' };
      }
    }

    return { passed: true };
  }

  async testNoSQLInjectionPrevention() {
    const nosqlPayloads = ['{"$gt": ""}', '{"$ne": null}', '{"$where": "1==1"}'];

    for (const payload of nosqlPayloads) {
      const response = await this.makeRequest('/api/search', {
        method: 'POST',
        data: { query: payload }
      });

      if (response.status === 200 && response.body.includes('error')) {
        return { passed: false, reason: 'NoSQL injection vulnerability detected' };
      }
    }

    return { passed: true };
  }

  async testCommandInjectionPrevention() {
    const commandPayloads = ['; ls -la', '| cat /etc/passwd', '&& rm -rf /', '`whoami`'];

    for (const payload of commandPayloads) {
      const response = await this.makeRequest(
        `/api/execute?command=${encodeURIComponent(payload)}`
      );

      if (response.status === 200) {
        return { passed: false, reason: 'Command injection vulnerability detected' };
      }
    }

    return { passed: true };
  }

  async testPathTraversalPrevention() {
    const pathPayloads = [
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system32\\config\\sam',
      '....//....//....//etc/passwd'
    ];

    for (const payload of pathPayloads) {
      const response = await this.makeRequest(`/api/file?path=${encodeURIComponent(payload)}`);

      if (response.status === 200) {
        return { passed: false, reason: 'Path traversal vulnerability detected' };
      }
    }

    return { passed: true };
  }

  // API Security Test Implementations
  async testRateLimiting() {
    const requests = [];
    for (let i = 0; i < 100; i++) {
      requests.push(this.makeRequest('/api/test'));
    }

    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.status === 429);

    return {
      passed: rateLimited,
      reason: rateLimited ? null : 'No rate limiting detected'
    };
  }

  async testAPIAuthentication() {
    const protectedEndpoints = ['/api/users', '/api/data', '/api/admin'];

    for (const endpoint of protectedEndpoints) {
      const response = await this.makeRequest(endpoint);

      if (response.status === 200) {
        return {
          passed: false,
          reason: `API endpoint ${endpoint} accessible without authentication`
        };
      }
    }

    return { passed: true };
  }

  async testCORSConfiguration() {
    const response = await this.makeRequest('/api/test', {
      headers: { Origin: 'https://malicious-site.com' }
    });

    const corsHeaders = response.headers['access-control-allow-origin'];
    const isSecure = !corsHeaders || corsHeaders === this.targetUrl;

    return {
      passed: isSecure,
      reason: isSecure ? null : 'Insecure CORS configuration'
    };
  }

  async testRequestValidation() {
    const invalidRequests = [
      { endpoint: '/api/user', method: 'POST', data: { email: 'invalid-email' } },
      { endpoint: '/api/data', method: 'POST', data: { age: 'not-a-number' } }
    ];

    for (const request of invalidRequests) {
      const response = await this.makeRequest(request.endpoint, {
        method: request.method,
        data: request.data
      });

      if (response.status === 200) {
        return { passed: false, reason: 'Invalid request accepted' };
      }
    }

    return { passed: true };
  }

  // Data Protection Test Implementations
  async testDataEncryption() {
    const response = await this.makeRequest('/api/data');

    // Check if sensitive data is encrypted
    const hasEncryption =
      response.headers['content-encoding'] ||
      response.body.includes('encrypted') ||
      response.headers['x-encrypted'];

    return {
      passed: hasEncryption,
      reason: hasEncryption ? null : 'Data not encrypted'
    };
  }

  async testSecureCommunication() {
    const isHttps = this.targetUrl.startsWith('https://');
    const hasHSTS = await this.checkHSTS();

    return {
      passed: isHttps && hasHSTS,
      reason: !isHttps || !hasHSTS ? 'Insecure communication detected' : null
    };
  }

  async testDataLeakagePrevention() {
    const sensitivePatterns = [
      /password\s*[:=]\s*\w+/i,
      /api_key\s*[:=]\s*\w+/i,
      /secret\s*[:=]\s*\w+/i
    ];

    const response = await this.makeRequest('/api/test');

    for (const pattern of sensitivePatterns) {
      if (pattern.test(response.body)) {
        return { passed: false, reason: 'Sensitive data leakage detected' };
      }
    }

    return { passed: true };
  }

  async testKeyManagement() {
    // Test for proper key rotation and management
    const response = await this.makeRequest('/api/keys/status');

    const hasKeyRotation =
      response.body.includes('rotation') ||
      response.body.includes('expiry') ||
      response.headers['x-key-rotation'];

    return {
      passed: hasKeyRotation,
      reason: hasKeyRotation ? null : 'No key management detected'
    };
  }

  // Helper Methods
  async makeRequest(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      const url = `${this.targetUrl}${endpoint}`;
      const urlObj = new URL(url);

      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'SecurityTester/1.0',
          Accept: 'application/json',
          ...options.headers
        }
      };

      if (options.data) {
        const data = JSON.stringify(options.data);
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.headers['Content-Length'] = Buffer.byteLength(data);
      }

      const protocol = urlObj.protocol === 'https:' ? https : http;
      const req = protocol.request(requestOptions, res => {
        let body = '';
        res.on('data', chunk => (body += chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        });
      });

      req.on('error', reject);

      if (options.data) {
        req.write(JSON.stringify(options.data));
      }

      req.end();
    });
  }

  detectSQLInjection(body) {
    const sqlErrors = [
      'sql syntax',
      'mysql_fetch',
      'oracle error',
      'postgresql error',
      'sql server error'
    ];

    return sqlErrors.some(error => body.toLowerCase().includes(error.toLowerCase()));
  }

  detectXSS(body) {
    const xssPatterns = [/<script[^>]*>.*?<\/script>/i, /javascript:/i, /on\w+\s*=/i];

    return xssPatterns.some(pattern => pattern.test(body));
  }

  async checkHSTS() {
    try {
      const response = await this.makeRequest('/');
      return response.headers['strict-transport-security'] !== undefined;
    } catch {
      return false;
    }
  }

  calculateOverallScore() {
    const categories = [
      'authentication',
      'authorization',
      'inputValidation',
      'apiSecurity',
      'dataProtection'
    ];
    let totalScore = 0;
    let totalTests = 0;

    categories.forEach(category => {
      const categoryResults = this.results[category];
      const categoryScore =
        (categoryResults.passed / (categoryResults.passed + categoryResults.failed)) * 100;
      totalScore += categoryScore;
      totalTests += categoryResults.passed + categoryResults.failed;
    });

    this.results.overall.score = Math.round(totalScore / categories.length);
    this.results.overall.grade = this.getSecurityGrade(this.results.overall.score);
  }

  getSecurityGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  getTotalTests() {
    const categories = [
      'authentication',
      'authorization',
      'inputValidation',
      'apiSecurity',
      'dataProtection'
    ];
    return categories.reduce((total, category) => {
      return total + this.results[category].passed + this.results[category].failed;
    }, 0);
  }

  getTotalPassed() {
    const categories = [
      'authentication',
      'authorization',
      'inputValidation',
      'apiSecurity',
      'dataProtection'
    ];
    return categories.reduce((total, category) => {
      return total + this.results[category].passed;
    }, 0);
  }

  getTotalFailed() {
    const categories = [
      'authentication',
      'authorization',
      'inputValidation',
      'apiSecurity',
      'dataProtection'
    ];
    return categories.reduce((total, category) => {
      return total + this.results[category].failed;
    }, 0);
  }

  generateSecurityReport() {
    return {
      timestamp: new Date().toISOString(),
      target: this.targetUrl,
      summary: {
        overallScore: this.results.overall.score,
        grade: this.results.overall.grade,
        totalTests: this.getTotalTests(),
        passed: this.getTotalPassed(),
        failed: this.getTotalFailed()
      },
      results: this.results,
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.results.authentication.failed > 0) {
      recommendations.push('Implement stronger authentication mechanisms');
    }

    if (this.results.authorization.failed > 0) {
      recommendations.push('Strengthen authorization controls');
    }

    if (this.results.inputValidation.failed > 0) {
      recommendations.push('Enhance input validation and sanitization');
    }

    if (this.results.apiSecurity.failed > 0) {
      recommendations.push('Improve API security measures');
    }

    if (this.results.dataProtection.failed > 0) {
      recommendations.push('Enhance data protection and encryption');
    }

    return recommendations;
  }
}

// Run the security test
const tester = new SecurityTester();
tester
  .runComprehensiveSecurityTest()
  .then(result => {
    if (result.error) {
      console.error('❌ Security test failed:', result.error);
      process.exit(1);
    } else {
      console.log('\n🎉 Security testing completed successfully!');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });

export default SecurityTester;
