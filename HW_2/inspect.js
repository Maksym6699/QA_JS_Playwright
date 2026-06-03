import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://qauto.forstudy.space/');
  await page.waitForLoadState('networkidle');

  const buttons = await page.$$('button');
  console.log('=== ALL BUTTONS ===');
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    const classes = await buttons[i].getAttribute('class');
    console.log(`Button ${i}: "${text.trim()}" - classes: ${classes}`);
  }

  console.log('\n=== SEARCHING FOR SIGN UP BUTTON ===');
  const signUpBtn = await page
    .locator('button')
    .filter({ hasText: /Sign Up|Register/i })
    .first();
  try {
    const text = await signUpBtn.textContent();
    console.log('Found Sign Up button:', text);
  } catch (e) {
    console.log('Sign Up button not found with that selector');
  }

  console.log('\n=== TRYING OTHER SELECTORS ===');
  const allButtons = await page.locator('button').all();
  console.log(`Total buttons found: ${allButtons.length}`);

  for (let i = 0; i < Math.min(5, allButtons.length); i++) {
    const text = await allButtons[i].textContent();
    console.log(`Button ${i}: "${text.trim()}"`);
  }

  await browser.close();
})();
