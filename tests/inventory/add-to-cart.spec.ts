import { test, expect } from '../../src/fixtures/test-fixtures';
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

    // Act — add to cart from detail page (detail page uses data-test="add-to-cart" without product name)
    const addButton = inventoryPage.getPage().locator('[data-test="add-to-cart"]');
    await addButton.click();

    // Assert — badge shows 1
    await inventoryPage.expectCartBadgeCount(1);
  });
});
