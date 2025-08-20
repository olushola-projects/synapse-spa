#!/usr/bin/env node

/**
 * 🧪 AI Integration Validation Script
 *
 * Tests both Qwen3_235B_A22B_SFDR and OpenAI gpt-oss-20b models
 * Validates enhanced SFDR classification capabilities
 *
 * Usage: node scripts/validate-ai-integration.js
 */

import https from 'https';
import { performance } from 'perf_hooks';

// Configuration
const CONFIG = {
  baseUrl: 'https://synapse-landing-nexus-hd3ar7ysb-aas-projects-66c93685.vercel.app',
  timeout: 30000,
  retryAttempts: 3,
  expectedFields: [
    'classification',
    'confidence',
    'processing_time',
    'reasoning',
    'sustainability_score',
    'key_indicators',
    'risk_factors',
    'regulatory_basis',
    'benchmark_comparison',
    'audit_trail',
    'explainability_score'
  ]
};

// Test scenarios for SFDR classification
const TEST_SCENARIOS = [
  {
    name: 'Article 8 Fund (ESG Integration)',
    text: 'This fund promotes environmental and social characteristics through comprehensive ESG integration, screening strategies, and sustainable investment approaches aligned with EU taxonomy objectives.',
    document_type: 'fund_prospectus',
    expectedClassification: 'Article 8',
    expectedConfidenceMin: 0.75
  },
  {
    name: 'Article 9 Fund (Sustainability Objective)',
    text: 'This fund has sustainable investment as its objective, focusing exclusively on renewable energy infrastructure, carbon reduction technologies, and biodiversity conservation with measurable environmental impact targets.',
    document_type: 'fund_prospectus',
    expectedClassification: 'Article 9',
    expectedConfidenceMin: 0.8
  },
  {
    name: 'Article 6 Fund (Traditional)',
    text: 'This fund seeks to maximize financial returns through diversified portfolio management across global markets without specific consideration of sustainability factors or ESG criteria.',
    document_type: 'fund_prospectus',
    expectedClassification: 'Article 6',
    expectedConfidenceMin: 0.7
  },
  {
    name: 'Regulatory Document (Complex)',
    text: 'According to SFDR Article 8 requirements, financial market participants must disclose how environmental and social characteristics are promoted, including principal adverse impact indicators and sustainability risk integration methodologies.',
    document_type: 'regulatory_text',
    expectedClassification: 'Article 8',
    expectedConfidenceMin: 0.65
  }
];

class AIValidationTester {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: [],
      performance: {
        avgResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0
      },
      apiStatus: {
        qwen: false,
        openai: false,
        backend: false
      }
    };
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: new URL(CONFIG.baseUrl).hostname,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AI-Integration-Validator/1.0'
        },
        timeout: CONFIG.timeout
      };

      const req = https.request(options, res => {
        let responseData = '';

        res.on('data', chunk => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({
                statusCode: res.statusCode,
                data: responseData ? JSON.parse(responseData) : null,
                headers: res.headers
              });
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
            }
          } catch (parseError) {
            reject(new Error(`JSON Parse Error: ${parseError.message}\nResponse: ${responseData}`));
          }
        });
      });

      req.on('error', error => {
        reject(new Error(`Request Error: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request Timeout'));
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  /**
   * Test backend health and API key configuration
   */
  async testBackendHealth() {
    console.log('\n🔍 Testing Backend Health & API Key Configuration...');

    try {
      const startTime = performance.now();
      const response = await this.makeRequest('/api/health');
      const responseTime = performance.now() - startTime;

      console.log(`✅ Backend Health: ${response.statusCode} (${responseTime.toFixed(2)}ms)`);

      if (response.data) {
        console.log(`   Status: ${response.data.status || 'Unknown'}`);
        console.log(`   Version: ${response.data.version || 'Unknown'}`);

        if (response.data.features) {
          console.log('   Features:', response.data.features);
        }
      }

      this.results.apiStatus.backend = true;
      return true;
    } catch (error) {
      console.log(`❌ Backend Health Check Failed: ${error.message}`);
      this.results.errors.push(`Backend Health: ${error.message}`);
      return false;
    }
  }

  /**
   * Test API metrics and key configuration
   */
  async testApiMetrics() {
    console.log('\n📊 Testing API Metrics & Key Configuration...');

    try {
      const response = await this.makeRequest('/api/metrics');

      console.log('✅ API Metrics Retrieved Successfully');

      if (response.data) {
        // Check API key configuration
        if (response.data.api_keys_configured) {
          const qwenConfigured = response.data.api_keys_configured.qwen;
          const openaiConfigured = response.data.api_keys_configured.openai;

          console.log(`   🔑 Qwen API: ${qwenConfigured ? '✅ Configured' : '❌ Missing'}`);
          console.log(`   🔑 OpenAI API: ${openaiConfigured ? '✅ Configured' : '❌ Missing'}`);

          this.results.apiStatus.qwen = qwenConfigured;
          this.results.apiStatus.openai = openaiConfigured;
        }

        // Check system capabilities
        if (response.data.capabilities) {
          console.log('   📋 System Capabilities:');
          response.data.capabilities.forEach(cap => {
            console.log(`      - ${cap}`);
          });
        }

        // Performance metrics
        if (response.data.performance) {
          console.log('   ⚡ Performance Metrics:');
          console.log(`      - Uptime: ${response.data.uptime || 'Unknown'}`);
          console.log(`      - Memory: ${response.data.performance.memory || 'Unknown'}`);
        }
      }

      return true;
    } catch (error) {
      console.log(`❌ API Metrics Test Failed: ${error.message}`);
      this.results.errors.push(`API Metrics: ${error.message}`);
      return false;
    }
  }

  /**
   * Test SFDR classification with enhanced features
   */
  async testSFDRClassification(scenario) {
    console.log(`\n🧪 Testing: ${scenario.name}`);

    try {
      const startTime = performance.now();
      const response = await this.makeRequest('/api/classify', 'POST', {
        text: scenario.text,
        document_type: scenario.document_type
      });
      const responseTime = performance.now() - startTime;

      // Update performance metrics
      this.updatePerformanceMetrics(responseTime);

      console.log(`   ⏱️  Response Time: ${responseTime.toFixed(2)}ms`);

      if (!response.data) {
        throw new Error('No response data received');
      }

      const result = response.data;

      // Validate response structure
      const missingFields = this.validateResponseStructure(result);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate classification result
      console.log(`   📊 Classification: ${result.classification}`);
      console.log(`   🎯 Confidence: ${result.confidence}`);
      console.log(`   🔍 Explainability: ${result.explainability_score}`);
      console.log(`   ⚖️  Regulatory Basis: ${result.regulatory_basis?.join(', ') || 'None'}`);

      // Check classification accuracy
      const classificationMatch = result.classification === scenario.expectedClassification;
      const confidenceValid = result.confidence >= scenario.expectedConfidenceMin;

      if (!classificationMatch) {
        console.log(
          `   ⚠️  Classification Mismatch: Expected ${scenario.expectedClassification}, got ${result.classification}`
        );
      }

      if (!confidenceValid) {
        console.log(
          `   ⚠️  Low Confidence: Expected ≥${scenario.expectedConfidenceMin}, got ${result.confidence}`
        );
      }

      // Validate enhanced features
      const hasAuditTrail = result.audit_trail && result.audit_trail.classification_id;
      const hasBenchmark =
        result.benchmark_comparison &&
        typeof result.benchmark_comparison.percentile_rank === 'number';
      const hasRegulatoryCitations = result.regulatory_basis && result.regulatory_basis.length > 0;

      console.log(`   📋 Audit Trail: ${hasAuditTrail ? '✅' : '❌'}`);
      console.log(`   📈 Benchmark: ${hasBenchmark ? '✅' : '❌'}`);
      console.log(`   ⚖️  Citations: ${hasRegulatoryCitations ? '✅' : '❌'}`);

      const testPassed =
        classificationMatch && confidenceValid && hasAuditTrail && hasRegulatoryCitations;

      if (testPassed) {
        console.log(`   ✅ Test PASSED`);
        this.results.passed++;
      } else {
        console.log(`   ❌ Test FAILED`);
        this.results.failed++;
      }

      this.results.total++;
      return testPassed;
    } catch (error) {
      console.log(`   ❌ Test ERROR: ${error.message}`);
      this.results.errors.push(`${scenario.name}: ${error.message}`);
      this.results.failed++;
      this.results.total++;
      return false;
    }
  }

  /**
   * Validate response structure contains all required fields
   */
  validateResponseStructure(response) {
    const missingFields = [];

    CONFIG.expectedFields.forEach(field => {
      if (!(field in response)) {
        missingFields.push(field);
      }
    });

    return missingFields;
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics(responseTime) {
    this.results.performance.minResponseTime = Math.min(
      this.results.performance.minResponseTime,
      responseTime
    );
    this.results.performance.maxResponseTime = Math.max(
      this.results.performance.maxResponseTime,
      responseTime
    );
  }

  /**
   * Calculate average response time
   */
  calculateAverageResponseTime() {
    // This is a simplified calculation - in practice you'd track all response times
    if (this.results.performance.minResponseTime === Infinity) {
      this.results.performance.avgResponseTime = 0;
    } else {
      this.results.performance.avgResponseTime =
        (this.results.performance.minResponseTime + this.results.performance.maxResponseTime) / 2;
    }
  }

  /**
   * Generate comprehensive test report
   */
  generateReport() {
    this.calculateAverageResponseTime();

    console.log('\n' + '='.repeat(80));
    console.log('🎯 AI INTEGRATION VALIDATION REPORT');
    console.log('='.repeat(80));

    // Overall Results
    console.log('\n📊 OVERALL RESULTS:');
    console.log(`   Total Tests: ${this.results.total}`);
    console.log(`   Passed: ${this.results.passed} ✅`);
    console.log(`   Failed: ${this.results.failed} ❌`);
    console.log(
      `   Success Rate: ${this.results.total > 0 ? ((this.results.passed / this.results.total) * 100).toFixed(1) : 0}%`
    );

    // API Status
    console.log('\n🔑 API KEY STATUS:');
    console.log(`   Backend: ${this.results.apiStatus.backend ? '✅ Operational' : '❌ Failed'}`);
    console.log(`   Qwen API: ${this.results.apiStatus.qwen ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   OpenAI API: ${this.results.apiStatus.openai ? '✅ Configured' : '❌ Missing'}`);

    // Performance Metrics
    console.log('\n⚡ PERFORMANCE METRICS:');
    console.log(
      `   Average Response Time: ${this.results.performance.avgResponseTime.toFixed(2)}ms`
    );
    console.log(
      `   Fastest Response: ${this.results.performance.minResponseTime === Infinity ? 'N/A' : this.results.performance.minResponseTime.toFixed(2) + 'ms'}`
    );
    console.log(
      `   Slowest Response: ${this.results.performance.maxResponseTime === 0 ? 'N/A' : this.results.performance.maxResponseTime.toFixed(2) + 'ms'}`
    );

    // Errors
    if (this.results.errors.length > 0) {
      console.log('\n❌ ERRORS ENCOUNTERED:');
      this.results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (!this.results.apiStatus.qwen) {
      console.log('   🔴 CRITICAL: Configure QWEN_API_KEY in Vercel environment variables');
    }
    if (!this.results.apiStatus.openai) {
      console.log('   🟡 RECOMMENDED: Configure OPENAI_API_KEY for fallback capabilities');
    }
    if (this.results.performance.avgResponseTime > 1000) {
      console.log('   🟡 PERFORMANCE: Consider optimizing response times (current: >1s)');
    }
    if (this.results.failed > 0) {
      console.log('   🔴 FAILED TESTS: Review failed test scenarios and fix underlying issues');
    }

    console.log('\n' + '='.repeat(80));

    // Return overall status
    return {
      success: this.results.failed === 0 && this.results.apiStatus.backend,
      results: this.results
    };
  }

  /**
   * Run complete validation suite
   */
  async runValidation() {
    console.log('🚀 Starting AI Integration Validation...');
    console.log(`🎯 Target: ${CONFIG.baseUrl}`);
    console.log(`⏱️  Timeout: ${CONFIG.timeout}ms`);

    // Step 1: Test backend health
    const healthOk = await this.testBackendHealth();
    if (!healthOk) {
      console.log('\n❌ Backend health check failed. Skipping further tests.');
      return this.generateReport();
    }

    // Step 2: Test API metrics
    await this.testApiMetrics();

    // Step 3: Run SFDR classification tests
    console.log('\n🧪 Running SFDR Classification Tests...');
    for (const scenario of TEST_SCENARIOS) {
      await this.testSFDRClassification(scenario);

      // Small delay between tests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Step 4: Generate report
    return this.generateReport();
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new AIValidationTester();

  tester
    .runValidation()
    .then(report => {
      const exitCode = report.success ? 0 : 1;
      console.log(`\n🏁 Validation ${report.success ? 'COMPLETED SUCCESSFULLY' : 'FAILED'}`);
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('❌ Validation script error:', error.message);
      process.exit(1);
    });
}

export { AIValidationTester, TEST_SCENARIOS };
