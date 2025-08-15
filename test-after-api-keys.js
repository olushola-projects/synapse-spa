/**
 * 🎯 Post-Configuration Validation Test
 * Run this AFTER adding API keys and redeploying
 */

const API_BASE = 'https://synapse-landing-nexus-ht1l5q9fy-aas-projects-66c93685.vercel.app';

async function testEnhancedCapabilities() {
  console.log('🎯 Testing Enhanced AI Capabilities (Post-API Keys)...\n');
  
  try {
    // Test 1: Health with enhanced features
    console.log('🏥 Testing Enhanced Health Check...');
    const healthResponse = await fetch(`${API_BASE}/api/health`, {
  headers: {
    'Authorization': `Bearer ${process.env.QWEN_API_KEY || ''}`,
    'x-api-key': process.env.QWEN_API_KEY || ''
  }
});
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Enhanced Health Check: PASSED');
      console.log('   Status:', healthData.status);
      console.log('   Version:', healthData.version);
      console.log('   Features:', healthData.features?.join(', ') || 'Basic');
    } else {
      console.log('❌ Health Check: Failed', healthResponse.status);
      return;
    }
  } catch (error) {
    console.log('❌ Health Check Error:', error.message);
    return;
  }

  try {
    // Test 2: API Keys Configuration Status
    console.log('\n🔑 Testing API Keys Configuration...');
    const metricsResponse = await fetch(`${API_BASE}/api/metrics`, {
  headers: {
    'Authorization': `Bearer ${process.env.QWEN_API_KEY || ''}`,
    'x-api-key': process.env.QWEN_API_KEY || ''
  }
});
    
    if (metricsResponse.ok) {
      const metricsData = await metricsResponse.json();
      console.log('✅ Metrics Access: UNLOCKED');
      
      if (metricsData.api_keys_configured) {
        const qwenConfigured = metricsData.api_keys_configured.qwen;
        const openaiConfigured = metricsData.api_keys_configured.openai;
        
        console.log('   🧠 Qwen API:', qwenConfigured ? '✅ CONFIGURED' : '❌ Missing');
        console.log('   🔄 OpenAI API:', openaiConfigured ? '✅ CONFIGURED' : '❌ Missing');
        
        if (qwenConfigured && openaiConfigured) {
          console.log('   🎉 FULL AI CAPABILITIES UNLOCKED!');
        } else if (qwenConfigured || openaiConfigured) {
          console.log('   ⚠️  PARTIAL AI CAPABILITIES (Missing one key)');
        } else {
          console.log('   ❌ NO AI CAPABILITIES (Both keys missing)');
        }
      }
      
      if (metricsData.capabilities) {
        console.log('   📋 Available Capabilities:');
        metricsData.capabilities.forEach(cap => console.log(`     - ${cap}`));
      }
    } else {
      console.log('❌ Metrics: Still restricted', metricsResponse.status);
    }
  } catch (error) {
    console.log('❌ Metrics Error:', error.message);
  }

  try {
    // Test 3: Enhanced SFDR Classification
    console.log('\n🧪 Testing Enhanced SFDR Classification...');
    
    const testCases = [
      {
        name: "Article 8 Fund",
        text: "This fund promotes environmental and social characteristics through comprehensive ESG integration and sustainable investment strategies.",
        expected: "Article 8"
      },
      {
        name: "Article 9 Fund", 
        text: "This fund has sustainable investment as its objective, focusing exclusively on renewable energy and carbon reduction with measurable impact targets.",
        expected: "Article 9"
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n   Testing: ${testCase.name}`);
      
             const classifyResponse = await fetch(`${API_BASE}/api/classify`, {
         method: 'POST',
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${process.env.QWEN_API_KEY || ''}`,
           'x-api-key': process.env.QWEN_API_KEY || ''
         },
        body: JSON.stringify({
          text: testCase.text,
          document_type: "fund_prospectus"
        })
      });
      
      if (classifyResponse.ok) {
        const result = await classifyResponse.json();
        
        console.log(`     📊 Classification: ${result.classification}`);
        console.log(`     🎯 Confidence: ${result.confidence}`);
        console.log(`     ⏱️  Processing: ${result.processing_time}ms`);
        
        // Check enhanced features
        const hasAuditTrail = result.audit_trail?.classification_id;
        const hasRegBasis = result.regulatory_basis?.length > 0;
        const hasExplainability = typeof result.explainability_score === 'number';
        const hasBenchmark = result.benchmark_comparison?.percentile_rank;
        
        console.log(`     📋 Audit Trail: ${hasAuditTrail ? '✅' : '❌'}`);
        console.log(`     ⚖️  Regulatory Citations: ${hasRegBasis ? '✅ ' + result.regulatory_basis.length + ' citations' : '❌'}`);
        console.log(`     🔍 Explainability: ${hasExplainability ? '✅ ' + result.explainability_score.toFixed(2) : '❌'}`);
        console.log(`     📈 Benchmark: ${hasBenchmark ? '✅ Percentile ' + hasBenchmark : '❌'}`);
        
        const enhancedFeaturesCount = [hasAuditTrail, hasRegBasis, hasExplainability, hasBenchmark].filter(Boolean).length;
        console.log(`     🌟 Enhanced Features: ${enhancedFeaturesCount}/4 active`);
        
      } else {
        console.log(`     ❌ Classification Failed: ${classifyResponse.status}`);
      }
    }
  } catch (error) {
    console.log('❌ Classification Error:', error.message);
  }

  console.log('\n' + '='.repeat(70));
  console.log('🎯 ENHANCED CAPABILITIES VALIDATION COMPLETE');
  console.log('='.repeat(70));
  console.log('Status: API keys should now be configured and active');
  console.log('Expected: Full AI-powered SFDR classification with regulatory citations');
  console.log('Next: Frontend will automatically display enhanced features');
  console.log('='.repeat(70));
}

testEnhancedCapabilities().catch(console.error);
