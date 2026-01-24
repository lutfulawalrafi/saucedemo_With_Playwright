import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
 
  const usernameField = page.locator('[data-test="username"]');

  const passwordField = page.locator('[data-test="password"]');
  const loginButton = page.locator('[data-test="login-button"]');
 
  const inventory_pageTitle = page.locator('[data-test="primary-header"]');
  const addToCart = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
 
  const cart = page.locator('[data-test="shopping-cart-link"]');
  const cart_pageTitle = page.locator('[data-test="title"]');
  const quantity = page.locator('[data-test="item-quantity"]');
  const product = page.locator('[data-test="item-1-title-link"]');
 
  await usernameField.click();
  await usernameField.fill('standard_user');

  await passwordField.click();
  await passwordField.fill('secret_sauce');

  await loginButton.click();
 
  await expect(inventory_pageTitle).toContainText('Swag Labs');
 
  await addToCart.click();
  await cart.click();

  await expect(cart_pageTitle).toContainText('Your Cart');
  await expect(quantity).toContainText('1');
  await expect(product).toContainText('Sauce Labs Bolt T-Shirt');

});