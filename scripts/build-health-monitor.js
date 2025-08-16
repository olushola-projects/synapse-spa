#!/usr/bin/env node

/**
 * Build Health Monitor
 * Continuous monitoring of build system health and performance
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { performance } from 'perf_hooks';

const HEALTH_METRICS = {
  buildTime: 0,
  testTime: 0,
  lintTime: 0,
  typeCheckTime: 0,
  bundleSize: 0,
  testCoverage: 0,
  errorCount: 0,
  warningCount: 0
};

async function monitorBuildHealth() {
  console.log('🏥 Build Health Monitor - Starting comprehensive check...\n');

  const healthReport = {
    timestamp: new Date().toISOString(),
    status: 'HEALTHY',
    metrics: { ...HEALTH_METRICS },
    issues: [],
    recommendations: []
  };

  try {
    // Monitor TypeScript compilation
    await measureTypeCheck(healthReport);
    
    // Monitor linting performance
    await measureLinting(healthReport);
    
    // Monitor build performance
    await measureBuild(healthReport);
    
    // Monitor test execution
    await measureTests(healthReport);
    
    // Analyze bundle size
    await analyzeBundleSize(healthReport);
    
    // Generate recommendations
    generateRecommendations(healthReport);
    
    // Save health report
    saveHealthReport(healthReport);
    
    // Display summary
    displayHealthSummary(healthReport);

  } catch (error) {
    healthReport.status = 'CRITICAL';
    healthReport.issues.push({
      type: 'SYSTEM_ERROR',
      message: error.message,
      severity: 'HIGH'
    });
    
    console.error('💀 Critical build system failure:', error.message);
  }

  return healthReport;
}

async function measureTypeCheck(report) {
  console.log('⏱️  Measuring TypeScript compilation...');
  
  const start = performance.now();
  
  try {
    const result = execSync('npx tsc --noEmit --project tsconfig.app.json', 
      { encoding: 'utf8', stdio: 'pipe' });
    
    report.metrics.typeCheckTime = Math.round(performance.now() - start);
    
    // Count warnings in output
    const warnings = (result.match(/warning/gi) || []).length;
    report.metrics.warningCount += warnings;
    
    console.log(`   ✅ TypeScript check completed (${report.metrics.typeCheckTime}ms)`);
    
  } catch (error) {
    report.metrics.typeCheckTime = Math.round(performance.now() - start);
    const errors = (error.stdout?.match(/error/gi) || []).length;
    report.metrics.errorCount += errors;
    
    report.issues.push({
      type: 'TYPESCRIPT_ERRORS',
      message: `${errors} TypeScript compilation errors`,
      severity: 'HIGH'
    });
    
    console.log(`   ❌ TypeScript errors detected (${errors})`);
  }
}

async function measureLinting(report) {
  console.log('⏱️  Measuring ESLint performance...');
  
  const start = performance.now();
  
  try {
    const result = execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' });
    report.metrics.lintTime = Math.round(performance.now() - start);
    
    console.log(`   ✅ Linting completed (${report.metrics.lintTime}ms)`);
    
  } catch (error) {
    report.metrics.lintTime = Math.round(performance.now() - start);
    
    // Parse ESLint output for error/warning counts
    const output = error.stdout || '';
    const errorMatch = output.match(/(\d+) errors?/);
    const warningMatch = output.match(/(\d+) warnings?/);
    
    if (errorMatch) report.metrics.errorCount += parseInt(errorMatch[1]);
    if (warningMatch) report.metrics.warningCount += parseInt(warningMatch[1]);
    
    report.issues.push({
      type: 'LINT_VIOLATIONS',
      message: `ESLint violations detected`,
      severity: errorMatch ? 'HIGH' : 'MEDIUM'
    });
    
    console.log(`   ⚠️  Linting issues found`);
  }
}

async function measureBuild(report) {
  console.log('⏱️  Measuring build performance...');
  
  const start = performance.now();
  
  try {
    execSync('npm run build:frontend', { stdio: 'pipe' });
    report.metrics.buildTime = Math.round(performance.now() - start);
    
    console.log(`   ✅ Build completed (${report.metrics.buildTime}ms)`);
    
  } catch (error) {
    report.metrics.buildTime = Math.round(performance.now() - start);
    
    report.issues.push({
      type: 'BUILD_FAILURE',
      message: 'Frontend build failed',
      severity: 'CRITICAL'
    });
    
    console.log(`   💥 Build failed`);
  }
}

async function measureTests(report) {
  console.log('⏱️  Measuring test execution...');
  
  const start = performance.now();
  
  try {
    execSync('npm run test:coverage', { stdio: 'pipe' });
    report.metrics.testTime = Math.round(performance.now() - start);
    
    // Read coverage report
    if (existsSync('coverage/coverage-summary.json')) {
      const coverage = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'));
      report.metrics.testCoverage = coverage.total.lines.pct;
    }
    
    console.log(`   ✅ Tests completed (${report.metrics.testTime}ms, ${report.metrics.testCoverage}% coverage)`);
    
  } catch (error) {
    report.metrics.testTime = Math.round(performance.now() - start);
    
    report.issues.push({
      type: 'TEST_FAILURES',
      message: 'Test execution failed',
      severity: 'HIGH'
    });
    
    console.log(`   ❌ Tests failed`);
  }
}

async function analyzeBundleSize(report) {
  console.log('📦 Analyzing bundle size...');
  
  try {
    // Check if dist folder exists and analyze
    if (existsSync('dist')) {
      const result = execSync('du -sh dist', { encoding: 'utf8' });
      const sizeMatch = result.match(/^(\d+(?:\.\d+)?)[MK]/);
      
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        const unit = result.includes('M') ? 1024 : 1;
        report.metrics.bundleSize = Math.round(size * unit); // KB
      }
      
      console.log(`   📊 Bundle size: ${report.metrics.bundleSize}KB`);
    }
  } catch (error) {
    console.log(`   ⚠️  Could not analyze bundle size`);
  }
}

function generateRecommendations(report) {
  const { metrics, issues } = report;
  
  // Performance recommendations
  if (metrics.buildTime > 30000) { // 30 seconds
    report.recommendations.push('Consider optimizing build configuration - build time exceeds 30s');
  }
  
  if (metrics.testTime > 60000) { // 1 minute
    report.recommendations.push('Test execution is slow - consider parallelization or test optimization');
  }
  
  if (metrics.bundleSize > 5000) { // 5MB
    report.recommendations.push('Bundle size is large - consider code splitting and lazy loading');
  }
  
  if (metrics.testCoverage < 80) {
    report.recommendations.push('Test coverage below 80% - add more tests for better quality assurance');
  }
  
  // Error-based recommendations
  if (metrics.errorCount > 0) {
    report.status = 'UNHEALTHY';
    report.recommendations.push('Fix all compilation and linting errors before proceeding');
  }
  
  if (metrics.warningCount > 10) {
    report.recommendations.push('High warning count - consider addressing warnings to improve code quality');
  }
  
  // Critical issues
  if (issues.some(i => i.severity === 'CRITICAL')) {
    report.status = 'CRITICAL';
  } else if (issues.some(i => i.severity === 'HIGH')) {
    report.status = 'UNHEALTHY';
  }
}

function saveHealthReport(report) {
  const filename = `build-health-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(filename, JSON.stringify(report, null, 2));
  console.log(`\n📋 Health report saved: ${filename}`);
}

function displayHealthSummary(report) {
  const statusEmoji = {
    'HEALTHY': '💚',
    'UNHEALTHY': '💛', 
    'CRITICAL': '💔'
  }[report.status];
  
  console.log(`\n${statusEmoji} Build Health Status: ${report.status}`);
  console.log('\n📊 Performance Metrics:');
  console.log(`   TypeScript check: ${report.metrics.typeCheckTime}ms`);
  console.log(`   Linting: ${report.metrics.lintTime}ms`);
  console.log(`   Build time: ${report.metrics.buildTime}ms`);
  console.log(`   Test execution: ${report.metrics.testTime}ms`);
  console.log(`   Bundle size: ${report.metrics.bundleSize}KB`);
  console.log(`   Test coverage: ${report.metrics.testCoverage}%`);
  console.log(`   Errors: ${report.metrics.errorCount}`);
  console.log(`   Warnings: ${report.metrics.warningCount}`);
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`   • ${rec}`));
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  monitorBuildHealth().catch(console.error);
}

export { monitorBuildHealth };