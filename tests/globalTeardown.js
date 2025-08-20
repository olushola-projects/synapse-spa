import { chromium } from '@playwright/test';
import { existsSync } from 'fs';
import { mkdir, rm } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Global teardown for Playwright tests
 * This runs once after all tests complete
 */
async function globalTeardown(config) {
  console.log('🧹 Cleaning up test environment...');
  // Start browser for cleanup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    // Navigate to cleanup endpoint if it exists
    await page.goto('http://localhost:8084/api/test/cleanup').catch(() => {
      console.log('⚠️  Cleanup endpoint not available, continuing...');
    });
  } catch (error) {
    console.log('⚠️  Cleanup endpoints not available, continuing...');
  } finally {
    await browser.close();
  }
  // Clean up test artifacts
  await cleanupTestFiles();
  console.log('✅ Test environment cleanup complete');
}
/**
 * Clean up test files and artifacts
 */
async function cleanupTestFiles() {
  try {
    const testResultsDir = join(__dirname, '..', 'test-results');
    const screenshotsDir = join(testResultsDir, 'screenshots');
    const videosDir = join(testResultsDir, 'videos');
    const tracesDir = join(testResultsDir, 'traces');
    // Clean up test results
    if (existsSync(testResultsDir)) {
      await rm(testResultsDir, { recursive: true, force: true });
      console.log('🗑️  Test results cleaned up');
    }
    // Recreate directories for next run
    await mkdir(testResultsDir, { recursive: true });
    await mkdir(screenshotsDir, { recursive: true });
    await mkdir(videosDir, { recursive: true });
    await mkdir(tracesDir, { recursive: true });
    console.log('📁 Test directories recreated');
  } catch (error) {
    console.error('❌ Failed to cleanup test files:', error);
  }
}
export default globalTeardown;
