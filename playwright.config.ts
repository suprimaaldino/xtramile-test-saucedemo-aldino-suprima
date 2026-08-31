import { defineConfig, devices } from '@playwright/test';

import { env } from './src/helpers/env';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  // 2 shards × 2 workers = up to 4 concurrent workers
  workers: process.env.CI ? 2 : 1,

  reporter: [
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: false,
      },
    ],
  ],

  use: {
    baseURL: env.baseUrl,

    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // ── Setup: one per browser (cookies are browser-specific) ──
    {
      name: 'setup-chromium',
      testDir: './src/fixtures',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'setup-firefox',
      testDir: './src/fixtures',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'setup-webkit',
      testDir: './src/fixtures',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Safari'] },
    },

    // ── Test suites: each depends on its own browser setup ──
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storage-state/chromium.json',
      },
      dependencies: ['setup-chromium'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'storage-state/firefox.json',
      },
      dependencies: ['setup-firefox'],
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'storage-state/webkit.json',
      },
      dependencies: ['setup-webkit'],
    },
  ],
});