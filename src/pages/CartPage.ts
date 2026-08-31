import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──
  private readonly cartItems = this.page.locator('.cart_item');
  private readonly cartBadge = this.page.locator('.shopping_cart_badge');
  private readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  private readonly continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
  private readonly removeButtons = this.page.locator('[data-test^="remove-"]');

  // ── Actions ──

  async removeProduct(productName: string): Promise<void> {
    await this.allureStep(`Remove "${productName}" from cart`, async () => {
      const removeBtn = this.page.locator(`[data-test="remove-${this.slugify(productName)}"]`);
      await removeBtn.click();
    });
  }

  async clickCheckout(): Promise<void> {
    await this.allureStep('Click checkout', async () => {
      await this.checkoutButton.click();
    });
  }

  async clickContinueShopping(): Promise<void> {
    await this.allureStep('Click continue shopping', async () => {
      await this.continueShoppingButton.click();
    });
  }

  // ── Getters ──

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.cartBadge.textContent() ?? '0', 10);
    }
    return 0;
  }

  async getCartItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getCartItemPrices(): Promise<string[]> {
    return this.page.locator('.inventory_item_price').allTextContents();
  }

  // ── Assertions ──

  async expectCartEmpty(): Promise<void> {
    await this.allureStep('Verify cart is empty', async () => {
      await expect(this.cartItems).toHaveCount(0);
      await expect(this.cartBadge).not.toBeVisible();
    });
  }

  async expectCartItemVisible(productName: string): Promise<void> {
    await this.allureStep(`Verify "${productName}" in cart`, async () => {
      await expect(this.page.locator('.inventory_item_name').filter({ hasText: productName })).toBeVisible();
    });
  }

  async expectCartItemCount(expected: number): Promise<void> {
    await this.allureStep(`Verify cart has ${expected} items`, async () => {
      await expect(this.cartItems).toHaveCount(expected);
    });
  }

  async expectCartItemDetail(productName: string, expectedPrice: string): Promise<void> {
    await this.allureStep(`Verify "${productName}" with price "${expectedPrice}" in cart`, async () => {
      const item = this.page.locator('.cart_item').filter({ hasText: productName });
      await expect(item).toBeVisible();
      await expect(item.locator('.inventory_item_price')).toHaveText(expectedPrice);
      await expect(item.locator('.cart_quantity')).toHaveText('1');
    });
  }

  async expectCartBadgeCount(expected: number): Promise<void> {
    await this.allureStep(`Verify cart badge shows ${expected}`, async () => {
      if (expected === 0) {
        await expect(this.cartBadge).not.toBeVisible();
      } else {
        await expect(this.cartBadge).toHaveText(String(expected));
      }
    });
  }
}
