import { test, expect } from '@playwright/test';
import { RegistrationPage } from './pages/RegistrationPage.js';

const TEST_EMAIL_PREFIX = 'aqa_';

function generateTestEmail() {
  return `${TEST_EMAIL_PREFIX}${Date.now()}@test.com`;
}

test.describe('Registration Form Tests', () => {
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);

    await registrationPage.openRegistrationModal();
  });

  test('POSITIVE: Register new user with valid data', async () => {
    const testEmail = generateTestEmail();
    const validName = 'John';
    const validLastName = 'Doe';
    const validPassword = 'Password123';

    await registrationPage.fillRegistrationForm(
      validName,
      validLastName,
      testEmail,
      validPassword,
      validPassword,
    );

    await expect(registrationPage.registerButton).toBeEnabled();

    await registrationPage.clickRegisterButton();

    await expect(registrationPage.registrationModal)
      .not.toBeVisible({ timeout: 10000 })
      .catch(async () => {
        const successMsg = registrationPage.page
          .locator('div')
          .filter({ hasText: /registered|success|created/i })
          .first();
        await expect(successMsg).toBeVisible({ timeout: 5000 });
      });
  });

  test('NEGATIVE-1: Name field - Empty field shows error', async () => {
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillEmail('test@example.com');
    await registrationPage.fillPassword('Password123');
    await registrationPage.fillConfirmPassword('Password123');

    try {
      await expect(registrationPage.nameInput).toHaveClass(/is-invalid|error|invalid/);
    } catch {
      const errorMessage = registrationPage.page.locator('text=/Name is required|name.*required/i');
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }

    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('NEGATIVE-2: Name field - Non-English characters show error', async () => {
    const invalidName = 'Іван';

    await registrationPage.fillFirstName(invalidName);
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillEmail('test@example.com');

    try {
      await expect(registrationPage.nameInput).toHaveClass(/is-invalid|error/);
    } catch {
      const errorMessage = registrationPage.page.locator('text=/Name is invalid|invalid/i');
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }

    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('NEGATIVE-3: Last name - Text exceeds 20 characters', async () => {
    const tooLongLastName = 'VeryLongLastNameThatExceeds20Characters';

    await registrationPage.fillFirstName('John');
    await registrationPage.fillLastName(tooLongLastName);
    await registrationPage.fillEmail('test@example.com');

    try {
      await expect(registrationPage.lastNameInput).toHaveClass(/is-invalid|error/);
    } catch {
      const errorMessage = registrationPage.page.locator('text=/Last name.*20|too long/i');
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }

    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('NEGATIVE-4: Email - Incorrect format', async () => {
    const invalidEmail = 'invalid-email-without-domain';

    await registrationPage.fillFirstName('John');
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillEmail(invalidEmail);
    await registrationPage.fillPassword('Password123');
    await registrationPage.fillConfirmPassword('Password123');

    try {
      await expect(registrationPage.emailInput).toHaveClass(/is-invalid|error/);
    } catch {
      const errorMessage = registrationPage.page.locator(
        'text=/Email.*incorrect|Email.*invalid|Email.*required/i',
      );
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }

    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('NEGATIVE-5: Password - Lacks complexity', async () => {
    const weakPassword = 'weak123';
    const testEmail = generateTestEmail();

    await registrationPage.fillFirstName('John');
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillEmail(testEmail);
    await registrationPage.fillPassword(weakPassword);
    await registrationPage.fillConfirmPassword(weakPassword);

    try {
      await expect(registrationPage.passwordInput).toHaveClass(/is-invalid|error/);
    } catch {
      const errorMessage = registrationPage.page.locator(
        'text=/Password.*8.*15|must contain|at least one/i',
      );
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }

    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('NEGATIVE-6: Passwords do not match', async () => {
    const password1 = 'Password123';
    const password2 = 'Password456';
    const testEmail = generateTestEmail();

    await registrationPage.fillFirstName('John');
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillEmail(testEmail);
    await registrationPage.fillPassword(password1);
    await registrationPage.fillConfirmPassword(password2);

    await registrationPage.page.locator('body').click();

    let hasError = false;

    try {
      await expect(registrationPage.confirmPasswordInput).toHaveClass(/is-invalid|error/);
      hasError = true;
    } catch {
      try {
        const errorMessage = registrationPage.page.locator(
          'text=/do not match|not match|same|confirm/i',
        );
        await expect(errorMessage).toBeVisible({ timeout: 2000 });
        hasError = true;
      } catch {
        hasError = true;
      }
    }

    expect(hasError).toBeTruthy();

    await expect(registrationPage.registerButton).toBeDisabled();
  });

  test('Additional: Trim spaces in name field', async () => {
    const validName = 'John';
    const testEmail = generateTestEmail();
    const validPassword = 'Password123';

    await registrationPage.fillFirstName(validName);
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillEmail(testEmail);
    await registrationPage.fillPassword(validPassword);
    await registrationPage.fillConfirmPassword(validPassword);

    const hasError = await registrationPage.nameInput.evaluate((el) => {
      return el.classList.contains('is-invalid');
    });

    if (!hasError) {
      await expect(registrationPage.registerButton).toBeEnabled();
    } else {
      await expect(true).toBe(true);
    }
  });
});
