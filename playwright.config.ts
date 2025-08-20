import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000, // 30 seconds max - fast feedback
  expect: { timeout: 5000 },
  fullyParallel: false, // Sequential for reliability
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries for faster execution
  workers: 1, // Single worker for reliability
  
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'] // Add list reporter for better console output
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8080', // Correct port from Vite config
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
