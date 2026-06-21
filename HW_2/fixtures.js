import { test as base } from '@playwright/test';
import { GaragePage } from './pages/GaragePage.js';

export const test = base.extend({
  userGaragePage: async ({ page }, use) => {
    const garagePage = new GaragePage(page);

    await page.goto('/garage');
    await garagePage.waitForGaragePageLoad();

    const isLoggedIn = await garagePage.isUserLoggedIn();
    if (!isLoggedIn) {
      console.warn('User may not be properly logged in');
    }

    await use(garagePage);
  },
});

export { expect } from '@playwright/test';
