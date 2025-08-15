// Simple test without authentication
const API_URL = 'https://synapse-landing-nexus-hd3ar7ysb-aas-projects-66c93685.vercel.app';

fetch(`${API_URL}/api/health`)
  .then(response => {
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers));
    return response.text();
  })
  .then(text => {
    console.log('Response body preview:', text.substring(0, 200));
    
    try {
      const json = JSON.parse(text);
      console.log('✅ JSON Response:', json);
    } catch (e) {
      console.log('❌ Not valid JSON, HTML response detected');
      if (text.includes('vercel')) {
        console.log('🔍 Likely Vercel authentication or routing issue');
      }
    }
  })
  .catch(err => console.error('Request failed:', err));
