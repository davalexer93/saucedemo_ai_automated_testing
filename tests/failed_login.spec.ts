import { test, expect } from '@playwright/test';
import { LoginPage } from './page_objects/LoginPage';

const LOCKED_OUT_USER = 'locked_out_user';
const PASSWORD = 'secret_sauce';
const EXPECTED_ERROR = 'Epic sadface: Sorry, this user has been locked out.';

test.describe('TC-02: Login con usuario bloqueado', () => {
  test('el sistema no permite el acceso y muestra el mensaje de error para locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(LOCKED_OUT_USER, PASSWORD);

    expect(await loginPage.getErrorMessage()).toBe(EXPECTED_ERROR);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
