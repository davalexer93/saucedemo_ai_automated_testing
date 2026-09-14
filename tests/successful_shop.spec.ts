import { expect } from '@playwright/test';
import { test } from './fixture';
import { LoginPage } from './page_objects/LoginPage';
import { InventoryPage } from './page_objects/InventoryPage';
import { CartPage } from './page_objects/CartPage';
import { CheckoutPage } from './page_objects/CheckoutPage';

const STANDARD_USER = 'standard_user';
const STANDARD_PASSWORD = 'secret_sauce';
const PRODUCT_NAME = 'Sauce Labs Bike Light';

test.describe('TC-01: Happy Path - Compra exitosa E2E', () => {
  test('el usuario inicia sesión, agrega un producto, completa el checkout y ve la confirmación de compra', async ({ page, fixtures }) => {
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

    await cartPage.goToCheckout();
    expect(await cartPage.isCheckoutPageDisplayed()).toBe(true);

    await checkoutPage.fillCheckoutInfo('David Alexander', 'Rubio', '111631');
    await checkoutPage.continueToOverview();
    expect(await checkoutPage.isOverviewDisplayed()).toBe(true);
    expect(await checkoutPage.getTotalAmount()).toBeGreaterThan(0);

    await checkoutPage.finishCheckout();
    expect(await checkoutPage.isOrderComplete()).toBe(true);
  });
});
