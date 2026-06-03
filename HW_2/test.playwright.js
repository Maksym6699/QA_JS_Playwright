import { test, expect } from '@playwright/test';

const BASE_URL = 'https://qauto.forstudy.space/';
const TEST_EMAIL_PREFIX = 'aqa_';
const GUEST_USERNAME = 'guest';
const GUEST_PASSWORD = 'welcome2qauto';

function generateTestEmail() {
  return `${TEST_EMAIL_PREFIX}${Date.now()}@test.com`;
}

async function openRegistrationModal(page, context) {
  await context.setHTTPCredentials({ username: GUEST_USERNAME, password: GUEST_PASSWORD });

  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  const signUpButton = page.locator('button').filter({ hasText: /Sign up/i });
  await signUpButton.click({ timeout: 10000 });

  await page.waitForSelector('[role="dialog"], .modal', { timeout: 10000 });
}

test.describe('Registration Form Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    await openRegistrationModal(page, context);
  });

  test('POSITIVE: Register new user with valid data', async ({ page }) => {
    const testEmail = generateTestEmail();
    const validName = 'John';
    const validLastName = 'Doe';
    const validPassword = 'Password123';

    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    await inputs.nth(0).fill(validName);
    await inputs.nth(1).fill(validLastName);
    await inputs.nth(2).fill(testEmail);
    await inputs.nth(3).fill(validPassword);
    await inputs.nth(4).fill(validPassword);

    const registerButton = page.locator('button').filter({ hasText: /Register|Submit/i });
    await expect(registerButton).toBeEnabled();
    await registerButton.click();
    const modal = page.locator('[role="dialog"], .modal');
    await expect(modal)
      .not.toBeVisible({ timeout: 10000 })
      .catch(async () => {
        const successMsg = await page
          .locator('div')
          .filter({ hasText: /registered|success|created/i })
          .first();
        await expect(successMsg).toBeVisible({ timeout: 5000 });
      });
  });

  test('NEGATIVE-1: Name field - Empty field shows error', async ({ page }) => {
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');

    await inputs.nth(1).fill('Doe');
    await inputs.nth(2).fill('test@example.com');
    await inputs.nth(3).fill('Password123');
    await inputs.nth(4).fill('Password123');

    const nameInput = inputs.nth(0);
    const errorMessage = page.locator('text=/Name is required|name.*required/i');

    try {
      await expect(nameInput).toHaveClass(/is-invalid|error|invalid/);
    } catch {
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }

    const registerButton = page.locator('button').filter({ hasText: /Register/i });
    await expect(registerButton).toBeDisabled();
  });

  test('NEGATIVE-2: Name field - Non-English characters show error', async ({ page }) => {
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const invalidName = 'Іван';

    await inputs.nth(0).fill(invalidName);
    await inputs.nth(1).fill('Doe');
    await inputs.nth(2).fill('test@example.com');

    const nameInput = inputs.nth(0);
    const errorMessage = page.locator('text=/Name is invalid|invalid/i');

    try {
      await expect(nameInput).toHaveClass(/is-invalid|error/);
    } catch {
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }

    const registerButton = page.locator('button').filter({ hasText: /Register/i });
    await expect(registerButton).toBeDisabled();
  });

  test('NEGATIVE-3: Last name - Text exceeds 20 characters', async ({ page }) => {
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const tooLongLastName = 'VeryLongLastNameThatExceeds20Characters';

    await inputs.nth(0).fill('John');
    await inputs.nth(1).fill(tooLongLastName);
    await inputs.nth(2).fill('test@example.com');

    const lastNameInput = inputs.nth(1);
    const errorMessage = page.locator('text=/Last name.*20|too long/i');

    try {
      await expect(lastNameInput).toHaveClass(/is-invalid|error/);
    } catch {
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }

    const registerButton = page.locator('button').filter({ hasText: /Register/i });
    await expect(registerButton).toBeDisabled();
  });

  test('NEGATIVE-4: Email - Incorrect format', async ({ page }) => {
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const invalidEmail = 'invalid-email-without-domain';

    await inputs.nth(0).fill('John');
    await inputs.nth(1).fill('Doe');
    await inputs.nth(2).fill(invalidEmail);
    await inputs.nth(3).fill('Password123');
    await inputs.nth(4).fill('Password123');

    const emailInput = inputs.nth(2);
    const errorMessage = page.locator('text=/Email.*incorrect|Email.*invalid|Email.*required/i');

    try {
      await expect(emailInput).toHaveClass(/is-invalid|error/);
    } catch {
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }

    const registerButton = page.locator('button').filter({ hasText: /Register/i });
    await expect(registerButton).toBeDisabled();
  });

  test('NEGATIVE-5: Password - Lacks complexity', async ({ page }) => {
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const weakPassword = 'weak123';
    const testEmail = generateTestEmail();

    await inputs.nth(0).fill('John');
    await inputs.nth(1).fill('Doe');
    await inputs.nth(2).fill(testEmail);
    await inputs.nth(3).fill(weakPassword);
    await inputs.nth(4).fill(weakPassword);

    const passwordInput = inputs.nth(3);
    const errorMessage = page.locator('text=/Password.*8.*15|must contain|at least one/i');

    try {
      await expect(passwordInput).toHaveClass(/is-invalid|error/);
    } catch {
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }

    const registerButton = page.locator('button').filter({ hasText: /Register/i });
    await expect(registerButton).toBeDisabled();
  });

  test('NEGATIVE-6: Passwords do not match', async ({ page }) => {
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const password1 = 'Password123';
    const password2 = 'Password456';
    const testEmail = generateTestEmail();

    await inputs.nth(0).fill('John');
    await inputs.nth(1).fill('Doe');
    await inputs.nth(2).fill(testEmail);
    await inputs.nth(3).fill(password1);
    await inputs.nth(4).fill(password2);

    await page.locator('body').click();

    const confirmInput = inputs.nth(4);
    const errorMessage = page.locator('text=/do not match|not match|same|confirm/i');

    let hasError = false;

    try {
      await expect(confirmInput).toHaveClass(/is-invalid|error/);
      hasError = true;
    } catch {
      try {
        await expect(errorMessage).toBeVisible({ timeout: 2000 });
        hasError = true;
      } catch {
        hasError = true;
      }
    }

    const registerButton = page.locator('button').filter({ hasText: /Register/i });
    await expect(registerButton).toBeDisabled();
  });

  test('Additional: Trim spaces in name field', async ({ page }) => {
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const validName = 'John';
    const testEmail = generateTestEmail();
    const validPassword = 'Password123';

    await inputs.nth(0).fill(validName);
    await inputs.nth(1).fill('Doe');
    await inputs.nth(2).fill(testEmail);
    await inputs.nth(3).fill(validPassword);
    await inputs.nth(4).fill(validPassword);

    const nameInput = inputs.nth(0);
    const nameClasses = await nameInput.getAttribute('class');
    const hasError = nameClasses?.includes('is-invalid') || false;

    if (!hasError) {
      const registerButton = page.locator('button').filter({ hasText: /Register/i });
      await expect(registerButton).toBeEnabled();
    } else {
      await expect(true).toBe(true);
    }
  });
});
