import { test, expect, request } from '@playwright/test';
import { ProfilePage } from './pages/ProfilePage.js';

const BASE_URL = process.env.BASE_URL?.replace(/\/+$/, '') || 'https://qauto.forstudy.space';
const HTTP_USERNAME = process.env.HTTP_USERNAME || 'guest';
const HTTP_PASSWORD = process.env.HTTP_PASSWORD || 'welcome2qauto';
const DEFAULT_PASSWORD = 'TestPassword123';

const MOCK_PROFILE_RESPONSE = {
  status: 'ok',
  data: {
    userId: 999999,
    photoFilename: 'default-user.png',
    name: 'Mock',
    lastName: 'Visitor',
  },
};

function generateProfileTestEmail() {
  return `profile_user_${Date.now()}@test.com`;
}

async function injectAuthenticatedCookies(page) {
  const apiContext = await request.newContext({
    baseURL: BASE_URL,
    httpCredentials: {
      username: HTTP_USERNAME,
      password: HTTP_PASSWORD,
    },
  });

  const signupResponse = await apiContext.post('/api/auth/signup', {
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      name: 'Profile',
      lastName: 'User',
      email: generateProfileTestEmail(),
      password: DEFAULT_PASSWORD,
      repeatPassword: DEFAULT_PASSWORD,
    }),
  });

  expect(signupResponse.status()).toBe(201);

  const storageState = await apiContext.storageState();
  await page.context().addCookies(storageState.cookies);
  await apiContext.dispose();
}

test.describe('Profile page response interception', () => {
  test('should display mocked profile name from /api/users/profile', async ({ page }) => {
    const profilePage = new ProfilePage(page);

    await injectAuthenticatedCookies(page);
    await profilePage.interceptUserProfile(MOCK_PROFILE_RESPONSE);
    await profilePage.gotoProfile();

    await profilePage.waitForProfileName();
    await expect(profilePage.profileName).toHaveText('Mock Visitor');
  });
});
