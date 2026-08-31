import { test, expect } from '../../src/fixtures/test-fixtures';
import customers from '../../test-data/checkout-customers.json';
import products from '../../test-data/products.json';

for (const customer of customers) {
  const isEdgeCase = customer.description?.includes('EDGE CASE');

  test(`Checkout as ${customer.firstName} ${customer.lastName}`, async ({
    inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage,
  }) => {
    // Allure metadata
    test.info().annotations.push(
      { type: 'epic', description: 'Checkout' },
      { type: 'feature', description: 'Data-Driven Checkout' },
      { type: 'story', description: customer.description },
    );

    // Arrange — add item
    await inventoryPage.navigateTo('/inventory.html');
    await inventoryPage.expectInventoryLoaded();
    await inventoryPage.addProductToCart(products[0].name);

    // Act — go to cart
    await inventoryPage.navigateToCart();
    await cartPage.clickCheckout();

    // Act — fill form
    await checkoutStepOnePage.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await checkoutStepOnePage.clickContinue();

    // Act — review and finish
    await checkoutStepTwoPage.expectOrderSummaryVisible();
    await checkoutStepTwoPage.clickFinish();

    // Assert — confirmation
    await checkoutCompletePage.expectConfirmationVisible();
  });
}
