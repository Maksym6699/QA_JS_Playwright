import { BasePage } from './BasePage.js';

/**
 * GaragePage - Page Object for user's garage
 * Encapsulates all interactions with the garage/dashboard page after login
 */
export class GaragePage extends BasePage {
  // Locators
  get logoutButton() {
    return this.page.locator('button, a').filter({ hasText: /Logout|Log out|Sign out/i });
  }

  get userMenuButton() {
    return this.page
      .locator('[class*="profile"], [class*="user"], button[aria-label*="user"]')
      .first();
  }

  get garagePage() {
    return this.page.locator('h1, h2').filter({ hasText: /Garage|My Cars/i });
  }

  get addCarButton() {
    return this.page.locator('button').filter({ hasText: /Add car|Add|New car/i });
  }

  get carList() {
    return this.page.locator('[class*="car"], [class*="vehicle"]');
  }

  get userGreeting() {
    return this.page
      .locator('span')
      .filter({ hasText: /Welcome|Hi|Hello/i })
      .first();
  }

  /**
   * Verify user is logged in on garage page
   */
  async isUserLoggedIn() {
    try {
      await this.page.waitForLoadState('networkidle');
      const logoutBtn = await this.logoutButton.isVisible().catch(() => false);
      const garageTitle = await this.garagePage.isVisible().catch(() => false);
      return logoutBtn || garageTitle;
    } catch {
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    const logoutBtn = this.logoutButton;
    if (await logoutBtn.isVisible().catch(() => false)) {
      await logoutBtn.click();
    }
  }

  /**
   * Get garage page title
   */
  async getPageTitle() {
    return await this.garagePage.textContent();
  }

  /**
   * Get number of cars in garage
   */
  async getCarCount() {
    const cars = await this.carList.count();
    return cars;
  }

  /**
   * Click add car button
   */
  async clickAddCarButton() {
    await this.addCarButton.click();
  }

  /**
   * Wait for garage page to load
   */
  async waitForGaragePageLoad(timeout = 10000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }
}
