export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(locator, timeout = 10000) {
    await this.page.locator(locator).waitFor({ state: 'visible', timeout });
  }

  async waitForElementHidden(locator, timeout = 10000) {
    await this.page.locator(locator).waitFor({ state: 'hidden', timeout });
  }
}
