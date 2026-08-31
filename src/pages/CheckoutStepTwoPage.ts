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
  private readonly itemSubtotal = this.page.locator('.summary_subtotal_label');
  private readonly itemTax = this.page.locator('.summary_tax_label');
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

  async getSubtotal(): Promise<string> {
    const text = await this.itemSubtotal.textContent();
    return text?.replace('Item total: ', '') ?? '';
  }

  async getTax(): Promise<string> {
    const text = await this.itemTax.textContent();
    return text?.replace('Tax: ', '') ?? '';
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

  async expectPricing(expectedSubtotal: string, expectedTax: string, expectedTotal: string): Promise<void> {
    await this.allureStep(`Verify pricing: subtotal=${expectedSubtotal}, tax=${expectedTax}, total=${expectedTotal}`, async () => {
      await expect(this.itemSubtotal).toContainText(expectedSubtotal);
      await expect(this.itemTax).toContainText(expectedTax);
      await expect(this.totalPrice).toContainText(expectedTotal);
    });
  }
}
