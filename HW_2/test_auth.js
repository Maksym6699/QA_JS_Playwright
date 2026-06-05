import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await context.setHTTPCredentials({ username: 'guest', password: 'welcome2qauto' });

  await page.goto('https://qauto.forstudy.space/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('=== Page loaded ===');
  console.log(text.substring(0, 500));

  const buttons = await page.locator('button').all();
  console.log(`\n=== Found ${buttons.length} buttons ===`);
  for (let i = 0; i < Math.min(10, buttons.length); i++) {
    const text = await buttons[i].textContent();
    console.log(`Button: "${text.trim()}"`);
  }

  await browser.close();
})();
