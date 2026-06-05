import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://qauto.forstudy.space/');

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  const html = await page.content();

  console.log('=== Looking for button text ===');
  if (html.includes('Sign Up')) {
    console.log('✓ Found "Sign Up" text in HTML');
  }
  if (html.includes('Register')) {
    console.log('✓ Found "Register" text in HTML');
  }
  if (html.includes('Sign In')) {
    console.log('✓ Found "Sign In" text in HTML');
  }

  console.log('\n=== Looking for forms ===');
  const forms = await page.$$('form');
  console.log(`Found ${forms.length} forms`);

  console.log('\n=== First 1000 chars of page content ===');
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.substring(0, 1000));

  console.log('\n=== Trying to find registration modal ===');
  try {
    const modal = await page.locator('[role="dialog"], .modal, .modal-dialog').first();
    const visible = await modal.isVisible().catch(() => false);
    console.log('Modal visible:', visible);
  } catch (e) {
    console.log('No modal found');
  }

  await browser.close();
})();
