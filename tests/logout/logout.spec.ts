import { test, expect } from '../../src/fixtures/test-fixtures';
import { env } from '../../src/helpers/env';

test.describe('Logout', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Reuse existing login flow — login first, then test logout
    await loginPage.navigate();
    await loginPage.login(env.standardUser.username, env.standardUser.password);
    await expect(loginPage.getPage()).toHaveURL(/.*inventory\.html/);
  });

  test('should logout successfully and redirect to login page', async ({ header, page }) => {
    // Act
    await header.logout();

    // Assert — redirected to login page
    await expect(page).toHaveURL(/.*$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('should not access inventory page after logout via browser Back', async ({ header, page }) => {
    // Act — logout
    await header.logout();

    // Assert — on login page
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // Act — use browser Back button
    await page.goBack();

    // Assert — should redirect back to login (session destroyed)
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
