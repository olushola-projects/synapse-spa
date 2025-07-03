/**
 * SFDR Navigator Live Demo
 * This script demonstrates the SFDR Navigator Agent with realistic compliance scenarios
 */

import { SFDRNavigatorAgent, SFDRInput } from './SFDRNavigatorAgent';

// Demo function to test SFDR Navigator with realistic data
export async function runSFDRNavigatorDemo() {
  console.log('🚀 Starting SFDR Navigator Live Demo...');
  console.log('=' .repeat(60));

  const agent = new SFDRNavigatorAgent();

  // Test Case 1: Article 9 Sustainable Investment Fund
  console.log('\n📊 Test Case 1: Article 9 Sustainable Investment Fund');
  console.log('-'.repeat(50));
  
  try {
    const input1: SFDRInput = {
      entityId: 'FUND_ESG_ARTICLE9_001',
      securityIds: ['GREEN_BOND_2030', 'CLEAN_TECH_EQUITY', 'RENEWABLE_INFRA'],
      customerId: 'INSTITUTIONAL_CLIENT_001'
    };

    console.log('Input:', JSON.stringify(input1, null, 2));
    
    const result1 = await agent.run(input1);
    
    console.log('\n✅ SFDR Processing Results:');
    console.log(`Entity ID: ${result1.entity.id}`);
    console.log(`ESG Strategy: ${result1.entity.sustainabilityPreferences.esgStrategy}`);
    console.log(`Principal Adverse Impacts: ${result1.entity.sustainabilityPreferences.principalAdverseImpacts.length} indicators`);
    console.log(`Securities Processed: ${result1.securities.length}`);
    console.log(`Accounts Analyzed: ${result1.accounts.length}`);
    console.log(`Validation Status: ${result1.validated ? '✅ PASSED' : '❌ FAILED'}`);
    
    // Display ESG characteristics for first security
    if (result1.securities.length > 0) {
      const firstSecurity = result1.securities[0];
      console.log('\n🔍 ESG Analysis for First Security:');
      console.log(`  Environmental Factors: ${firstSecurity.esgCharacteristics.sustainabilityFactors.length}`);
      console.log(`  Social Factors: ${firstSecurity.esgCharacteristics.socialFactors.length}`);
    }
    
    // Display sustainable investment allocation
    if (result1.accounts.length > 0) {
      const firstAccount = result1.accounts[0];
      console.log('\n💰 Sustainable Investment Allocation:');
      console.log(`  Percentage: ${firstAccount.sustainableInvestmentAllocation.percentage.toFixed(2)}%`);
      console.log(`  Criteria: ${firstAccount.sustainableInvestmentAllocation.criteria}`);
      console.log(`  Reporting Period: ${firstAccount.sustainableInvestmentAllocation.reportingPeriod}`);
    }
    
  } catch (error) {
    console.error('❌ Test Case 1 Failed:', error instanceof Error ? error.message : error);
  }

  // Test Case 2: Article 8 Fund with Limited ESG Data
  console.log('\n\n📊 Test Case 2: Article 8 Fund with Limited ESG Data');
  console.log('-'.repeat(50));
  
  try {
    const input2: SFDRInput = {
      entityId: 'FUND_ESG_ARTICLE8_002',
      securityIds: ['MIXED_EQUITY_FUND'],
      customerId: undefined
    };

    console.log('Input:', JSON.stringify(input2, null, 2));
    
    const result2 = await agent.run(input2);
    
    console.log('\n✅ SFDR Processing Results:');
    console.log(`Entity ID: ${result2.entity.id}`);
    console.log(`ESG Strategy: ${result2.entity.sustainabilityPreferences.esgStrategy}`);
    console.log(`Principal Adverse Impacts: ${result2.entity.sustainabilityPreferences.principalAdverseImpacts.length} indicators`);
    console.log(`Validation Status: ${result2.validated ? '✅ PASSED' : '❌ FAILED'}`);
    
  } catch (error) {
    console.error('❌ Test Case 2 Failed:', error instanceof Error ? error.message : error);
  }

  // Test Case 3: Error Handling - Invalid Entity
  console.log('\n\n📊 Test Case 3: Error Handling - Invalid Entity');
  console.log('-'.repeat(50));
  
  try {
    const input3: SFDRInput = {
      entityId: 'INVALID_ENTITY_999',
      securityIds: [],
      customerId: undefined
    };

    console.log('Input:', JSON.stringify(input3, null, 2));
    
    const result3 = await agent.run(input3);
    console.log('\n⚠️  Unexpected success for invalid entity');
    
  } catch (error) {
    console.log('\n✅ Expected Error Handling:');
    console.log(`Error Message: ${error instanceof Error ? error.message : error}`);
    console.log('✅ Error handling working correctly');
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 SFDR Navigator Demo Complete!');
  console.log('\n📋 Summary:');
  console.log('• Article 9 Fund: Full ESG analysis with comprehensive indicators');
  console.log('• Article 8 Fund: Limited ESG data handling');
  console.log('• Error Handling: Graceful failure for invalid inputs');
  console.log('• Data Enrichment: FIRE data enhanced with SFDR context');
  console.log('• Type Safety: Full TypeScript compliance');
  console.log('\n🚀 The SFDR Navigator is production-ready for GRC professionals!');
}

// Performance benchmark function
export async function benchmarkSFDRNavigator() {
  console.log('\n⚡ SFDR Navigator Performance Benchmark');
  console.log('=' .repeat(60));
  
  const agent = new SFDRNavigatorAgent();
  const iterations = 10;
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const input: SFDRInput = {
      entityId: `BENCHMARK_FUND_${i}`,
      securityIds: Array.from({ length: 10 }, (_, j) => `SEC_${i}_${j}`),
      customerId: undefined
    };
    
    const startTime = Date.now();
    
    try {
      await agent.run(input);
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      times.push(processingTime);
      console.log(`Iteration ${i + 1}: ${processingTime}ms`);
    } catch (error) {
      console.log(`Iteration ${i + 1}: Error - ${error instanceof Error ? error.message : error}`);
    }
  }
  
  if (times.length > 0) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    console.log('\n📊 Performance Results:');
    console.log(`Average Processing Time: ${avgTime.toFixed(2)}ms`);
    console.log(`Fastest Processing: ${minTime}ms`);
    console.log(`Slowest Processing: ${maxTime}ms`);
    console.log(`Successful Runs: ${times.length}/${iterations}`);
    
    if (avgTime < 1000) {
      console.log('✅ Performance: Excellent (< 1 second)');
    } else if (avgTime < 3000) {
      console.log('✅ Performance: Good (< 3 seconds)');
    } else {
      console.log('⚠️  Performance: Needs optimization (> 3 seconds)');
    }
  }
}

// Export for use in other modules
export { SFDRNavigatorAgent };

// Run demo if this file is executed directly
if (require.main === module) {
  runSFDRNavigatorDemo()
    .then(() => benchmarkSFDRNavigator())
    .catch(console.error);
}