import { expect } from '@playwright/test';
import { test } from './fixture';
import { LoginPage } from './page_objects/LoginPage';
import { InventoryPage } from './page_objects/InventoryPage';
import { CartPage } from './page_objects/CartPage';
import { CheckoutPage } from './page_objects/CheckoutPage';

const STANDARD_USER = 'standard_user';
const STANDARD_PASSWORD = 'secret_sauce';
const PRODUCT_NAME = 'Sauce Labs Bike Light';

test.describe('TC-03: Checkout completado sin items por valor cero', () => {
  test('el usuario agrega y elimina un producto del carrito y completa el checkout con total $0.00', async ({ page, fixtures }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.login(STANDARD_USER, STANDARD_PASSWORD);
    expect(await loginPage.isLoginSuccessful()).toBe(true);

    await inventoryPage.addProductToCart(PRODUCT_NAME);
    expect(await inventoryPage.getCartItemCount()).toBe(1);

    await inventoryPage.goToCart();
    expect(await inventoryPage.isCartPageDisplayed()).toBe(true);
    expect(await cartPage.getItemCount()).toBe(1);

    await cartPage.removeItem(PRODUCT_NAME);
    expect(await cartPage.isEmpty()).toBe(true);

    await cartPage.goToCheckout();
    expect(await cartPage.isCheckoutPageDisplayed()).toBe(true);

    await checkoutPage.fillCheckoutInfo('David Alexander', 'Rubio', '111631');
    await checkoutPage.continueToOverview();
    expect(await checkoutPage.isOverviewDisplayed()).toBe(true);
    expect(await checkoutPage.getTotal()).toBe('Total: $0.00');

    await checkoutPage.finishCheckout();
    expect(await checkoutPage.isOrderComplete()).toBe(true);
  });
});
