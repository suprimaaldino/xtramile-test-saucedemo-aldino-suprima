import { test, expect } from '../../src/fixtures/test-fixtures';
import products from '../../test-data/products.json';

test.describe('Cart Validation', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigateTo('/inventory.html');
    await inventoryPage.expectInventoryLoaded();
  });

  test('should show correct items in cart after adding', async ({ inventoryPage, cartPage }) => {
    // Arrange — add specific items
    const itemsToAdd = [products[0], products[2]];
    for (const item of itemsToAdd) {
      await inventoryPage.addProductToCart(item.name);
    }

    // Act — go to cart
    await inventoryPage.navigateToCart();

    // Assert — cart shows correct items with prices and quantity
    await cartPage.expectCartItemCount(itemsToAdd.length);
    for (const item of itemsToAdd) {
      await cartPage.expectCartItemDetail(item.name, item.price);
    }
  });

  test('should continue shopping and return to inventory', async ({ inventoryPage, cartPage, page }) => {
    // Arrange — add item and go to cart
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.navigateToCart();

    // Act — click continue shopping
    await cartPage.clickContinueShopping();

    // Assert — back on inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});
