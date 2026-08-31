import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──
  private readonly inventoryList = this.page.locator('.inventory_list');
  private readonly cartBadge = this.page.locator('.shopping_cart_badge');
  private readonly cartLink = this.page.locator('[data-test="shopping-cart-link"]');
  private readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');
  private readonly productPrices = this.page.locator('.inventory_item_price');
  private readonly pageTitle = this.page.locator('.title');
  private readonly burgerMenu = this.page.locator('#react-burger-menu-btn');
  private readonly cartIcon = this.page.locator('[data-test="shopping-cart-link"]');

  // ── Assertions (auto-wait + retry) ──

  async expectInventoryLoaded(): Promise<void> {
    await expect(this.inventoryList).toBeVisible();
  }

  // ── Actions ──

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.allureStep(`Sort by "${option}"`, async () => {
      await this.sortDropdown.selectOption(option);
    });
  }

  async getProductPrices(): Promise<string[]> {
    return this.productPrices.allTextContents();
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.allureStep(`Add "${productName}" to cart`, async () => {
      const button = this.page.locator(`[data-test="add-to-cart-${this.slugify(productName)}"]`);
      await button.click();  // Playwright auto-waits for visible + enabled
    });
  }

  async removeProductFromCart(productName: string): Promise<void> {
    await this.allureStep(`Remove "${productName}" from cart`, async () => {
      const button = this.page.locator(`[data-test="remove-${this.slugify(productName)}"]`);
      await button.click();  // Playwright auto-waits for visible + enabled
    });
  }

  async navigateToCart(): Promise<void> {
    await this.allureStep('Navigate to cart', async () => {
      await this.cartLink.click();
    });
  }

  // ── Getters ──

  async getCartBadgeCount(): Promise<number> {
    const badge = this.cartBadge;
    if (await badge.isVisible()) {
      return parseInt(await badge.textContent() ?? '0', 10);
    }
    return 0;
  }

  async getProductCount(): Promise<number> {
    return this.page.locator('.inventory_item').count();
  }

  async getAllProductNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductByName(name: string) {
    return this.page.locator('.inventory_item').filter({ hasText: name });
  }

  // ── Assertions ──

  async expectProductVisible(productName: string): Promise<void> {
    await this.allureStep(`Verify "${productName}" is visible`, async () => {
      await expect(this.page.locator('.inventory_item_name').filter({ hasText: productName })).toBeVisible();
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

  async expectAddButtonState(productName: string, state: 'add' | 'remove'): Promise<void> {
    const dataTest = state === 'add'
      ? `add-to-cart-${this.slugify(productName)}`
      : `remove-${this.slugify(productName)}`;
    await this.allureStep(`Verify "${productName}" button is "${state}"`, async () => {
      await expect(this.page.locator(`[data-test="${dataTest}"]`)).toBeVisible();
    });
  }

  async expectPageTitle(expected: string): Promise<void> {
    await this.allureStep(`Verify page title is "${expected}"`, async () => {
      await expect(this.pageTitle).toHaveText(expected);
    });
  }

  async expectBurgerMenuVisible(): Promise<void> {
    await this.allureStep('Verify burger menu is visible', async () => {
      await expect(this.burgerMenu).toBeVisible();
    });
  }

  async expectCartIconVisible(): Promise<void> {
    await this.allureStep('Verify cart icon is visible', async () => {
      await expect(this.cartIcon).toBeVisible();
    });
  }

  async expectSortOrder(expected: string[]): Promise<void> {
    await this.allureStep(`Verify sort order matches expected`, async () => {
      const actual = await this.getAllProductNames();
      expect(actual).toEqual(expected);
    });
  }
}
