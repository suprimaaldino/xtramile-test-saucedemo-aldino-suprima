import { test } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function allureStep(stepName: string, action: () => Promise<void>): Promise<void> {
  await allure.step(stepName, action);
}

export async function attachScreenshot(page: import('@playwright/test').Page, name: string): Promise<void> {
  const screenshot = await page.screenshot({ fullPage: true });
  await allure.attachment(name, screenshot, 'image/png');
}

export function setTestMetadata(options: {
  epic?: string;
  feature?: string;
  story?: string;
  severity?: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';
  owner?: string;
  tag?: string[];
}) {
  if (options.epic) allure.epic(options.epic);
  if (options.feature) allure.feature(options.feature);
  if (options.story) allure.story(options.story);
  if (options.severity) allure.severity(options.severity);
  if (options.owner) allure.owner(options.owner);
  if (options.tag) allure.tag(...options.tag);
}
