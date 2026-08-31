import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export class BasePage {
  constructor(protected readonly page: Page) {}

  /** Wrap any action in an Allure step for reporting */
  protected async allureStep(stepName: string, action: () => Promise<void>): Promise<void> {
    await allure.step(stepName, action);
  }

  /** Convert a product name to SauceDemo's data-test slug format */
  protected slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /** Navigate to a specific path relative to baseURL */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /** Public access to page for assertions outside POM */
  getPage(): Page {
    return this.page;
  }

  /** Get current page URL */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
