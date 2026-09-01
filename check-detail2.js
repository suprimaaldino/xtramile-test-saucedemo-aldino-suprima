const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('problem_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForURL('**/inventory.html');
  // Click first product
  await page.locator('.inventory_item_name').first().click();
  await page.waitForURL(/.*inventory-item\.html/);

  // Click add to cart
  await page.locator('[data-test="add-to-cart"]').click();
  await page.waitForTimeout(2000);

  // Check what's on page now
  const buttons = await page.locator('button').allTextContents();
  console.log('Buttons after add:', buttons);

  const dataTests = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-test]')).map(el => ({
      attr: el.getAttribute('data-test'),
      tag: el.tagName,
      text: el.textContent.trim().substring(0, 50)
    }));
  });
  console.log('data-test attrs after add:', JSON.stringify(dataTests, null, 2));

  await browser.close();
})();
