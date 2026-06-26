import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  get emailInput() {
    return this.page.locator('input[type="email"], input[placeholder*="Email"], input#email');
  }

  get passwordInput() {
    return this.page.locator('input[type="password"], input#password');
  }

  get loginButton() {
    return this.page.locator('button').filter({ hasText: /Login|Sign in|Log in/i });
  }

  get signUpButton() {
    return this.page.locator('a, button').filter({ hasText: /Sign up|Register/i });
  }

  get errorMessage() {
    return this.page.locator('[role="alert"], .alert, .error').first();
  }

  get guestLoginButton() {
    return this.page.locator('button').filter({ hasText: /Guest log in|Guest Login/i });
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goto() {
    await super.goto('/');
  }

  async isLoginFormVisible() {
    return await this.emailInput.isVisible();
  }

  async getErrorMessage() {
    try {
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }
}
