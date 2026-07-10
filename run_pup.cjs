const puppeteer = require('puppeteer');  
(async () => {  
  const browser = await puppeteer.launch({ headless: 'new' });  
  const page = await browser.newPage();  
  page.on('pageerror', e => console.log('PAGE_ERROR:', e.message));  
  page.on('console', msg => console.log('CONSOLE:', msg.text()));  
  await page.goto('https://e-roupas.vercel.app/crm');  
  await new Promise(r => setTimeout(r, 4000));  
  await browser.close();  
})();  
