import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { env } from '../helpers/env';

const STORAGE_DIR = path.resolve(__dirname, '../../storage-state');
const STORAGE_FILE = path.join(STORAGE_DIR, 'standard-user.json');

setup('authenticate as standard user', async ({ page }) => {
  // Ensure directory exists — critical for fresh git clones where
  // storage-state/ only has .gitkeep (or may be empty)
  fs.mkdirSync(STORAGE_DIR, { recursive: true });

  await page.goto(env.baseUrl);
  await page.locator('#user-name').fill(env.standardUser.username);
  await page.locator('#password').fill(env.standardUser.password);
  await page.locator('#login-button').click();
  await page.waitForURL('**/inventory.html');

  // Save storage state — reused by ALL subsequent browser projects
  await page.context().storageState({ path: STORAGE_FILE });
});
