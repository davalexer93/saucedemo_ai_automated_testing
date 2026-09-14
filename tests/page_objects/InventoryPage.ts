import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly inventoryItems: Locator;
  // Elemento de la siguiente pantalla (CartPage) usado para validar que se navegó al carrito
  readonly cartPageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Products', { exact: true });
    this.sortDropdown = page.getByRole('combobox');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartPageTitle = page.getByText('Your Cart', { exact: true });
  }

  private getItemByName(productName: string): Locator {
    return this.inventoryItems.filter({ hasText: productName });
  }

  async addProductToCart(productName: string) {
    await this.getItemByName(productName)
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async removeProductFromCart(productName: string) {
    await this.getItemByName(productName)
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async getProductPrice(productName: string): Promise<string | null> {
    return this.getItemByName(productName)
      .locator('.inventory_item_price')
      .textContent();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async isCartPageDisplayed(): Promise<boolean> {
    await this.cartPageTitle.waitFor({ state: 'visible' });
    return this.cartPageTitle.isVisible();
  }

  async getCartItemCount(): Promise<number> {
    if (await this.shoppingCartBadge.count() === 0) {
      return 0;
    }
    return Number(await this.shoppingCartBadge.textContent());
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }
}
