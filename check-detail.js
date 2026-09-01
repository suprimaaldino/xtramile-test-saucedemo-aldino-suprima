const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForURL('**/inventory.html');
  // Click first product
  await page.locator('.inventory_item_name').first().click();
  await page.waitForURL(/.*inventory-item\.html/);
  // Get all buttons
  const buttons = await page.locator('button').allTextContents();
  console.log('Buttons:', buttons);
  // Get data-test attributes
  const dataTests = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-test]')).map(el => el.getAttribute('data-test'));
  });
  console.log('data-test attrs:', dataTests);
  await browser.close();
})();
