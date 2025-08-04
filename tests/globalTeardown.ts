/**
 * Jest Global Teardown
 *
 * This file runs once after all tests complete.
 * Use it to clean up test databases, stop test servers, etc.
 */

export default async function globalTeardown(): Promise<void> {
  console.log('🧹 Cleaning up test environment...');

  // Clean up test database if needed
  // await cleanupTestDatabase();

  // Clean up test Redis if needed
  // await cleanupTestRedis();

  // Clean up test storage if needed
  // await cleanupTestStorage();

  // Clean up any test files
  await cleanupTestFiles();

  console.log('✅ Test environment cleanup complete');
}

/**
 * Cleanup test database
 * Uncomment and implement when using a test database
 */
// async function cleanupTestDatabase(): Promise<void> {
//   try {
//     // Drop test tables
//     // Close database connections
//     console.log('📊 Test database cleaned up');
//   } catch (error) {
//     console.error('❌ Failed to cleanup test database:', error);
//   }
// }

/**
 * Cleanup test Redis
 * Uncomment and implement when using Redis in tests
 */
// async function cleanupTestRedis(): Promise<void> {
//   try {
//     // Clear test Redis data
//     // Close Redis connections
//     console.log('🔴 Test Redis cleaned up');
//   } catch (error) {
//     console.error('❌ Failed to cleanup test Redis:', error);
//   }
// }

/**
 * Cleanup test storage
 * Uncomment and implement when using file storage in tests
 */
// async function cleanupTestStorage(): Promise<void> {
//   try {
//     // Remove test storage directories
//     // Clean up test files
//     console.log('📁 Test storage cleaned up');
//   } catch (error) {
//     console.error('❌ Failed to cleanup test storage:', error);
//   }
// }

/**
 * Cleanup test files
 */
async function cleanupTestFiles(): Promise<void> {
  try {
    const fs = require('fs').promises;
    const path = require('path');

    // Clean up any temporary test files
    const tempDirs = [
      path.join(__dirname, '..', 'temp'),
      path.join(__dirname, '..', 'test-uploads'),
      path.join(__dirname, '..', 'test-logs')
    ];

    for (const dir of tempDirs) {
      try {
        await fs.rmdir(dir, { recursive: true });
      } catch (error) {
        // Directory might not exist, which is fine
      }
    }

    console.log('📁 Test files cleaned up');
  } catch (error) {
    console.error('❌ Failed to cleanup test files:', error);
  }
}
