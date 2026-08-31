import { defineConfig, devices } from '@playwright/test';
import { env } from './src/helpers/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright', {
      outputFolder: 'reports/allure-results',
      detail: true,
      suiteTitle: false,
    }],
  ],

  use: {
    baseURL: env.baseUrl,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    // ── Setup: login once, save storage state ──
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // ── Test suites: all use saved storage state ──
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storage-state/standard-user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'storage-state/standard-user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'storage-state/standard-user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
