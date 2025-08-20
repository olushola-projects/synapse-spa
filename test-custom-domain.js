// Test using custom domain
const CUSTOM_DOMAIN = 'https://joinsynapses.com';
const VERCEL_DOMAIN = 'https://synapse-landing-nexus-hd3ar7ysb-aas-projects-66c93685.vercel.app';

async function testBothDomains() {
  console.log('🚀 Testing AI-Powered SFDR Classification API on both domains\n');

  const domains = [
    { name: 'Custom Domain', url: CUSTOM_DOMAIN },
    { name: 'Vercel Domain', url: VERCEL_DOMAIN }
  ];

  for (const domain of domains) {
    console.log(`\n🔍 Testing ${domain.name}: ${domain.url}`);
    console.log('='.repeat(60));

    try {
      // Test health endpoint
      console.log('Testing /api/health...');
      const healthResponse = await fetch(`${domain.url}/api/health`);
      console.log(`Status: ${healthResponse.status}`);

      if (healthResponse.status === 200) {
        const healthData = await healthResponse.json();
        console.log('✅ Health Response:', JSON.stringify(healthData, null, 2));

        // Test metrics endpoint
        console.log('\nTesting /api/metrics...');
        const metricsResponse = await fetch(`${domain.url}/api/metrics`);
        if (metricsResponse.status === 200) {
          const metricsData = await metricsResponse.json();
          console.log('✅ Metrics Response:', JSON.stringify(metricsData, null, 2));

          // Test classification endpoint
          console.log('\nTesting /api/classify...');
          const testDoc = {
            text: 'This fund promotes environmental and social characteristics through ESG integration and sustainability screening.',
            document_type: 'fund_prospectus'
          };

          const classifyResponse = await fetch(`${domain.url}/api/classify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testDoc)
          });

          if (classifyResponse.status === 200) {
            const classifyData = await classifyResponse.json();
            console.log('✅ Classification Response:', JSON.stringify(classifyData, null, 2));
          } else {
            console.log(`❌ Classification failed with status: ${classifyResponse.status}`);
          }
        } else {
          console.log(`❌ Metrics failed with status: ${metricsResponse.status}`);
        }
      } else {
        const errorText = await healthResponse.text();
        console.log(`❌ Health check failed with status: ${healthResponse.status}`);
        if (errorText.includes('Authentication')) {
          console.log('🔒 Authentication required - domain may be protected');
        }
      }
    } catch (error) {
      console.error(`❌ Failed to test ${domain.name}:`, error.message);
    }
  }
}

testBothDomains().catch(console.error);
