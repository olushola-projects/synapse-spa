/**
 * Free ESG Data Sources Integration Example
 * 
 * This example demonstrates how to use the integrated free ESG data sources
 * (World Bank and Alpha Vantage) in the Synapses SFDR Navigator Agent.
 */

import { SFDRNavigatorAgent } from '../src/components/agents/SFDRNavigatorAgent';
import { 
  getFreeESGSources, 
  getSourceConfig, 
  calculateDataQualityScore,
  ESGDataQualityMetrics 
} from '../src/config/esg-sources.config';
import { NayaOneESGData } from '../src/types/sfdr';

/**
 * Example 1: Basic Free ESG Data Fetching
 */
export async function basicESGDataFetching() {
  console.log('=== Basic Free ESG Data Fetching ===\n');
  
  const agent = new SFDRNavigatorAgent();
  
  try {
    // Get list of available free sources
    const freeSources = getFreeESGSources();
    console.log('Available free ESG sources:', freeSources);
    
    // Fetch ESG data from all enabled sources
    console.log('\nFetching ESG data...');
    const startTime = Date.now();
    
    const esgData = await agent.fetchESGData();
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n✅ Successfully fetched ${esgData.length} ESG records in ${duration}s`);
    
    // Display source breakdown
    const sourceBreakdown = esgData.reduce((acc, record) => {
      acc[record.provider] = (acc[record.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\nSource breakdown:');
    Object.entries(sourceBreakdown).forEach(([source, count]) => {
      console.log(`  ${source}: ${count} records`);
    });
    
    return esgData;
    
  } catch (error) {
    console.error('❌ Error fetching ESG data:', error);
    throw error;
  }
}

/**
 * Example 2: World Bank Sovereign ESG Analysis
 */
export async function worldBankSovereignAnalysis() {
  console.log('\n=== World Bank Sovereign ESG Analysis ===\n');
  
  const agent = new SFDRNavigatorAgent();
  
  try {
    // Fetch World Bank data specifically
    const worldBankData = await (agent as any).fetchWorldBankESGData();
    
    console.log(`Fetched ${worldBankData.length} sovereign ESG records from World Bank`);
    
    // Analyze top performers by ESG score
    const topPerformers = worldBankData
      .filter(record => record.esgScore.overall > 0)
      .sort((a, b) => b.esgScore.overall - a.esgScore.overall)
      .slice(0, 10);
    
    console.log('\n🏆 Top 10 Sovereign ESG Performers:');
    topPerformers.forEach((record, index) => {
      console.log(`${index + 1}. ${record.country}: ${record.esgScore.overall}/100`);
      console.log(`   E: ${record.esgScore.environmental}, S: ${record.esgScore.social}, G: ${record.esgScore.governance}`);
    });
    
    // Environmental analysis
    const environmentalData = worldBankData
      .filter(record => record.metrics.carbonIntensity)
      .sort((a, b) => (a.metrics.carbonIntensity || 0) - (b.metrics.carbonIntensity || 0))
      .slice(0, 5);
    
    console.log('\n🌱 Lowest Carbon Intensity Countries:');
    environmentalData.forEach((record, index) => {
      console.log(`${index + 1}. ${record.country}: ${record.metrics.carbonIntensity} tons CO2/capita`);
    });
    
    return worldBankData;
    
  } catch (error) {
    console.error('❌ Error in World Bank analysis:', error);
    throw error;
  }
}

/**
 * Example 3: Alpha Vantage Corporate ESG Analysis
 */
export async function alphaVantageCorporateAnalysis() {
  console.log('\n=== Alpha Vantage Corporate ESG Analysis ===\n');
  
  const agent = new SFDRNavigatorAgent();
  
  try {
    // Fetch Alpha Vantage data specifically
    const alphaVantageData = await (agent as any).fetchAlphaVantageESGData();
    
    console.log(`Fetched ${alphaVantageData.length} corporate ESG records from Alpha Vantage`);
    
    if (alphaVantageData.length === 0) {
      console.log('⚠️  No Alpha Vantage data available. Check API key and rate limits.');
      return [];
    }
    
    // Analyze by sector
    const sectorAnalysis = alphaVantageData.reduce((acc, record) => {
      const sector = record.sector || 'Unknown';
      if (!acc[sector]) {
        acc[sector] = {
          count: 0,
          totalESG: 0,
          companies: []
        };
      }
      acc[sector].count++;
      acc[sector].totalESG += record.esgScore.overall;
      acc[sector].companies.push({
        name: record.companyName,
        ticker: record.ticker,
        esgScore: record.esgScore.overall
      });
      return acc;
    }, {} as Record<string, any>);
    
    console.log('\n📊 ESG Performance by Sector:');
    Object.entries(sectorAnalysis).forEach(([sector, data]) => {
      const avgESG = (data.totalESG / data.count).toFixed(1);
      console.log(`${sector}: ${avgESG}/100 (${data.count} companies)`);
      
      // Show top company in each sector
      const topCompany = data.companies.sort((a: any, b: any) => b.esgScore - a.esgScore)[0];
      console.log(`  🥇 Top performer: ${topCompany.name} (${topCompany.ticker}) - ${topCompany.esgScore}/100`);
    });
    
    // ESG leaders
    const esgLeaders = alphaVantageData
      .sort((a, b) => b.esgScore.overall - a.esgScore.overall)
      .slice(0, 5);
    
    console.log('\n🌟 Top 5 ESG Leaders:');
    esgLeaders.forEach((record, index) => {
      console.log(`${index + 1}. ${record.companyName} (${record.ticker})`);
      console.log(`   Overall: ${record.esgScore.overall}/100`);
      console.log(`   E: ${record.esgScore.environmental}, S: ${record.esgScore.social}, G: ${record.esgScore.governance}`);
      console.log(`   Rating: ${record.ratings.esgRating}`);
    });
    
    return alphaVantageData;
    
  } catch (error) {
    console.error('❌ Error in Alpha Vantage analysis:', error);
    throw error;
  }
}

/**
 * Example 4: Data Quality Assessment
 */
export async function dataQualityAssessment(esgData: NayaOneESGData[]) {
  console.log('\n=== Data Quality Assessment ===\n');
  
  // Group data by source
  const dataBySource = esgData.reduce((acc, record) => {
    if (!acc[record.provider]) {
      acc[record.provider] = [];
    }
    acc[record.provider].push(record);
    return acc;
  }, {} as Record<string, NayaOneESGData[]>);
  
  console.log('📈 Data Quality Metrics by Source:');
  
  Object.entries(dataBySource).forEach(([source, records]) => {
    const sourceConfig = getSourceConfig(source);
    
    // Calculate quality metrics
    const completenessScores = records.map(r => r.dataQuality.completeness);
    const avgCompleteness = completenessScores.reduce((a, b) => a + b, 0) / completenessScores.length;
    
    const reliabilityMap = { high: 100, medium: 75, low: 50 };
    const avgReliability = records.reduce((sum, record) => {
      return sum + reliabilityMap[record.dataQuality.reliability as keyof typeof reliabilityMap];
    }, 0) / records.length;
    
    // Calculate data freshness
    const now = new Date();
    const avgAge = records.reduce((sum, record) => {
      const age = (now.getTime() - new Date(record.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
      return sum + age;
    }, 0) / records.length;
    
    const timeliness = avgAge <= 30 ? 100 : avgAge <= 90 ? 80 : avgAge <= 180 ? 60 : 40;
    
    const qualityMetrics: ESGDataQualityMetrics = {
      completeness: Math.round(avgCompleteness * 10) / 10,
      accuracy: 85, // Estimated
      timeliness,
      consistency: 80, // Estimated
      reliability: sourceConfig?.reliability || 'medium',
      sourceCount: 1,
      lastUpdated: new Date().toISOString()
    };
    
    const overallScore = calculateDataQualityScore(qualityMetrics);
    
    console.log(`\n${source.toUpperCase()}:`);
    console.log(`  Records: ${records.length}`);
    console.log(`  Completeness: ${qualityMetrics.completeness}%`);
    console.log(`  Reliability: ${qualityMetrics.reliability}`);
    console.log(`  Timeliness: ${qualityMetrics.timeliness}% (avg age: ${Math.round(avgAge)} days)`);
    console.log(`  Overall Quality Score: ${Math.round(overallScore * 10) / 10}/100`);
    
    // Quality rating
    const rating = overallScore >= 80 ? '🟢 Excellent' : 
                  overallScore >= 60 ? '🟡 Good' : 
                  overallScore >= 40 ? '🟠 Fair' : '🔴 Poor';
    console.log(`  Quality Rating: ${rating}`);
  });
}

/**
 * Example 5: SFDR Compliance Analysis
 */
export async function sfdrComplianceAnalysis(esgData: NayaOneESGData[]) {
  console.log('\n=== SFDR Compliance Analysis ===\n');
  
  // Principal Adverse Impacts (PAI) analysis
  const paiData = esgData.filter(record => 
    record.sfdrIndicators.principalAdverseImpacts && 
    Object.keys(record.sfdrIndicators.principalAdverseImpacts).length > 0
  );
  
  console.log(`📋 PAI Data Coverage: ${paiData.length}/${esgData.length} records (${Math.round(paiData.length/esgData.length*100)}%)`);
  
  // Carbon footprint analysis
  const carbonData = esgData.filter(record => 
    record.sfdrIndicators.principalAdverseImpacts.carbonFootprint
  );
  
  if (carbonData.length > 0) {
    const avgCarbon = carbonData.reduce((sum, record) => 
      sum + (record.sfdrIndicators.principalAdverseImpacts.carbonFootprint || 0), 0
    ) / carbonData.length;
    
    console.log(`\n🌍 Carbon Footprint Analysis:`);
    console.log(`  Records with carbon data: ${carbonData.length}`);
    console.log(`  Average carbon intensity: ${avgCarbon.toFixed(2)} tons CO2/capita`);
    
    // High carbon emitters
    const highEmitters = carbonData
      .filter(record => (record.sfdrIndicators.principalAdverseImpacts.carbonFootprint || 0) > avgCarbon)
      .sort((a, b) => (b.sfdrIndicators.principalAdverseImpacts.carbonFootprint || 0) - 
                     (a.sfdrIndicators.principalAdverseImpacts.carbonFootprint || 0))
      .slice(0, 5);
    
    console.log(`\n⚠️  Top 5 Carbon Emitters:`);
    highEmitters.forEach((record, index) => {
      const carbon = record.sfdrIndicators.principalAdverseImpacts.carbonFootprint;
      console.log(`${index + 1}. ${record.companyName || record.country}: ${carbon} tons CO2/capita`);
    });
  }
  
  // Taxonomy alignment analysis
  const taxonomyData = esgData.filter(record => 
    record.sfdrIndicators.taxonomyAlignment > 0
  );
  
  console.log(`\n🏛️ EU Taxonomy Alignment:`);
  console.log(`  Records with taxonomy data: ${taxonomyData.length}`);
  
  if (taxonomyData.length > 0) {
    const avgAlignment = taxonomyData.reduce((sum, record) => 
      sum + record.sfdrIndicators.taxonomyAlignment, 0
    ) / taxonomyData.length;
    
    console.log(`  Average alignment: ${avgAlignment.toFixed(1)}%`);
    
    // Top aligned entities
    const topAligned = taxonomyData
      .sort((a, b) => b.sfdrIndicators.taxonomyAlignment - a.sfdrIndicators.taxonomyAlignment)
      .slice(0, 5);
    
    console.log(`\n🎯 Top 5 Taxonomy Aligned:`);
    topAligned.forEach((record, index) => {
      console.log(`${index + 1}. ${record.companyName || record.country}: ${record.sfdrIndicators.taxonomyAlignment}%`);
    });
  }
  
  // SFDR compliance summary
  const compliantRecords = esgData.filter(record => {
    const hasPAI = Object.keys(record.sfdrIndicators.principalAdverseImpacts).length > 0;
    const hasESGScore = record.esgScore.overall > 0;
    const hasQualityData = record.dataQuality.completeness >= 60;
    
    return hasPAI && hasESGScore && hasQualityData;
  });
  
  const complianceRate = (compliantRecords.length / esgData.length) * 100;
  
  console.log(`\n📊 SFDR Compliance Summary:`);
  console.log(`  Total records: ${esgData.length}`);
  console.log(`  SFDR compliant: ${compliantRecords.length}`);
  console.log(`  Compliance rate: ${complianceRate.toFixed(1)}%`);
  
  const complianceRating = complianceRate >= 80 ? '🟢 Excellent' : 
                         complianceRate >= 60 ? '🟡 Good' : 
                         complianceRate >= 40 ? '🟠 Needs Improvement' : '🔴 Poor';
  console.log(`  Compliance rating: ${complianceRating}`);
}

/**
 * Example 6: Performance Monitoring
 */
export async function performanceMonitoring() {
  console.log('\n=== Performance Monitoring ===\n');
  
  const agent = new SFDRNavigatorAgent();
  const metrics = {
    startTime: Date.now(),
    apiCalls: 0,
    errors: 0,
    cacheHits: 0,
    totalRecords: 0
  };
  
  try {
    console.log('🚀 Starting performance monitoring...');
    
    // Monitor API calls
    const originalFetch = global.fetch;
    global.fetch = async (...args) => {
      metrics.apiCalls++;
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          metrics.errors++;
        }
        return response;
      } catch (error) {
        metrics.errors++;
        throw error;
      }
    };
    
    // Fetch data with monitoring
    const esgData = await agent.fetchESGData();
    metrics.totalRecords = esgData.length;
    
    // Restore original fetch
    global.fetch = originalFetch;
    
    const duration = (Date.now() - metrics.startTime) / 1000;
    
    console.log('📈 Performance Metrics:');
    console.log(`  Duration: ${duration.toFixed(2)}s`);
    console.log(`  API calls: ${metrics.apiCalls}`);
    console.log(`  Errors: ${metrics.errors}`);
    console.log(`  Success rate: ${((metrics.apiCalls - metrics.errors) / metrics.apiCalls * 100).toFixed(1)}%`);
    console.log(`  Records fetched: ${metrics.totalRecords}`);
    console.log(`  Records per second: ${(metrics.totalRecords / duration).toFixed(1)}`);
    console.log(`  Average time per API call: ${(duration / metrics.apiCalls * 1000).toFixed(0)}ms`);
    
    // Performance rating
    const recordsPerSecond = metrics.totalRecords / duration;
    const performanceRating = recordsPerSecond >= 50 ? '🟢 Excellent' : 
                             recordsPerSecond >= 20 ? '🟡 Good' : 
                             recordsPerSecond >= 10 ? '🟠 Fair' : '🔴 Poor';
    console.log(`  Performance rating: ${performanceRating}`);
    
  } catch (error) {
    console.error('❌ Performance monitoring error:', error);
  }
}

/**
 * Main example runner
 */
export async function runAllExamples() {
  console.log('🌟 Free ESG Data Sources Integration Examples\n');
  console.log('=' .repeat(60));
  
  try {
    // Example 1: Basic data fetching
    const esgData = await basicESGDataFetching();
    
    // Example 2: World Bank analysis
    await worldBankSovereignAnalysis();
    
    // Example 3: Alpha Vantage analysis
    await alphaVantageCorporateAnalysis();
    
    // Example 4: Data quality assessment
    await dataQualityAssessment(esgData);
    
    // Example 5: SFDR compliance analysis
    await sfdrComplianceAnalysis(esgData);
    
    // Example 6: Performance monitoring
    await performanceMonitoring();
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ All examples completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('  1. Set up your Alpha Vantage API key for full functionality');
    console.log('  2. Explore premium data sources for enhanced coverage');
    console.log('  3. Implement custom ESG scoring models');
    console.log('  4. Set up automated SFDR compliance reporting');
    
  } catch (error) {
    console.error('\n❌ Example execution failed:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('  1. Check your API keys in the .env file');
    console.log('  2. Verify internet connectivity');
    console.log('  3. Check rate limits and quotas');
    console.log('  4. Review the documentation for setup instructions');
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}