import { test, expect } from '../../src/fixtures/test-fixtures';
import products from '../../test-data/products.json';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigateTo('/inventory.html');
    await inventoryPage.expectInventoryLoaded();
  });

  test('TC-09: should complete full checkout flow with pricing verification', async ({
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

    // Assert — verify pricing (subtotal, tax, total)
    const subtotal = await checkoutStepTwoPage.getSubtotal();
    const tax = await checkoutStepTwoPage.getTax();
    const total = await checkoutStepTwoPage.getTotalPrice();
    expect(subtotal).toBe(product.price);
    expect(tax).toBeTruthy();
    expect(total).toBeTruthy();

    // Act — finish
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

  test('TC-11: should cancel checkout on step two and return to inventory with cart intact', async ({
    inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, page,
  }) => {
    // Arrange — add item and proceed to step two
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.navigateToCart();
    await cartPage.clickCheckout();
    await checkoutStepOnePage.fillForm('John', 'Doe', '10001');
    await checkoutStepOnePage.clickContinue();

    // Act — cancel on step two (Overview)
    await checkoutStepTwoPage.clickCancel();

    // Assert — back on inventory, cart still has 1 item
    await expect(page).toHaveURL(/.*inventory\.html/);
    await inventoryPage.expectCartBadgeCount(1);
  });

  test('TC-10: should show error when submitting empty form', async ({
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

  test('TC-16: should handle invalid characters in checkout fields', async ({
    inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, page,
  }) => {
    // Arrange
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.navigateToCart();
    await cartPage.clickCheckout();

    // Act — fill with invalid characters
    await checkoutStepOnePage.fillForm('123!@#', '$$Doe', 'ABCDE');
    await checkoutStepOnePage.clickContinue();

    // Assert — either rejected with error OR accepted (observation/gap)
    const isOnStepOne = await page.url().includes('checkout-step-one');
    const isOnStepTwo = await page.url().includes('checkout-step-two');

    if (isOnStepOne) {
      // App rejected invalid input — expected behavior
      await checkoutStepOnePage.expectErrorMessage('');
    } else if (isOnStepTwo) {
      // App accepted invalid input — log as observation/gap
      console.log('OBSERVATION: SauceDemo accepted invalid characters in checkout fields');
    }
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
