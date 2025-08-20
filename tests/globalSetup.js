import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Global setup for Playwright tests
 * This runs once before all tests
 */
async function globalSetup(config) {
    console.log('🧪 Setting up test environment...');
    // Load test environment variables
    dotenv.config({ path: join(__dirname, '..', '.env.test') });
    // Set global test environment
    process.env.NODE_ENV = 'test';
    process.env.TEST_MODE = 'e2e';
    // Start browser for setup
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
        // Navigate to setup endpoint if it exists
        await page.goto('http://localhost:8084/api/test/setup').catch(() => {
            console.log('⚠️  Setup endpoint not available, continuing...');
        });
        // Create test data if needed
        await page.goto('http://localhost:8084/api/test/create-user').catch(() => {
            console.log('⚠️  User creation endpoint not available, continuing...');
        });
    }
    catch (error) {
        console.log('⚠️  Setup endpoints not available, continuing with tests...');
    }
    finally {
        await browser.close();
    }
    console.log('✅ Test environment setup complete');
}
export default globalSetup;
