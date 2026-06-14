import { BasePage } from './BasePage.js';
export class RegistrationPage extends BasePage {
  get signUpButton() {
    return this.page.locator('button').filter({ hasText: /Sign up/i });
  }

  get registrationModal() {
    return this.page.locator('[role="dialog"], .modal');
  }

  get nameInput() {
    return this.page
      .locator('input[type="text"], input[type="email"], input[type="password"]')
      .nth(0);
  }

  get lastNameInput() {
    return this.page
      .locator('input[type="text"], input[type="email"], input[type="password"]')
      .nth(1);
  }

  get emailInput() {
    return this.page
      .locator('input[type="text"], input[type="email"], input[type="password"]')
      .nth(2);
  }

  get passwordInput() {
    return this.page
      .locator('input[type="text"], input[type="email"], input[type="password"]')
      .nth(3);
  }

  get confirmPasswordInput() {
    return this.page
      .locator('input[type="text"], input[type="email"], input[type="password"]')
      .nth(4);
  }

  get registerButton() {
    return this.page.locator('button').filter({ hasText: /Register|Submit/i });
  }

  get errorMessages() {
    return this.page.locator('[role="alert"], .error, .invalid-feedback, .form-error');
  }

  async openRegistrationModal() {
    await this.goto('/');

    await this.signUpButton.click({ timeout: 10000 });

    await this.page.waitForSelector('[role="dialog"], .modal', { timeout: 10000 });
  }

  async fillRegistrationForm(firstName, lastName, email, password, confirmPassword) {
    await this.nameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async fillFirstName(name) {
    await this.nameInput.fill(name);
  }

  async fillLastName(lastName) {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(confirmPassword) {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async isRegisterButtonEnabled() {
    return await this.registerButton.isEnabled();
  }

  async isRegisterButtonDisabled() {
    return await this.registerButton.isDisabled();
  }

  async getErrorMessage() {
    const errorMsg = this.page
      .locator('div')
      .filter({ hasText: /required|invalid|error/i })
      .first();
    return await errorMsg.textContent();
  }

  async hasFieldError(fieldLocator) {
    return await fieldLocator.evaluate((el) => {
      return (
        el.classList.contains('is-invalid') ||
        el.classList.contains('error') ||
        el.classList.contains('invalid')
      );
    });
  }

  async waitForModalClose(timeout = 10000) {
    await this.registrationModal.waitFor({ state: 'hidden', timeout });
  }

  async isModalVisible() {
    return await this.registrationModal.isVisible();
  }

  async clearForm() {
    await this.nameInput.clear();
    await this.lastNameInput.clear();
    await this.emailInput.clear();
    await this.passwordInput.clear();
    await this.confirmPasswordInput.clear();
  }

  async getSuccessMessage() {
    const successMsg = this.page
      .locator('div')
      .filter({ hasText: /registered|success|created/i })
      .first();
    return await successMsg.textContent();
  }

  async closeModal() {
    const closeButton = this.page.locator('[aria-label="Close"], .modal-close, .close-btn');
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }
  }
}
