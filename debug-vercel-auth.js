/**
 * 🔍 Vercel Authentication Debug Script
 * Tests different endpoints to diagnose authentication issues
 */

const endpoints = [
  'https://synapse-landing-nexus-ht1l5q9fy-aas-projects-66c93685.vercel.app/',
  'https://synapse-landing-nexus-ht1l5q9fy-aas-projects-66c93685.vercel.app/api',
  'https://synapse-landing-nexus-ht1l5q9fy-aas-projects-66c93685.vercel.app/api/health',
  'https://synapse-landing-nexus-ht1l5q9fy-aas-projects-66c93685.vercel.app/health'
];

async function debugAuthentication() {
  console.log('🔍 Debugging Vercel Authentication Issues...\n');
  
  for (const url of endpoints) {
    try {
      console.log(`Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Debug-Client/1.0'
        }
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      
      if (response.status === 200) {
        const text = await response.text();
        if (text.length < 500) {
          console.log(`   Response: ${text}`);
        } else {
          console.log(`   Response: ${text.substring(0, 200)}...`);
        }
      } else if (response.status === 401) {
        console.log(`   🔴 Authentication Required - This endpoint needs Vercel auth`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('📋 DIAGNOSIS:');
  console.log('If all endpoints return 401, this suggests Vercel has enabled');
  console.log('authentication protection on the entire deployment.');
  console.log('This might be due to:');
  console.log('1. Vercel project settings requiring authentication');
  console.log('2. Environment variables not being applied correctly');
  console.log('3. Deployment not completing successfully');
  console.log('4. Domain/project access restrictions');
}

debugAuthentication().catch(console.error);
