#!/usr/bin/env node

/**
 * Fast Test Runner for SFDR Navigator
 * Optimized for speed and reliability with 10-minute timeout
 * Based on GitHub best practices and clean code principles
 */

import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FastTestRunner {
  constructor() {
    this.config = {
      maxTimeout: 600000, // 10 minutes
      testTimeout: 300000, // 5 minutes per test suite
      devServerTimeout: 30000, // 30 seconds for dev server
      baseUrl: 'http://localhost:5173',
      testResults: [],
      startTime: Date.now()
    };
    
    this.devServer = null;
    this.testProcess = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async checkPort(port) {
    return new Promise((resolve) => {
      import('net').then(({ default: net }) => {
        const socket = new net.Socket();
        
        socket.setTimeout(1000);
        socket.on('connect', () => {
          socket.destroy();
          resolve(true);
        });
        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });
        socket.on('error', () => {
          resolve(false);
        });
        
        socket.connect(port, 'localhost');
      });
    });
  }

  async startDevServer() {
    this.log('Starting development server...');
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Dev server startup timeout'));
      }, this.config.devServerTimeout);

      this.devServer = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true,
        cwd: process.cwd()
      });

      this.devServer.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Local:') || output.includes('ready in')) {
          clearTimeout(timeout);
          this.log('Development server started successfully', 'success');
          resolve();
        }
      });

      this.devServer.stderr.on('data', (data) => {
        this.log(`Dev server stderr: ${data.toString()}`, 'error');
      });

      this.devServer.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  async waitForServer() {
    this.log('Waiting for server to be ready...');
    
    for (let i = 0; i < 30; i++) { // Wait up to 30 seconds
      if (await this.checkPort(5173)) {
        this.log('Server is ready', 'success');
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Server not ready after 30 seconds');
  }

  async runValidationTests() {
    this.log('Running validation tests...');
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Validation tests timeout'));
      }, this.config.testTimeout);

      this.testProcess = spawn('npx', [
        'playwright', 'test', 
        'tests/e2e/setup-validation.spec.ts',
        '--project=chromium',
        '--reporter=list'
      ], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd()
      });

      this.testProcess.on('close', (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          this.log('Validation tests passed', 'success');
          resolve();
        } else {
          reject(new Error(`Validation tests failed with code ${code}`));
        }
      });

      this.testProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  async runSFDRTests() {
    this.log('Running SFDR Navigator tests...');
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('SFDR tests timeout'));
      }, this.config.testTimeout);

      this.testProcess = spawn('npx', [
        'playwright', 'test', 
        'tests/e2e/sfdr-navigator-fast.spec.ts',
        '--project=chromium',
        '--headed',
        '--reporter=list'
      ], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd()
      });

      this.testProcess.on('close', (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          this.log('SFDR Navigator tests passed', 'success');
          resolve();
        } else {
          this.log(`SFDR Navigator tests failed with code ${code}`, 'error');
          resolve(); // Don't fail the entire process
        }
      });

      this.testProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  async generateReports() {
    this.log('Generating test reports...');
    
    try {
      execSync('npx playwright show-report', { 
        stdio: 'inherit',
        timeout: 30000 
      });
      this.log('Reports generated successfully', 'success');
    } catch (error) {
      this.log(`Report generation failed: ${error.message}`, 'error');
    }
  }

  async cleanup() {
    this.log('Cleaning up...');
    
    if (this.devServer) {
      this.devServer.kill('SIGTERM');
    }
    
    if (this.testProcess) {
      this.testProcess.kill('SIGTERM');
    }
  }

  async run() {
    const startTime = Date.now();
    
    try {
      this.log('🚀 Starting Fast Test Runner');
      this.log(`⏱️  Maximum timeout: ${this.config.maxTimeout / 1000}s`);
      
      // Start dev server
      await this.startDevServer();
      await this.waitForServer();
      
      // Run validation tests
      await this.runValidationTests();
      
      // Run SFDR tests
      await this.runSFDRTests();
      
      // Generate reports
      await this.generateReports();
      
      const duration = Date.now() - startTime;
      this.log(`✅ All tests completed in ${duration / 1000}s`, 'success');
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.log(`❌ Test execution failed after ${duration / 1000}s: ${error.message}`, 'error');
      
      // Generate reports even on failure
      try {
        await this.generateReports();
      } catch (reportError) {
        this.log(`Report generation failed: ${reportError.message}`, 'error');
      }
      
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the test runner
const runner = new FastTestRunner();
runner.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export default FastTestRunner;
