import { test, expect, request } from '@playwright/test';

const BASE_URL = process.env.BASE_URL?.replace(/\/+$/, '') || 'https://qauto.forstudy.space';
const HTTP_USERNAME = process.env.HTTP_USERNAME || 'guest';
const HTTP_PASSWORD = process.env.HTTP_PASSWORD || 'welcome2qauto';
const DEFAULT_PASSWORD = 'TestPassword123';

function generateUniqueEmail() {
  return `api_test_${Date.now()}@test.com`;
}

async function createAuthenticatedApiContext() {
  const api = await request.newContext({
    baseURL: BASE_URL,
    httpCredentials: {
      username: HTTP_USERNAME,
      password: HTTP_PASSWORD,
    },
  });

  const signupResponse = await api.post('/api/auth/signup', {
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      name: 'Api',
      lastName: 'User',
      email: generateUniqueEmail(),
      password: DEFAULT_PASSWORD,
      repeatPassword: DEFAULT_PASSWORD,
    }),
  });

  expect(signupResponse.status()).toBe(201);
  const json = JSON.parse(await signupResponse.text());
  expect(json.status).toBe('ok');

  return api;
}

test.describe('Cars API tests', () => {
  let authenticatedApiContext;

  test.beforeEach(async () => {
    authenticatedApiContext = await createAuthenticatedApiContext();
  });

  test.afterEach(async () => {
    await authenticatedApiContext.dispose();
  });

  test('POSITIVE: create car with valid payload', async () => {
    const createResponse = await authenticatedApiContext.post('/api/cars', {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ carBrandId: 1, carModelId: 1, mileage: 122 }),
    });

    expect(createResponse.status()).toBe(201);
    const body = JSON.parse(await createResponse.text());
    expect(body.status).toBe('ok');
    expect(body.data).toMatchObject({ carBrandId: 1, carModelId: 1, mileage: 122 });
    expect(typeof body.data.id).toBe('number');
  });

  test('NEGATIVE: missing required mileage returns 400', async () => {
    const response = await authenticatedApiContext.post('/api/cars', {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ carBrandId: 1, carModelId: 1 }),
    });

    expect(response.status()).toBe(400);
    const body = JSON.parse(await response.text());
    expect(body.status).toBe('error');
    expect(body.message).toMatch(/mileage|required/i);
  });

  test('NEGATIVE: missing required carModelId returns 400', async () => {
    const response = await authenticatedApiContext.post('/api/cars', {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ carBrandId: 1, mileage: 122 }),
    });

    expect(response.status()).toBe(400);
    const body = JSON.parse(await response.text());
    expect(body.status).toBe('error');
    expect(body.message).toMatch(/carModelId|required/i);
  });
});
