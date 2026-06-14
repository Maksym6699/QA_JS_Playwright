import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const baseURL = process.env.BASE_URL || 'https://qauto.forstudy.space/';
const httpUsername = process.env.HTTP_USERNAME || 'guest';
const httpPassword = process.env.HTTP_PASSWORD || 'welcome2qauto';
const authFile = path.join(process.cwd(), '.auth/user.json');

export default defineConfig({
  testDir: './',
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
    // Setup project for authentication
    {
      name: 'setup',
      testDir: './',
      testMatch: '**/*setup*.test.js',
      use: { ...devices['Desktop Chrome'] },
    },
    // Main chromium project that depends on setup
    {
      name: 'chromium',
      testDir: './',
      testMatch: '**/*test*.js',
      testIgnore: '**/*setup*.js',
      use: {
        ...devices['Desktop Chrome'],
        // Load storage state from setup
        storageState: authFile,
      },
      // Depend on setup project
      dependencies: ['setup'],
    },
  ],
  webServer: null,
});
