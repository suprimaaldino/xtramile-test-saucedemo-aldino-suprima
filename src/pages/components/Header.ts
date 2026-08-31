import { Page, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class Header extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──
  private readonly burgerMenu = this.page.locator('#react-burger-menu-btn');
  private readonly logoutLink = this.page.locator('[data-test="logout-sidebar-link"]');
  private readonly menuOverlay = this.page.locator('.bm-menu');
  private readonly closeMenu = this.page.locator('[data-test="close-menu"]');
  private readonly cartLink = this.page.locator('[data-test="shopping-cart-link"]');

  // ── Actions ──

  async openMenu(): Promise<void> {
    await this.allureStep('Open burger menu', async () => {
      await this.burgerMenu.click();
      await expect(this.menuOverlay).toBeVisible();
    });
  }

  async clickLogout(): Promise<void> {
    await this.allureStep('Click logout', async () => {
      await this.logoutLink.click();
    });
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.clickLogout();
  }

  async clickCart(): Promise<void> {
    await this.allureStep('Click cart icon', async () => {
      await this.cartLink.click();
    });
  }

  async closeMenuOverlay(): Promise<void> {
    await this.allureStep('Close menu', async () => {
      await this.closeMenu.click();
    });
  }

  // ── Assertions ──

  async expectLoggedIn(): Promise<void> {
    await this.allureStep('Verify user is logged in (cart icon visible)', async () => {
      await expect(this.cartLink).toBeVisible();
    });
  }
}
