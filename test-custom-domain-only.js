// Test custom domain only
const CUSTOM_DOMAIN = 'https://joinsynapses.com';

async function testCustomDomainAPI() {
    console.log('🚀 Testing CUSTOM DOMAIN AI-Powered SFDR API\n');
    console.log('Domain:', CUSTOM_DOMAIN);
    console.log('=' .repeat(60));
    
    try {
        // Health check
        console.log('\n🔍 Testing /api/health...');
        const healthResponse = await fetch(`${CUSTOM_DOMAIN}/api/health`);
        console.log(`Status: ${healthResponse.status}`);
        console.log(`Content-Type: ${healthResponse.headers.get('content-type')}`);
        
        const responseText = await healthResponse.text();
        console.log(`Response length: ${responseText.length} characters`);
        console.log('Response preview:', responseText.substring(0, 200));
        
        // Try to parse as JSON
        try {
            const healthData = JSON.parse(responseText);
            console.log('✅ Valid JSON Health Response:', JSON.stringify(healthData, null, 2));
            
            // If health works, test metrics
            if (healthData.status) {
                console.log('\n🔍 Testing /api/metrics...');
                const metricsResponse = await fetch(`${CUSTOM_DOMAIN}/api/metrics`);
                const metricsText = await metricsResponse.text();
                
                try {
                    const metricsData = JSON.parse(metricsText);
                    console.log('✅ Metrics Response:', JSON.stringify(metricsData, null, 2));
                    
                    // Test classification
                    console.log('\n🔍 Testing /api/classify...');
                    const testDoc = {
                        text: "This fund promotes environmental and social characteristics.",
                        document_type: "fund_prospectus"
                    };
                    
                    const classifyResponse = await fetch(`${CUSTOM_DOMAIN}/api/classify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(testDoc)
                    });
                    
                    const classifyText = await classifyResponse.text();
                    try {
                        const classifyData = JSON.parse(classifyText);
                        console.log('✅ Classification Response:', JSON.stringify(classifyData, null, 2));
                    } catch (e) {
                        console.log('❌ Classification not JSON:', classifyText.substring(0, 200));
                    }
                } catch (e) {
                    console.log('❌ Metrics not JSON:', metricsText.substring(0, 200));
                }
            }
        } catch (e) {
            console.log('❌ Health response not JSON - likely serving frontend instead of API');
            console.log('This suggests the API routing is not working correctly.');
        }
    } catch (error) {
        console.error(`❌ Failed to test custom domain:`, error.message);
    }
}

testCustomDomainAPI().catch(console.error);

