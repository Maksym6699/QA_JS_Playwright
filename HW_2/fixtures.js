import { test as base } from '@playwright/test';
import { GaragePage } from './pages/GaragePage.js';

/**
 * Custom fixture that provides authenticated GaragePage
 * Automatically uses the saved storage state from auth.setup.js
 */
export const test = base.extend({
  /**
   * userGaragePage fixture - provides an authenticated GaragePage instance
   * Usage: test('test name', async ({ userGaragePage }) => { ... })
   */
  userGaragePage: async ({ page }, use) => {
    // Create GaragePage instance
    const garagePage = new GaragePage(page);

    // Wait for garage page to load (user should be logged in via storageState)
    await page.goto('/garage');
    await garagePage.waitForGaragePageLoad();

    // Verify user is logged in
    const isLoggedIn = await garagePage.isUserLoggedIn();
    if (!isLoggedIn) {
      console.warn('User may not be properly logged in');
    }

    // Provide the fixture to the test
    await use(garagePage);
  },
});

export { expect } from '@playwright/test';
