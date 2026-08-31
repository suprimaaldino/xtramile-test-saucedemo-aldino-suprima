import { test, expect } from '../../src/fixtures/test-fixtures';
import products from '../../test-data/products.json';

test.describe('Add to Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigateTo('/inventory.html');
    await inventoryPage.expectInventoryLoaded();
  });

  test('should add single item to cart and show badge', async ({ inventoryPage }) => {
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

  test('should show all 6 products on inventory page', async ({ inventoryPage }) => {
    // Assert
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });
});
