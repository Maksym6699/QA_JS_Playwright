import { BasePage } from './BasePage.js';

export class ProfilePage extends BasePage {
  get profileName() {
    return this.page.locator('p.profile_name');
  }

  async gotoProfile() {
    await this.goto('/panel/profile');
  }

  async waitForProfileName(timeout = 10000) {
    await this.profileName.waitFor({ state: 'visible', timeout });
  }

  async getProfileName() {
    return this.profileName.textContent();
  }

  async interceptUserProfile(responseBody) {
    await this.page.route('**/api/users/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseBody),
      });
    });
  }
}
