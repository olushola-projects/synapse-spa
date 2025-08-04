#!/usr/bin/env node

/**
 * Development Script for Synapses GRC Platform
 *
 * This script runs both frontend and backend servers concurrently
 * for development purposes with proper environment setup.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logWithPrefix(prefix, message, color = 'reset') {
  console.log(`${colors[color]}[${prefix}]${colors.reset} ${message}`);
}

// Check if .env file exists
function checkEnvironment() {
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');

  if (!fs.existsSync(envPath)) {
    log('⚠️  .env file not found!', 'yellow');

    if (fs.existsSync(envExamplePath)) {
      log('📋 Copying .env.example to .env...', 'cyan');
      fs.copyFileSync(envExamplePath, envPath);
      log('✅ .env file created from .env.example', 'green');
      log('🔧 Please update the .env file with your actual configuration values', 'yellow');
    } else {
      log('❌ .env.example file not found either!', 'red');
      process.exit(1);
    }
  }
}

// Install dependencies if needed
function checkDependencies() {
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

  if (!fs.existsSync(nodeModulesPath)) {
    log('📦 Installing dependencies...', 'cyan');

    const npm = spawn('npm', ['install'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true
    });

    npm.on('close', code => {
      if (code !== 0) {
        log('❌ Failed to install dependencies', 'red');
        process.exit(1);
      }
      log('✅ Dependencies installed successfully', 'green');
      startDevelopment();
    });
  } else {
    startDevelopment();
  }
}

// Start development servers
function startDevelopment() {
  log('\n🚀 Starting Synapses GRC Platform Development Environment\n', 'bright');

  // Frontend server (Vite)
  const frontend = spawn('npm', ['run', 'dev:frontend'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    shell: true
  });

  // Backend server (Node.js with nodemon)
  const backend = spawn('npm', ['run', 'dev:backend'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    shell: true
  });

  // Handle frontend output
  frontend.stdout.on('data', data => {
    const message = data.toString().trim();
    if (message) {
      logWithPrefix('FRONTEND', message, 'cyan');
    }
  });

  frontend.stderr.on('data', data => {
    const message = data.toString().trim();
    if (message) {
      logWithPrefix('FRONTEND', message, 'red');
    }
  });

  // Handle backend output
  backend.stdout.on('data', data => {
    const message = data.toString().trim();
    if (message) {
      logWithPrefix('BACKEND', message, 'green');
    }
  });

  backend.stderr.on('data', data => {
    const message = data.toString().trim();
    if (message) {
      logWithPrefix('BACKEND', message, 'red');
    }
  });

  // Handle process exits
  frontend.on('close', code => {
    if (code !== 0) {
      logWithPrefix('FRONTEND', `Process exited with code ${code}`, 'red');
    }
    backend.kill();
  });

  backend.on('close', code => {
    if (code !== 0) {
      logWithPrefix('BACKEND', `Process exited with code ${code}`, 'red');
    }
    frontend.kill();
  });

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down development servers...', 'yellow');
    frontend.kill('SIGINT');
    backend.kill('SIGINT');

    setTimeout(() => {
      log('👋 Development servers stopped', 'green');
      process.exit(0);
    }, 1000);
  });

  // Show startup information
  setTimeout(() => {
    log('\n📊 Development Environment Status:', 'bright');
    log('🌐 Frontend: http://localhost:5173', 'cyan');
    log('🔧 Backend API: http://localhost:3001/api', 'green');
    log('🏥 Health Check: http://localhost:3001/api/health', 'green');
    log('\n💡 Press Ctrl+C to stop both servers\n', 'yellow');
  }, 3000);
}

// Main execution
function main() {
  log('🔍 Checking development environment...', 'cyan');

  try {
    checkEnvironment();
    checkDependencies();
  } catch (error) {
    log(`❌ Error setting up development environment: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
