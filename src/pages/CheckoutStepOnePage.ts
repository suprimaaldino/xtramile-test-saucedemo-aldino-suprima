import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepOnePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──
  private readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  private readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  private readonly zipCodeInput = this.page.locator('[data-test="postalCode"]');
  private readonly continueButton = this.page.locator('[data-test="continue"]');
  private readonly cancelButton = this.page.locator('[data-test="cancel"]');
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  // ── Actions ──

  async fillForm(firstName: string, lastName: string, zipCode: string): Promise<void> {
    await this.allureStep(`Fill checkout form: ${firstName} ${lastName}, ${zipCode}`, async () => {
      await this.firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
      await this.zipCodeInput.fill(zipCode);
    });
  }

  async clickContinue(): Promise<void> {
    await this.allureStep('Click continue', async () => {
      await this.continueButton.click();
    });
  }

  async clickCancel(): Promise<void> {
    await this.allureStep('Click cancel', async () => {
      await this.cancelButton.click();
    });
  }

  // ── Assertions ──

  async expectFormVisible(): Promise<void> {
    await this.allureStep('Verify checkout form is visible', async () => {
      await expect(this.firstNameInput).toBeVisible();
      await expect(this.lastNameInput).toBeVisible();
      await expect(this.zipCodeInput).toBeVisible();
    });
  }

  async expectErrorMessage(expected: string): Promise<void> {
    await this.allureStep(`Verify error message: "${expected}"`, async () => {
      await expect(this.errorMessage).toContainText(expected);
    });
  }
}
