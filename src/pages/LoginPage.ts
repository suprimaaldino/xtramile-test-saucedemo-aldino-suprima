import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──
  private readonly usernameInput = this.page.locator('[data-test="username"]');
  private readonly passwordInput = this.page.locator('[data-test="password"]');
  private readonly loginButton = this.page.locator('[data-test="login-button"]');
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  // ── Actions ──

  async navigate(): Promise<void> {
    await this.allureStep('Navigate to login page', async () => {
      await this.page.goto('/');
    });
  }

  async fillUsername(username: string): Promise<void> {
    await this.allureStep(`Fill username: "${username}"`, async () => {
      await this.usernameInput.fill(username);
    });
  }

  async fillPassword(password: string): Promise<void> {
    await this.allureStep('Fill password', async () => {
      await this.passwordInput.fill(password);
    });
  }

  async clickLogin(): Promise<void> {
    await this.allureStep('Click login button', async () => {
      await this.loginButton.click();
    });
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  // ── Assertions ──

  async expectErrorMessage(expectedMessage: string): Promise<void> {
    await this.allureStep(`Verify error message: "${expectedMessage}"`, async () => {
      await expect(this.errorMessage).toBeVisible();
      await expect(this.errorMessage).toContainText(expectedMessage);
    });
  }

  async expectLoginPage(): Promise<void> {
    await this.allureStep('Verify on login page', async () => {
      await expect(this.loginButton).toBeVisible();
    });
  }
}
