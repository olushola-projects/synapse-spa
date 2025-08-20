/**
 * OWASP ZAP Automation Script
 * Comprehensive Penetration Testing for Synapses GRC Platform
 * Top 0.001% Security Professional Standards
 */

const { ZAP } = require('zaproxy');
const fs = require('fs');
const path = require('path');

class OWASPZAPSecurityAuditor {
  constructor() {
    this.zap = new ZAP({
      apiKey: process.env.ZAP_API_KEY || 'your-api-key',
      proxy: 'http://localhost:8080'
    });
    this.targetUrl = process.env.TARGET_URL || 'http://localhost:3000';
    this.reportPath = './security-audit/zap-reports/';
    this.testResults = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      total: 0
    };
  }

  async initializeZAP() {
    console.log('🔒 Initializing OWASP ZAP Security Auditor...');
    
    try {
      // Start ZAP daemon
      await this.zap.core.newSession();
      await this.zap.core.setMode('attack');
      
      console.log('✅ ZAP initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ ZAP initialization failed:', error);
      return false;
    }
  }

  async spiderScan() {
    console.log('🕷️ Starting Spider Scan...');
    
    try {
      const scanId = await this.zap.spider.scan({
        url: this.targetUrl,
        maxChildren: 10,
        recurse: true
      });
      
      console.log(`✅ Spider scan started with ID: ${scanId}`);
      return scanId;
    } catch (error) {
      console.error('❌ Spider scan failed:', error);
      return null;
    }
  }

  async activeScan() {
    console.log('⚡ Starting Active Scan...');
    
    try {
      const scanId = await this.zap.ascan.scan({
        url: this.targetUrl,
        recurse: true,
        inScopeOnly: true
      });
      
      console.log(`✅ Active scan started with ID: ${scanId}`);
      return scanId;
    } catch (error) {
      console.error('❌ Active scan failed:', error);
      return null;
    }
  }

  async passiveScan() {
    console.log('👁️ Starting Passive Scan...');
    
    try {
      await this.zap.pscan.enableAllScanners();
      console.log('✅ Passive scan enabled');
      return true;
    } catch (error) {
      console.error('❌ Passive scan failed:', error);
      return false;
    }
  }

  async customAttackTests() {
    console.log('🎯 Executing Custom Attack Tests...');
    
    const attacks = [
      this.testSQLInjection(),
      this.testXSS(),
      this.testAuthentication(),
      this.testAuthorization(),
      this.testRateLimiting(),
      this.testInputValidation()
    ];
    
    const results = await Promise.allSettled(attacks);
    return results;
  }

  async testSQLInjection() {
    console.log('🔍 Testing SQL Injection vulnerabilities...');
    
    const sqlPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "admin'--",
      "1' AND 1=1--"
    ];
    
    const results = [];
    
    for (const payload of sqlPayloads) {
      try {
        const response = await this.zap.core.accessUrl(
          `${this.targetUrl}/api/test?q=${encodeURIComponent(payload)}`
        );
        
        results.push({
          payload,
          status: response.status,
          vulnerable: this.detectSQLInjection(response.body)
        });
      } catch (error) {
        results.push({ payload, error: error.message });
      }
    }
    
    return { test: 'SQL Injection', results };
  }

  async testXSS() {
    console.log('🔍 Testing XSS vulnerabilities...');
    
    const xssPayloads = [
      "<script>alert('XSS')</script>",
      "javascript:alert('XSS')",
      "<img src=x onerror=alert('XSS')>",
      "';alert('XSS');//"
    ];
    
    const results = [];
    
    for (const payload of xssPayloads) {
      try {
        const response = await this.zap.core.accessUrl(
          `${this.targetUrl}/api/test?input=${encodeURIComponent(payload)}`
        );
        
        results.push({
          payload,
          status: response.status,
          vulnerable: this.detectXSS(response.body)
        });
      } catch (error) {
        results.push({ payload, error: error.message });
      }
    }
    
    return { test: 'XSS', results };
  }

  async testAuthentication() {
    console.log('🔍 Testing Authentication vulnerabilities...');
    
    const authTests = [
      this.testJWTManipulation(),
      this.testSessionHijacking(),
      this.testBruteForce(),
      this.testMFA()
    ];
    
    const results = await Promise.allSettled(authTests);
    return { test: 'Authentication', results };
  }

  async testJWTManipulation() {
    const jwtTests = [
      { name: 'Algorithm Confusion', payload: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0' },
      { name: 'Token Expiration', payload: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' },
      { name: 'Signature Bypass', payload: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' }
    ];
    
    const results = [];
    
    for (const test of jwtTests) {
      try {
        const response = await this.zap.core.accessUrl(
          `${this.targetUrl}/api/protected`,
          { headers: { 'Authorization': `Bearer ${test.payload}` } }
        );
        
        results.push({
          test: test.name,
          status: response.status,
          vulnerable: response.status === 200
        });
      } catch (error) {
        results.push({ test: test.name, error: error.message });
      }
    }
    
    return results;
  }

  async testAuthorization() {
    console.log('🔍 Testing Authorization vulnerabilities...');
    
    const authzTests = [
      this.testPrivilegeEscalation(),
      this.testRoleBypass(),
      this.testAPIEnumeration()
    ];
    
    const results = await Promise.allSettled(authzTests);
    return { test: 'Authorization', results };
  }

  async testRateLimiting() {
    console.log('🔍 Testing Rate Limiting...');
    
    const requests = [];
    const maxRequests = 1000;
    
    for (let i = 0; i < maxRequests; i++) {
      requests.push(
        this.zap.core.accessUrl(`${this.targetUrl}/api/test`)
      );
    }
    
    const results = await Promise.allSettled(requests);
    const successfulRequests = results.filter(r => r.status === 'fulfilled').length;
    
    return {
      test: 'Rate Limiting',
      totalRequests: maxRequests,
      successfulRequests,
      rateLimited: successfulRequests < maxRequests
    };
  }

  async testInputValidation() {
    console.log('🔍 Testing Input Validation...');
    
    const inputTests = [
      { name: 'Path Traversal', payload: '../../../etc/passwd' },
      { name: 'Command Injection', payload: '; ls -la' },
      { name: 'NoSQL Injection', payload: '{"$gt": ""}' },
      { name: 'LDAP Injection', payload: '*)(uid=*))(|(uid=*' }
    ];
    
    const results = [];
    
    for (const test of inputTests) {
      try {
        const response = await this.zap.core.accessUrl(
          `${this.targetUrl}/api/test?input=${encodeURIComponent(test.payload)}`
        );
        
        results.push({
          test: test.name,
          payload: test.payload,
          status: response.status,
          vulnerable: this.detectInputValidationVulnerability(response)
        });
      } catch (error) {
        results.push({ test: test.name, error: error.message });
      }
    }
    
    return { test: 'Input Validation', results };
  }

  detectSQLInjection(responseBody) {
    const sqlErrors = [
      'sql syntax',
      'mysql_fetch',
      'oracle error',
      'postgresql error',
      'sql server error'
    ];
    
    return sqlErrors.some(error => 
      responseBody.toLowerCase().includes(error.toLowerCase())
    );
  }

  detectXSS(responseBody) {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i
    ];
    
    return xssPatterns.some(pattern => pattern.test(responseBody));
  }

  detectInputValidationVulnerability(response) {
    // Custom logic to detect input validation vulnerabilities
    return response.status === 200 && response.body.length > 0;
  }

  async generateReport() {
    console.log('📊 Generating Security Report...');
    
    try {
      const alerts = await this.zap.core.alerts();
      const report = await this.zap.core.htmlreport();
      
      // Process alerts
      this.processAlerts(alerts);
      
      // Save report
      const reportPath = path.join(this.reportPath, `zap-report-${Date.now()}.html`);
      fs.writeFileSync(reportPath, report);
      
      console.log(`✅ Report saved to: ${reportPath}`);
      
      return {
        reportPath,
        alerts: this.testResults,
        summary: this.generateSummary()
      };
    } catch (error) {
      console.error('❌ Report generation failed:', error);
      return null;
    }
  }

  processAlerts(alerts) {
    alerts.forEach(alert => {
      switch (alert.risk.toLowerCase()) {
        case 'high':
          this.testResults.high++;
          break;
        case 'medium':
          this.testResults.medium++;
          break;
        case 'low':
          this.testResults.low++;
          break;
        case 'info':
          this.testResults.info++;
          break;
      }
      this.testResults.total++;
    });
  }

  generateSummary() {
    const score = this.calculateSecurityScore();
    
    return {
      score,
      grade: this.getSecurityGrade(score),
      critical: this.testResults.critical,
      high: this.testResults.high,
      medium: this.testResults.medium,
      low: this.testResults.low,
      info: this.testResults.info,
      total: this.testResults.total
    };
  }

  calculateSecurityScore() {
    const baseScore = 100;
    const deductions = {
      critical: 25,
      high: 10,
      medium: 5,
      low: 2,
      info: 1
    };
    
    let totalDeduction = 0;
    Object.keys(deductions).forEach(severity => {
      totalDeduction += this.testResults[severity] * deductions[severity];
    });
    
    return Math.max(0, baseScore - totalDeduction);
  }

  getSecurityGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  async runFullSecurityAudit() {
    console.log('🚀 Starting Comprehensive Security Audit...');
    
    const startTime = Date.now();
    
    try {
      // Initialize ZAP
      const initialized = await this.initializeZAP();
      if (!initialized) {
        throw new Error('ZAP initialization failed');
      }
      
      // Run all scans
      const spiderId = await this.spiderScan();
      const activeId = await this.activeScan();
      await this.passiveScan();
      
      // Wait for scans to complete
      await this.waitForScanCompletion(spiderId, 'spider');
      await this.waitForScanCompletion(activeId, 'active');
      
      // Run custom attack tests
      const customResults = await this.customAttackTests();
      
      // Generate comprehensive report
      const report = await this.generateReport();
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      console.log(`✅ Security audit completed in ${duration}s`);
      console.log(`📊 Security Score: ${report.summary.score}/100 (${report.summary.grade})`);
      
      return {
        success: true,
        duration,
        report,
        customResults
      };
      
    } catch (error) {
      console.error('❌ Security audit failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async waitForScanCompletion(scanId, scanType) {
    if (!scanId) return;
    
    console.log(`⏳ Waiting for ${scanType} scan to complete...`);
    
    while (true) {
      try {
        const progress = await this.zap[scanType].status(scanId);
        
        if (progress.status === '100') {
          console.log(`✅ ${scanType} scan completed`);
          break;
        }
        
        console.log(`${scanType} scan progress: ${progress.status}%`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(`Error checking ${scanType} scan status:`, error);
        break;
      }
    }
  }
}

// Export for use in other modules
module.exports = OWASPZAPSecurityAuditor;

// Run if called directly
if (require.main === module) {
  const auditor = new OWASPZAPSecurityAuditor();
  auditor.runFullSecurityAudit()
    .then(result => {
      if (result.success) {
        console.log('🎉 Security audit completed successfully!');
        process.exit(0);
      } else {
        console.error('💥 Security audit failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}
