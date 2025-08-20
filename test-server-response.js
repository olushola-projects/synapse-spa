import puppeteer from 'puppeteer';

async function testServerResponse() {
  console.log('🚀 Starting Server Response Test...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });

  let page;

  try {
    page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', error => console.error('Browser page error:', error.message));

    // Navigate to the home page
    console.log('📱 Navigating to home page...');
    await page.goto('http://localhost:8080/', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    console.log('✅ Page loaded successfully');

    // Check if the page has any content
    const bodyContent = await page.evaluate(() => document.body.innerHTML);
    console.log('Body content length:', bodyContent.length);

    // Check if root element exists
    const rootElement = await page.$('#root');
    if (rootElement) {
      console.log('✅ Root element found');
      const rootContent = await rootElement.evaluate(el => el.innerHTML);
      console.log('Root content length:', rootContent.length);
    } else {
      console.log('❌ Root element not found');
    }

    // Take a screenshot
    await page.screenshot({ path: 'server-response-test.png', fullPage: true });
    console.log('✅ Screenshot saved as server-response-test.png');

    return true;
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (page) {
      await page.screenshot({ path: 'server-response-error.png' });
    }
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testServerResponse()
  .then(success => {
    if (success) {
      console.log('🎯 Server Response Test: PASSED');
      process.exit(0);
    } else {
      console.log('💥 Server Response Test: FAILED');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
