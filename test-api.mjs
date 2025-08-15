// Test API Connection Script (ES Module)
import https from 'https';

async function testAPI() {
  console.log('🧪 Testing API Connection...');
  
  const options = {
    hostname: 'api.joinsynapses.com',
    port: 443,
    path: '/api/health',
    method: 'GET',
    timeout: 10000
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`📡 Status: ${res.statusCode}`);
      console.log(`📡 Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ API Response:', jsonData);
          resolve(jsonData);
        } catch (error) {
          console.log('📄 Raw Response:', data);
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ API Error:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('⏰ API Timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Test classification endpoint
async function testClassification() {
  console.log('\n🧪 Testing Classification Endpoint...');
  
  const postData = JSON.stringify({
    text: 'Sustainable investment fund with ESG focus',
    document_type: 'sfdr_classification'
  });

  const options = {
    hostname: 'api.joinsynapses.com',
    port: 443,
    path: '/api/classify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 10000
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`📡 Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ Classification Response:', jsonData);
          resolve(jsonData);
        } catch (error) {
          console.log('📄 Raw Response:', data);
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Classification Error:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('⏰ Classification Timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    await testAPI();
    await testClassification();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
