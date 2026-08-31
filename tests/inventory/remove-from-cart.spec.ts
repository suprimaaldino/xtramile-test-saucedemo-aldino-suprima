import { test, expect } from '../../src/fixtures/test-fixtures';
import products from '../../test-data/products.json';

test.describe('Remove from Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigateTo('/inventory.html');
  });

  test('should remove item from cart and badge disappears', async ({ inventoryPage, cartPage }) => {
    // Arrange — add item first
    const product = products[0];
    await inventoryPage.addProductToCart(product.name);
    await inventoryPage.expectCartBadgeCount(1);

    // Act — go to cart and remove
    await inventoryPage.navigateToCart();
    await cartPage.removeProduct(product.name);

    // Assert
    await cartPage.expectCartEmpty();
  });

  test('should remove one item, keep others in cart', async ({ inventoryPage, cartPage }) => {
    // Arrange — add 2 items
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.addProductToCart(products[1].name);
    await inventoryPage.expectCartBadgeCount(2);

    // Act — go to cart, remove first item
    await inventoryPage.navigateToCart();
    await cartPage.removeProduct(products[0].name);

    // Assert — 1 item remains
    await cartPage.expectCartItemCount(1);
    await cartPage.expectCartItemVisible(products[1].name);
  });
});
