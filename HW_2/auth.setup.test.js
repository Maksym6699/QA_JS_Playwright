import { test } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const authFile = path.join(process.cwd(), '.auth/user.json');
const authDir = path.dirname(authFile);

// Ensure .auth directory exists
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

test('setup: save authenticated storage state', async ({ page, context, baseURL }) => {
  // Navigate to base URL
  // HTTP credentials from config are automatically applied by Playwright
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  console.log(`✓ Navigated to ${baseURL} with HTTP credentials`);

  // Save storage state for use in other tests
  // This preserves cookies, localStorage, etc.
  await context.storageState({ path: authFile });
  console.log(`✓ Storage state saved to ${authFile}`);
});
