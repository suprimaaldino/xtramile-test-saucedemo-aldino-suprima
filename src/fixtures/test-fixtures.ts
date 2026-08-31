import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Header } from '../pages/components/Header';

type SauceDemoFixtures = {
  loginPage: LoginPage;
  header: Header;
};

export const test = base.extend<SauceDemoFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
});

export { expect } from '@playwright/test';
