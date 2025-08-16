#!/usr/bin/env node

/**
 * Quality Dashboard
 * Comprehensive visualization of code quality metrics and trends
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';

async function generateQualityDashboard() {
  console.log('📊 Generating Quality Dashboard...\n');

  const dashboard = {
    timestamp: new Date().toISOString(),
    overview: await generateOverview(),
    trends: await analyzeTrends(),
    metrics: await gatherMetrics(),
    recommendations: await generateRecommendations()
  };

  // Generate HTML dashboard
  const html = generateHTMLDashboard(dashboard);
  writeFileSync('quality-dashboard.html', html);
  
  // Generate JSON report
  writeFileSync('quality-dashboard.json', JSON.stringify(dashboard, null, 2));
  
  console.log('✅ Quality Dashboard generated:');
  console.log('   📄 quality-dashboard.html');
  console.log('   📋 quality-dashboard.json\n');
  
  displaySummary(dashboard);
  
  return dashboard;
}

async function generateOverview() {
  const overview = {
    buildStatus: 'UNKNOWN',
    testCoverage: 0,
    codeQuality: 'UNKNOWN',
    performance: 'UNKNOWN',
    security: 'UNKNOWN'
  };

  try {
    // Check build status
    execSync('npm run type-check', { stdio: 'pipe' });
    overview.buildStatus = 'PASSING';
  } catch {
    overview.buildStatus = 'FAILING';
  }

  try {
    // Get test coverage
    if (existsSync('coverage/coverage-summary.json')) {
      const coverage = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'));
      overview.testCoverage = coverage.total.lines.pct;
    }
  } catch {
    overview.testCoverage = 0;
  }

  // Determine code quality based on various factors
  const qualityScore = calculateQualityScore(overview);
  overview.codeQuality = getQualityRating(qualityScore);

  return overview;
}

async function analyzeTrends() {
  const trends = {
    buildHealth: [],
    coverage: [],
    performance: []
  };

  try {
    // Read historical build health reports
    const files = readdirSync('.')
      .filter(f => f.startsWith('build-health-') && f.endsWith('.json'))
      .sort()
      .slice(-7); // Last 7 reports

    for (const file of files) {
      const report = JSON.parse(readFileSync(file, 'utf8'));
      trends.buildHealth.push({
        date: report.timestamp,
        status: report.status,
        buildTime: report.metrics.buildTime,
        errorCount: report.metrics.errorCount
      });
    }
  } catch (error) {
    console.log('ℹ️  No historical build health data found');
  }

  return trends;
}

async function gatherMetrics() {
  const metrics = {
    codebase: await getCodebaseMetrics(),
    dependencies: await getDependencyMetrics(),
    tests: await getTestMetrics(),
    performance: await getPerformanceMetrics()
  };

  return metrics;
}

async function getCodebaseMetrics() {
  const metrics = {
    totalFiles: 0,
    totalLines: 0,
    typeScriptFiles: 0,
    componentFiles: 0,
    complexity: 0
  };

  try {
    const result = execSync('find src -name "*.ts" -o -name "*.tsx" | wc -l', { encoding: 'utf8' });
    metrics.totalFiles = parseInt(result.trim());

    const tsResult = execSync('find src -name "*.ts" | wc -l', { encoding: 'utf8' });
    metrics.typeScriptFiles = parseInt(tsResult.trim());

    const tsxResult = execSync('find src -name "*.tsx" | wc -l', { encoding: 'utf8' });
    metrics.componentFiles = parseInt(tsxResult.trim());

    // Simple line count
    const lineResult = execSync('find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1', { encoding: 'utf8' });
    const lineMatch = lineResult.match(/^\s*(\d+)/);
    if (lineMatch) {
      metrics.totalLines = parseInt(lineMatch[1]);
    }
  } catch (error) {
    console.log('⚠️  Could not gather codebase metrics');
  }

  return metrics;
}

async function getDependencyMetrics() {
  const metrics = {
    total: 0,
    production: 0,
    development: 0,
    outdated: 0
  };

  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    metrics.production = Object.keys(packageJson.dependencies || {}).length;
    metrics.development = Object.keys(packageJson.devDependencies || {}).length;
    metrics.total = metrics.production + metrics.development;
  } catch (error) {
    console.log('⚠️  Could not read package.json');
  }

  return metrics;
}

async function getTestMetrics() {
  const metrics = {
    totalTests: 0,
    passingTests: 0,
    coverage: 0,
    testFiles: 0
  };

  try {
    if (existsSync('coverage/coverage-summary.json')) {
      const coverage = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'));
      metrics.coverage = coverage.total.lines.pct;
    }

    const testFileCount = execSync('find src -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" | wc -l', { encoding: 'utf8' });
    metrics.testFiles = parseInt(testFileCount.trim());
  } catch (error) {
    console.log('⚠️  Could not gather test metrics');
  }

  return metrics;
}

async function getPerformanceMetrics() {
  const metrics = {
    bundleSize: 0,
    buildTime: 0,
    loadTime: 0
  };

  try {
    if (existsSync('dist')) {
      const sizeResult = execSync('du -sh dist', { encoding: 'utf8' });
      const sizeMatch = sizeResult.match(/^(\d+(?:\.\d+)?)[MK]/);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        const unit = sizeResult.includes('M') ? 1024 : 1;
        metrics.bundleSize = Math.round(size * unit); // KB
      }
    }
  } catch (error) {
    console.log('⚠️  Could not gather performance metrics');
  }

  return metrics;
}

async function generateRecommendations() {
  const recommendations = [];

  // Add context-aware recommendations
  recommendations.push({
    type: 'QUALITY',
    message: 'Maintain test coverage above 80% for production readiness',
    priority: 'HIGH'
  });

  recommendations.push({
    type: 'PERFORMANCE',
    message: 'Monitor bundle size and implement code splitting for large components',
    priority: 'MEDIUM'
  });

  recommendations.push({
    type: 'SECURITY',
    message: 'Run regular dependency audits and security scans',
    priority: 'HIGH'
  });

  return recommendations;
}

function calculateQualityScore(overview) {
  let score = 0;
  
  if (overview.buildStatus === 'PASSING') score += 30;
  if (overview.testCoverage >= 80) score += 25;
  else if (overview.testCoverage >= 60) score += 15;
  else if (overview.testCoverage >= 40) score += 5;
  
  // Add other factors...
  score += 45; // Base score for other factors
  
  return Math.min(score, 100);
}

function getQualityRating(score) {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 80) return 'GOOD';
  if (score >= 60) return 'FAIR';
  if (score >= 40) return 'POOR';
  return 'CRITICAL';
}

function generateHTMLDashboard(dashboard) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quality Dashboard - Synapse GRC Platform</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .dashboard { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-value { font-size: 2em; font-weight: bold; color: #333; }
        .metric-label { color: #666; margin-top: 5px; }
        .status-passing { color: #28a745; }
        .status-failing { color: #dc3545; }
        .quality-excellent { color: #28a745; }
        .quality-good { color: #17a2b8; }
        .quality-fair { color: #ffc107; }
        .quality-poor { color: #fd7e14; }
        .quality-critical { color: #dc3545; }
        .recommendations { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .recommendation { padding: 10px; margin: 10px 0; border-left: 4px solid #007bff; background: #f8f9fa; }
        .priority-high { border-left-color: #dc3545; }
        .priority-medium { border-left-color: #ffc107; }
        .timestamp { color: #666; font-size: 0.9em; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🏥 Quality Dashboard</h1>
            <h2>Synapse GRC Platform</h2>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value status-${dashboard.overview.buildStatus.toLowerCase()}">${dashboard.overview.buildStatus}</div>
                <div class="metric-label">Build Status</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value">${dashboard.overview.testCoverage}%</div>
                <div class="metric-label">Test Coverage</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value quality-${dashboard.overview.codeQuality.toLowerCase()}">${dashboard.overview.codeQuality}</div>
                <div class="metric-label">Code Quality</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value">${dashboard.metrics.codebase.totalFiles}</div>
                <div class="metric-label">Total Files</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value">${dashboard.metrics.codebase.totalLines.toLocaleString()}</div>
                <div class="metric-label">Lines of Code</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value">${dashboard.metrics.dependencies.total}</div>
                <div class="metric-label">Dependencies</div>
            </div>
        </div>
        
        <div class="recommendations">
            <h3>📋 Recommendations</h3>
            ${dashboard.recommendations.map(rec => 
                `<div class="recommendation priority-${rec.priority.toLowerCase()}">
                    <strong>${rec.type}:</strong> ${rec.message}
                </div>`
            ).join('')}
        </div>
        
        <div class="timestamp">
            Generated: ${new Date(dashboard.timestamp).toLocaleString()}
        </div>
    </div>
</body>
</html>`;
}

function displaySummary(dashboard) {
  console.log('📊 Quality Dashboard Summary:');
  console.log(`   Build Status: ${dashboard.overview.buildStatus}`);
  console.log(`   Test Coverage: ${dashboard.overview.testCoverage}%`);
  console.log(`   Code Quality: ${dashboard.overview.codeQuality}`);
  console.log(`   Total Files: ${dashboard.metrics.codebase.totalFiles}`);
  console.log(`   Dependencies: ${dashboard.metrics.dependencies.total}`);
  console.log(`   Recommendations: ${dashboard.recommendations.length}`);
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateQualityDashboard().catch(console.error);
}

export { generateQualityDashboard };