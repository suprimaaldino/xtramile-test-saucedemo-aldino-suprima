import { test, expect } from '../../src/fixtures/test-fixtures';
import products from '../../test-data/products.json';

test.describe('Sort Products', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigateTo('/inventory.html');
    await inventoryPage.expectInventoryLoaded();
  });

  test('TC-05: should sort products by Price (low to high)', async ({ inventoryPage }) => {
    // Act
    await inventoryPage.sortBy('lohi');

    // Assert — prices should be in ascending order
    const prices = await inventoryPage.getProductPrices();
    const numericPrices = prices.map((p) => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sorted);

    // Verify cheapest first, most expensive last
    expect(numericPrices[0]).toBe(7.99);   // Sauce Labs Onesie
    expect(numericPrices[numericPrices.length - 1]).toBe(49.99); // Sauce Labs Fleece Jacket
  });

  test('TC-06: should sort products by Name (Z to A)', async ({ inventoryPage }) => {
    // Act
    await inventoryPage.sortBy('za');

    // Assert — names should be in reverse alphabetical order
    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);

    // Verify first and last items
    expect(names[0]).toBe('Test.allTheThings() T-Shirt (Red)');
    expect(names[names.length - 1]).toBe('Sauce Labs Backpack');
  });
});
