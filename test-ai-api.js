// Test script for AI-powered SFDR classification API
const API_URL = 'https://synapse-landing-nexus-hd3ar7ysb-aas-projects-66c93685.vercel.app';

async function testHealthEndpoint() {
    try {
        console.log('🔍 Testing Health Endpoint...');
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        console.log('✅ Health Response:', JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
    }
}

async function testMetricsEndpoint() {
    try {
        console.log('\n🔍 Testing Metrics Endpoint...');
        const response = await fetch(`${API_URL}/api/metrics`);
        const data = await response.json();
        console.log('✅ Metrics Response:', JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('❌ Metrics check failed:', error.message);
    }
}

async function testClassificationEndpoint() {
    try {
        console.log('\n🔍 Testing AI Classification Endpoint...');
        const testDocument = {
            text: "This fund promotes environmental and social characteristics through ESG integration, systematic screening of investments, and consideration of sustainability factors in the investment process. The fund aims to contribute to environmental objectives while ensuring social considerations are embedded in investment decisions.",
            document_type: "fund_prospectus"
        };

        const response = await fetch(`${API_URL}/api/classify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testDocument)
        });

        const data = await response.json();
        console.log('✅ Classification Response:', JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('❌ Classification test failed:', error.message);
    }
}

async function runAllTests() {
    console.log('🚀 Starting AI-Powered SFDR Classification API Tests\n');
    console.log('=' .repeat(60));
    
    const health = await testHealthEndpoint();
    const metrics = await testMetricsEndpoint();
    const classification = await testClassificationEndpoint();
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 Test Summary:');
    console.log(`Health Status: ${health?.engine_status || 'Unknown'}`);
    console.log(`Engine Type: ${metrics?.engine_type || 'Unknown'}`);
    console.log(`Qwen API Key: ${metrics?.api_keys_configured?.qwen ? '✅ Configured' : '❌ Missing'}`);
    console.log(`OpenAI API Key: ${metrics?.api_keys_configured?.openai ? '✅ Configured' : '❌ Missing'}`);
    console.log(`Classification: ${classification?.classification || 'Failed'}`);
    console.log(`Confidence: ${classification?.confidence || 'N/A'}`);
    console.log(`AI Features: ${metrics?.features?.includes('AI-powered classification') ? '✅ Active' : '❌ Inactive'}`);
}

// Run tests
runAllTests().catch(console.error);
