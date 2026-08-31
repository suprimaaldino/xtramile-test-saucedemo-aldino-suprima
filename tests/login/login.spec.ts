import { test, expect } from '../../src/fixtures/test-fixtures';
import { env } from '../../src/helpers/env';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC-01: should login successfully with valid credentials', async ({ loginPage, inventoryPage, page }) => {
    // Arrange & Act
    await loginPage.login(env.standardUser.username, env.standardUser.password);

    // Assert — redirected to inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    await inventoryPage.expectPageTitle('Products');
    await inventoryPage.expectBurgerMenuVisible();
    await inventoryPage.expectCartIconVisible();
  });

  test('TC-03: should show error with invalid password', async ({ loginPage }) => {
    // Arrange & Act
    await loginPage.login(env.invalidUser.username, env.invalidUser.password);

    // Assert
    await loginPage.expectErrorMessage('Username and password do not match any user in this service');
  });

  test('TC-02: should show error with locked out user', async ({ loginPage }) => {
    // Arrange & Act
    await loginPage.login(env.lockedOutUser.username, env.lockedOutUser.password);

    // Assert
    await loginPage.expectErrorMessage('Sorry, this user has been locked out.');
  });

  test('TC-04: should show error with empty credentials', async ({ loginPage }) => {
    // Arrange & Act
    await loginPage.login('', '');

    // Assert
    await loginPage.expectErrorMessage('Username is required');
  });
});
