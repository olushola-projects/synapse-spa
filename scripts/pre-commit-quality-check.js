#!/usr/bin/env node

/**
 * Pre-commit Quality Check
 * Ensures code quality before commits are allowed
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

const QUALITY_GATES = {
  MAX_COMPLEXITY: 15,
  MAX_FILE_SIZE: 500, // lines
  MAX_FUNCTION_SIZE: 50, // lines
  REQUIRED_COVERAGE: 80 // percentage
};

async function runQualityChecks() {
  console.log('🔍 Running pre-commit quality checks...\n');

  const checks = [
    checkMergeConflicts,
    checkTypeScript,
    checkCodeComplexity,
    checkFileSize,
    runLinter,
    runFormattingCheck,
    runTests
  ];

  let allPassed = true;

  for (const check of checks) {
    try {
      await check();
      console.log('✅ Passed\n');
    } catch (error) {
      console.error(`❌ Failed: ${error.message}\n`);
      allPassed = false;
    }
  }

  if (!allPassed) {
    console.error('💥 Quality checks failed. Commit blocked.');
    process.exit(1);
  }

  console.log('🎉 All quality checks passed. Commit allowed.');
}

async function checkMergeConflicts() {
  process.stdout.write('Checking for merge conflicts... ');

  try {
    const result = execSync(
      'grep -r "<<<<<<< HEAD\\|=======\\|>>>>>>> " src/ --exclude-dir=node_modules',
      { encoding: 'utf8', stdio: 'pipe' }
    );

    if (result.trim()) {
      throw new Error('Merge conflict markers detected in source files');
    }
  } catch (error) {
    if (error.status === 1) {
      // No matches found (grep returns 1 when no matches)
      return;
    }
    throw error;
  }
}

async function checkTypeScript() {
  process.stdout.write('Running TypeScript compilation check... ');

  try {
    execSync('npx tsc --noEmit --project tsconfig.app.json', { stdio: 'pipe' });
    execSync('npx tsc --noEmit --project tsconfig.backend.json', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('TypeScript compilation errors detected');
  }
}

async function checkCodeComplexity() {
  process.stdout.write('Checking code complexity... ');

  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}']
  });

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const lines = content.split('\n');

    // Simple complexity check - count nested blocks
    let maxComplexity = 0;
    let currentComplexity = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('{')) currentComplexity++;
      if (trimmed.includes('}')) currentComplexity--;
      if (trimmed.match(/\b(if|for|while|switch|catch)\b/)) currentComplexity++;
      maxComplexity = Math.max(maxComplexity, currentComplexity);
    }

    if (maxComplexity > QUALITY_GATES.MAX_COMPLEXITY) {
      throw new Error(
        `File ${file} exceeds complexity threshold (${maxComplexity} > ${QUALITY_GATES.MAX_COMPLEXITY})`
      );
    }
  }
}

async function checkFileSize() {
  process.stdout.write('Checking file sizes... ');

  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}']
  });

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const lineCount = content.split('\n').length;

    if (lineCount > QUALITY_GATES.MAX_FILE_SIZE) {
      throw new Error(
        `File ${file} exceeds size limit (${lineCount} > ${QUALITY_GATES.MAX_FILE_SIZE} lines)`
      );
    }
  }
}

async function runLinter() {
  process.stdout.write('Running ESLint... ');

  try {
    execSync('npm run lint', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('ESLint errors detected');
  }
}

async function runFormattingCheck() {
  process.stdout.write('Checking code formatting... ');

  try {
    execSync('npm run format:check', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('Code formatting issues detected. Run: npm run format');
  }
}

async function runTests() {
  process.stdout.write('Running tests... ');

  try {
    execSync('npm run test:coverage', { stdio: 'pipe' });

    // Check coverage if coverage file exists
    const coveragePath = 'coverage/coverage-summary.json';
    if (existsSync(coveragePath)) {
      const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));
      const totalCoverage = coverage.total.lines.pct;

      if (totalCoverage < QUALITY_GATES.REQUIRED_COVERAGE) {
        throw new Error(
          `Test coverage below threshold (${totalCoverage}% < ${QUALITY_GATES.REQUIRED_COVERAGE}%)`
        );
      }
    }
  } catch (error) {
    throw new Error('Test execution failed');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runQualityChecks().catch(console.error);
}

export { runQualityChecks };
