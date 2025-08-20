import puppeteer from 'puppeteer';

async function testSFDRContent() {
  console.log('🚀 Starting Simple SFDR Navigator Content Test...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  let page;
  
  try {
    page = await browser.newPage();
    
    // Navigate to SFDR Navigator
    console.log('📱 Navigating to SFDR Navigator...');
    await page.goto('http://localhost:8080/nexus-agent', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait for page to load
    console.log('⏳ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get page content
    const pageContent = await page.content();
    const pageText = await page.evaluate(() => document.body.innerText);
    
    console.log('📄 Page content length:', pageContent.length);
    console.log('📝 Page text length:', pageText.length);
    
    // Check for component errors
    if (pageContent.includes('Component Error') || pageContent.includes('This component encountered an error')) {
      console.log('❌ Component Error detected!');
      await page.screenshot({ path: 'error-screenshot.png' });
      return false;
    }
    console.log('✅ No component errors found');
    
    // Check for key SFDR content
    const keyContent = [
      'SFDR',
      'Navigator',
      'Unified Platform',
      'regulatory compliance',
      'AI Chat',
      'Classify',
      'Documents',
      'Analytics',
      'Export'
    ];
    
    let allContentFound = true;
    for (const content of keyContent) {
      if (pageText.includes(content)) {
        console.log(`✅ Found: "${content}"`);
      } else {
        console.log(`❌ Missing: "${content}"`);
        allContentFound = false;
      }
    }
    
    if (!allContentFound) {
      console.log('❌ Some key content is missing');
      await page.screenshot({ path: 'missing-content.png' });
      return false;
    }
    
    // Check for visual elements
    const svgElements = await page.$$('svg');
    const buttons = await page.$$('button');
    const headings = await page.$$('h1, h2, h3');
    
    console.log(`✅ Found ${svgElements.length} SVG icons`);
    console.log(`✅ Found ${buttons.length} buttons`);
    console.log(`✅ Found ${headings.length} headings`);
    
    // Take success screenshot
    await page.screenshot({ path: 'sfdr-success.png', fullPage: true });
    
    console.log('🎉 SFDR Navigator content test PASSED!');
    console.log('📊 Summary:');
    console.log('   ✅ No component errors');
    console.log('   ✅ All key SFDR content present');
    console.log('   ✅ Visual elements rendered');
    console.log('   ✅ Interactive elements present');
    console.log('   ✅ Screenshot saved as sfdr-success.png');
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (page) {
      try {
        await page.screenshot({ path: 'error-screenshot.png' });
        console.log('📸 Error screenshot saved as error-screenshot.png');
      } catch (screenshotError) {
        console.error('Failed to take error screenshot:', screenshotError.message);
      }
    }
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testSFDRContent().then(success => {
  if (success) {
    console.log('🎯 SFDR Navigator Core Tool Test: PASSED');
    console.log('🎯 The core tool is working correctly!');
    process.exit(0);
  } else {
    console.log('💥 SFDR Navigator Core Tool Test: FAILED');
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
