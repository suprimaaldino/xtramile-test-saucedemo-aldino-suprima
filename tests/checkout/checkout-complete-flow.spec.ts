import { test, expect } from '../../src/fixtures/test-fixtures';
import products from '../../test-data/products.json';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigateTo('/inventory.html');
    await inventoryPage.expectInventoryLoaded();
  });

  test('should complete full checkout flow with single item', async ({
    inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage, page,
  }) => {
    // Arrange — add item
    const product = products[0];
    await inventoryPage.addProductToCart(product.name);

    // Act — go to cart
    await inventoryPage.navigateToCart();
    await cartPage.expectCartItemVisible(product.name);

    // Act — checkout step one
    await cartPage.clickCheckout();
    await checkoutStepOnePage.expectFormVisible();
    await checkoutStepOnePage.fillForm('John', 'Doe', '10001');
    await checkoutStepOnePage.clickContinue();

    // Act — checkout step two
    await checkoutStepTwoPage.expectOrderSummaryVisible();
    await checkoutStepTwoPage.expectItemCount(1);
    await checkoutStepTwoPage.clickFinish();

    // Assert — confirmation
    await checkoutCompletePage.expectConfirmationVisible();
    await expect(page).toHaveURL(/.*checkout-complete/);
  });

  test('should complete checkout with multiple items', async ({
    inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage,
  }) => {
    // Arrange — add 2 items
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.addProductToCart(products[1].name);

    // Act — go to cart
    await inventoryPage.navigateToCart();
    await cartPage.expectCartItemCount(2);

    // Act — checkout
    await cartPage.clickCheckout();
    await checkoutStepOnePage.fillForm('Jane', 'Smith', '90210');
    await checkoutStepOnePage.clickContinue();

    // Assert — step two shows 2 items
    await checkoutStepTwoPage.expectItemCount(2);
    await checkoutStepTwoPage.clickFinish();

    // Assert — confirmation
    await checkoutCompletePage.expectConfirmationVisible();
  });

  test('should cancel checkout and return to inventory', async ({
    inventoryPage, cartPage, checkoutStepOnePage, page,
  }) => {
    // Arrange
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.navigateToCart();
    await cartPage.clickCheckout();

    // Act — cancel on step one
    await checkoutStepOnePage.clickCancel();

    // Assert — back on cart
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('should show error when submitting empty form', async ({
    inventoryPage, cartPage, checkoutStepOnePage,
  }) => {
    // Arrange
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.navigateToCart();
    await cartPage.clickCheckout();

    // Act — click continue without filling form
    await checkoutStepOnePage.clickContinue();

    // Assert — error message
    await checkoutStepOnePage.expectErrorMessage('First Name is required');
  });

  test('should go back home from confirmation page', async ({
    inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage, page,
  }) => {
    // Arrange — complete checkout
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.navigateToCart();
    await cartPage.clickCheckout();
    await checkoutStepOnePage.fillForm('John', 'Doe', '10001');
    await checkoutStepOnePage.clickContinue();
    await checkoutStepTwoPage.clickFinish();

    // Act — click back home
    await checkoutCompletePage.expectConfirmationVisible();
    await checkoutCompletePage.clickBackHome();

    // Assert — back on inventory
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});
