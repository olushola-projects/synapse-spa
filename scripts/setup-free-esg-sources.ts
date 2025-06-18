#!/usr/bin/env ts-node

/**
 * Free ESG Data Sources Setup Script
 * 
 * This script helps users set up and validate the free ESG data sources integration
 * for the Synapses SFDR Navigator Agent.
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { SFDRNavigatorAgent } from '../src/components/agents/SFDRNavigatorAgent';
import { 
  getFreeESGSources, 
  getSourceConfig, 
  validateAPIKey,
  ESGSourceConfig 
} from '../src/config/esg-sources.config';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const access = promisify(fs.access);

/**
 * Setup configuration
 */
interface SetupConfig {
  projectRoot: string;
  envFile: string;
  testDataDir: string;
  logFile: string;
}

const config: SetupConfig = {
  projectRoot: process.cwd(),
  envFile: path.join(process.cwd(), '.env'),
  testDataDir: path.join(process.cwd(), 'test-data'),
  logFile: path.join(process.cwd(), 'setup.log')
};

/**
 * Logger utility
 */
class SetupLogger {
  private logs: string[] = [];
  
  log(message: string, level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level}: ${message}`;
    
    this.logs.push(logEntry);
    
    // Console output with colors
    const colors = {
      INFO: '\x1b[36m',    // Cyan
      WARN: '\x1b[33m',    // Yellow
      ERROR: '\x1b[31m',   // Red
      SUCCESS: '\x1b[32m', // Green
      RESET: '\x1b[0m'
    };
    
    console.log(`${colors[level]}${logEntry}${colors.RESET}`);
  }
  
  async saveLogs() {
    try {
      await writeFile(config.logFile, this.logs.join('\n'));
      this.log(`Setup logs saved to ${config.logFile}`, 'INFO');
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }
}

const logger = new SetupLogger();

/**
 * Step 1: Environment Setup
 */
async function setupEnvironment(): Promise<boolean> {
  logger.log('Setting up environment configuration...', 'INFO');
  
  try {
    // Check if .env file exists
    let envContent = '';
    try {
      await access(config.envFile);
      envContent = await readFile(config.envFile, 'utf-8');
      logger.log('Found existing .env file', 'INFO');
    } catch {
      logger.log('Creating new .env file', 'INFO');
    }
    
    // Required environment variables
    const requiredVars = {
      'ALPHA_VANTAGE_API_KEY': 'your_alpha_vantage_api_key_here',
      'WORLD_BANK_API_BASE_URL': 'https://api.worldbank.org/v2',
      'ALPHA_VANTAGE_API_BASE_URL': 'https://www.alphavantage.co/query',
      'ESG_DATA_CACHE_TTL': '3600000', // 1 hour in milliseconds
      'ESG_API_RATE_LIMIT_DELAY': '1000', // 1 second
      'ESG_MAX_RETRIES': '3',
      'ESG_REQUEST_TIMEOUT': '30000', // 30 seconds
      'LOG_LEVEL': 'info'
    };
    
    let updated = false;
    const envLines = envContent.split('\n');
    
    // Add missing variables
    Object.entries(requiredVars).forEach(([key, defaultValue]) => {
      const exists = envLines.some(line => line.startsWith(`${key}=`));
      if (!exists) {
        envLines.push(`${key}=${defaultValue}`);
        updated = true;
        logger.log(`Added ${key} to .env file`, 'INFO');
      }
    });
    
    // Write updated .env file
    if (updated || !envContent) {
      await writeFile(config.envFile, envLines.filter(line => line.trim()).join('\n') + '\n');
      logger.log('Environment file updated successfully', 'SUCCESS');
    }
    
    // Validate Alpha Vantage API key
    const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!alphaVantageKey || alphaVantageKey === 'your_alpha_vantage_api_key_here') {
      logger.log('⚠️  Alpha Vantage API key not configured. Some features will be limited.', 'WARN');
      logger.log('Get your free API key at: https://www.alphavantage.co/support/#api-key', 'INFO');
    } else {
      logger.log('Alpha Vantage API key configured', 'SUCCESS');
    }
    
    return true;
    
  } catch (error) {
    logger.log(`Environment setup failed: ${error}`, 'ERROR');
    return false;
  }
}

/**
 * Step 2: Validate API Connectivity
 */
async function validateAPIConnectivity(): Promise<boolean> {
  logger.log('Validating API connectivity...', 'INFO');
  
  const results = {
    worldBank: false,
    alphaVantage: false
  };
  
  // Test World Bank API
  try {
    logger.log('Testing World Bank API...', 'INFO');
    const response = await fetch('https://api.worldbank.org/v2/country?format=json&per_page=1');
    if (response.ok) {
      results.worldBank = true;
      logger.log('✅ World Bank API connection successful', 'SUCCESS');
    } else {
      logger.log(`❌ World Bank API returned status: ${response.status}`, 'ERROR');
    }
  } catch (error) {
    logger.log(`❌ World Bank API connection failed: ${error}`, 'ERROR');
  }
  
  // Test Alpha Vantage API (if key is configured)
  const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (alphaVantageKey && alphaVantageKey !== 'your_alpha_vantage_api_key_here') {
    try {
      logger.log('Testing Alpha Vantage API...', 'INFO');
      const testUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=${alphaVantageKey}`;
      const response = await fetch(testUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data.Symbol) {
          results.alphaVantage = true;
          logger.log('✅ Alpha Vantage API connection successful', 'SUCCESS');
        } else if (data.Note) {
          logger.log('⚠️  Alpha Vantage API rate limit reached', 'WARN');
        } else {
          logger.log(`❌ Alpha Vantage API returned unexpected data: ${JSON.stringify(data)}`, 'ERROR');
        }
      } else {
        logger.log(`❌ Alpha Vantage API returned status: ${response.status}`, 'ERROR');
      }
    } catch (error) {
      logger.log(`❌ Alpha Vantage API connection failed: ${error}`, 'ERROR');
    }
  } else {
    logger.log('⚠️  Alpha Vantage API key not configured, skipping test', 'WARN');
  }
  
  const success = results.worldBank; // At least World Bank should work
  if (success) {
    logger.log('API connectivity validation completed', 'SUCCESS');
  } else {
    logger.log('API connectivity validation failed', 'ERROR');
  }
  
  return success;
}

/**
 * Step 3: Test Data Fetching
 */
async function testDataFetching(): Promise<boolean> {
  logger.log('Testing ESG data fetching...', 'INFO');
  
  try {
    const agent = new SFDRNavigatorAgent();
    
    // Test World Bank data fetching
    logger.log('Testing World Bank data fetching...', 'INFO');
    const worldBankData = await (agent as any).fetchWorldBankESGData();
    
    if (worldBankData && worldBankData.length > 0) {
      logger.log(`✅ Successfully fetched ${worldBankData.length} World Bank ESG records`, 'SUCCESS');
      
      // Save sample data
      const sampleData = worldBankData.slice(0, 5);
      await writeFile(
        path.join(config.testDataDir, 'world-bank-sample.json'),
        JSON.stringify(sampleData, null, 2)
      );
      logger.log('Sample World Bank data saved to test-data/world-bank-sample.json', 'INFO');
    } else {
      logger.log('❌ No World Bank data fetched', 'ERROR');
      return false;
    }
    
    // Test Alpha Vantage data fetching (if API key is configured)
    const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (alphaVantageKey && alphaVantageKey !== 'your_alpha_vantage_api_key_here') {
      logger.log('Testing Alpha Vantage data fetching...', 'INFO');
      
      try {
        const alphaVantageData = await (agent as any).fetchAlphaVantageESGData();
        
        if (alphaVantageData && alphaVantageData.length > 0) {
          logger.log(`✅ Successfully fetched ${alphaVantageData.length} Alpha Vantage ESG records`, 'SUCCESS');
          
          // Save sample data
          const sampleData = alphaVantageData.slice(0, 5);
          await writeFile(
            path.join(config.testDataDir, 'alpha-vantage-sample.json'),
            JSON.stringify(sampleData, null, 2)
          );
          logger.log('Sample Alpha Vantage data saved to test-data/alpha-vantage-sample.json', 'INFO');
        } else {
          logger.log('⚠️  No Alpha Vantage data fetched (may be due to rate limits)', 'WARN');
        }
      } catch (error) {
        logger.log(`⚠️  Alpha Vantage data fetching failed: ${error}`, 'WARN');
      }
    }
    
    // Test combined data fetching
    logger.log('Testing combined ESG data fetching...', 'INFO');
    const combinedData = await agent.fetchESGData();
    
    if (combinedData && combinedData.length > 0) {
      logger.log(`✅ Successfully fetched ${combinedData.length} combined ESG records`, 'SUCCESS');
      
      // Analyze data sources
      const sourceBreakdown = combinedData.reduce((acc, record) => {
        acc[record.provider] = (acc[record.provider] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      logger.log('Data source breakdown:', 'INFO');
      Object.entries(sourceBreakdown).forEach(([source, count]) => {
        logger.log(`  ${source}: ${count} records`, 'INFO');
      });
      
      // Save combined sample data
      const sampleData = combinedData.slice(0, 10);
      await writeFile(
        path.join(config.testDataDir, 'combined-esg-sample.json'),
        JSON.stringify(sampleData, null, 2)
      );
      logger.log('Sample combined data saved to test-data/combined-esg-sample.json', 'INFO');
      
      return true;
    } else {
      logger.log('❌ No combined ESG data fetched', 'ERROR');
      return false;
    }
    
  } catch (error) {
    logger.log(`Data fetching test failed: ${error}`, 'ERROR');
    return false;
  }
}

/**
 * Step 4: Generate Configuration Report
 */
async function generateConfigurationReport(): Promise<void> {
  logger.log('Generating configuration report...', 'INFO');
  
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      projectRoot: config.projectRoot
    },
    esgSources: {} as Record<string, any>,
    apiKeys: {} as Record<string, boolean>,
    recommendations: [] as string[]
  };
  
  // Analyze ESG sources configuration
  const freeSources = getFreeESGSources();
  freeSources.forEach(source => {
    const sourceConfig = getSourceConfig(source);
    if (sourceConfig) {
      report.esgSources[source] = {
        enabled: sourceConfig.enabled,
        reliability: sourceConfig.reliability,
        coverage: sourceConfig.coverage,
        rateLimit: sourceConfig.rateLimit,
        cost: sourceConfig.cost
      };
    }
  });
  
  // Check API keys
  report.apiKeys.alphaVantage = !!(process.env.ALPHA_VANTAGE_API_KEY && 
    process.env.ALPHA_VANTAGE_API_KEY !== 'your_alpha_vantage_api_key_here');
  
  // Generate recommendations
  if (!report.apiKeys.alphaVantage) {
    report.recommendations.push('Configure Alpha Vantage API key for corporate ESG data');
  }
  
  if (Object.values(report.esgSources).filter((s: any) => s.enabled).length < 2) {
    report.recommendations.push('Enable multiple ESG data sources for better coverage');
  }
  
  report.recommendations.push('Consider upgrading to premium ESG data sources for production use');
  report.recommendations.push('Implement data caching to reduce API calls and improve performance');
  report.recommendations.push('Set up monitoring and alerting for ESG data quality');
  
  // Save report
  const reportPath = path.join(config.testDataDir, 'configuration-report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  
  logger.log(`Configuration report saved to ${reportPath}`, 'SUCCESS');
  
  // Display summary
  logger.log('\n📊 Configuration Summary:', 'INFO');
  logger.log(`  Free ESG sources available: ${freeSources.length}`, 'INFO');
  logger.log(`  Sources enabled: ${Object.values(report.esgSources).filter((s: any) => s.enabled).length}`, 'INFO');
  logger.log(`  API keys configured: ${Object.values(report.apiKeys).filter(Boolean).length}/${Object.keys(report.apiKeys).length}`, 'INFO');
  logger.log(`  Recommendations: ${report.recommendations.length}`, 'INFO');
}

/**
 * Step 5: Create Test Data Directory
 */
async function createTestDataDirectory(): Promise<void> {
  try {
    await access(config.testDataDir);
    logger.log('Test data directory already exists', 'INFO');
  } catch {
    fs.mkdirSync(config.testDataDir, { recursive: true });
    logger.log(`Created test data directory: ${config.testDataDir}`, 'SUCCESS');
  }
}

/**
 * Main setup function
 */
async function runSetup(): Promise<void> {
  logger.log('🚀 Starting Free ESG Data Sources Setup', 'INFO');
  logger.log('=' .repeat(60), 'INFO');
  
  const steps = [
    { name: 'Create Test Data Directory', fn: createTestDataDirectory },
    { name: 'Environment Setup', fn: setupEnvironment },
    { name: 'API Connectivity Validation', fn: validateAPIConnectivity },
    { name: 'Data Fetching Test', fn: testDataFetching },
    { name: 'Configuration Report', fn: generateConfigurationReport }
  ];
  
  let successCount = 0;
  
  for (const [index, step] of steps.entries()) {
    logger.log(`\n📋 Step ${index + 1}/${steps.length}: ${step.name}`, 'INFO');
    logger.log('-' .repeat(40), 'INFO');
    
    try {
      const result = await step.fn();
      if (result !== false) {
        successCount++;
        logger.log(`✅ ${step.name} completed successfully`, 'SUCCESS');
      } else {
        logger.log(`❌ ${step.name} failed`, 'ERROR');
      }
    } catch (error) {
      logger.log(`❌ ${step.name} failed with error: ${error}`, 'ERROR');
    }
  }
  
  // Final summary
  logger.log('\n' + '=' .repeat(60), 'INFO');
  logger.log(`🎯 Setup completed: ${successCount}/${steps.length} steps successful`, 
    successCount === steps.length ? 'SUCCESS' : 'WARN');
  
  if (successCount === steps.length) {
    logger.log('\n🎉 Free ESG Data Sources setup completed successfully!', 'SUCCESS');
    logger.log('\n📚 Next steps:', 'INFO');
    logger.log('  1. Run the examples: npm run examples:esg', 'INFO');
    logger.log('  2. Check the test data in the test-data/ directory', 'INFO');
    logger.log('  3. Review the configuration report', 'INFO');
    logger.log('  4. Configure Alpha Vantage API key for full functionality', 'INFO');
  } else {
    logger.log('\n⚠️  Setup completed with some issues. Check the logs for details.', 'WARN');
    logger.log('\n🔧 Troubleshooting:', 'INFO');
    logger.log('  1. Check your internet connection', 'INFO');
    logger.log('  2. Verify API keys are correctly configured', 'INFO');
    logger.log('  3. Check the setup.log file for detailed error information', 'INFO');
    logger.log('  4. Refer to the documentation for additional help', 'INFO');
  }
  
  // Save logs
  await logger.saveLogs();
}

// CLI interface
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    skipTests: args.includes('--skip-tests'),
    help: args.includes('--help') || args.includes('-h')
  };
  
  if (options.help) {
    console.log(`
Free ESG Data Sources Setup Script

Usage: ts-node setup-free-esg-sources.ts [options]

Options:
  --verbose, -v     Enable verbose logging
  --skip-tests      Skip data fetching tests
  --help, -h        Show this help message

Examples:
  ts-node setup-free-esg-sources.ts
  ts-node setup-free-esg-sources.ts --verbose
  ts-node setup-free-esg-sources.ts --skip-tests
`);
    process.exit(0);
  }
  
  // Set log level
  if (options.verbose) {
    process.env.LOG_LEVEL = 'debug';
  }
  
  // Run setup
  runSetup().catch(error => {
    console.error('\n❌ Setup failed with critical error:', error);
    process.exit(1);
  });
}

export {
  runSetup,
  setupEnvironment,
  validateAPIConnectivity,
  testDataFetching,
  generateConfigurationReport,
  SetupLogger
};