import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──
  private readonly finishButton = this.page.locator('[data-test="finish"]');
  private readonly cancelButton = this.page.locator('[data-test="cancel"]');
  private readonly cartItems = this.page.locator('.cart_item');
  private readonly totalPrice = this.page.locator('.summary_total_label');
  private readonly itemPrices = this.page.locator('.inventory_item_price');

  // ── Actions ──

  async clickFinish(): Promise<void> {
    await this.allureStep('Click finish', async () => {
      await this.finishButton.click();
    });
  }

  async clickCancel(): Promise<void> {
    await this.allureStep('Click cancel', async () => {
      await this.cancelButton.click();
    });
  }

  // ── Getters ──

  async getOrderItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getTotalPrice(): Promise<string> {
    const text = await this.totalPrice.textContent();
    return text?.replace('Total: ', '') ?? '';
  }

  async getItemPrices(): Promise<string[]> {
    return this.itemPrices.allTextContents();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  // ── Assertions ──

  async expectOrderSummaryVisible(): Promise<void> {
    await this.allureStep('Verify order summary is visible', async () => {
      await expect(this.finishButton).toBeVisible();
      await expect(this.totalPrice).toBeVisible();
    });
  }

  async expectItemCount(expected: number): Promise<void> {
    await this.allureStep(`Verify order has ${expected} items`, async () => {
      await expect(this.cartItems).toHaveCount(expected);
    });
  }
}
