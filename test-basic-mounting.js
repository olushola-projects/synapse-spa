import puppeteer from 'puppeteer';

async function testBasicMounting() {
  console.log('🚀 Starting Basic React Mounting Test...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  let page;
  
  try {
    page = await browser.newPage();
    
    // Navigate to the home page first
    console.log('📱 Navigating to home page...');
    await page.goto('http://localhost:8080/', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if React is mounted
    console.log('✅ Test 1: Checking if React is mounted...');
    const rootElement = await page.$('#root');
    if (!rootElement) {
      console.log('❌ Root element not found');
      return false;
    }
    
    const rootContent = await rootElement.evaluate(el => el.innerHTML);
    if (!rootContent || rootContent.trim() === '') {
      console.log('❌ Root element is empty');
      return false;
    }
    
    console.log('✅ Root element found and has content');
    console.log('Root content length:', rootContent.length);
    
    // Check for any React-related errors
    console.log('✅ Test 2: Checking for React errors...');
    const errorElements = await page.$$('text=Error, text=error, text=Component Error');
    if (errorElements.length > 0) {
      console.log('❌ Error elements found');
      return false;
    }
    console.log('✅ No error elements found');
    
    // Check for basic page content
    console.log('✅ Test 3: Checking for basic page content...');
    const bodyContent = await page.evaluate(() => document.body.innerHTML);
    if (!bodyContent || bodyContent.length < 100) {
      console.log('❌ Body content is too short');
      return false;
    }
    console.log('✅ Body content found, length:', bodyContent.length);
    
    // Take a screenshot
    console.log('✅ Test 4: Taking screenshot...');
    await page.screenshot({ path: 'basic-mounting-success.png', fullPage: true });
    
    console.log('🎉 Basic React mounting test passed!');
    console.log('📊 Summary:');
    console.log('   ✅ Root element found');
    console.log('   ✅ Root element has content');
    console.log('   ✅ No React errors detected');
    console.log('   ✅ Page content loaded');
    console.log('   ✅ Screenshot saved as basic-mounting-success.png');
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (page) {
      await page.screenshot({ path: 'basic-mounting-error.png' });
    }
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testBasicMounting().then(success => {
  if (success) {
    console.log('🎯 Basic React Mounting Test: PASSED');
    process.exit(0);
  } else {
    console.log('💥 Basic React Mounting Test: FAILED');
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
