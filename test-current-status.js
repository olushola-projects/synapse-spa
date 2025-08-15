/**
 * 🔍 Quick API Status Test
 * Tests current backend status before and after API key configuration
 */

// Simple test using fetch (available in Node 18+)
const API_BASE = 'https://synapse-landing-nexus-hd3ar7ysb-aas-projects-66c93685.vercel.app';

async function testBackendStatus() {
  console.log('🔍 Testing Current Backend Status...\n');
  
  try {
    // Test 1: Health endpoint
    console.log('📋 Testing /api/health...');
    const healthResponse = await fetch(`${API_BASE}/api/health`, {
      method: 'GET',
      headers: { 'User-Agent': 'Status-Tester/1.0' }
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check: OK');
      console.log('   Status:', healthData.status || 'Unknown');
      console.log('   Version:', healthData.version || 'Unknown');
      if (healthData.features) {
        console.log('   Features:', healthData.features.join(', '));
      }
    } else {
      console.log('❌ Health Check: Failed', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Health Check Error:', error.message);
  }

  try {
    // Test 2: Metrics endpoint  
    console.log('\n📊 Testing /api/metrics...');
    const metricsResponse = await fetch(`${API_BASE}/api/metrics`, {
      method: 'GET', 
      headers: { 'User-Agent': 'Status-Tester/1.0' }
    });
    
    if (metricsResponse.ok) {
      const metricsData = await metricsResponse.json();
      console.log('✅ Metrics: OK');
      
      if (metricsData.api_keys_configured) {
        console.log('   🔑 API Keys Status:');
        console.log(`     Qwen: ${metricsData.api_keys_configured.qwen ? '✅ Configured' : '❌ Missing'}`);
        console.log(`     OpenAI: ${metricsData.api_keys_configured.openai ? '✅ Configured' : '❌ Missing'}`);
      }
      
      if (metricsData.capabilities) {
        console.log('   📋 Capabilities:', metricsData.capabilities.join(', '));
      }
      
      if (metricsData.uptime) {
        console.log('   ⏱️  Uptime:', metricsData.uptime);
      }
    } else {
      console.log('❌ Metrics: Failed', metricsResponse.status);
    }
  } catch (error) {
    console.log('❌ Metrics Error:', error.message);
  }

  try {
    // Test 3: Classification endpoint
    console.log('\n🧪 Testing /api/classify...');
    const classifyResponse = await fetch(`${API_BASE}/api/classify`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Status-Tester/1.0'
      },
      body: JSON.stringify({
        text: "This fund promotes environmental and social characteristics through ESG integration.",
        document_type: "fund_prospectus"
      })
    });
    
    if (classifyResponse.ok) {
      const classifyData = await classifyResponse.json();
      console.log('✅ Classification: OK');
      console.log('   Classification:', classifyData.classification || 'Unknown');
      console.log('   Confidence:', classifyData.confidence || 'Unknown');
      console.log('   Processing Time:', classifyData.processing_time || 'Unknown');
      
      // Check for enhanced features
      const hasAuditTrail = classifyData.audit_trail && classifyData.audit_trail.classification_id;
      const hasRegBasis = classifyData.regulatory_basis && classifyData.regulatory_basis.length > 0;
      const hasExplainability = typeof classifyData.explainability_score === 'number';
      
      console.log('   📋 Enhanced Features:');
      console.log(`     Audit Trail: ${hasAuditTrail ? '✅' : '❌'}`);
      console.log(`     Regulatory Citations: ${hasRegBasis ? '✅' : '❌'}`);
      console.log(`     Explainability: ${hasExplainability ? '✅' : '❌'}`);
      
    } else {
      console.log('❌ Classification: Failed', classifyResponse.status);
    }
  } catch (error) {
    console.log('❌ Classification Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎯 CURRENT STATUS SUMMARY');
  console.log('='.repeat(60));
  console.log('Backend: Running on Vercel');
  console.log('Next Step: Configure QWEN_API_KEY and OPENAI_API_KEY in Vercel dashboard');
  console.log('Expected: API keys will unlock full AI capabilities');
  console.log('='.repeat(60));
}

// Run the test
testBackendStatus().catch(console.error);

