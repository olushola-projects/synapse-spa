/**
 * API Testing Utilities for Enhanced SFDR Classification
 * Validates enhanced backend features and response format
 */
import { backendApiClient } from '@/services/backendApiClient';
class ApiTester {
  testResults = [];
  /**
   * Run a single test with timing and error handling
   */
  async runTest(testName, testFn) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    try {
      console.log(`🧪 Running test: ${testName}`);
      const data = await testFn();
      const duration = Date.now() - startTime;
      const result = {
        testName,
        success: true,
        duration,
        data,
        timestamp
      };
      console.log(`✅ Test passed: ${testName} (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const result = {
        testName,
        success: false,
        duration,
        error: errorMessage,
        timestamp
      };
      console.log(`❌ Test failed: ${testName} (${duration}ms) - ${errorMessage}`);
      return result;
    }
  }
  /**
   * Test basic API connectivity
   */
  async testConnectivity() {
    return this.runTest('API Connectivity', async () => {
      const response = await backendApiClient.healthCheck();
      if (response.error) {
        throw new Error(`Health check failed: ${response.error}`);
      }
      if (!response.data) {
        throw new Error('No health data received');
      }
      return response.data;
    });
  }
  /**
   * Test enhanced classification with all features
   */
  async testEnhancedClassification() {
    return this.runTest('Enhanced Classification', async () => {
      const request = {
        text: `This is a sustainable investment fund focused on ESG principles. 
               The fund promotes environmental and social characteristics 
               while maintaining financial returns. Investment strategy includes 
               renewable energy, clean technology, and social impact bonds.`,
        document_type: 'SFDR_Fund_Profile',
        include_audit_trail: true,
        include_benchmark_comparison: true,
        require_citations: true
      };
      const response = await backendApiClient.classifyDocument(request);
      if (response.error) {
        throw new Error(`Classification failed: ${response.error}`);
      }
      const data = response.data;
      // Validate core fields
      if (!data.classification || !data.confidence || !data.reasoning) {
        throw new Error('Missing core classification fields');
      }
      // Validate enhanced fields
      const validations = {
        sustainability_score: typeof data.sustainability_score === 'number',
        regulatory_basis: Array.isArray(data.regulatory_basis),
        benchmark_comparison: typeof data.benchmark_comparison === 'object',
        audit_trail: typeof data.audit_trail === 'object',
        explainability_score: typeof data.explainability_score === 'number'
      };
      const failedValidations = Object.entries(validations)
        .filter(([_, valid]) => !valid)
        .map(([field]) => field);
      if (failedValidations.length > 0) {
        console.warn(`⚠️ Missing enhanced fields: ${failedValidations.join(', ')}`);
      }
      return {
        classification: data.classification,
        confidence: data.confidence,
        processingTime: data.processing_time,
        enhancedFields: {
          sustainability_score: data.sustainability_score,
          regulatory_basis: data.regulatory_basis?.length || 0,
          benchmark_comparison: !!data.benchmark_comparison,
          audit_trail: !!data.audit_trail,
          explainability_score: data.explainability_score
        },
        validations
      };
    });
  }
  /**
   * Test regulatory citations requirement
   */
  async testRegulatoryCitations() {
    return this.runTest('Regulatory Citations', async () => {
      const request = {
        text: 'Article 8 SFDR fund promoting environmental characteristics',
        document_type: 'SFDR_Fund_Profile',
        require_citations: true
      };
      const response = await backendApiClient.classifyDocument(request);
      if (response.error) {
        throw new Error(`Citation test failed: ${response.error}`);
      }
      const data = response.data;
      if (!data.regulatory_basis || data.regulatory_basis.length === 0) {
        throw new Error('No regulatory citations provided despite requirement');
      }
      // Check if citations contain SFDR references
      const hasValidCitations = data.regulatory_basis.some(
        citation =>
          citation.toLowerCase().includes('sfdr') || citation.toLowerCase().includes('article')
      );
      if (!hasValidCitations) {
        throw new Error('Citations do not contain valid SFDR references');
      }
      return {
        citationCount: data.regulatory_basis.length,
        citations: data.regulatory_basis,
        hasValidReferences: hasValidCitations
      };
    });
  }
  /**
   * Test performance benchmarks
   */
  async testPerformanceBenchmarks() {
    return this.runTest('Performance Benchmarks', async () => {
      const startTime = Date.now();
      const request = {
        text: 'Performance test for SFDR classification timing',
        document_type: 'SFDR_Fund_Profile',
        include_benchmark_comparison: true
      };
      const response = await backendApiClient.classifyDocument(request);
      const totalTime = Date.now() - startTime;
      if (response.error) {
        throw new Error(`Performance test failed: ${response.error}`);
      }
      const data = response.data;
      // Check response time requirements
      const targetResponseTime = 3000; // 3 seconds
      if (totalTime > targetResponseTime) {
        console.warn(`⚠️ Response time ${totalTime}ms exceeds target ${targetResponseTime}ms`);
      }
      return {
        totalResponseTime: totalTime,
        processingTime: data.processing_time,
        targetMet: totalTime <= targetResponseTime,
        benchmarkData: data.benchmark_comparison
      };
    });
  }
  /**
   * Run comprehensive test suite
   */
  async runTestSuite(suiteName = 'Enhanced SFDR API') {
    console.log(`🚀 Starting test suite: ${suiteName}`);
    const suiteStartTime = Date.now();
    this.testResults = [];
    // Run all tests
    const tests = [
      () => this.testConnectivity(),
      () => this.testEnhancedClassification(),
      () => this.testRegulatoryCitations(),
      () => this.testPerformanceBenchmarks()
    ];
    for (const test of tests) {
      const result = await test();
      this.testResults.push(result);
    }
    const suiteDuration = Date.now() - suiteStartTime;
    const summary = {
      total: this.testResults.length,
      passed: this.testResults.filter(r => r.success).length,
      failed: this.testResults.filter(r => !r.success).length,
      duration: suiteDuration
    };
    console.log(
      `📊 Test Suite Complete: ${summary.passed}/${summary.total} passed (${suiteDuration}ms)`
    );
    return {
      name: suiteName,
      results: this.testResults,
      summary
    };
  }
  /**
   * Generate test report
   */
  generateReport(testSuite) {
    const { name, results, summary } = testSuite;
    let report = `# ${name} - Test Report\n\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    report += `## Summary\n`;
    report += `- **Total Tests:** ${summary.total}\n`;
    report += `- **Passed:** ${summary.passed} ✅\n`;
    report += `- **Failed:** ${summary.failed} ❌\n`;
    report += `- **Success Rate:** ${((summary.passed / summary.total) * 100).toFixed(1)}%\n`;
    report += `- **Total Duration:** ${summary.duration}ms\n\n`;
    report += `## Test Results\n\n`;
    results.forEach((result, index) => {
      report += `### ${index + 1}. ${result.testName}\n`;
      report += `- **Status:** ${result.success ? '✅ PASSED' : '❌ FAILED'}\n`;
      report += `- **Duration:** ${result.duration}ms\n`;
      if (result.error) {
        report += `- **Error:** ${result.error}\n`;
      }
      if (result.data) {
        report += `- **Data:** \`${JSON.stringify(result.data, null, 2)}\`\n`;
      }
      report += `\n`;
    });
    return report;
  }
}
// Export singleton instance
export const apiTester = new ApiTester();
/**
 * Quick test function for easy use
 */
export const runQuickApiTest = async () => {
  console.log('🔍 Running quick API validation...');
  try {
    const suite = await apiTester.runTestSuite('Quick Validation');
    const report = apiTester.generateReport(suite);
    console.log('\n📋 Test Report:');
    console.log(report);
    if (suite.summary.failed > 0) {
      console.warn(`⚠️ ${suite.summary.failed} tests failed - check implementation`);
    } else {
      console.log('🎉 All tests passed - API is ready for production!');
    }
  } catch (error) {
    console.error('💥 Test suite failed:', error);
  }
};
