import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { env } from '../helpers/env';

const STORAGE_DIR = path.resolve(__dirname, '../../storage-state');

setup('authenticate as standard user', async ({ page }) => {
  // Ensure directory exists
  fs.mkdirSync(STORAGE_DIR, { recursive: true });

  // Determine browser from project name (setup-chromium → chromium)
  const browser = setup.info().project.name.replace('setup-', '');
  const storageFile = path.join(STORAGE_DIR, `${browser}.json`);

  await page.goto(env.baseUrl);
  await page.locator('#user-name').fill(env.standardUser.username);
  await page.locator('#password').fill(env.standardUser.password);
  await page.locator('#login-button').click();
  await page.waitForURL('**/inventory.html');

  // Save browser-specific storage state
  await page.context().storageState({ path: storageFile });
});
