// Test the new deployment with AI integration
const NEW_API_URL = 'https://synapse-landing-nexus-e2wuciowc-aas-projects-66c93685.vercel.app';
const CUSTOM_DOMAIN = 'https://joinsynapses.com';

async function testNewDeployment() {
  console.log('🚀 Testing NEW AI-Powered SFDR Classification API Deployment\n');
  console.log('='.repeat(70));

  // Test the new deployment URL first
  console.log('\n🔍 Testing NEW Vercel Deployment:');
  console.log(NEW_API_URL);
  console.log('-'.repeat(50));

  try {
    // Health check
    console.log('Testing /api/health...');
    const healthResponse = await fetch(`${NEW_API_URL}/api/health`);
    console.log(`Status: ${healthResponse.status}`);

    if (healthResponse.status === 200) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Response:', JSON.stringify(healthData, null, 2));

      // Metrics check
      console.log('\nTesting /api/metrics...');
      const metricsResponse = await fetch(`${NEW_API_URL}/api/metrics`);
      if (metricsResponse.status === 200) {
        const metricsData = await metricsResponse.json();
        console.log('✅ Metrics Response:', JSON.stringify(metricsData, null, 2));

        // AI Classification test
        console.log('\nTesting AI-powered /api/classify...');
        const testDoc = {
          text: 'This fund promotes environmental and social characteristics through systematic ESG integration, sustainability screening, and consideration of environmental factors in the investment process. The fund aims to contribute positively to environmental objectives while maintaining social responsibility standards.',
          document_type: 'fund_prospectus'
        };

        const classifyResponse = await fetch(`${NEW_API_URL}/api/classify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testDoc)
        });

        if (classifyResponse.status === 200) {
          const classifyData = await classifyResponse.json();
          console.log('✅ AI Classification Response:', JSON.stringify(classifyData, null, 2));

          console.log('\n🎉 SUCCESS SUMMARY:');
          console.log('='.repeat(50));
          console.log(`✅ Engine Status: ${healthData.engine_status}`);
          console.log(`✅ Engine Type: ${metricsData.engine_type}`);
          console.log(
            `✅ Qwen API: ${metricsData.api_keys_configured?.qwen ? '🔑 Configured' : '❌ Missing'}`
          );
          console.log(
            `✅ OpenAI API: ${metricsData.api_keys_configured?.openai ? '🔑 Configured' : '❌ Missing'}`
          );
          console.log(`✅ Classification: ${classifyData.classification}`);
          console.log(`✅ Confidence: ${classifyData.confidence}`);
          console.log(`✅ Processing Time: ${classifyData.processing_time}s`);
          console.log(
            `✅ AI Features: ${metricsData.features?.includes('AI-powered classification') ? '🤖 ACTIVE' : '❌ Inactive'}`
          );
        } else {
          const errorText = await classifyResponse.text();
          console.log(`❌ Classification failed with status: ${classifyResponse.status}`);
          console.log('Error:', errorText.substring(0, 200));
        }
      } else {
        console.log(`❌ Metrics failed with status: ${metricsResponse.status}`);
      }
    } else {
      const errorText = await healthResponse.text();
      console.log(`❌ Health check failed with status: ${healthResponse.status}`);
      console.log('Error preview:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.error(`❌ Failed to test new deployment:`, error.message);
  }
}

testNewDeployment().catch(console.error);
