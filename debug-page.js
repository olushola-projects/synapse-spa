import puppeteer from 'puppeteer';

async function debugPage() {
  console.log('🔍 Debugging SFDR Navigator page...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to SFDR Navigator
    console.log('📱 Navigating to SFDR Navigator...');
    await page.goto('http://localhost:8080/nexus-agent', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    
    // Get page content
    const pageContent = await page.content();
    console.log('📄 Page content length:', pageContent.length);
    
    // Check for specific elements
    console.log('🔍 Checking for specific elements...');
    
    const h1Elements = await page.$$('h1');
    console.log('H1 elements found:', h1Elements.length);
    
    for (let i = 0; i < h1Elements.length; i++) {
      const text = await h1Elements[i].evaluate(el => el.textContent);
      console.log(`H1 ${i + 1}:`, text);
    }
    
    const h2Elements = await page.$$('h2');
    console.log('H2 elements found:', h2Elements.length);
    
    const h3Elements = await page.$$('h3');
    console.log('H3 elements found:', h3Elements.length);
    
    // Check for any text containing "SFDR"
    if (pageContent.includes('SFDR')) {
      console.log('✅ Found "SFDR" in page content');
    } else {
      console.log('❌ "SFDR" not found in page content');
    }
    
    // Check for any text containing "Navigator"
    if (pageContent.includes('Navigator')) {
      console.log('✅ Found "Navigator" in page content');
    } else {
      console.log('❌ "Navigator" not found in page content');
    }
    
    // Check for any text containing "Unified"
    if (pageContent.includes('Unified')) {
      console.log('✅ Found "Unified" in page content');
    } else {
      console.log('❌ "Unified" not found in page content');
    }
    
    // Get all text content
    const allText = await page.evaluate(() => {
      return document.body.innerText;
    });
    
    console.log('📝 All text content (first 500 chars):', allText.substring(0, 500));
    
    console.log('✅ Debug completed. Check debug-screenshot.png for visual reference.');
    
  } catch (error) {
    console.error('❌ Debug failed with error:', error.message);
  } finally {
    await browser.close();
  }
}

debugPage();
