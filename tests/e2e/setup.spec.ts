import { test as setup, expect } from '@playwright/test';
import { createTestHelper } from './utils/test-helpers';

/**
 * Global Test Setup
 * Handles test data preparation and environment setup
 */

setup('setup test data and environment', async ({ page }) => {
  const helper = createTestHelper(page);

  // Navigate to setup page or API endpoint
  await helper.navigateTo('/api/test/setup');

  // Verify setup completed successfully
  await helper.expectText(/Setup completed successfully/);

  // Create test user if needed
  await helper.mockApiResponse('/api/test/create-user', {
    success: true,
    user: {
      id: 1,
      email: 'test@example.com',
      role: 'user'
    }
  });

  // Setup test data
  await helper.mockApiResponse('/api/test/setup-data', {
    success: true,
    message: 'Test data created successfully'
  });
});

setup('cleanup test data', async ({ page }) => {
  const helper = createTestHelper(page);

  // Navigate to cleanup endpoint
  await helper.navigateTo('/api/test/cleanup');

  // Verify cleanup completed
  await helper.expectText(/Cleanup completed successfully/);
});
