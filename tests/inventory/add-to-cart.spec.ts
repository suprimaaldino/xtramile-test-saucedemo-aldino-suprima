import { test, expect } from '../../src/fixtures/test-fixtures';
import { env } from '../../src/helpers/env';
import products from '../../test-data/products.json';

test.describe('Add to Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigateTo('/inventory.html');
    await inventoryPage.expectInventoryLoaded();
  });

  test('TC-19: should add single item to cart and badge shows 1', async ({ inventoryPage }) => {
    // Arrange
    const product = products[0];

    // Act
    await inventoryPage.addProductToCart(product.name);

    // Assert
    await inventoryPage.expectCartBadgeCount(1);
  });

  test('should add multiple items and badge increments correctly', async ({ inventoryPage }) => {
    // Arrange
    const itemsToAdd = products.slice(0, 3);

    // Act
    for (const product of itemsToAdd) {
      await inventoryPage.addProductToCart(product.name);
    }

    // Assert
    await inventoryPage.expectCartBadgeCount(itemsToAdd.length);
  });

  test('should change button from "Add" to "Remove" after adding', async ({ inventoryPage }) => {
    // Arrange
    const product = products[0];

    // Act
    await inventoryPage.addProductToCart(product.name);

    // Assert
    await inventoryPage.expectAddButtonState(product.name, 'remove');
  });

  test('TC-20: should display all 6 products with no pagination', async ({ inventoryPage }) => {
    // Assert
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('TC-17: should add item to cart from product detail page', async ({ inventoryPage }) => {
    // Arrange
    const product = products[0];

    // Act — open product detail
    await inventoryPage.openProductDetail(product.name);

    // Assert — on detail page
    await expect(inventoryPage.getPage()).toHaveURL(/.*inventory-item\.html/);

    // Act — add to cart from detail page (use page button directly)
    const addButton = inventoryPage.getPage().locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await addButton.click();

    // Assert — badge shows 1
    await inventoryPage.expectCartBadgeCount(1);
  });

  test('TC-18: should add item to cart from detail page as problem_user', async ({ page }) => {
    // Arrange — login as problem_user
    await page.goto('/');
    await page.locator('#user-name').fill(env.problemUser.username);
    await page.locator('#password').fill(env.problemUser.password);
    await page.locator('#login-button').click();
    await page.waitForURL('**/inventory.html');

    // Act — open product detail
    const product = products[0];
    const link = page.locator('.inventory_item_name').filter({ hasText: product.name });
    await link.click();
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    // Act — add to cart from detail page
    const addButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await addButton.click();

    // Assert — badge shows 1
    const badge = page.locator('.shopping_cart_badge');
    await expect(badge).toHaveText('1');
  });
});
