import { test, expect } from '../../src/fixtures/test-fixtures';
import { env } from '../../src/helpers/env';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should login successfully with valid credentials', async ({ loginPage, page }) => {
    // Arrange & Act
    await loginPage.login(env.standardUser.username, env.standardUser.password);

    // Assert
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('should show error with invalid password', async ({ loginPage }) => {
    // Arrange & Act
    await loginPage.login(env.invalidUser.username, env.invalidUser.password);

    // Assert
    await loginPage.expectErrorMessage('Username and password do not match any user in this service');
  });

  test('should show error with locked out user', async ({ loginPage }) => {
    // Arrange & Act
    await loginPage.login(env.lockedOutUser.username, env.lockedOutUser.password);

    // Assert
    await loginPage.expectErrorMessage('Sorry, this user has been locked out.');
  });

  test('should show error with empty credentials', async ({ loginPage }) => {
    // Arrange & Act
    await loginPage.login('', '');

    // Assert
    await loginPage.expectErrorMessage('Username is required');
  });
});
