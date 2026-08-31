import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──
  private readonly confirmationHeader = this.page.locator('.complete-header');
  private readonly confirmationText = this.page.locator('.complete-text');
  private readonly backHomeButton = this.page.locator('[data-test="back-to-products"]');

  // ── Actions ──

  async clickBackHome(): Promise<void> {
    await this.allureStep('Click back home', async () => {
      await this.backHomeButton.click();
    });
  }

  // ── Getters ──

  async getConfirmationMessage(): Promise<string> {
    return (await this.confirmationHeader.textContent()) ?? '';
  }

  async getConfirmationText(): Promise<string> {
    return (await this.confirmationText.textContent()) ?? '';
  }

  // ── Assertions ──

  async expectConfirmationVisible(): Promise<void> {
    await this.allureStep('Verify order confirmation is visible', async () => {
      await expect(this.confirmationHeader).toBeVisible();
      await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
    });
  }

  async expectBackHomeVisible(): Promise<void> {
    await this.allureStep('Verify back home button is visible', async () => {
      await expect(this.backHomeButton).toBeVisible();
    });
  }
}
