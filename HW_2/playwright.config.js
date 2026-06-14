import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'https://qauto.forstudy.space/';
const httpUsername = process.env.HTTP_USERNAME || 'guest';
const httpPassword = process.env.HTTP_PASSWORD || 'welcome2qauto';

export default defineConfig({
  testDir: './',
  testMatch: '**/*test*.js',
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL,
    httpCredentials: {
      username: httpUsername,
      password: httpPassword,
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: null,
});
