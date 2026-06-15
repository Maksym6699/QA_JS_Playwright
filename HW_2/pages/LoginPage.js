import { BasePage } from './BasePage.js';

/**
 * LoginPage - Page Object for user login
 * Encapsulates all interactions with the login page
 */
export class LoginPage extends BasePage {
  // Locators
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

  /**
   * Login with email and password
   */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await super.goto('/');
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible() {
    return await this.emailInput.isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    try {
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }
}
