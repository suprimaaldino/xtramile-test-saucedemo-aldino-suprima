import { Page, Locator, expect } from '@playwright/test';
import * as allure from 'allure-playwright';

/**
 * Assert element text matches expected, wrapped in Allure step.
 */
export async function assertText(locator: Locator, expected: string, stepName?: string): Promise<void> {
  await allure.step(stepName ?? `Verify text is "${expected}"`, async () => {
    await expect(locator).toHaveText(expected);
  });
}

/**
 * Assert element contains expected substring, wrapped in Allure step.
 */
export async function assertContainsText(locator: Locator, expected: string, stepName?: string): Promise<void> {
  await allure.step(stepName ?? `Verify contains "${expected}"`, async () => {
    await expect(locator).toContainText(expected);
  });
}

/**
 * Assert element is visible, wrapped in Allure step.
 */
export async function assertVisible(locator: Locator, stepName?: string): Promise<void> {
  await allure.step(stepName ?? 'Verify element is visible', async () => {
    await expect(locator).toBeVisible();
  });
}

/**
 * Assert element is not visible, wrapped in Allure step.
 */
export async function assertHidden(locator: Locator, stepName?: string): Promise<void> {
  await allure.step(stepName ?? 'Verify element is hidden', async () => {
    await expect(locator).not.toBeVisible();
  });
}

/**
 * Assert page URL matches pattern, wrapped in Allure step.
 */
export async function assertUrl(page: Page, pattern: RegExp, stepName?: string): Promise<void> {
  await allure.step(stepName ?? `Verify URL matches ${pattern}`, async () => {
    await expect(page).toHaveURL(pattern);
  });
}

/**
 * Assert array of elements have exact count, wrapped in Allure step.
 */
export async function assertCount(locator: Locator, expected: number, stepName?: string): Promise<void> {
  await allure.step(stepName ?? `Verify count is ${expected}`, async () => {
    await expect(locator).toHaveCount(expected);
  });
}

/**
 * Attach a screenshot to Allure report manually.
 */
export async function attachScreenshot(page: Page, name: string): Promise<void> {
  const screenshot = await page.screenshot({ fullPage: true });
  await allure.attachment(name, screenshot, 'image/png');
}
