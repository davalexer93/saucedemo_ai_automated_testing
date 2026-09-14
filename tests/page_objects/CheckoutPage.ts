import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Step One: Your Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step Two: Overview
  readonly finishButton: Locator;
  readonly totalLabel: Locator;
  // Elemento de la siguiente pantalla (Overview) usado para validar el paso 1 -> 2
  readonly overviewTitle: Locator;

  // Step Three: Complete
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.errorMessage = page.locator('[data-test="error"]');

    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.overviewTitle = page.getByText('Checkout: Overview', { exact: true });

    this.completeHeader = page.getByText('Thank you for your order!');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async isOverviewDisplayed(): Promise<boolean> {
    await this.overviewTitle.waitFor({ state: 'visible' });
    return this.overviewTitle.isVisible();
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async getTotal(): Promise<string | null> {
    return this.totalLabel.textContent();
  }

  async getTotalAmount(): Promise<number> {
    const text = await this.totalLabel.textContent();
    return Number(text?.replace(/[^0-9.]/g, ''));
  }

  async isOrderComplete(): Promise<boolean> {
    await this.completeHeader.waitFor({ state: 'visible' });
    return this.completeHeader.isVisible();
  }
}
