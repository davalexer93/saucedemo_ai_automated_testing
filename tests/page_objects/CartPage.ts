import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  // Elemento de la siguiente pantalla (CheckoutPage) usado para validar que se navegó al checkout
  readonly checkoutInfoTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutInfoTitle = page.getByText('Checkout: Your Information', { exact: true });
  }

  private getItemByName(productName: string): Locator {
    return this.cartItems.filter({ hasText: productName });
  }

  async removeItem(productName: string) {
    const item = this.getItemByName(productName);
    await item.getByRole('button', { name: 'Remove' }).click();
    await item.waitFor({ state: 'detached' });
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async isEmpty(): Promise<boolean> {
    return (await this.getItemCount()) === 0;
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  async isCheckoutPageDisplayed(): Promise<boolean> {
    await this.checkoutInfoTitle.waitFor({ state: 'visible' });
    return this.checkoutInfoTitle.isVisible();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
