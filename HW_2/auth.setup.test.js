import { test } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const authFile = path.join(process.cwd(), '.auth/user.json');
const authDir = path.dirname(authFile);

if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

test('setup: save authenticated storage state', async ({ page, context, baseURL }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  console.log(`✓ Navigated to ${baseURL} with HTTP credentials`);

  await context.storageState({ path: authFile });
  console.log(`✓ Storage state saved to ${authFile}`);
});
